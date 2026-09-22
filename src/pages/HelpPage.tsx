import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Globe,
  Shield,
  PhoneCall,
  Mic,
  Sliders,
  Calculator,
  Lock,
  Mail,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { HelpArticle } from '../types';

interface HelpPageProps {
  articles: HelpArticle[];
  onNavigate: (page: string) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ articles, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(articles[0]?.id || null);

  const categories = [
    'All',
    'Account & Setup',
    'Voice Assistant',
    'Permissions',
    'FocusLock & Tools',
    'Downloads & Updates',
    'General Support'
  ];

  // Comprehensive help topics covering all requested categories
  const comprehensiveTopics: {
    id: string;
    category: string;
    title: string;
    isAndroid: boolean;
    summary: string;
    steps: string[];
  }[] = [
    {
      id: 'h-login-google',
      category: 'Account & Setup',
      title: 'Google Sign-In and Account Synchronization',
      isAndroid: true,
      summary: 'Setting up Google authentication for seamless profile backups on Android.',
      steps: [
        'Open NEXA > Tap Profile > Choose "Sign in with Google".',
        'Verify your device has Google Play Services updated to the latest revision.',
        'If sign-in hangs, clear cache for Google Play Services in Android Settings > Apps.',
        'Your profile syncs device preferences, custom wake words, and FocusLock whitelist securely.'
      ]
    },
    {
      id: 'h-otp-trouble',
      category: 'Account & Setup',
      title: 'Mobile OTP Verification Troubleshooting',
      isAndroid: true,
      summary: 'What to do if SMS one-time verification code is not received.',
      steps: [
        'Ensure your phone has active cellular reception and SMS inbox is not full.',
        'Wait 60 seconds before requesting a "Resend OTP" code.',
        'Check that spam protection or SMS filtering apps (e.g., Truecaller) are not blocking short-code SMS.',
        'If issues persist, use Google Sign-In as an alternative instant authentication method.'
      ]
    },
    {
      id: 'h-voice-setup',
      category: 'Voice Assistant',
      title: 'Voice Assistant & Default Assistant Configuration',
      isAndroid: true,
      summary: 'How to replace Google Assistant with NEXA on Android home buttons and gestures.',
      steps: [
        'Navigate to Android Settings > Apps > Default Apps > Digital Assistant app.',
        'Select "NEXA" from the list of digital assistant providers.',
        'Grant the "Draw over other apps" and "Accessibility" permissions when requested.',
        'Now long-pressing the home button or swiping up from corner launches NEXA instantly.'
      ]
    },
    {
      id: 'h-mic-permission',
      category: 'Permissions',
      title: 'Microphone & Wake-Word Listening Permissions',
      isAndroid: true,
      summary: 'Ensuring NEXA has reliable background microphone access for "Hey NEXA".',
      steps: [
        'Go to Android Settings > Apps > NEXA > Permissions > Microphone.',
        'Set permission to "Allow only while using the app" or "Allow all the time" (if supported on Android 12+ for wake-word).',
        'Disable "Battery Optimization" for NEXA under Battery settings to prevent Android OS from killing the low-power wake-word daemon.'
      ]
    },
    {
      id: 'h-calling-contacts',
      category: 'Permissions',
      title: 'Contacts & Calling Permission for Hands-Free Dialing',
      isAndroid: true,
      summary: 'How hands-free phone calls function using Android Telecom API.',
      steps: [
        'Grant "Contacts" permission to allow NEXA to search names in your address book upon voice command.',
        'Grant "Phone" permission to allow NEXA to trigger the dialer without requiring physical touch.',
        'NEXA only dials the contact after verbal confirmation ("Calling Dr. Sharma. Proceed?").'
      ]
    },
    {
      id: 'h-alarms-commands',
      category: 'Voice Assistant',
      title: 'Native Alarm Scheduling & App Launching Commands',
      isAndroid: true,
      summary: 'Speaking voice commands for alarms, timers, and opening installed apps.',
      steps: [
        'Say "Hey NEXA, set an alarm for 6:30 AM tomorrow" — NEXA writes directly to the native Android AlarmManager.',
        'Say "Hey NEXA, launch Spotify" or "Hey NEXA, open Google Maps" — NEXA invokes the Android PackageManager to launch the application.',
        'Alarm commands work 100% offline without network connectivity.'
      ]
    },
    {
      id: 'h-focuslock-usage',
      category: 'FocusLock & Tools',
      title: 'FocusLock Deep Sessions & Emergency PIN Bypass',
      isAndroid: true,
      summary: 'Blocking distracting apps and using the emergency override code.',
      steps: [
        'Open NEXA Tools > FocusLock > Select session duration (e.g., 45 minutes) and choose blocked apps.',
        'Tap "Start Focus Session". A full-screen shield prevents opening the selected distracting apps.',
        'In case of emergency, tap "Emergency Override" on the lock screen and input your 6-digit Master PIN.',
        'Whitelisted phone contacts and emergency services (112 / 911) are never blocked.'
      ]
    },
    {
      id: 'h-finance-tools',
      category: 'FocusLock & Tools',
      title: 'Offline Financial Calculators (EMI, SIP, GST)',
      isAndroid: true,
      summary: 'Using NEXA built-in math and investment calculators without internet.',
      steps: [
        'Open NEXA > Tools tab > Tap "Finance Suite".',
        'Choose from EMI Loan Calculator, SIP Compound Wealth, GST Breakdown, or Flat vs Reducing interest comparator.',
        'All calculations are processed on-device and can be exported as clean text summaries.'
      ]
    },
    {
      id: 'h-download-apk',
      category: 'Downloads & Updates',
      title: 'Resolving APK Installation & "App Not Installed" Errors',
      isAndroid: true,
      summary: 'Troubleshooting package installer errors when downloading the APK from nexa.com.in.',
      steps: [
        'Verify your phone has at least 150MB of free internal storage.',
        'If upgrading from an early test version, uninstall the older prototype if signing keys differ.',
        'In Chrome, enable "Install unknown apps" under Settings > Apps > Chrome.',
        'Always verify file size matches the official file size (28.6 MB) before installing.'
      ]
    },
    {
      id: 'h-web-support',
      category: 'General Support',
      title: 'Website Support vs. Android App Bug Reporting',
      isAndroid: false,
      summary: 'How to contact the official NEXA engineering team for website or app bugs.',
      steps: [
        'For website issues, contact email, or business commissions: Use the official Contact Form or email the configured address.',
        'For Android app crash reports: In the NEXA App, go to Settings > Help & Feedback > Send Bug Report with system logs.',
        'Our engineering team reviews all verified bug reports and releases patches in monthly updates.'
      ]
    }
  ];

