import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  Shield,
  Calculator,
  Sliders,
  Lock,
  Smartphone,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { NexaScreenshot, ScreenshotCategory } from '../types';

interface ScreenshotsPageProps {
  screenshots: NexaScreenshot[];
  onNavigate: (page: string) => void;
}

export const ScreenshotsPage: React.FC<ScreenshotsPageProps> = ({ screenshots, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ScreenshotCategory>('All');
  const [activeModal, setActiveModal] = useState<NexaScreenshot | null>(null);

  const categories: ScreenshotCategory[] = [
    'All',
    'Home',
    'NEXA AI',
    'Hey NEXA',
    'NEXA Tools',
    'Finance',
    'Settings',
    'Login',
    'FocusLock integration'
  ];

  const filteredScreenshots =
    selectedCategory === 'All'
      ? screenshots
      : screenshots.filter((s) => s.category === selectedCategory);

  // Helper to render the realistic phone screen inside each screenshot card
  const renderScreenMockup = (item: NexaScreenshot) => {
    switch (item.mockupType) {
      case 'assistant':
        return (
          <div className="w-full h-full bg-[#050b14] p-3 text-xs flex flex-col justify-between font-sans select-none">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[10px] text-cyan-400">
                <span>NEXA AI Neural Console</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[10px] text-slate-200">
                "Hello Alex, your morning routine is ready. 2 upcoming calls scheduled."
              </div>
              <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-[10px] text-slate-200 ml-auto max-w-[85%] text-right">
                "Summarize tomorrow's product roadmap priorities."
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[9px] text-slate-300">
                • 09:30 AM: Architecture review<br />
                • 02:00 PM: FocusLock deep session<br />
                • 05:00 PM: APK release signing
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex justify-between">
              <span>Token Latency: 12ms</span>
              <span className="text-cyan-400">Context Active</span>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="w-full h-full bg-[#040913] p-4 flex flex-col items-center justify-center text-center space-y-3 select-none">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center animate-pulse">
              <Mic className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
                "Hey NEXA" Voice Active
              </div>
              <p className="text-xs font-bold text-white">
                "Call Dr. Sharma (Mobile)"
              </p>
              <div className="text-[9px] text-slate-400">
                Calling via Android Telecom API...
              </div>
            </div>
            <div className="w-full p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[9px] text-emerald-400 flex items-center justify-center gap-1">
              <span>Connecting to Bluetooth Hands-free</span>
            </div>
          </div>
        );

      case 'focuslock':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#091122] to-[#040813] p-4 flex flex-col items-center justify-center text-center space-y-3 select-none">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[9px] font-mono text-purple-300 uppercase">FocusLock Active</div>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">00:35:12</div>
              <div className="text-[9px] text-slate-400">Social Apps Blocked</div>
            </div>
            <div className="w-full p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[9px] text-slate-300">
              Master PIN Emergency Bypass Available
            </div>
          </div>
        );

      case 'finance':
        return (
          <div className="w-full h-full bg-[#050b14] p-3 flex flex-col justify-between text-xs select-none">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[10px] text-emerald-400 font-bold">
                <span>SIP Wealth Calculator</span>
                <span className="text-slate-400 font-normal">Offline</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-300">
                  <span>Monthly Investment:</span>
                  <span className="font-bold text-white">₹15,000</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Expected Return:</span>
                  <span className="font-bold text-emerald-400">14.5% p.a.</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Time Horizon:</span>
                  <span className="font-bold text-white">15 Years</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-center">
                <span className="text-[9px] text-slate-400 block">Projected Corpus</span>
                <span className="text-sm font-bold text-emerald-300 font-mono">₹92,84,120</span>
              </div>
            </div>
            <div className="text-[9px] text-slate-500 text-center">No internet connection required</div>
          </div>
        );

      case 'security':
        return (
          <div className="w-full h-full bg-[#050b14] p-4 flex flex-col items-center justify-center text-center space-y-3 select-none">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-rose-300 uppercase">Biometric Vault</div>
              <div className="text-xs font-bold text-white mt-1">Fingerprint Confirmed</div>
              <div className="text-[9px] text-slate-400 mt-0.5">AES-256 Vault Unlocked</div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-[#050b14] p-3 flex flex-col justify-between text-xs select-none">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-cyan-400 uppercase">NEXA Android Tools</div>
              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">Flashlight SOS</div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">Meeting Mute</div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">Battery Saver</div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">Wi-Fi Telemetry</div>
              </div>
            </div>
            <div className="text-[9px] text-slate-400">Status: Running</div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Smartphone className="w-3.5 h-3.5" />
          OFFICIAL APPLICATION INTERFACE GALLERY
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          NEXA App Screenshots
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Explore official visual screenshots and interface screens across all eight core Android modules. Click any screen to view full resolution details.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap pb-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`screenshot-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Screenshots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {filteredScreenshots.map((item) => (
          <div
            key={item.id}
            id={`screenshot-card-${item.id}`}
            onClick={() => setActiveModal(item)}
            className="group rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 p-4 transition-all duration-200 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] flex flex-col justify-between cursor-pointer"
          >
            {/* Phone Bezel Frame Preview */}
            <div className="relative w-full aspect-[9/16] rounded-2xl bg-[#030712] border-2 border-slate-800 group-hover:border-cyan-500/30 overflow-hidden shadow-inner flex flex-col">
              {/* Dynamic Camera Notch */}
              <div className="w-16 h-2.5 bg-slate-900 rounded-full mx-auto mt-1.5 mb-1 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40"></div>
              </div>

              {/* Render Simulated Authentic Screen */}
              <div className="flex-1 overflow-hidden">
                {renderScreenMockup(item)}
              </div>

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-cyan-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/40 shadow-lg">
                  <Maximize2 className="w-3.5 h-3.5" />
                  View Screen
                </div>
              </div>
            </div>

            {/* Description & Metadata */}
            <div className="pt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {item.category}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal Lightbox */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-[#060c18] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              id="close-screenshot-modal-btn"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 uppercase">
                {activeModal.category}
              </span>
              <span className="text-xs text-slate-400">Screen Detail View</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{activeModal.title}</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {activeModal.description}
              </p>
            </div>

            {/* High-detail preview frame */}
            <div className="w-full h-64 rounded-2xl bg-[#030712] border border-slate-800 p-2 overflow-hidden shadow-inner">
              {renderScreenMockup(activeModal)}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200">Native Android Specification</div>
              <p>This layout operates locally on Android 8.0+ devices with edge-to-edge support and AMOLED black optimization.</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                id="modal-download-app-btn"
                onClick={() => {
                  setActiveModal(null);
                  onNavigate('download');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
              >
                Download NEXA App
              </button>
              <button
                id="modal-dismiss-btn"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
