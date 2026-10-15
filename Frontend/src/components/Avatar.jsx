import { useState } from 'react';

export default function Avatar({ user, large = false }) {
  const [failedUrl, setFailedUrl] = useState('');
  const src = /^https?:\/\//i.test(user?.profilePhoto || '') ? user.profilePhoto : '';
  const className = `avatar${large ? ' avatar-large' : ''}`;
  return src && failedUrl !== src ? (
    <img className={className} src={src} alt={user.name} onError={() => setFailedUrl(src)} referrerPolicy="no-referrer" />
  ) : (
    <span className={className} role="img" aria-label={`${user?.name || 'Member'}'s avatar`}>
      {(user?.name || '?').trim().slice(0, 1).toUpperCase()}
    </span>
  );
}
