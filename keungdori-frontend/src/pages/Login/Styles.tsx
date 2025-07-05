import styled from '@emotion/styled';
import kakaoLoginImg from '../../assets/kakao_login_medium_wide.png'

export const SplashWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

export const SplashImage = styled.img`
    display: block;     /* img 하단 여백 제거하려고 */
    width: 100%;
    height: 100%;
    object-fit: cover;  /* 비율 유지하면서 꽉 채우려고 */
`;

export const KakaoLoginButton = styled.button`
    width: 300px;
    height: 45px;
    padding: 0;
    border: none;
    border-radius: 12px;
    background-image: url(${kakaoLoginImg});
    background-size: cover;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px;
    cursor: pointer;
`;
