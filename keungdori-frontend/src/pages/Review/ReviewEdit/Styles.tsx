import styled from '@emotion/styled';

export const PageContainer = styled.div`
  padding: 30px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const VectorIcon = styled.img`
`;

export const PlaceName = styled.h2`
  padding-top: 86px;
  text-align: center;
`;

export const TopSection = styled.section`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

export const RatingAndTags = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ImageUploader = styled.label`
  width: 120px;
  height: 120px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #f9f9f9;
  position: relative;
  overflow: hidden;

  &::after {
    content: '+';
    font-size: 48px;
    color: #e0e0e0;
    position: absolute;
    z-index: 0;
  }
`;

export const HiddenImageInput = styled.input`
  display: none;
`;

export const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 1;
`;

export const TagSection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  min-height: 40px;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const TagInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #FF769F;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  width: 150px; // 적절한 너비로 조절
`;

export const TagPlaceholder = styled.span`
  color: #a0a0a0;
  font-size: 14px;
`;

export const MemoTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #FF769F;
  }
`;

