import React, { MouseEventHandler } from "react";
import { MdArrowDropDown } from "react-icons/md";
import styled from "styled-components";
import palette from "../../libs/styles/palette";

const Container = styled.div`
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

interface Props {
	language: string;
	onClick: MouseEventHandler<HTMLDivElement>;
}

export default function HeaderUserImage({ language, onClick }: Props) {
	return (
		<Container onClick={onClick}>
			<span>{language}</span>
			<MdArrowDropDown />
		</Container>
	);
}
