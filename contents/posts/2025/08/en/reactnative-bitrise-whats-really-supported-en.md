---
author: millo
title: "[React Native] Bitrise, What’s Really Supported (and What’s Not)"
category: reactnative
layout: post
released_at: 2025-08-18 22:00
updated_at:
image: ../../../../images/category/reactnative.png
series: Optimizing React Native Build Times on Bitrise
lang: en
tags:
    - ReactNative
    - Bitrise
    - ci/cd
    - optimization
is_private: false
translation: /reactnative-bitrise-whats-really-supported/ 
translation_series:
description: Exploring the limitations of Bitrise's default caching support and how we reduced React Native build times from 26 minutes to 7-11 minutes through custom caching solutions
---

## 1. Introduction

After completing the development of [Network Debugger](/reactnative-devtools-network-debugger/) and improving [React Query error handling](/reactquery-handle-suspense-error/), I started focusing on the efficiency of the development environment itself. In particular, the problem of excessively long build times in CI/CD pipelines was continuously holding us back.

<br />

At Wrtn, we use Bitrise as our CI/CD tool, and building React Native 0.76.9 (Old Architecture) based projects was taking about `26 minutes each for Android and iOS`. This led to not just time waste, but actual cost issues. Since Bitrise charges based on build time, reducing build time directly translates to cost savings.

Other app teams besides Kyrapu were also experiencing discomfort with build times and costs, so we started working on Bitrise performance improvements under the leadership of Wontaek, a native (iOS/Android) SDK developer.

<br />

To cut to the conclusion, we were able to reduce build times to `11 minutes for Android (about 58% reduction)` and `7 minutes for iOS (about 73% reduction)` based on cached state.

### [Hold on a moment 👋]

To avoid any misunderstanding, let me first say that Bitrise is a very powerful CI/CD tool that allows you to visually build workflows and pipelines beyond just editing yaml files. I'm merely pointing out some issues, not denying this fact. In fact, Wrtn has achieved build time reduction and continues to use Bitrise.

## 2. Disappointing Aspects of Bitrise's Provided Caching Steps

While it may not be fair to call them problems since there are alternative solutions (enhancing the basic caching steps provided by Bitrise), these are issues with officially supported workflow steps that lack support for certain areas.

### 2-1. Yarn Berry Caching Compatibility Issues

> **Caching Target**
>
> npm/yarn classic - `{project_folder}/node_modules/`
>
> yarn berry - `{project_folder}/.yarn/cache/`

<br />

![diagram](../../../../images/2025/08/bitrise_npm_cache.png)

<br />

The steps above are officially supported npm/yarn caching steps in Bitrise. However, they don't work properly with yarn berry (versions above yarn classic 1.x.x) because the caching file path is restricted to `node_modules`.

At Wrtn, we use yarn berry across all projects, and since the files that need to be cached for yarn berry and npm/yarn classic are distinctly different, separate work was required.

### 2-2. Absence of Android Build Caching

For Android, incremental builds are possible even in CI environments. However, there are no officially supported caching steps for this. While features for caching gradle configuration or SDK exist, these alone couldn't improve build time, which takes up the largest portion of runtime.

<br />

Bitrise offers paid build optimization as shown below. However, I think if direct improvement is possible, there's no need to use the paid service. Of course, since each team's situation is different, quick optimization through additional payment can be a great help when there's no time to spare.

<br />

![diagram](../../../../images/2025/08/bitrise_android_build_cache.png)

## 3. Applicable Caching Solutions

![diagram](../../../../images/2025/08/bitrise_cache.png)

<br />

Bitrise provides the step shown above that archives and caches files in specific `paths` based on a `cache key`. Using this, we can apply various types of caching.

1. yarn berry caching
2. android configuration, gradle, build caching
3. ios cocoapods caching
4. gem bundle caching for fastlane
5. cpp compilation caching with ccache

We implemented these 5 types of caching in total. I'll cover the detailed implementation of each in the next post.

## Conclusion

What seems to always be important for developers is an accurate definition of the problem. Often, due to familiarity, we lose the will to improve or simply accept inefficient situations as they are. I once again realized that the parts we might hit against the wall of reality or simply accept as natural - like saying `"service development comes first~"` or `"that's just a task that naturally takes a long time~"` - can become differentiating factors.

<br />

I thought that if we look for these pain points not just in the realm of development, but in our lives, we could achieve better results as developers, as team members, and even in our personal businesses.