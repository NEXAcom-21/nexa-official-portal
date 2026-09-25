import React, { useState, useEffect } from 'react';
import {
  Download,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Sparkles,
  Lock,
  X,
  Shield,
  Loader2,
  Check
} from 'lucide-react';
import { NexaConfig, ApkRelease } from '../types';
import { useAuth } from '../context/AuthContext';

interface DownloadPageProps {
  config: NexaConfig | null;
  onNavigate: (page: string) => void;
}

interface DownloadModalState {
  title: string;
  message: string;
  productName: string;
  version: string;
  type: 'unavailable' | 'success' | 'error';
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ config, onNavigate }) => {
  const { user, token, openAuthModal } = useAuth();
  const [downloadingProduct, setDownloadingProduct] = useState<string | null>(null);
  const [downloadStatusModal, setDownloadStatusModal] = useState<DownloadModalState | null>(null);
  const [allReleases, setAllReleases] = useState<ApkRelease[]>([]);

  // Fetch published releases from backend catalog
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch('/api/apks');
        if (res.ok) {
          const data = await res.json();
          setAllReleases(data);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchReleases();
  }, []);

  // Filter published releases only (Requirement 2 & 8)
  const publishedReleases = allReleases.filter(r => r.published);
  const publishedNexaReleases = publishedReleases.filter(r => r.productId.toLowerCase() === 'nexa' || r.productName.toLowerCase() === 'nexa');
  const latestNexaRelease = publishedNexaReleases[0] || null;
  const previousNexaReleases = publishedNexaReleases.slice(1);

  const version = latestNexaRelease ? (latestNexaRelease.version.startsWith('v') ? latestNexaRelease.version : `v${latestNexaRelease.version}`) : (config?.appLatestVersion || 'v2.5');
  const releaseDate = latestNexaRelease?.releaseDate || config?.releaseDate || 'September 19, 2026';
  const fileSize = latestNexaRelease?.fileSize || config?.fileSize || '31.34 MB';
  const minAndroid = latestNexaRelease?.minimumAndroidVersion || config?.minimumAndroidVersion || 'Android 8.0 (Oreo, API level 26) or higher';
  const releaseNotes = latestNexaRelease?.releaseNotes || config?.releaseNotes || 'NEXA v2.5 introduces the upgraded NEXA AI Assistant, enhanced Finance calculators, comprehensive productivity Tools, creative Video Generation, intelligent Object Finder, Focus/Protection security, and streamlined Settings.';
  const whatIsNew = config?.whatIsNew || [
    "NEXA AI Assistant with responsive conversational intelligence and smart utilities",
    "Comprehensive Finance department with SIP, EMI, GST, and Compound Interest calculators",
    "Expanded NEXA Tools suite for everyday smartphone productivity",
    "AI Video Generation tools for prompt-to-video creative workflows",
    "Object Finder visual detection utility for quick object identification",
    "Focus and Device Protection controls for distraction-free sessions",
    "Clean, battery-efficient Settings interface with dark AMOLED styling"
  ];

  const playStoreUrl = config?.playStoreUrl?.trim();
  const otherStoreUrl = config?.otherStoreUrl?.trim();
  const downloadEnabled = config?.downloadEnabled ?? true;
  const isPublicDownload = Boolean(config?.publicDownload);

  // Authenticated real binary download handler with releaseId support
  const handleDownload = (
  productId: string,
  productName: string,
  targetVersion: string,
  releaseId?: string
) => {
  if (!isPublicDownload && !user) {
    openAuthModal(
      'login',
      `Please sign in or create an account to download the ${productName} APK.`
    );
    return;
  }

  if (productId.toLowerCase() === 'nexa') {
    window.location.href =
      'https://github.com/NEXAcom-21/nexa-official-portal/releases/download/v2.5/NEXA_v2.5.apk';
  }
};
  const installSteps = [
    {
      step: 1,
      title: 'Download the Official APK File',
      desc: 'Tap the [Download APK] button below. Verify that your browser downloads from the official domain (nexa.com.in).'
    },
    {
      step: 2,
      title: 'Allow Installation from Your Browser',
      desc: 'If Android displays "Install unknown apps", tap Settings > Toggle "Allow from this source" for Chrome/browser.'
    },
    {
      step: 3,
      title: 'Complete System Package Installation',
      desc: 'Tap "Install" when prompted by the Android Package Installer. The app will verify the authentic NEXA.COM.IN 21 signature.'
    },
    {
      step: 4,
      title: 'Launch NEXA & Grant Requested Permissions',
      desc: 'Open NEXA. Configure microphone for "Hey NEXA" voice recognition and set as default assistant if desired.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Smartphone className="w-3.5 h-3.5" />
          OFFICIAL ANDROID DISTRIBUTION
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Download NEXA for Android
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Install the authentic NEXA Android application to activate the Hey NEXA voice assistant, FocusLock distraction prevention, and offline finance utilities.
        </p>

        {/* User Auth State Notification */}
        {!user && !isPublicDownload ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sign in required to verify and download official packages.</span>
            <button
              onClick={() => openAuthModal('login')}
              className="text-cyan-400 font-bold hover:underline cursor-pointer ml-1"
            >
              Sign In
            </button>
          </div>
        ) : user ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authenticated as <strong>{user.name || user.email}</strong> ({user.role})</span>
          </div>
        ) : null}
      </div>

      {/* Primary Download Card: NEXA Core */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-[#060c18] border border-cyan-500/30 shadow-2xl overflow-hidden">
        {/* Release Status Banner */}
        <div className="bg-gradient-to-r from-cyan-950/90 via-blue-950/80 to-slate-950 px-6 py-4 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
            <div>
              <span className="text-xs font-mono text-cyan-300 uppercase">Current Official Version</span>
              <div className="text-lg font-black text-white font-mono">{version}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div>Release Date: <span className="text-white font-semibold">{releaseDate}</span></div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div>Package Size: <span className="text-white font-semibold">{fileSize}</span></div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Download Action Buttons */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Official Download Channels:
            </div>

            {!downloadEnabled ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
                <span>Direct downloads are temporarily paused for scheduled maintenance. Please check back shortly.</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                {/* 1. Download Real APK button */}
                <button
                  id="download-official-apk-btn"
                  type="button"
                  disabled={downloadingProduct === 'nexa'}
                  onClick={() => handleDownload('nexa', 'NEXA', version.replace(/^v/, ''))}
                  className="flex-1 min-w-[240px] px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-black text-base hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-60"
                >
                  {downloadingProduct === 'nexa' ? (
                    <>
                      <Loader2 className="w-5 h-5 text-slate-950 animate-spin" />
                      <span>Verifying Package...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 text-slate-950 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
                      <span>Download NEXA APK ({version})</span>
                    </>
                  )}
                </button>

                {/* 2. Google Play button (if configured) */}
                {playStoreUrl && (
                  <a
                    id="download-google-play-btn"
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Google Play</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {/* 3. Other Official Store (if configured) */}
                {otherStoreUrl && (
                  <a
                    id="download-other-store-btn"
                    href={otherStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Official Store</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
              </div>
            )}

            {/* Note on genuine links */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Download only from official NEXA links. All packages are cryptographically signed and verified.</span>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Current Version</div>
              <div className="text-base font-bold text-white mt-1">{version}</div>
              <div className="text-[11px] text-cyan-400 mt-0.5">{config?.versionName || 'NEXA Quantum'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Supported Android OS</div>
              <div className="text-base font-bold text-white mt-1">{minAndroid}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Compatible with Android 14 & 15</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Package Verification</div>
              <div className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Official Certificate
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">SHA-256 Verified</div>
            </div>
          </div>

          {/* What's New Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              What's New in {version}
            </h3>
            <ul className="space-y-2.5">
              {whatIsNew.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Release Notes */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-sm text-slate-300">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Developer Release Notes
            </div>
            <p className="leading-relaxed">{releaseNotes}</p>
          </div>
        </div>
      </div>

      {/* Secondary Companion Product: FocusLock APK Card */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-[#060c18] border border-blue-500/30 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-slate-950 px-6 py-4 border-b border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
            <div>
              <span className="text-xs font-mono text-blue-300 uppercase">Focus & Protection Companion</span>
              <div className="text-lg font-black text-white font-mono">FocusLock v1.0</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div>Release Date: <span className="text-white font-semibold">September 19, 2026</span></div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div>Package Size: <span className="text-white font-semibold">14.2 MB</span></div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">FocusLock — Distraction Barrier & Device Security</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Standalone device protection module with biometric app lock, focus timers, emergency bypass controls, and strict hardware enforcement to eliminate screen distractions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              id="download-focuslock-apk-btn"
              type="button"
              disabled={downloadingProduct === 'focuslock'}
              onClick={() => handleDownload('focuslock', 'FocusLock', '1.0')}
              className="flex-1 min-w-[240px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-sm hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              {downloadingProduct === 'focuslock' ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span>Verifying Package...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Download FocusLock APK (v1.0)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Previous Published Releases (Requirement 1, 2 & 8) */}
      {previousNexaReleases.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Previous Published Releases
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Archived production releases. Only officially published releases are publicly accessible.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
              {previousNexaReleases.length} Archived Build{previousNexaReleases.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previousNexaReleases.map((rel) => (
              <div key={rel.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-base flex items-center gap-2">
                      <span>{rel.displayName || `NEXA v${rel.version}`}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                        v{rel.version}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Released: {rel.releaseDate} • {rel.fileSize}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
                    Published
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {rel.releaseNotes}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Min: {rel.minimumAndroidVersion}
                  </span>
                  <button
                    type="button"
                    disabled={downloadingProduct === rel.id}
                    onClick={() => handleDownload('nexa', 'NEXA', rel.version, rel.id)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {downloadingProduct === rel.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Download v{rel.version}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Dynamically Published Products Catalog (if any exist) */}
      {publishedReleases.filter(r => r.productId !== 'nexa' && r.productId !== 'focuslock').length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-bold text-white">Additional Published Releases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {publishedReleases.filter(r => r.productId !== 'nexa' && r.productId !== 'focuslock').map((rel) => (
              <div key={rel.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">{rel.productName}</h4>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    v{rel.version}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{rel.releaseNotes}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800">
                  <span>Size: {rel.fileSize}</span>
                  <span>{rel.minimumAndroidVersion}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(rel.productId, rel.productName, rel.version, rel.id)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {rel.productName} v{rel.version}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Installation Guide */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Android Installation Guide
          </h2>
          <p className="text-sm text-slate-400">
            Follow these simple steps to install and calibrate the official NEXA APK on your smartphone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {installSteps.map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-sm">
                  {item.step}
                </div>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-11">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Dedicated "App Not Installed / Installation Failed" Troubleshooting & Diagnostics Guide (Requirement 3) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Getting "App Not Installed" or "Installation Failed"?</h3>
                <p className="text-xs text-slate-400 mt-0.5">Android Package Diagnostics &amp; Step-by-Step Fixes</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold hidden sm:inline-block">
              Android OS Diagnostics
            </span>
          </div>

          {/* Package Diagnostic Reference */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block font-mono text-[11px]">Package Name:</span>
              <strong className="text-cyan-400 font-mono text-xs">{latestNexaRelease?.packageId || 'in.com.nexa.app'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-mono text-[11px]">Version Code:</span>
              <strong className="text-white font-mono text-xs">{latestNexaRelease?.versionCode || '25'} (v{latestNexaRelease?.version || '2.5'})</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-mono text-[11px]">Expected Size:</span>
              <strong className="text-white font-mono text-xs">{fileSize} {latestNexaRelease?.fileSizeBytes ? `(${latestNexaRelease.fileSizeBytes.toLocaleString()} bytes)` : ''}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-mono text-[11px]">Signing Key:</span>
              <strong className="text-emerald-400 font-mono text-xs">{latestNexaRelease?.signingScheme || 'v1 / v2 Signature Verified'}</strong>
            </div>
            {latestNexaRelease?.sha256 && (
              <div className="sm:col-span-2 lg:col-span-4 pt-2 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-slate-500 font-mono text-[11px] flex-shrink-0">SHA-256 Checksum:</span>
                <code className="text-cyan-300 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 break-all">
                  {latestNexaRelease.sha256}
                </code>
              </div>
            )}
          </div>

          {/* The 6 Common Installation Failure Causes and Fixes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                1. Signature Mismatch / Previous Build Conflict
              </div>
              <p className="text-slate-400 leading-relaxed">
                If an earlier APK build is already installed with a test or different signing certificate, Android refuses the update with <em>"App not installed as package appears to be invalid"</em>.
                <br /><strong className="text-slate-200">Fix:</strong> Completely uninstall the previous NEXA app from Android Settings &gt; Apps, then tap Install on the new APK.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                2. Corrupted or Incomplete Download
              </div>
              <p className="text-slate-400 leading-relaxed">
                If the download stopped prematurely or lost trailing bytes over cellular connection, the Android package parser fails with <em>"Problem parsing the package"</em>.
                <br /><strong className="text-slate-200">Fix:</strong> Check downloaded file size in your Files app ({fileSize}). If smaller, delete it and tap Download again on Wi-Fi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                3. Version Downgrade Block
              </div>
              <p className="text-slate-400 leading-relaxed">
                Android OS prevents installing an APK whose internal <code>versionCode</code> is lower than or equal to an existing higher version already on your device.
                <br /><strong className="text-slate-200">Fix:</strong> Uninstall the existing app before attempting to flash an older archive build.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                4. "Install Unknown Apps" Permission
              </div>
              <p className="text-slate-400 leading-relaxed">
                Android blocks APK installations from browser downloads by default until permission is granted.
                <br /><strong className="text-slate-200">Fix:</strong> Open <strong className="text-slate-200">Settings &gt; Apps &gt; Chrome (or File Manager) &gt; Install unknown apps</strong> and switch <strong className="text-slate-200">"Allow from this source"</strong> to ON.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                5. Google Play Protect Warning
              </div>
              <p className="text-slate-400 leading-relaxed">
                Google Play Protect shows an unverified developer prompt when sideloading direct production APKs.
                <br /><strong className="text-slate-200">Fix:</strong> Tap <strong className="text-slate-200">"More Details"</strong> then tap <strong className="text-slate-200">"Install Anyway"</strong>. NEXA does not collect unauthorized telemetry.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                6. Minimum Android OS &amp; Storage
              </div>
              <p className="text-slate-400 leading-relaxed">
                NEXA requires minimum <strong className="text-slate-200">{minAndroid}</strong> and 100 MB free internal flash storage.
                <br /><strong className="text-slate-200">Fix:</strong> Confirm device runs Android 8.0+ and has sufficient internal storage space available.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Safety Warning & Verification */}
      <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-red-950/20 via-slate-900 to-slate-900 border border-red-500/30 space-y-3">
        <div className="flex items-center gap-2.5 text-sm font-bold text-red-300">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          Critical Security Notice
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Never download NEXA APKs from third-party mirrors, re-hosting forums, or untrusted file-sharing repositories. Modified APKs could compromise your Android device permissions, phone call handlers, or biometric security. Official builds are solely hosted and signed at <strong className="text-white">nexa.com.in</strong>.
        </p>
      </div>

      {/* Need Help? Link to Help Center */}
      <div className="text-center space-y-3 pt-6">
        <p className="text-sm text-slate-400">
          Encountering installation issues or have questions regarding permissions?
        </p>
        <button
          id="download-help-center-link"
          onClick={() => onNavigate('help')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          Visit the NEXA Help Center for APK Troubleshooting
        </button>
      </div>

      {/* Download Status & Availability Dialog Modal */}
      {downloadStatusModal && (
        <div
          id="download-status-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDownloadStatusModal(null);
          }}
        >
          <div className="w-full max-w-md bg-[#060c18] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    downloadStatusModal.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : downloadStatusModal.type === 'unavailable'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {downloadStatusModal.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : downloadStatusModal.type === 'unavailable' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-mono text-cyan-300 uppercase">
                    {downloadStatusModal.productName} v{downloadStatusModal.version}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {downloadStatusModal.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDownloadStatusModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {downloadStatusModal.message}
            </div>

            {downloadStatusModal.type === 'unavailable' && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-400">
                  To ensure complete security and device stability, NEXA strictly avoids serving mock, fake, or corrupted placeholders.
                </div>
                {user?.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setDownloadStatusModal(null);
                      onNavigate('admin');
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold border border-cyan-500/40 transition-colors cursor-pointer"
                  >
                    Open Admin Console to Upload Official APK
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setDownloadStatusModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
