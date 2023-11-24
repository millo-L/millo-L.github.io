---
author: millo
title: "[React Native] 커스텀 로딩 애니메이션 스크린 구현하기"
category: reactnative
layout: post
released_at: 2021-02-03 15:00
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - reactnative
    - animation
    - custom loading
    - loading
is_private: false
translation:
translation_series:
description: React native에서 이미지 전환을 통해 커스텀 로딩화면을 만들어 보자.
---

## 1. 서론

배달의 민족 등과 같은 어플을 보면 로딩 중 커스터마이징 한 로딩 화면을 볼 수 있다. 이런 화면을 만드려면 어떻게 해야 할까 생각을 하다가 직접 setInterval 함수를 사용해서 구현해봤다.

## 2. 결과 화면

5초 짜리 GIF 파일이어서 다소 끊기는 느낌이 나지만 실제 동작 과정은 훨씬 자연스럽다.

[여기](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FIvZr9%2FbtqVFCQZ91c%2FKWInklXTQeZ6LKthAYyH2k%2Fimg.gif)를 눌러서 확인해보자.

## 3. 환경 설정

react native 0.62.2 버전을 typescript와 함께 설치한다. 또한, 아래와 같은 파일 경로를 생성한다. 필요한 이미지 파일은 [이 파일](https://blog.kakaocdn.net/dn/sgJUl/btqVK9AiR93/ytDrDK3geAm6YjPh0CF4g1/images.zip?attach=1&knm=tfile.zip)을 설치해서 압축을 풀어 사용하면 된다.

```
📦src
 ┣ 📂Assets
 ┃ ┗ 📂Images
 ┃ ┃ ┣ 📜0.png
 ┃ ┃ ┣ 📜1.png
 ┃ ┃ ┣ 📜10.png
 ┃ ┃ ┣ 📜11.png
 ┃ ┃ ┣ 📜12.png
 ┃ ┃ ┣ 📜13.png
 ┃ ┃ ┣ 📜14.png
 ┃ ┃ ┣ 📜2.png
 ┃ ┃ ┣ 📜3.png
 ┃ ┃ ┣ 📜4.png
 ┃ ┃ ┣ 📜5.png
 ┃ ┃ ┣ 📜6.png
 ┃ ┃ ┣ 📜7.png
 ┃ ┃ ┣ 📜8.png
 ┃ ┃ ┣ 📜9.png
 ┃ ┃ ┗ 📜images.zip
 ┗ 📜App.tsx
```

## 4. App.tsx

아래와 같이 setInterval 함수를 생성해서 이미지가 계속해서 변경되게 코드를 작성한다. 여기서 중요한 점은 해당 페이지가 종료될 때 clearInterval 함수를 통해서 작동하고 있는 setInterval 함수를 초기화해줘야 한다는 것이다. 그다지 어렵지 않게 구현할 수 있었으므로 로딩 화면 제작 자체는 크게 어렵지 않을 것으로 예상된다.

```tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Image = styled.Image`

`;

const animationImages = [
    require("~/Assets/Images/0.png"),
    require("~/Assets/Images/1.png"),
    require("~/Assets/Images/2.png"),
    require("~/Assets/Images/3.png"),
    require("~/Assets/Images/4.png"),
    require("~/Assets/Images/5.png"),
    require("~/Assets/Images/6.png"),
    require("~/Assets/Images/7.png"),
    require("~/Assets/Images/8.png"),
    require("~/Assets/Images/9.png"),
    require("~/Assets/Images/10.png"),
    require("~/Assets/Images/11.png"),
    require("~/Assets/Images/12.png"),
    require("~/Assets/Images/13.png"),
    require("~/Assets/Images/14.png"),
];

const App = () => {
    const [imageNumber, setImageNumber] = useState<number>(0);

    useEffect(() => {
        let count = 0;
        let countInterval = setInterval(() => {
            setImageNumber(count++ % 15);
        }, 1000 / 20);

        return () => clearInterval(countInterval);
    }, []);

    return (
        <Container>
            <Image source={animationImages[imageNumber]} key={imageNumber} />
        </Container>
    );
};

export default App;
```
