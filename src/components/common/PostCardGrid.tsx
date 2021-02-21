import React from "react"
import Styled from "styled-components"
import { mediaQuery } from "../../lib/styles/media"
import PostCard, { PartialPostType } from "./PostCard"

const Wrapper = Styled.div`
    display: flex;
    margin: -1rem;
    flex-wrap: wrap;
    ${mediaQuery(767)} {
        margin: 0;
    }
`

interface PostCardGridProps {}

const PostCardGrid = ({}: PostCardGridProps) => {
    const dummyPosts: Array<PartialPostType> = [
        {
            id: "1",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "",
            comments_count: 0,
        },
        {
            id: "2",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "",
            comments_count: 0,
        },
        {
            id: "3",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "4",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "5",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "6",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "7",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "",
            comments_count: 0,
        },
        {
            id: "11",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "",
            comments_count: 0,
        },
        {
            id: "12",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "",
            comments_count: 0,
        },
        {
            id: "13",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "14",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "15",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "16",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "17",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "",
            comments_count: 0,
        },
        {
            id: "21",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "",
            comments_count: 0,
        },
        {
            id: "22",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "",
            comments_count: 0,
        },
        {
            id: "23",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "24",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "25",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "26",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "2021-02-19 23:00:08",
            comments_count: 0,
        },
        {
            id: "27",
            title: "샘플 데이터",
            short_description:
                "샘플 데이터입니다. 많이 사랑해주세요. 감사합니다.",
            image: "../images/sample.jpg",
            url_slug: "",
            is_private: false,
            released_at: "2021-02-01 13:02:12",
            updated_at: "",
            comments_count: 0,
        },
    ]

    return (
        <Wrapper>
            {dummyPosts.map(post => (
                <PostCard post={post} key={post.id} />
            ))}
        </Wrapper>
    )
}

export default PostCardGrid
