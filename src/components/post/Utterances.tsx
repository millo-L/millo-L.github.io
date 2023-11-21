import React, { createRef, useLayoutEffect } from "react";
import Styled from "styled-components";
import { mediaQuery } from "../../libs/styles/media";

const src = "https://utteranc.es/client.js";

const Container = Styled.div`
    width: 60%;
    margin-left: auto;
    margin-right: auto;

    
    ${mediaQuery(1056)} {
        width: 100%;
    }
`;

export default function Utterances() {
	const containerRef = createRef<HTMLDivElement>();

	useLayoutEffect(() => {
		const utterances = document.createElement("script");

		const attributes = {
			src,
			repo: "millo-L/millo-L.github.io",
			"issue-term": "pathname",
			label: "comment",
			theme: "github-light",
			crossOrigin: "anonymous",
			async: "true",
		};

		Object.entries(attributes).forEach(([key, value]) => {
			utterances.setAttribute(key, value);
		});

		containerRef.current?.appendChild(utterances);
	}, [containerRef]);

	return <Container ref={containerRef} />;
}
