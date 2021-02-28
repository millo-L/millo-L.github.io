---
author: millo
title: "[React Native] 특정 화면에서 화면 고정하기"
category: reactnative
layout: post
released_at: 2021-02-09 15:00
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - reactnative
    - orientation
    - portrait
    - 화면 고정
is_private: false
translation:
translation_series: none
description: React native에서 특정 화면에서 화면 회전이 되지 않게 고정해보자.
---

# 1. 서론

지난번과 같이 지인의 스타트업 애플리케이션을 react native로 구현하다가 생긴 일이다. 특정 화면에서만 가로 모드로 고정하고 싶어서 이것저것 오픈 소스를 살펴보다가 발견한 모듈이 바로 react-native-orientation이다. 사용법은 매우 간단하므로 아래에서 코드를 보면 이해할 수 있을 것이다.

# 2. 개발 환경

> react-native @0.62.2 <br />
> typescript @4.0.3 <br />
> react-native-orientation @3.1.3

# 3. 구현 방법

나는 아래와 같이 특정 화면에서 가로 모드로 고정하는 코드를 작성했다. 만약 세로 모드를 고정하고 싶다면 아래의 참고 홈페이지를 방문해서 portrait와 관련된 함수를 찾으면 된다.

**반드시 useEffect 내에서 return () => {}을 사용해서 이벤트들을 제거해야 한다. 그렇지 않으면 다른 페이지에서도 lock이 적용된다.**

```tsx
import React, { useEffect, useState } from "react"
import Styled from "styled-components/native"

import Orientation from "react-native-orientation"

const Container = Styled.SafeAreaView`
   padding-left: 10px;
   padding-right: 10px;
   background-color: white;
   flex: 1;
`

const MathProblem = () => {
    useEffect(() => {
        Orientation.lockToLandscapeLeft()
        Orientation.addOrientationListener(onOrientationDidChange)

        return () => {
            Orientation.unlockAllOrientations()
            Orientation.removeOrientationListener(onOrientationDidChange)
        }
    }, [])

    const onOrientationDidChange = (orientation: any) => {
        if (orientation === "PORTRAIT") {
            Orientation.lockToLandscapeLeft()
        }
    }

    return <Container></Container>
}

export default MathProblem
```

# [참고]

-   https://www.npmjs.com/package/react-native-orientation
