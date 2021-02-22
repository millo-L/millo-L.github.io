import { graphql, useStaticQuery } from "gatsby"
import React, { useCallback } from "react"
import { PartialPostType } from "../common/PostCard"
import PostCardGrid from "../common/PostCardGrid"

export type PostsPageProps = {
}

const PostsPage = ({ }: PostsPageProps) => {
    const data = useStaticQuery(graphql`
        {
            allMarkdownRemark(filter: {frontmatter: {is_private: {eq: false}}}) {
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

    const reshapePost = useCallback(() => {
        let posts: Array<PartialPostType> = [];
        const { edges } = allMarkdownRemark;

        edges.map((edge) => {
            const obj = edge.node.frontmatter;
            let post: PartialPostType = {
                path: obj.path,
                title: obj.title,
                description: obj.description,
                released_at: obj.released_at,
                updated_at: obj.updated_at,
                image: obj.image ? obj.image.childImageSharp.fluid : null,
                lang: obj.lang
            }

            posts.push(post);
        });

        return posts;
    }, []);

    return <PostCardGrid posts={reshapePost()} />
}

export default PostsPage
