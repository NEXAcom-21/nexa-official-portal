import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  MessageSquare,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { NexaConfig, EnquiryCategory } from '../types';

interface ContactPageProps {
  config: NexaConfig | null;
  initialParams?: { service?: string; category?: string };
}

export const ContactPage: React.FC<ContactPageProps> = ({ config, initialParams }) => {
  const supportEmail = config?.supportEmail || 'nexa.com.in21@gmail.com';

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: (initialParams?.category as EnquiryCategory) || 'Contact NEXA',
    serviceType: initialParams?.service || '',
    subject: initialParams?.service ? `Commission Enquiry: ${initialParams.service}` : '',
    message: ''
  });

  useEffect(() => {
    if (initialParams?.category) {
      setFormData((prev) => ({
        ...prev,
        category: initialParams.category as EnquiryCategory,
        serviceType: initialParams.service || prev.serviceType,
        subject: initialParams.service ? `Commission Enquiry: ${initialParams.service}` : prev.subject
      }));
    }
  }, [initialParams]);

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categories: EnquiryCategory[] = [
    'Contact NEXA',
    'Email NEXA',
    'Service Enquiry',
    'App Support',
    'Bug Report',
    'Feature Request',
    'Business Enquiry',
    'Development Enquiry',
    'Video Creation Enquiry',
    'Image/Design Enquiry'
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    // Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      setSubmitError('Please enter a clear subject.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setSubmitError('Please enter a message of at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      setSubmitSuccess(
        `Thank you ${formData.name}! Your enquiry (#${data.enquiryId}) has been securely dispatched to the official NEXA leadership team.`
      );
      setFormData({
        name: '',
        email: '',
        category: 'Contact NEXA',
        serviceType: '',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Mail className="w-3.5 h-3.5" />
          OFFICIAL COMMUNICATIONS & DISPATCH
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Contact NEXA
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Reach out directly to the NEXA owner and core engineering team. Submit enquiries, report app bugs, or commission digital software and video creation services.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Official Contact Card & Direct Email */}
        <div className="lg:col-span-5 space-y-6">
          {/* Official Email Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#060c18] border border-cyan-500/30 space-y-6 shadow-xl">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                Official Gmail Address
              </div>
              <h3 className="text-xl font-bold text-white">Direct Inbox Access</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                You can write directly to our official configured address from your preferred email client:
              </p>
            </div>

            {/* Email Address Display with Copy Button */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-mono text-cyan-200 font-semibold truncate">
                  {supportEmail}
                </span>
              </div>
              <button
                id="copy-support-email-btn"
                onClick={handleCopyEmail}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                title="Copy email to clipboard"
                aria-label="Copy official email"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Direct [Email NEXA] Button */}
            <div>
              <a
                id="email-nexa-direct-mailto-btn"
                href={`mailto:${supportEmail}?subject=NEXA%20Enquiry`}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Mail className="w-4 h-4 stroke-[2.5]" />
                Email NEXA via Mail Client
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Response Time: Typically within 24 business hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Encrypted transmission & secure backend storage</span>
              </div>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="font-bold text-slate-200 text-sm">Need Help with Android Permissions?</div>
            <p>
              If your inquiry concerns setting up "Hey NEXA" default assistant or microphone authorization on your smartphone, review our self-service guides in the Help Center.
            </p>
          </div>
        </div>

        {/* Right Column: Secure Contact & Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
            <div>
              <h2 className="text-2xl font-bold text-white">Submit An Official Enquiry</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Your message is stored securely on the NEXA server and will be reviewed by the authorized administrator.
              </p>
            </div>

            {submitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-slate-300">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-slate-300">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-category" className="text-xs font-semibold text-slate-300">
                    Enquiry Category *
                  </label>
                  <select
                    id="contact-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EnquiryCategory })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specific Service (optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-service" className="text-xs font-semibold text-slate-300">
                    Service Specifics (Optional)
                  </label>
                  <input
                    id="contact-service"
                    type="text"
                    placeholder="e.g. Android Kotlin App, Video Motion"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-300">
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="Summary of your inquiry or bug..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-slate-300">
                  Message Details *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Provide full details regarding your requirement, feedback, or device specifications..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 resize-y"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Message to NEXA Server...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Send Official Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
