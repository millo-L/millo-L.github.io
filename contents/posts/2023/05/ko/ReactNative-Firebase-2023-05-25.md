---
author: millo
title: "[React Native] @react-native-firebase 적용하기 (pod install 에러 해결)"
category: reactnative
layout: post
released_at: 2023-05-25 15:30
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - ReactNative
    - Firebase
    - "@react-native-firebase"
is_private: false
translation: /ReactNative-Firebase-2023-05-25-en/
translation_series:
description: react native 앱에서 firebase 설치 시 pod install 오류를 해결해보자.
---

## 1. 서론

기존에 react native 0.63.4 버전으로 프로젝트들을 진행하다가 최근 구글 플레이 스토어의 안드로이드 sdk 버전 상향 조정으로 인한 이슈가 많았어서 아예 0.71.8 버전으로 업그레이드를 진행하게 됐다. 이 때 기타 라이브러리들도 업데이트를 진행하게 됐는데, react-native-firebase를 최신 버전으로 업데이트 하던 중 발생한 이슈를 해결한 방법을 정리하고자 이 글을 적는다.

## 2. 설치 방법

설치 방법 자체는 [공식 사이트](https://rnfirebase.io/)에 나와있는대로 진행하면 된다.

### [👋 잠깐] 개발 환경

> react-native 0.71.8 <br />
> @react-native-firebase/app 17.5.0 <br />

## 3. 해결 방법

중요한 부분은 [이 부분](https://rnfirebase.io/#altering-cocoapods-to-use-frameworks)인데 firebase-ios-sdk v9+ (react-native-firebase v15+) 버전 부터는 해당 링크의 아래 부분을 따라해야한다고 적혀있다. 하지만 이상하게도 그렇게 처리해도 에러가 계속해서 발생한다.

만약 아래의 방식대로 하지 않고, `pod 'GoogleUtilities', :modular_headers => true` 등을 추가하여 해결하려 하면, 설치 후 앱이 실행되기는 하지만 firebase가 제대로 실행되지 않는 이슈가 생기므로 꼭 아래의 방식으로 진행해야한다.

해결 방법은 `ios/Podfile` 파일에 아래의 코드를 추가하는 것이다.

```diff
## Podfile

## ...

target '{your project name}' do
  config = use_native_modules!

+  ## firebase
+  use_frameworks! :linkage => :static
+  $RNFirebaseAsStaticFramework = true

  ## Flags change depending on the env values.
  flags = get_default_flags()

  use_react_native!(
    :path => config[:reactNativePath],
    ## Hermes is now enabled by default. Disable by setting this flag to false.
    ## Upcoming versions of React Native may rely on get_default_flags(), but
    ## we make it explicit here to aid in the React Native upgrade process.
    :hermes_enabled => flags[:hermes_enabled],
    :fabric_enabled => flags[:fabric_enabled],
    ## Enables Flipper.
    #
    ## Note that if you have use_frameworks! enabled, Flipper will not work and
    ## you should disable the next line.
-    :flipper_configuration => flipper_config,
+    :flipper_configuration => FlipperConfiguration.disabled, ## firebase
    ## An absolute path to your application rosot.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  target '{your project name}Tests' do
    inherit! :complete
    ## Pods for testing
  end

  post_install do |installer|
    react_native_post_install(
      installer,
      ## Set `mac_catalyst_enabled` to `true` in order to apply patches
      ## necessary for Mac Catalyst builds
      :mac_catalyst_enabled => false
    )
    __apply_Xcode_12_5_M1_post_install_workaround(installer)

+    ## for Firebase (all below)
+    installer.pods_project.targets.each do |target|
+      target.build_configurations.each do |config|
+        config.build_settings["GCC_WARN_INHIBIT_ALL_WARNINGS"] = "YES"
+      end
+    end

+    installer.pods_project.targets.each do |target|
+      target.build_configurations.each do |config|
+        config.build_settings["CC"] = "clang"
+        config.build_settings["LD"] = "clang"
+        config.build_settings["CXX"] = "clang++"
+        config.build_settings["LDPLUSPLUS"] = "clang++"
+      end
+    end

+    installer.aggregate_targets.each do |aggregate_target|
+      aggregate_target.user_project.native_targets.each do |target|
+        target.build_configurations.each do |config|
+          config.build_settings['ONLY_ACTIVE_ARCH'] = 'YES'
+          config.build_settings['EXCLUDED_ARCHS'] = 'i386'
+        end
+      end
+      aggregate_target.user_project.save
+    end

+    installer.pods_project.targets.each do |target|
+      if (target.name.eql?('FBReactNativeSpec'))
+        target.build_phases.each do |build_phase|
+          if (build_phase.respond_to?(:name) && build_phase.name.eql?('[CP-User] Generate Specs'))
+            target.build_phases.move(build_phase, 0)
+          end
+        end
+      end
+    end

+    installer.pods_project.targets.each do |target|
+      target.build_configurations.each do |config|
+        config.build_settings["ENABLE_BITCODE"] = "NO"
+      end
+    end
  end
end

```