  const filteredTopics = comprehensiveTopics.filter((t) => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <HelpCircle className="w-3.5 h-3.5" />
          KNOWLEDGE BASE & TROUBLESHOOTING
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          NEXA Help Center
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Comprehensive documentation and troubleshooting guides for setup, Android permissions, voice commands, and account synchronization.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto pt-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="help-center-search-input"
            type="text"
            placeholder="Search topics (e.g. microphone, Hey NEXA, Google sign-in, FocusLock)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Distinction Badge */}
      <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-[#081120] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Smartphone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            Looking specifically for <strong>NEXA AI & Conversational LLM Help</strong>?
          </span>
        </div>
        <button
          id="go-to-ai-help-btn"
          onClick={() => onNavigate('ai-help')}
          className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          Open NEXA AI Help Center
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`help-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordions List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No articles matched your search</h3>
            <p className="text-xs text-slate-400">Try searching for keywords like "permission", "alarm", "call", or "APK".</p>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedId === topic.id;
            return (
              <div
                key={topic.id}
                id={`help-topic-${topic.id}`}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-[#060c18] border-cyan-500/40 shadow-xl'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {topic.category}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        topic.isAndroid ? 'bg-blue-950/40 text-blue-300 border-blue-500/30' : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {topic.isAndroid ? 'Android App Functionality' : 'Website Support'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {topic.title}
                    </h3>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-150">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {topic.summary}
                    </p>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="text-xs font-mono uppercase text-slate-400">Resolution Steps:</div>
                      <ol className="space-y-2 text-xs sm:text-sm text-slate-300">
                        {topic.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still need help CTA */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Can't find what you're looking for?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Our technical support team can assist with device-specific bugs, custom APK builds, or developer API integrations.
        </p>
        <button
          id="help-submit-ticket-btn"
          onClick={() => onNavigate('contact')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors cursor-pointer"
        >
          <Mail className="w-4 h-4 stroke-[2.5]" />
          Submit Support Ticket / Enquiry
        </button>
      </div>
    </div>
  );
};
