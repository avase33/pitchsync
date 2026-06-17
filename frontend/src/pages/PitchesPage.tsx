import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Presentation, Eye, Star, Trash2 } from 'lucide-react';
import { pitchesApi } from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';
import type { Pitch } from '../types';

const STATUS_BADGE: Record<string, string> = {
  ready: 'badge-green',
  generating: 'badge-yellow',
  error: 'badge-red',
};

export default function PitchesPage() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['pitches', search],
    queryFn: () => pitchesApi.list({ q: search || undefined }).then((r) => r.data),
  });

  const pitches = data?.pitches || [];

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    if (!confirm('Delete this pitch?')) return;
    await pitchesApi.delete(id);
    queryClient.invalidateQueries({ queryKey: ['pitches'] });
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">My Pitches</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total || 0} pitch decks generated</p>
        </div>
        <Link to="/pitches/new" className="btn-primary">
          <Plus size={16} />
          New Pitch
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          className="input pl-9"
          placeholder="Search pitches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Pitches list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-20 animate-pulse bg-gray-800" />
          ))}
        </div>
      ) : pitches.length === 0 ? (
        <div className="card text-center py-16">
          <Presentation size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">{search ? 'No pitches match your search.' : 'No pitch decks yet.'}</p>
          {!search && (
            <Link to="/pitches/new" className="btn-primary mt-4 inline-flex">
              <Plus size={15} />
              Generate your first pitch
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {pitches.map((pitch: Pitch) => (
            <Link
              key={pitch._id}
              to={`/pitches/${pitch._id}`}
              className="card-hover flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm truncate">{pitch.title}</h3>
                  <span className={`badge flex-shrink-0 ${STATUS_BADGE[pitch.status] || 'badge-gray'}`}>
                    {pitch.status}
                  </span>
                  {pitch.isPublic && <span className="badge-blue text-xs flex-shrink-0">public</span>}
                </div>
                <p className="text-xs text-gray-500 truncate">{pitch.tagline || pitch.repoUrl}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600 flex-shrink-0">
                <span className="flex items-center gap-1"><Eye size={11} />{pitch.views}</span>
                <span className="flex items-center gap-1"><Star size={11} />{pitch.likes}</span>
                <span className="flex items-center gap-1"><Presentation size={11} />{pitch.slides?.length || 0}</span>
              </div>
              <button
                onClick={(e) => handleDelete(e, pitch._id)}
                className="text-gray-600 hover:text-red-400 transition-colors p-1 flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
