import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// for admin routes only
export const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if(user && user.role==='admin'){
    return children;
  }
  return <Navigate to="/login" />;
}

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if(user.role==='admin'){
    return <Navigate to="/admin" />;
  }

  // Special case for game page - allow refresh
  if (location.pathname === '/game') {
    if (user.team) {
      return children;
    }
    return <Navigate to="/teamSelection" />;
  }

  // For team selection page
  if (location.pathname === '/teamSelection') {
    if (user.team) {
      return <Navigate to="/teamDetails" />;
    }
    return children;
  }

  // For all other protected routes
  if (!user.team) {
    return <Navigate to="/teamSelection" />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if(user){
    if(user.role==='admin'){
      return <Navigate to="/admin" />;
    }else {
      return <Navigate to="/teamDetails" />;
    }
  }
 
  return children;
}; 