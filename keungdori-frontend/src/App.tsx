import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Login from './pages/Login/Login';
import KakaoCallback from './pages/Auth/KakaoCallback';
import useAuthStore from './stores/authStore';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import Search from './pages/Search/Search';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import MyAccount from './pages/Settings/MyAccount/MyAccount';
import ReviewList from './pages/Review/ReviewList';
import ReviewWrite from './pages/Review/ReviewWrite/ReviewWrite';
import ReviewEdit from './pages/Review/ReviewEdit/ReviewEdit';
import api from './api/api';

const App: React.FC = () => {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const silentRefresh = async() => {
      try {
        const response = await api.post('/auth/reissue');
        const newAccessToken = response.data.accessToken;
        setToken(newAccessToken);
      } catch (error) {
        console.log("자동 로그인 실패. 유효한 Refresh Token이 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    silentRefresh();

  }, [setToken]);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <>
    <GlobalStyles></GlobalStyles>
      <Routes>
        {/* 로그인 안하면 로그인 화면, 회원가입 화면 나올 수 있도록 함 */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* 로그인한 사용자는 바로 홈화면으로 이동함 */}
        <Route element={<PrivateRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/account" element={<MyAccount />} />
          <Route path="/review/reviewlist/:placeId" element={<ReviewList />} />
          <Route path="/review/writereview/:placeId" element={<ReviewWrite />} />
          <Route path="/review/modifyreview/:placeId" element={<ReviewEdit />} />
        </Route>

        {/* 인증과 무관한 페이지 */}
        <Route path="/oauth/callback" element={<KakaoCallback />} />
      </Routes>
    </>
  );

};

export default App;
