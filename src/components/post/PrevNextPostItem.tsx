import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import palette from '../../lib/styles/palette';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import { ellipsis } from '../../lib/styles/utils';
import media from '../../lib/styles/media';
import { Link } from 'gatsby';
import { PartialSeriesType } from './PostSeriesList';

const bounceLeft = keyframes`
    0% {
        transform: translateX(0px)
    }
    50% {
        transform: translateX(-8px)
    }
    100% {
        transform: translateX(0px)
    }
`;

const bounceRight = keyframes`
    0% {
        transform: translateX(0px)
    }
    50% {
        transform: translateX(8px)
    }
    100% {
        transform: translateX(0px)
    }
`;

const Circle = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${palette.indigo[5]};
    font-size: 1.5rem;
    color: ${palette.indigo[5]};
    margin-left: 1rem;
    margin-right: 1rem;
`;

const Wrapper = styled(Link) <{ right: boolean }>`
    cursor: pointer;
    background: ${palette.gray[0]};
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.06);
    width: 100%;
    height: 4rem;
    display: flex;
    align-items: center;
    text-decoration: none;
    ${props =>
        props.right &&
        css`
        flex-direction: row-reverse;
        `}
    &:hover {
        ${Circle} {
        animation-duration: 0.35s;
        animation-name: ${props => (props.right ? bounceRight : bounceLeft)};
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
        }
    }
`;

const Text = styled.div<{ right: boolean }>`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: ${props => (props.right ? 'flex-end' : 'flex-start')};
    line-height: 1;
    min-width: 0;
    
    ${props =>
        props.right ?
            css`
                margin-left: 1rem;
            ` :
            css`
                margin-right: 1rem;
            `
    };
    .description {
        font-size: 0.75rem;
        font-weight: bold;
        color: ${palette.gray[7]};
    }
    h3 {
        ${props =>
        props.right ?
            css`
                margin-left: 1rem;
                text-align: right;
            ` :
            css`
                margin-right: 1rem;
            `
    };
        width: 100%;
        font-size: 1.125rem;
        color: ${palette.gray[7]};
        line-height: 1.15;
        margin: 0;
        margin-top: 0.5rem;
        ${media.small} {
            font-size: 1rem;
        }
        ${ellipsis};
    }
`;

interface PrevNextPostItemProps {
    right: boolean;
    seriesPost: PartialSeriesType | null;
    lang: string;
}

const PrevNextPostItem = ({
    right,
    seriesPost,
    lang
}: PrevNextPostItemProps) => {
    if (!seriesPost) {
        return null;
    }
    const to = `${seriesPost.slug}`;

    return (
        <Wrapper right={right} to={to}>
            <Circle>
                {right ? <MdArrowForward /> : <MdArrowBack />}
            </Circle>
            <Text right={right}>
                <div className="description">
                    {right ? (lang === 'ko' ? '다음' : 'Next') : (lang === 'ko' ? '이전' : 'Previous')} {lang === 'ko' ? '포스트' : 'Post'}
                </div>
                <h3>{seriesPost.title}</h3>
            </Text>
        </Wrapper>
    );
};

export default PrevNextPostItem;
