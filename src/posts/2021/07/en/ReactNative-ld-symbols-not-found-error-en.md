---
author: millo
title: "[React Native] Troubleshooting ld: symbol(s) not found for architecture x86_64"
category: reactnative
layout: post
released_at: 2021-07-29 23:10
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: en
tags:
    - ReactNative
    - iOS
    - error
    - x86_64
is_private: false
translation: /ReactNative-ld-symbols-not-found-error
translation_series: none
description: "Let's find out how to resolve the error ld: symbol(s) not found for architecture x86_64 when running react native ios."
---

# 1. Intro

This time, the company had to develop a Kakao Link function for the marketing event, but the existing open sources did not work properly, so it developed a new open source. Android worked well, and the problem was iOS, but the error "ld: symbol(s) not found for architecture x86_64" kept coming out and I thought my head was going to explode... I write a posting to see if anyone suffers from the same problem as me.

# 2. Cause

In my case, I developed this open source based on Kakao SDK v2, so Android developed it as kotlin and iOS as swift, which is expected to be the cause of this error because it felt like a version error when building swift. I opened all the existing modules, but it was written in objective-c, not swift, so I thought it would be a swift problem and approached the problem solving.

# 3. Solution

I've done this and that. Thinking that the newly created module might be a problem, I tried specifying the swift compilation version in the module's spec file, and changed the module settings by turning on Xcode. But nothing has been solved... Then I found two swift versions of Xcode.

So the solution I found was really simple.

Xcode -> Build Settings -> Search Paths -> Library Search Paths -> Delete <span style="color:red">"\$(TOOLCHAIN_DIR)/usr/lib/swift-5.0/$(PLATFORM_NAME)"</span>

Like a lie, the error disappeared and was immediately implemented. Of course, this solution may not work for a different reason than me, but I write a posting hoping it will be solved.
