import React, { useState } from 'react';
import { X, Save, Edit3, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ApkRelease } from '../types';

interface AdminEditReleaseModalProps {
  isOpen: boolean;
  release: ApkRelease | null;
  token: string | null;
  onClose: () => void;
  onSaved: (updatedRelease: ApkRelease) => void;
}

export const AdminEditReleaseModal: React.FC<AdminEditReleaseModalProps> = ({
  isOpen,
  release,
  token,
  onClose,
  onSaved
}) => {
  if (!isOpen || !release) return null;

  const [displayName, setDisplayName] = useState(release.displayName || `${release.productName} v${release.version}`);
  const [versionName, setVersionName] = useState(release.versionName || `${release.productName} v${release.version}`);
  const [releaseNotes, setReleaseNotes] = useState(release.releaseNotes || '');
  const [releaseDate, setReleaseDate] = useState(release.releaseDate || '');
  const [minAndroid, setMinAndroid] = useState(release.minimumAndroidVersion || 'Android 8.0+');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/apks/${release.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
          versionName: versionName.trim(),
          releaseNotes: releaseNotes.trim(),
          releaseDate: releaseDate.trim(),
          minimumAndroidVersion: minAndroid.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save changes.');
      }

      onSaved(data.release);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error updating release metadata.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Release Details</h2>
              <p className="text-xs text-slate-400 font-mono">
                {release.productName} v{release.version} ({release.filename})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Display Name *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. NEXA v2.5 Quantum"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">Displayed as the primary release title on download cards.</p>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Codename / Version Title
            </label>
            <input
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="e.g. NEXA Nebula Edition"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Release Notes &amp; Highlights *
            </label>
            <textarea
              rows={4}
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              placeholder="Detailed release changelog, improvements, bug fixes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Release Date
              </label>
              <input
                type="text"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                placeholder="e.g. September 21, 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Minimum Android OS
              </label>
              <input
                type="text"
                value={minAndroid}
                onChange={(e) => setMinAndroid(e.target.value)}
                placeholder="e.g. Android 8.0+ (API 26)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
