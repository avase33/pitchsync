import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Eye, Presentation, Globe, GitFork } from 'lucide-react';
import { pitchesApi } from '../lib/api';
import type { Pitch, User } from '../types';

function PitchCard({ pitch }: { pitch: Pitch }) {
  const owner = pitch.owner as User;
  return (
    <Link to={`/pitches/${pitch._id}`} className="card-hover block">
      {/* Theme preview strip */}
      <div className={`h-20 rounded-lg mb-4 ${
        pitch.theme === 'ocean' ? 'bg-gradient-to-br from-blue-950 to-cyan-950' :
        pitch.theme === 'forest' ? 'bg-gradient-to-br from-green-950 to-emerald-950' :
        pitch.theme === 'sunset' ? 'bg-gradient-to-br from-orange-950 to-pink-950' :
        pitch.theme === 'light' ? 'bg-white' :
        'bg-gray-950'
      } flex items-center justify-center border border-white/10`}>
        <Presentation size={28} className="text-white/30" />
      </div>

      <h3 className="font-bold text-white text-sm truncate mb-1">{pitch.title}</h3>
      <p className="text-xs text-gray-500 truncate mb-3">{pitch.tagline}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white">
            {owner?.initials || '?'}
          </div>
          <span className="text-xs text-gray-500">{owner?.name}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1"><Eye size={11} />{pitch.views}</span>
          <span className="flex items-center gap-1"><Star size={11} />{pitch.likes}</span>
        </div>
      </div>

      {pitch.repoMeta && (
        <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1"><Star size={11} />{pitch.repoMeta.stars}</span>
          <span className="flex items-center gap-1"><GitFork size={11} />{pitch.repoMeta.forks}</span>
          {pitch.repoMeta.language && <span className="badge-gray">{pitch.repoMeta.language}</span>}
        </div>
      )}
    </Link>
  );
}

export default function ExplorePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['pitches-public'],
    queryFn: () => pitchesApi.listPublic().then((r) => r.data),
  });

  const pitches = data?.pitches || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Globe size={20} className="text-blue-400" />
        <h1 className="text-2xl font-black text-white">Explore</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        Pitch decks shared by the community. Get inspired or generate your own.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-56 animate-pulse bg-gray-800" />
          ))}
        </div>
      ) : pitches.length === 0 ? (
        <div className="card text-center py-16">
          <Globe size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 mb-3">No public pitches yet.</p>
          <Link to="/pitches/new" className="btn-primary inline-flex">
            Generate and share the first pitch
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pitches.map((pitch: Pitch) => (
            <PitchCard key={pitch._id} pitch={pitch} />
          ))}
        </div>
      )}
    </div>
  );
}
