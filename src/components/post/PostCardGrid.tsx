import React from "react";
import styled from "styled-components";
import { mediaQuery } from "../../libs/styles/media";
import { PostType } from "../../types/Common";
import PostCard from "./PostCard";

const Container = styled.div`
	display: flex;
	flex: 1;
	flex-wrap: wrap;
	margin: 0 -1rem -1rem;

	${mediaQuery(767)} {
		margin: 0.25rem;
	}
`;

interface Props {
	posts: PostType[];
}

export default function PostCardGrid({ posts }: Props) {
	return (
		<Container>
			{posts.map((post) => (
				<PostCard post={post} />
			))}
		</Container>
	);
}
