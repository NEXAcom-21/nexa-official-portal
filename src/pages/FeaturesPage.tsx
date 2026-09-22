import React from 'react';
import {
  Sparkles,
  Shield,
  Calculator,
  Sliders,
  Smartphone,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Download,
  Video,
  Camera,
  Settings,
  TrendingUp,
  Cpu,
  Lock,
  Layers
} from 'lucide-react';
import { NexaConfig } from '../types';

interface FeaturesPageProps {
  onNavigate: (page: string) => void;
  config: NexaConfig | null;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate, config }) => {
  const version = config?.appLatestVersion || 'v2.5';

  const departments = [
    {
      icon: Sparkles,
      title: 'NEXA AI Assistant',
      subtitle: 'Conversational Neural Reasoning',
      desc: 'Adaptive conversational assistant helping with questions, drafting messages, summarizing articles, and orchestrating everyday tasks.',
      bullets: [
        'Multi-turn context retention across conversations',
        'Direct answering of complex queries and writing assistance',
        'Private local memory storage with 1-tap history purge',
        'Fast response generation with clean UI layout'
      ],
      badge: 'Core Intelligence',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30'
    },
    {
      icon: TrendingUp,
      title: 'Finance & Calculators',
      subtitle: 'Built-in Wealth Math Suite',
      desc: 'Comprehensive financial calculators for personal investments, loans, taxes, and interest projections—running 100% offline.',
      bullets: [
        'Loan EMI calculator with detailed amortization breakdowns',
        'SIP (Systematic Investment Plan) wealth projection model',
        'Instant GST (Goods & Services Tax) tax calculation',
        'Compound interest and wealth timeline schedules'
      ],
      badge: 'Finance Suite',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
    },
    {
      icon: Sliders,
      title: 'NEXA Tools Suite',
      subtitle: 'Everyday Device Utilities',
      desc: 'One-tap access to fast utilities including flashlight strobe controls, audio profiles, QR code scanner, and unit converters.',
      bullets: [
        'Flashlight strobe and variable intensity controls',
        'Audio profile switcher (Meeting Mute, Silent, Outdoor)',
        'Built-in camera QR code & barcode scanner',
        'Comprehensive multi-metric unit converter'
      ],
      badge: 'Smart Tools',
      badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-500/30'
    },
    {
      icon: Video,
      title: 'AI Video Generation',
      subtitle: 'Prompt-to-Video Creation',
      desc: 'Creative prompt-to-video workflow interface allowing users to craft dynamic video clips from natural language descriptions.',
      bullets: [
        'Text prompt-to-video clip generation',
        'Preset style themes (Cinematic, Futuristic, Minimalist)',
        'Custom aspect ratio selection (16:9, 9:16, 1:1)',
        'Direct video export and gallery storage'
      ],
      badge: 'Creative AI',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/30'
    },
    {
      icon: Camera,
      title: 'Intelligent Object Finder',
      subtitle: 'Live Camera Visual Recognition',
      desc: 'Camera-based visual intelligence to recognize objects, products, and environmental elements in real time.',
      bullets: [
        'Real-time object detection and categorization',
        'High-confidence bounding box feedback',
        'Product & text visual classification',
        'Camera permission strictly active only when in use'
      ],
      badge: 'Vision AI',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/30'
    },
    {
      icon: Shield,
      title: 'Focus & Protection',
      subtitle: 'Distraction Barrier & Privacy',
      desc: 'Enforce distraction-free study and work sessions with custom timers, plus biometric security for sensitive tools.',
      bullets: [
        'Deep focus session countdown timers',
        'Configurable distraction lockout modes',
        'Biometric fingerprint and PIN protection',
        'Emergency phone whitelist remains accessible'
      ],
      badge: 'Protection',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/30'
    },
    {
      icon: Settings,
      title: 'Settings & Appearance',
      subtitle: 'Customization & Performance',
      desc: 'Tailor your NEXA experience with AMOLED dark themes, battery optimization toggles, and notification preferences.',
      bullets: [
        'Futuristic AMOLED dark visual styling',
        'Ultra-low background battery consumption',
        'Granular notification controls and alert summaries',
        'Local data management and cache clear tools'
      ],
      badge: 'Preferences',
      badgeColor: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Cpu className="w-3.5 h-3.5" />
          OFFICIAL PRODUCT DEPARTMENTS
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          NEXA Features & Capabilities
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Explore the 7 core departments powering NEXA {version} on Android.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {departments.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{item.subtitle}</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  {item.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Distinction Summary */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#071122] via-slate-900 to-[#071122] border border-cyan-500/30 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">
          Ready to Experience NEXA {version}?
        </h3>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed">
          Download the authentic Android APK to enjoy all 7 core departments right on your device.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            id="features-download-cta"
            onClick={() => onNavigate('download')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            Download APK ({version})
          </button>
        </div>
      </div>
    </div>
  );
};
