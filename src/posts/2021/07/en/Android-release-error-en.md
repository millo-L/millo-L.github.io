---
author: millo
title: "[Android] Runs with Debug version, but fails with Release version"
category: android
layout: post
released_at: 2021-07-29 23:50
updated_at:
image: ../../../../images/category/android.jpg
series: none
lang: en
tags:
    - Android
    - release
    - debug
    - proguard
is_private: false
translation: /Android-release-error
translation_series: none
description: "Occasionally, when testing Android in debug mode, it runs, but fails when it is released. Let's find out why."
---

# 1. Intro

Recently, there was a need to develop the sharing function through Kakao Talk on the Reaxt Native mobile app, which is the first open source called [react-native-kakao-share-link](https://www.npmjs.com/package/react-native-kakao-share-link) because there is no open source that works properly in the current app environment. iOS worked successfully in both debug mode and release mode after solving fewer issues in the previous post. The error occurred on Android. It worked perfectly in debug mode, but there was a problem in release mode. I write this post to help people with similar problems and to organize their hard work almost all day long.

# 2. Cause

In conclusion, the reason is that it does not proceed except for Kakao SDK when reducing, obfuscating, and optimizing code during app build (release mode). Android allows you to set up shrinking and optimization to reduce file size during app build (release), and obfuscation to reduce the risk of hacking. Of course, I set it up in the beginning because I wanted to use these good functions, but I followed the comments and did it without knowing exactly what it was. (~~It was really foolish.~~) Of course, I didn't know it was a code that I wrote, so I couldn't even dream that this would be a problem, and I kept on fixing the open source code that I made...

# 3. Solution

So what's the solution? Google, which made Android, also prepared for this part by making shrinking, obfuscation, and optimization functions, so the file 'proguard-rules.pro' was created. In most cases, Android SDKs specify progard settings for shrinking, obfuscation, and optimization, so you can refer to the official document settings for the SDK you are using.

## 3-1. Example(In my case)

The Kakao SDK was able to prevent shrinking, obfuscation, and optimization in release mode by adding two lines below.

```
// proguard-rules.pro

-keep class com.kakao.sdk.**.model.* { <fields>; }
-keep class * extends com.google.gson.TypeAdapter
```
