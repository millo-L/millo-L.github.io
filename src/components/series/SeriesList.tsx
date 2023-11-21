import React, { useMemo } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { reshapeSeries } from "../../libs/list/reshape";
import { SeriesListAllMarkdownRemark } from "../../types/Common";
import SeriesCardGrid from "./SeriesCardGrid";

interface Props {
	lang: string;
}

type QueryType = {
	allMarkdownRemark: SeriesListAllMarkdownRemark;
};

export default function SeriesList({ lang }: Props) {
	const { allMarkdownRemark } = useStaticQuery<QueryType>(graphql`
		{
			allMarkdownRemark(
				filter: { frontmatter: { series: { ne: "none" } } }
				sort: { frontmatter: { released_at: DESC } }
			) {
				group(field: { frontmatter: { series: SELECT } }, limit: 1) {
					totalCount
					fieldValue
					nodes {
						frontmatter {
							image {
								childImageSharp {
									gatsbyImageData(width: 700, quality: 100)
								}
							}
							released_at
							updated_at
							lang
						}
					}
				}
			}
		}
	`);
	const seriesList = useMemo(
		() =>
			allMarkdownRemark
				? reshapeSeries(allMarkdownRemark).filter((series) => series.lang === lang)
				: [],
		[allMarkdownRemark, lang],
	);

	if (!allMarkdownRemark) return null;
	return <SeriesCardGrid seriesList={seriesList} />;
}
