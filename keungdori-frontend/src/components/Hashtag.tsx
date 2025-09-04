import React from 'react';
import styled from '@emotion/styled';

// --- Props 인터페이스 수정 ---
interface HashtagProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string; // children 대신 명시적인 text prop 사용
  bgColor?: string;
  onDelete: (text: string) => void; // 삭제할 해시태그의 text를 전달
}

const StyledHashtag = styled.div<Pick<HashtagProps, 'bgColor'>>`
  /* 스타일은 이전과 동일 */
  display: inline-flex;
  align-items: center;
  padding: 5px 10px 5px 15px;
  border-radius: 20px;
  font-size: 16px;
  color: #ffffff;
  background-color: ${(props) => props.bgColor || '#FF769F'};
  margin: 4px;
`;

const DeleteButton = styled.button`
  /* 스타일은 이전과 동일 */
  background: none;
  border: none;
  color: white;
  margin-left: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
`;

// --- 컴포넌트 로직 수정 ---
const Hashtag = ({ text, bgColor, onDelete, ...rest }: HashtagProps) => {
  const handleDeleteClick = () => {
    onDelete(text); // 자신의 text를 부모의 삭제 함수로 전달
  };

  return (
    <StyledHashtag bgColor={bgColor} {...rest}>
      #{text} {/* prop으로 받은 text를 바로 사용 */}
      <DeleteButton onClick={handleDeleteClick}>&times;</DeleteButton>
    </StyledHashtag>
  );
};

export default Hashtag;