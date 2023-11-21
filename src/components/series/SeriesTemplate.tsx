import React, { useMemo } from "react";
import { HeadProps, PageProps, graphql } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import { reshapePost } from "../../libs/list/reshape";
import { LanguageType } from "../../types/Common";
import SEO from "../SEO";
import Footer from "../base/Footer";
import Header from "../base/Header";
import MainResponsive from "../main/MainResponsive";
import SeriesPostList from "./SeriesPostList";

type QueryType = {
	allMarkdownRemark: {
		nodes: {
			frontmatter: {
				title: string;
				released_at: string;
				updated_at?: string;
				description: string;
				image: {
					childImageSharp: {
						gatsbyImageData: IGatsbyImageData;
						fixed: {
							src: string;
						};
					};
				};
				lang: LanguageType;
				translation_series: string;
				series: string;
				category: string;
			};
			fields: {
				slug: string;
			};
		}[];
	};
};

export default function SeriesTemplate({ data }: PageProps<QueryType>) {
	const { allMarkdownRemark } = data;
	const posts = useMemo(() => reshapePost(allMarkdownRemark), [allMarkdownRemark]);

	if (!allMarkdownRemark) return null;
	return (
		<MainResponsive>
			<Header lang={data.allMarkdownRemark.nodes[0].frontmatter.lang} />
			<SeriesPostList
				posts={posts}
				series={allMarkdownRemark.nodes[0].frontmatter.series}
				lang={allMarkdownRemark.nodes[0].frontmatter.lang}
			/>
			<Footer />
		</MainResponsive>
	);
}

export function Head({ data }: HeadProps<QueryType>) {
	if (!data.allMarkdownRemark) return null;
	const { series, image, released_at, updated_at } = data.allMarkdownRemark.nodes[0].frontmatter;
	return (
		<SEO
			title={series}
			description={series}
			image={image.childImageSharp.fixed.src}
			created_at={released_at}
			updated_at={updated_at || undefined}
			pathname={`/series/${series.replace(/ /gi, "-")}`}
		/>
	);
}

export const pageQuery = graphql`
	query ($series: String!) {
		allMarkdownRemark(
			filter: { frontmatter: { series: { eq: $series } } }
			sort: { frontmatter: { released_at: ASC } }
		) {
			nodes {
				frontmatter {
					title
					released_at
					updated_at
					description
					image {
						childImageSharp {
							gatsbyImageData(width: 1000, quality: 100)
							fixed {
								src
							}
						}
					}
					lang
					translation_series
					series
					category
				}
				fields {
					slug
				}
			}
		}
	}
`;
