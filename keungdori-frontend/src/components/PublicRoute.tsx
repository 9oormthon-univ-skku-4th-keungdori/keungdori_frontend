import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const PublicRoute = () => {
  const { isLoggedIn } = useAuthStore.getState();

  return !isLoggedIn ? <Outlet /> : <Navigate to="/home" replace />;
};

export default PublicRoute;