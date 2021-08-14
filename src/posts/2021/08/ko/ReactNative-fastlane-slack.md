---
author: millo
title: "[React Native] Fastlane Slack 연동"
category: reactnative
layout: post
released_at: 2021-08-14 17:35
updated_at:
image: ../../../../images/category/reactnative.png
series: React Native 배포 자동화
lang: ko
tags:
    - ReactNative
    - Fastlane
    - Slack
is_private: false
translation:
translation_series: none
description: "Fastlane에 Slack을 연동해서 배포 단계에 대한 알림을 설정해보자."
---

# 1. 서론

Fastlane을 사용해서 배포 자동화를 수행하게 되면 React Native를 매우 수월하게 각각의 스토어(App Store, Play Store)에 배포할 수 있다. 로컬 환경에서 Fastlane을 구동하게 되면 배포 과정이 어느 정도 진행됐는 지를 터미널에 찍히는 로그들로 알 수 있지만, 원격 서버에서 Fastlane을 사용하게 되면 진행 상황에 대한 정보를 얻기가 쉽지 않다. 이를 위해서는 Slack 또는 이메일 연동을 진행해야 하는 데, 이미 사내에서 쓰고 있는 Slack을 선택하게 됐다.

# 2. 방법

방법은 매우 간단하다. Slack에서 원하는 채널을 선택해서 Webhook을 설정하고, 해당 url을 통해서 요청을 보내면 해당 메세지가 전달되는 방식이다.

https://my.slack.com/services/new/incoming-webhook/ 에 들어가서 아래의 설정을 시작한다.

## 2-1. Slack Webhook 설정

위의 url로 접근하면 이런 페이지가 나온다. 원하는 채널을 선택하고 `Add Incomming WebHooks integration`버튼을 누른다.

![](../../../../images/2021/08/fastlane-slack-1.png)

이 페이지에서는 Webhook 요청에 대한 설명들이 나와있다. 쭉 읽어봐도 좋지만, Fastlane에서는 이미 Slack 형식에 맞게 함수가 준비되어 있으므로 우리는 아래의 Webhook URL만을 복사해두고 `Save Settings`버튼을 누르도록 하자.

![](../../../../images/2021/08/fastlane-slack-2.png)

## 2-2. Fastlane에 적용

적용하는 방식은 iOS와 Android 모두에서 동일하므로 지난 번 포스팅에서 만든 iOS용 Fastfile에 적용해보도록 하겠다.

### 1. before_all 처리

before_all 전처리 함수를 통해서 모든 단계 시작 전 환경변수로 아까 복사해둔 Webhook URL을 설정해둔다.

```ruby
  before_all do
    ENV["SLACK_URL"] = "https://hooks.slack.com/services/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"
  end
```

### 2. after_all 처리

after_all 후처리 함수를 통해서 모든 단계가 종료된 후 Slack으로 메세지를 보낸다. messge 부분에 알림 받고 싶은 메세지를 작성하면 된다. slack 함수의 성공 여부는 default가 true 이다. 만약, false로 변경하면 슬랙 알림에서 왼쪽 바가 빨강색으로 칠해진다.

```ruby
  after_all do |lane|
    slack(message: "Successfully deployed iOS App")
  end
```

### 3. error 처리

단계 실행 중 에러가 발생하면 exception.message로 어떤 에러인지 Slack을 통해 전송할 수 있다.

```ruby
  error do |lane, exception|
    slack(
      message: exception.message,
      success: false
    )
  end
```

### 4. Slack 적용

이제 내부 함수들이 실행되기 전 알림을 원하는 자리에 slack 함수를 사용하면 된다.

```ruby
  desc "Push a new beta build to TestFlight"
  lane :beta do |options|
    slack(message: "Fastlane start iOS Code Signing")
    sync_code_signing(
      type: "appstore",
      app_identifier: 'com.friggs.DoctorI',
      readonly: true
    )

    slack(message: "Fastlane start iOS Build")
    updateVersion(options)

    increment_build_number(xcodeproj: "DoctorIApp.xcodeproj")
    build_app(workspace: "DoctorIApp.xcworkspace", scheme: "DoctorIApp")

    slack(message: "Fastlane start iOS Release")
    upload_to_testflight
  end
```

### 5. 전체 코드

iOS용 Fastfile 전체 코드이므로 참고하기 바란다.

```ruby
default_platform(:ios)

platform :ios do
  before_all do
    ENV["SLACK_URL"] = "https://hooks.slack.com/services/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"
  end

  after_all do |lane|
    slack(message: "Successfully deployed iOS App")
  end

  error do |lane, exception|
    slack(
      message: exception.message,
      success: false
    )
  end

  def updateVersion(options)
    if options[:version]
      version = options[:version]
    else
      version = prompt(text: "Enter the version type or specific version\n(major, minor, patch or 1.0.0): ")
    end

    re = /\d+.\d+.\d+/
    versionNum = version[re, 0]

    if (versionNum)
      increment_version_number(
        version_number: versionNum
      )
    elsif (version == 'major' || version == 'minor' || version == 'patch')
      increment_version_number(
        bump_type: version
      )
    else
      UI.user_error!("[ERROR] Wrong version!!!!!!")
    end
  end

  desc "Push a new beta build to TestFlight"
  lane :beta do |options|
    slack(message: "Fastlane start iOS Code Signing")
    sync_code_signing(
      type: "appstore",
      app_identifier: 'com.friggs.DoctorI',
      readonly: true
    )

    slack(message: "Fastlane start iOS Build")
    updateVersion(options)

    increment_build_number(xcodeproj: "DoctorIApp.xcodeproj")
    build_app(workspace: "DoctorIApp.xcworkspace", scheme: "DoctorIApp")

    slack(message: "Fastlane start iOS Release")
    upload_to_testflight
  end
end
```

# [참고]

-   https://docs.fastlane.tools/actions/slack/
-   https://slack.com/intl/en-kr/help/articles/115005265063-Incoming-webhooks-for-Slack
