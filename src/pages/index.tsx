import React from "react"
import Header from "../components/base/Header"
import { SimpleBodyProfile } from "../components/common/SimpleProfile"
import HomeLayout from "../components/home/HomeLayout"
import HomeTab from "../components/home/HomeTab"
import MainPageRowTemplate from "../components/main/MainPageRowTemplate"
import MainResponsive from "../components/main/MainResponsive"
import MainTemplate from "../components/main/MainTemplate"
import PostsPage from "./PostsPage"

const HomePage = () => {
    return (
        <MainTemplate>
            <Header />
            <MainResponsive>
                <HomeTab setUser={false} />
                <MainPageRowTemplate>
                    <SimpleBodyProfile />
                    <HomeLayout>
                        <PostsPage />
                    </HomeLayout>
                </MainPageRowTemplate>
            </MainResponsive>
        </MainTemplate>
    )
}

export default HomePage
