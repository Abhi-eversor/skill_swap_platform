import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/apiInstance';
import useAuth from '../auth/useAuth';
import Header from './Header';

export default function SendSwapRequest() {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ skillOffered: '', skillRequested: '', message: '' });
  const navigate = useNavigate();
  const own = (user._id || user.id) === id;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setTarget(null);
    setForm({ skillOffered: '', skillRequested: '', message: '' });
    Promise.all([api.get(`/users/${id}`, { signal: controller.signal }), api.get('/user/me', { signal: controller.signal })])
      .then(([targetResponse, ownResponse]) => { setTarget(targetResponse.data.user); setUser(ownResponse.data.user); })
      .catch((error) => { if (error.code !== 'ERR_CANCELED') setError(errorMessage(error, 'Unable to load swap details.')); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, setUser]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/swaps', { responder: id, ...form });
      navigate('/swaps', { replace: true, state: { notice: 'Swap request sent.' } });
    } catch (error) { setError(errorMessage(error, 'Unable to send your request.')); }
    finally { setBusy(false); }
  };

  return <div className="app-shell"><Header /><main className="page-content narrow-content">
    <section className="panel">
      <h1 className="page-title">{target ? `Swap with ${target.name}` : 'Send a swap request'}</h1>
      {loading ? <p role="status">Loading skills...</p> : <>
        {error && <p className="error-message" role="alert">{error}</p>}
        {own ? <p>You cannot request a swap with yourself. <Link className="underline" to="/">Find another member</Link>.</p> : target && <>
          {!user.skillsOffered?.length || !target.skillsOffered?.length ? <p>Add an offered skill to your profile and choose a member who has offered skills. <Link className="text-pink-700 underline" to="/userprofile">Edit your profile</Link>.</p> : <form className="form-stack" onSubmit={submit}>
            <label>Skill you can teach<select required name="skillOffered" value={form.skillOffered} onChange={(event) => setForm({ ...form, skillOffered: event.target.value })}><option value="">Choose one of your skills</option>{user.skillsOffered.map((skill) => <option key={skill}>{skill}</option>)}</select></label>
            <label>Skill you want to learn<select required name="skillRequested" value={form.skillRequested} onChange={(event) => setForm({ ...form, skillRequested: event.target.value })}><option value="">Choose one of their skills</option>{target.skillsOffered.map((skill) => <option key={skill}>{skill}</option>)}</select></label>
            <label>Message (optional)<textarea name="message" rows={4} maxLength={1000} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
            <div className="flex gap-3 flex-wrap"><button className="button" disabled={busy}>{busy ? 'Sending...' : 'Send request'}</button><Link className="button button-secondary" to={`/users/${id}`}>Back to profile</Link></div>
          </form>}
        </>}
      </>}
    </section>
  </main></div>;
}
