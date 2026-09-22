import React, { useState, useEffect } from 'react';
import {
  Lock,
  Timer,
  Shield,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Download,
  ExternalLink
} from 'lucide-react';

export const FocusLockTool: React.FC = () => {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      setCompletedSessions((c) => c + 1);
      alert('Focus session completed! Great job staying focused.');
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(focusMinutes * 60);
  };

  const handleSetTime = (mins: number) => {
    setFocusMinutes(mins);
    setSecondsRemaining(mins * 60);
    setIsRunning(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-300">
            <Lock className="w-3.5 h-3.5" />
            PRODUCTIVITY & APP BLOCKER COMPANION
          </div>
          <h2 className="text-2xl font-black text-white">FocusLock v1.0</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Strict distraction-blocking system, scheduled lockout profiles, and immersive focus timer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-950/60 border border-amber-500/30 text-amber-300">
            Pending Binary (Standalone APK)
          </span>
        </div>
      </div>

      {/* Interactive Web Focus Timer */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-6 max-w-xl mx-auto">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Active Focus Session</span>
          <div className="text-6xl sm:text-7xl font-black font-mono text-cyan-400 tracking-wider">
            {formatTime(secondsRemaining)}
          </div>
          <p className="text-xs text-slate-400">
            {completedSessions} sessions completed today
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="flex items-center justify-center gap-2">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSetTime(mins)}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                focusMinutes === mins
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Focus Session
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:scale-105 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-black" />
              Pause Session
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Standalone Native APK Status Card */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">FocusLock Native Android Package</h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
            Package Not Uploaded Yet
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The standalone FocusLock Android application utilizes the Android UsageStatsManager and DevicePolicyManager to enforce strict system-level app shielding and break intervals.
        </p>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Binary Storage Notice:</strong> FocusLock v1.0 binary has not been uploaded to storage yet. The download link is disabled until an administrator uploads the compiled APK binary via the Admin APK Management console.
          </span>
        </div>
      </div>
    </div>
  );
};
