import React from 'react';
import Styled, { css } from 'styled-components';
import { mediaQuery } from '../../lib/styles/media';
import MainResponsive from '../main/MainResponsive';
import { SiNotion } from 'react-icons/si';
import { AiFillGithub } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';

const SimpleHeaderProfileWrapper = Styled(MainResponsive)`
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

    img {
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
`;

const openNewBrowser = (type: 'github' | 'notion' | 'email') => {
    let link: string;
    if (type === 'github') link = 'https://github.com/Seung3837';
    else if (type === 'notion') link = 'https://www.notion.so/Seungmin-Lee-706a5c55276c4ff58f1ff87d433bb4fb';
    else link = 'mailto:seungmin4755@gmail.com';

    window.open(link, '_blank');
}

interface SimpleHeaderProfileProps {
}

export const SimpleHeaderProfile = () => {
    return (
        <SimpleHeaderProfileWrapper>
            <img src='../images/profile.jpg' />
            <div className="info-wrapper">
                <span>millo</span>
                <div className="icon-wrapper">
                    <AiFillGithub onClick={() => openNewBrowser('github')} />
                    <SiNotion onClick={() => openNewBrowser('notion')} />
                    <MdEmail onClick={() => openNewBrowser('email')} />
                </div>
            </div>
        </SimpleHeaderProfileWrapper>
    );
}

const SimpleBodyProfileWrapper = Styled.div`
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

    img {
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
`;

interface SimpleBodyProfileProps {
    style?: React.CSSProperties;
}

export const SimpleBodyProfile = ({ style }: SimpleBodyProfileProps) => {
    return (
        <SimpleBodyProfileWrapper style={style}>
            <img src='../images/profile.jpg' />
            <div className="info-wrapper">
                <span>millo</span>
                <div className="icon-wrapper">
                    <AiFillGithub onClick={() => openNewBrowser('github')} />
                    <SiNotion onClick={() => openNewBrowser('notion')} />
                    <MdEmail onClick={() => openNewBrowser('email')} />
                </div>
            </div>

        </SimpleBodyProfileWrapper>
    )
}