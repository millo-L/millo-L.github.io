import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import palette from '../../lib/styles/palette';

const BackgroundStyle = createGlobalStyle`
    body {
        background: ${palette.gray[0]};
    }
`;

export type MainTemplateProps = {
    children: React.ReactNode;
};

function MainTemplate({ children }: MainTemplateProps) {
    return (
        <>
            <BackgroundStyle />
            <Wrapper>{children}</Wrapper>
        </>
    );
}

const Wrapper = styled.div``;

export default MainTemplate;
