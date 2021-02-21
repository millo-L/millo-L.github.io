import React from 'react';
import Styled from 'styled-components';

const RatioImageBlock = Styled.div`
    width: 100%;
    position: relative;
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
`;

export interface RatioImageProps {
    widthRatio: number;
    heightRatio: number;
    src: string;
    alt?: string;
    className?: string;
}

const RatioImage = ({
    widthRatio,
    heightRatio,
    src,
    alt,
    className,
}: RatioImageProps) => {
    const paddingTop = `${(heightRatio / widthRatio) * 100}%`;

    return (
        <RatioImageBlock
            style={{
                paddingTop,
            }}
            className={className}
        >
            <img src={src} alt={alt} />
        </RatioImageBlock>
    );
};

export default RatioImage;
