import { css } from "styled-components"
import distanceInWordsToNow from "date-fns/formatDistanceToNow"
import format from "date-fns/format"
import koLocale from "date-fns/locale/ko"
import enLocale from "date-fns/locale/en-US"

export const ellipsis = css`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: hidden;
`

export const customFont = css`
    /* font-family: 'Spoqa Han Sans', -apple-system, BlinkMacSystemFont,
    -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Apple SD Gothic Neo',
    arial, 나눔고딕, 'Nanum Gothic', 돋움; */
`

export const formatDate = (date: string, lang: string): string => {
    const d = new Date(date)
    const now = Date.now()
    const diff = now - new Date(date).getTime()

    if (lang === "en") {
        if (diff < 1000 * 60 * 5) {
            return "A few minutes ago"
        }
        if (diff < 1000 * 60 * 60 * 24) {
            return distanceInWordsToNow(d, {
                addSuffix: true,
                locale: enLocale,
            })
        }
        if (diff < 1000 * 60 * 60 * 36) {
            return "Yesterday"
        }
        if (diff < 1000 * 60 * 60 * 24 * 7) {
            return distanceInWordsToNow(d, {
                addSuffix: true,
                locale: enLocale,
            })
        }
        return d.toDateString()
    }

    // less than 5 minutes
    if (diff < 1000 * 60 * 5) {
        return "방금 전"
    }
    if (diff < 1000 * 60 * 60 * 24) {
        return distanceInWordsToNow(d, { addSuffix: true, locale: koLocale })
    }
    if (diff < 1000 * 60 * 60 * 36) {
        return "어제"
    }
    if (diff < 1000 * 60 * 60 * 24 * 7) {
        return distanceInWordsToNow(d, { addSuffix: true, locale: koLocale })
    }
    return format(d, "yyyy년 M월 d일")
}

export const getScrollTop = () => {
    if (typeof window === "undefined" || !window.document) {
        return
    }
    if (!document.body) return 0
    const scrollTop = document.documentElement
        ? document.documentElement.scrollTop || document.body.scrollTop
        : document.body.scrollTop
    return scrollTop
}
