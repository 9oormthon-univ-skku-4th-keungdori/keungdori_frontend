import styled from '@emotion/styled';
import Button from '../../components/Button';

export const ProfileImageSection = styled.div`
    position: relative;
    width: 150px;
    height: 150px;
    margin-top: 50px;
    margin-bottom: 50px;
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
    width: 100%;
    display : flex;
    flex-direction: column;
    position: relative;
    margin-bottom: 10px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 14px 16px;
    border: none;
    border-bottom: 2px solid #DDDDDD;
    font-size: 18px;
    box-sizing: border-box;

    &::placeholder {
        color: #BBBBBB;
    }

    &:focus {
        outline: none;
        border-color: #FF3662;
    }
`;

export const IdInputWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
`;

export const DuplicateCheckButton = styled(Button)`
    width: auto;
    padding: 8px 12px;
    font-size: 16px;
    flex-shrink: 0; /* 버튼 크기가 줄어들지 않도록 설정 */
`;

export const ValidationMessage = styled.p<{ isVisible: boolean; status: 'success' | 'error' }>`
    font-size: 16px;
    color: ${props => (props.status === 'success' ? '#2ECC71' : '#FF3662')};
    margin-top: 8px;
    padding-left: 5px;
    height: 24px;
    line-height: 24px;
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
`;

export const OptionWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 18px;
    color: #555555;
    padding: 12px 0;
`;

export const ColorSwatch = styled.div<{ color: string }>`
    width: 32px;
    height: 32px;
    background-color: ${(props) => props.color};
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid #DDDDDD;
`;

export const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
    
    & input {
        opacity: 0;
        width: 0;
        height: 0;
    }
`;

export const ToggleSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;

    &:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + & {
        background-color: #4CAF50;
    }

    input:checked + &::before {
        transform: translateX(22px);
    }
`;

export const PickerWrapper = styled.div`
  position: fixed; /* 화면 전체를 기준으로 위치 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소들 위에 보이도록 */
`;

// styled(공통컴포넌트)로 공통 컴포넌트에서 위치만 조절한 컴포넌트 생성
export const SubmitButton = styled(Button)`
    margin-top: 10px;
`;