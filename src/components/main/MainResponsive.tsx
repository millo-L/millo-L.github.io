import React from "react";
import styled from "styled-components";
import { mediaQuery } from "../../lib/styles/media";

export type MainResponsiveProps = {
    className?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
};

function MainResponsive({ className, children, style }: MainResponsiveProps) {
    return (
        <Wrapper className={className} style={style}>
            {children}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 1728px;
    margin-left: auto;
    margin-right: auto;
    ${mediaQuery(1919)} {
        width: 1376px;
    }
    ${mediaQuery(1440)} {
        width: 1024px;
    }
    ${mediaQuery(1056)} {
        width: calc(100% - 2rem);
    }
`;

export default MainResponsive;
