import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import styled from "styled-components";
import media from "../../libs/styles/media";
import { LanguageType } from "../../types/Common";

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
`;

const LogoLink = styled(Link)`
	color: inherit;
	.header-logo {
		margin-right: 1rem;
		width: 3rem;
		height: 3rem;
		display: block;
		${media.custom(1056)} {
			width: 2.5rem;
			height: 2.5rem;
			margin-right: 0.75rem;
		}
	}
`;

interface Props {
	lang: LanguageType;
}

type QueryType = {
	file: {
		childImageSharp: { gatsbyImageData: IGatsbyImageData };
	};
};

export default function HeaderLogo({ lang }: Props) {
	const data = useStaticQuery<QueryType>(graphql`
		{
			file(relativePath: { eq: "logo.png" }) {
				childImageSharp {
					gatsbyImageData(width: 48, quality: 100)
				}
			}
		}
	`);

	if (!data.file) return null;

	return (
		<Container>
			<LogoLink to={lang === "ko" ? "/" : "/en"}>
				<GatsbyImage
					className="header-logo"
					image={data.file.childImageSharp.gatsbyImageData}
					alt="logo"
				/>
			</LogoLink>
		</Container>
	);
}
