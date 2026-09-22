import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  Search,
  Copy,
  Check,
  Sparkles,
  Download,
  AlertCircle,
  FileDown
} from 'lucide-react';

export const DocumentPdfTool: React.FC = () => {
  const [docText, setDocText] = useState(
    'NEXA is a next-generation ecosystem uniting artificial intelligence, modern engineering tools, and personal security utilities into a unified platform.'
  );
  const [copied, setCopied] = useState(false);

  // Compute text statistics
  const charCount = docText.length;
  const wordCount = docText.trim() === '' ? 0 : docText.trim().split(/\s+/).length;
  const lineCount = docText.trim() === '' ? 0 : docText.split('\n').length;
  const readingTimeMin = Math.ceil(wordCount / 200);

  const handleCopy = () => {
    navigator.clipboard.writeText(docText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([docText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexa-document.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300">
            <FileText className="w-3.5 h-3.5" />
            DOCUMENT ANALYSIS & PDF WORKFLOWS
          </div>
          <h2 className="text-2xl font-black text-white">Document / PDF Tools v1.2</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Analyze document text metrics, extract structural statistics, and export clean formatted notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            Export Clean .txt
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400">Characters</span>
          <p className="text-2xl font-black text-purple-400 font-mono">{charCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400">Words</span>
          <p className="text-2xl font-black text-cyan-400 font-mono">{wordCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400">Lines</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">{lineCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400">Est. Read Time</span>
          <p className="text-2xl font-black text-amber-400 font-mono">{readingTimeMin} min</p>
        </div>
      </div>

      {/* Text Editor Area */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-purple-400" />
            Document Editor & Text Buffer
          </h3>
          <button
            onClick={handleCopy}
            className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 font-mono cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
        </div>

        <textarea
          value={docText}
          onChange={(e) => setDocText(e.target.value)}
          rows={10}
          className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:border-purple-500 outline-none leading-relaxed resize-y"
          placeholder="Type or paste document text here for real-time analysis..."
        />
      </div>

      {/* PDF Companion Engine Notice */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-white">Native PDF OCR & Conversion Pipeline</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          High-performance PDF OCR scanning and raster rendering require the native Android PDFRenderer engine and Poppler backend. Web document operations run entirely on the local client without external network latency.
        </p>
        <div className="flex items-center gap-2 text-[11px] font-mono text-purple-300">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span>Web Document Engine: Active (Local in-browser)</span>
        </div>
      </div>
    </div>
  );
};
