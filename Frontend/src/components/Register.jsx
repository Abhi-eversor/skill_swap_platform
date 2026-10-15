import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api/apiInstance';
import useAuth from '../auth/useAuth';
import ProfileFields from './ProfileFields';
import { emptyProfile, profileToPayload } from '../utility/profile';

export default function Register() {
  const [form, setForm] = useState({ ...emptyProfile, email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { user, loading, saveSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const destination = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/userprofile';
  if (user) return <Navigate to={destination} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post('/user/register', { ...profileToPayload(form), email: form.email.trim(), password: form.password });
      saveSession(data);
      navigate(destination, { replace: true });
    } catch (error) { setError(errorMessage(error, 'Unable to register.')); }
    finally { setBusy(false); }
  };

  return <div className="app-shell auth-page"><main className="panel register-panel">
    <Link className="brand" to="/">Skill Swap Platform</Link>
    <h1 className="page-title mt-6">Register</h1>
    {error && <p className="error-message" role="alert">{error}</p>}
    <form className="form-stack" onSubmit={submit}>
      <div className="form-grid">
        <label className="form-full">Email<input type="email" name="email" autoComplete="email" required maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Password<input type="password" name="password" autoComplete="new-password" required minLength={8} maxLength={72} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><span className="field-help">Use at least 8 characters.</span></label>
        <label>Confirm password<input type="password" name="confirmPassword" autoComplete="new-password" required minLength={8} maxLength={72} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /></label>
      </div>
      <ProfileFields form={form} setForm={setForm} />
      <button className="button" disabled={busy || loading}>{busy ? 'Creating account...' : 'Create account'}</button>
    </form>
    <p className="text-sm mt-5">Already registered? <Link className="text-pink-700 underline" to="/login" state={location.state}>Log in</Link></p>
  </main></div>;
}
