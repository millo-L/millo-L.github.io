import React from "react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import styled from "styled-components";
import media, { mediaQuery } from "../../libs/styles/media";
import palette from "../../libs/styles/palette";
import { ellipsis, formatDate } from "../../libs/styles/utils";
import { PostType } from "../../types/Common";

const Container = styled(Link)`
	width: 100%;
	background: white;
	border-radius: 4px;
	box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.04);
	transition:
		0.25s box-shadow ease-in,
		0.25s transform ease-in;
	margin-top: 2rem;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	&:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 20px 0 rgba(0, 0, 0, 0.08);
		${mediaQuery(1024)} {
			transform: none;
		}
	}

	h2 {
		margin: 1rem;
		${media.custom(1056)} {
			font-size: 1.3rem;
		}
	}

	img {
		border-top: 1px solid ${palette.gray[2]};
		width: 100%;
	}
`;

const Content = styled.div`
	padding: 1rem;
	display: flex;
	flex: 1;
	flex-direction: column;
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
	index: number;
}

export default function SeriesPost({ post, index }: Props) {
	return (
		<Container to={post.path}>
			<h2>
				{index + 1}. {post.title}
			</h2>
			{post.image && (
				<GatsbyImage className="thumbnail" image={post.image} alt={post.title} />
			)}
			<Content>
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
								{post.lang === "ko" ? "수정: " : "Last edited at "}
								{formatDate(post.updated_at, post.lang)}
							</span>
						</>
					)}
				</div>
			</Content>
		</Container>
	);
}
