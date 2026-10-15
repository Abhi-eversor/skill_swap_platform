import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AuthProvider from './auth/AuthProvider';
import useAuth from './auth/useAuth';
import HomePage from './pages/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import UserProfilePreview from './components/MemberProfile';
import SendSwapRequest from './components/SendSwapRequest';
import SwapRequestDashboard from './components/SwapRequestDashboard';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p className="page-status" role="status">Loading your account...</p>;
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:id" element={<UserProfilePreview />} />
        <Route path="/users/:id/request" element={<ProtectedRoute><SendSwapRequest /></ProtectedRoute>} />
        <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/swaps" element={<ProtectedRoute><SwapRequestDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
