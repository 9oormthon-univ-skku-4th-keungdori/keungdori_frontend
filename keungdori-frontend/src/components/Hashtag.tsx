import React from 'react';
import styled from '@emotion/styled';

interface HashtagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  bgColor?: string;
}

const StyledHashtag = styled.span<Pick<HashtagProps, 'bgColor'>>`
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 16px;
  color: #FFFFFF;
  background-color: ${(props) => props.bgColor || '#FF769F'};
`;

const Hashtag = ({ children, bgColor, ...rest }: HashtagProps) => {
  return (
    <StyledHashtag bgColor={bgColor} {...rest}>
      {children}
    </StyledHashtag>
  );
};

export default Hashtag;