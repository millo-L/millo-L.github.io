import React from "react";
import { MdArrowDropDown } from "react-icons/md";
import Styled from "styled-components";
import palette from "../../lib/styles/palette";

const HeaderUserImageWrapper = Styled.div`
    cursor: pointer;
    svg {
        font-size: 1.5rem;
        margin-left: 0.25rem;
        color: ${palette.gray[6]};
        transition: 0.125s all ease-in;
        margin-right: -0.4375rem;
    }
    display: flex;
    align-items: center;
    &:hover {
        svg {
            color: ${palette.gray[9]};
        }
    }
`;

export interface HeaderUserImageProps {
    language: string;
    onClick: (e: React.ReactNode) => void;
}

const HeaderUserImage = ({ language, onClick }: HeaderUserImageProps) => {
    return (
        <HeaderUserImageWrapper onClick={onClick}>
            <span>{language}</span>
            <MdArrowDropDown />
        </HeaderUserImageWrapper>
    );
};

export default HeaderUserImage;
