---
author: millo
title: "[React Native] Kakao Link를 사용해서 Deep link를 구현해보자."
category: reactnative
layout: post
released_at: 2021-09-05 20:45
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - ReactNative
    - iOS
    - Android
    - Kakao Link
    - Deep Link
    - react-native-kakao-share-link
    - react-navigation
is_private: false
translation:
translation_series: none
description: "react-native-kakako-share-link를 사용해서 딥링크를 구현해보자."
---

## 1. 서론

이번에 앱 내에 발달 놀이터라는 커뮤니티 형태의 기능이 들어가게 됐는 데, 이에 따른 공유하기 기능과 해당 공유를 눌렀을 경우 앱에서 해당 화면으로 바로 이동할 수 있게 하는 코드를 작성했다. 작업 도중 해당 기능을 구현하는 방식에 대해 공부하게 됐고, [react-navigation](https://reactnavigation.org/docs/deep-linking/)과 [react-native-kakao-share-link](https://www.npmjs.com/package/react-native-kakao-share-link)를 사용해서 구현했다. 크게 어려운 부분은 없고 해당 기능을 처음 사용해보는 사람들을 위해 포스팅을 작성한다.

## 2. Deep Link란?

자세한 설명은 [여기](https://help.dfinery.io/hc/ko/articles/360039757433-%EB%94%A5%EB%A7%81%ED%81%AC-Deeplink-URI%EC%8A%A4%ED%82%B4-%EC%9C%A0%EB%8B%88%EB%B2%84%EC%85%9C-%EB%A7%81%ED%81%AC-%EC%95%B1%EB%A7%81%ED%81%AC-%EA%B5%AC%EB%B6%84%EA%B3%BC-%EC%9D%B4%ED%95%B4)서 확인해보기 바란다.

간단하게 설명하자면 웹 브라우저 환경에서 DNS가 존재하는 것처럼 모바일 환경에서 특정 앱을 실행시키거나, 특정 앱의 특정 페이지로 이동시키는 주소 혹은 값이다. 방식에서는 크게 세 가지가 있다.

>    1. URI 스킴 방식: 앱에 URI 스킴(scheme) 등록해서 사용
>    2. 앱 링크(App Link): 도메인 주소를 등록해서 사용 (Android only)
>    3. 유니버셜 링크(Universal Link): 도메인 주소를 등록해서 사용 (iOS only)

### 2-1. URI 스킴 방식

URI 스킴 방식은 현재까지 가장 많이 사용하는 방식으로, 가장 초기에 나온 방식이며 앱에 scheme을 등록하는 형태로 각 앱을 구분한다. 방식은 Scheme://Path 형태이고 경우에 따라 query(?name=millo)가 붙기도 한다.

-   Scheme: 앱을 특정 (twitter)
-   Path: 앱 내 페이지를 특정 (트위터 내 특정 페이지)
-   query: 해당 페이지로 넘겨줄 값 (선택)

URI 스킴 방식은 완벽할까? 정답은 아니다. 그렇다면 뒤의 앱 링크와 유니버셜 링크는 세상에 나올 필요가 없었을 것이다. URI 스킴 방식의 가장 큰 단점은 무수히 많은 앱들이 생성됨에 따라 Scheme이 중복되는 문제이다. 현재 Scheme이 중복되는 지 검사할 수 있는 방식은 없다. 하지만, 매우 유니크하게 scheme을 생성한다면 딱히 문제가 될 것 같진 않다.

우리는 카카오 링크 기능을 기반으로 진행할 것이기 때문에, [여기](https://www.npmjs.com/package/react-native-kakao-share-link)에서 초기 설정을 마친 후 보기 바란다. 만약 카카오 링크 기능 사용 없이 딥링크만을 이해하고 싶다면 scheme과 host에 원하는 값을 넣으면 된다.

#### 1. Android 설정

위의 링크에서 설정을 마쳤다면 이미 아래의 설정을 진행했을 것이다. `./android/app/src/main/AndroidManifest.xml`에서 `kakao{카카오 네이티브 앱키}`가 Scheme이 되고, `kakaolink`가 Path가 된다. Scheme은 카카오 자체에서 URI 스킴이 겹치지 않게 랜덤으로 배정해주므로 중복될 걱정이 없다. 만약, 카카오 링크 없이 딥링크만을 원하면 아래의 `<data ~ />`에 원하는 값들을 집어넣으면 된다.

```diff
## ./android/app/src/main/AndroidManifest.xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.example">
    ...
+   <uses-permission android:name="android.permission.INTERNET" />
    ...
    <application
      ...
+     android:allowBackup="true"
      ...>
      <activity
      ...>
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
+       <intent-filter>
+           <action android:name="android.intent.action.VIEW" />
+           <category android:name="android.intent.category.DEFAULT" />
+           <category android:name="android.intent.category.BROWSABLE" />
+           <data android:host="kakaolink"
+                   android:scheme="kakao{카카오 네이티브 앱키}" />
        </intent-filter>
      </activity>
      <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
    </application>

</manifest>
```

#### 2. iOS 설정

iOS도 마찬가지로 위의 링크에서 진행했다면 이미 완료된 상태일 것이고, 카카오 링크를 사용하지 않는 다면 `./ios/{your-project-name}/Info.plist`의 해당하는 부분에 원하는 값들을 넣으면 된다. 여기서도 마찬가지로 Scheme은 `kakao{카카오 네이티브 앱키}`부분이고 Path는 아래의 `LSApplicationQueriesSchemes`의 `<string>kakaolink</string>`이다.

```diff
## ./ios/{your-project-name}/Info.plist

  <key>CFBundleURLTypes</key>
  <array>
+   <dict>
+     <key>CFBundleTypeRole</key>
+     <string>Editor</string>
+     <key>CFBundleURLSchemes</key>
+     <array>
+       <string>kakao{카카오 네이티브 앱키}</string>
+     </array>
+   </dict>
  </array>
  <key>CFBundleVersion</key>
  <string>1</string>
+ <key>KAKAO_APP_KEY</key>
+ <string>{카카오 네이티브 앱키}</string>
+ <key>LSApplicationQueriesSchemes</key>
+ <array>
+     <!-- 카카오링크 -->
+     <string>kakaolink</string>
+ </array>

```

### 2-2. 앱 링크와 유니버셜 링크

앱 링크와 유니버셜 링크는 위의 URI 스킴의 중복 문제를 해결하기 위해 고안됐지만, 사실상 사용할 수 있는 환경이 제공돼있지 않다. 자세한 설명은 [여기](https://help.dfinery.io/hc/ko/articles/360039757433-%EB%94%A5%EB%A7%81%ED%81%AC-Deeplink-URI%EC%8A%A4%ED%82%B4-%EC%9C%A0%EB%8B%88%EB%B2%84%EC%85%9C-%EB%A7%81%ED%81%AC-%EC%95%B1%EB%A7%81%ED%81%AC-%EA%B5%AC%EB%B6%84%EA%B3%BC-%EC%9D%B4%ED%95%B4)서 알아보도록 하자.

## 3. Deep Link 구현하기

위에서 말했듯 우리는 URI 스킴 방식을 사용할 것이므로 위의 설정을 했다고 가정하고 시작하겠다. 화면 전환이라는 것 자체가 react-navigation를 기반으로 하므로 실습에 필요한 모듈을 모두 설치해보자.

### 3-1. 모듈 설치

만약, 이미 설치되어 있는 모듈이 있다면 생략해도 된다. (거의 필수적으로 사용하는 모듈들이기 때문에 크게 문제는 없을 것 같다.) 카카오 링크는 [공식 문서](https://www.npmjs.com/package/react-native-kakao-share-link)를 보고 설치하기 바란다.

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-navigation/stack
cd ios
pod install
```

### 3-2. Navigator 구성

간단한 Stack 네비게이션을 구성해보자. 화면1과 화면1의 버튼을 누르면 이동할 수 있는 화면2로 구성해보자.

우선은 네비게이터를 먼저 만들어보자.

```tsx
// ./src/Navigator.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Screen1 from "./Screen1";
import Screen2 from "./Screen2";

export type NavigationParamList = {
    Screen1: undefined;
    Screen2: {
        test: string;
    };
};

const Stack = createStackNavigator<NavigationParamList>();

const Navigator = () => {
    return (
        <Stack.Navigator>
            <StackRouter.Screen name="Screen1" component={Screen1} />
            <StackRouter.Screen name="Screen2" component={Screen2} />
        </Stack.Navigator>
    );
};

export default Navigator;
```

화면1을 만들어보자.

```tsx
// ./src/Screen1.tsx
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationParamList } from "./Navigator";

type NavigationProp = StackNavigationProp<NavigationParamList, "Screen1">;

const Screen1 = () => {
    const navigation = useNavigation<NavigationProp>();
    const onPress = useCallback(
        () => navigation.navigate("Screen2", { test: "from Screen1" }),
        [navigation]
    );

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>스크린2로 이동</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: "90%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        textAlign: "center",
    },
});

export default Screen1;
```

화면2를 만들어보자. 버튼을 두 개로 구성하는 데 하나는 뒤로가는 버튼, 하나는 카카오톡으로 공유하기 버튼이다. 만약 Screen1에서 넘어온다면 `from Screen1`이라는 알림이 뜨고, 카카오톡 공유로 해당 페이지에 오게 되면 `from Kakao App`이라는 알림이 뜬다.

아래와 같이 ExecutionParams를 지정하게 되면 `kakao{카카오 네이티브 앱키}://kakaolink?text=from Kakao App` 형식으로 만들어지게 된다.

```tsx
// ./src/Screen2.tsx
import React, { useCallback, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import KakaoShareLink from "react-native-kakao-share-link";
import { useNavigation } from "@react-navigation/native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationParamList } from "./Navigator";

type NavigationProp = StackNavigationProp<NavigationParamList, "Screen2">;
type Screen2Route = RouteProp<NavigationParamList, "Screen2">;

const Screen2 = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<Screen2Route>();
    const { test } = route.params;
    const onPressBack = useCallback(() => navigation.goBack(), [navigation]);
    const onPressShare = useCallback(async () => {
        try {
            const response = await KakaoShareLink.sendText({
                text: "text",
                link: {
                    webUrl: "https://developers.kakao.com/",
                    mobileWebUrl: "https://developers.kakao.com/",
                },
                buttons: [
                    {
                        title: "앱에서 보기",
                        link: {
                            androidExecutionParams: [
                                { key: "test", value: "from Kakao App" },
                            ],
                            iosExecutionParams: [
                                { key: "test", value: "from Kakao App" },
                            ],
                        },
                    },
                ],
            });
            console.log(response);
        } catch (e) {
            console.error(e);
            console.error(e.message);
        }
    }, []);

    useEffect(() => {
        Alert.alert(test);
    }, [test]);

    return (
        <>
            <TouchableOpacity style={styles.button} onPress={onPressBack}>
                <Text style={styles.text}>뒤로가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onPressShare}>
                <Text style={styles.text}>카카오톡으로 공유하기</Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        width: "90%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        textAlign: "center",
    },
});

export default Screen2;
```

### 3-3. Link 연결

자세한 사항이 궁금하다면 [공식문서](https://reactnavigation.org/docs/deep-linking/)를 확인해보자.

`App.tsx`에서 Deep Link를 네비게이터에 연결해보자. 아래의 prefixes에 자신의 카카오 네이티브 앱키를 입력한다. 아래의 config에서는 해당 Path를 연결할 페이지를 선택한다.(여기서는 Screen2)

```tsx
// ./src/App.tsx

import React from "react";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import Navigator from "./Navigator";

const linking: LinkingOptions = {
    prefixes: ["kakao{카카오 네이티브 앱키}://"],
    config: {
        screens: {
            Screen2: "kakaolink",
        },
    },
};

const App = () => {
    return (
        <NavigationContainer linking={linking}>
            <Navigator />
        </NavigationContainer>
    );
};

export default App;
```

## 4. 실행

카카오톡이 설치되어 있는 기기에서 실행해서 테스트를 해보자.

## [참고]

-   https://help.dfinery.io/hc/ko/articles/360039757433-%EB%94%A5%EB%A7%81%ED%81%AC-Deeplink-URI%EC%8A%A4%ED%82%B4-%EC%9C%A0%EB%8B%88%EB%B2%84%EC%85%9C-%EB%A7%81%ED%81%AC-%EC%95%B1%EB%A7%81%ED%81%AC-%EA%B5%AC%EB%B6%84%EA%B3%BC-%EC%9D%B4%ED%95%B4
-   https://reactnavigation.org/docs/deep-linking/
-   https://www.npmjs.com/package/react-native-kakao-share-link
