import React from 'react';
import Styled from 'styled-components';
import { mediaQuery } from '../../lib/styles/media';
import SeriesCard, { SeriesType } from './SeriesCard';

const Wrapper = Styled.div`
    display: flex;
    margin: -1rem;
    flex-wrap: wrap;
    ${mediaQuery(767)} {
        margin: 0;
    }

`;

interface SeriseCardGridProps {
    seriesList: Array<SeriesType>;
}

const SeriesCardGrid = ({ seriesList }: SeriseCardGridProps) => {
    return (
        <Wrapper>
            {seriesList.map((series, index) => (
                <SeriesCard series={series} key={index} />
            ))}
        </Wrapper>
    );
}

export default SeriesCardGrid;