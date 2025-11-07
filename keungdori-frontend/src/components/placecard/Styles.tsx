import styled from '@emotion/styled';

export const CardContainer = styled.li`
  display: flex;
  padding: 16px;
  border: 1px solid #F0F0F0;
  border-radius: 16px;
  margin-bottom: 16px;
  background-color: #D8F3E4;
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
  min-width: 0;
`;

export const PlaceName = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
`;

export const TagContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;    
  overflow-x: auto;

  // 자식 요소(RdOnlyHashtag)들에게 적용될 스타일
  & > * {
    flex-shrink: 0;      // 공간이 부족해도 절대 너비가 줄어들지 않도록 설정
    white-space: nowrap; // 텍스트가 길어도 내부에서 절대 줄바꿈 되지 않도록 설정
  }
`;