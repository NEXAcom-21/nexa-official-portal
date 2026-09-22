import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Calculator,
  Sliders,
  Send,
  Battery,
  Wifi,
  Signal,
  CheckCircle2,
  Video,
  Scan,
  Settings,
  Flame,
  Search,
  Check,
  TrendingUp,
  Camera,
  Play
} from 'lucide-react';

interface AppMockupProps {
  initialTab?: 'assistant' | 'finance' | 'tools' | 'video' | 'object_finder' | 'focuslock' | 'settings';
  standalone?: boolean;
  version?: string;
}

export const AppMockup: React.FC<AppMockupProps> = ({
  initialTab = 'assistant',
  standalone = false,
  version = 'v2.5'
}) => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'finance' | 'tools' | 'video' | 'object_finder' | 'focuslock' | 'settings'>(initialTab);

  return (
    <div id="nexa-interactive-device-mockup" className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]">
      {/* Outer Glow Backdrop */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/30 via-blue-600/20 to-cyan-400/30 rounded-[42px] blur-xl opacity-75"></div>

      {/* Hardware Frame */}
      <div className="relative rounded-[40px] border-[6px] border-slate-800 bg-[#050b14] p-3 shadow-2xl ring-1 ring-cyan-500/30 overflow-hidden">
        {/* Top Speaker / Camera Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-between px-3 z-30 border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-cyan-400"></div>
          </div>
        </div>

        {/* Screen Bezel */}
        <div className="rounded-[30px] bg-[#070e1c] border border-slate-800/80 overflow-hidden flex flex-col h-[590px] text-slate-100">
          {/* Status Bar */}
          <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3 text-cyan-400" />
              <Wifi className="w-3 h-3 text-cyan-400" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* App Header */}
          <div className="px-4 py-2 border-b border-slate-800/80 flex items-center justify-between bg-[#040812]/90">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                NX
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  NEXA
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[9px] text-cyan-400 font-mono">{version} Ecosystem</div>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-cyan-950/60 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
              Active
            </div>
          </div>

          {/* Screen Content Based on Active Tab */}
          <div className="flex-1 p-3.5 overflow-hidden flex flex-col justify-between">
            {activeTab === 'assistant' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    NEXA AI Assistant
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "Hi! I'm NEXA AI. I can assist you with answers, calculate investments, draft messages, or launch your smart utilities."
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="ml-auto max-w-[85%] p-2.5 rounded-xl bg-blue-600/30 border border-blue-500/30 text-right">
                    <p className="text-xs text-white">"What are the top features in NEXA v2.5?"</p>
                    <span className="text-[9px] text-slate-400">09:39 AM</span>
                  </div>

                  <div className="max-w-[90%] p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      NEXA AI Response
                    </div>
                    <p className="text-[11px] text-slate-300">
                      NEXA v2.5 brings AI Assistant, Finance calculators, everyday Tools, Video Generation, Object Finder, and Focus Protection.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                    <span className="truncate">Ask NEXA AI anything...</span>
                    <Send className="w-3.5 h-3.5 text-cyan-400 ml-auto" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Finance Department
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">Offline</span>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-400">SIP Wealth Projection (15 Years @ 12%)</div>
                  <div className="text-2xl font-bold text-white font-mono">₹50,45,760</div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Invested:</span>
                      <p className="font-bold text-white">₹18,00,000</p>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Est. Returns:</span>
                      <p className="font-bold text-emerald-400">₹32,45,760</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px]">
                    <div className="font-bold text-cyan-300">Loan EMI</div>
                    <span className="text-slate-400 text-[9px]">Home / Car</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px]">
                    <div className="font-bold text-cyan-300">GST Calc</div>
                    <span className="text-slate-400 text-[9px]">5, 12, 18, 28%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px]">
                    <div className="font-bold text-cyan-300">Compound</div>
                    <span className="text-slate-400 text-[9px]">Annual / Qtr</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Productivity Tools</span>
                  <span className="text-[10px] text-cyan-400 font-mono">4 Utilities</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left">
                    <Sliders className="w-4 h-4 text-cyan-400 mb-1" />
                    <div className="text-xs font-bold text-white">Audio Profiles</div>
                    <div className="text-[10px] text-slate-400">Meeting Mute</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left">
                    <Flame className="w-4 h-4 text-amber-400 mb-1" />
                    <div className="text-xs font-bold text-white">Flashlight Strobe</div>
                    <div className="text-[10px] text-slate-400">SOS & Intensity</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left">
                    <Scan className="w-4 h-4 text-purple-400 mb-1" />
                    <div className="text-xs font-bold text-white">QR Scanner</div>
                    <div className="text-[10px] text-slate-400">Fast Detection</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left">
                    <Calculator className="w-4 h-4 text-emerald-400 mb-1" />
                    <div className="text-xs font-bold text-white">Unit Converter</div>
                    <div className="text-[10px] text-slate-400">Currencies & Metric</div>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[10px] text-cyan-200">
                  ⚡ Everyday smart utilities in one lightweight app.
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-cyan-400" />
                    Video Generation
                  </div>
                  <span className="text-[10px] text-purple-400 font-mono bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">AI Studio</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Prompt</div>
                  <div className="p-2 rounded-lg bg-slate-950 text-[11px] text-slate-200 border border-slate-800">
                    "Futuristic cityscape at dusk with luminous cyber roadways and flying drones"
                  </div>
                  <div className="relative rounded-lg overflow-hidden border border-cyan-500/30 h-28 bg-gradient-to-tr from-cyan-950/80 via-blue-950 to-slate-950 flex items-center justify-center">
                    <Play className="w-8 h-8 text-cyan-400/80 fill-cyan-400/20" />
                    <span className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-300">1080p • 00:06</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 px-1">
                  <span>Aspect: <strong className="text-white">16:9 Landscape</strong></span>
                  <span className="text-cyan-400 font-semibold">Render Ready</span>
                </div>
              </div>
            )}

            {activeTab === 'object_finder' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    Object Finder
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">Live Camera</span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-800 h-44 bg-slate-950 flex items-center justify-center">
                  <div className="absolute inset-4 border border-dashed border-cyan-400/60 rounded-lg flex items-center justify-center">
                    <div className="p-1.5 bg-cyan-950/80 border border-cyan-500/40 rounded text-[10px] text-cyan-300 font-mono">
                      Smart Watch (98.4%)
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 text-[9px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded">
                    FOV: 68° • 60 FPS
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-between">
                  <span>Detected: <strong className="text-white">Consumer Electronics</strong></span>
                  <span className="text-emerald-400 font-bold">Identified</span>
                </div>
              </div>
            )}

            {activeTab === 'focuslock' && (
              <div className="space-y-3 animate-in fade-in duration-200 flex-1 flex flex-col justify-center">
                <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-[#091122] border border-cyan-500/30 text-center space-y-2.5">
                  <div className="w-9 h-9 mx-auto rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono">
                      Focus & Protection
                    </div>
                    <div className="text-2xl font-mono font-bold text-white tracking-tight mt-0.5">
                      00:45:00
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Distractions minimized
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left pt-1">
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px]">
                      <span className="text-slate-400">Status:</span>
                      <p className="font-bold text-cyan-300 mt-0.5">Focus Active</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px]">
                      <span className="text-slate-400">Protection:</span>
                      <p className="font-bold text-emerald-400 mt-0.5">Biometric</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-cyan-400" />
                  NEXA Settings
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Appearance Theme</div>
                      <div className="text-[9px] text-slate-400">Futuristic AMOLED Dark</div>
                    </div>
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Battery Optimization</div>
                      <div className="text-[9px] text-slate-400">Ultra-low background usage</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Enabled</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Notifications</div>
                      <div className="text-[9px] text-slate-400">Daily summary & alerts</div>
                    </div>
                    <span className="text-[10px] text-cyan-300 font-mono">Custom</span>
                  </div>
                </div>
              </div>
            )}

            {/* In-Mockup Preview Switcher Tabs */}
            {!standalone && (
              <div className="mt-auto pt-2 border-t border-slate-800/80 grid grid-cols-4 gap-1">
                <button
                  id="mockup-tab-assistant"
                  onClick={() => setActiveTab('assistant')}
                  className={`py-1.5 rounded-lg flex flex-col items-center justify-center text-[9px] font-medium transition-colors cursor-pointer ${
                    activeTab === 'assistant'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 mb-0.5" />
                  AI Chat
                </button>
                <button
                  id="mockup-tab-finance"
                  onClick={() => setActiveTab('finance')}
                  className={`py-1.5 rounded-lg flex flex-col items-center justify-center text-[9px] font-medium transition-colors cursor-pointer ${
                    activeTab === 'finance'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calculator className="w-3 h-3 mb-0.5" />
                  Finance
                </button>
                <button
                  id="mockup-tab-tools"
                  onClick={() => setActiveTab('tools')}
                  className={`py-1.5 rounded-lg flex flex-col items-center justify-center text-[9px] font-medium transition-colors cursor-pointer ${
                    activeTab === 'tools'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3 h-3 mb-0.5" />
                  Tools
                </button>
                <button
                  id="mockup-tab-video"
                  onClick={() => setActiveTab('video')}
                  className={`py-1.5 rounded-lg flex flex-col items-center justify-center text-[9px] font-medium transition-colors cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3 h-3 mb-0.5" />
                  Video
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mockup Caption */}
      {!standalone && (
        <p className="text-center text-xs text-slate-400 mt-3 font-medium">
          Interactive UI Preview of NEXA ({version})
        </p>
      )}
    </div>
  );
};
