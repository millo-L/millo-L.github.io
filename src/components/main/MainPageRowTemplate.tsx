import React, { memo } from "react";
import Styled from "styled-components";

const Wrapper = Styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    
`;

interface MainPageRowTemplateProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const MainPageRowTemplate = ({ children, style }: MainPageRowTemplateProps) => {
    return <Wrapper style={style}>{children}</Wrapper>;
};

export default memo(MainPageRowTemplate);
