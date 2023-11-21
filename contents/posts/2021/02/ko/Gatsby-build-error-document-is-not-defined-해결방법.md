---
author: millo
title: "[Gatsby] document is not defined build error 해결 방법"
category: gatsby
layout: post
released_at: 2021-02-27 09:01
updated_at:
image: ../../../../images/category/gatsby.jpg
series: none
lang: ko
tags:
    - Gatsby
    - build error
    - document is not defined
is_private: false
translation: /Troubleshooting-Gatsby-build-error-document-is-not-defined
translation_series: none
description: "Gatsby  document is not defined build error 해결하기."
---

## 1. 서론

최근에 tistory에서 Gatsby로 블로그를 옮기면서 처음으로 gatsby를 사용해서 블로그를 개발하기 시작했는 데 여러 가지 난관이 있었다. 그 중 가장 짜증났던 상황이 바로 "document is not defined" 빌드 오류였다. 나와 같은 문제에 직면한 사람들을 위해 내가 찾은 해결 방법을 공유하고자 한다.

## 2. 해결방법

의외로 해결방법은 매우 간단하다. 나는 document 변수를 화면의 scroll top을 가져오는 데 사용했다. 물론 브라우저 환경에서 당연히 document 변수는 존재하겠지만, 빌드 시에는 이 변수의 존재 여부를 알 수 없기 때문에 나오는 오류라고 생각했고, 따라서 **document 변수가 존재하는 지**, 그리고 **document의 타입이 정의되어 있는 지** 여부를 예외처리로 확인했다.

코드로 보면 아래와 같다.

```tsx
if (typeof window === "undefined" || !window.document) {
    return;
}
```

나의 경우 아래와 같이 사용했다.

```tsx
const getScrollTop = () => {
    if (typeof window === "undefined" || !window.document) {
        return 0;
    }
    if (!document.body) return 0;
    const scrollTop = document.documentElement
        ? document.documentElement.scrollTop || document.body.scrollTop
        : document.body.scrollTop;
    return scrollTop;
};
```
