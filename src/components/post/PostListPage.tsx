import { graphql, useStaticQuery } from "gatsby"
import React, { memo, useCallback } from "react"
import { reshapePost } from "../../lib/posts/reshape"
import { PartialPostType } from "./PostCard"
import PostCardGrid from "./PostCardGrid"

export type PostsPageProps = {
}

const PostsPage = ({ }: PostsPageProps) => {
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
                            path
                            title
                            released_at
                            updated_at
                            description
                            lang
                        }
                    }
                }
            }
        }
    `);

    if (!data.allMarkdownRemark) return <div></div>;
    const { allMarkdownRemark } = data;

    return <PostCardGrid posts={reshapePost(allMarkdownRemark)} />
}

export default memo(PostsPage)
