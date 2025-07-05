import styled from '@emotion/styled';
import Button from '../../components/Button';

// wrapper를 그냥 공통 컴포넌트로 해서 화면 양 옆 빈 곳 동일하게 하면 좋을듯?
export const SignUpWrapper = styled.div`
    width: 100%;
    height: 100%;
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Title = styled.h3`
    font-size: 30px;
    margin-top: 45px;
    margin-bottom: 40px;
`;

export const ProfileImageSection = styled.div`
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 40px;
`;

export const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
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

export const SubmitButton = styled(Button)`
    margin-top: 20px;
`