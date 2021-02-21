import React from 'react';
import Styled from 'styled-components';

const PostTemplateWrapper = Styled.div`
    background-color: white;
`;

interface PostTemplateProps {
    children: React.ReactNode;
}


const PostTemplate = ({ children }: PostTemplateProps) => {
    return (
        <PostTemplateWrapper>
            {children}
        </PostTemplateWrapper>
    );
}

export default PostTemplate;