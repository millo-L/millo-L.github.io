---
author: millo
title: "[Network] Differences between URI and URL"
category: network
layout: post
released_at: 2021-03-03 11:48
updated_at:
image: ../../../../images/category/network.jpg
series: none
lang: en
tags:
    - URL
    - URI
    - URL and URI
is_private: false
translation: /URI와-URL의-차이점/
translation_series:
description: What's the difference between a URL and a URI? Let's find out when and what to use.
---

## 1. Introduction

Recently, I have been reading a lot of network-related web documents or books, and I write a posting to organize it once because it is so confusing to call it a URL in some parts and URI in others. When looking at it without knowing it, it seems to be similar in shape, but I wonder what the difference is. From now on, let's find out the difference clearly.

## 2. What is URI(Uniform Resource Identifier)?

> **Uniform Resource Identifier (URI)** <br /> &nbsp;consists of a string of characters used to identify or name a resource on the Internet

## 3. What is URL(Uniform Resource Locator)?

> **Uniform Resource Locator (URL)** <br /> &nbsp;colloquially termed a web address, is a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it.

#### Most importantly, <span style="color:red">the URL is included in the URI.</span>

![](../../../../images/2021/02/url.jpg)

## 4. Example of separating URI and URL

1.  https://example.io is a <span style="color:blue">**URL and URI**</span> because it represents a server named https://example.io.

2.  https://example.io/images is a <span style="color:blue">**URL and URI**</span> because it refers to the location of resources on the network called images on the example.io server.

3.  https://example.io/images/dog.jpeg is a <span style="color:blue">**URL and URI**</span> because it points to dog.jpeg under the images directory on the example.io server.

4.  For https://example.io/user/123, the URL is https://example.io/user and includes identifier 123 to reach the desired information, which is a URI. In other words, it is a <span style="color:red">**URI but not a URL.**</span>

5.  https://example.io/profile?id=11 is also a URL to https://example.io/profile, but includes an identifier ( ?id=11) to reach the desired information, which is a URI. In other words, it is a <span style="color:red">**URI but not a URL.**</span>

## [References]

-   https://en.wikipedia.org/wiki/URL
-   https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
-   https://medium.com/@js230023/url-%EA%B3%BC-uri%EC%9D%98-%EC%B0%A8%EC%9D%B4-154d70814d2a
-   https://lambdaexp.tistory.com/39#:~:text=URI%EB%8A%94%20%EC%9D%B8%ED%84%B0%EB%84%B7%20%EC%83%81%EC%9D%98%20%EC%9E%90%EC%9B%90,%EC%9C%BC%EB%A1%9C%20%ED%95%B4%EC%84%9D%20%EB%90%A0%20%EC%88%98%20%EC%9E%88%EA%B2%A0%EB%8B%A4.&text=URI%EC%9D%98%20%ED%95%9C%20%ED%98%95%ED%83%9C%EC%9D%B8,%EC%9D%84%20%ED%8F%AC%ED%95%A8%20%ED%95%98%EB%8A%94%20%EA%B0%9C%EB%85%90%EC%9D%B4%EB%8B%A4.
-   https://dev.to/flippedcoding/what-is-the-difference-between-a-uri-and-a-url-4455
