import { graphql, useStaticQuery } from 'gatsby';
import React, { memo, useCallback } from 'react';
import queryString from 'query-string';
import { useLocation } from '@reach/router';
import { reshapePost } from '../../lib/posts/reshape';
import SeriesPostList from './SeriesPostList';

interface SeriesPostListPageProps {
    order: 'ASC' | 'DESC';
}

const SeriesPostListPage = ({ order }: SeriesPostListPageProps) => {
    const location = useLocation();
    const param = location.search && queryString.parse(location.search);
    if (!param.name) return <div></div>;
    let name: string = (param.name as string).replace(/-/gi, ' ');

    const getSeriesPosts = useCallback(() => {

        if (name === 'WebRTC 이론부터 실전까지')
            return useStaticQuery(graphql`
                {
                    allMarkdownRemark(
                        filter: {
                            frontmatter: { series: { eq: "WebRTC 이론부터 실전까지" } }
                        }
                    ) {
                        edges {
                            node {
                                id
                                frontmatter {
                                    released_at
                                    updated_at
                                    title
                                    description
                                    image {
                                        childImageSharp {
                                            fluid {
                                                ...GatsbyImageSharpFluid
                                            }
                                        }
                                    }
                                    lang
                                }
                                fields {
                                    slug
                                }
                            }
                        }
                    }
                }
            `)

    }, [name]);

    const data: any = getSeriesPosts();

    if (!data.allMarkdownRemark) return <div></div>;
    const { allMarkdownRemark } = data;

    return <SeriesPostList posts={reshapePost(allMarkdownRemark)} series={name} />;

}

export default memo(SeriesPostListPage);