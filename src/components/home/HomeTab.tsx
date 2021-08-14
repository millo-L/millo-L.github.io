import React, { memo, useEffect, useState } from "react";
import Styled, { css } from "styled-components";
import palette from "../../lib/styles/palette";
import { MdFace } from "react-icons/md";
import { GiOpenBook } from "react-icons/gi";
import { useSpring, animated } from "react-spring";
import { mediaQuery } from "../../lib/styles/media";
import { getScrollTop } from "../../lib/styles/utils";
import { BsPencilSquare } from "react-icons/bs";
import { graphql, Link, useStaticQuery } from "gatsby";
import Img from "gatsby-image";

interface HomeTabProps {
    setUser: boolean;
    page: number;
    lang: string;
}

const HomeTab = ({ setUser, page, lang }: HomeTabProps) => {
    useEffect(() => {
        if (typeof window === "undefined" || !window.document) {
            return;
        }
    }, []);
    const [visible, setVisible] = useState<boolean>(false);

    const data = useStaticQuery(graphql`
        {
            file(relativePath: { eq: "profile.jpg" }) {
                id
                childImageSharp {
                    fluid(maxWidth: 460) {
                        ...GatsbyImageSharpFluid
                    }
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

    useEffect(() => {
        if (getScrollTop() > 30) setVisible(true);
        else setVisible(false);
    }, [getScrollTop()]);

    return (
        <Wrapper>
            <UserWrapper visible={visible && setUser}>
                <Img
                    className="small-profile-img"
                    fluid={data.file.childImageSharp.fluid}
                />
                <span>millo</span>
            </UserWrapper>
            <InnerWrapper>
                <Link
                    to={lang === "ko" ? "/" : "/en"}
                    style={{ textDecoration: "none" }}
                >
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
            </InnerWrapper>
            {/*<MobileMore ref={moreButtonRef}>
                <MdMoreVert className="more" onClick={toggle} />
            </MobileMore>*/}
        </Wrapper>
    );
};

const Wrapper = Styled.div`
    margin-top: 1.5rem;
    display: flex;
    position: relative;
    .more {
        cursor: pointer;
        font-size: 1.5rem;
        color: ${palette.gray[6]};
    }
`;

const UserWrapper = Styled.div<{ visible: boolean }>`
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    max-width: 21rem;
    width: calc(20%);
    margin-right: 1rem;

    ${props =>
        props.visible
            ? css``
            : css`
                  img,
                  span {
                      display: none;
                  }
              `}
    
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

const MobileMore = Styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const InnerWrapper = Styled.div`
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

const Indicator = Styled(animated.div)`
    width: 33.33%;
    height: 2px;
    position: absolute;
    bottom: 0px;
    background: ${palette.indigo[8]};
`;

export default memo(HomeTab);
