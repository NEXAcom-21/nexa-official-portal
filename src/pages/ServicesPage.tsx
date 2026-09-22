import React from 'react';
import {
  Globe,
  Smartphone,
  Wrench,
  Cpu,
  FileText,
  Video,
  Palette,
  Layers,
  ArrowRight,
  CheckCircle2,
  Mail,
  Sparkles
} from 'lucide-react';
import { NEXA_SERVICES } from '../data/mockData';
import { ServiceOffering } from '../types';

interface ServicesPageProps {
  onNavigate: (page: string, params?: { service?: string; category?: string }) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return Globe;
      case 'Smartphone':
        return Smartphone;
      case 'Wrench':
        return Wrench;
      case 'Cpu':
        return Cpu;
      case 'FileText':
        return FileText;
      case 'Video':
        return Video;
      case 'Palette':
        return Palette;
      case 'Layers':
      default:
        return Layers;
    }
  };

  const handleEnquire = (service: ServiceOffering) => {
    onNavigate('contact', {
      service: service.title,
      category: service.category
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          SOLUTIONS & COMMISSIONING
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          NEXA Professional Services
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Beyond our consumer mobile software, the NEXA engineering and creative team undertakes bespoke commissions in web development, native Android systems, AI integration, and cinema-grade video creation.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {NEXA_SERVICES.map((srv) => {
          const Icon = getIcon(srv.icon);
          return (
            <div
              key={srv.id}
              id={`service-card-${srv.id}`}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">{srv.tagline}</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {srv.description}
                </p>

                {/* Key Deliverables */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs font-mono uppercase text-slate-400">Included Deliverables:</div>
                  <ul className="space-y-1.5">
                    {srv.deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technology Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {srv.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Enquire Button */}
              <div className="pt-4 border-t border-slate-800/80">
                <button
                  id={`enquire-btn-${srv.id}`}
                  onClick={() => handleEnquire(srv)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold transition-all border border-slate-700 hover:border-cyan-400 flex items-center justify-center gap-1.5 group-hover:shadow-md cursor-pointer"
                >
                  <span>Enquire About {srv.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inquiry Workflow Banner */}
      <div className="rounded-3xl bg-[#060c18] border border-cyan-500/30 p-8 sm:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">How We Collaborate</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From initial project scoping to production deployment and handover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm mx-auto flex items-center justify-center">1</div>
            <h4 className="font-bold text-white text-sm">Briefing & Scope</h4>
            <p className="text-xs text-slate-400">Submit your requirement via our contact form or official email.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm mx-auto flex items-center justify-center">2</div>
            <h4 className="font-bold text-white text-sm">Architecture & Proposal</h4>
            <p className="text-xs text-slate-400">We outline timelines, milestones, and deliverable specifications.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm mx-auto flex items-center justify-center">3</div>
            <h4 className="font-bold text-white text-sm">Agile Sprint Execution</h4>
            <p className="text-xs text-slate-400">Weekly milestones, test previews, and real-time revisions.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm mx-auto flex items-center justify-center">4</div>
            <h4 className="font-bold text-white text-sm">Deployment & Handover</h4>
            <p className="text-xs text-slate-400">Full source code export, documentation, and warranty support.</p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            id="services-general-enquiry-btn"
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
          >
            Start a Custom Project Enquiry
          </button>
        </div>
      </div>
    </div>
  );
};
