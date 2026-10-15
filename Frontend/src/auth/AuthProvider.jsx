import { useCallback, useEffect, useState } from 'react';
import api, { errorMessage } from '../api/apiInstance';
import AuthContext from './AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));
  const [sessionError, setSessionError] = useState('');

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setLoading(false);
  }, []);

  const saveSession = (session) => {
    localStorage.setItem('token', session.token);
    localStorage.removeItem('user');
    setSessionError('');
    setUser(session.user);
    setLoading(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    const expire = () => {
      logout();
      setSessionError('Your session expired. Please log in again.');
    };
    window.addEventListener('session-expired', expire);
    if (localStorage.getItem('token')) {
      api.get('/user/me', { signal: controller.signal })
        .then(({ data }) => setUser(data.user))
        .catch((error) => {
          if (error.code !== 'ERR_CANCELED') {
            logout();
            setSessionError(error.response?.status === 401 ? 'Your session expired. Please log in again.' : errorMessage(error, 'Unable to load your account. Please log in again.'));
          }
        })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }
    return () => {
      controller.abort();
      window.removeEventListener('session-expired', expire);
    };
  }, [logout]);

  return <AuthContext.Provider value={{ user, loading, sessionError, saveSession, setUser, logout }}>{children}</AuthContext.Provider>;
}
