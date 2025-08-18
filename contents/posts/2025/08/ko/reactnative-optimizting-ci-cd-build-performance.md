---
author: millo
title: "[React Native] CI/CD 툴(Bitrise)에서 빌드 시간 단축하기"
category: reactnative
layout: post
released_at: 2025-08-18 22:00
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - ReactNative
    - Bitrise
    - ci/cd
    - optimization
    - ccache
is_private: true
translation: /reactnative-optimizting-ci-cd-build-performance-en/ 
translation_series:
description: react native에서 빌드 시간을 단축해서 CI/CD 툴(Bitrise)에서 비용을 최소화 해보자!
---

## 1. 서론

[Network Debugger](/reactnative-devtools-network-debugger/) 개발과 [React Query 에러 처리](/reactquery-handle-suspense-error/) 개선을 마치고 나니, 이제 개발 환경 자체의 효율성에 눈이 가기 시작했다. 특히 CI/CD 파이프라인에서 빌드 시간이 너무 오래 걸리는 문제가 지속적으로 발목을 잡고 있었다.

뤼튼에서는 Bitrise를 CI/CD 툴로 사용하고 있는데, React Native 0.76.9 (Old Architecture) 기반의 프로젝트를 빌드할 때마다 Android는 15분, iOS는 20분 가까이 소요되고 있었다. 이는 단순히 시간 낭비를 넘어서 실질적인 비용 문제로 이어졌다. Bitrise는 빌드 시간에 따라 과금이 되는 구조이기 때문에, 빌드 시간을 단축하는 것은 곧 비용 절감과 직결된다.

### 1-1. 문제 상황

1. **긴 빌드 시간**: Android 평균 15분, iOS 평균 20분
2. **높은 CI/CD 비용**: 빌드 시간에 비례한 Bitrise 과금
3. **개발 속도 저하**: PR 테스트 및 배포 대기 시간 증가
4. **반복적인 의존성 설치**: 매번 처음부터 빌드하는 비효율성

## 2. Android 빌드 시간 단축

### 2-1. Android 빌드 단계 분석

React Native Android 빌드는 크게 다음 단계로 구성된다:

1. **의존성 다운로드** (npm/yarn install)
2. **Gradle 캐시 구성** 
3. **Java/Kotlin 컴파일** (React Native Core, Third-party 라이브러리)
4. **네이티브 C++ 컴파일** (React Native Core, Third-party 라이브러리)
5. **DEX 파일 생성**
6. **APK/AAB 패키징**

이 중에서 가장 시간이 오래 걸리는 부분은 **Java/Kotlin 컴파일**과 **네이티브 C++ 컴파일** 단계다. React Native 0.76.9에서는 여전히 많은 네이티브 코드가 C++로 작성되어 있어, 이 부분의 최적화가 핵심이다.

### 2-2. 시간 단축 가능한 부분

```yaml
# bitrise.yml - Android 최적화 전략
steps:
- activate-ssh-key@4:
    inputs:
    - verbose: true
- git-clone@8: {}

# 1. 의존성 캐시 복원
- cache-pull@2:
    inputs:
    - cache_paths: |
        node_modules
        ~/.gradle/caches
        ~/.gradle/wrapper
        android/.gradle

# 2. 의존성 설치 (캐시가 있으면 스킵)
- yarn@0:
    inputs:
    - command: install --frozen-lockfile

# 3. Gradle 래퍼 캐시
- script@1:
    title: Gradle Wrapper Cache
    inputs:
    - content: |
        #!/bin/bash
        cd android
        ./gradlew --version

# 4. Android 빌드
- android-build@1:
    inputs:
    - project_location: android
    - module: app
    - variant: release

# 5. 캐시 저장
- cache-push@2:
    inputs:
    - cache_paths: |
        node_modules
        ~/.gradle/caches
        ~/.gradle/wrapper
        android/.gradle
```

