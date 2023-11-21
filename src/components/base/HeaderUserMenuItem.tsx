import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import palette from "../../libs/styles/palette";

const Container = styled.div`
	padding: 0.75rem 1rem;
	width: 100%;
	line-height: 1.5;
	font-weight: 500;
	text-align: center;
	cursor: pointer;
	&:hover {
		background: ${palette.gray[0]};
	}
`;

interface Props {
	to: string;
	children: React.ReactNode;
}

export default function HeaderUserMenuItem({ to, children }: Props) {
	return (
		<Link to={to} style={{ textDecoration: "none", color: palette.gray[9] }}>
			<Container>{children}</Container>
		</Link>
	);
}
