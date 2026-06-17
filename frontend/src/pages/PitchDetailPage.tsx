import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft, ChevronRight, Star, Eye, Trash2, Edit2, Globe, Lock,
  RefreshCw, ExternalLink, Heart, Loader2, GitFork
} from 'lucide-react';
import { pitchesApi } from '../lib/api';
import { useAuthStore } from '../store/auth';
import SlideViewer from '../components/SlideViewer';
import type { Pitch, PitchTheme } from '../types';

const SLIDE_TYPE_LABELS: Record<string, string> = {
  title: 'Title',
  problem: 'Problem',
  solution: 'Solution',
  howItWorks: 'How It Works',
  techStack: 'Tech Stack',
  market: 'Market',
  traction: 'Traction',
  roadmap: 'Roadmap',
  team: 'Team',
  ask: 'Ask',
};

export default function PitchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [slideIdx, setSlideIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [liked, setLiked] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pitch', id],
    queryFn: () => pitchesApi.get(id!).then((r) => r.data),
    refetchInterval: (data) => {
      const pitch = (data as { pitch?: Pitch })?.pitch;
      return pitch?.status === 'generating' ? 2000 : false;
    },
  });

  const pitch = data?.pitch;
  const isOwner = pitch && user && (typeof pitch.owner === 'object' ? pitch.owner._id : pitch.owner) === user._id;
  const slides = pitch?.slides?.slice().sort((a, b) => a.order - b.order) || [];

  useEffect(() => {
    if (pitch?.status === 'ready') setSlideIdx(0);
  }, [pitch?.status]);

  async function handleDelete() {
    if (!confirm('Delete this pitch deck?')) return;
    await pitchesApi.delete(id!);
    queryClient.invalidateQueries({ queryKey: ['pitches'] });
    navigate('/pitches');
  }

  async function handleLike() {
    if (liked) return;
    setLiked(true);
    await pitchesApi.like(id!);
    refetch();
  }

  async function handleTogglePublic() {
    await pitchesApi.update(id!, { isPublic: !pitch?.isPublic } as Partial<Pitch>);
    refetch();
  }

  async function handleRegenerate() {
    await pitchesApi.regenerate(id!);
    refetch();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Pitch not found.</p>
        <Link to="/pitches" className="text-blue-400 hover:underline mt-2 inline-block">Back to pitches</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/pitches" className="text-gray-500 hover:text-gray-300 text-sm">My Pitches</Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-300 text-sm font-medium truncate max-w-xs">{pitch.title}</span>
          </div>
          <h1 className="text-2xl font-black text-white">{pitch.title}</h1>
          {pitch.tagline && <p className="text-gray-400 text-sm mt-1">{pitch.tagline}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleLike} disabled={liked} className={`btn-secondary text-xs ${liked ? 'text-pink-400' : ''}`}>
            <Heart size={13} className={liked ? 'fill-pink-400 text-pink-400' : ''} />
            {pitch.likes}
          </button>
          <span className="badge-gray text-xs">
            <Eye size={11} className="mr-1" />{pitch.views} views
          </span>
          {isOwner && (
            <>
              <button onClick={handleTogglePublic} className="btn-secondary text-xs">
                {pitch.isPublic ? <Globe size={13} className="text-green-400" /> : <Lock size={13} />}
                {pitch.isPublic ? 'Public' : 'Private'}
              </button>
              <button onClick={handleRegenerate} className="btn-ghost text-xs">
                <RefreshCw size={13} />
                Regenerate
              </button>
              <Link to={`/pitches/${id}/edit`} className="btn-secondary text-xs">
                <Edit2 size={13} />
                Edit
              </Link>
              <button onClick={handleDelete} className="btn-danger text-xs">
                <Trash2 size={13} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generating state */}
      {pitch.status === 'generating' && (
        <div className="card text-center py-16">
          <Loader2 size={40} className="animate-spin text-blue-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Generating your pitch deck...</h2>
          <p className="text-gray-500 text-sm">Analyzing the repository and building your slides.</p>
        </div>
      )}

      {/* Error state */}
      {pitch.status === 'error' && (
        <div className="card text-center py-12 border-red-900">
          <p className="text-red-400 mb-3">Failed to generate pitch from this repository.</p>
          <button onClick={handleRegenerate} className="btn-primary">
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}

      {/* Slides */}
      {pitch.status === 'ready' && slides.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {/* Slide panel - left 2/3 */}
          <div className="col-span-2 space-y-4">
            {/* Main slide */}
            <SlideViewer
              slide={slides[slideIdx]}
              theme={pitch.theme as PitchTheme}
              index={slideIdx}
              total={slides.length}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
                disabled={slideIdx === 0}
                className="btn-secondary"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Slide {slideIdx + 1} of {slides.length}
              </span>
              <button
                onClick={() => setSlideIdx((i) => Math.min(slides.length - 1, i + 1))}
                disabled={slideIdx === slides.length - 1}
                className="btn-secondary"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Slide thumbnails */}
            <div className="card p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Slides</h3>
              <div className="space-y-1.5">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      i === slideIdx
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-700'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-xs text-gray-600 w-4 text-right">{i + 1}</span>
                    <span className="truncate">{SLIDE_TYPE_LABELS[s.type] || s.type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Repo info */}
            {pitch.repoMeta && (
              <div className="card p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Repository</h3>
                <a
                  href={`https://github.com/${pitch.repoMeta.fullName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium mb-3"
                >
                  <ExternalLink size={13} />
                  {pitch.repoMeta.fullName}
                </a>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Star size={11} />{pitch.repoMeta.stars}</span>
                  <span className="flex items-center gap-1"><GitFork size={11} />{pitch.repoMeta.forks}</span>
                </div>
                {pitch.repoMeta.language && (
                  <div className="mt-2">
                    <span className="badge-blue text-xs">{pitch.repoMeta.language}</span>
                  </div>
                )}
                {(pitch.repoMeta.topics || []).slice(0, 4).map((t: string) => (
                  <span key={t} className="badge-gray text-xs mr-1 mt-1">{t}</span>
                ))}
              </div>
            )}

            {/* Share link */}
            {pitch.isPublic && pitch.slug && (
              <div className="card p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Share</h3>
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-400 truncate flex-1">
                    /p/{pitch.slug}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/p/${pitch.slug}`)}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