### 2-3. ccache 적용 시 변화 없는 이유

Android에서 ccache를 적용해봤지만 예상만큼의 성능 향상을 얻지 못했다. 그 이유를 분석해보니:

#### 2-3-1. 제한적인 C++ 컴파일 범위

React Native 0.76.9의 Old Architecture에서는 대부분의 네이티브 코드가 이미 사전 컴파일된 AAR(Android Archive) 형태로 제공된다. 실제로 ccache가 도움이 될 만한 C++ 컴파일 작업이 생각보다 많지 않았다.

```bash
# ccache 통계 확인
ccache -s
```

실제 캐시 히트율을 확인해보니 10% 미만이었고, 이는 우리 프로젝트에서 직접 컴파일하는 C++ 코드가 상대적으로 적기 때문이었다.

#### 2-3-2. Gradle 자체 캐시 메커니즘

Gradle은 이미 강력한 빌드 캐시 시스템을 가지고 있어, ccache와 중복되는 부분이 많다.

```gradle
// android/gradle.properties
org.gradle.caching=true
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.daemon=true
```

#### 2-3-3. CI 환경의 특수성

Bitrise와 같은 CI 환경에서는 매번 새로운 VM에서 빌드가 실행되기 때문에, ccache의 장점인 "이전 컴파일 결과 재사용"이 제대로 발휘되지 않는다.

### 2-4. 실제 성과

캐시 전략 적용 후 Android 빌드 시간이 **15분 → 8분**으로 약 47% 단축됐다.

## 3. iOS 빌드 시간 단축

### 3-1. iOS 빌드 단계 분석

React Native iOS 빌드는 다음과 같은 단계로 구성된다:

1. **CocoaPods 의존성 해결** (pod install)
2. **Xcode 프로젝트 구성**
3. **Swift/Objective-C 컴파일**
4. **React Native Core 컴파일** (C++)
5. **Third-party 라이브러리 컴파일** (C++)
6. **링킹 및 IPA 생성**

iOS는 Android와 달리 **CocoaPods를 통한 소스 기반 의존성**이 많아, C++ 컴파일 작업이 상당히 많다.

### 3-2. 캐시 전략

```yaml
# bitrise.yml - iOS 최적화 전략
steps:
- activate-ssh-key@4: {}
- git-clone@8: {}

# 1. 캐시 복원
- cache-pull@2:
    inputs:
    - cache_paths: |
        node_modules
        ios/Pods
        ~/Library/Caches/CocoaPods
        ~/Library/Developer/Xcode/DerivedData
        ~/.ccache

# 2. CocoaPods 캐시 설정
- cocoapods-install@2:
    inputs:
    - source_root_path: ios
    - podfile_path: ios/Podfile

# 3. ccache 설정
- script@1:
    title: Setup ccache
    inputs:
    - content: |
        #!/bin/bash
        export CCACHE_DIR=~/.ccache
        export CCACHE_MAXSIZE=2G
        export CC="ccache clang"
        export CXX="ccache clang++"
        
        # Xcode 빌드 설정에 ccache 적용
        echo 'CC=ccache clang' >> ios/Pods/Target\ Support\ Files/Pods-App/Pods-App.debug.xcconfig
        echo 'CXX=ccache clang++' >> ios/Pods/Target\ Support\ Files/Pods-App/Pods-App.debug.xcconfig

# 4. iOS 빌드
- xcode-archive@4:
    inputs:
    - project_path: ios/App.xcworkspace
    - scheme: App
    - configuration: Release

# 5. 캐시 저장
- cache-push@2:
    inputs:
    - cache_paths: |
        node_modules
        ios/Pods
        ~/Library/Caches/CocoaPods
        ~/Library/Developer/Xcode/DerivedData
        ~/.ccache
```

### 3-3. ccache가 Android보다 다이나믹한 이유

iOS에서는 Android와 달리 ccache가 훨씬 효과적이었다. 그 이유는:

