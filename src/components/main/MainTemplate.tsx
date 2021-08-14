import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import palette from "../../lib/styles/palette";
import "../css/typography.css";

const BackgroundStyle = createGlobalStyle`
    body {
        background: ${palette.gray[0]};
        font-family: "ELAND", serif;
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
