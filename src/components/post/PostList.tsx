import React, { useMemo } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { reshapePost } from "../../libs/list/reshape";
import { PostListAllMarkdownRemark } from "../../types/Common";
import PostCardGrid from "./PostCardGrid";

interface Props {
	lang: string;
	category: string | null;
}

type QueryType = {
	allMarkdownRemark: PostListAllMarkdownRemark | null;
};

export default function PostList({ lang, category }: Props) {
	const { allMarkdownRemark } = useStaticQuery<QueryType>(graphql`
		{
			allMarkdownRemark(
				filter: { frontmatter: { is_private: { eq: false } } }
				sort: { frontmatter: { released_at: DESC } }
			) {
				nodes {
					frontmatter {
						description
						title
						released_at
						updated_at
						lang
						category
						image {
							childImageSharp {
								gatsbyImageData(width: 320, quality: 100)
							}
						}
					}
					fields {
						slug
					}
				}
			}
		}
	`);
	const posts = useMemo(
		() =>
			reshapePost(allMarkdownRemark)
				.filter((post) => post.lang === lang)
				.filter((post) => (category ? post.category === category : true)),
		[allMarkdownRemark, category, lang],
	);

	if (!allMarkdownRemark) return null;
	return <PostCardGrid posts={posts} />;
}
