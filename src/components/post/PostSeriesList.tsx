import React from "react";
import { Link } from "gatsby";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoBookmarkSharp } from "react-icons/io5";
import Styled from "styled-components";
import useToggle from "../../libs/hooks/useToggle";
import media from "../../libs/styles/media";
import palette from "../../libs/styles/palette";
import { SeriesPostType } from "../../types/Common";

const Wrapper = Styled.div`
    position: relative;
    width: 80%;
    background-color: ${palette.gray[0]};
    margin-left: auto;
    margin-right: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-radius: 10px;
    word-break: break-all;

    ${media.custom(767)} {
        width: 100%;
    }

    h2 {
        margin-left: 1.5rem;
        margin-right: 1.5rem;

        ${media.custom(767)} {
            font-size: 1.2rem;
        }
    }

    a {
        text-decoration: none;
        color: ${palette.gray[8]};

        &:hover {
            text-decoration: underline;
        }
    }

    ol {
        padding-left: 3rem;
        padding-right: 1.5rem;
            font-size: 1rem;

        .now-post {
            color: ${palette.indigo[5]};
            font-weight: bold;
        }

        li {
            margin: 0.5rem;
            color: ${palette.gray[6]};


        }
    }

    .bookmark-img {
        position : absolute;
        right: 1.5rem;
        top: -2px;
        width: 2.8rem;
        height: 2.8rem;
        color: ${palette.indigo[5]};

        ${media.custom(767)} {
            right: 1rem;
            width: 2.2rem;
            height: 2.2rem;
        }
    }

    .footer {
        display: flex;
        justify-content: space-between;
        margin-top: 3rem;
        margin-right: 1.5rem;
        margin-left: 1.5rem;

        .visible-btn {
            display: flex;
            cursor: pointer;
            align-items: center;
            color: ${palette.gray[7]};
            span {
                margin-left: 0.3rem;
                font-size: 0.9rem;
            }
        }

    }
`;

interface Props {
	series: string;
	seriesPosts: SeriesPostType[];
	nowPostTitle: string;
	lang: string;
}

export default function PostSeriesList({ series, seriesPosts, nowPostTitle, lang }: Props) {
	const [seriesListVisible, onToggle] = useToggle(true);

	return (
		<Wrapper>
			<Link to={`/series/${series.replace(/ /gi, "-")}`}>
				<h2>{series}</h2>
			</Link>
			<IoBookmarkSharp className="bookmark-img" />
			{seriesListVisible ? (
				<ol>
					{seriesPosts.map((post) => (
						<li key={post.title}>
							{nowPostTitle === post.title ? (
								<span className="now-post">{post.title}</span>
							) : (
								<Link to={post.path}>{post.title}</Link>
							)}
						</li>
					))}
				</ol>
			) : (
				<div />
			)}
			<div className="footer">
				<div
					className="visible-btn"
					role="button"
					tabIndex={0}
					onClick={onToggle}
					onKeyDown={onToggle}
				>
					{seriesListVisible ? <AiFillCaretUp /> : <AiFillCaretDown />}
					{seriesListVisible
						? lang === "ko"
							? "숨기기"
							: "Hide"
						: lang === "ko"
						  ? "목록 보기"
						  : "Show list"}
				</div>
			</div>
		</Wrapper>
	);
}
