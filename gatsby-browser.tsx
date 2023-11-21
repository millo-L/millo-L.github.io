/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo } from "react";
import { GatsbyBrowser } from "gatsby";
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
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const HOME_TAB_PAGES = ["/", "/series/", "/about/", "/en/", "/en/series/", "/en/about/"];

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = ({ element }) => {
	const lang = useMemo(
		() => (element.props.path.includes("/en") ? "en" : "ko"),
		[element.props.path],
	);
	const koTo = useMemo(
		() => (lang === "ko" ? "#" : element.props.path.split("/en")[1]),
		[element.props.path, lang],
	);
	const enTo = useMemo(
		() => (lang === "en" ? "#" : `/en${element.props.path}`),
		[element.props.path, lang],
	);
	const hasHomeTab = useMemo(
		() => HOME_TAB_PAGES.includes(element.props.path),
		[element.props.path],
	);
	const homeTabPage = useMemo(
		() =>
			element.props.path.includes("/about")
				? 2
				: element.props.path.includes("/series")
				  ? 1
				  : 0,
		[element.props.path],
	);

	useEffect(() => {
		console.log(element);
	}, [element]);

	return (
		<MainResponsive>
			<GlobalStyle />
			{hasHomeTab ? (
				<>
					<Header lang={lang} ko_to={koTo} en_to={enTo} />
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
				</>
			) : (
				element
			)}
		</MainResponsive>
	);
};
