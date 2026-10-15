import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { errorMessage } from '../api/apiInstance';
import useAuth from '../auth/useAuth';
import Header from './Header';
import Avatar from './Avatar';

export default function SwapRequestDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');
  const currentId = user._id || user.id;

  useEffect(() => {
    const controller = new AbortController();
    api.get('/swaps', { signal: controller.signal })
      .then(({ data }) => setRequests(data.swaps))
      .catch((error) => { if (error.code !== 'ERR_CANCELED') setError(errorMessage(error, 'Unable to load swap requests.')); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const update = async (requestId, status) => {
    setBusyId(requestId);
    setError('');
    setNotice('');
    try {
      const { data } = await api.patch(`/swaps/${requestId}`, { status });
      setRequests((current) => current.map((request) => (request._id || request.id) === requestId ? data.swap : request));
      setNotice(`Request ${status}.`);
    } catch (error) {
      setError(errorMessage(error, 'Unable to update this request.'));
    } finally { setBusyId(''); }
  };

  const filtered = requests.filter((request) => {
    const text = [request.requester?.name, request.responder?.name, request.skillOffered, request.skillRequested].join(' ').toLowerCase();
    return (!filter || request.status === filter) && text.includes(search.trim().toLowerCase());
  });

  return <div className="app-shell"><Header /><main className="page-content">
    <h1 className="page-title">Swap requests</h1>
    <div className="search-bar">
      <label className="sr-only" htmlFor="status">Request status</label>
      <select id="status" value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="">All requests</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option>
      </select>
      <label className="sr-only" htmlFor="request-search">Search requests</label>
      <input id="request-search" placeholder="Search by name or skill" value={search} onChange={(event) => setSearch(event.target.value)} />
    </div>
    {error && <p className="error-message" role="alert">{error}</p>}
    {notice && <p className="success-message" role="status">{notice}</p>}
    {loading ? <p role="status">Loading swap requests...</p> : <div className="space-y-5">
      {!filtered.length && !error && <p className="panel text-gray-600">No {filter ? `${filter} ` : ''}requests found.</p>}
      {filtered.map((request) => {
        const requestId = request._id || request.id;
        const outgoing = (request.requester?._id || request.requester?.id) === currentId;
        const other = outgoing ? request.responder : request.requester;
        const otherId = other?._id || other?.id;
        return <article key={requestId} className="panel member-card">
          <Avatar user={other} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500">{outgoing ? 'Sent to' : 'Received from'}</p>
            <h2 className="text-xl font-semibold text-pink-700">{otherId ? <Link to={`/users/${otherId}`}>{other.name}</Link> : 'Deleted account'}</h2>
            <p className="mt-3"><strong>You teach:</strong> {outgoing ? request.skillOffered : request.skillRequested}</p>
            <p><strong>You learn:</strong> {outgoing ? request.skillRequested : request.skillOffered}</p>
            {request.message && <p className="mt-3 whitespace-pre-wrap break-words text-gray-600">{request.message}</p>}
            <p className="mt-3 text-sm font-semibold capitalize">{request.status}</p>
          </div>
          {request.status === 'pending' && <div className="flex flex-wrap gap-3">
            {outgoing ? <button className="button button-secondary" disabled={Boolean(busyId)} onClick={() => update(requestId, 'cancelled')}>{busyId === requestId ? 'Updating...' : 'Cancel request'}</button> : <>
              <button className="button" disabled={Boolean(busyId)} onClick={() => update(requestId, 'accepted')}>{busyId === requestId ? 'Updating...' : 'Accept'}</button>
              <button className="button button-secondary" disabled={Boolean(busyId)} onClick={() => update(requestId, 'rejected')}>Reject</button>
            </>}
          </div>}
        </article>;
      })}
    </div>}
  </main></div>;
}
