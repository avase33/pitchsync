import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Presentation } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Registration failed');
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
          <h1 className="text-xl font-bold text-white mb-6">Create your account</h1>
          {error && (
            <div className="mb-4 rounded-lg bg-red-900/40 border border-red-800 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          By creating an account, you agree to use PitchSync for legitimate purposes.
        </p>
      </div>
    </div>
  );
}
