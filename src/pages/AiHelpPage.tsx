import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  History,
  AlertTriangle,
  BrainCircuit,
  Lock,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Wifi,
  Settings,
  Image as ImageIcon,
  Video as VideoIcon,
  LifeBuoy,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Mail
} from 'lucide-react';

interface AiHelpPageProps {
  onNavigate: (page: string) => void;
}

export const AiHelpPage: React.FC<AiHelpPageProps> = ({ onNavigate }) => {
  const [openSection, setOpenSection] = useState<string | null>('how-to-ask');

  const helpSections = [
    {
      id: 'how-to-ask',
      icon: MessageSquare,
      title: '1. How to Ask NEXA AI Questions',
      badge: 'Prompting Guide',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
      summary: 'Formulating clear, specific questions produces high-accuracy answers across academic and practical domains.',
      details: [
        'Academic Subjects (Biology, Physics, Chemistry, Math): State the specific concept or formula. For example, "What is photosynthesis and what happens in the light-dependent reactions?" or "Solve 4x + 12 = 36 step by step."',
        'Finance & Commerce: Specify financial terms and contexts, e.g., "Explain how compound annual growth rate (CAGR) differs from absolute return with an example calculation."',
        'Programming & Development: Include the programming language and goal, e.g., "Write a TypeScript interface with optional properties and explain how strict null checks interact with it."',
        'Follow-Up Questions: NEXA AI maintains multi-turn conversation context. You can ask "Now simplify that for a beginner" or "Give me two real-world examples."'
      ]
    },
    {
      id: 'why-may-fail',
      icon: AlertTriangle,
      title: '2. Why an AI Answer May Fail',
      badge: 'Diagnostics',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
      summary: 'Understand the root causes when a query cannot be completed or returns an error message.',
      details: [
        'Provider Rate Limits & Capacity: High-demand spikes at the AI inference provider can temporarily reject requests with a 503 unavailable code.',
        'Network Dropouts: Interrupted Wi-Fi or mobile data during token streaming will abort the connection before the complete response is received.',
        'Safety Guardrail Filters: Queries soliciting harmful, illegal, or personally identifiable private data are automatically rejected by model alignment policies.',
        'Empty or Ambiguous Input: Blank messages or queries lacking sufficient semantic context will be prompted for clarification rather than generating inaccurate assumptions.'
      ]
    },
    {
      id: 'internet-api-reqs',
      icon: Wifi,
      title: '3. Internet & API Requirements',
      badge: 'Connectivity',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
      summary: 'Differentiating between offline device utilities and neural cloud reasoning services.',
      details: [
        'Online Requirement for AI: Large language model inference runs on secure accelerated backend servers and requires an active internet connection (Wi-Fi or 4G/5G).',
        'Offline Standalone Tools: NEXA native finance calculators (SIP, EMI, GST), flashlight tools, and audio profile managers operate 100% offline on your device without transmitting data.',
        'Server-Side API Proxying: In accordance with enterprise security standards, the mobile app never connects directly to raw third-party AI keys; requests pass securely through the verified NEXA backend.'
      ]
    },
    {
      id: 'ai-model-config',
      icon: Settings,
      title: '4. AI Model Configuration',
      badge: 'Architecture',
      badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-500/30',
      summary: 'How neural model endpoints, keys, and parameters are securely managed.',
      details: [
        'Current Engine: NEXA AI runs on Google Gemini models (primary: gemini-3.8-flash with automatic resilience fallback to gemini-3.6-flash).',
        'Backend Key Storage: The GEMINI_API_KEY environment variable is maintained strictly on the server backend. Secret API credentials are never bundled into the client APK.',
        'Temperature & Guardrails: Model temperature is balanced (0.7) for optimal factual precision and natural conversational fluency.',
        'Unconfigured State Handling: If backend AI keys are missing, the interface displays an explicit configuration notice rather than generating deceptive fake answers.'
      ]
    },
    {
      id: 'image-generation',
      icon: ImageIcon,
      title: '5. Image Generation',
      badge: 'Multimodal AI',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/30',
      summary: 'Prompt-to-image capabilities, prerequisites, and status reporting.',
      details: [
        'Provider Requirements: High-resolution image generation requires an active billing-enabled image provider (such as Gemini Image / Imagen models).',
        'Workflow: User prompt → Secure server proxy → Image generation endpoint → Base64 image payload → High-fidelity render in chat.',
        'Transparent Status Reporting: If image generation credentials or billing quotas are not active, the system shows "Image generation is not configured yet" with retry options rather than presenting fake stock mockups.',
        'Prompt Tips: Be descriptive with subject, lighting, angle, and art style (e.g., "Minimalist 3D render of a futuristic smartphone on obsidian pedestal, soft cyan rim light").'
      ]
    },
    {
      id: 'video-generation',
      icon: VideoIcon,
      title: '6. Video Generation',
      badge: 'Asynchronous Pipeline',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
      summary: 'Asynchronous video synthesis pipeline and configuration requirements.',
      details: [
        'Asynchronous Architecture: High-definition video synthesis operates as a job-based pipeline: Prompt submission → Job Ticket ID → Server status polling (Queued → Processing → Completed) → Streamable MP4 result.',
        'Provider Configuration: Generating 1080p video clips requires specialized cloud video infrastructure (such as Google Veo API with dedicated rendering quota).',
        'Honest Feedback: If video generation infrastructure is not actively provisioned, NEXA clearly states that video generation requires backend configuration instead of simulating video output.'
      ]
    },
    {
      id: 'chat-history',
      icon: History,
      title: '7. Managing Chat History & Local Memory',
      badge: 'Data Control',
      badgeColor: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30',
      summary: 'How multi-turn transcripts are preserved and how you maintain complete control.',
      details: [
        'Multi-Turn Memory: Within an active session, NEXA AI recalls earlier turns to understand references, corrections, and iterative code revisions.',
        'New Conversation: Tap the "+" button in the chat header to start a fresh thread without losing previously saved sessions.',
        'History Drawer: Tap the History clock icon to browse, switch between, or selectively delete past saved sessions.',
        'Instant Clear: Tap the Trash icon to purge the active thread immediately.',
        'Per-User Isolation: Chat histories are partitioned per user account in local storage, preventing crossover between different accounts.'
      ]
    },
    {
      id: 'privacy-safeguards',
      icon: Lock,
      title: '8. Privacy & Data Safeguards',
      badge: 'Security',
      badgeColor: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30',
      summary: 'Data minimization principles protecting your questions and personal information.',
      details: [
        'Zero Advertising Exploitation: Your questions and conversations are never packaged, indexed, or sold to third-party ad networks.',
        'Encrypted In-Transit: All transmissions between the app and neural servers use TLS 1.3 encryption with modern cipher suites.',
        'No Telemetry Mining: We do not log device serial numbers, contacts, or biometric keys alongside your AI queries.'
      ]
    },
    {
      id: 'troubleshooting',
      icon: LifeBuoy,
      title: '9. Troubleshooting Guide',
      badge: 'Self-Service',
      badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-500/30',
      summary: 'Quick solutions for common connection and response issues.',
      details: [
        'Message Fails with "Retry": Check your internet connection and click the red "Retry" button to resend your query.',
        '503 Model Spike Error: A temporary spike occurred on the cloud AI model. Wait 10–20 seconds and resend.',
        'Chat Not Loading: Tap "Clear Active Chat" or start a "New Conversation" to refresh corrupted local state.',
        'Unconfigured AI Error: Contact the administrator to verify that GEMINI_API_KEY is defined in the server environment.'
      ]
    },
    {
      id: 'contact-support',
      icon: Mail,
      title: '10. Contact Official Support',
      badge: 'Direct Help',
      badgeColor: 'text-purple-300 bg-purple-950/60 border-purple-500/30',
      summary: 'Reach the official engineering team for questions or bug reports.',
      details: [
        'Official Support Email: nexa.com.in21@gmail.com',
        'Official Portal: nexa.com.in',
        'Online Contact Form: Navigate to our Contact page to submit a structured inquiry with priority categorization.',
        'Bug Reporting: When submitting an issue, include your device Android version, query topic, and any displayed error message.'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <BrainCircuit className="w-3.5 h-3.5" />
          NEXA AI DOCUMENTATION & SUPPORT
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          NEXA AI Help Center
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Comprehensive guide to asking questions, understanding architecture, model configuration, multimodal tools, and troubleshooting.
        </p>
      </div>

      {/* Accordion / Sections Grid */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {helpSections.map((sec) => {
          const Icon = sec.icon;
          const isOpen = openSection === sec.id;

          return (
            <div
              key={sec.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenSection(isOpen ? null : sec.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 sm:mt-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        {sec.title}
                      </h2>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${sec.badgeColor}`}>
                        {sec.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {sec.summary}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400 p-1">
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
                  <ul className="space-y-2.5">
                    {sec.details.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {sec.id === 'contact-support' && (
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => onNavigate('contact')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs hover:opacity-95 transition-opacity"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Open Contact Form
                      </button>
                      <a
                        href="mailto:nexa.com.in21@gmail.com"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                      >
                        Direct Email
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Access Footer Card */}
      <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">Have a specific question right now?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Open NEXA AI to ask your question or test subject reasoning in real time.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('tools')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            Explore Tools
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
