import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api/apiInstance';
import useAuth from '../auth/useAuth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { user, loading, sessionError, saveSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from;
  const destination = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/userprofile';

  if (user) return <Navigate to={destination} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/user/login', form);
      saveSession(data);
      navigate(destination, { replace: true });
    } catch (error) {
      setError(errorMessage(error, 'Unable to log in.'));
    } finally { setBusy(false); }
  };

  return <div className="app-shell auth-page"><main className="panel auth-panel">
    <Link to="/" className="brand">Skill Swap Platform</Link>
    <h1 className="page-title mt-6">Log in</h1>
    {(error || sessionError) && <p className="error-message" role="alert">{error || sessionError}</p>}
    <form className="form-stack" onSubmit={submit}>
      <label>Email<input type="email" name="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
      <label>Password<input type="password" name="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
      <button className="button" disabled={busy || loading}>{busy ? 'Logging in...' : 'Log in'}</button>
    </form>
    <p className="text-sm mt-5">No account yet? <Link className="text-pink-700 underline" to="/register" state={location.state}>Register</Link></p>
    <Link className="text-sm text-gray-600 underline mt-4 inline-block" to="/">Back to profiles</Link>
  </main></div>;
}
