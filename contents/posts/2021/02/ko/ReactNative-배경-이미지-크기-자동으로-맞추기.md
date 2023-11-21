---
author: millo
title: "[React Native] 배경 이미지 크기 자동으로 맞추기"
category: reactnative
layout: post
released_at: 2021-02-03 14:00
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - reactnative
    - resizeMode
    - background-image
    - 크기 조절
is_private: false
translation:
translation_series: none
description: React native에서 resizeMode 속성을 통해 배경 이미지의 크기를 자동으로 맞춰보자.
---

## 1. 서론

출시 준비중인 어플리케이션의 백그라운드 이미지를 설정하다가 width, height를 각각 100%로 지정했음에도 기기 해상도 별로 크기가 제각각으로 깨지는 현상이 발생했다. 이에 방법을 찾아보니 생각보다 간단하게 해결되어 이 포스팅을 작성한다.

## 2. 해결방법

아래의 예시 코드처럼 resizeMode="stretch" 를 적용하면 지정한 크기에 꽉 차게 배경 이미지가 생성되고 해상도에 상관 없이 깨지지 않고 유지된다. 만약, 다른 방식을 원하는 사람들은 아래의 stackoverflow 주소를 들어가면 여러 가지 해결 방법들을 볼 수 있다.

```tsx
import React from "react";
import styled from "styled-components/native";

const Container = styled.SafeAreaView``;

const BGImageContainer = styled.ImageBackground`
  width: 100%;
  height: 100%;
`;

const App = () => {
    return (
        <Container>
            <BGImageContainer
                source={require("your_background_image_path")}
                resizeMode="stretch"
            >
                {/* Input your inner code */}
            </BGImageContainer>
        </Container>
    );
};

export default App;
```

## [참고]

-   https://stackoverflow.com/questions/29322973/whats-the-best-way-to-add-a-full-screen-background-image-in-react-native?rq=1
