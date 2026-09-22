import React from 'react';
import {
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  History,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { NexaConfig } from '../types';

interface UpdatesPageProps {
  config: NexaConfig | null;
  onNavigate: (page: string) => void;
}

export const UpdatesPage: React.FC<UpdatesPageProps> = ({ config, onNavigate }) => {
  const latestVersion = config?.appLatestVersion || 'v2.5';
  const releaseDate = config?.releaseDate || 'September 19, 2026';
  const releaseNotes = config?.releaseNotes || 'NEXA v2.5 introduces the upgraded NEXA AI Assistant, comprehensive Finance calculators, productivity Tools, creative Video Generation, intelligent Object Finder, Focus/Protection controls, and optimized dark AMOLED settings.';
  const whatIsNew = config?.whatIsNew || [
    "NEXA AI Assistant with responsive conversational intelligence and smart utilities",
    "Comprehensive Finance department with SIP, EMI, GST, and Compound Interest calculators",
    "Expanded NEXA Tools suite for everyday smartphone productivity",
    "AI Video Generation tools for prompt-to-video creative workflows",
    "Object Finder visual detection utility for quick object identification",
    "Focus and Device Protection controls for distraction-free sessions",
    "Clean, battery-efficient Settings interface with dark AMOLED styling"
  ];

  const historicalReleases = [
    {
      version: 'v2.2 Quantum',
      date: 'August 18, 2026',
      highlights: [
        'Integrated low-latency wake-word engine and notification filters',
        'Enhanced FocusLock 2.0 with custom lock schedules and emergency PIN overrides',
        'Added offline EMI and GST calculation modules'
      ]
    },
    {
      version: 'v2.1 Apex',
      date: 'July 28, 2026',
      highlights: [
        'Initial deployment of Hey NEXA offline voice detection subsystem',
        'Introduction of FocusLock session statistics and daily focus time tracking',
        'Fixed notification latency issue on Samsung One UI and Xiaomi MIUI devices'
      ]
    },
    {
      version: 'v2.0 Genesis',
      date: 'May 10, 2026',
      highlights: [
        'Complete rewrite with Jetpack Compose modern architecture',
        'Unified conversational AI console with multi-turn prompt caching',
        'Android BiometricPrompt integration for biometric application locking'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <History className="w-3.5 h-3.5" />
          RELEASE LIFECYCLE & CHANGELOG
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          NEXA Updates & Changelog
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Stay informed about official release versions, feature upgrades, security patches, and Android compatibility improvements.
        </p>
      </div>

      {/* Latest Release Spotlight */}
      <div className="rounded-3xl bg-[#060c18] border border-cyan-500/40 p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Current Production Build
            </div>
            <h2 className="text-3xl font-extrabold text-white font-mono flex items-center gap-3">
              NEXA {latestVersion}
              <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {config?.versionName || 'NEXA 2.2 Quantum'}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400 font-mono">Released</div>
              <div className="text-sm font-semibold text-white">{releaseDate}</div>
            </div>
            <button
              id="updates-download-latest-btn"
              onClick={() => onNavigate('download')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Update / Download {latestVersion}
            </button>
          </div>
        </div>

        {/* Release Summary & What's New */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
              Release Overview
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2">
              {releaseNotes}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Detailed Enhancements in {latestVersion}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {whatIsNew.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Update Mechanism Transparency Notice */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Android Update Transparency Protocol:
          </div>
          <p>
            Due to strict Android operating system sandboxing, websites cannot silently modify, overwrite, or update an already installed APK package in the background. The official NEXA website provides verified binary downloads and notifies users whenever an updated version is released. Tapping [Update NEXA] launches the official download or Google Play routing.
          </p>
        </div>
      </div>

      {/* Historical Release Archive Timeline */}
      <div className="space-y-6 max-w-4xl mx-auto pt-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          Previous Release Archive
        </h2>

        <div className="space-y-6 relative border-l-2 border-slate-800 ml-4 pl-6 sm:pl-8">
          {historicalReleases.map((rel, idx) => (
            <div key={idx} className="relative space-y-2 group">
              {/* Dot marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-cyan-400 transition-colors"></div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white font-mono">{rel.version}</h3>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {rel.date}
                </span>
              </div>

              <ul className="space-y-1.5 pt-1">
                {rel.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="text-xs sm:text-sm text-slate-400 flex items-start gap-2">
                    <span className="text-cyan-500 font-bold">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
