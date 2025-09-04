import styled from '@emotion/styled';

export const CardContainer = styled.li`
  display: flex;
  padding: 16px;
  border: 1px solid #F0F0F0;
  border-radius: 16px;
  margin-bottom: 16px;
  background-color: #FFC2C3;
  cursor: pointer;
`;

export const ImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background-color: #E0E0E0;
  border-radius: 8px;
  margin-right: 16px;
  
  // 이미지가 있는 경우를 위한 스타일 추가
  background-size: cover;
  background-position: center;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; // 컨텐츠를 세로 중앙에 배치
`;

export const PlaceName = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
`;

export const TagContainer = styled.div`
  display: flex;
  gap: 8px;
`;