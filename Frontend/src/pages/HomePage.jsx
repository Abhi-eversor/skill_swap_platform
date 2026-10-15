import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api/apiInstance';
import Header from '../components/Header';
import User from '../components/User';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [availability, setAvailability] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    api.get('/users', { params: { q: query, availability }, signal: controller.signal })
      .then(({ data }) => setProfiles(data.users))
      .catch((error) => { if (error.code !== 'ERR_CANCELED') setError(errorMessage(error, 'Unable to load profiles.')); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, availability]);

  return <div className="app-shell">
    <Header />
    <main className="page-content">
      <h1 className="page-title">Find someone to learn with</h1>
      <form className="search-bar" onSubmit={(event) => { event.preventDefault(); setQuery(search.trim()); }}>
        <label className="sr-only" htmlFor="availability">Availability</label>
        <select id="availability" value={availability} onChange={(event) => setAvailability(event.target.value)}>
          <option value="">Any availability</option>
          <option value="Weekends">Weekends</option>
          <option value="Evenings">Evenings</option>
          <option value="Weekdays">Weekdays</option>
        </select>
        <label className="sr-only" htmlFor="search">Search by name or skill</label>
        <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or skill" />
        <button className="button" type="submit">Search</button>
      </form>
      {loading ? <p role="status" className="page-status">Loading profiles...</p> : error ? <p role="alert" className="error-message">{error}</p> : profiles.length ? (
        <div className="space-y-5">{profiles.map((user) => <User key={user._id || user.id} user={user} />)}</div>
      ) : <p className="panel text-gray-600">{query || availability ? 'No profiles match these filters.' : 'No public profiles yet. Register to add yours.'}</p>}
    </main>
  </div>;
}
