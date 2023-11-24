import React from "react";
import { Link } from "gatsby";
import styled, { css } from "styled-components";
import { categoryList, enCategoryList } from "../../libs/styles/category";
import { mediaQuery } from "../../libs/styles/media";
import palette from "../../libs/styles/palette";

const Container = styled.div<{ $visible: boolean }>`
	margin-top: 2.5rem;
	border-top: 1px solid ${palette.gray[3]};
	padding-top: 1.5rem;
	width: 12rem;
	min-width: 12rem;

	${(props) =>
		props.$visible
			? css``
			: css`
					display: none;
			  `}

	p {
		margin: 0;
		font-size: 1.3rem;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.img-wrapper {
		display: flex;
		flex-wrap: wrap;
		width: 90%;
		margin-left: auto;
		margin-right: auto;
		justify-content: space-between;
		align-items: space-between;
	}

	.whole-category {
		height: 1.8rem;
		width: 90%;
		margin-left: 5%;
		margin-bottom: 10px;
		border: 1px solid #5c7cfa;
		font-size: 11pt;
		display: flex;
		justify-content: center;
		align-items: center;
		-webkit-transition: background-color 0.5s;
		transition: background-color 0.5s;
		color: #5c7cfa;
		&:hover {
			color: white;
			background-color: #5c7cfa;
		}
	}

	a {
		height: 1.5rem;
		margin-bottom: 0.8rem;
	}

	.category-img {
		height: 1.5rem;
		margin: 0;
		border-radius: 0;
	}

	${mediaQuery(1440)} {
		width: 100%;
	}

	${mediaQuery(1056)} {
		display: none;
	}
`;

interface Props {
	visible: boolean;
	lang: string;
}

export default function CategoryList({ visible, lang }: Props) {
	return (
		<Container $visible={visible}>
			<p>Categories</p>
			<Link to={lang === "ko" ? "/" : "/en"} style={{ textDecoration: "none" }}>
				<div className="whole-category">{lang === "ko" ? "전체 보기" : "All Posts"}</div>
			</Link>
			<div className="img-wrapper">
				{lang === "ko"
					? categoryList
							.filter((_, idx) => idx < 15)
							.map((category) => {
								return (
									<Link to={`/?category=${category.name}`} key={category.name}>
										<img
											className="category-img"
											src={category.src}
											alt={category.name}
										/>
									</Link>
								);
							})
					: enCategoryList
							.filter((_, idx) => idx < 12)
							.map((category) => {
								return (
									<Link to={`/en?category=${category.name}`} key={category.name}>
										<img
											className="category-img"
											src={category.src}
											alt={category.name}
										/>
									</Link>
								);
							})}
			</div>
		</Container>
	);
}
