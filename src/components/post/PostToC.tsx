import React, { useEffect } from "react";
import styled from "styled-components";
import media from "../../libs/styles/media";
import palette from "../../libs/styles/palette";
import ScrollSpy from "./ScrollSpy";

const Container = styled.div`
	transition: 0.125s all ease-in;
	width: 20%;
	padding: 0.5rem;
	padding-right: 1rem;
	padding-left: 0;
	order: 1;
	top: 10rem;
	margin-left: 4rem;
	position: sticky;
	height: 40rem;
	overflow-y: auto;
	word-break: break-all;

	${media.custom(1919)} {
		margin-left: 2rem;
	}

	${media.custom(1440)} {
		display: none;
	}
	ul:first-child {
		padding-left: 1rem;
		border-left: 2px solid ${palette.indigo[4]};
	}
	ul {
		list-style: none;
		margin: 0;
		li {
			border: none;
			margin-bottom: 4px;
			p {
				margin: 0;
			}
		}
	}
	a {
		text-decoration: none;
		color: ${palette.gray[4]};
		font-size: 0.9rem;
		&:hover,
		&:focus {
			color: ${palette.indigo[4]};
		}
		&.active {
			color: ${palette.indigo[9]};
			font-size: 1rem;
		}
	}
	& + & {
		margin-top: 4px;
	}
`;

interface Props {
	tableOfContents: string;
}

export default function PostToC({ tableOfContents }: Props) {
	useEffect(() => {
		const post = document.querySelector("#content-container");
		if (!post) return;
		const headings = Array.from(post.querySelectorAll("h2, h3")).filter((h) => h.id);
		const toc = document.querySelector("#toc-container");

		// eslint-disable-next-line no-new
		new ScrollSpy(toc as HTMLElement, headings as HTMLElement[]);
	}, []);

	return <Container id="toc-container" dangerouslySetInnerHTML={{ __html: tableOfContents }} />;
}
