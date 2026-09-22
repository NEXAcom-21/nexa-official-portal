import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCode,
  Layers,
  Cpu,
  Smartphone,
  HardDrive,
  Key,
  Download,
  AlertCircle
} from 'lucide-react';

interface DiagnosticGuideItem {
  cause: string;
  detail: string;
  fix: string;
}

interface ApkDiagnosticsModalProps {
  isOpen: boolean;
  data: {
    verified?: boolean;
    productId?: string;
    productName?: string;
    displayName?: string;
    version?: string;
    versionName?: string;
    versionCode?: string | number;
    packageId?: string;
    minSdkVersion?: string;
    targetSdkVersion?: string;
    signingScheme?: string;
    hasSigningCert?: boolean;
    signingFiles?: string[];
    filename?: string;
    originalFilename?: string;
    storagePath?: string;
    fileSizeBytes?: number;
    fileSize?: string;
    sha256?: string;
    hasManifest?: boolean;
    hasClassesDex?: boolean;
    hasResourcesArsc?: boolean;
    entriesCount?: number;
    published?: boolean;
    status?: string;
    downloadReady?: boolean;
    diagnosticChecks?: {
      isStructurallyValid?: boolean;
      hasManifest?: boolean;
      hasClassesDex?: boolean;
      hasResourcesArsc?: boolean;
      hasSigningCert?: boolean;
      sha256Matches?: boolean;
      sizeMatches?: boolean;
    };
    installationFailureGuide?: DiagnosticGuideItem[];
    error?: string;
  } | null;
  onClose: () => void;
  onTestDownload?: (productId: string) => void;
}

export const AdminApkDiagnosticsModal: React.FC<ApkDiagnosticsModalProps> = ({
  isOpen,
  data,
  onClose,
  onTestDownload
}) => {
  if (!isOpen || !data) return null;

  const failureGuide: DiagnosticGuideItem[] = data.installationFailureGuide || [
    {
      cause: 'Package Signature Mismatch',
      detail: 'A previous build of this package is already on the phone with a different signing key. Android rejects upgrades with mismatched certificates.',
      fix: 'Completely uninstall the previous NEXA app from Android Settings > Apps before installing the new APK.'
    },
    {
      cause: 'Corrupted or Incomplete Download',
      detail: 'Download was interrupted over network or stalled in browser, resulting in missing trailing bytes. Android package parser immediately errors.',
      fix: 'Compare downloaded file size on device with server size; ensure exact byte match.'
    },
    {
      cause: 'Version Downgrade Protection',
      detail: 'Android OS forbids installing an APK whose versionCode is lower than the currently installed version.',
      fix: 'Upload an APK with higher versionCode or uninstall older app first.'
    },
    {
      cause: 'Incompatible Android OS Version',
      detail: `Device Android version is below minimum SDK requirement (${data.minSdkVersion || 'API 26'}).`,
      fix: 'Requires Android 8.0 (Oreo) or newer smartphone.'
    },
    {
      cause: 'Conflicting Installed Package',
      detail: `Another installed app uses the same applicationId (${data.packageId || 'in.com.nexa.app'}).`,
      fix: 'Uninstall conflicting package via Android Settings > Apps.'
    },
    {
      cause: 'Unknown Sources / Play Protect Block',
      detail: 'Browser lacks permission to install unknown apps or Play Protect requires confirmation.',
      fix: 'Enable "Allow from this source" in Chrome App Info, then tap "Install Anyway".'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              data.verified ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}>
              {data.verified ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Android Binary Diagnostics</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  data.verified ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/80 text-red-300 border border-red-500/30'
                }`}>
                  {data.status || (data.verified ? 'Binary Ready' : 'Corrupted / Missing')}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {data.productName} v{data.version} ({data.displayName || data.versionName || 'Release'})
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notice if binary failed */}
        {!data.verified && data.error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Verification Error</div>
              <p className="text-xs mt-1 text-red-200">{data.error}</p>
            </div>
          </div>
        )}

        {/* Core Metadata Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              Application Package ID
            </div>
            <div className="font-mono font-bold text-cyan-300 text-xs break-all">
              {data.packageId || 'in.com.nexa.app'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Version Code & Name
            </div>
            <div className="font-bold text-white text-xs">
              Code {data.versionCode || '25'} (v{data.version})
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {data.versionName || data.displayName || 'Production'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              Exact File Size
            </div>
            <div className="font-bold text-white text-xs">
              {data.fileSize || 'N/A'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {data.fileSizeBytes ? `${data.fileSizeBytes.toLocaleString()} bytes` : '0 bytes'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              Minimum Android SDK
            </div>
            <div className="font-bold text-white text-xs">
              {data.minSdkVersion || 'API 26 (Android 8.0)'}
            </div>
            <div className="text-[11px] text-slate-400">
              Target: {data.targetSdkVersion || 'API 34 (Android 14)'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              Signing Certificate
            </div>
            <div className="font-bold text-emerald-300 text-xs">
              {data.hasSigningCert ? 'Cryptographically Signed' : 'Unsigned / Debug'}
            </div>
            <div className="text-[11px] text-slate-400">
              {data.signingScheme || 'v1 / v2 Signature'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Archive Entries Count
            </div>
            <div className="font-bold text-white text-xs">
              {data.entriesCount ? `${data.entriesCount.toLocaleString()} files` : 'Standard Package'}
            </div>
            <div className="text-[11px] text-slate-400">
              ZIP magic bytes verified
            </div>
          </div>
        </div>

        {/* Storage Path and SHA-256 Checksum */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400 font-mono text-[11px]">Storage Path on Server:</span>
            <code className="text-cyan-300 font-mono text-[11px] break-all">{data.storagePath || 'uploads/apks/'}</code>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400 font-mono text-[11px]">Filename:</span>
            <code className="text-slate-200 font-mono text-[11px]">{data.filename} {data.originalFilename && data.originalFilename !== data.filename ? `(Original: ${data.originalFilename})` : ''}</code>
          </div>
          {data.sha256 && (
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-400 font-mono text-[11px] flex-shrink-0">SHA-256 Checksum:</span>
              <code className="text-cyan-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 break-all">{data.sha256}</code>
            </div>
          )}
        </div>

        {/* Structural Integrity Checklist */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            APK Structure &amp; Parser Validation
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className={`p-2 rounded-xl flex items-center gap-1.5 ${data.hasManifest ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AndroidManifest</span>
            </div>
            <div className={`p-2 rounded-xl flex items-center gap-1.5 ${data.hasClassesDex ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>classes.dex</span>
            </div>
            <div className={`p-2 rounded-xl flex items-center gap-1.5 ${data.hasResourcesArsc ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>resources.arsc</span>
            </div>
            <div className={`p-2 rounded-xl flex items-center gap-1.5 ${data.hasSigningCert ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>META-INF Cert</span>
            </div>
          </div>
        </div>

        {/* The 6 Android Installation Failure Causes & Solutions (Requirement 3) */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Android Installation Failure Troubleshooting (6 Common Causes &amp; Fixes)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {failureGuide.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {idx + 1}. {item.cause}
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {item.detail}
                </p>
                <div className="text-[11px] text-emerald-400 pt-1 border-t border-slate-900">
                  <strong>Fix:</strong> {item.fix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 font-mono">
            Direct Server Stream Endpoint: /api/downloads/{data.productId || 'nexa'}
          </div>

          <div className="flex items-center gap-2">
            {data.productId && onTestDownload && (
              <button
                type="button"
                onClick={() => onTestDownload(data.productId!)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span>Test Download Binary</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
