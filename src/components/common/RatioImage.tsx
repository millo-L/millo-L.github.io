import React from 'react';
import Styled from 'styled-components';
import Img, { FluidObject } from 'gatsby-image';

const RatioImageBlock = Styled.div`
    width: 100%;
    max-height: 100%;
    position: relative;
    display: flex;
    align-items: center;
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
}

const RatioImage = ({
    widthRatio,
    heightRatio,
    fluid,
}: RatioImageProps) => {
    const paddingTop = `${(heightRatio / widthRatio) * 100}%`;

    return (
        <RatioImageBlock
        >
            <Img className="ratio-img" fluid={fluid} />
        </RatioImageBlock>
    );
};

export default RatioImage;
