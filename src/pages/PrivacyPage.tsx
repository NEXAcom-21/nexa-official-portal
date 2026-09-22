import React from 'react';
import { ShieldCheck, Lock, Smartphone, Globe, Mail } from 'lucide-react';
import { NexaConfig } from '../types';

interface PrivacyPageProps {
  config: NexaConfig | null;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ config }) => {
  const supportEmail = config?.supportEmail || 'nexa.com.in21@gmail.com';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Lock className="w-3.5 h-3.5" />
          LEGAL & DATA COMPLIANCE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          NEXA Privacy Policy
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Effective Date: September 15, 2026 | Last Updated: September 2026
        </p>
      </div>

      {/* Overview */}
      <div className="p-6 rounded-2xl bg-[#060c18] border border-cyan-500/30 text-sm text-slate-300 leading-relaxed space-y-2">
        <p>
          At <strong>NEXA (NEXA.COM.IN 21)</strong>, privacy is not an afterthought or marketing slogan; it is the foundational architectural pillar upon which our software is built. This document outlines the distinct data handling practices of both the <strong>NEXA Official Website</strong> and the <strong>NEXA Native Android Application</strong>.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            1. NEXA Official Website (nexa.com.in)
          </h2>
          <div className="space-y-2 pl-4 border-l-2 border-slate-800">
            <p>
              <strong>Data We Collect on the Website:</strong> The website operates as a static, secure informational portal. We do not use persistent advertising trackers, third-party analytics pixels, or behavior-profiling cookies.
            </p>
            <p>
              <strong>Contact & Enquiry Submissions:</strong> When you voluntarily submit a message via the Contact Form, we receive the name, email address, inquiry category, and message text you provide. This information is stored securely in our server database solely to review and respond to your inquiry. We never sell, rent, or distribute this data to third-party marketing brokers.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            2. NEXA Native Android Application
          </h2>
          <div className="space-y-2 pl-4 border-l-2 border-slate-800">
            <p>
              The NEXA Android mobile application requires specific permissions strictly to execute user-demanded features:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
              <li>
                <strong>Microphone:</strong> Used locally for the "Hey NEXA" wake-word engine and voice queries. Audio streams are not continuously recorded or uploaded to background surveillance clouds.
              </li>
              <li>
                <strong>Contacts & Phone Dialing:</strong> Used to resolve names when you verbally command "Call [Name]" and to pass the intended phone number into the Android Telecom dialer. Contact books are never harvested.
              </li>
              <li>
                <strong>FocusLock & UsageStats:</strong> Used on-device to detect if a blocked application has been brought to the foreground during a focus session.
              </li>
              <li>
                <strong>Local Financial Suite:</strong> All math calculators (SIP, EMI, GST) run entirely offline inside a local SQLite container. No bank accounts or financial figures leave your hardware.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            3. Data Retention and Erasure Rights
          </h2>
          <div className="space-y-2 pl-4 border-l-2 border-slate-800">
            <p>
              You maintain complete ownership of your data:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-300">
              <li>In the mobile app, you can erase your conversation history at any time with 1 tap.</li>
              <li>You may request complete purging of any contact enquiry records by emailing our team.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            4. Contact Our Data Protection Officer
          </h2>
          <div className="space-y-2 pl-4 border-l-2 border-slate-800">
            <p>
              If you have any questions or requests regarding your personal information, contact our official inbox:
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 inline-block">
              {supportEmail}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
