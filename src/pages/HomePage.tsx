import React from 'react';
import {
  Download,
  Sparkles,
  ArrowRight,
  Shield,
  Smartphone,
  CheckCircle2,
  Lock,
  Layers,
  HelpCircle,
  Mail,
  Zap,
  Sliders,
  Calculator,
  Video,
  Camera,
  Settings,
  TrendingUp,
  MessageSquareCode
} from 'lucide-react';
import { NexaConfig } from '../types';
import { AppMockup } from '../components/AppMockup';

interface HomePageProps {
  onNavigate: (page: string) => void;
  config: NexaConfig | null;
  onOpenAiChat?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, config, onOpenAiChat }) => {
  const version = config?.appLatestVersion || 'v2.5';
  const releaseDate = config?.releaseDate || 'September 2026';
  const supportEmail = config?.supportEmail || 'nexa.com.in21@gmail.com';

  const coreFeatures = [
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      title: 'NEXA AI Assistant',
      description: 'Conversational neural intelligence for instant answers, writing, scheduling, and everyday smart guidance.',
      badge: 'Core AI'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      title: 'Finance & Calculators',
      description: 'Built-in offline calculators for Loan EMI, SIP projections, GST computations, and compound growth schedules.',
      badge: 'Wealth Suite'
    },
    {
      icon: <Sliders className="w-5 h-5 text-blue-400" />,
      title: 'Productivity Tools',
      description: 'Everyday utility tray for quick audio profile switches, flashlight strobe modes, unit converters, and QR scanner.',
      badge: 'Smart Tools'
    },
    {
      icon: <Video className="w-5 h-5 text-purple-400" />,
      title: 'Video Generation',
      description: 'Creative prompt-to-video workflow interface to craft dynamic video clips directly from simple text descriptions.',
      badge: 'Creative AI'
    },
    {
      icon: <Camera className="w-5 h-5 text-amber-400" />,
      title: 'Object Finder',
      description: 'Camera-powered visual detection utility to identify real-world objects, products, and scene elements in real time.',
      badge: 'Vision AI'
    },
    {
      icon: <Shield className="w-5 h-5 text-rose-400" />,
      title: 'Focus / Protection',
      description: 'Distraction-free focus sessions with customizable timers, protected lockouts, and biometric security layers.',
      badge: 'Protection'
    },
    {
      icon: <Settings className="w-5 h-5 text-cyan-300" />,
      title: 'Settings & Theming',
      description: 'Clean customization console for theme appearance, battery optimization, notifications, and profile preferences.',
      badge: 'AMOLED Dark'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* Hero Section */}
      <section id="hero-section" className="relative pt-10 sm:pt-16 lg:pt-20 overflow-hidden">
        {/* Glow ambient background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Action CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>NEXA.COM.IN 21</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Official Release {version}</span>
              </div>

              {/* Title & Slogan */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08]">
                  Your AI. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                    Your Assistant.
                  </span> <br />
                  Your Tools.
                </h1>
                <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  The official product portal for NEXA — uniting conversational intelligence, offline financial tools, smart productivity utilities, video generation, object recognition, and focus protection for Android.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-download-nexa-btn"
                  onClick={() => onNavigate('download')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-bold text-base hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] flex items-center gap-2.5 cursor-pointer"
                >
                  <Download className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                  Download NEXA ({version})
                </button>

                <button
                  id="hero-explore-nexa-btn"
                  onClick={() => onNavigate('features')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800/90 border border-slate-700 font-semibold text-base transition-all flex items-center gap-2 cursor-pointer"
                >
                  Explore Features
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </button>

                <button
                  id="hero-contact-nexa-btn"
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3.5 rounded-xl bg-transparent hover:bg-slate-900/60 text-cyan-300 border border-cyan-500/30 font-medium text-base transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Contact NEXA
                </button>
              </div>

              {/* Trust & Release Quick Metric Bar */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xs text-slate-400 font-mono">Current Build</div>
                  <div className="text-base font-bold text-white mt-0.5">{version}</div>
                  <div className="text-[11px] text-cyan-400">Verified APK</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">Target Platform</div>
                  <div className="text-base font-bold text-white mt-0.5">Android 8.0+</div>
                  <div className="text-[11px] text-slate-400">API Level 26+</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">Official Domain</div>
                  <div className="text-base font-bold text-white mt-0.5 truncate">nexa.com.in</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> SSL Secured
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive App Hardware Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <AppMockup version={version} />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Separation Notice Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#071120] via-slate-900 to-[#071120] border border-cyan-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <Smartphone className="w-3.5 h-3.5" />
                SYSTEM BOUNDARY CLARITY
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Official Web Portal vs. Native Android Application
              </h3>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                This website is the official public product and company portal for NEXA. The native Android application delivers device-level capabilities such as the Hey NEXA voice assistant, automated phone calls, alarms, Android permissions, FocusLock barrier controls, and background services.
              </p>
            </div>
            <button
              id="architecture-download-cta"
              onClick={() => onNavigate('download')}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-semibold text-sm transition-colors cursor-pointer"
            >
              Get Android App
            </button>
          </div>
        </div>
      </section>

      {/* Core Ecosystem Features */}
      <section id="features-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Unified Intelligent Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Everyday Excellence
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            NEXA combines conversational neural reasoning, offline finance calculations, everyday utilities, and creative tools into a single, cohesive experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coreFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}

          {/* Ask AI Agent Callout Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/50 to-blue-950/40 border border-cyan-500/40 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-400/30">
                  Interactive AI
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Ask NEXA AI Now</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Test our integrated AI assistant directly on this official website. Ask any question about NEXA or general topics.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => {
                  const floatingBtn = document.getElementById('ask-nexa-ai-floating-btn');
                  if (floatingBtn) floatingBtn.click();
                  else onNavigate('ai-help');
                }}
                className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Open AI Chat
              </button>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            id="view-all-features-btn"
            onClick={() => onNavigate('features')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-sm font-semibold transition-colors cursor-pointer"
          >
            Explore Full NEXA Feature Specs
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </section>

      {/* Latest Version & What's New Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#060d1b] border border-slate-800 p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                LATEST RELEASE HIGHLIGHTS
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                What's New in NEXA {version}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {config?.releaseNotes || 'Upgraded NEXA AI Assistant, comprehensive Finance tools, creative Video Generation, and intelligent Object Finder.'}
              </p>

              <div className="space-y-2 pt-2">
                {(config?.whatIsNew || [
                  "NEXA AI Assistant with responsive conversational intelligence and smart utilities",
                  "Comprehensive Finance department with SIP, EMI, GST, and Compound Interest calculators",
                  "AI Video Generation tools for prompt-to-video creative workflows",
                  "Object Finder visual detection utility for quick object identification"
                ]).slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center space-y-4 shadow-lg">
              <div className="text-xs font-mono uppercase text-slate-400">Current Distribution</div>
              <div className="text-3xl font-black text-white font-mono">{version}</div>
              <div className="text-xs text-cyan-300 font-mono">Released: {releaseDate}</div>

              <div className="space-y-2 pt-2">
                <button
                  id="whatsnew-download-btn"
                  onClick={() => onNavigate('download')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  Download Verified APK
                </button>

                <button
                  id="whatsnew-changelog-btn"
                  onClick={() => onNavigate('updates')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  View Historical Changelogs
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Only download from the official nexa.com.in distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              NEXA ENGINEERING & DESIGN
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Professional Digital Services
            </h2>
          </div>
          <button
            id="home-explore-services-btn"
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Explore all 8 service tracks
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Website Development</h4>
            <p className="text-xs text-slate-400">High-performance full-stack web applications with sub-second speeds.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Android App Development</h4>
            <p className="text-xs text-slate-400">Native Kotlin & Compose apps with hardware and background services.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Video & Motion Creation</h4>
            <p className="text-xs text-slate-400">Cinema-grade 3D product animations and interactive walkthroughs.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">AI Integration & RAG</h4>
            <p className="text-xs text-slate-400">Custom LLM pipelines, autonomous agents, and speech systems.</p>
          </div>
        </div>
      </section>

      {/* Official Inquiries & Support Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Connect With the NEXA Team
            </h3>
            <p className="text-sm text-slate-300">
              Have questions regarding the NEXA Android app, version updates, or interested in commissioning custom software or video creation? Contact us directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              id="home-email-nexa-direct-btn"
              href={`mailto:${supportEmail}`}
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors flex items-center gap-2 shadow-md"
            >
              <Mail className="w-4 h-4 stroke-[2.5]" />
              Email Official NEXA ({supportEmail})
            </a>
            <button
              id="home-submit-enquiry-btn"
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              Submit Online Enquiry Form
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
