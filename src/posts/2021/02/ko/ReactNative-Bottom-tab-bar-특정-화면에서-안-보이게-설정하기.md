---
author: millo
title: "[React Native] Bottom tab bar 특정 화면에서 안 보이게 설정하기"
category: reactnative
layout: post
released_at: 2021-02-09 14:00
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - reactnative
    - bottom tab bar
    - tab bar hide
    - 바텀 탭바 숨기기
is_private: false
translation:
translation_series: none
description: React native에서 특정 화면에서만 Bottom tab bar가 보이지 않게 설정해보자.
---

# 1. 서론

지인의 스타트업 애플리케이션을 React Native로 제작해주다가 특정 화면에서만 바텀 탭 바가 사라지게 해야 하는 상황이 왔다. 공식 문서를 뒤져봐도 비슷한 코드는 있어도 내가 원하는 코드는 없고 여러 사이트들을 뒤지다가 해결 방법을 찾았다. 해당 사이트에서도 버전 차이 때문인지 문제가 생겨서 응용만 하고 디버깅하며 다시 코딩을 했다.

# 2. 개발 환경

> react-native @0.62.2 <br />
> typescript @4.0.3 <br />
> @react-navigation/native @5.7.4 <br />
> @react-navigation/stack @5.9.1 <br />
> @react-navigation/bottom-tabs @5.9.0

# 3. 구현 방법

내가 원하는 플로우는 stack navigation들로 bottom tab bar를 구성하고 특정 stack navigation에서 특정 화면으로 넘어갔을 때만 bottom tab bar가 사라지는 것이다.

아래의 코드에서 알 수 있듯이 bottom tab bar의 첫 번째 탭은 HomeTab이고 HomeTab은 스텍 내비게이션이다. 따라서, 특정 버튼을 누르면 다른 페이지가 렌더링 된다. 이때만 바텀 탭 바를 없애고 싶었는 데, 아래와 같이 options에 route라는 콜백을 받을 수 있고, 이 변수를 파라미터로 getVisibility 함수로 넘겨서 처리하면 된다. 더 자세한 사항은 디버깅을 해보면 알 수 있을 것이다.

아래의 getVisibility에서 selectedIndex는 내가 원하는 페이지가 HomeTab을 생성할 때 Stack.Navigator 안에 쌓인 순서이다. 나는 MathProblem이라는 스크린에서만 바텀 탭을 없앨 것이기 때문에 selectedIndex 값을 1로 줬다.

```tsx
const getVisibility = (route: any, selectedIndex: number) => {
    if (!route.state) return true
    let index = route.state.index
    if (index === selectedIndex) {
        return false
    }
    return true
}

const HomeTab = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="MathProblem" component={MathProblem} />
        </Stack.Navigator>
    )
}

const MainNavigator = () => {
    return (
        <BottomTab.Navigator tabBarOptions={{ showLabel: true }}>
            <BottomTab.Screen
                name="홈"
                component={HomeTab}
                options={({ route }) => ({
                    tabBarVisible: getVisibility(route, 1),
                    tabBarLabel: ({ focused }) => (
                        <BottomLabel
                            style={
                                focused
                                    ? { color: "#FF5050" }
                                    : { color: "gray" }
                            }
                        >
                            홈
                        </BottomLabel>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <BottomImage
                            source={
                                focused
                                    ? require("~/Assets/Images/Tabs/ic_home.png")
                                    : require("~/Assets/Images/Tabs/ic_home_outline.png")
                            }
                            style={
                                focused
                                    ? { tintColor: "#FF5050", marginTop: 5 }
                                    : { tintColor: "gray" }
                            }
                        />
                    ),
                })}
            />
            <BottomTab.Screen
                name="바텀1"
                component={MyCourseTab}
                options={{
                    tabBarLabel: ({ focused }) => (
                        <BottomLabel
                            style={
                                focused
                                    ? { color: "#FF5050" }
                                    : { color: "gray" }
                            }
                        >
                            바텀1
                        </BottomLabel>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <BottomImage
                            source={
                                focused
                                    ? require("~/Assets/Images/Tabs/ic_class.png")
                                    : require("~/Assets/Images/Tabs/ic_class_outline.png")
                            }
                            style={
                                focused
                                    ? { tintColor: "#FF5050", marginTop: 5 }
                                    : { tintColor: "gray" }
                            }
                        />
                    ),
                }}
            />
            <BottomTab.Screen
                name="바텀2"
                component={SelfStudyTab}
                options={{
                    tabBarLabel: ({ focused }) => (
                        <BottomLabel
                            style={
                                focused
                                    ? { color: "#FF5050" }
                                    : { color: "gray" }
                            }
                        >
                            바텀2
                        </BottomLabel>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <BottomImage
                            source={
                                focused
                                    ? require("~/Assets/Images/Tabs/ic_study.png")
                                    : require("~/Assets/Images/Tabs/ic_study_outline.png")
                            }
                            style={
                                focused
                                    ? { tintColor: "#FF5050", marginTop: 5 }
                                    : { tintColor: "gray" }
                            }
                        />
                    ),
                }}
            />
            <BottomTab.Screen
                name="바텀3"
                component={AnalysisTab}
                options={{
                    tabBarLabel: ({ focused }) => (
                        <BottomLabel
                            style={
                                focused
                                    ? { color: "#FF5050" }
                                    : { color: "gray" }
                            }
                        >
                            바텀3
                        </BottomLabel>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <BottomImage
                            source={
                                focused
                                    ? require("~/Assets/Images/Tabs/ic_analysis.png")
                                    : require("~/Assets/Images/Tabs/ic_analysis_outline.png")
                            }
                            style={
                                focused
                                    ? { tintColor: "#FF5050", marginTop: 5 }
                                    : { tintColor: "gray" }
                            }
                        />
                    ),
                }}
            />
            <BottomTab.Screen
                name="계정"
                component={MyPageTab}
                options={{
                    tabBarLabel: ({ focused }) => (
                        <BottomLabel
                            style={
                                focused
                                    ? { color: "#FF5050" }
                                    : { color: "gray" }
                            }
                        >
                            계정
                        </BottomLabel>
                    ),
                    tabBarIcon: ({ focused }) => (
                        <BottomImage
                            source={
                                focused
                                    ? require("~/Assets/Images/Tabs/ic_account.png")
                                    : require("~/Assets/Images/Tabs/ic_account_outline.png")
                            }
                            style={
                                focused
                                    ? { tintColor: "#FF5050", marginTop: 5 }
                                    : { tintColor: "gray" }
                            }
                        />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}

export default () => {
    return (
        <NavigationContainer>
            <MainNavigator />
        </NavigationContainer>
    )
}
```

# [참고]

-   https://stackoverflow.com/questions/51352081/react-navigation-how-to-hide-tabbar-from-inside-stack-navigation
