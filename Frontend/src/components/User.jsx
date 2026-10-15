import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Skills from './Skills';

export default function User({ user }) {
  return <article className="panel member-card">
    <Avatar user={user} />
    <div className="flex-1 min-w-0">
      <h2 className="text-xl font-semibold text-pink-700"><Link to={`/users/${user._id || user.id}`}>{user.name}</Link></h2>
      {user.location && <p className="text-sm text-gray-600">{user.location}</p>}
      <Skills title="Skills offered" items={user.skillsOffered} />
      <Skills title="Skills wanted" items={user.skillsWanted} wanted />
      {user.availability?.length > 0 && <p className="text-sm text-gray-600 mt-3">Available: {user.availability.join(', ')}</p>}
    </div>
    <Link className="button" to={`/users/${user._id || user.id}`}>View profile</Link>
  </article>;
}
