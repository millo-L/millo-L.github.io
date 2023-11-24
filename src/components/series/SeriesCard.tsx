import React from "react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import styled, { css } from "styled-components";
import { mediaQuery } from "../../libs/styles/media";
import palette from "../../libs/styles/palette";
import { ellipsis, formatDate } from "../../libs/styles/utils";
import { SeriesType } from "../../types/Common";

const Container = styled(Link)`
	width: 42rem;
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
	${mediaQuery(1919)} {
		width: calc(50% - 2rem);
	}
	${mediaQuery(767)} {
		margin: 0;
		width: 100%;
		& + & {
			margin-top: 1rem;
		}
	}

	.thumbnail {
		width: 100%;
		max-height: 20rem;
	}

	&:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 20px 0 rgba(0, 0, 0, 0.08);
		${mediaQuery(1024)} {
			transform: none;
		}
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
		/* ${(props) =>
			!props.$clamp &&
			css`
				height: 15.875rem;
			`} */

        color: ${palette.gray[7]};
		margin-bottom: 1.5rem;
	}
	.sub-info {
		font-size: 0.75rem;
		line-height: 1.5;
		color: ${palette.gray[6]};
		.separator {
			margin-left: 0.25rem;
			margin-right: 0.25rem;
		}
	}
`;

interface Props {
	series: SeriesType;
}

export default function SeriesCard({ series }: Props) {
	return (
		<Container to={series.path}>
			{series.image && (
				<GatsbyImage className="thumbnail" image={series.image} alt={series.title} />
			)}
			<ContentContainer $clamp={series.image === null}>
				<h4>{series.title}</h4>
				<div className="sub-info">
					<span>
						{series.totalCount}
						{series.lang === "ko" ? "개의 포스트" : " posts"}
					</span>
					<span className="separator">·</span>
					{series.updated_at && (
						<span>
							{series.lang === "ko" ? "마지막 게시일" : "Last released at"}{" "}
							{formatDate(series.updated_at, series.lang)}
						</span>
					)}
				</div>
			</ContentContainer>
		</Container>
	);
}
