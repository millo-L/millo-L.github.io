import React from 'react';
import Styled, { css } from 'styled-components';
import { mediaQuery } from '../../lib/styles/media';
import MainResponsive from '../main/MainResponsive';
import { SiNotion } from 'react-icons/si';
import { AiFillGithub } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import Img from "gatsby-image"
import { graphql, useStaticQuery } from 'gatsby';
import CategoryList from './CategoryList';

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
                }
            }

            svg {
                width: 30%;
                cursor: pointer;
            }
        `
    }
`;

const openNewBrowser = (type: 'github' | 'notion' | 'email') => {
    let link: string;
    if (type === 'github') link = 'https://github.com/millo-L';
    else if (type === 'notion') link = 'https://www.notion.so/Seungmin-Lee-706a5c55276c4ff58f1ff87d433bb4fb';
    else link = 'mailto:seungmin4755@gmail.com';

    window.open(link, '_blank');
}

interface SimpleProfileProps {
    type: 'header' | 'body';
    style?: React.CSSProperties;
}

const SimpleProfile = ({ type, style }: SimpleProfileProps) => {
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
                <div className="icon-wrapper">
                    <AiFillGithub onClick={() => openNewBrowser('github')} />
                    <SiNotion onClick={() => openNewBrowser('notion')} />
                    <MdEmail onClick={() => openNewBrowser('email')} />
                </div>
            </div>
            <CategoryList />
        </SimpleProfileWrapper>
    );
}

export default SimpleProfile;