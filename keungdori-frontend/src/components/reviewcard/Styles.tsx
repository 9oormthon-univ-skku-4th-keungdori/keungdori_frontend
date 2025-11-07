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
`;
