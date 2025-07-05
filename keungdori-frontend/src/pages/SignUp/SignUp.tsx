import React, { useRef, useState } from "react";
import ScreenWrapper from "../../layouts/ScreenWrapper";
import { ProfileImageSection, ProfileImage, ImageFileInput, Form, InputWrapper, Label, Input, Title, SubmitButton, CameraButton, CameraIcon } from "./Styles";
import profile_image from "../../assets/profile_image.png";
import camera_icon from "../../assets/camera_icon.png"

const SignUp: React.FC = () => {

    const [profileImg, setProfileImg] = useState<string>(profile_image);
    const [nickname, setNickname] = useState('');
    const [id, setId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    // 숨겨진 input에 접근하기 위한 ref임
    const imageFileRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const fileTypes = ["image/jpeg", "image/png"];
            if (!fileTypes.includes(file.type)) {
                console.log("이미지 파일이 아닙니다!");
                return; //해당하는 파일 타입이 아닐 때 어떻게 할 것인지 개발해야 함!
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //서버로 state 값 보내야 함!
    };


    return (
        <ScreenWrapper>

            <Title>회원가입</Title>

            <ProfileImageSection>
                <ProfileImage src={profileImg} alt="ProfileImage"></ProfileImage>
                <ImageFileInput type="file" accept="image/jpeg image/png" ref={imageFileRef} onChange={handleImageChange}></ImageFileInput>
                <CameraButton type="button" onClick={handleCameraButton}>
                    <CameraIcon src={camera_icon} alt="프로필 사진 변경"></CameraIcon>
                </CameraButton>
            </ProfileImageSection>

            <Form onSubmit={handleSubmit}>
                <InputWrapper>
                    <Label htmlFor="nickname">닉네임</Label>
                    <Input id="nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}></Input>
                </InputWrapper>

                <InputWrapper>
                    <Label htmlFor="id">아이디</Label>
                    <Input id="id" type="text" value={id} onChange={(e) => setId(e.target.value)}></Input>
                </InputWrapper>

                <SubmitButton type="submit">회원가입</SubmitButton>
            </Form>

        </ScreenWrapper>
        );
}

export default SignUp;