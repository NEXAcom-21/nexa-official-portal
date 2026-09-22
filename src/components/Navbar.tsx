import React, { useState } from 'react';
import {
  Smartphone,
  Menu,
  X,
  Download,
  ShieldAlert,
  Sparkles,
  Layers,
  HelpCircle,
  Briefcase,
  Mail,
  History,
  Lock,
  ExternalLink,
  Bot,
  LogIn,
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';
import { NexaConfig } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  config: NexaConfig | null;
  onOpenAiChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  config,
  onOpenAiChat
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, openAuthModal } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'download', label: 'Download' },
    { id: 'features', label: 'Features' },
    { id: 'tools', label: 'Tools' },
    { id: 'screenshots', label: 'Screenshots' },
    { id: 'updates', label: 'Updates' },
    { id: 'help', label: 'Help Center' },
    { id: 'ai-help', label: 'AI Help' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="nexa-primary-navbar"
      className="sticky top-0 z-50 w-full bg-[#030712]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Identity */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all">
              <span className="font-extrabold text-lg text-cyan-400 font-mono tracking-tighter">
                NX
              </span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse border border-[#030712]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  NEXA
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  NEXA.COM.IN 21
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Official Product & Ecosystem Portal
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            {onOpenAiChat && (
              <button
                id="nav-ask-ai-btn"
                onClick={onOpenAiChat}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open NEXA AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ask AI</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-cyan-500/30 rounded-xl px-2.5 py-1">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xs font-bold font-mono">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="max-w-[120px] truncate text-xs font-medium text-white">
                  {user.name || user.email.split('@')[0]}
                </div>
                {user.role === 'admin' && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                    Admin
                  </span>
                )}
                <button
                  id="nav-logout-btn"
                  onClick={logout}
                  title="Sign Out"
                  className="ml-1 p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="nav-signin-btn"
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </button>
            )}

            <button
              id="nav-admin-btn"
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="Admin Console"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden xl:inline">Admin</span>
            </button>

            <button
              id="nav-download-cta"
              onClick={() => handleNav('download')}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Get NEXA {config?.appLatestVersion || 'v2.5'}</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 xl:hidden">
            {onOpenAiChat && (
              <button
                id="mobile-ai-icon"
                onClick={onOpenAiChat}
                className="p-2 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/40"
                aria-label="Ask NEXA AI"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}

            <button
              id="mobile-download-icon"
              onClick={() => handleNav('download')}
              className="p-2 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 sm:hidden"
              aria-label="Download App"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="xl:hidden border-b border-slate-800 bg-[#060c18] px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="grid grid-cols-2 gap-2 pt-1 pb-3">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xs font-bold font-mono">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {user.name || user.email.split('@')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {user.email} {user.role === 'admin' && '• Admin'}
                    </div>
                  </div>
                </div>
                <button
                  id="mobile-nav-logout"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-300 text-xs font-medium flex items-center gap-1 border border-slate-700"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                id="mobile-nav-signin"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 text-sm font-semibold cursor-pointer hover:bg-slate-800"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                Sign In to Official Account
              </button>
            )}

            {onOpenAiChat && (
              <button
                id="mobile-drawer-ai-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAiChat();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-sm font-semibold cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Ask NEXA AI
              </button>
            )}

            <button
              id="mobile-nav-download"
              onClick={() => handleNav('download')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              Download Official APK ({config?.appLatestVersion || 'v2.5'})
            </button>

            <button
              id="mobile-nav-admin"
              onClick={() => handleNav('admin')}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800/80 text-slate-300 text-xs hover:text-white border border-slate-700 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Admin Management Console
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
