import React, { useCallback, useState } from "react";
import { createGlobalStyle } from "styled-components";
import FloatingHeader from "../components/base/FloatingHeader";
import Header from "../components/base/Header";
import SimpleProfile from "../components/common/SimpleProfile";
import HomeLayout from "../components/home/HomeLayout";
import HomeTab from "../components/home/HomeTab";
import MainPageRowTemplate from "../components/main/MainPageRowTemplate";
import MainResponsive from "../components/main/MainResponsive";
import MainTemplate from "../components/main/MainTemplate";
import SeriesListPage from "../components/series/SeriesListPage";
import queryString from "query-string";
import { useLocation } from "@reach/router";
import SEO from "../components/SEO";
import "../components/css/typography.css";

createGlobalStyle`
    body {
        font-family: "ELAND", serif;
    }
`;

const HomePage = () => {
    const location = useLocation();
    const series = location.search && queryString.parse(location.search);

    const [page, setPage] = useState<number>(1);
    const [categoryVisible, setCategoryVisible] = useState<boolean>(true);
    const onClick = useCallback((index: number) => {
        setPage(index);
        if (index > 0) setCategoryVisible(false);
        else setCategoryVisible(true);
    }, []);

    return (
        <MainTemplate>
            <SEO title="Series" />
            <Header lang="ko" ko_to="#" en_to="/en/series" />
            <FloatingHeader page={page} lang="ko" />
            <MainResponsive>
                <HomeTab page={page} setUser={false} lang="ko" />
                <MainPageRowTemplate>
                    <SimpleProfile
                        type="body"
                        categoryVisible={categoryVisible}
                        lang="ko"
                    />
                    <HomeLayout>
                        <SeriesListPage lang="ko" />
                    </HomeLayout>
                </MainPageRowTemplate>
            </MainResponsive>
        </MainTemplate>
    );
};

export default HomePage;
