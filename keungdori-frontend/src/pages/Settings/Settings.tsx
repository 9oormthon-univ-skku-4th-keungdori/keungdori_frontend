import React, { Suspense, useState } from 'react';
import Header from '../../components/Header';
import { ArrowIcon, Badge, Container, HeaderTitle, IconWrapper, ItemLeft, MenuGroup, MenuIcon, MenuItem, MenuTitle, Myaccount, SettingScreenWrapper, VectorIcon } from './Styles';
import vector from '../../assets/vector.svg';
import vectorReverse from '../../assets/vector_reverse.png';
import account from '../../assets/account.svg';
import subscribe from '../../assets/subscribe.svg';
import support from '../../assets/support.svg';
import info from '../../assets/information.svg';
import friend from '../../assets/friend.svg';
import addFriend from '../../assets/add_friend.svg';
import hashtag from '../../assets/hashtag.svg';
import logout from '../../assets/logout.svg';
import out from '../../assets/out.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import authApi from '../../api/authApi';
import api from '../../api/api';
const ConfirmModal = React.lazy(() => import('../../components/confirmmodal/ConfirmModal'));

const Settings : React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogoutModalOpen, setLogoutIsModalOpen] = useState(false);
    const [isUnsubscribeModalOpen, setUnsubscribeIsModalOpen] = useState(false);
    const { logout: clearAuthState } = useAuthStore(); // Zustand의 logout 함수

    const handleLogoutClick = () => {
        setLogoutIsModalOpen(true);
    };

    const confirmLogout = async () => {
        try {
            await authApi.logout(); // 서버에 로그아웃 요청
            setLogoutIsModalOpen(false); // 모달 닫기
            clearAuthState(); // Zustand 상태 초기화(access token 지우기)
            navigate('/'); // 로그인 페이지로 이동
        } catch (error) {
            console.log("로그아웃 실패");
        }
    };

    const handleUnsubscribeClick = () => {
        setUnsubscribeIsModalOpen(true);
    }

    const confirmUnsubscribe = async () => {
        try {
            await api.delete('/users/me');
            setUnsubscribeIsModalOpen(false); // 모달 닫기
            clearAuthState(); // Zustand 상태 초기화(access token 지우기)
            navigate('/'); // 로그인 페이지로 이동
        } catch (error) {
            console.log("로그아웃 실패");
        }
    }

    const handleReturn = () => {
        const from = location.state?.from;
        navigate(from);
    }

    return (
        <>
            <SettingScreenWrapper>
                <Header leftNode={
                    <IconWrapper>
                        <VectorIcon src={vector} onClick={handleReturn}></VectorIcon>
                        <HeaderTitle>설정</HeaderTitle>
                    </IconWrapper>}>
                </Header>
                
                <Container>
                    <MenuGroup>
                        <Myaccount onClick={() => navigate('/settings/account')}>
                            <ItemLeft>
                                <MenuIcon src={account} alt="내 정보 변경" />
                                <MenuTitle>내 정보 변경</MenuTitle>
                            </ItemLeft>
                        </Myaccount>
                    </MenuGroup>

                    <MenuGroup>
                        <MenuItem>
                            <ItemLeft>
                                <MenuIcon src={subscribe} alt="내 구독제" />
                                <MenuTitle>내 구독제</MenuTitle>
                            </ItemLeft>
                            <Badge>무료</Badge>
                        </MenuItem>
                        <MenuItem>
                            <ItemLeft>
                                <MenuIcon src={support} alt="지원 센터" />
                                <MenuTitle>지원 센터</MenuTitle>
                            </ItemLeft>
                        </MenuItem>
                        <MenuItem>
                            <ItemLeft>
                                <MenuIcon src={info} alt="개인정보 처리방침" />
                                <MenuTitle>개인정보 처리방침</MenuTitle>
                            </ItemLeft>
                        </MenuItem>
                    </MenuGroup>

                    <MenuGroup>
                        <MenuItem>
                            <ItemLeft>
                                <MenuIcon src={friend} alt="친구 목록 보기/삭제하기" />
                                <MenuTitle>친구 목록 보기 / 삭제하기</MenuTitle>
                            </ItemLeft>
                            <ArrowIcon src={vectorReverse} alt="go" />
                        </MenuItem>
                        <MenuItem>
                            <ItemLeft>
                                <MenuIcon src={addFriend} alt="친구 추가 및 설정" />
                                <MenuTitle>친구 추가 및 설정</MenuTitle>
                            </ItemLeft>
                            <ArrowIcon src={vectorReverse} alt="go" />
                        </MenuItem>
                        <MenuItem>
                            <ItemLeft>
                                <MenuIcon src={hashtag} alt="해시태그 관리" />
                                <MenuTitle>해시태그 관리</MenuTitle>
                            </ItemLeft>
                            <ArrowIcon src={vectorReverse} alt="go" />
                        </MenuItem>
                    </MenuGroup>

                    <MenuGroup>
                        <MenuItem onClick={handleLogoutClick}>
                            <ItemLeft>
                                <MenuIcon src={logout} alt="로그아웃" />
                                <MenuTitle>로그아웃</MenuTitle>
                            </ItemLeft>
                        </MenuItem>
                        <MenuItem onClick={handleUnsubscribeClick}>
                            <ItemLeft>
                                <MenuIcon src={out} alt="회원탈퇴" />
                                <MenuTitle>회원 탈퇴</MenuTitle>
                            </ItemLeft>
                        </MenuItem>
                    </MenuGroup>
                </Container>

            </SettingScreenWrapper>

            {isLogoutModalOpen && (
                <Suspense fallback={null}>
                    <ConfirmModal
                    isOpen
                    onClose={() => setLogoutIsModalOpen(false)}
                    onConfirm={confirmLogout}
                    text="로그아웃 하시겠습니까?"
                    closeText="취소"
                    confirmText="로그아웃"
                    />
                </Suspense>
            )}
            {isUnsubscribeModalOpen && (
                <Suspense fallback={null}>
                    <ConfirmModal
                    isOpen
                    onClose={() => setUnsubscribeIsModalOpen(false)}
                    onConfirm={confirmUnsubscribe}
                    text="탈퇴하시겠습니까?"
                    closeText="취소"
                    confirmText="회원탈퇴"
                    />
                </Suspense>
            )}
        </>

    );
};

export default Settings;