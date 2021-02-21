import React from 'react';
import { Link } from 'gatsby';
import Styled from 'styled-components';
import media from '../../lib/styles/media';

const HeaderLogoWrapper = Styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold; 
`;

const VelogLogoLink = Styled(Link)`
    color: inherit;
    img {
        margin-right: 1rem;
        width: 3rem;
        height: 3rem;
        display: block;
        ${media.custom(944)} {
            width: 2.5rem;
            height: 2.5rem;
            margin-right: 0.75rem;
        }
    }
`;

const HeaderLogo = () => {
    return (
        <HeaderLogoWrapper>
            <VelogLogoLink to="/">
                <img src='../images/logo.png' />
            </VelogLogoLink>
        </HeaderLogoWrapper>
    )
}

export default HeaderLogo;