import React, { useState } from 'react';
import {
  Wrench,
  Lock,
  ShieldCheck,
  Terminal,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { DeveloperToolkit } from '../components/tools/DeveloperToolkit';
import { NexaSecurityTool } from '../components/tools/NexaSecurityTool';
import { FocusLockTool } from '../components/tools/FocusLockTool';
import { DocumentPdfTool } from '../components/tools/DocumentPdfTool';
import { NexaConfig } from '../types';

interface ToolsPageProps {
  config: NexaConfig | null;
  onNavigate: (page: string) => void;
  initialTool?: string;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ config, onNavigate, initialTool }) => {
  const [activeTool, setActiveTool] = useState<string | null>(initialTool || null);
  const [downloadModalTool, setDownloadModalTool] = useState<string | null>(null);

  const toolsCatalog = [
    {
      id: 'focuslock',
      name: 'FocusLock',
      category: 'Productivity & App Blocker',
      version: 'v1.0',
      status: 'Pending Binary',
      statusType: 'pending',
      description: 'System-level distraction blocker, scheduled lockout profiles, app shielding, and customizable deep-work focus timer.',
      icon: Lock,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-950/60 border-blue-500/30',
      downloadAvailable: false,
      downloadNotice: 'FocusLock v1.0 binary has not been uploaded to storage yet. The download link is disabled until an administrator uploads the compiled APK binary via Admin APK Management.'
    },
    {
      id: 'security',
      name: 'NEXA Security',
      category: 'Security & Defensive Utility',
      version: 'v2.1',
      status: 'Active / Defensive',
      statusType: 'active',
      description: 'Defensive device posture auditing, TLS 1.3 transport validation, Android permissions directory, dangerous-permission warnings, and security checklist.',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-950/60 border-emerald-500/30',
      downloadAvailable: true,
      downloadTarget: 'download',
      downloadNotice: 'Integrated directly inside the official NEXA APK v2.5 release package.'
    },
    {
      id: 'devtools',
      name: 'Developer Toolkit',
      category: 'Developer Tools & Games',
      version: 'v2.5',
      status: 'Active & Verified',
      statusType: 'active',
      description: 'Complete offline developer suite: JSON Formatter & Minifier, UUID v4 Generator, Base64, URL Encoder, Timestamp Converter, HEX/RGB, Dev Notes, plus 2 interactive coding games (Code Debug Challenge & Logic Builder).',
      icon: Terminal,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-950/60 border-cyan-500/30',
      downloadAvailable: true,
      downloadTarget: 'download',
      downloadNotice: 'Included out-of-the-box inside the official NEXA APK suite.'
    },
    {
      id: 'documents',
      name: 'Document / PDF Tools',
      category: 'Productivity & Documents',
      version: 'v1.2',
      status: 'Active (Web Engine)',
      statusType: 'active',
      description: 'Document analysis, real-time word and character metrics, estimated read times, buffer editing, clean text export, and OCR companion status.',
      icon: FileText,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-950/60 border-purple-500/30',
      downloadAvailable: true,
      downloadTarget: 'download',
      downloadNotice: 'Web text analyzer is ready now; native OCR module is bundled in the NEXA APK.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-2">
            <Wrench className="w-3.5 h-3.5" />
            NEXA OFFICIAL TOOLS CATALOG
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ecosystem Tools & Utilities
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Explore and launch specialized utilities designed for developers, productivity enthusiasts, and device security audits.
          </p>
        </div>

        {activeTool && (
          <button
            onClick={() => setActiveTool(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer self-start sm:self-center"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Tools Catalog
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {!activeTool ? (
        /* Tools Catalog Grid */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolsCatalog.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  id={`tool-card-${tool.id}`}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${tool.iconBg} ${tool.iconColor} shadow-lg shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {tool.name}
                          </h2>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400 font-mono">
                              {tool.category}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {tool.version}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono border shrink-0 ${
                          tool.statusType === 'active'
                            ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-950/60 border-amber-500/30 text-amber-300'
                        }`}
                      >
                        {tool.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <button
                      id={`open-tool-btn-${tool.id}`}
                      onClick={() => setActiveTool(tool.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    >
                      <span>Open / Launch</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {tool.downloadAvailable ? (
                      <button
                        onClick={() => onNavigate('download')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        Download APK
                      </button>
                    ) : (
                      <button
                        onClick={() => setDownloadModalTool(tool.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-950/40 text-amber-300 text-xs font-semibold border border-amber-500/30 hover:bg-amber-950/60 transition-colors cursor-pointer"
                        title="Binary status info"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        Pending Binary
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Launched Tool View */
        <div className="space-y-6">
          {/* Quick Sub-Navigation Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
            {toolsCatalog.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  activeTool === tool.id
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <tool.icon className="w-3.5 h-3.5" />
                {tool.name}
              </button>
            ))}
          </div>

          {/* Render Active Component */}
          {activeTool === 'focuslock' && <FocusLockTool />}
          {activeTool === 'security' && <NexaSecurityTool />}
          {activeTool === 'devtools' && <DeveloperToolkit />}
          {activeTool === 'documents' && <DocumentPdfTool />}
        </div>
      )}

      {/* Binary Status Modal */}
      {downloadModalTool && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">APK Binary Notice</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {toolsCatalog.find((t) => t.id === downloadModalTool)?.downloadNotice}
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setDownloadModalTool(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDownloadModalTool(null);
                  onNavigate('admin');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold"
              >
                Go to Admin Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
