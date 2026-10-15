import { Link, useNavigate } from 'react-router-dom';
import { startTransition } from 'react';
import useAuth from '../auth/useAuth';

export default function Header() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="site-header">
      <Link to="/" className="brand">Skill Swap Platform</Link>
      <nav aria-label="Main navigation">
        <Link to="/">Home</Link>
        {!loading && (user ? <>
          <Link to="/swaps">Swap requests</Link>
          <Link to="/userprofile">My profile</Link>
          <button type="button" className="button button-small" onClick={() => {
            startTransition(() => {
              logout();
              navigate('/', { replace: true });
            });
          }}>Log out</button>
        </> : <>
          <Link to="/login">Log in</Link>
          <Link className="button button-small" to="/register">Register</Link>
        </>)}
      </nav>
    </header>
  );
}
