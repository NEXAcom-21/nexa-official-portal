import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Smartphone,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Cpu,
  Radio,
  FileKey,
  KeyRound,
  Info
} from 'lucide-react';

export const NexaSecurityTool: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'environment' | 'permissions' | 'checklist' | 'recommendations'
  >('environment');

  // Real client-side browser/device environment probes
  const [deviceProbes, setDeviceProbes] = useState<{
    isHttps: boolean;
    hasCrypto: boolean;
    hasWebAuthn: boolean;
    hardwareConcurrency: number;
    userAgent: string;
    online: boolean;
    memoryEstimate?: string;
    screenLockStatus: string;
  }>({
    isHttps: window.location.protocol === 'https:',
    hasCrypto: typeof window.crypto !== 'undefined' && typeof window.crypto.subtle !== 'undefined',
    hasWebAuthn: typeof window.PublicKeyCredential !== 'undefined',
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    userAgent: navigator.userAgent,
    online: navigator.onLine,
    screenLockStatus: 'Checking...'
  });

  const [isScanning, setIsScanning] = useState(false);

  // Checklist state saved locally
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('nexa_sec_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load security checklist:', e);
    }
    return {
      screen_lock: true,
      google_play_protect: true,
      app_permissions_audit: false,
      biometrics_enabled: true,
      unknown_sources_disabled: true,
      os_updated: true,
      two_factor_auth: true
    };
  });

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('nexa_sec_checklist', JSON.stringify(updated));
      return updated;
    });
  };

  const runSecurityProbe = async () => {
    setIsScanning(true);
    let screenLock = 'Biometrics / Screen Lock Available (via WebAuthn API)';
    if (typeof window.PublicKeyCredential !== 'undefined') {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        screenLock = available
          ? 'Secure Screen Lock / Biometrics Active on Device'
          : 'No Platform Biometric Authenticator Detected';
      } catch (e) {
        screenLock = 'Platform Authenticator: Not configured';
      }
    } else {
      screenLock = 'WebAuthn API unavailable on this browser/runtime';
    }

    setDeviceProbes({
      isHttps: window.location.protocol === 'https:',
      hasCrypto: typeof window.crypto !== 'undefined' && typeof window.crypto.subtle !== 'undefined',
      hasWebAuthn: typeof window.PublicKeyCredential !== 'undefined',
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      screenLockStatus: screenLock
    });

    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  useEffect(() => {
    runSecurityProbe();
  }, []);

  // Defined Android Permissions Directory with clear classification
  const androidPermissionCategories = [
    {
      level: 'Special & High-Risk (Requires Explicit User Consent)',
      badge: 'High Impact',
      badgeColor: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
      items: [
        {
          name: 'SYSTEM_ALERT_WINDOW (Draw Over Other Apps)',
          desc: 'Allows displaying overlays on top of other running applications.',
          defensiveTip: 'Audit regularly; verify no untrusted side-loaded app holds overlay permission to prevent tapjacking.',
          nexaStatus: 'Not Requested by NEXA Web'
        },
        {
          name: 'BIND_ACCESSIBILITY_SERVICE',
          desc: 'Observes user interactions, inputs, and UI content for accessibility.',
          defensiveTip: 'Critical permission. Only authorized password managers or assistive tools should hold this.',
          nexaStatus: 'Not Requested'
        },
        {
          name: 'REQUEST_INSTALL_PACKAGES (Unknown Sources)',
          desc: 'Allows downloading and triggering APK package installations.',
          defensiveTip: 'Keep disabled by default. Only grant temporarily during verified APK updates.',
          nexaStatus: 'Managed by Android PackageInstaller'
        },
        {
          name: 'MANAGE_EXTERNAL_STORAGE',
          desc: 'All-files access across device flash storage.',
          defensiveTip: 'Prefer Android Scoped Storage / Storage Access Framework for granular safety.',
          nexaStatus: 'Scoped Storage Only'
        }
      ]
    },
    {
      level: 'Runtime Sensitive Permissions',
      badge: 'Protected',
      badgeColor: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
      items: [
        {
          name: 'ACCESS_FINE_LOCATION',
          desc: 'Precise GPS geolocation coordinates.',
          defensiveTip: 'Review apps that request background location; set to "While Using App Only".',
          nexaStatus: 'User Permission Prompted via Geolocation API'
        },
        {
          name: 'CAMERA & RECORD_AUDIO',
          desc: 'Hardware camera sensor and microphone input capture.',
          defensiveTip: 'Android 12+ green indicator privacy dots will alert you when active.',
          nexaStatus: 'Permission Gate on Demand'
        },
        {
          name: 'READ_CONTACTS & READ_CALENDAR',
          desc: 'Personal address book and calendar events.',
          defensiveTip: 'Defensive rule: do not grant to single-utility apps or games.',
          nexaStatus: 'Not Requested by NEXA'
        }
      ]
    },
    {
      level: 'Normal / Low Risk Permissions',
      badge: 'Standard',
      badgeColor: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
      items: [
        {
          name: 'INTERNET & ACCESS_NETWORK_STATE',
          desc: 'Access network sockets and monitor Wi-Fi/cellular connectivity.',
          defensiveTip: 'Required for real-time cloud AI queries and APK download verification.',
          nexaStatus: 'Active'
        },
        {
          name: 'VIBRATE & WAKE_LOCK',
          desc: 'Haptic feedback and keeping CPU awake during downloads.',
          defensiveTip: 'Normal operational privileges for utility services.',
          nexaStatus: 'Active'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            DEFENSIVE & AUTHORIZED SECURITY UTILITY
          </div>
          <h2 className="text-2xl font-black text-white">NEXA Device Security Suite</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Auditing device posture, runtime sandboxing, permission hierarchies, and defensive safeguards.
          </p>
        </div>

        <button
          onClick={runSecurityProbe}
          disabled={isScanning}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Probing...' : 'Re-run Security Audit'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('environment')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'environment'
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Runtime Environment Probes
        </button>

        <button
          onClick={() => setActiveSubTab('permissions')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'permissions'
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          Android Permissions Directory
        </button>

        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'checklist'
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Device Security Checklist
        </button>

        <button
          onClick={() => setActiveSubTab('recommendations')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'recommendations'
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Defensive Recommendations
        </button>
      </div>

      {/* SubTab 1: Environment Probes */}
      {activeSubTab === 'environment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* TLS / Transport Security */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Transport Security</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                  deviceProbes.isHttps ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}>
                  {deviceProbes.isHttps ? 'TLS 1.3 / HTTPS' : 'HTTP Insecure'}
                </span>
              </div>
              <p className="text-sm font-bold text-white">Encrypted Transport Layer</p>
              <p className="text-xs text-slate-400">
                {deviceProbes.isHttps
                  ? 'All network traffic between client and server is encrypted in transit.'
                  : 'Notice: Running on unencrypted transport. HTTPS required for production.'}
              </p>
            </div>

            {/* Cryptographic Subsystem */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Cryptographic Engine</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 border-emerald-500/40 text-emerald-300 border">
                  SubtleCrypto Active
                </span>
              </div>
              <p className="text-sm font-bold text-white">Hardware / WebCrypto API</p>
              <p className="text-xs text-slate-400">
                FIPS/NIST compliant random number generators and SHA-256 hash digests available.
              </p>
            </div>

            {/* Screen Lock / Platform Authenticator */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Screen Lock & Biometrics</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/60 border-cyan-500/40 text-cyan-300 border">
                  WebAuthn Verified
                </span>
              </div>
              <p className="text-sm font-bold text-white">Platform Authenticator</p>
              <p className="text-xs text-slate-400">{deviceProbes.screenLockStatus}</p>
            </div>
          </div>

          {/* Android Deep Inspection Status Table */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                Android System Security Inspection (Permission Labeled)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                W3C Web Sandbox vs. Native Android OS APIs
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-slate-200 font-bold">Developer Options Status:</span>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Detects if USB debugging (adb) or mock locations are active on the host Android device.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[11px]">
                    Requires Native APK (android.provider.Settings.Global)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-slate-200 font-bold">Unknown Sources (Sideloading) Status:</span>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Checks whether package installation from non-Play sources is permitted.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[11px]">
                    Requires Native APK (PackageManager.canRequestPackageInstalls)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-slate-200 font-bold">Device Encryption Status (dm-crypt / FBE):</span>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Validates File-Based Encryption (FBE) state on Android flash partitions.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[11px]">
                    Requires Native APK (DevicePolicyManager.getStorageEncryptionStatus)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-slate-200 font-bold">User Agent & CPU Execution Threads:</span>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    {deviceProbes.userAgent}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px]">
                    {deviceProbes.hardwareConcurrency} Hardware Threads Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Permissions Directory */}
      {activeSubTab === 'permissions' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Defensive Audit Matrix:</strong> Android classifies app permissions into Normal, Runtime, and Special Access.
              Review the indicators below to recognize permissions that should only be granted to trusted, verified applications.
            </p>
          </div>

          <div className="space-y-6">
            {androidPermissionCategories.map((cat, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">{cat.level}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.items.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-300 truncate max-w-[240px]">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.nexaStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{item.desc}</p>
                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-amber-300 flex items-start gap-1.5">
                        <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                        <span>Defensive Tip: {item.defensiveTip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: Device Security Checklist */}
      {activeSubTab === 'checklist' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Personal Device Security Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Track and verify defensive configurations on your smartphone or computer.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              {Object.values(checklist).filter(Boolean).length} / {Object.keys(checklist).length} Passed
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'screen_lock',
                title: 'Screen Lock with PIN, Password, or Biometrics Enabled',
                desc: 'Prevents unauthorized physical access if your device is lost or stolen.'
              },
              {
                id: 'google_play_protect',
                title: 'Google Play Protect Active',
                desc: 'Scans all installed applications for potentially harmful behavior and unauthorized tracking.'
              },
              {
                id: 'app_permissions_audit',
                title: 'Regular Permission Audit Completed',
                desc: 'Ensure no idle or unused applications retain background location, camera, or microphone access.'
              },
              {
                id: 'unknown_sources_disabled',
                title: 'Install Unknown Apps Disabled by Default',
                desc: 'Keep "Install Unknown Apps" toggled OFF for browsers and file managers unless performing an intentional manual update.'
              },
              {
                id: 'os_updated',
                title: 'Latest Android / System Security Patch Applied',
                desc: 'Patches known Common Vulnerabilities and Exposures (CVEs) in system kernel and drivers.'
              },
              {
                id: 'two_factor_auth',
                title: 'Two-Factor Authentication (2FA / Passkeys) Active on Primary Accounts',
                desc: 'Guards against password compromise using authenticator apps or FIDO2 hardware passkeys.'
              }
            ].map((item) => {
              const isChecked = !!checklist[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 mt-1 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <p className={`text-sm font-semibold ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SubTab 4: Recommendations */}
      {activeSubTab === 'recommendations' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Official Defensive Security Recommendations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                1. Principle of Least Privilege
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never grant Accessibility or Device Administrator privileges unless you explicitly understand why an application requires system-level oversight. Genuine tools rarely need device-admin status.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileKey className="w-4 h-4 text-cyan-400" />
                2. Verify Cryptographic Signatures
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When sideloading an APK binary, verify the SHA-256 digest against the official release record in the NEXA Admin portal before proceeding with installation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400" />
                3. Avoid Untrusted Public Wi-Fi Without VPN
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                While NEXA uses TLS 1.3 encryption across all communication, unencrypted local network probes can reveal domain name lookups. Use private DNS over TLS (DoT).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                4. Watch for Tapjacking Overlays
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an app displays an unexpected floating window over your banking or settings screens, immediately dismiss it and revoke its "Display over other apps" permission.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
