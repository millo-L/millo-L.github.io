import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { categoryMap } from "../../libs/styles/category";
import media from "../../libs/styles/media";
import palette from "../../libs/styles/palette";
import { formatDate } from "../../libs/styles/utils";
import { SeriesPostType } from "../../types/Common";
import PostSeriesList from "./PostSeriesList";
import PrevNextPost from "./PrevNextPost";
import TagList from "./TagList";

type PostType = {
	author: string;
	category: string;
	title: string;
	tags: Array<string>;
	released_at: string;
	updated_at: string | null;
	html: string;
};
const Container = styled.div`
	width: 60%;
	margin-left: 0;
	max-width: 972px;

	${media.custom(1440)} {
		width: 80%;
	}
	${media.custom(1056)} {
		width: 100%;
	}

	.category {
		text-decoration: none;
		font-size: 1.5rem;
		color: gray;
		margin-bottom: 0;
		&:hover {
			text-decoration: underline;
		}

		${media.custom(1056)} {
			font-size: 1rem;
		}
	}

	.title {
		margin-top: 0.5rem;
		font-size: 2.5rem;
		${media.custom(1056)} {
			font-size: 2rem;
		}
	}

	.date {
		line-height: 0.8;
		color: gray;
		margin: 1rem 0;
		${media.custom(1056)} {
			font-size: 0.8rem;
		}
	}

	.adsense-block {
		width: 100%;
	}
`;

const ContentContainer = styled.div`
	width: 100%;
	margin: 0 0 5rem;
	word-break: break-all;

	a {
		color: ${palette.indigo[6]};
		text-decoration: none;
		&:hover {
			text-decoration: underline;
		}
	}

	h2 {
		font-size: 2em;
		margin: 2rem 0 1rem;
		${media.custom(767)} {
			font-size: 1.8rem;
		}
	}

	h3 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem;
		${media.custom(767)} {
			font-size: 1.2rem;
		}
	}

	h4 {
		font-size: 1.2rem;
		margin: 2rem 0 1rem;
		${media.custom(767)} {
			font-size: 1rem;
			margin: 1rem 0 1rem;
		}
	}

	p {
		font-size: 1.1em;
		line-height: 1.8;
		${media.custom(767)} {
			font-size: 1em;
			line-height: 1.7;
		}
	}

	li {
		font-size: 1.1rem;
		line-height: 2;

		${media.custom(767)} {
			font-size: 0.9rem;
			line-height: 1.7;
		}

		h4,
		p {
			margin: 0;
			font-size: 1.1rem;
			${media.custom(767)} {
				font-size: 0.9rem;
				line-height: 1.7;
			}
		}
	}

	pre,
	code {
		font-size: 1em;
		margin-bottom: 2rem;
		${media.custom(767)} {
			font-size: 0.9rem;
			margin-bottom: 1.5rem;
		}
	}

	pre {
		border-radius: 3px;
	}

	img {
		width: 100%;
	}

	table {
		white-space: normal;
		max-width: 100%;
		border-collapse: collapse;
		text-align: left;
		line-height: 1.5;
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		margin: 20px 0;
	}
	table thead th {
		min-width: 60px;
		max-width: 150px;
		padding: 10px;
		font-weight: bold;
		vertical-align: top;
		color: #fff;
		background: ${palette.indigo[6]};
		margin: 20px 10px;
	}
	table tbody th {
		max-width: 150px;
		padding: 10px;
	}
	table td {
		max-width: 350px;
		padding: 10px;
		vertical-align: top;
	}
	table tr:nth-child(even) {
		background: ${palette.indigo[0]};
	}
	th {
		font-size: 0.9rem;
		${media.custom(767)} {
			font-size: 0.8rem;
		}
	}
	td {
		font-size: 0.9rem;
		${media.custom(767)} {
			font-size: 0.8rem;
		}
	}

	hr {
		margin-top: 3rem;
		margin-bottom: 3rem;
		${media.custom(767)} {
			margin-top: 2rem;
			margin-bottom: 2rem;
		}
	}

	blockquote {
		background-color: ${palette.gray[0]};
		width: 100%;
		margin: 0;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		border-left: 4px solid ${palette.indigo[5]};

		p {
			margin-left: 2rem;
			margin-right: 2rem;
		}
	}

	.language-text {
		font-family: "Nano Santo KR";
		background-color: ${palette.gray[0]};
		width: 100%;
		margin: 0;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;

		p {
			margin-left: 2rem;
			margin-right: 2rem;
		}
	}
`;

interface Props {
	post: PostType;
	series: string;
	seriesPosts: SeriesPostType[];
	lang: string;
}

export default function PostViewer({ post, series, seriesPosts, lang }: Props) {
	const { html, title, released_at, updated_at, category, tags } = post;

	return (
		<Container>
			{category && (
				<Link
					className="category"
					to={lang === "ko" ? `/?category=${category}` : `/en?category=${category}`}
				>
					{categoryMap[category] ? (
						<img src={categoryMap[category].src} alt={category} />
					) : (
						`[${category}]`
					)}
				</Link>
			)}
			<h1 className="title">{title}</h1>
			<p className="date">
				{lang === "ko" ? "게시: " : ""}
				{formatDate(released_at, lang)}
			</p>
			{updated_at && (
				<p className="date">
					{lang === "ko" ? "수정: " : "Last edited at "}
					{formatDate(updated_at, lang)}
				</p>
			)}
			{tags && <TagList tags={tags} onClick={(tag) => console.log(tag)} />}
			{series !== "none" && (
				<PostSeriesList
					series={series}
					seriesPosts={seriesPosts}
					nowPostTitle={title}
					lang={lang}
				/>
			)}
			<ContentContainer id="content-container" dangerouslySetInnerHTML={{ __html: html }} />
			<PrevNextPost nowPostTitle={title} seriesPosts={seriesPosts} lang={lang} />
		</Container>
	);
}
