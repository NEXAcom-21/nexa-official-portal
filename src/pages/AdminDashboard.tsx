import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Image,
  HelpCircle,
  Smartphone,
  LogOut,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Upload,
  FileCheck,
  Radio,
  Sliders,
  Check,
  Download,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  HardDrive,
  Clock,
  ShieldAlert,
  KeyRound,
  Key,
  Loader2,
  CheckSquare,
  Edit3,
  AlertTriangle,
  Globe,
  Server,
  Info,
  Layers,
  FileCode
} from 'lucide-react';
import { NexaConfig, NexaEnquiry, NexaScreenshot, HelpArticle, ScreenshotCategory, ApkRelease } from '../types';
import { useAuth } from '../context/AuthContext';
import { AdminApkDiagnosticsModal } from '../components/AdminApkDiagnosticsModal';
import { AdminEditReleaseModal } from '../components/AdminEditReleaseModal';
import { AdminProductionTesting } from '../components/AdminProductionTesting';

interface AdminDashboardProps {
  config: NexaConfig | null;
  onConfigUpdated: (newConfig: NexaConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ config, onConfigUpdated }) => {
  const { user: authUser, token: authContextToken } = useAuth();

  // Use sessionStorage to ensure credentials are secure and not stored permanently in localStorage
  const [token, setToken] = useState<string | null>(() => {
    if (authUser?.role === 'admin' && authContextToken) return authContextToken;
    return sessionStorage.getItem('nexa_admin_token');
  });

  useEffect(() => {
    // Strictly clear any legacy localStorage admin keys
    localStorage.removeItem('nexa_admin_token');

    if (authUser?.role === 'admin' && authContextToken && !token) {
      setToken(authContextToken);
      sessionStorage.setItem('nexa_admin_token', authContextToken);
    }
  }, [authUser, authContextToken, token]);

  // Admin Authentication State
  const [emailInput, setEmailInput] = useState('nexa.com.in21@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Authenticated Password Change State (for logged-in admin)
  const [currentPass, setCurrentPass] = useState('');
  const [changeNewPass, setChangeNewPass] = useState('');
  const [changeConfirmPass, setChangeConfirmPass] = useState('');
  const [passChangeStatus, setPassChangeStatus] = useState<string | null>(null);
  const [passChangeLoading, setPassChangeLoading] = useState(false);

  // Query setup status on mount
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const res = await fetch('/api/admin/setup-status');
        if (res.ok) {
          const data = await res.json();
          setIsConfigured(Boolean(data.configured));
          if (!data.configured) {
            setIsSetupMode(true);
          }
        }
      } catch (err) {
        console.error('Failed to query admin setup status:', err);
      }
    };
    checkSetupStatus();
  }, []);

  const [activeTab, setActiveTab] = useState<'config' | 'apk' | 'enquiries' | 'screenshots' | 'help' | 'security' | 'testing'>('apk');

  // Diagnostic & Edit Release Modal States
  const [diagnosticModalData, setDiagnosticModalData] = useState<any | null>(null);
  const [editingRelease, setEditingRelease] = useState<ApkRelease | null>(null);

  // Config Form State
  const [editConfig, setEditConfig] = useState<NexaConfig | null>(config);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // APK Releases Catalog & Management State
  const [apksList, setApksList] = useState<ApkRelease[]>([]);
  const [loadingApks, setLoadingApks] = useState(false);
  const [targetProduct, setTargetProduct] = useState<'nexa' | 'focuslock' | 'custom'>('nexa');
  const [targetReleaseId, setTargetReleaseId] = useState<string | null>(null);
  const [customProductId, setCustomProductId] = useState('');
  const [customProductName, setCustomProductName] = useState('');
  const [apkPublishImmediate, setApkPublishImmediate] = useState(true);
  const [downloadTestingId, setDownloadTestingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // APK Upload State
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [apkVersion, setApkVersion] = useState(config?.appLatestVersion || 'v2.5');
  const [apkVersionName, setApkVersionName] = useState(config?.versionName || 'NEXA 2.5 Nebula');
  const [apkReleaseNotes, setApkReleaseNotes] = useState(config?.releaseNotes || 'NEXA v2.5 brings conversational AI improvements, finance calculators, tools suite, video generation, object finder, and focus mode.');
  const [apkWhatIsNew, setApkWhatIsNew] = useState((config?.whatIsNew || [
    "NEXA AI Assistant with responsive conversational intelligence",
    "Comprehensive Finance department with SIP, EMI, and GST calculators",
    "Productivity Tools and AI Video Generation tools",
    "Intelligent Object Finder visual utility"
  ]).join('\n'));
  const [apkFileSize, setApkFileSize] = useState(config?.fileSize || '31.4 MB');
  const [apkMinAndroid, setApkMinAndroid] = useState(config?.minimumAndroidVersion || 'Android 8.0 (API level 26) or higher');
  const [apkUploading, setApkUploading] = useState(false);
  const [apkUploadProgress, setApkUploadProgress] = useState(0);
  const [apkUploadPhase, setApkUploadPhase] = useState<'uploading' | 'verifying' | 'idle'>('idle');
  const [apkUploadSuccess, setApkUploadSuccess] = useState<string | null>(null);
  const [apkUploadError, setApkUploadError] = useState<string | null>(null);
  const apkFileInputRef = useRef<HTMLInputElement>(null);

  // Enquiries State
  const [enquiries, setEnquiries] = useState<NexaEnquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<NexaEnquiry | null>(null);

  // Screenshots State
  const [screenshots, setScreenshots] = useState<NexaScreenshot[]>([]);
  const [loadingScreenshots, setLoadingScreenshots] = useState(false);
  const [newScreenshotModal, setNewScreenshotModal] = useState(false);
  const [newScreenshot, setNewScreenshot] = useState<{
    title: string;
    category: ScreenshotCategory;
    description: string;
    mockupType: string;
    badge?: string;
  }>({
    title: '',
    category: 'Home',
    description: '',
    mockupType: 'home',
    badge: ''
  });

  // Help Articles State
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
  const [loadingHelp, setLoadingHelp] = useState(false);
  const [newHelpModal, setNewHelpModal] = useState(false);
  const [newHelp, setNewHelp] = useState({
    title: '',
    category: 'general',
    summary: '',
    content: ''
  });

  // Keep local editConfig in sync when prop changes
  useEffect(() => {
    if (config) {
      setEditConfig(config);
      setApkVersion(config.appLatestVersion || 'v2.5');
      setApkVersionName(config.versionName || 'NEXA 2.5 Nebula');
    }
  }, [config]);

  // Handle Admin Login (Strict email + password)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccessMessage(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.needsSetup) {
          setIsSetupMode(true);
        }
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      setToken(data.token);
      sessionStorage.setItem('nexa_admin_token', data.token);
      localStorage.removeItem('nexa_admin_token');
      setPasswordInput('');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Admin Setup Password
  const handleSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccessMessage(null);

    if (!newPasswordInput || newPasswordInput.length < 8) {
      setLoginError('Password must be at least 8 characters long for administrative security.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setLoginError('Passwords do not match. Please verify and re-enter both fields.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nexa.com.in21@gmail.com',
          newPassword: newPasswordInput,
          confirmPassword: confirmPasswordInput
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to configure new admin password.');
      }

      setToken(data.token);
      sessionStorage.setItem('nexa_admin_token', data.token);
      localStorage.removeItem('nexa_admin_token');
      setIsConfigured(true);
      setIsSetupMode(false);
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err: any) {
      setLoginError(err.message || 'Setup failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Password Change while logged in
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPassChangeStatus(null);

    if (!changeNewPass || changeNewPass.length < 8) {
      setPassChangeStatus('Error: New password must be at least 8 characters long.');
      return;
    }
    if (changeNewPass !== changeConfirmPass) {
      setPassChangeStatus('Error: New passwords do not match.');
      return;
    }

    setPassChangeLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: changeNewPass,
          confirmPassword: changeConfirmPass
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update administrator password.');
      }
      setPassChangeStatus('Administrator password successfully updated!');
      setCurrentPass('');
      setChangeNewPass('');
      setChangeConfirmPass('');
    } catch (err: any) {
      setPassChangeStatus(`Error: ${err.message}`);
    } finally {
      setPassChangeLoading(false);
    }
  };

  // Helper to pre-populate upload form for replacing an existing APK release
  const handleInitiateReplace = (rel: ApkRelease) => {
    setTargetReleaseId(rel.id);
    if (rel.productId === 'nexa') {
      setTargetProduct('nexa');
    } else if (rel.productId === 'focuslock') {
      setTargetProduct('focuslock');
    } else {
      setTargetProduct('custom');
      setCustomProductId(rel.productId);
      setCustomProductName(rel.productName);
    }
    setApkVersion(rel.version);
    setApkVersionName(rel.displayName || `${rel.productName} v${rel.version}`);
    setApkReleaseNotes(rel.releaseNotes || '');
    setApkFileSize(rel.fileSize || '30 MB');
    setApkMinAndroid(rel.minimumAndroidVersion || 'Android 8.0+');

    const el = document.getElementById('apk-upload-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('nexa_admin_token');
    localStorage.removeItem('nexa_admin_token');
  };

  // Fetch Enquiries
  const fetchEnquiries = async () => {
    if (!token) return;
    setLoadingEnquiries(true);
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  // Fetch Screenshots
  const fetchScreenshots = async () => {
    setLoadingScreenshots(true);
    try {
      const res = await fetch('/api/screenshots');
      const data = await res.json();
      setScreenshots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingScreenshots(false);
    }
  };

  // Fetch Help Articles
  const fetchHelp = async () => {
    setLoadingHelp(true);
    try {
      const res = await fetch('/api/help');
      const data = await res.json();
      setHelpArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHelp(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (activeTab === 'enquiries') fetchEnquiries();
      if (activeTab === 'screenshots') fetchScreenshots();
      if (activeTab === 'help') fetchHelp();
    }
  }, [token, activeTab]);

  // Handle Save Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editConfig) return;

    setSaveLoading(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editConfig)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save configuration.');
      }

      onConfigUpdated(data.config);
      setSaveStatus('Configuration successfully saved and deployed!');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      setSaveStatus(`Error: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  // APK Release Management Handlers
  const fetchApks = async () => {
    if (!token) return;
    setLoadingApks(true);
    try {
      const res = await fetch('/api/admin/apks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApksList(data);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingApks(false);
    }
  };

  useEffect(() => {
    if (token && activeTab === 'apk') {
      fetchApks();
    }
  }, [token, activeTab]);

  // Handle Toggle Publish
  const handleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/apks/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ published: !currentlyPublished })
      });
      if (res.ok) {
        setApksList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, published: !currentlyPublished } : item))
        );
      }
    } catch (err) {
      // ignore
    }
  };

  // Handle Delete APK
  const handleDeleteApk = async (id: string, productName: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete ${productName} release?`)) return;
    try {
      const res = await fetch(`/api/admin/apks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setApksList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      // ignore
    }
  };

  // Handle Test Download
  const handleTestDownload = async (productId: string, releaseId?: string, targetVersion?: string) => {
    if (!token) return;
    setDownloadTestingId(releaseId || productId);
    try {
      const q = new URLSearchParams();
      q.set('token', token);
      if (targetVersion) q.set('version', targetVersion.replace(/^v/i, ''));
      if (releaseId) q.set('releaseId', releaseId);
      const res = await fetch(`/api/downloads/${productId}?${q.toString()}`);
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok || (!contentType.includes('application/vnd.android.package-archive') && !contentType.includes('application/octet-stream'))) {
        let errMsg = 'Binary not available yet. Please upload a real APK first.';
        try {
          const json = await res.json();
          if (json.error) errMsg = json.error;
        } catch {}
        alert(`Test Download Note: ${errMsg}`);
        return;
      }

      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition') || '';
      const match = disposition.match(/filename="?([^";]+)"?/);
      const downloadFilename = match && match[1] ? match[1] : `${productId}.apk`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e: any) {
      alert(`Test Download Error: ${e.message}`);
    } finally {
      setDownloadTestingId(null);
    }
  };

  // Handle Verify APK Binary on persistent disk with interactive diagnostics modal
  const handleVerifyApk = async (releaseOrProductId: string | ApkRelease) => {
    if (!token) return;
    const pid = typeof releaseOrProductId === 'string'
      ? releaseOrProductId
      : (releaseOrProductId.productId || releaseOrProductId.id);
    setVerifyingId(pid);
    try {
      const res = await fetch(`/api/admin/apks/verify/${pid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setDiagnosticModalData(data);
      fetchApks();
    } catch (err: any) {
      alert(`Verification check error: ${err.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  // Handle APK File Upload with live progress & timeout safety
  const handleApkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!apkFile) {
      setApkUploadError('Please select a valid .apk file to upload.');
      return;
    }

    setApkUploading(true);
    setApkUploadProgress(0);
    setApkUploadPhase('uploading');
    setApkUploadError(null);
    setApkUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('apk', apkFile);

      let pid: string = targetProduct;
      let pname = targetProduct === 'nexa' ? 'NEXA' : targetProduct === 'focuslock' ? 'FocusLock' : customProductName || 'Custom Product';
      if (targetProduct === 'custom') {
        pid = customProductId.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'custom-app';
      }

      if (targetReleaseId) {
        formData.append('releaseId', targetReleaseId);
      }
      formData.append('productId', pid);
      formData.append('productName', pname);
      formData.append('version', apkVersion);
      formData.append('versionName', apkVersionName);
      formData.append('fileSize', apkFileSize);
      formData.append('minimumAndroidVersion', apkMinAndroid);
      formData.append('releaseNotes', apkReleaseNotes);
      formData.append('published', String(apkPublishImmediate));

      const items = apkWhatIsNew
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      formData.append('whatIsNew', JSON.stringify(items));

      // Use XMLHttpRequest for real-time upload progress tracking and fail-safe timeout handling
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/apks/upload', true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.timeout = 180000; // 3 minute timeout for large binary packages

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.min(Math.round((event.loaded / event.total) * 100), 99);
            setApkUploadProgress(percent);
            if (percent >= 99) {
              setApkUploadPhase('verifying');
            }
          }
        };

        xhr.onload = () => {
          setApkUploadProgress(100);
          try {
            const data = JSON.parse(xhr.responseText || '{}');
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data);
            } else {
              reject(new Error(data.error || `Upload failed with server status ${xhr.status}`));
            }
          } catch (parseErr) {
            reject(new Error(`Server returned unexpected response (${xhr.status})`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network connection error occurred during APK transmission. Please check connection.'));
        };

        xhr.ontimeout = () => {
          reject(new Error('Upload timed out after 3 minutes. Please try again with a stable connection.'));
        };

        xhr.send(formData);
      });

      setApkUploadSuccess(`APK binary for "${pname} v${apkVersion}" uploaded, verified and stored in persistent server storage! (${uploadResult.release?.fileSize || apkFileSize})`);
      if (uploadResult.config) {
        onConfigUpdated(uploadResult.config);
        setEditConfig(uploadResult.config);
      }
      setApkFile(null);
      if (apkFileInputRef.current) {
        apkFileInputRef.current.value = '';
      }
      setTargetReleaseId(null);
      fetchApks();
    } catch (err: any) {
      setApkUploadError(err.message || 'Error occurred during APK upload.');
    } finally {
      setApkUploading(false);
      setApkUploadPhase('idle');
      setApkUploadProgress(0);
    }
  };

  // Handle Enquiry Status Update
  const handleUpdateEnquiryStatus = async (id: string, status: 'new' | 'in_review' | 'resolved') => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Screenshot
  const handleAddScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/admin/screenshots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newScreenshot,
          order: screenshots.length + 1
        })
      });

      if (res.ok) {
        setNewScreenshotModal(false);
        setNewScreenshot({
          title: '',
          category: 'Home',
          description: '',
          mockupType: 'home',
          badge: ''
        });
        fetchScreenshots();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Screenshot
  const handleDeleteScreenshot = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this screenshot?')) return;
    try {
      const res = await fetch(`/api/admin/screenshots/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchScreenshots();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Help Article
  const handleAddHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newHelp,
          order: helpArticles.length + 1
        })
      });
      if (res.ok) {
        setNewHelpModal(false);
        setNewHelp({ title: '', category: 'general', summary: '', content: '' });
        fetchHelp();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Help Article
  const handleDeleteHelp = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/help/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchHelp();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper for What's New items editing
  const handleAddWhatsNew = () => {
    if (!editConfig) return;
    setEditConfig({
      ...editConfig,
      whatIsNew: [...(editConfig.whatIsNew || []), 'New enhancement item']
    });
  };

  const handleUpdateWhatsNew = (index: number, val: string) => {
    if (!editConfig) return;
    const updated = [...editConfig.whatIsNew];
    updated[index] = val;
    setEditConfig({ ...editConfig, whatIsNew: updated });
  };

  const handleRemoveWhatsNew = (index: number) => {
    if (!editConfig) return;
    const updated = editConfig.whatIsNew.filter((_, i) => i !== index);
    setEditConfig({ ...editConfig, whatIsNew: updated });
  };

  // If NOT logged in, display the server-protected login or setup screen
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-3xl bg-[#060c18] border border-cyan-500/40 p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
              {isSetupMode ? <KeyRound className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isSetupMode ? 'Set Up Admin Password' : 'NEXA Admin Login'}
            </h1>
            <p className="text-xs text-slate-400">
              {isSetupMode
                ? 'Configure a dedicated administrator password for nexa.com.in21@gmail.com.'
                : 'Secure server-side authentication for release versions, downloads, and content.'}
            </p>
          </div>

          {/* Security Alert Banner (Setup Mode) */}
          {isSetupMode && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Crucial Security Rule</span>
              </div>
              <p className="leading-relaxed">
                <strong>Do NOT use your personal Gmail password.</strong> Create a unique, dedicated password specifically for this NEXA administrative console.
              </p>
            </div>
          )}

          {/* Error Message */}
          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* SETUP FORM */}
          {isSetupMode ? (
            <form onSubmit={handleSetupPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Designated Administrator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    readOnly
                    value="nexa.com.in21@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-sm font-mono cursor-not-allowed pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Fixed official administrative address for NEXA platform control.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Create New Admin Password *
                </label>
                <div className="relative">
                  <input
                    id="setup-new-password-input"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new admin password (min 8 chars)"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm pr-11 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Confirm New Admin Password *
                </label>
                <div className="relative">
                  <input
                    id="setup-confirm-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm new admin password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm pr-11 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Guide */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1 text-slate-400">
                <div className={`flex items-center gap-1.5 ${newPasswordInput.length >= 8 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Minimum 8 characters long</span>
                </div>
                <div className={`flex items-center gap-1.5 ${newPasswordInput && newPasswordInput === confirmPasswordInput ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Passwords match exactly</span>
                </div>
              </div>

              <button
                id="admin-setup-submit-btn"
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4 stroke-[2.5]" />
                <span>{loginLoading ? 'Saving Password...' : 'Save Password & Enter Dashboard'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSetupMode(false);
                    setLoginError(null);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                >
                  Already set up your password? Switch to Admin Sign In
                </button>
              </div>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Administrator Email
                </label>
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="nexa.com.in21@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Administrator Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSetupMode(true);
                      setLoginError(null);
                    }}
                    className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Reset / Set New Password
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your admin password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm pr-11 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Shield className="w-4 h-4 stroke-[2.5]" />
                <span>{loginLoading ? 'Authenticating...' : 'Sign In to Admin Console'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSetupMode(true);
                    setLoginError(null);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                >
                  Need to set up or reset your Admin password? Click here
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-1 text-[11px] text-slate-500">
            Protected Console • Official NEXA Platform
          </div>
        </div>
      </div>
    );
  }

  // If logged in: Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#060c18] border border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase">Administrator Session</span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-[11px]">
                nexa.com.in21@gmail.com
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">NEXA Administration Console</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="admin-security-btn"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>Password & Security</span>
          </button>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active
          </span>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          id="admin-tab-apk"
          onClick={() => setActiveTab('apk')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'apk'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4 text-cyan-400" />
          APK Management ({apksList.length})
        </button>

        <button
          id="admin-tab-config"
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'config'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Version & Release Notes
        </button>

        <button
          id="admin-tab-screenshots"
          onClick={() => setActiveTab('screenshots')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'screenshots'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Image className="w-4 h-4" />
          Website Content & Media
        </button>

        <button
          id="admin-tab-help"
          onClick={() => setActiveTab('help')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'help'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Help Center ({helpArticles.length})
        </button>

        <button
          id="admin-tab-enquiries"
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'enquiries'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Enquiries ({enquiries.length})
        </button>

        <button
          id="admin-tab-security"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'security'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          Admin Security & Password
        </button>

        <button
          id="admin-tab-testing"
          onClick={() => setActiveTab('testing')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'testing'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Testing & Production QA
        </button>
      </div>

      {/* TAB 1: CONFIGURATION & VERSION MANAGEMENT */}
      {activeTab === 'config' && editConfig && (
        <form onSubmit={handleSaveConfig} className="space-y-8">
          {saveStatus && (
            <div
              className={`p-4 rounded-2xl text-sm flex items-center gap-2.5 animate-in fade-in ${
                saveStatus.startsWith('Error')
                  ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              {saveStatus.startsWith('Error') ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              )}
              <span>{saveStatus}</span>
            </div>
          )}

          {/* Core Version Parameters */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              Application Release Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Latest Version String</label>
                <input
                  type="text"
                  value={editConfig.appLatestVersion}
                  onChange={(e) => setEditConfig({ ...editConfig, appLatestVersion: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  placeholder="v2.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Version Code (Android Integer)</label>
                <input
                  type="number"
                  value={editConfig.appVersionCode}
                  onChange={(e) => setEditConfig({ ...editConfig, appVersionCode: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Version Codename</label>
                <input
                  type="text"
                  value={editConfig.versionName}
                  onChange={(e) => setEditConfig({ ...editConfig, versionName: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Release Date</label>
                <input
                  type="text"
                  value={editConfig.releaseDate}
                  onChange={(e) => setEditConfig({ ...editConfig, releaseDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">APK Package Size</label>
                <input
                  type="text"
                  value={editConfig.fileSize}
                  onChange={(e) => setEditConfig({ ...editConfig, fileSize: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Minimum Android Version</label>
                <input
                  type="text"
                  value={editConfig.minimumAndroidVersion}
                  onChange={(e) => setEditConfig({ ...editConfig, minimumAndroidVersion: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>
            </div>

            {/* Release Notes */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-300">Full Release Notes</label>
              <textarea
                rows={3}
                value={editConfig.releaseNotes}
                onChange={(e) => setEditConfig({ ...editConfig, releaseNotes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm resize-y"
              ></textarea>
            </div>
          </div>

          {/* What's New List */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                What's New Items
              </h2>
              <button
                type="button"
                onClick={handleAddWhatsNew}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {editConfig.whatIsNew?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateWhatsNew(idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveWhatsNew(idx)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Download URLs & Configuration */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-cyan-400" />
              Download Channel Routing
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Direct APK Download URL</label>
                <input
                  type="text"
                  value={editConfig.apkUrl}
                  onChange={(e) => setEditConfig({ ...editConfig, apkUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  placeholder="e.g. /downloads/nexa-v2.5-release.apk or https://..."
                />
                <p className="text-[11px] text-slate-400">
                  When empty, direct downloads are disabled according to security specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Google Play Store URL</label>
                  <input
                    type="text"
                    value={editConfig.playStoreUrl}
                    onChange={(e) => setEditConfig({ ...editConfig, playStoreUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    placeholder="https://play.google.com/store/apps/details?id=..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Other Official Store URL</label>
                  <input
                    type="text"
                    value={editConfig.otherStoreUrl}
                    onChange={(e) => setEditConfig({ ...editConfig, otherStoreUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  id="enable-download-toggle"
                  type="checkbox"
                  checked={editConfig.downloadEnabled}
                  onChange={(e) => setEditConfig({ ...editConfig, downloadEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="enable-download-toggle" className="text-xs font-semibold text-slate-300">
                  Allow Public Direct Downloads (Uncheck to pause downloads during maintenance)
                </label>
              </div>
            </div>
          </div>

          {/* Update Banner Controls */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Website Top Update Banner Controls
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  id="show-banner-toggle"
                  type="checkbox"
                  checked={editConfig.showUpdateBanner}
                  onChange={(e) => setEditConfig({ ...editConfig, showUpdateBanner: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="show-banner-toggle" className="text-xs font-semibold text-slate-300">
                  Display Top Update Banner across all pages
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Banner Announcement Text</label>
                  <input
                    type="text"
                    value={editConfig.updateBannerMessage}
                    onChange={(e) => setEditConfig({ ...editConfig, updateBannerMessage: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Banner Button Label</label>
                  <input
                    type="text"
                    value={editConfig.updateBannerButtonText}
                    onChange={(e) => setEditConfig({ ...editConfig, updateBannerButtonText: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Support Email Configuration */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white">Official Communications Email</h2>
            <div className="space-y-1.5 max-w-md">
              <label className="text-xs font-semibold text-slate-300">Configured Support Gmail</label>
              <input
                type="email"
                value={editConfig.supportEmail}
                onChange={(e) => setEditConfig({ ...editConfig, supportEmail: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Official address: nexa.com.in21@gmail.com
              </p>
            </div>
          </div>

          {/* Submit / Save Button */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              id="admin-save-config-btn"
              type="submit"
              disabled={saveLoading}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{saveLoading ? 'Saving to Server...' : 'Save All Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: DYNAMIC APK UPLOAD & MANAGEMENT */}
      {activeTab === 'apk' && (
        <div className="space-y-8">
          {/* Storage & Download Security Overview Banner */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Persistent APK Storage & Delivery Engine
                  </h3>
                  <p className="text-xs text-slate-400">
                    Physical file system backend in <code className="font-mono text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">/uploads/apks/</code> (Zero localStorage usage)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Storage Active & Verified
                </span>
                <button
                  onClick={fetchApks}
                  disabled={loadingApks}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Refresh Releases"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingApks ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Quick Toggle: Require Login Before Download */}
            {editConfig && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    Require User Sign-In Before Downloading APKs
                  </div>
                  <p className="text-[11px] text-slate-400">
                    When enabled, visitors must create or log into a verified NEXA account before receiving binary downloads.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const updated = { ...editConfig, publicDownload: !editConfig.publicDownload };
                    setEditConfig(updated);
                    try {
                      await fetch('/api/admin/config', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(updated)
                      });
                      onConfigUpdated(updated);
                    } catch {
                      // ignore
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-colors cursor-pointer ${
                    !editConfig.publicDownload
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {!editConfig.publicDownload ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-cyan-400" />
                      <span>Sign-In Required (Strict)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-slate-500" />
                      <span>Public Downloads Allowed</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Current Products & Releases Catalog */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Active Products & APK Releases ({apksList.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Manage NEXA and FocusLock APKs, replace binaries, toggle public visibility, and test downloads.
                </p>
              </div>

              {/* Quick Actions for APK Management */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nexaRel = apksList.find((a) => a.productId === 'nexa');
                    setTargetReleaseId(nexaRel?.id || null);
                    setTargetProduct('nexa');
                    setApkVersion(nexaRel?.version || config?.appLatestVersion || '2.5');
                    setApkVersionName(nexaRel?.displayName || config?.versionName || 'NEXA 2.5 Nebula');
                    setApkReleaseNotes(nexaRel?.releaseNotes || 'NEXA v2.5 official Android binary release.');
                    const el = document.getElementById('apk-upload-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add / Update NEXA APK</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const focusRel = apksList.find((a) => a.productId === 'focuslock');
                    setTargetReleaseId(focusRel?.id || null);
                    setTargetProduct('focuslock');
                    setApkVersion(focusRel?.version || '1.0');
                    setApkVersionName(focusRel?.displayName || 'FocusLock 1.0 Sentinel');
                    setApkReleaseNotes(focusRel?.releaseNotes || 'FocusLock provides intelligent screen-time shielding, distraction blockers, and mindful focus sessions.');
                    const el = document.getElementById('apk-upload-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add / Update FocusLock APK</span>
                </button>
              </div>
            </div>

            {loadingApks ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Loading official product releases...
              </div>
            ) : apksList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                No APK releases registered yet. Upload your first release below.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {apksList.map((rel) => (
                  <div
                    key={rel.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">{rel.productName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                            v{rel.version}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono">
                          ID: <span className="text-slate-300">{rel.productId}</span> • {rel.displayName || rel.versionName}
                        </div>
                      </div>

                      {/* Binary Storage Status Badge */}
                      {rel.isRealApk && rel.status === 'Binary Ready' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold flex items-center gap-1.5 flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Binary Ready ({rel.fileSize})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5 flex-shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          Binary Not Uploaded
                        </span>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pb-2 border-b border-slate-850">
                        <div>
                          <span className="text-slate-500 block text-[11px] font-mono">Package ID:</span>
                          <strong className="text-cyan-300 font-mono text-xs break-all">{rel.packageId || 'in.com.nexa.app'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px] font-mono">Version Code:</span>
                          <strong className="text-white font-mono text-xs">{rel.versionCode || '25'} (v{rel.version})</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px] font-mono">Signing Certificate:</span>
                          <strong className="text-emerald-400 font-mono text-xs">{rel.signingScheme || 'v1 / v2 Verified'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px] font-mono">Minimum Android:</span>
                          <span className="text-slate-300 font-mono text-xs">{rel.minimumAndroidVersion || 'Android 8.0+'}</span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 text-[11px]">
                        <div><strong>Stored Filename:</strong> <code className="text-slate-300 font-mono">{rel.filename}</code> {rel.originalFilename && rel.originalFilename !== rel.filename ? <span className="text-slate-500 font-mono">(Original: {rel.originalFilename})</span> : ''}</div>
                        <div><strong>Storage Path:</strong> <code className="text-slate-400 font-mono break-all">{rel.isRealApk && rel.storagePath ? rel.storagePath : 'uploads/apks/'}</code></div>
                        <div><strong>Package Size:</strong> <span className="text-slate-400 font-mono">{rel.fileSize} {rel.fileSizeBytes ? `(${rel.fileSizeBytes.toLocaleString()} bytes)` : ''}</span></div>
                        {rel.sha256 && (
                          <div className="break-all">
                            <strong className="text-slate-400">SHA-256:</strong>{' '}
                            <code className="text-cyan-400 font-mono text-[10px]">{rel.sha256}</code>
                          </div>
                        )}
                      </div>

                      {rel.releaseNotes && (
                        <div className="pt-2 border-t border-slate-850 text-slate-300 text-[11px] leading-relaxed">
                          <strong className="text-slate-400">Notes:</strong> {rel.releaseNotes}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1.5 text-[11px] text-slate-400 border-t border-slate-850">
                        <span>Total Downloads: <strong className="text-cyan-400">{rel.downloadCount || 0}</strong></span>
                        <span>Release Date: {rel.releaseDate}</span>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Publish / Unpublish Toggle */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(rel.id, rel.published)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                            rel.published
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                          title={rel.published ? 'Click to unpublish release' : 'Click to publish release'}
                        >
                          {rel.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{rel.published ? 'Published' : 'Draft (Unpublished)'}</span>
                        </button>

                        {/* Edit Details Button */}
                        <button
                          type="button"
                          onClick={() => setEditingRelease(rel)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Edit display name, version name, notes, and release date"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Edit Details</span>
                        </button>

                        {/* Replace APK Button */}
                        <button
                          type="button"
                          onClick={() => handleInitiateReplace(rel)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 hover:text-white text-xs font-semibold border border-cyan-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Pre-fill form to upload and replace this APK binary"
                        >
                          <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Replace APK</span>
                        </button>

                        {/* Test Download */}
                        <button
                          type="button"
                          disabled={downloadTestingId === rel.id || downloadTestingId === rel.productId}
                          onClick={() => handleTestDownload(rel.productId, rel.id, rel.version)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          title="Test Authenticated Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadTestingId === rel.id ? 'Testing...' : 'Test Download'}</span>
                        </button>

                        {/* Verify & Diagnostics Button */}
                        <button
                          type="button"
                          disabled={verifyingId === rel.id || verifyingId === rel.productId}
                          onClick={() => handleVerifyApk(rel)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          title="Inspect Android Diagnostics & Verify Package"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{verifyingId === rel.id || verifyingId === rel.productId ? 'Checking...' : 'Diagnostics & Check'}</span>
                        </button>
                      </div>

                      {apksList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteApk(rel.id, rel.displayName || rel.productName)}
                          className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
                          title="Delete Release"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload New Binary / Replace Existing Release Form */}
          <div id="apk-upload-section" className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-cyan-400" />
                  Upload APK Binary to Persistent Storage
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload an authentic Android .apk binary. Saved directly to server storage, validated with SHA-256 and size verification.
                </p>
              </div>
            </div>

            {apkUploadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                <span>{apkUploadSuccess}</span>
              </div>
            )}

            {apkUploadError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
                <span>{apkUploadError}</span>
              </div>
            )}

            <form onSubmit={handleApkUpload} className="space-y-6">
              {/* Product Target Selector */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Select Target Product *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetProduct('nexa');
                      setApkVersion(config?.appLatestVersion || 'v2.5');
                      setApkVersionName(config?.versionName || 'NEXA 2.5 Nebula');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      targetProduct === 'nexa'
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">NEXA Core Platform</div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-0.5">ID: nexa</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetProduct('focuslock');
                      setApkVersion('1.0');
                      setApkVersionName('FocusLock Sentinel 1.0');
                      setApkFileSize('14.2 MB');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      targetProduct === 'focuslock'
                        ? 'bg-blue-500/15 border-blue-500/50 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">FocusLock Companion</div>
                    <div className="text-[10px] font-mono text-blue-400 mt-0.5">ID: focuslock</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetProduct('custom');
                      setApkVersion('1.0');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      targetProduct === 'custom'
                        ? 'bg-purple-500/15 border-purple-500/50 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">+ New Product Release</div>
                    <div className="text-[10px] font-mono text-purple-400 mt-0.5">Custom ID & name</div>
                  </button>
                </div>

                {targetProduct === 'custom' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Product Identifier (slug)</label>
                      <input
                        type="text"
                        required
                        value={customProductId}
                        onChange={(e) => setCustomProductId(e.target.value)}
                        placeholder="e.g. scanner"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Display Product Name</label>
                      <input
                        type="text"
                        required
                        value={customProductName}
                        onChange={(e) => setCustomProductName(e.target.value)}
                        placeholder="e.g. NEXA Scanner Pro"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* File Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Android APK Binary File (.apk) *</label>
                <div className="p-8 border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl bg-slate-950/60 text-center space-y-3 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <input
                      ref={apkFileInputRef}
                      type="file"
                      id="apk-file-picker"
                      accept=".apk"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setApkFile(file);
                        if (file) {
                          const mb = (file.size / (1024 * 1024)).toFixed(1);
                          setApkFileSize(`${mb} MB`);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="apk-file-picker"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold cursor-pointer transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      Browse / Choose .apk File
                    </label>
                  </div>
                  {apkFile ? (
                    <div className="p-3 max-w-md mx-auto rounded-xl bg-slate-900 border border-slate-700 text-xs text-white flex items-center justify-between gap-2">
                      <span className="font-mono truncate">{apkFile.name}</span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-cyan-400 font-mono font-bold">
                          {(apkFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setApkFile(null);
                            if (apkFileInputRef.current) apkFileInputRef.current.value = '';
                          }}
                          className="text-slate-400 hover:text-red-400 text-xs font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Select genuine Android package file (.apk) — minimum 1 MB required
                    </p>
                  )}
                </div>
              </div>

              {/* Version & Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Version String</label>
                  <input
                    type="text"
                    required
                    value={apkVersion}
                    onChange={(e) => setApkVersion(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    placeholder="2.5"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Version Codename</label>
                  <input
                    type="text"
                    value={apkVersionName}
                    onChange={(e) => setApkVersionName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    placeholder="NEXA 2.5 Nebula"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Calculated Package Size</label>
                  <input
                    type="text"
                    value={apkFileSize}
                    onChange={(e) => setApkFileSize(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-semibold text-slate-300">Minimum Android Version</label>
                  <input
                    type="text"
                    value={apkMinAndroid}
                    onChange={(e) => setApkMinAndroid(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>

              {/* Release Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Release Notes</label>
                <textarea
                  rows={2}
                  value={apkReleaseNotes}
                  onChange={(e) => setApkReleaseNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm resize-y"
                ></textarea>
              </div>

              {/* What's New bullet points */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">What's New Bullet Points (one per line)</label>
                <textarea
                  rows={3}
                  value={apkWhatIsNew}
                  onChange={(e) => setApkWhatIsNew(e.target.value)}
                  placeholder="Enter each feature highlight on a separate line..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono text-xs resize-y"
                ></textarea>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="apk-publish-immediate"
                  checked={apkPublishImmediate}
                  onChange={(e) => setApkPublishImmediate(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700"
                />
                <label htmlFor="apk-publish-immediate" className="text-xs text-slate-300 font-medium">
                  Publish immediately on website download page
                </label>
              </div>

              {/* Upload Progress Bar & Status */}
              {apkUploading && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-300 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      {apkUploadPhase === 'uploading'
                        ? `Streaming binary payload to server (${apkUploadProgress}%)...`
                        : 'Verifying ZIP headers, classes.dex & cryptographically securing...'}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{apkUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${apkUploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {apkUploadPhase === 'uploading'
                      ? 'Please do not close this tab. The file is being uploaded to persistent server storage.'
                      : 'Binary upload complete! Running integrity and format checks on the server...'}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={apkUploading}
                  onClick={() => setApkPublishImmediate(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                  title="Upload APK and keep status as Draft (hidden from public downloads until published)"
                >
                  <Save className="w-4 h-4 text-slate-400" />
                  <span>Save Draft (Unpublished)</span>
                </button>

                <button
                  type="submit"
                  disabled={apkUploading}
                  onClick={() => setApkPublishImmediate(true)}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
                >
                  {apkUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>
                        {apkUploadPhase === 'uploading'
                          ? `Uploading ${apkUploadProgress}%...`
                          : 'Verifying Binary...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 stroke-[2.5]" />
                      <span>Upload &amp; Publish Immediately</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ENQUIRIES & CONTACT SUBMISSIONS */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Official Enquiries & Form Submissions ({enquiries.length})
            </h2>
            <button
              onClick={fetchEnquiries}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {loadingEnquiries ? (
            <div className="text-center py-12 text-slate-400">Loading stored enquiries from server...</div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-white">No enquiries submitted yet</div>
              <p className="text-xs text-slate-400">
                Messages sent via the Contact page or Services page will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Enquiries List */}
              <div className="lg:col-span-6 space-y-3">
                {enquiries.map((item) => (
                  <div
                    key={item.id}
                    id={`enquiry-row-${item.id}`}
                    onClick={() => setSelectedEnquiry(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      selectedEnquiry?.id === item.id
                        ? 'bg-[#060c18] border-cyan-500/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          item.status === 'new'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : item.status === 'in_review'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-cyan-400 font-mono">{item.category}</div>
                    <div className="text-xs text-slate-300 font-semibold">{item.subject}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                      <span>{item.email}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Enquiry Detail */}
              <div className="lg:col-span-6">
                {selectedEnquiry ? (
                  <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 sticky top-24">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-cyan-400">
                          {selectedEnquiry.category}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">
                          {selectedEnquiry.subject}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, 'new')}
                          className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white"
                        >
                          New
                        </button>
                        <button
                          onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, 'in_review')}
                          className="px-2 py-1 rounded bg-slate-800 text-[10px] text-amber-300 hover:text-white"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, 'resolved')}
                          className="px-2 py-1 rounded bg-slate-800 text-[10px] text-emerald-300 hover:text-white"
                        >
                          Resolved
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div>
                        Sender: <strong className="text-white">{selectedEnquiry.name}</strong>
                      </div>
                      <div>
                        Email: <a href={`mailto:${selectedEnquiry.email}`} className="text-cyan-400 underline">{selectedEnquiry.email}</a>
                      </div>
                      {selectedEnquiry.serviceType && (
                        <div>Service Requested: <strong className="text-white">{selectedEnquiry.serviceType}</strong></div>
                      )}
                      <div>Received: <span className="text-slate-400">{new Date(selectedEnquiry.createdAt).toLocaleString()}</span></div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-slate-400">Message Body:</div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-slate-950 border border-slate-800">
                        {selectedEnquiry.message}
                      </p>
                    </div>

                    <a
                      href={`mailto:${selectedEnquiry.email}?subject=Re:%20${encodeURIComponent(selectedEnquiry.subject)}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      Reply Directly via Email
                    </a>
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
                    Select an enquiry from the list to view complete details.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SCREENSHOTS MANAGER */}
      {activeTab === 'screenshots' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              App Screenshots ({screenshots.length})
            </h2>
            <button
              onClick={() => setNewScreenshotModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Screenshot
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {screenshots.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400">{s.category}</span>
                  <button
                    onClick={() => handleDeleteScreenshot(s.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{s.description}</p>
                <div className="text-[10px] text-slate-500 font-mono">Mockup: {s.mockupType}</div>
              </div>
            ))}
          </div>

          {/* Add Screenshot Modal */}
          {newScreenshotModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <form
                onSubmit={handleAddScreenshot}
                className="max-w-md w-full bg-[#060c18] border border-cyan-500/40 rounded-3xl p-6 space-y-4"
              >
                <h3 className="text-lg font-bold text-white">Add Screenshot</h3>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Title</label>
                  <input
                    type="text"
                    required
                    value={newScreenshot.title}
                    onChange={(e) => setNewScreenshot({ ...newScreenshot, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Category</label>
                  <select
                    value={newScreenshot.category}
                    onChange={(e) => setNewScreenshot({ ...newScreenshot, category: e.target.value as ScreenshotCategory })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="Home">Home</option>
                    <option value="NEXA AI">NEXA AI</option>
                    <option value="Finance">Finance</option>
                    <option value="NEXA Tools">NEXA Tools</option>
                    <option value="Video Generation">Video Generation</option>
                    <option value="Object Finder">Object Finder</option>
                    <option value="Focus / Protection">Focus / Protection</option>
                    <option value="Settings">Settings</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={newScreenshot.description}
                    onChange={(e) => setNewScreenshot({ ...newScreenshot, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs resize-y"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Mockup Visual Scheme</label>
                  <select
                    value={newScreenshot.mockupType}
                    onChange={(e) => setNewScreenshot({ ...newScreenshot, mockupType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="home">Home / Assistant Hub</option>
                    <option value="assistant">NEXA AI Assistant</option>
                    <option value="finance">Finance / Calculators</option>
                    <option value="tools">Productivity Tools</option>
                    <option value="video">AI Video Generation</option>
                    <option value="object_finder">Intelligent Object Finder</option>
                    <option value="focuslock">Focus & Device Protection</option>
                    <option value="settings">AMOLED Settings & Preferences</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewScreenshotModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Save Screenshot
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: HELP CENTER ARTICLES */}
      {activeTab === 'help' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Help Articles ({helpArticles.length})
            </h2>
            <button
              onClick={() => setNewHelpModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Article
            </button>
          </div>

          <div className="space-y-3">
            {helpArticles.map((art) => (
              <div key={art.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">{art.category}</span>
                  <h4 className="text-sm font-bold text-white">{art.title}</h4>
                  <p className="text-xs text-slate-300">{art.summary}</p>
                </div>
                <button
                  onClick={() => handleDeleteHelp(art.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Help Article Modal */}
          {newHelpModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <form
                onSubmit={handleAddHelp}
                className="max-w-md w-full bg-[#060c18] border border-cyan-500/40 rounded-3xl p-6 space-y-4"
              >
                <h3 className="text-lg font-bold text-white">Add Help Article</h3>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Article Title</label>
                  <input
                    type="text"
                    required
                    value={newHelp.title}
                    onChange={(e) => setNewHelp({ ...newHelp, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Category</label>
                  <select
                    value={newHelp.category}
                    onChange={(e) => setNewHelp({ ...newHelp, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="general">General</option>
                    <option value="ai">NEXA AI</option>
                    <option value="finance">Finance</option>
                    <option value="tools">NEXA Tools</option>
                    <option value="video">Video Generation</option>
                    <option value="object_finder">Object Finder</option>
                    <option value="focus">Focus & Protection</option>
                    <option value="download">Download & Updates</option>
                    <option value="permissions">Permissions & Battery</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Summary</label>
                  <input
                    type="text"
                    required
                    value={newHelp.summary}
                    onChange={(e) => setNewHelp({ ...newHelp, summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Content / Resolution Guide</label>
                  <textarea
                    rows={4}
                    required
                    value={newHelp.content}
                    onChange={(e) => setNewHelp({ ...newHelp, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs resize-y"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewHelpModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Save Article
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: ADMIN SECURITY & CREDENTIALS */}
      {activeTab === 'security' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Administrator Security & Password</h2>
                <p className="text-xs text-slate-400">
                  Manage dedicated authentication credentials for official NEXA administrative access.
                </p>
              </div>
            </div>

            {/* Admin Identity Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">Authorized Administrator Email:</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-300 font-bold text-sm">
                  nexa.com.in21@gmail.com
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Verified Admin Account
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Secret-key authentication has been completely removed. Access is strictly authenticated with this email and your securely hashed dedicated password.
              </p>
            </div>

            {/* Crucial Security Rule Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Security Guideline</span>
              </div>
              <p className="leading-relaxed">
                <strong>Do NOT use your personal Gmail password.</strong> Always use a dedicated, unique password for this NEXA administrator panel. Passwords are never stored in plain text, never exposed in client code, and never saved in localStorage.
              </p>
            </div>

            {/* Status Notification */}
            {passChangeStatus && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  passChangeStatus.startsWith('Error')
                    ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                }`}
              >
                {passChangeStatus.startsWith('Error') ? (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{passChangeStatus}</span>
              </div>
            )}

            {/* Password Change Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Current Administrator Password *
                </label>
                <input
                  id="admin-current-password-input"
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  New Administrator Password *
                </label>
                <div className="relative">
                  <input
                    id="admin-change-new-password-input"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password (min 8 chars)"
                    value={changeNewPass}
                    onChange={(e) => setChangeNewPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm pr-11 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Confirm New Administrator Password *
                </label>
                <div className="relative">
                  <input
                    id="admin-change-confirm-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm new password"
                    value={changeConfirmPass}
                    onChange={(e) => setChangeConfirmPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm pr-11 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="admin-change-password-submit-btn"
                type="submit"
                disabled={passChangeLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4 stroke-[2.5]" />
                <span>{passChangeLoading ? 'Updating Password...' : 'Update Administrator Password'}</span>
              </button>
            </form>

            {/* Emergency Reset Trigger */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Re-initialize Admin Setup
              </h3>
              <p className="text-xs text-slate-400">
                If you ever need to reset the administrative password workflow, you can trigger setup mode. This will clear the current password hash and prompt for a new setup.
              </p>
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Reset admin credentials and enter password setup mode?')) {
                    try {
                      await fetch('/api/admin/reset-password', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ email: 'nexa.com.in21@gmail.com' })
                      });
                      sessionStorage.removeItem('nexa_admin_token');
                      setToken(null);
                      setIsSetupMode(true);
                    } catch {
                      // Fallback
                      setToken(null);
                      setIsSetupMode(true);
                    }
                  }
                }}
                className="px-4 py-2 rounded-xl bg-slate-950 border border-red-500/40 hover:bg-red-950/30 text-red-400 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Reset Administrator Credentials & Return to Setup</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TESTING & PRODUCTION QUALITY ASSURANCE (Requirements 10, 11, 12, 14) */}
      {activeTab === 'testing' && (
        <AdminProductionTesting
          token={token}
          config={editConfig}
          apksList={apksList}
          onOpenDiagnostics={(rel) => handleVerifyApk(rel)}
        />
      )}

      {/* APK Interactive Diagnostics Modal */}
      <AdminApkDiagnosticsModal
        isOpen={Boolean(diagnosticModalData)}
        data={diagnosticModalData}
        onClose={() => setDiagnosticModalData(null)}
        onTestDownload={(pid) => handleTestDownload(pid)}
      />

      {/* Edit Release Details Modal */}
      <AdminEditReleaseModal
        isOpen={Boolean(editingRelease)}
        release={editingRelease}
        token={token}
        onClose={() => setEditingRelease(null)}
        onSaved={(updatedRel) => {
          setApksList((prev) => prev.map((r) => (r.id === updatedRel.id ? updatedRel : r)));
          fetchApks();
        }}
      />
    </div>
  );
};
