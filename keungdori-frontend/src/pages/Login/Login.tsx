import React from 'react';
import splash_screen from '../../assets/splash_screen.png'
import { SplashWrapper, SplashImage, KakaoLoginButton } from './Styles';

const Login: React.FC = () => {

    const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI; // 백엔드와 협의 후 정해야 함

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const handleLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    }

    return (
        <SplashWrapper>
            <SplashImage src={splash_screen} ></SplashImage>
            <KakaoLoginButton onClick={handleLogin}></KakaoLoginButton>
        </SplashWrapper>

    );
}

export default Login;