import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Presentation, Globe, LogOut, Plus, User } from 'lucide-react';
import { useAuthStore } from '../store/auth';

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pitches', icon: Presentation, label: 'My Pitches' },
  { to: '/explore', icon: Globe, label: 'Explore' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Presentation size={16} className="text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">PitchSync</span>
        </div>

        {/* New Pitch button */}
        <div className="px-3 pt-4">
          <Link
            to="/pitches/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <Plus size={15} />
            New Pitch
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-gray-800 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
              {user?.initials || <User size={14} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-200">{user?.name}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 transition-colors"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
