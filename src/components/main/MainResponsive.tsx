import React from "react";
import styled from "styled-components";
import { mediaQuery } from "../../libs/styles/media";

const Container = styled.div`
	width: 1745px;
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

interface Props {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export default function MainResponsive({ className, children, style }: Props) {
	return (
		<Container className={className} style={style}>
			{children}
		</Container>
	);
}
