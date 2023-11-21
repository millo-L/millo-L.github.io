---
author: millo
title: "[Gatsby] Troubleshooting document is not defined build error"
category: gatsby
layout: post
released_at: 2021-02-27 09:20
updated_at:
image: ../../../../images/category/gatsby.jpg
series: none
lang: en
tags:
    - Gatsby
    - build error
    - document is not defined
is_private: false
translation: /Gatsby-build-error-document-is-not-defined-해결방법
translation_series: none
description: "Troubleshooting Gatsby document is not defined build error."
---

## 1. Introduction

Recently, when I moved from Tistory to Gatsby, I started developing blogs using Gatsby for the first time, and there were many difficulties. One of the most annoying issue was the "document is not defined" build error. I would like to share the solution I found for people who face the same problem as me.

## 2. Solution

Surprisingly, the solution is very simple. I used the document variable to get the scroll top of the screen. Of course, the document variable would exist in the browser environment, but I thought it was an error because Gatsby builder did not know whether it existed in the build, so I checked with exceptional treatment **whether the document variable existed or if the document type was defined.**

In terms of the code,

```tsx
if (typeof window === "undefined" || !window.document) {
    return;
}
```

In my case, I used it as below.

```tsx
const getScrollTop = () => {
    if (typeof window === "undefined" || !window.document) {
        return;
    }
    if (!document.body) return 0;
    const scrollTop = document.documentElement
        ? document.documentElement.scrollTop || document.body.scrollTop
        : document.body.scrollTop;
    return scrollTop;
};
```
