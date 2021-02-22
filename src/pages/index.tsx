import { graphql, useStaticQuery } from "gatsby"
import React, { useCallback, useState } from "react"
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

const GlobalStyles = createGlobalStyle`
    html {
        font-family: ELAND_Choice_M, serif;
    }
`

const HomePage = () => {
    const [page, setPage] = useState<number>(0);
    const onClick = useCallback((index: number) => setPage(index), []);

    return (
        <MainTemplate>
            <Header />
            <FloatingHeader page={page} onClick={onClick} />
            <MainResponsive>
                <HomeTab page={page} setUser={false} onClick={onClick} />
                <MainPageRowTemplate>
                    <SimpleProfile type="body" />
                    <HomeLayout>
                        <PostListPage />
                    </HomeLayout>
                </MainPageRowTemplate>
            </MainResponsive>
        </MainTemplate>
    );
}

export default HomePage
