import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Lock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { NexaConfig } from '../types';

interface FooterProps {
  onNavigate: (page: string) => void;
  config: NexaConfig | null;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, config }) => {
  const [copied, setCopied] = useState(false);
  const supportEmail = config?.supportEmail || 'nexa.com.in21@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="nexa-primary-footer" className="bg-[#02050c] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 font-extrabold font-mono text-base">
                NX
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-wider">NEXA</span>
                <span className="ml-2 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  NEXA.COM.IN 21
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm">
              "Your AI. Your Assistant. Your Tools." — The official public portal for the NEXA mobile intelligence ecosystem, system-level automations, and digital development services.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Download Safety Verification
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download only from official NEXA links. All official binaries are signed with the authentic NEXA.COM.IN 21 certificate key.
              </p>
            </div>

            {/* Official Support Email */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                Official Support & Inquiries
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  id="footer-email-mailto-link"
                  href={`mailto:${supportEmail}`}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {supportEmail}
                </a>
                <button
                  id="footer-copy-email-btn"
                  onClick={copyEmail}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                  aria-label="Copy official email"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Column 1: Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product & App</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-nav-download"
                  onClick={() => handleNav('download')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer flex items-center gap-1"
                >
                  Download NEXA APK
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded">
                    {config?.appLatestVersion || 'v2.5'}
                  </span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-features"
                  onClick={() => handleNav('features')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Ecosystem Features
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-screenshots"
                  onClick={() => handleNav('screenshots')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  App Screenshots Gallery
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-updates"
                  onClick={() => handleNav('updates')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Version Changelog & What's New
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about"
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  About NEXA
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Support & Knowledge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Knowledge & Help</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-nav-help"
                  onClick={() => handleNav('help')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  NEXA Help Center
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-ai-help"
                  onClick={() => handleNav('ai-help')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  NEXA AI Help Center
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  onClick={() => handleNav('contact')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Contact Support & Enquiries
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-privacy"
                  onClick={() => handleNav('privacy')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-terms"
                  onClick={() => handleNav('terms')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Professional Services & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Services & Governance</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-nav-services"
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Development & Design Services
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-service-web"
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer text-xs"
                >
                  • Web & Android Engineering
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-service-video"
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer text-xs"
                >
                  • Video & Motion Graphics
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-service-design"
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer text-xs"
                >
                  • UI/UX & Graphic Design
                </button>
              </li>
              <li className="pt-2">
                <button
                  id="footer-nav-admin"
                  onClick={() => handleNav('admin')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Protected Admin Dashboard
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Architecture Separation Notice */}
        <div className="p-4 rounded-xl bg-[#070e1c] border border-slate-800/90 text-xs text-slate-400 leading-relaxed space-y-1">
          <div className="font-semibold text-slate-300 flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            System Architecture Distinction Notice:
          </div>
          <p>
            This website (<span className="text-cyan-300 font-mono">NEXA.COM.IN 21</span>) is the official public product and company portal. The native voice recognition ("Hey NEXA"), automated phone calls, alarm dispatching, FocusLock barrier controls, offline financial calculators, and Android background assistant processes operate strictly within the installed Android application.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} NEXA (NEXA.COM.IN 21). All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Website v{config?.websiteVersion || '2.5.0'}</span>
            <span>•</span>
            <span>App {config?.appLatestVersion || 'v2.5'}</span>
            <span>•</span>
            <span className="text-cyan-400 font-mono">Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
