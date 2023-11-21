import React from "react";
import Styled from "styled-components";
import palette from "../../libs/styles/palette";
import ProfileIcons from "../common/ProfileIcons";

const FooterWrapper = Styled.div`
    display: flex;
    border-top: 1px solid ${palette.gray[5]};
    margin-top: 5rem;
    width: 100%;
    height: 8rem;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    span {
        font-size: 1.5rem;
    }

    .icon-wrapper {
        width: 9rem;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        margin-top: 1rem;
        svg {
            width: 30%;
            height: 1.5rem;
            cursor: pointer;
        }
    }
`;

const TEXT = "millo's tech blog";

export default function Footer() {
	return (
		<FooterWrapper>
			<span>{TEXT}</span>
			<ProfileIcons className="icon-wrapper" />
		</FooterWrapper>
	);
}
