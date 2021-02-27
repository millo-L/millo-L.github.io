import { graphql, useStaticQuery } from "gatsby"
import React, { memo } from "react"
import { filterByCategory, filterByLanguage, reshapePost } from "../../lib/list/reshape"
import PostCardGrid from "./PostCardGrid"
import queryString from 'query-string';
import { useLocation } from '@reach/router';

interface PostsPageProps {
    lang: string;
}

const PostsPage = ({ lang }: PostsPageProps) => {
    const location = useLocation();
    const query = (location.search && queryString.parse(location.search));
    const data = useStaticQuery(graphql`
        {
            allMarkdownRemark(sort: {fields: frontmatter___released_at, order: DESC}) {
                edges {
                    node {
                        id
                        frontmatter {
                            image {
                                childImageSharp{
                                    fluid(maxWidth: 720) {
                                        ...GatsbyImageSharpFluid
                                    }
                                }
                            }
                            title
                            released_at
                            updated_at
                            description
                            lang
                            category
                        }
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `);

    if (!data.allMarkdownRemark) return <div></div>;
    const { allMarkdownRemark } = data;

    return <PostCardGrid posts={query.category ? filterByCategory(filterByLanguage(reshapePost(allMarkdownRemark), lang), (query.category as string)) : filterByLanguage(reshapePost(allMarkdownRemark), lang)} />
}

export default memo(PostsPage)
