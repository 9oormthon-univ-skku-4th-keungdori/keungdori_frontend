import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../stores/authStore';

const KakaoCallback = () => {
    const navigate = useNavigate(); //화면 이동을 위한 훅
    const { setToken } = useAuthStore(); //zustand store의 메서드

    useEffect(() => {
        const params = new URL(document.location.toString()).searchParams;
        const code = params.get('code'); //url에서 인가코드 추출

        if (code) {
            sendCode(code);
        } else {
            console.error('인가코드 받지 못함');
            navigate('/login');
        }

    }, [navigate, setToken]);

    const sendCode = async (code: string) => { //인가코드 백엔드로 전송하고 토큰 받아오기
        try {
            const response = await axios.post('http://localhost:8080/api/auth/kakao/callback',
                 { authorizationCode: code });

            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken); //로컬스토리지에 토큰 저장
            setToken(accessToken); //zustand store에 토큰 저장

            navigate('/home');
        } catch (error) {
            console.error('토큰을 받지 못함', error);
            navigate('/');
        }
    }

    return (
        <div>  
        </div>
    );
};

export default KakaoCallback;