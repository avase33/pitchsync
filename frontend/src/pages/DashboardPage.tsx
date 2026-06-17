import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Presentation, Plus, Star, Eye, TrendingUp, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { pitchesApi } from '../lib/api';
import type { Pitch } from '../types';

function StatCard({ label, value, icon: Icon, color }: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-xs text-gray-500 font-medium">{label}</div>
      </div>
    </div>
  );
}

function PitchCard({ pitch }: { pitch: Pitch }) {
  const statusColor: Record<string, string> = {
    ready: 'badge-green',
    generating: 'badge-yellow',
    error: 'badge-red',
  };
  return (
    <Link to={`/pitches/${pitch._id}`} className="card-hover block">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-sm">{pitch.title}</h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">{pitch.tagline}</p>
        </div>
        <span className={`badge ml-2 flex-shrink-0 ${statusColor[pitch.status] || 'badge-gray'}`}>
          {pitch.status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1"><Eye size={11} />{pitch.views}</span>
        <span className="flex items-center gap-1"><Star size={11} />{pitch.likes}</span>
        <span className="flex items-center gap-1"><Presentation size={11} />{pitch.slides?.length || 0} slides</span>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['pitches'],
    queryFn: () => pitchesApi.list({ limit: 6 } as { page?: number; q?: string }).then((r) => r.data),
  });

  const pitches = data?.pitches || [];
  const totalViews = pitches.reduce((s: number, p: Pitch) => s + (p.views || 0), 0);
  const totalLikes = pitches.reduce((s: number, p: Pitch) => s + (p.likes || 0), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Turn any GitHub repo into a pitch deck in seconds.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Pitches" value={user?.pitchCount || 0} icon={Presentation} color="bg-blue-600" />
        <StatCard label="Total Views" value={totalViews} icon={Eye} color="bg-purple-600" />
        <StatCard label="Total Likes" value={totalLikes} icon={Star} color="bg-amber-600" />
        <StatCard label="Ready Pitches" value={pitches.filter((p: Pitch) => p.status === 'ready').length} icon={TrendingUp} color="bg-green-600" />
      </div>

      {/* Quick generate */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-800/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-blue-400" />
            <div>
              <div className="text-white font-bold">Generate a new pitch deck</div>
              <div className="text-gray-400 text-sm">Paste any GitHub repo URL and get a pitch deck instantly</div>
            </div>
          </div>
          <Link to="/pitches/new" className="btn-primary flex-shrink-0">
            <Plus size={16} />
            New Pitch
          </Link>
        </div>
      </div>

      {/* Recent pitches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Recent Pitches</h2>
          <Link to="/pitches" className="text-sm text-blue-400 hover:text-blue-300">View all</Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-24 animate-pulse bg-gray-800" />
            ))}
          </div>
        ) : pitches.length === 0 ? (
          <div className="card text-center py-12">
            <Presentation size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No pitches yet.</p>
            <Link to="/pitches/new" className="btn-primary mt-4 inline-flex">
              <Plus size={15} />
              Generate your first pitch
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pitches.map((p: Pitch) => <PitchCard key={p._id} pitch={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
