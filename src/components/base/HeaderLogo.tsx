import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import Img from "gatsby-image";
import Styled from "styled-components";
import media from "../../lib/styles/media";

const HeaderLogoWrapper = Styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold; 
`;

const VelogLogoLink = Styled(Link)`
    color: inherit;
    .header-logo {
        margin-right: 1rem;
        width: 3rem;
        height: 3rem;
        display: block;
        ${media.custom(1056)} {
            width: 2.5rem;
            height: 2.5rem;
            margin-right: 0.75rem;
        }
    }
`;

interface HeaderLogoProps {
    lang: string;
}

const HeaderLogo = ({ lang }: HeaderLogoProps) => {
    const data = useStaticQuery(graphql`
        {
            file(relativePath: { eq: "logo.png" }) {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    `);

    if (!data.file) return <div></div>;

    return (
        <HeaderLogoWrapper>
            <VelogLogoLink to={lang === "ko" ? "/" : "/en"}>
                <Img
                    className="header-logo"
                    fluid={data.file.childImageSharp.fluid}
                />
            </VelogLogoLink>
        </HeaderLogoWrapper>
    );
};

export default HeaderLogo;
