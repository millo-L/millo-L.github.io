---
author: millo
title: "[React Native] Dimensions.get('window')와 Dimensions.get('screen')의 차이점"
category: reactnative
layout: post
released_at: 2021-02-09 13:00
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - reactnative
    - Dimensions
    - Dimensions.get('window')
    - Dimensions.get('screen')
is_private: false
translation:
translation_series: none
description: React native에서 Dimensions.get('window')와 Dimensions.get('screen')의 차이를 알아보자.
---

## 1. 서론

리액트 네이티브 개발 중 모바일 기기의 해상도를 가져올 수 있는 API인 Dimensions를 사용할 일이 있었는 데, 굳이 왜 window와 screen으로 나뉘어 있는지 모르겠어서 검색하고 알아낸 내용을 적고자 한다.

## 2. 차이점

사실 IOS에서는 window와 screen 둘 중 어떤 것을 쓰더라도 동일하게 적용된다. <br />
다만, <span style="color:red">**Android에서는 다르다.**</span>

![](../../../../images/2021/02/dimension.png)

### Dimensions.get('window')

위에 보이는 그림 1의 빨간색으로 표시된 부분을 포함하지 않고 영역을 추출한다.

### Dimensions.get('screen')

위에 보이는 그림 1의 빨간색으로 표시된 부분을 포함하고 영역을 추출한다.

## [참고]

-   https://stackoverflow.com/questions/44978804/whats-the-difference-between-window-and-screen-in-the-dimensions-api
