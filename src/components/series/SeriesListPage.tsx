import { graphql, useStaticQuery } from "gatsby";
import React, { memo } from "react";
import { filterByLanguage, reshapeSeries } from "../../lib/list/reshape";
import SeriesCardGrid from "./SeriesCardGrid";

interface SeriesListPageProps {
    lang: string;
}

const SeriesListPage = ({ lang }: SeriesListPageProps) => {
    const data = useStaticQuery(graphql`
        {
            allMarkdownRemark(
                sort: { order: DESC, fields: frontmatter___released_at }
                filter: { frontmatter: { series: { ne: "none" } } }
            ) {
                group(field: frontmatter___series, limit: 1) {
                    fieldValue
                    totalCount
                    nodes {
                        frontmatter {
                            image {
                                childImageSharp {
                                    fluid {
                                        ...GatsbyImageSharpFluid
                                    }
                                }
                            }
                            released_at
                            lang
                        }
                    }
                }
            }
        }
    `);

    const { allMarkdownRemark } = data;
    if (!allMarkdownRemark) return <div></div>;

    return (
        <SeriesCardGrid
            seriesList={filterByLanguage(
                reshapeSeries(allMarkdownRemark),
                lang
            )}
        />
    );
};

export default memo(SeriesListPage);
