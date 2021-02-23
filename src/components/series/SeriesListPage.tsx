import { graphql, useStaticQuery } from 'gatsby';
import React, { useCallback } from 'react';
import { SeriesType } from './SeriesCard';
import SeriesCardGrid from './SeriesCardGrid';

const SeriesListPage = () => {
    const data = useStaticQuery(graphql`
        {
            allMarkdownRemark(limit: 2000, filter: {frontmatter: {lang: {eq: "ko"}}}, sort: {order: ASC, fields: frontmatter___released_at}) {
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
                        }
                    }
                }
            }
        }
    `);

    if (!data.allMarkdownRemark) return <div></div>;
    const { allMarkdownRemark } = data;

    const reshapeSeries = useCallback(() => {
        let seriesList: Array<SeriesType> = [];
        const { group } = allMarkdownRemark;
        let len = group.length;

        for (let i = 0; i < len; i++) {
            const obj = group[i].nodes[0].frontmatter;
            let series: SeriesType = {
                path: `/series?name=${group[i].fieldValue.replace(/ /gi, '-')}`,
                title: group[i].fieldValue,
                image: obj.image ? obj.image.childImageSharp.fluid : null,
                updated_at: obj.released_at,
                totalCount: group[i].totalCount
            }
            seriesList.push(series);
        }

        return seriesList;
    }, [allMarkdownRemark]);

    return <SeriesCardGrid seriesList={reshapeSeries()} />;
}

export default SeriesListPage;