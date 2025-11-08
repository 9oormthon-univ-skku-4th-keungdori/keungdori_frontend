import styled from '@emotion/styled';

export const CardContainer = styled.li`
  display: flex;
  padding: 16px;
  border: 1px solid #F0F0F0;
  border-radius: 16px;
  margin-bottom: 16px;
  background-color: #D8F3E4;
  cursor: pointer; /* 클릭 가능하다는 것을 알려주기 위해 추가 */
`;

export const ReviewImage = styled.img`
  width: 80px;
  height: 80px;
  background-color: #E0E0E0;
  border-radius: 8px;
  margin-right: 16px;
  object-fit: cover;
`;

export const ReviewContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const ReviewDate = styled.p`
  font-size: 16px;
  color: #888888;
  margin: 0 0 4px;
`;

export const StarRating = styled.div`
  margin-bottom: 8px;
`;

export const ReviewMemo = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 12px;
`;

export const HashtagContainer = styled.div`
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
