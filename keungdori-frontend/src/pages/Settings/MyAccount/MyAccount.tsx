import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../../layouts/ScreenWrapper";
import { CameraButton, CameraIcon, ColorSwatch, Form, ImageFileInput, InputLabel, Input, InputWrapper, KeungdoriIcon, OptionWrapper, PickerWrapper, ProfileImage, ProfileImageSection, SubmitButton, ToggleSlider, ToggleSwitch, ValidationMessage } from "./Styles";
import { SwatchesPicker } from "react-color";
import { useImageInput } from "../../../hooks/useImageInput";
import { useImageUpload } from "../../../hooks/useImageUpload";
import profile_image from "../../../assets/profile_image.png";
import camera_icon from "../../../assets/camera_icon.png";
import vector from "../../../assets/vector.png"
import keungdori from "../../../assets/keungdori.png"
import Header from "../../../components/Header";
import { IconWrapper, VectorIcon } from "../Styles";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../../../stores/authStore';
import api from "../../../api/api";

// 받아올 데이터 인터페이스
interface UserInfo {
    profileImage: string;
    nickname: string;
    id: string;
    color: string;
    searchAvailable: boolean;
}

type ValidationState = {
    message: string,
    status: 'success' | 'error';
}

const MyAccount: React.FC = () => {
    const navigate = useNavigate();
    const accessToken = useAuthStore(s => s.accessToken);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null); //변경 여부 확인할 데이터
    const [initialUserInfo, setInitialUserInfo] = useState<UserInfo | null>(null); //기존 내 정보 데이터
    const [error, setError] = useState<string | null>(null);
    const [nicknameValidation, setNicknameValidation] = useState<ValidationState | null>(null);
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const {
        previewUrl,
        imageFile,
        //error: imageError,
        imageFileRef,
        handleImageChange,
        triggerFileInput,
    } = useImageInput(userInfo?.profileImage || profile_image); // 초기 이미지는 불러온 정보 또는 기본 이미지
    const { uploadImage } = useImageUpload();

    //화면 키자 마자 회원 정보 get으로 가져와서 placeholder로 표시하기
    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                if (!accessToken) {
                    throw new Error('인증 토큰이 없습니다.');
                }

                //await를 사용하여 비동기 요청을 기다리고, headers에 토큰 추가
                const response = await api.get('/users/me');
                
                const { userName, searchId, search, kengColor, profileImage } = response.data;

                setUserInfo({
                    profileImage: profileImage,
                    nickname: userName,
                    id: searchId,
                    color: kengColor,
                    searchAvailable: search,
                });
                setInitialUserInfo({
                    profileImage: profileImage,
                    nickname: userName,
                    id: searchId,
                    color: kengColor,
                    searchAvailable: search,
                });

            } catch (err) {
                console.error("내 정보 불러오기 실패:", err);
                setError("내 정보 불러오기 실패");// 1. 에러 모달 띄우기
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

    // 닉네임 변경 검사 로직
    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserInfo(prev => prev ? { ...prev, nickname: value } : null);

        const validationRegex = /^[a-zA-Z0-9_가-힣]*$/;
        if (value && !validationRegex.test(value)) {
            setNicknameValidation({ message: '닉네임은 한글, 영문, 숫자, 언더바(_)만 사용 가능합니다.', status: 'error' });
        } else {
            setNicknameValidation(null);
        }
    };
    
    // 정보 수정 제출 로직
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userInfo || !initialUserInfo) return;

        // 변경된 데이터만 담을 객체
        const updatedData: { [key: string]: any } = {};

        if (imageFile) {
            alert('이미지를 업로드합니다. 잠시만 기다려주세요...');
            const imageUrl = await uploadImage(imageFile);
            if (imageUrl) {
                updatedData.profileImage = imageUrl; 
            } else {
                alert('이미지 업로드에 실패했습니다.');
                return; // 업로드 실패 시 중단
            }
        }

        if (userInfo.nickname !== initialUserInfo.nickname) {
            updatedData.userName = userInfo.nickname;
        }
        if (userInfo.color !== initialUserInfo.color) {
            updatedData.kengColor = userInfo.color; 
        }
        if (userInfo.searchAvailable !== initialUserInfo.searchAvailable) {
            updatedData.search = userInfo.searchAvailable;
        }

        if (Object.keys(updatedData).length === 0) {
            alert('변경 사항이 없습니다.');
            return;
        }

        try {
            const response = await api.patch('/users/me', updatedData);
            console.log(response);
            //alert('정보가 성공적으로 변경되었습니다.'); 2. 모달 띄우기
            
            navigate(-1);
        } catch (error) {
            console.error('정보 수정 실패:', error);
            alert('정보 수정에 실패했습니다.');
        }
    };

    const isFormValid = userInfo.nickname.length > 0 && !nicknameValidation;

    return (
        <ScreenWrapper>
            <Header leftNode={ //1.화면 너비만큼만 차지하도록 변경해야 함? 웹 화면에서는 header가 커짐!
                <IconWrapper>
                    <VectorIcon src={vector} onClick={() => {navigate(-1)}}></VectorIcon>
                    <KeungdoriIcon src={keungdori}></KeungdoriIcon>
                </IconWrapper>}>
            </Header>

            {showColorPicker && (
                <PickerWrapper onClick={() => setShowColorPicker(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <SwatchesPicker color={userInfo.color} onChange={(color) => {
                            setUserInfo(prev => prev ? { ...prev, color: color.hex } : null);
                            setShowColorPicker(false);
                        }} />
                    </div>
                </PickerWrapper>
            )}

            <ProfileImageSection>
                <ProfileImage src={previewUrl || userInfo.profileImage} alt="Profile" />
                <ImageFileInput type="file" accept="image/jpeg,image/png" ref={imageFileRef} onChange={handleImageChange} />
                <CameraButton type="button" onClick={triggerFileInput}>
                    <CameraIcon src={camera_icon} alt="프로필 사진 변경" />
                </CameraButton>
            </ProfileImageSection>

            <Form onSubmit={handleSubmit}>
                <InputWrapper>
                    <InputLabel htmlFor="nickname">닉네임</InputLabel>
                    <Input id="nickname" type="text" value={userInfo.nickname} onChange={handleNicknameChange} placeholder="닉네임" />
                    <ValidationMessage isVisible={!!nicknameValidation} status={nicknameValidation?.status || 'error'}>
                        {nicknameValidation?.message || ''}
                    </ValidationMessage>
                </InputWrapper>

                <InputWrapper>
                    <InputLabel htmlFor="id">아이디</InputLabel>
                    <Input id="id" type="text" value={userInfo.id} placeholder="ID" disabled />
                </InputWrapper>
                
                <OptionWrapper>
                    <span>친구에게 표시될 내 기본 색상</span>
                    <ColorSwatch color={userInfo.color} onClick={() => setShowColorPicker(true)} />
                </OptionWrapper>

                <OptionWrapper>
                    <label htmlFor="search-toggle">내 ID를 친구 검색 결과에 포함합니다</label>
                    <ToggleSwitch htmlFor="search-toggle">
                        <input type="checkbox" id="search-toggle" checked={userInfo.searchAvailable} onChange={() => setUserInfo(prev => prev ? { ...prev, searchAvailable: !prev.searchAvailable } : null)} />
                        <ToggleSlider />
                    </ToggleSwitch>
                </OptionWrapper>

                <SubmitButton type="submit" disabled={!isFormValid}>내 정보 변경</SubmitButton>
            </Form>
        </ScreenWrapper>
    );
};

export default MyAccount;