---
author: millo
title: "[React Native] ld: symbol(s) not found for architecture x86_64 해결방법"
category: reactnative
layout: post
released_at: 2021-07-18 23:01
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - ReactNative
    - iOS
    - error
    - x86_64
is_private: false
translation: /ReactNative-ld-symbols-not-found-error-en
translation_series: none
description: "react native ios 실행 시 ld: symbol(s) not found for architecture x86_64 오류에 대한 해결방법에 대해 알아보자."
---

# 1. 서론

이번에 회사에서 이벤트를 위한 카카오 링크(공유) 기능을 개발해야 했는 데, 기존에 있던 오픈 소스들이 제대로 작동하지 않아서 새로 오픈 소스를 개발했다. 안드로이드는 잘 작동됐고, 문제는 iOS 였는 데 계속 "ld: symbol(s) not found for architecture x86_64" 오류가 나와서 정말 머리가 터져버리는 줄 알았다... 혹시나 나와 같은 문제를 가지고 고통받는 사람이 있을까 포스팅을 작성한다.

# 2. 원인

나의 경우 이번 오픈 소스를 kakao sdk v2를 기반으로 개발했기 때문에, 안드로이드는 kotlin으로 iOS는 swift로 개발했는 데, 이 오류가 생성된 원인으로 예상되는 것은 swift를 빌드할 때 버전 상 오류로 느껴졌다. 기존에 사용하는 모듈들을 다 뜯어봤는 데, swift가 아닌 objective-c로 모두 작성되어 있어서 뭔가 swift 문제겠거니 지레 짐작하고 문제 해결에 대해 접근해봤다.

# 3. 해결 방법

정말 이래저래 다 해봤다. 새로 만든 모듈이 문제일까 싶어 모듈의 스펙파일에 swift 컴파일 버전을 적어도 보고, Xcode를 켜서 모듈 설정을 변경도 해보고 다 해봤는 데 아무것도 해결되지 않았을 무렵... Xcode의 swift 버전이 두 개인 것을 발견했다.

그래서 찾은 해결방법은 정말 간단했다.

Xcode -> Build Settings -> Search Paths -> Library Search Paths 에서 <span style="color:red">"\$(TOOLCHAIN_DIR)/usr/lib/swift-5.0/$(PLATFORM_NAME)"</span> 를 제거하면 된다.

정말 거짓말처럼 오류가 사라지고 바로 실행됐다... 물론 나와 다른 원인으로 이 해결 방법이 통하지 않을 수 있지만, 해결된다면 좋겠다는 마음으로 포스팅을 적는다.

# 4. 홍보

만약 Kakao Link(카카오톡으로 공유하기) 기능을 react native 환경에서 사용할 일이 있으면 [여기](https://www.npmjs.com/package/react-native-kakao-share-link)로 들어와서 사용해주길 바란다.

## 제약 조건

아래의 제약 조건은 kakao sdk v2를 사용하기 위한 제약 조건이므로 이번에 개발한 모듈도 물론 아래의 규칙을 지켜야만했다... 내가 개발하는 소프트웨어는 이미 저 범위 안에 있어서 이렇게 개발하게 됐다.

-   iOS 11.0 이상
-   Android Gradle 3.6.1 이상
-   Android minSdkVersion 19 이상
