import React, { useCallback, useState } from "react"
import { createGlobalStyle } from "styled-components"
import FloatingHeader from "../../components/base/FloatingHeader"
import Header from "../../components/base/Header"
import SimpleProfile from "../../components/common/SimpleProfile"
import HomeLayout from "../../components/home/HomeLayout"
import HomeTab from "../../components/home/HomeTab"
import MainPageRowTemplate from "../../components/main/MainPageRowTemplate"
import MainResponsive from "../../components/main/MainResponsive"
import MainTemplate from "../../components/main/MainTemplate"
import queryString from "query-string"
import { useLocation } from "@reach/router"
import SEO from "../../components/SEO"
import "../../components/css/typography.css"
import Adsense from "../../components/common/Adsense"

createGlobalStyle`
    body {
        font-family: "ELAND", serif;
    }
`

const HomePage = () => {
    const location = useLocation()
    const series = location.search && queryString.parse(location.search)

    const [page, setPage] = useState<number>(2)
    const [categoryVisible, setCategoryVisible] = useState<boolean>(true)
    const onClick = useCallback((index: number) => {
        setPage(index)
        if (index > 0) setCategoryVisible(false)
        else setCategoryVisible(true)
    }, [])

    return (
        <MainTemplate>
            <SEO title="About" lang="en" />
            <Header lang="en" ko_to="/about" en_to="#" />
            <FloatingHeader page={page} lang="en" />
            <MainResponsive>
                <HomeTab page={page} setUser={false} lang="en" />
                <MainPageRowTemplate>
                    <SimpleProfile
                        type="body"
                        categoryVisible={categoryVisible}
                        lang="en"
                    />
                    <HomeLayout>
                        <div>
                            <Adsense
                                style={{ display: "block" }}
                                adClient="ca-pub-3926462216067158"
                                adSlot="4768153869"
                                adFormat="auto"
                                fullWidthResponsive="true"
                            />
                        </div>
                    </HomeLayout>
                </MainPageRowTemplate>
            </MainResponsive>
        </MainTemplate>
    )
}

export default HomePage
