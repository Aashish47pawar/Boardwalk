import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Wraps any route that requires a logged-in user. If there's no token in the
// store (and therefore none in localStorage either), bounce to /login.
export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}
