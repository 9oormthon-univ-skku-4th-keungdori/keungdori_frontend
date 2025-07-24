import React, { useState } from 'react';
import Header from '../../components/Header';
import { ArrowIcon, Badge, Container, HeaderTitle, IconWrapper, ItemLeft, MenuGroup, MenuIcon, MenuItem, MenuTitle, SettingScreenWrapper, VectorIcon } from './Styles';
import vector from '../../assets/vector.png';
import vectorReverse from '../../assets/vector_reverse.png';
import account from '../../assets/account.png';
import subscribe from '../../assets/subscribe.png';
import support from '../../assets/support.png';
import info from '../../assets/information.png';
import trashCan from '../../assets/trash_can.png';
import addFriend from '../../assets/add_friend.png';
import hashtag from '../../assets/hashtag.png';
import logout from '../../assets/logout.png';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import LogoutModal from '../../components/logoutmodal/LogoutModal';
import authApi from '../../api/authApi';

const Settings : React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { logout: clearAuthState } = useAuthStore(); // Zustand의 logout 함수

    const handleLogoutClick = () => {
        setIsModalOpen(true);
    };

    const confirmLogout = async () => {
        try {
            await authApi.logout(); // 서버에 로그아웃 요청
            setIsModalOpen(false); // 모달 닫기
            clearAuthState(); // Zustand 상태 초기화(access token 지우기)
            navigate('/'); // 로그인 페이지로 이동
        } catch (error) {
            console.log("로그아웃 실패");
        }
    };

    const handleReturn = () => {
        navigate(-1);//홈이나 검색으로 되돌아가게 해야 함(설정 세부 옵션으로 돌아가지 말고)
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
                        <MenuItem onClick={() => navigate('/settings/account')}>
                            <ItemLeft>
                                <MenuIcon src={account} alt="내 정보 변경" />
                                <MenuTitle>내 정보 변경</MenuTitle>
                            </ItemLeft>
                        </MenuItem>
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
                                <MenuIcon src={trashCan} alt="친구 목록 보기/삭제하기" />
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
                        <MenuItem>
                            <ItemLeft>
                                <MenuIcon src={hashtag} alt="문제점 신고" />
                                <MenuTitle>문제점 신고</MenuTitle>
                            </ItemLeft>
                        </MenuItem>
                        <MenuItem onClick={handleLogoutClick}>
                            <ItemLeft>
                                <MenuIcon src={logout} alt="로그아웃" />
                                <MenuTitle>로그아웃</MenuTitle>
                            </ItemLeft>
                        </MenuItem>
                    </MenuGroup>
                </Container>

            </SettingScreenWrapper>

            <LogoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmLogout} text="로그아웃 하시겠습니까?"/>
 
        </>

    );
};

export default Settings;