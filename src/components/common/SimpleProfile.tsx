import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import styled, { css } from "styled-components";
import { mediaQuery } from "../../libs/styles/media";
import palette from "../../libs/styles/palette";
import { LanguageType } from "../../types/Common";
import CategoryList from "./CategoryList";
import ProfileIcons from "./ProfileIcons";

const Container = styled.div<{ type: "header" | "body" }>`
	.profile-img {
		border: 3px solid ${palette.gray[0]};
	}
	${(props) =>
		props.type === "header"
			? css`
					display: none;
					flex-direction: row;
					align-items: center;
					margin-top: 1rem;
					font-size: 1.5rem;

					${mediaQuery(1056)} {
						display: flex;
					}

					${mediaQuery(767)} {
					}

					.profile-img {
						width: 6rem;
						height: 6rem;
						border-radius: 4rem;
						margin-right: 1rem;

						${mediaQuery(1056)} {
							display: flex;
						}
					}

					.info-wrapper {
						display: flex;
						width: 6rem;
						height: 3rem;
						flex-direction: column;
						justify-content: center;

						.icon-wrapper {
							display: flex;
							justify-content: space-between;
							flex-direction: row;
							margin-top: 0.3rem;
						}
					}

					svg {
						cursor: pointer;
						width: 30%;
					}
			  `
			: css`
					max-width: 20rem;
					margin-right: 2rem;
					display: flex;
					flex-direction: column;
					font-size: 2rem;
					width: calc(20%);
					align-items: center;

					${mediaQuery(1440)} {
					}
					${mediaQuery(1056)} {
						display: none;
					}

					.profile-img {
						width: 100%;
						border-radius: 10rem;
						margin-bottom: 1.5rem;
					}

					.info-wrapper {
						display: flex;
						width: 8rem;
						height: 3rem;
						flex-direction: column;
						justify-content: center;
						font-weight: lighter;
						text-align: center;

						.icon-wrapper {
							display: flex;
							justify-content: space-between;
							flex-direction: row;
							margin-top: 0.3rem;
							svg {
								width: 30%;
								cursor: pointer;
							}
						}
					}
			  `}
`;

interface Props {
	type: "header" | "body";
	categoryVisible: boolean;
	lang: LanguageType;
	style?: React.CSSProperties;
}

type QueryType = {
	file: {
		childImageSharp: { gatsbyImageData: IGatsbyImageData };
	};
};

export default function SimpleProfile({ type, categoryVisible, lang, style }: Props) {
	const data = useStaticQuery<QueryType>(graphql`
		{
			file(relativePath: { eq: "profile.jpeg" }) {
				childImageSharp {
					gatsbyImageData(width: 320, quality: 100)
				}
			}
		}
	`);

	return (
		<Container type={type} style={style}>
			{data.file && (
				<GatsbyImage
					className="profile-img"
					image={data.file.childImageSharp.gatsbyImageData}
					alt="profile-img"
				/>
			)}
			<div className="info-wrapper">
				<span>millo</span>
				<ProfileIcons className="icon-wrapper" />
			</div>
			<CategoryList visible={categoryVisible} lang={lang} />
		</Container>
	);
}
