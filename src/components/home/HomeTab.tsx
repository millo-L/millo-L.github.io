import React, { memo } from "react";
import { useSpring, animated } from "react-spring";
import { graphql, Link, useStaticQuery } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { BsPencilSquare } from "react-icons/bs";
import { GiOpenBook } from "react-icons/gi";
import { MdFace } from "react-icons/md";
import styled, { CSSProperties, css } from "styled-components";
import { mediaQuery } from "../../libs/styles/media";
import palette from "../../libs/styles/palette";

const Container = styled.div`
	margin: 1.5rem 0 0;
	display: flex;
	position: relative;
	.more {
		cursor: pointer;
		font-size: 1.5rem;
		color: ${palette.gray[6]};
	}
`;

const UserContainer = styled.div<{ $visible: boolean }>`
	display: flex;
	align-items: center;
	font-size: 1.25rem;
	width: 18%;

	${(props) =>
		props.$visible
			? css``
			: css`
					.small-profile-img,
					span {
						display: none;
					}
			  `}

	${mediaQuery(1440)} {
		width: 22%;
	}

	${mediaQuery(1056)} {
		display: none;
	}

	.small-profile-img {
		width: 2.5rem;
		height: 2.5rem;
		margin-right: 1rem;
		border-radius: 1.25rem;
	}
`;

// const MobileMore = styled.div`
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// `;

const InnerContainer = styled.div`
	display: flex;
	position: relative;
	width: 21rem;
	${mediaQuery(944)} {
		width: 16.5rem;
	}
	${mediaQuery(767)} {
	}
	.tab {
		width: 7rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.125rem;
		text-decoration: none;
		color: ${palette.gray[6]};
		height: 3rem;
		cursor: pointer;

		svg {
			font-size: 1.5rem;
			margin-right: 0.5rem;
		}
		&.active {
			color: ${palette.gray[8]};
			font-weight: bold;
		}

		${mediaQuery(944)} {
			font-size: 1rem;
			width: 5.5rem;
			svg {
				font-size: 1.25rem;
			}
		}
	}
`;

const Indicator = styled(animated.div)`
	width: 33.33%;
	height: 2px;
	position: absolute;
	bottom: 0px;
	background: ${palette.indigo[8]};
`;

interface Props {
	userVisible: boolean;
	page: number;
	lang: string;
	style?: CSSProperties;
}

type QueryType = {
	file: {
		childImageSharp: { gatsbyImageData: IGatsbyImageData };
	};
};

const HomeTab = ({ userVisible, page, lang, style }: Props) => {
	const data = useStaticQuery<QueryType>(graphql`
		{
			file(relativePath: { eq: "profile.jpeg" }) {
				childImageSharp {
					gatsbyImageData(width: 48, quality: 100)
				}
			}
		}
	`);

	/*
    const [extra, toggle] = useToggle(false);
    const moreButtonRef = useRef<HTMLDivElement | null>(null);

    const onClose = (e: React.MouseEvent<HTMLElement>) => {
        if (!moreButtonRef.current) return;
        if (
            e.target === moreButtonRef.current ||
            moreButtonRef.current.contains(e.target as Node)
        ) {
            return;
        }
        toggle();
    };
    */

	const springStyle = useSpring({
		left: `${33.5 * page}%`,
		config: {
			friction: 16,
			tension: 160,
		},
	});

	return (
		<Container style={style}>
			<UserContainer $visible={userVisible}>
				<GatsbyImage
					className="small-profile-img"
					image={data.file.childImageSharp.gatsbyImageData}
					alt="small-profile-img"
				/>
				<span>millo</span>
			</UserContainer>
			<InnerContainer>
				<Link to={lang === "ko" ? "/" : "/en"} style={{ textDecoration: "none" }}>
					<div className={`tab ${page === 0 ? "active" : ""}`}>
						<BsPencilSquare />
						{lang === "ko" ? "게시글" : "Posts"}
					</div>
				</Link>
				<Link
					to={lang === "ko" ? "/series" : "/en/series"}
					style={{ textDecoration: "none" }}
				>
					<div className={`tab ${page === 1 ? "active" : ""}`}>
						<GiOpenBook />
						{lang === "ko" ? "시리즈" : "Series"}
					</div>
				</Link>
				<Link
					to={lang === "ko" ? "/about" : "/en/about"}
					style={{ textDecoration: "none" }}
				>
					<div className={`tab ${page === 2 ? "active" : ""}`}>
						<MdFace />
						me
					</div>
				</Link>
				<Indicator style={springStyle} />
			</InnerContainer>
			{/* <MobileMore ref={moreButtonRef}>
                <MdMoreVert className="more" onClick={toggle} />
            </MobileMore> */}
		</Container>
	);
};
export default memo(HomeTab);
