import React, { useCallback, useState } from "react"
import FloatingHeader from "../components/base/FloatingHeader"
import Header from "../components/base/Header"
import { SimpleBodyProfile } from "../components/common/SimpleProfile"
import HomeLayout from "../components/home/HomeLayout"
import HomeTab from "../components/home/HomeTab"
import MainPageRowTemplate from "../components/main/MainPageRowTemplate"
import MainResponsive from "../components/main/MainResponsive"
import MainTemplate from "../components/main/MainTemplate"
import PostListPage from "./PostListPage"

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
                    <SimpleBodyProfile />
                    <HomeLayout>
                        <PostListPage />
                    </HomeLayout>
                </MainPageRowTemplate>
            </MainResponsive>
        </MainTemplate>
    )
}

export default HomePage
