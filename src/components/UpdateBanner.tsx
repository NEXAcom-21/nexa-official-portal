import React, { useState } from 'react';
import { Download, Sparkles, X, ArrowRight } from 'lucide-react';
import { NexaConfig } from '../types';

interface UpdateBannerProps {
  config: NexaConfig | null;
  onNavigate: (page: string) => void;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({ config, onNavigate }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!config || dismissed) return null;

  // Show only if updateAvailable is true AND appLatestVersion != currentClientVersion
  const isNewVersionAvailable =
    config.updateAvailable &&
    config.appLatestVersion &&
    config.currentClientVersion &&
    config.appLatestVersion !== config.currentClientVersion;

  if (!isNewVersionAvailable && !config.announcement) return null;

  const targetUrl = config.apkUrl || config.playStoreUrl || '#';

  return (
    <div
      id="nexa-global-update-banner"
      className="relative z-40 bg-gradient-to-r from-cyan-950/80 via-blue-950/90 to-slate-950 border-b border-cyan-500/30 px-4 py-2.5 text-xs sm:text-sm text-cyan-100 shadow-[0_4px_20px_rgba(6,182,212,0.15)] backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline" />
              New NEXA update available:
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/40">
              {config.appLatestVersion}
            </span>
            <span className="text-slate-400 hidden md:inline">
              (Previous: {config.currentClientVersion})
            </span>
            {config.announcement && (
              <span className="text-slate-300 truncate max-w-md hidden lg:inline">
                — {config.announcement}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            id="update-nexa-btn"
            onClick={() => {
              if (targetUrl.startsWith('http')) {
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
              } else {
                onNavigate('download');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs hover:from-cyan-400 hover:to-blue-500 transition-all shadow-sm shadow-cyan-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            UPDATE NEXA
          </button>
          <button
            id="view-update-notes-btn"
            onClick={() => onNavigate('updates')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors text-xs border border-slate-700 cursor-pointer"
          >
            Changelog
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            id="dismiss-update-banner-btn"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
