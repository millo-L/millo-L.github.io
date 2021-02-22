import React from 'react';
import Styled, { createGlobalStyle } from 'styled-components';
import '../css/typography.css';

const BackgroundStyle = createGlobalStyle`
    body {
        background-color: white;
        font-family: "ELAND", serif;
    }
`;

const PostTemplateWrapper = Styled.div`
    font-family: "ELAND", serif;
`;

interface PostTemplateProps {
    children: React.ReactNode;
}


const PostTemplate = ({ children }: PostTemplateProps) => {
    return (
        <>
            <BackgroundStyle />
            <PostTemplateWrapper>
                {children}
            </PostTemplateWrapper>
        </>
    );
}

export default PostTemplate;