import React, { useMemo } from "react";
import { HeadProps, PageProps, graphql } from "gatsby";
import styled, { createGlobalStyle } from "styled-components";
import { LanguageType, SeriesPostType } from "../../types/Common";
import SEO from "../SEO";
import Footer from "../base/Footer";
import Header from "../base/Header";
import SimpleProfile from "../common/SimpleProfile";
import MainResponsive from "../main/MainResponsive";
import PostToC from "./PostToC";
import PostViewer from "./PostViewer";
import Utterances from "./Utterances";

const GlobalStyle = createGlobalStyle`
	body {
		background-color: white;
	}
`;

const Container = styled.div`
	width: 100%;
	display: flex;
	padding-top: 62px;
`;

type QueryType = {
	markdownRemark: {
		html: string;
		tableOfContents: string;
		frontmatter: {
			author: string;
			category: string;
			description: string;
			image: {
				childImageSharp: {
					fixed: {
						src: string;
					};
				};
			};
			lang: LanguageType;
			released_at: string;
			series: string;
			tags: string[];
			title: string;
			translation: string | null;
			updated_at: string | null;
		};
		fields: {
			slug: string;
		};
	} | null;
	allMarkdownRemark: {
		nodes: [
			{
				frontmatter: {
					lang: LanguageType;
					title: string;
				};
				fields: {
					slug: string;
				};
			},
		];
	} | null;
};

export default function PostPage({ data }: PageProps<QueryType>) {
	const { markdownRemark, allMarkdownRemark } = data;
	const seriesPosts: SeriesPostType[] = useMemo(
		() =>
			allMarkdownRemark && markdownRemark
				? allMarkdownRemark.nodes
						.map((node) => ({
							title: node.frontmatter.title,
							lang: node.frontmatter.lang,
							path: node.fields.slug,
						}))
						.filter((post) => post.lang === markdownRemark.frontmatter.lang)
				: [],
		[allMarkdownRemark, markdownRemark],
	);

	if (!(markdownRemark && allMarkdownRemark)) return null;

	return (
		<MainResponsive>
			<GlobalStyle />
			<Header
				lang={markdownRemark.frontmatter.lang}
				ko_to={
					markdownRemark.frontmatter.lang === "ko"
						? "#"
						: markdownRemark.frontmatter.translation || "#"
				}
				en_to={
					markdownRemark.frontmatter.lang === "en"
						? "#"
						: markdownRemark.frontmatter.translation || "#"
				}
			/>
			<Container>
				<SimpleProfile type="body" categoryVisible lang={markdownRemark.frontmatter.lang} />
				<PostViewer
					post={{ ...markdownRemark.frontmatter, html: markdownRemark.html }}
					series={markdownRemark.frontmatter.series}
					seriesPosts={seriesPosts}
					lang={markdownRemark.frontmatter.lang}
				/>
				<PostToC tableOfContents={markdownRemark.tableOfContents} />
			</Container>
			<Footer />
			<Utterances />
		</MainResponsive>
	);
}

export function Head({ data }: HeadProps<QueryType>) {
	if (!data.markdownRemark) return null;
	const { title, description, image, released_at, updated_at } = data.markdownRemark.frontmatter;
	return (
		<SEO
			title={title}
			description={description}
			image={image.childImageSharp.fixed.src}
			pathname={data.markdownRemark.fields.slug}
			created_at={released_at}
			updated_at={updated_at || undefined}
		/>
	);
}

export const pageQuery = graphql`
	query ($slug: String!, $series: String!) {
		markdownRemark(fields: { slug: { eq: $slug } }, frontmatter: { series: { eq: $series } }) {
			html
			tableOfContents(absolute: false, maxDepth: 3, heading: null)
			frontmatter {
				author
				category
				description
				image {
					childImageSharp {
						fixed {
							src
						}
					}
				}
				lang
				released_at(formatString: "YYYY-MM-DD HH:mm")
				series
				tags
				title
				translation
				updated_at(formatString: "YYYY-MM-DD HH:mm")
			}
			fields {
				slug
			}
		}
		allMarkdownRemark(
			filter: { frontmatter: { is_private: { eq: false }, series: { eq: $series } } }
			sort: { frontmatter: { released_at: ASC } }
		) {
			nodes {
				frontmatter {
					lang
					title
				}
				fields {
					slug
				}
			}
		}
	}
`;
