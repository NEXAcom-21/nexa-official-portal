import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  authPromptReason: string | null;
  openAuthModal: (mode?: 'login' | 'register' | 'forgot', reason?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('nexa_auth_token') || sessionStorage.getItem('nexa_auth_token');
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authPromptReason, setAuthPromptReason] = useState<string | null>(null);

  // Validate existing token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('nexa_auth_token') || sessionStorage.getItem('nexa_auth_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            setToken(storedToken);
          } else {
            // Invalid session
            localStorage.removeItem('nexa_auth_token');
            sessionStorage.removeItem('nexa_auth_token');
            setToken(null);
            setUser(null);
          }
        } else {
          localStorage.removeItem('nexa_auth_token');
          sessionStorage.removeItem('nexa_auth_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error verifying token:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed.' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('nexa_auth_token', data.token);

      // If user is admin, also sync admin token so Admin Console works seamlessly
      if (data.user?.role === 'admin') {
        localStorage.setItem('nexa_admin_token', data.token);
        sessionStorage.setItem('nexa_admin_token', data.token);
      }

      setIsAuthModalOpen(false);
      setAuthPromptReason(null);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred during login.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('nexa_auth_token', data.token);
      if (data.user?.role === 'admin') {
        localStorage.setItem('nexa_admin_token', data.token);
        sessionStorage.setItem('nexa_admin_token', data.token);
      }

      setIsAuthModalOpen(false);
      setAuthPromptReason(null);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred during registration.' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // ignore logout error
      }
    }
    localStorage.removeItem('nexa_auth_token');
    sessionStorage.removeItem('nexa_auth_token');
    localStorage.removeItem('nexa_admin_token');
    sessionStorage.removeItem('nexa_admin_token');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login', reason?: string) => {
    setAuthModalMode(mode);
    setAuthPromptReason(reason || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthPromptReason(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalMode,
        authPromptReason,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
