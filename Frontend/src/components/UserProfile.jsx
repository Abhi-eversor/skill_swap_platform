import { useState } from 'react';
import api, { errorMessage } from '../api/apiInstance';
import useAuth from '../auth/useAuth';
import { profileToForm, profileToPayload } from '../utility/profile';
import Header from './Header';
import Avatar from './Avatar';
import ProfileFields from './ProfileFields';

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(() => profileToForm(user));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const { data } = await api.patch('/user/me', profileToPayload(form));
      setUser(data.user);
      setForm(profileToForm(data.user));
      setNotice('Profile saved.');
    } catch (error) { setError(errorMessage(error, 'Unable to save your profile.')); }
    finally { setBusy(false); }
  };

  return <div className="app-shell"><Header /><main className="page-content">
    <section className="panel">
      <div className="flex items-center gap-5 mb-6"><Avatar user={user} large /><div><h1 className="page-title mb-1">My profile</h1><p className="text-gray-600 break-all">{user.email}</p></div></div>
      {error && <p className="error-message" role="alert">{error}</p>}
      {notice && <p className="success-message" role="status">{notice}</p>}
      <form className="form-stack" onSubmit={save}>
        <ProfileFields form={form} setForm={setForm} />
        <div className="flex gap-3 flex-wrap">
          <button className="button" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
          <button className="button button-secondary" type="button" disabled={busy} onClick={() => { setForm(profileToForm(user)); setError(''); setNotice('Changes discarded.'); }}>Discard</button>
        </div>
      </form>
    </section>
  </main></div>;
}
