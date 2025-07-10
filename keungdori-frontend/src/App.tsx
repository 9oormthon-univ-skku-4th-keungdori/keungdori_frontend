import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Login from './pages/Login/Login';
import KakaoCallback from './pages/Auth/KakaoCallback';
import useAuthStore from './stores/authStore';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

const App: React.FC = () => {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken'); //localstorage에서 토큰 가져오기
    if (storedToken) {
      setToken(storedToken);
      navigate('/home', { replace: true }); //replace: true로 뒤로가기 하면 로그인으로 안 가도록함
    }
  }, [setToken, navigate]);

  return (
    <>
    <GlobalStyles></GlobalStyles>
      <Routes>
        {/* 로그인 안하면 로그인 화면, 회원가입 화면 나올 수 있도록 함 */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* 로그인한 사용자는 바로 홈화면으로 이동함 */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 인증과 무관한 페이지 */}
        <Route path="/oauth/callback" element={<KakaoCallback />} />
      </Routes>
    </>
  );

};

export default App;
