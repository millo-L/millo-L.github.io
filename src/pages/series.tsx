import React from 'react';
import queryString from 'query-string';
import { useLocation } from '@reach/router';
import MainTemplate from '../components/main/MainTemplate';
import MainResponsive from '../components/main/MainResponsive';
import Header from '../components/base/Header';
import SeriesPostListPage from '../components/series/SeriesPostListPage';
import Footer from '../components/base/Footer';

const Series = () => {
    const location = useLocation();
    const series = location.search && queryString.parse(location.search);

    return (
        <MainTemplate>
            <Header />
            <MainResponsive>
                <SeriesPostListPage order='ASC' />
                <Footer />
            </MainResponsive>
        </MainTemplate>
    );
}

export default Series;
