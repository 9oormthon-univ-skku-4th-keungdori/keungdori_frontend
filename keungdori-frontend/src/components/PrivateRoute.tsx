import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const PrivateRoute = () => {
  const { isLoggedIn } = useAuthStore.getState();

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />; //outlet은 자식 컴포넌트를 렌더링함
};

export default PrivateRoute;