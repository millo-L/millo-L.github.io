import { Link } from 'gatsby';
import React from 'react';
import Styled from 'styled-components';
import { categoryList } from '../../lib/styles/category';
import { mediaQuery } from '../../lib/styles/media';
import palette from '../../lib/styles/palette';

const CategoryListWrapper = Styled.div`
    margin-top: 2.5rem;
    border-top: 1px solid ${palette.gray[3]};
    padding-top: 1rem;
    width: 100%;

    p {
        margin: 0;
        font-size: 1.3rem;
        text-align: center;
        margin-bottom: 1rem;
    }

    .category-img {
        height: 1.5rem;
        max-width: 5rem;
        margin: 0;
        margin-right: 1rem;
        border-radius: 0;
    }

    ${mediaQuery(1056)} {
        display: none;
    }
`;

interface CategoryListProps {
}

const CategoryList = ({ }: CategoryListProps) => {
    return (
        <CategoryListWrapper>
            <p>Categories</p>
            {categoryList.map((category, index) => {
                return (
                    index === 0 ?
                        <Link to="/" key={index} >
                            <img className="category-img"
                                src={category.src} key={index} />
                        </Link>
                        : <></>
                )
            })}
        </CategoryListWrapper>
    );
}

export default CategoryList;