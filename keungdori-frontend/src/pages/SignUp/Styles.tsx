import styled from '@emotion/styled';
import Button from '../../components/Button';

export const Title = styled.h3`
    font-size: 30px;
    margin-top: 45px;
    margin-bottom: 40px;
`;

export const ProfileImageSection = styled.div`
    position: relative;
    width: 150px;
    height: 150px;
    margin-bottom: 40px;
`;

export const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
`;

export const ImageFileInput = styled.input`
    display: none;
`;

export const CameraButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
`;

export const CameraIcon = styled.img`
    width: 100%;
    height: 100%;
`;

export const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const InputWrapper = styled.div`
    display : flex;
    flex-direction: column;
`;

export const Label = styled.label`
    font-size: 18px;
    margin-bottom: 5px;
    padding-left: 5px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #DDDDDD;
    border-radius: 12px;
    font-size: 18px;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #FF3662;
  }
`;

// styled(공통컴포넌트)로 공통 컴포넌트에서 위치만 조절한 컴포넌트 생성
export const SubmitButton = styled(Button)`
    margin-top: 20px;
`