#### 3-3-1. 소스 기반 의존성

CocoaPods는 대부분의 라이브러리를 소스 코드 형태로 가져와서 직접 컴파일한다. 이는 ccache가 빛을 발할 수 있는 완벽한 환경이다.

```ruby
# Podfile에서 확인할 수 있는 소스 기반 의존성들
pod 'React-Core', :path => '../node_modules/react-native/'
pod 'React-DevSupport', :path => '../node_modules/react-native/'
pod 'React-jsi', :path => '../node_modules/react-native/'
```

#### 3-3-2. 더 많은 C++ 코드

React Native의 iOS 버전은 JavaScript Core와의 브릿지, 네이티브 모듈 등에서 상당한 양의 C++ 코드를 컴파일한다.

```bash
# ccache 통계 확인 (iOS)
ccache -s
# cache hit rate: 78%  // 안드로이드 대비 8배 높은 캐시 히트율
```

#### 3-3-3. Xcode의 컴파일 특성

Xcode는 Clang을 사용하며, ccache와의 호환성이 뛰어나다. 특히 Incremental Build와 ccache가 조합될 때 시너지 효과가 크다.

### 3-4. 실제 성과

iOS 빌드 시간이 **20분 → 9분**으로 약 55% 단축됐다. ccache 적용 후에는 **9분 → 6분**으로 추가 33% 단축을 달성했다.

## 4. 결론

### 4-1. 핵심 성과

1. **Android**: 15분 → 8분 (47% 단축)
2. **iOS**: 20분 → 6분 (70% 단축)
3. **총 비용 절감**: 월 평균 60% 이상의 Bitrise 비용 절약
4. **개발 생산성**: PR 테스트 및 배포 대기 시간 대폭 단축

### 4-2. 기술적 학습 포인트

- **플랫폼별 빌드 특성 이해**: Android의 AAR 기반 vs iOS의 소스 기반 의존성
- **캐시 전략의 중요성**: 올바른 캐시 경로 설정이 성능에 미치는 영향
- **ccache 활용법**: 플랫폼별 ccache 효과성의 차이와 그 이유
- **CI/CD 최적화**: 빌드 시간 단축이 비용과 생산성에 미치는 직접적 영향

### 4-3. 향후 계획

React Native가 New Architecture로 완전히 전환되면 빌드 구조가 또 다시 바뀔 것이다. 하지만 이번 최적화 경험을 통해 얻은 원리와 방법론은 앞으로도 충분히 활용할 수 있을 것이라 생각한다.

## 5. 개인적 생각

단순히 "빌드가 오래 걸린다"는 불편함에서 시작했지만, 실제로 분석해보니 플랫폼별 빌드 시스템의 근본적인 차이점을 깊이 이해할 수 있는 좋은 기회였다. 특히 Android의 Gradle과 iOS의 Xcode가 각각 어떤 철학으로 설계되었는지, 그리고 그것이 실제 개발 워크플로우에 어떤 영향을 미치는지 몸소 체험할 수 있었다.

무엇보다 "개발자의 시간"이 얼마나 소중한지 다시 한번 깨달았다. 8분 vs 20분은 단순히 12분의 차이가 아니라, 집중력의 연속성과 개발 플로우에 결정적인 영향을 미친다. 앞으로도 이런 작은 최적화들이 누적되어 더 나은 개발 경험을 만들어갈 수 있을 것이라 기대한다.

## 참조 자료

- [Bitrise Build Cache Documentation](https://devcenter.bitrise.io/en/builds/build-cache.html)
- [Android Gradle Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)
- [ccache Manual](https://ccache.dev/manual/4.8.html)
- [CocoaPods Performance Tips](https://guides.cocoapods.org/using/using-cocoapods.html)
- [Xcode Build Settings Reference](https://developer.apple.com/documentation/xcode/build-settings-reference)
