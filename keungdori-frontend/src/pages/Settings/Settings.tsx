import React from 'react';
import Header from '../../components/Header';
import { ArrowIcon, Badge, Container, HeaderTitle, IconWrapper, ItemLeft, MenuGroup, MenuIcon, MenuItem, MenuTitle, SettingScreenWrapper, VectorIcon } from './Styles';
import vector from '../../assets/vector.png'

const Settings : React.FC = () => {

    return (
        <SettingScreenWrapper>
            <Header leftNode={
                <IconWrapper>
                    <VectorIcon src={vector}></VectorIcon>
                    <HeaderTitle>설정</HeaderTitle>
                </IconWrapper>}>
            </Header>
            
            <Container>
                {/* 내 정보 */}
                <MenuGroup>
                    <MenuItem>
                        <ItemLeft>
                            <MenuIcon src={vector} alt="내 정보 변경" />
                            <MenuTitle>내 정보 변경</MenuTitle>
                        </ItemLeft>
                        <ArrowIcon src={vector} alt="go" />
                    </MenuItem>
                </MenuGroup>

                {/* 고객 지원 */}
                <MenuGroup>
                    <MenuItem>
                        <ItemLeft>
                            <MenuIcon src={vector} alt="내 구독제" />
                            <MenuTitle>내 구독제</MenuTitle>
                        </ItemLeft>
                        <Badge>무료</Badge>
                    </MenuItem>
                    <MenuItem>
                        <ItemLeft>
                            <MenuIcon src={vector} alt="지원 센터" />
                            <MenuTitle>지원 센터</MenuTitle>
                        </ItemLeft>
                    </MenuItem>
                    <MenuItem>
                        <ItemLeft>
                            <MenuIcon src={vector} alt="개인정보 처리방침" />
                            <MenuTitle>개인정보 처리방침</MenuTitle>
                        </ItemLeft>
                    </MenuItem>
                </MenuGroup>

                {/* 친구 및 해시태그 */}
                <MenuGroup>
                    <MenuItem>
                        <ItemLeft>
                            <MenuIcon src={vector} alt="친구 목록 보기/삭제하기" />
                            <MenuTitle>친구 목록 보기 / 삭제하기</MenuTitle>
                        </ItemLeft>
                        <ArrowIcon src={vector} alt="go" />
                    </MenuItem>
                    <MenuItem>
                        <ItemLeft>
                            <MenuIcon src={vector} alt="친구 추가 및 설정" />
                            <MenuTitle>친구 추가 및 설정</MenuTitle>
                        </ItemLeft>
                        <ArrowIcon src={vector} alt="go" />
                    </MenuItem>
                    <MenuItem>
                        <ItemLeft>
                            <MenuIcon src={vector} alt="해시태그 관리" />
                            <MenuTitle>해시태그 관리</MenuTitle>
                        </ItemLeft>
                        <ArrowIcon src={vector} alt="go" />
                    </MenuItem>
                </MenuGroup>

                {/* 기타 */}
                <MenuGroup>
                    <MenuItem>
                        <ItemLeft>
                            <MenuIcon src={vector} alt="문제점 신고" />
                            <MenuTitle>문제점 신고</MenuTitle>
                        </ItemLeft>
                    </MenuItem>
                    <MenuItem>
                        <ItemLeft>
                            <MenuIcon src={vector} alt="로그아웃" />
                            <MenuTitle>로그아웃</MenuTitle>
                        </ItemLeft>
                    </MenuItem>
                </MenuGroup>
            </Container>


        </SettingScreenWrapper>
    );
};

export default Settings;