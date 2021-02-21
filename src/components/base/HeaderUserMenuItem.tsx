import React from 'react';
import Styled from 'styled-components';
import { Link } from 'gatsby';
import palette from '../../lib/styles/palette';

const HeaderUserMenuItemWrapper = Styled.div`
    color: ${palette.gray[9]};
    padding: 0.75rem 1rem;
    width: 4rem;
    line-height: 1.5;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    &:hover {
        background: ${palette.gray[0]};
    }
`;

interface HeaderUserMenuItemProps {
    to?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const HeaderUserMenuItem = ({
    children,
    onClick,
}: HeaderUserMenuItemProps) => {
    return (
        <HeaderUserMenuItemWrapper onClick={onClick}>
            {children}
        </HeaderUserMenuItemWrapper>
    );
}

export default HeaderUserMenuItem;
