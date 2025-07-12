import axios from "axios";
import React, { useEffect, useState } from "react";

interface UserInfo {
    profileImage: string;
    nickname: string;
    id: string;
    color: string;
    searchAvailable: boolean;
}

const MyAccount: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('인증 토큰이 없습니다.');
                }

                //await를 사용하여 비동기 요청을 기다리고, headers에 토큰 추가
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: {
                        // 일반적인 Bearer 토큰 형식
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const { userName, userId, search, kengColor, profileImage } = response.data;
                setUserInfo({
                    profileImage: profileImage,
                    nickname: userName,
                    id: userId,
                    color: kengColor,
                    searchAvailable: search,
                });

            } catch (err) {
                console.error("내 정보 불러오기 실패:", err);
                setError("정보를 불러오는 데 실패했습니다.");
            }
        };

        fetchMyInfo();
    }, []);

    if (error) {
        return <div>에러: {error}</div>;
    }
    if (!userInfo) {
        return null;
    }

    return (
        <div>
            <p>닉네임: {userInfo.nickname}</p>
            <p>아이디: {userInfo.id}</p>
        </div>
    );
};

export default MyAccount;