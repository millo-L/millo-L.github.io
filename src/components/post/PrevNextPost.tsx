import React, { useCallback } from 'react';
import Styled from 'styled-components';
import { mediaQuery } from '../../lib/styles/media';
import { PartialSeriesType } from './PostSeriesList';
import PrevNextPostItem from './PrevNextPostItem';

const Wrapper = Styled.div`
    width: 100%;
    margin-top: 5rem;
    display: flex;
    align-items: space-between;
    justify-content: space-between;
    margin-left: auto;
    margin-right: auto;
    ${mediaQuery(767)} {
        flex-direction: column-reverse;
    }
`;

const ItemWrapper = Styled.div`
    width: 300px;

    ${mediaQuery(767)} {
        width: 100%;
        & + & {
            margin-bottom: 1.5rem;
        }
    }
`;


interface PrevNextPostProps {
    nowPostTitle: string;
    seriesList: Array<PartialSeriesType>;
    lang: string;
}

const PrevNextPost = ({ nowPostTitle, seriesList, lang }: PrevNextPostProps) => {
    const len = seriesList.length;

    const nowPageIndex = useCallback(() => {
        let len = seriesList.length;
        for (let i = 0; i < len; i++) {
            if (seriesList[i].title === nowPostTitle) return i;
        }
        return 0;
    }, [nowPostTitle, seriesList, len]);
    const index = nowPageIndex();

    return (
        <Wrapper>
            <ItemWrapper>
                <PrevNextPostItem seriesPost={index > 0 ? seriesList[index - 1] : null} right={false} lang={lang} />
            </ItemWrapper>
            <ItemWrapper>
                <PrevNextPostItem seriesPost={index < len - 1 ? seriesList[index + 1] : null} right={true} lang={lang} />
            </ItemWrapper>
        </Wrapper>
    );
}

export default PrevNextPost;