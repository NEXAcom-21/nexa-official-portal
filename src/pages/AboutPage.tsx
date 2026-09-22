import React from 'react';
import {
  Sparkles,
  Shield,
  Smartphone,
  Cpu,
  CheckCircle2,
  Code2,
  Mail,
  Download,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { NexaConfig } from '../types';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  config: NexaConfig | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, config }) => {
  const version = config?.appLatestVersion || 'v2.2';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          ORGANIZATION & PRODUCT MISSION
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About NEXA
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          NEXA (NEXA.COM.IN 21) is a unified personal AI assistant, distraction barrier, and digital tools ecosystem engineered from the ground up for modern Android smartphones.
        </p>
      </div>

      {/* Origin & Core Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              The Genesis of NEXA
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why We Built NEXA
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              Contemporary smartphones are flooded with fragmented utilities: one app for alarms, another for voice notes, a third for locking distracting apps, and third-party web chat interfaces for AI queries. Each consumes memory, displays intrusive ads, and tracks user behavior.
            </p>
            <p>
              NEXA was born out of a singular design philosophy: <strong>"Your AI. Your Assistant. Your Tools."</strong> We unified hands-free voice automation ("Hey NEXA"), neural conversational intelligence, offline financial math, and strict FocusLock distraction prevention into a singular, dark-AMOLED native Android engine.
            </p>
            <p>
              The official website at <strong className="text-cyan-300 font-mono">nexa.com.in</strong> exists as our transparent distribution platform, knowledge repository, and client solutions hub.
            </p>
          </div>
        </div>

        {/* Philosophy Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              01
            </div>
            <h4 className="text-base font-bold text-white">Zero Bloat</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No sponsored news feeds, no unsolicited banner advertisements, and no tracking telemetry.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              02
            </div>
            <h4 className="text-base font-bold text-white">Offline Resilience</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Financial formulas, alarms, and hardware toggles compute locally on your device without pinging remote servers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              03
            </div>
            <h4 className="text-base font-bold text-white">Focus First</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              FocusLock actively helps users reclaim hours of attention from algorithmic addiction feeds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              04
            </div>
            <h4 className="text-base font-bold text-white">Native Performance</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Written with native Android Kotlin and Jetpack Compose for sub-10ms responsiveness.
            </p>
          </div>
        </div>
      </div>

      {/* Brand & Organization Identity */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#060c18] border border-cyan-500/30 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div>
            <div className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              Legal & Domain Entity
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">NEXA.COM.IN 21</h3>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-cyan-950/80 text-cyan-300 font-mono text-xs border border-cyan-500/30">
            Registered Entity & Official Web Portal
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
          <div className="space-y-2">
            <h4 className="font-bold text-white">Corporate Mission</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering smartphone owners with private, high-speed assistant workflows and professional bespoke software engineering services.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white">Security & Code Integrity</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every production APK binary is compiled on isolated build nodes and verified with cryptographic signature hashes.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white">Direct Communication</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The project leadership actively reviews community suggestions, customer bug logs, and custom project enquiries.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-xl font-bold text-white">Ready to join the NEXA ecosystem?</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            id="about-download-btn"
            onClick={() => onNavigate('download')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            Download NEXA APK ({version})
          </button>
          <button
            id="about-contact-btn"
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors cursor-pointer"
          >
            Contact the Leadership
          </button>
        </div>
      </div>
    </div>
  );
};
