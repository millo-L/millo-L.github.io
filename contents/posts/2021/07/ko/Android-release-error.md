---
author: millo
title: "[Android] Debug 버전으로는 실행되는 데 Release Crash 나는 경우"
category: android
layout: post
released_at: 2021-07-23 13:00
updated_at:
image: ../../../../images/category/android.jpg
series: none
lang: ko
tags:
    - Android
    - release
    - debug
    - proguard
is_private: false
translation: /Android-release-error-en
translation_series: none
description: "간혹 안드로이드를 디버그 모드로 테스트할 때는 실행이 되는 데 릴리즈한 후 실행하면 실패하는 경우가 있다. 이런 이유에 대해 알아보자."
---

## 1. 서론

최근 앱 내 이벤트 관련하여 리액트 네이티브 환경에서 카카오톡으로 공유하기 기능을 개발할 일이 있었는 데, 현재 앱 환경에서 제대로 동작하는 오픈 소스가 존재하지 않아 [react-native-kakao-share-link](https://www.npmjs.com/package/react-native-kakao-share-link)라는 오픈 소스를 처음으로 만들게 됐다. iOS는 바로 전 포스팅에서 적은 문제를 해결한 후 디버그 모드와 릴리즈 모드 모두에서 성공적으로 작동했는 데 문제는 안드로이드였다. 디버그 모드에서는 완벽하게 작동했는 데 릴리즈 모드에서는 문제가 난 것이다. 거의 하루 종일 삽질한 내용을 정리해두는 겸, 그리고 비슷한 문제를 겪는 사람들에게 도움이 되고자 이 포스팅을 적는다.

## 2. 원인

결론부터 말하자면 원인은 앱 빌드(릴리즈) 시 코드 축소, 난독화, 최적화를 하는 경우, 카카오 SDK를 제외하고 진행하지 않아서이다. 안드로이드에서는 앱 빌드(릴리즈) 시에 파일 크기를 줄이기 위한 코드 축소와 최적화, 그리고 해킹의 위험을 줄이기 위한 난독화 과정을 설정할 수 있다. 물론, 나도 이 좋은 기능들을 이용하고 싶어서 초기에 설정해뒀었는 데, 사실 그 때는 이렇게 하면 좋다더라~ 하는 글들을 보고 따라서 한 것이지 정확히 무엇인지 모르고 진행했다.(~~정말 어리석었다고 할 수 있다.~~) 당연히 모르고 썼던 코드였기 때문에 이게 문제였을 거라고는 꿈도 못 꾼 채 내가 짠 오픈 소스 코드만 계속 수정하는 삽질을 반복했다...

## 3. 해결 방법

그래서 해결 방법은 무엇인가! 안드로이드를 만든 구글도 코드 축소, 최적화, 난독화 기능을 만들면서 당연히 이 부분을 대비했고, 그래서 만든 것이 `proguard-rules.pro` 파일이다. 대부분은 안드로이드 SDK들은 코드 축소, 최적화, 난독화를 방지하기 위해서 그에 관련한 프로가드 설정을 명시해두기 때문에 각자 사용하고 있는 SDK의 공식문서 설정 부분을 참고하면 될 것이다.

### 3-1. 예시(나의 경우)

카카오 SDK는 아래의 두 줄을 추가하는 것으로 릴리즈 모드에서의 코드 변형을 방지할 수 있었다.

```
// proguard-rules.pro

-keep class com.kakao.sdk.**.model.* { <fields>; }
-keep class * extends com.google.gson.TypeAdapter
```
