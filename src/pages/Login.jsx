import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login, signup } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | signup
  const [role, setRole] = useState('participant');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = mode === 'signup'
        ? await signup({ name, email, password, role })
        : await login(email, password);
      navigate(user.role === 'organizer' ? '/organizer' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-2xl mb-1 text-center">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="text-white/40 text-sm text-center mb-8">
        {mode === 'login' ? 'Log in to register and track your fest.' : 'Sign up to start registering for sub-events.'}
      </p>

      <div className="card p-1 flex mb-6">
        {['participant', 'organizer'].map(r => (
          <button key={r} type="button" onClick={() => setRole(r)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${role === r ? 'bg-purple-light text-white' : 'text-white/40'}`}>
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <input className="input" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
        )}
        <input className="input" type="email" placeholder="you@college.edu" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        {error && <p className="text-danger text-xs">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
          {busy ? 'Please wait…' : mode === 'login' ? `Log in as ${role}` : `Sign up as ${role}`}
        </button>
      </form>

      <p className="text-xs text-white/30 text-center mt-5">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" className="text-purple-light hover:underline" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
}
