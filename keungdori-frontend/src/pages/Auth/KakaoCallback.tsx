import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../stores/authStore';

const KakaoCallback = () => {
    const navigate = useNavigate(); //화면 이동을 위한 훅
    const { setToken } = useAuthStore(); //zustand store의 메서드

    useEffect(() => {
        const params = new URL(document.location.toString()).searchParams;
        const authorizationCode = params.get('code'); //url에서 인가코드 추출

        if (authorizationCode) {
            sendCode(authorizationCode);
        } else {
            console.error('인가코드 받지 못함');
            navigate('/login');
        }

    }, [navigate]);

    const sendCode = async (authorizationCode: string) => { //인가코드 백엔드로 전송하고 토큰 받아오기
        try {
            const response = await axios.post('http://localhost:8080/api/auth/kakao/callback',
                 { code: authorizationCode });

            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken); //로컬스토리지에 토큰 저장
            setToken(accessToken); //zustand store에 토큰 저장

            navigate('/signup');
        } catch (error) {
            console.error('인가 코드 보냈는데 응답이 안 옴', error);
            navigate('/');
        }
    }

    return (
        <div>  
        </div>
    );
};

export default KakaoCallback;