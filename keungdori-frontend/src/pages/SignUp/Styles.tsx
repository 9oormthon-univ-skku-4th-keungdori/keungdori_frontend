import styled from '@emotion/styled';

export const SignUpWrapper = styled.div`
    width: 100%;
    height: 100%;
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Title = styled.h3`
    font-size: 28px;
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
    font-size: 14px;
    font-weight: 500;
    maegin-bottom: 5px;
    padding-left: 5px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    font-size: 16px;
    box-sizing: border-box;

    &::placeholder {
        color: #bdbdbd;
    }

    &:focus {
        outline: none;
        border-color: #F75A83;
  }
`;