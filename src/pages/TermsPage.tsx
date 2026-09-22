import React from 'react';
import { FileText, Shield, Scale, Mail, Smartphone } from 'lucide-react';
import { NexaConfig } from '../types';

interface TermsPageProps {
  config: NexaConfig | null;
}

export const TermsPage: React.FC<TermsPageProps> = ({ config }) => {
  const supportEmail = config?.supportEmail || 'nexa.com.in21@gmail.com';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Scale className="w-3.5 h-3.5" />
          LEGAL AGREEMENT & CONDITIONS
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          NEXA Terms of Service
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Effective Date: September 15, 2026 | Governing Entity: NEXA.COM.IN 21
        </p>
      </div>

      {/* Overview */}
      <div className="p-6 rounded-2xl bg-[#060c18] border border-cyan-500/30 text-sm text-slate-300 leading-relaxed space-y-2">
        <p>
          Please read these Terms of Service ("Terms") carefully before using the website located at <strong>nexa.com.in</strong> or installing the <strong>NEXA Android Application</strong>. By accessing or using our services, you agree to be bound by these Terms.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            1. Intellectual Property & Brand Ownership
          </h2>
          <div className="space-y-2 pl-4 border-l-2 border-slate-800 text-xs sm:text-sm text-slate-300">
            <p>
              The names <strong>NEXA</strong>, <strong>NEXA.COM.IN 21</strong>, the NEXA brand identity, graphic logos, mobile software codebases, and website architecture are the exclusive intellectual property of the NEXA leadership and project founders.
            </p>
            <p>
              You may not decompile, reverse-engineer, redistribute, or repackage the official APK with malicious modifications or unauthorized monetization layers.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            2. Android Mobile Application License
          </h2>
          <div className="space-y-2 pl-4 border-l-2 border-slate-800 text-xs sm:text-sm text-slate-300">
            <p>
              NEXA grants you a personal, revocable, non-exclusive, non-transferable license to download, install, and execute the official APK build on your personal Android-compatible smartphones.
            </p>
            <p>
              You agree not to use the voice assistant or FocusLock tools for any unlawful purpose, including attempts to circumvent device security protocols.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            3. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <div className="space-y-2 pl-4 border-l-2 border-slate-800 text-xs sm:text-sm text-slate-300">
            <p>
              Our applications and website are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. While we rigorously test every release for Android stability, we do not warrant that operation will be uninterrupted or error-free on every OEM skin or modified custom ROM.
            </p>
            <p>
              Financial calculators and AI suggestions are provided for informational utility only and should not be construed as certified professional financial or legal advice.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            4. Service Inquiries & Commissions
          </h2>
          <div className="space-y-2 pl-4 border-l-2 border-slate-800 text-xs sm:text-sm text-slate-300">
            <p>
              Enquiries submitted through the Services section represent requests for commercial scoping. Mutual engagement begins only upon formal execution of a Statement of Work (SOW) or commercial contract between the parties.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            5. Inquiries & Legal Notice
          </h2>
          <div className="space-y-2 pl-4 border-l-2 border-slate-800 text-xs sm:text-sm text-slate-300">
            <p>
              Direct all inquiries or formal notices regarding these terms to:
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
