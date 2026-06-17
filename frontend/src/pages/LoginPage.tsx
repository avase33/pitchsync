import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Presentation } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Invalid credentials');
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Presentation size={20} className="text-white" />
          </div>
          <span className="text-2xl font-black text-white">PitchSync</span>
        </div>

        <div className="card">
          <h1 className="text-xl font-bold text-white mb-6">Sign in to your account</h1>
          {error && (
            <div className="mb-4 rounded-lg bg-red-900/40 border border-red-800 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-gray-500">
            New to PitchSync?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
