import React, { memo } from 'react';
import Styled, { css } from 'styled-components';
import { mediaQuery } from '../../lib/styles/media';
import MainResponsive from '../main/MainResponsive';
import Img from "gatsby-image"
import { graphql, useStaticQuery } from 'gatsby';
import CategoryList from './CategoryList';
import ProfileIcons from './ProfileIcons';

const SimpleProfileWrapper = Styled(MainResponsive) <{ type: 'header' | 'body' }>`
    ${props =>
        props.type === 'header'
            ? css`
            display: none;
            flex-direction: row;
            align-items: center;
            margin-top: 1rem;
            font-size: 1.5rem;

            ${mediaQuery(1056)} {
                display: flex;
            }

            ${mediaQuery(767)} {
            }

            .profile-img {
                width: 6rem;
                height: 6rem;
                border-radius: 4rem;
                margin-right: 1rem;

                ${mediaQuery(1056)} {
                    display: flex;
                }
            }

            .info-wrapper {
                
                display: flex;
                width: 6rem;
                height: 3rem;
                flex-direction: column;
                justify-content: center;

                .icon-wrapper {
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    margin-top: 0.3rem;

                }
            }

            svg {
                cursor: pointer;
                width: 30%;
            }

        
        `
            : css`
            max-width: 20rem;
            margin-right: 2rem;
            margin-top: -2rem;
            display: flex;
            flex-direction: column;
            font-size: 2rem;
            width: calc(20%);
            align-items: center;

            ${mediaQuery(1440)} {
            }
            ${mediaQuery(1056)} {
                display: none;
            }

            .profile-img {
                width: 100%;
                border-radius: 10rem;
                margin-bottom: 1.5rem;

            }

            .info-wrapper {
                display: flex;
                width: 8rem;
                height: 3rem;
                flex-direction: column;
                justify-content: center;
                font-weight: lighter;
                text-align: center;

                .icon-wrapper {
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                    margin-top: 0.3rem;
                    svg {
                        width: 30%;
                        cursor: pointer;
                    }
                }
            }
        `
    }
`;

interface SimpleProfileProps {
    type: 'header' | 'body';
    categoryVisible: boolean;
    lang: string;
    style?: React.CSSProperties;
}

const SimpleProfile = ({ type, categoryVisible, lang, style }: SimpleProfileProps) => {
    const data = useStaticQuery(graphql`
        {    
            file(relativePath: {eq: "profile.jpg"}) {
                id
                childImageSharp {
                    fluid(maxWidth: 460) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    `);

    return (
        <SimpleProfileWrapper type={type} style={style}>
            <Img className="profile-img" fluid={data.file.childImageSharp.fluid} />
            <div className="info-wrapper">
                <span>millo</span>
                <ProfileIcons className="icon-wrapper" />
            </div>
            <CategoryList visible={categoryVisible} lang={lang} />
        </SimpleProfileWrapper>
    );
}

export default memo(SimpleProfile);