import React from "react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import styled, { css } from "styled-components";
import { mediaQuery } from "../../libs/styles/media";
import palette from "../../libs/styles/palette";
import { ellipsis, formatDate } from "../../libs/styles/utils";
import { PostType } from "../../types/Common";

const Container = styled(Link)`
	width: 20rem;
	background: white;
	border-radius: 4px;
	box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.04);
	transition:
		0.25s box-shadow ease-in,
		0.25s transform ease-in;
	margin: 1rem;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	max-height: 23rem;
	${mediaQuery(1919)} {
		width: calc(33% - 1.8125rem);
	}
	${mediaQuery(1440)} {
		width: calc(33% - 1.9rem);
	}
	${mediaQuery(1056)} {
		width: calc(50% - 2rem);
	}
	${mediaQuery(767)} {
		margin: 0;
		width: 100%;
		& + & {
			margin-top: 1rem;
		}
	}
	&:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 20px 0 rgba(0, 0, 0, 0.08);
		${mediaQuery(1024)} {
			transform: none;
		}
	}

	img {
		max-height: 195px;
	}
`;

const ContentContainer = styled.div<{ $clamp: boolean }>`
	padding: 1rem;
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: white;
	z-index: 3;
	h4 {
		font-size: 1rem;
		margin: 0;
		margin-bottom: 0.25rem;
		line-height: 1.5;
		word-break: break-word;
		${ellipsis}
		color: ${palette.gray[9]};
		${mediaQuery(767)} {
			white-space: initial;
		}
	}
	.description-wrapper {
		flex: 1;
	}
	p {
		margin: 0;
		word-break: break-word;
		overflow-wrap: break-word;
		font-size: 0.875rem;
		line-height: 1.5;
		${(props) =>
			props.$clamp &&
			css`
				height: 3.9375rem;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
			`}

		color: ${palette.gray[7]};
		margin-bottom: 1.5rem;
	}
	.sub-info {
		font-size: 0.75rem;
		line-height: 1.5;
		color: ${palette.gray[6]};
	}
`;

interface Props {
	post: PostType;
}

export default function PostCard({ post }: Props) {
	return (
		<Container to={`${post.path}`}>
			{post.image && <GatsbyImage image={post.image} alt={post.title} />}
			<ContentContainer $clamp={post.image === null}>
				<h4>{post.title}</h4>
				<div className="description-wrapper">
					<p>
						{post.description.replace(/&#x3A;/g, ":")}
						{post.description.length === 150 && "..."}
					</p>
				</div>
				<div className="sub-info">
					<span>{formatDate(post.released_at, post.lang)}</span>
					{post.updated_at && (
						<>
							<br />
							<span>
								{post.lang === "ko" ? "수정: " : "Last edited at"}{" "}
								{formatDate(post.updated_at, post.lang)}
							</span>
						</>
					)}
				</div>
			</ContentContainer>
		</Container>
	);
}
