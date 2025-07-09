import React, { useRef, useState } from "react";
import { ProfileImageSection, ProfileImage, ImageFileInput, Form, InputWrapper, Input, SubmitButton, CameraButton, CameraIcon, IdInputWrapper, DuplicateCheckButton, ValidationMessage, OptionWrapper, ToggleSwitch, ToggleSlider, PickerWrapper, ColorSwatch } from "./Styles";
import profile_image from "../../assets/profile_image.png";
import camera_icon from "../../assets/camera_icon.png"
import ScreenWrapper from "../../layouts/ScreenWrapper";
import { SwatchesPicker } from "react-color";

const SignUp: React.FC = () => {

    const [profileImg, setProfileImg] = useState<string>(profile_image);
    const [nickname, setNickname] = useState('');
    const [id, setId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
    const [searchAvailable, setSearchAvailable] = useState<boolean>(true);
    const [userColor, setUserColor] = useState<string>('#FF3662');
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false); // 컬러 피커 표시 여부

    // 숨겨진 input에 접근하기 위한 ref임
    const imageFileRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const fileTypes = ["image/jpeg", "image/png"];
            if (!fileTypes.includes(file.type)) {
                console.log("이미지 파일이 아닙니다!");
                return; //1. 해당하는 파일 타입이 아닐 때 어떻게 할 것인지 개발해야 함!!
            }

            setImageFile(file);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setProfileImg(reader.result as string);
            }
        }
    }

    // 버튼을 누르면 input이 클릭되어 실행됨
    const handleCameraButton = () => {
        imageFileRef.current?.click();
    }

    const handleCheckId = () => {
        //2. 중복여부 로직 작성해야함!! 백엔드와 연동
        if (!id) {
            setIsIdAvailable(null);
            return;
        }
        
        if (id.toLowerCase() === 'duplicate') {
            setIsIdAvailable(false);
        } else {
            setIsIdAvailable(true);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //3. 백엔드로 입력한 내용 보내야 함!!
        // profileImg, nickname, imageFile, searchAvailable, userColor를 보내야 함
    };


    return (
        <ScreenWrapper>

             {/* 컬러 피커 팝업 (showColorPicker가 true일 때만 보임) */}
            {showColorPicker && (
                <PickerWrapper onClick={() => setShowColorPicker(false)}>
                    <div onClick={(e) => e.stopPropagation()}> {/* 이벤트 버블링 방지 */}
                        <SwatchesPicker
                            color={userColor}
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
                <ProfileImage src={profileImg} alt="ProfileImage"></ProfileImage>
                <ImageFileInput type="file" accept="image/jpeg image/png" ref={imageFileRef} onChange={handleImageChange}></ImageFileInput>
                <CameraButton type="button" onClick={handleCameraButton}>
                    <CameraIcon src={camera_icon} alt="프로필 사진 변경"></CameraIcon>
                </CameraButton>
            </ProfileImageSection>

            <Form onSubmit={handleSubmit}>
                <InputWrapper>
                    <Input 
                        id="nickname" 
                        type="text" 
                        value={nickname} 
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임"
                    />
                </InputWrapper>

                <InputWrapper>
                    <IdInputWrapper>
                        <Input id="id" type="text" value={id} placeholder="ID"
                            onChange={(e) => {
                                setId(e.target.value);
                                setIsIdAvailable(null);
                            }}
                        />
                        <DuplicateCheckButton type="button" onClick={handleCheckId}>
                            중복 확인
                        </DuplicateCheckButton>
                    </IdInputWrapper>
                    
                    <ValidationMessage
                      isVisible={isIdAvailable !== null}
                      status={isIdAvailable ? 'success' : 'error'}
                    >
                      {isIdAvailable ? '✓ 사용 가능한 ID 입니다!' : '✕ 이미 사용 중인 ID 입니다.'}
                    </ValidationMessage>
                </InputWrapper>

                <OptionWrapper>
                    <span>친구에게 표시될 해시태그 색상</span>
                    <ColorSwatch color={userColor} onClick={() => setShowColorPicker(true)} />
                </OptionWrapper>

                <OptionWrapper>
                    <label htmlFor="search-toggle">친구 추가 시 ID 검색 가능 여부</label>
                    <ToggleSwitch htmlFor="search-toggle">
                        <input
                            type="checkbox"
                            id="search-toggle"
                            checked={searchAvailable}
                            onChange={() => setSearchAvailable(!searchAvailable)}
                        />
                        <ToggleSlider />
                    </ToggleSwitch>
                </OptionWrapper>

                <SubmitButton type="submit">회원 가입</SubmitButton>
            </Form>

        </ScreenWrapper>
        );
}

export default SignUp;