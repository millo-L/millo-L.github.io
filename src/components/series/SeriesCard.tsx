import React, { memo } from "react"
import { Link } from "gatsby"
import Styled, { css } from "styled-components"
import { mediaQuery } from "../../lib/styles/media"
import palette from "../../lib/styles/palette"
import { ellipsis, formatDate } from "../../lib/styles/utils"
import RatioImage from "../common/RatioImage"
import { FluidObject } from 'gatsby-image';

const Wrapper = Styled.div`
    width: 42rem;
    background: white;
    border-radius: 4px;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.04);
    transition: 0.25s box-shadow ease-in, 0.25s transform ease-in;
    margin: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    ${mediaQuery(1919)} {
        width: calc(50% - 2rem);
    }
    ${mediaQuery(767)} {
        margin: 0;
        width: 100%;
        & + & {
            margin-top: 1rem;
        }
    }
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 20px 0 rgba(0, 0, 0, 0.08);
        ${mediaQuery(1024)} {
            transform: none;
        }
    }

`

const StyledLink = Styled(Link)`
    display: block;
    color: inherit;
    text-decoration: none;
`

const Content = Styled.div<{ clamp: boolean }>`
    padding: 1rem;
    display: flex;
    flex: 1;
    flex-direction: column;
    h4 {
        font-size: 1rem;
        margin: 0;
        margin-bottom: 0.25rem;
        line-height: 1.5;
        word-break: break-word;
        ${ellipsis}
        color: ${palette.gray[9]};
        ${mediaQuery(767)} {
            white-space: initial;
        }
    }
    .description-wrapper {
        flex: 1;
    }
    p {
        margin: 0;
        word-break: break-word;
        overflow-wrap: break-word;
        font-size: 0.875rem;
        line-height: 1.5;
        ${props =>
        props.clamp &&
        css`
                height: 3.9375rem;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
            `}
        /* ${props =>
        !props.clamp &&
        css`
                height: 15.875rem;
            `} */

        color: ${palette.gray[7]};
        margin-bottom: 1.5rem;
    }
    .sub-info {
        font-size: 0.75rem;
        line-height: 1.5;
        color: ${palette.gray[6]};
        .separator {
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }
    }

`

export type SeriesType = {
    path: string
    title: string
    image: FluidObject | FluidObject[]
    updated_at: string
    totalCount: number
    lang: string
}

interface SeriesCardProps {
    series: SeriesType
}

const SeriesCard = ({ series }: SeriesCardProps) => {
    return (
        <Wrapper>
            {series.image && (
                <StyledLink to={`${series.path}`}>
                    <RatioImage
                        widthRatio={2}
                        heightRatio={1}
                        fluid={series.image}
                    />
                </StyledLink>
            )}
            <Content clamp={!series.image}>
                <StyledLink to={`${series.path}`}>
                    <h4>{series.title}</h4>
                </StyledLink>
                <StyledLink to={`${series.path}`}>
                    <div className="sub-info">
                        <span>{series.totalCount}{series.lang === 'ko' ? '개의 포스트' : ' posts'}</span>
                        <span className="separator">·</span>
                        <span>{series.lang === 'ko' ? '마지막 업데이트' : 'Last edited at'} {formatDate(series.updated_at, series.lang)}</span>
                    </div>
                </StyledLink>
            </Content>
        </Wrapper>
    )
}

export default memo(SeriesCard)
