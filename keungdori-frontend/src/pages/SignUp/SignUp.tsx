import React, { useState } from "react";
import { ProfileImageSection, ProfileImage, ImageFileInput, Form, InputWrapper, Input, SubmitButton, CameraButton, CameraIcon, IdInputWrapper, DuplicateCheckButton, ValidationMessage, OptionWrapper, ToggleSwitch, ToggleSlider, PickerWrapper, ColorSwatch } from "./Styles";
import { useImageInput } from "../../hooks/useImageInput";
import { useImageUpload } from "../../hooks/useImageUpload";
import profile_image from "../../assets/profile_image.png";
import camera_icon from "../../assets/camera_icon.png"
import ScreenWrapper from "../../layouts/ScreenWrapper";
import axios from "axios";
import useAuthStore from '../../stores/authStore';
import { SwatchesPicker } from "react-color";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

type ValidationState = {
    message: string,
    status: 'success' | 'error';
}
//이미 회원가입한 사용자가 접속하는 거 막기
const SignUp: React.FC = () => {
    const { setToken } = useAuthStore();
    const navigate = useNavigate();
    const { 
        previewUrl, 
        imageFile, 
        error: imageError, // 1.이미지 파일 아닌 파일 올리면 에러 나는데, 이때 모달 띄워야 함
        imageFileRef, 
        handleImageChange, 
        triggerFileInput // 'handleCameraButton' 대신 사용할 함수
    } = useImageInput(profile_image);
    const { uploadImage } = useImageUpload();
    const [nickname, setNickname] = useState('');
    const [id, setId] = useState('');
    const [nicknameValidation, setNicknameValidation] = useState<ValidationState | null>(null);
    const [idValidation, setIdValidation] = useState<ValidationState | null>(null);
    const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
    const [searchAvailable, setSearchAvailable] = useState<boolean>(true);
    const [userColor, setUserColor] = useState<string>('#FF3662');
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false); // 컬러 피커 표시 여부
    const isFormValid = nickname.length > 0 && !nicknameValidation && isIdAvailable;

    //닉네임 유효성 검사(영문,숫자,언더바만)
    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNickname(value);

        const validationRegex = /^[a-zA-Z0-9_]*$/;
        if (value && !validationRegex.test(value)) {
            setNicknameValidation({ message: '닉네임은 영문, 숫자, 언더바(_)만 가능합니다!', status : 'error' });
        } else {
            setNicknameValidation(null);
        }
    }

    //아이디 유효성 검사(영문, 숫자, 언더바만)
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setId(value);
        setIsIdAvailable(false);

        const validationRegex = /^[a-zA-Z0-9_]*$/;
        if (value && !validationRegex.test(value)) {
            setIdValidation({ message: 'ID는 영문, 숫자, 언더바(_)만 가능합니다!', status : 'error' });
        } else {
            setIdValidation(null);
        }
    }

    //아이디 중복 여부 검사
    const handleCheckId = async () => {
        if (!id || (idValidation && idValidation.status === 'error')) {
            setIdValidation({ message: 'ID를 조건에 맞게 입력해주세요!', status : 'error' });
            return;
        }
        
        try {
            const response = await axios.get(`http://localhost:8080/api/users/check-id?value=${id}`);
            if (response.data.available) {
                setIdValidation({ message : '사용 가능한 ID입니다!', status: 'success' });
                setIsIdAvailable(true);
            } else {
                setIdValidation({ message: '이미 사용 중인 ID 입니다.', status: 'error' });
                setIsIdAvailable(false);
            }
        } catch (error) {
            console.error("ID 중복 확인 실패:", error);
            setIdValidation({ message: '중복 확인 중 오류가 발생했습니다.', status: 'error' });
            setIsIdAvailable(false);
        }
    }

    /*const uploadImage = async (file: File) : Promise<string | null> => {
        try {
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
            const { data, error } = await supabase.storage.from('버킷 이름').upload(fileName, file);

            if (error) {
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage.from('버킷 이름').getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('이미지 업로드 실패: ', error);
            return null;
        }
    }*/

    //회원가입 데이터 전송
    const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 폼 action은 페이지를 리로드 하는데, 그러면 state값 다 날아감 그래서 preventDefault()
        
        let profileImageUrl: string | null = null;
        if (imageFile) {
            const uploadedUrl = await uploadImage(imageFile);
            if (!uploadedUrl) {
                console.log('불러올 이미지가 없다.');
                return;
            }
            profileImageUrl = uploadedUrl;
        }

        const Data = { userName: nickname, userId: id, search: searchAvailable, kengColor: userColor, profileImage: profileImageUrl };
        try {
            const response = await api.patch('/users/signup', Data);
            //const { accessToken } = response.data;
            //setToken(accessToken);
            navigate('/home');
        } catch (error) {
            console.log('회원가입 실패', error);
        }
    };


    return (
        <ScreenWrapper>

            {showColorPicker && (
                <PickerWrapper onClick={() => setShowColorPicker(false)}>
                    <div onClick={(e) => e.stopPropagation()}> {/* 이벤트 버블링 방지 */}
                        <SwatchesPicker color={userColor}
                            onChange={(color) => {
                                setUserColor(color.hex)
                                setShowColorPicker(false);
                                }
                            }
                        />
                    </div>
                </PickerWrapper>
            )}

            <ProfileImageSection>
                <ProfileImage src={previewUrl || profile_image} alt="ProfileImage"></ProfileImage>
                <ImageFileInput type="file" accept="image/jpeg image/png" ref={imageFileRef} onChange={handleImageChange}></ImageFileInput>
                <CameraButton type="button" onClick={triggerFileInput}>
                    <CameraIcon src={camera_icon} alt="프로필 사진 변경"></CameraIcon>
                </CameraButton>
            </ProfileImageSection>

            <Form onSubmit={handleSubmit}>
                <InputWrapper>
                    <Input id="nickname" type="text" value={nickname} onChange={handleNicknameChange} placeholder="닉네임"/>
                    <ValidationMessage isVisible={!!nicknameValidation} status={nicknameValidation?.status || 'error'}>
                        {nicknameValidation?.message || ''}
                    </ValidationMessage>
                </InputWrapper>

                <InputWrapper>
                    <IdInputWrapper>
                        <Input id="id" type="text" value={id} placeholder="ID"onChange={handleIdChange}/>
                        <DuplicateCheckButton type="button" onClick={handleCheckId}>
                            중복 확인
                        </DuplicateCheckButton>
                    </IdInputWrapper>
                    <ValidationMessage isVisible={!!idValidation} status={idValidation?.status || 'error'}>
                        {idValidation?.message || ''}
                    </ValidationMessage>
                </InputWrapper>

                <OptionWrapper>
                    <span>친구에게 표시될 해시태그 색상</span>
                    <ColorSwatch color={userColor} onClick={() => setShowColorPicker(true)} />
                </OptionWrapper>

                <OptionWrapper>
                    <label htmlFor="search-toggle">친구 추가 시 ID 검색 가능 여부</label>
                    <ToggleSwitch htmlFor="search-toggle">
                        <input type="checkbox" id="search-toggle" checked={searchAvailable} onChange={() => setSearchAvailable(!searchAvailable)}/>
                        <ToggleSlider />
                    </ToggleSwitch>
                </OptionWrapper>

                <SubmitButton type="submit" disabled={!isFormValid}>회원 가입</SubmitButton>
            </Form>

        </ScreenWrapper>
        );
}

export default SignUp;