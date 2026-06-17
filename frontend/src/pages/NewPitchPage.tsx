import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Sparkles, Loader2 } from 'lucide-react';
import { pitchesApi } from '../lib/api';
import type { PitchTheme } from '../types';

const THEMES: { value: PitchTheme; label: string; preview: string }[] = [
  { value: 'dark', label: 'Dark', preview: 'bg-gray-950' },
  { value: 'ocean', label: 'Ocean', preview: 'bg-gradient-to-br from-blue-950 to-cyan-950' },
  { value: 'forest', label: 'Forest', preview: 'bg-gradient-to-br from-green-950 to-emerald-950' },
  { value: 'sunset', label: 'Sunset', preview: 'bg-gradient-to-br from-orange-950 to-pink-950' },
  { value: 'light', label: 'Light', preview: 'bg-white border border-gray-200' },
];

const EXAMPLE_REPOS = [
  'https://github.com/vercel/next.js',
  'https://github.com/facebook/react',
  'https://github.com/tailwindlabs/tailwindcss',
  'https://github.com/vitejs/vite',
];

export default function NewPitchPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [theme, setTheme] = useState<PitchTheme>('dark');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await pitchesApi.create({ repoUrl, theme, isPublic });
      navigate(`/pitches/${data.pitch._id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to generate pitch');
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Generate Pitch Deck</h1>
        <p className="text-gray-500 text-sm mt-1">
          Paste a GitHub repo URL and we will generate a professional pitch deck in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Repo URL */}
        <div className="card">
          <label className="label">GitHub Repository URL</label>
          <div className="relative">
            <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              className="input pl-9"
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-600">Try:</span>
            {EXAMPLE_REPOS.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setRepoUrl(url)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {url.replace('https://github.com/', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="card">
          <label className="label">Slide Theme</label>
          <div className="grid grid-cols-5 gap-3 mt-2">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                className={`flex flex-col items-center gap-2 rounded-lg p-3 border transition-all ${
                  theme === t.value
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className={`h-10 w-full rounded ${t.preview}`} />
                <span className="text-xs text-gray-400 font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="card">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-200">Make pitch public</span>
              <p className="text-xs text-gray-500 mt-0.5">Public pitches appear in the Explore gallery</p>
            </div>
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-red-900/40 border border-red-800 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing repo and generating slides...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Pitch Deck
            </>
          )}
        </button>
      </form>

      {/* How it works */}
      <div className="mt-10 card bg-gray-900/50">
        <h3 className="text-sm font-bold text-gray-300 mb-4">How it works</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: '1', text: 'Paste a GitHub repo URL' },
            { step: '2', text: 'We analyze README, code, and metadata' },
            { step: '3', text: 'Get a 10-slide pitch deck instantly' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="h-8 w-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-bold flex items-center justify-center mx-auto mb-2">
                {s.step}
              </div>
              <p className="text-xs text-gray-500">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
