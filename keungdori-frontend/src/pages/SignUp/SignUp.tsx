import React, { useState } from "react";
import { SignUpWrapper, ProfileImageSection, ProfileImage, Form, InputWrapper, Label, Input, Title, SubmitButton } from "./Styles";
import profile_image from "../../assets/profile_image.png";

const SignUp: React.FC = () => {

    const [profileImg, setProfileImg] = useState<string>(profile_image);
    const [nickname, setNickname] = useState('');
    const [id, setId] = useState('');

    const handleSubmit = () => {

    };


    return (
        <SignUpWrapper>
            <Title>회원가입</Title>

            <ProfileImageSection>
                <ProfileImage src={profileImg} alt="ProfileImage"></ProfileImage>
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


        </SignUpWrapper>
        );
}

export default SignUp;