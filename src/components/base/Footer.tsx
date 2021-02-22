import React from 'react';
import Styled from 'styled-components';
import palette from '../../lib/styles/palette';

const FooterWrapper = Styled.div`
    display: flex;
    border-top: 1px solid ${palette.gray[5]};
    margin-top: 5rem;
    width: 100%;
    height: 5rem;
    align-items: center;
    justify-content: center;
`;

const Footer = () => {
    return (
        <FooterWrapper>
            <span>millo's tech blog</span>
        </FooterWrapper>
    );
}

export default Footer;