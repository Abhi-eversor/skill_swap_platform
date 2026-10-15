import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/apiInstance';
import useAuth from '../auth/useAuth';
import Header from './Header';
import Avatar from './Avatar';
import Skills from './Skills';

export default function UserProfilePreview() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    api.get(`/users/${id}`, { signal: controller.signal })
      .then(({ data }) => setProfile(data.user))
      .catch((error) => { if (error.code !== 'ERR_CANCELED') setError(errorMessage(error, 'Unable to load this profile.')); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  const own = (currentUser?._id || currentUser?.id) === id;
  return <div className="app-shell"><Header /><main className="page-content">
    {loading ? <p role="status">Loading profile...</p> : error ? <p className="error-message" role="alert">{error}</p> : profile && <section className="panel">
      <div className="flex items-center gap-5 mb-6"><Avatar user={profile} large /><div><h1 className="page-title mb-1">{profile.name}</h1>{profile.location && <p className="text-gray-600">{profile.location}</p>}</div></div>
      <Skills title="Skills offered" items={profile.skillsOffered} />
      <Skills title="Skills wanted" items={profile.skillsWanted} wanted />
      <p className="my-5 text-gray-600">Available: {profile.availability?.join(', ') || 'Not specified'}</p>
      {profile.bio && <p className="whitespace-pre-wrap break-words mb-6">{profile.bio}</p>}
      {own ? <Link className="button" to="/userprofile">Edit my profile</Link> : <Link className="button" to={`/users/${id}/request`}>Request a swap</Link>}
    </section>}
  </main></div>;
}
