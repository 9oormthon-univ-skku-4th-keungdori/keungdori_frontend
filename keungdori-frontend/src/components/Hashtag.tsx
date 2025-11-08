import React from 'react';
import styled from '@emotion/styled';

interface HashtagProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  
  backgroundColor?: string;
  fontColor?: string;
  onDelete?: (text: string) => void; 
}

const StyledHashtag = styled.div<{ 
  backgroundColor?: string; 
  fontColor?: string; 
  isDeletable: boolean; 
}>`
  display: inline-flex;
  align-items: center;
  /* 삭제 버튼이 있을 경우 오른쪽 패딩을 줄여 균형 맞춤 */
  padding: 5px ${props => props.isDeletable ? '10px' : '15px'} 5px 15px;
  border-radius: 20px;
  font-size: 16px;
  margin: 4px;
  color: ${({ fontColor }) => fontColor || '#FFFFFF'};
  background-color: ${({ backgroundColor }) => backgroundColor || '#FF769F'};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: inherit; /* 부모의 fontColor를 그대로 사용 */
  margin-left: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  padding: 0;
  line-height: 1;
`;

const Hashtag = ({ 
  text, 
  backgroundColor, 
  fontColor, 
  onDelete, 
  ...rest 
}: HashtagProps) => {

  const isDeletable = !!onDelete;

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    // onDelete가 존재할 때만 호출되도록 보장
    if (onDelete) {
      onDelete(text);
    }
  };

  return (
    <StyledHashtag 
      backgroundColor={backgroundColor} 
      fontColor={fontColor}
      isDeletable={isDeletable}
      {...rest}
    >
      #{text}

      {isDeletable && (
        <DeleteButton onClick={handleDeleteClick}>&times;</DeleteButton>
      )}
    </StyledHashtag>
  );
};

export default Hashtag;