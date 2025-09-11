import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import useAuthStore from './stores/authStore';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import api from './api/api';
import Spinner from './components/Spinner';

const Login = lazy(() => import('./pages/Login/Login'));
const KakaoCallback = lazy(() => import('./pages/Auth/KakaoCallback'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const Home = lazy(() => import('./pages/Home/Home'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Search = lazy(() => import('./pages/Search/Search'));
const MyAccount = lazy(() => import('./pages/Settings/MyAccount/MyAccount'));
const ReviewList = lazy(() => import('./pages/Review/ReviewList'));
const ReviewWrite = lazy(() => import('./pages/Review/ReviewWrite/ReviewWrite'));
const ReviewEdit = lazy(() => import('./pages/Review/ReviewEdit/ReviewEdit'));

const App: React.FC = () => {
  const { setToken } = useAuthStore();
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

  if (isLoading) { //1. 처음 앱 켜서 로딩할때, 동작함 -> pwa에서 제공하는 스플래시 화면말고 커스텀 스플래시 따로 또 보여주게 하자
    return <Spinner />;
  }

  return (
    <>
    <GlobalStyles></GlobalStyles>
    <Suspense fallback={<Spinner />}> {/*suspense로 각 화면으로 이동할때 화면 코드 로딩하는데, 그때 로딩중일때 spinner 띄움*/}
      <Routes>
        {/* 로그인 안하면 로그인 화면, 회원가입 화면 나올 수 있도록 함 */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* 로그인한 사용자는 바로 홈화면으로 이동함 */}
        <Route element={<PrivateRoute />}>
          <Route path="/signup" element={<SignUp />} />
          {/*<Route path="/home" element={<Home />} />*/}
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/account" element={<MyAccount />} />
          <Route path="/review/reviewlist/:placeId" element={<ReviewList />} />
          <Route path="/review/writereview/:placeId" element={<ReviewWrite />} />
          <Route path="/review/modifyreview/:placeId" element={<ReviewEdit />} />
        </Route>
        <Route path="/home" element={<Home />} />
        <Route path="/oauth/callback" element={<KakaoCallback />} />
      </Routes>
    </Suspense>
    </>
  );

};

export default App;
