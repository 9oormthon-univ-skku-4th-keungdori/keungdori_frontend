import React from 'react';
import styled from '@emotion/styled';

interface RdOnlyHashtagProps extends React.HTMLAttributes<HTMLSpanElement> {
    hashtag: string;
    backgroundColor: string;
    fontColor: string;
}

const StyledHashtag = styled.span<Pick<RdOnlyHashtagProps, 'backgroundColor' | 'fontColor'>>`
    display: inline-block;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 16px;
    color: ${(props) => props.fontColor || '#FFFFFF'};
    background-color: ${(props) => props.backgroundColor || '#FF769F'};
`;

const RdOnlyHashtag = ({ hashtag, backgroundColor, fontColor, ...rest }: RdOnlyHashtagProps) => {
    return (
    <StyledHashtag backgroundColor={backgroundColor} fontColor={fontColor} {...rest}> 
        {hashtag}
    </StyledHashtag>
    );
};

export default RdOnlyHashtag;