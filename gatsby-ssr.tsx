import React from "react";
import { GatsbySSR } from "gatsby";
import styled, { createGlobalStyle } from "styled-components";
import FloatingHeader from "./src/components/base/FloatingHeader";
import Header from "./src/components/base/Header";
import SimpleProfile from "./src/components/common/SimpleProfile";
import HomeTab from "./src/components/home/HomeTab";
import MainResponsive from "./src/components/main/MainResponsive";
import palette from "./src/libs/styles/palette";
import "prismjs/themes/prism-vsc-dark-plus.css";

const GlobalStyle = createGlobalStyle`
	body {
		font-family: "Noto Sans KR";
		padding: 0;
		margin: 0;
        background: ${palette.gray[0]};

		div {
			box-sizing: border-box;
		}
	}

	a {
		text-decoration: none;
		color: black;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6, 
	p {
		margin: 0;
	}
`;

const Container = styled.div`
	width: 100%;
	display: flex;
`;

const BodyContainer = styled.div`
	width: 100%;
`;

const MAIN_PATHS = ["/", "/en/", "/series", "/en/series", "/about", "/en/about"];

export const wrapPageElement: GatsbySSR["wrapPageElement"] = ({ element }) => {
	const { path, pageContext } = element.props;
	const isMain = MAIN_PATHS.includes(path);
	const lang = isMain ? (path.includes("/en") ? "en" : "ko") : pageContext.lang || "ko";
	const translation = isMain
		? lang === "ko"
			? `/en${path}`
			: path.replace("/en/", "/")
		: pageContext.translation || pageContext.translation_series || "#";
	const homeTabPage = path.includes("/about") ? 2 : path.includes("/series") ? 1 : 0;

	return (
		<MainResponsive>
			<GlobalStyle />
			<Header
				lang={lang}
				ko_to={lang === "ko" ? "#" : translation}
				en_to={lang === "en" ? "#" : translation}
			/>
			<FloatingHeader page={homeTabPage} lang={lang} />
			<HomeTab
				userVisible={false}
				page={homeTabPage}
				lang={lang}
				style={{ marginLeft: "0.25rem" }}
			/>
			<Container>
				<SimpleProfile type="body" categoryVisible lang={lang} />
				<BodyContainer>{element}</BodyContainer>
			</Container>
		</MainResponsive>
	);
};
