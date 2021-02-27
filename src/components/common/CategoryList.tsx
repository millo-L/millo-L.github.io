import { Link } from 'gatsby';
import React, { memo } from 'react';
import Styled, { css } from 'styled-components';
import { categoryList } from '../../lib/styles/category';
import { mediaQuery } from '../../lib/styles/media';
import palette from '../../lib/styles/palette';

const CategoryListWrapper = Styled.div<{ visible: boolean }>`
    margin-top: 2.5rem;
    border-top: 1px solid ${palette.gray[3]};
    padding-top: 1.5rem;
    width: 80%;

    ${props =>
        props.visible
            ? css``
            : css` display: none; `
    }

    p {
        margin: 0;
        font-size: 1.3rem;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .category-img {
        height: 1.5rem;
        max-width: 5rem;
        margin: 0;
        margin-right: 1rem;
        border-radius: 0;
    }

    ${mediaQuery(1440)} {
        width: 100%;
    }

    ${mediaQuery(1056)} {
        display: none;
    }
`;

interface CategoryListProps {
    visible: boolean;
    lang: string;
    selectedCategory?: string;
}

const CategoryList = ({ visible, lang, selectedCategory }: CategoryListProps) => {
    return (
        <CategoryListWrapper visible={visible}>
            <p>Categories</p>
            {categoryList.filter((category, idx) => idx < 2).map((category, index) => {
                return (
                    <Link to={lang === 'ko' ? `/?category=${category.name}` : `/en?category=${category.name}`} key={index} >
                        <img className="category-img"
                            src={category.src} />
                    </Link>
                )
            })}
        </CategoryListWrapper>
    );
}

export default memo(CategoryList);