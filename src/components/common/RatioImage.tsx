import React, { memo } from 'react';
import Styled from 'styled-components';
import Img, { FluidObject } from 'gatsby-image';
import { mediaQuery } from '../../lib/styles/media';

const RatioImageBlock = Styled.div`
    width: 100%;
    max-height: 12.5rem;
    display: flex;
    align-items: center;

    z-index: 1;

    ${mediaQuery(767)} {
        max-height: 100%;
    }

    .ratio-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-height: 100%;
        display: block;
        object-fit: cover;
    }
`;

export interface RatioImageProps {
    widthRatio: number;
    heightRatio: number;
    fluid: FluidObject | FluidObject[];
    style?: React.CSSProperties;
}

const RatioImage = ({
    widthRatio,
    heightRatio,
    fluid,
    style
}: RatioImageProps) => {
    const paddingTop = `${(heightRatio / widthRatio) * 100}%`;

    return (
        <RatioImageBlock style={style}>
            <Img className="ratio-img" fluid={fluid} />
        </RatioImageBlock>
    );
};

export default memo(RatioImage);
