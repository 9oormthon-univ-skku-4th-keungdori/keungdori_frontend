import styled from '@emotion/styled';

export const ScreenWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 56px;
  display: flex;
  flex-direction: column;
`;

export const VectorIcon = styled.img`
`;

export const ContentWrapper = styled.div`
  flex: 1;
  overflow: auto;
  padding: 0 24px;
  padding-bottom: 100px;
`;

export const PlaceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 24px;
`;

export const PlaceName = styled.h2`
  font-size: 22px;
  font-weight: bold;
`;

export const MainHashtag = styled.span`
  background-color: #E0E7FF;
  color: #4F46E5;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
`;

export const ReviewListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ReviewCard = styled.li`
  display: flex;
  padding: 16px;
  border: 1px solid #F0F0F0;
  border-radius: 16px;
  margin-bottom: 16px;
  background-color: #FFC2C3;
`;

export const ReviewImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background-color: #E0E0E0;
  border-radius: 8px;
  margin-right: 16px;
`;

export const ReviewContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ReviewDate = styled.p`
  font-size: 14px;
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

export const Hashtag = styled.span`
  background-color: #FF769F;
  color: #FFFFFF;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
`;

export const NoReviewsMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  font-size: 18px;
  color: #888888;
`;

export const HeaderRight = styled.div`
    display: flex;
    gap: 16px;
    font-size: 16px;
    color: #424242;
    cursor: pointer;
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 24px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
`;