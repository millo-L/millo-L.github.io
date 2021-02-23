import { graphql, useStaticQuery } from "gatsby"
import React, { useCallback, useEffect, useState } from "react"
import { createGlobalStyle } from "styled-components"
import FloatingHeader from "../components/base/FloatingHeader"
import Footer from "../components/base/Footer"
import Header from "../components/base/Header"
import SimpleProfile from "../components/common/SimpleProfile"
import HomeLayout from "../components/home/HomeLayout"
import HomeTab from "../components/home/HomeTab"
import MainPageRowTemplate from "../components/main/MainPageRowTemplate"
import MainResponsive from "../components/main/MainResponsive"
import MainTemplate from "../components/main/MainTemplate"
import PostListPage from "../components/post/PostListPage"
import '../components/css/typography.css';
import SeriesListPage from "../components/series/SeriesListPage"
import queryString from 'query-string';
import { useLocation } from '@reach/router';

const indexPage = (page: number) => {
    if (page === 0) return <PostListPage />;
    else if (page === 1) return <SeriesListPage />;
    else return <div></div>;
}

const HomePage = () => {
    const location = useLocation();
    const series = (location.search && queryString.parse(location.search));
    if (series) console.log(series);

    const [page, setPage] = useState<number>(0);
    const [categoryVisible, setCategoryVisible] = useState<boolean>(true);
    const onClick = useCallback((index: number) => {
        setPage(index);
        if (index > 0) setCategoryVisible(false);
        else setCategoryVisible(true);
    }, []);

    return (
        <MainTemplate>
            <Header />
            <FloatingHeader page={page} onClick={onClick} />
            <MainResponsive>
                <HomeTab page={page} setUser={false} onClick={onClick} />
                <MainPageRowTemplate>
                    <SimpleProfile type="body" categoryVisible={categoryVisible} />
                    <HomeLayout>
                        {indexPage(page)}
                    </HomeLayout>
                </MainPageRowTemplate>
            </MainResponsive>
        </MainTemplate>
    );
}

export default HomePage
