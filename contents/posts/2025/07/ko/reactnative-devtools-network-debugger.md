---
author: millo
title: "[React Native] Devtools에서 Network Debugger 사용하기"
category: reactnative
layout: post
released_at: 2025-07-12 12:30
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - ReactNative
    - devtools
    - network panel
    - network debugger
is_private: false
translation: 
translation_series:
description: react native devtools에서 network panel을 만들고 network 디버깅을 편하게 하자.
---

## 1. 근황

[뤼튼](https://wrtn.io/)에 React Native 개발자로 입사한지 3개월 정도 지났고, 수습기간도 무사히 마쳤다. 수습기간이라고 하지만 사실상 신규 프로젝트인 일본향 앱 [캬라푸](https://kyarapu.com)를 2개월 안에 혼자서 개발해야 했기 때문에 수습 기간 같지 않은 바쁜 날들이었다. 다행히 웹, 백엔드 개발자분들도 모두 많은 경력을 가진 신규 입사자여서 함께 고생하며 빠르게 친해질 수 있었고, 서로의 실력을 확인하면서 좋은 신뢰 관계를 쌓아가고 있다.

프로젝트가 마무리되고 현재는 서비스 안정화 단계에서 운영 업무를 하고 있는데, 개발 중에 계속 불편했던 네트워크 디버깅 문제가 해결되지 않고 있다. 사내 앱 챕터 전체적으로도 이를 해결할 만한 방법이 없어서, 아예 사내에서 공통으로 사용할 React Native용 네트워크 디버거를 새로 만들어보기로 했다.

### 1-1. 결과물 미리보기

![diagram](../../../../images/2025/07/preview.png)

## 2. 문제 상황

기존의 Flipper 디버거가 deprecated되고 React Native DevTools가 공식 디버거로 채택됐는데 가장 중요한 기능 중 하나인 네트워크 디버깅 기능이 부재했다.

### 2-1. 기존 문제점

1. **Flipper 지원 중단**: Flipper의 Network 플러그인이 더 이상 지원되지 않음
2. **DevTools Network 패널 부재**: 공식 DevTools에서 Network 패널이 아직 완전히 구현되지 않음
3. **로그 기반 디버깅의 한계**: 
   - 복잡한 API 호출 흐름 추적의 어려움
   - Request/Response 상세 정보 확인 불가
   - 실시간 네트워크 상태 모니터링 불가

### 2-2. 해결 방안

Chrome DevTools Protocol(CDP)을 활용하여 React Native DevTools에서 네트워크 패널을 구현하는 방법을 제안한다. 이는 Inspector Proxy를 통해 네트워크 데이터를 수집하고, CDP 이벤트를 통해 DevTools로 전달하는 구조다.

## 3. 기술적 구현

React Native DevTools는 Chrome DevTools Protocol(CDP)을 기반으로 동작한다. 네트워크 패널을 구현하기 위해서는 CDP의 Network 도메인을 활용하여 네트워크 이벤트를 수집하고 DevTools로 전달해야한다.

### 3-1. Chrome DevTools Protocol (CDP) 이해

CDP는 Chrome DevTools가 브라우저와 통신하기 위해 사용하는 프로토콜이다. WebSocket을 통해 JSON-RPC 2.0 메시지를 교환하며, 다양한 도메인(Network, Runtime, Debugger 등)으로 구분된다.

#### 3-1-1. Network 도메인 핵심 요소

**Methods (DevTools → Runtime)**
- `Network.enable`: 네트워크 이벤트 추적을 시작
- `Network.getResponseBody`: 특정 Request의 Response Body 가져오기

**Events (Runtime → DevTools)**
- `Network.requestWillBeSent`: 네트워크 요청이 시작될 때 발생
- `Network.responseReceived`: 응답 헤더가 수신될 때 발생  
- `Network.loadingFinished`: 요청이 성공적으로 완료될 때 발생
- `Network.loadingFailed`: 요청이 실패할 때 발생

#### 3-1-2. CDP 메시지 구조 (예시)

```json
// DevTools에서 Runtime으로 (Method 호출)
{
  "id": 1,
  "method": "Network.enable",
  "params": {}
}

// Runtime에서 DevTools로 (Event 발생)
{
  "method": "Network.requestWillBeSent",
  "params": {
    "requestId": "1234.1",
    "loaderId": "1234.1",
    "documentURL": "https://example.com",
    "request": {
      "url": "https://api.example.com/users",
      "method": "GET",
      "headers": {
        "Accept": "application/json"
      }
    },
    "timestamp": 1736686200.123456,
    "wallTime": 1736686200.123456
  }
}
```


### 3-2. Inspector Proxy 구조

React Native의 Inspector Proxy는 `@react-native/dev-middleware` 패키지에서 제공하는 핵심 모듈이다. Metro 서버와 함께 실행되며, DevTools와 디바이스 간의 통신을 중개하는 역할을 한다.

#### 3-2-1. Inspector Proxy의 역할

1. **Connection Management**: DevTools와 디바이스 간 WebSocket 연결 관리
2. **Message Routing**: CDP 메시지를 적절한 대상으로 라우팅
3. **Protocol Translation**: 필요시 디바이스의 네이티브 이벤트를 CDP 형식으로 변환

#### 3-2-2. 연결 구조

```
DevTools (Chrome) 
    ↕ (debuggerSocket)
Inspector Proxy (Metro Server)
    ↕ (deviceSocket) 
React Native App (Device/Simulator)
```


### 3-3. 네트워크 디버거 WebSocket 추가 (wrtnDebuggerWebsocket)

기존 Inspector Proxy의 debuggerSocket과 deviceSocket을 직접 활용하는 것은 여러 제약사항이 있다. 특히 다중 연결 환경에서의 안정성 문제를 해결하기 위해 Inspector Proxy 내에 별도의 WebSocket을 추가했다.

#### 3-3-1. 기존 방식의 문제점

1. **연결 충돌**: Inspector Proxy 내의 웹소켓이 1:1 연결 외에 1:n 형식으로 인스턴스가 동시에 연결될 때 메시지 라우팅 실패
2. **데이터 중복 전송**: 기존의 웹소켓을 사용하면 Device 또는 Devtools에 중복적인 데이터가 전달

#### 3-3-3. 개선된 아키텍처

```
DevTools (Chrome) 
    ↕ (debuggerSocket)
Inspector Proxy (Metro Server)
    ↕ (wrtnDebuggerSocket) 
Native Network Interceptor (아래 CustomNative)
```

![diagram](../../../../images/2025/07/devtools_diagram.png)

### 3-4. 네이티브 인터셉터 구현

필자는 네이티브 인터셉터 구조에 [토스](https://static.toss.im/slash24/QR/slash24-06.pdf)를 많이 참고했기 때문에, 네이티브 인터셉터는 토스를 참고하길 바란다.

## 4. 공식 Network 패널 개발 현황

React Native 팀에서 공식적으로 DevTools Network 패널을 개발하고 있다. Meta의 개발자인 [Huntie](https://github.com/huntie)형이 주도하고 있으며, 현재 상당한 진전을 보이고 있다.

### 4-1. 개발 지연 이유 분석

공식 Network 패널의 개발이 지연된 주요 원인은 React Native의 네트워크 아키텍처 변화와 관련이 있다

#### 4-1-1. 기존 아키텍처의 한계
- **플랫폼별 구현**: iOS는 `URLSession`, Android는 `OkHttp3`를 사용
- **인터셉터 복잡성**: 각 플랫폼마다 다른 네트워크 인터셉터 구현 필요
- **데이터 일관성**: 플랫폼 간 네트워크 데이터 형식 차이

#### 4-1-2. New Architecture의 해결책
React Native v0.80.0부터는 네트워크 처리가 C++ 레이어로 통합되었다

### 4-2. 공식 구현의 장점

1. **통합된 네트워크 처리**: C++ 레이어에서 모든 네트워크 요청을 처리
2. **성능 최적화**: 네이티브 레벨에서의 효율적인 데이터 수집
3. **일관된 인터페이스**: 플랫폼 간 동일한 네트워크 디버깅 경험

### 4-3. 릴리스 예정 시기

- **React Native v0.80.0+**: C++ 네트워크 인터셉터 기반 구조 완성
- **예상 릴리스**: 2025년 하반기 (React Native v0.81-0.82)
- **현재 상태**: [Huntie](https://github.com/huntie)형이 개발 중

## 5. 결론

React Native DevTools의 Network 패널 부재는 많은 개발자들이 겪고 있는 공통된 문제다. 이 문제를 해결하기 위해 Chrome DevTools Protocol을 활용한 커스텀 네트워크 디버거를 구현할 수 있으며, 주요 구현 포인트는 다음과 같다

### 5-1. 핵심 성과

1. **개발 생산성 향상**: 로그 기반 디버깅에서 시각적 네트워크 패널로 전환
2. **실시간 모니터링**: 네트워크 요청/응답의 실시간 추적 가능
3. **팀 전체 적용**: 라이브러리화를 통한 조직 차원의 문제 해결

### 5-2. 기술적 학습 포인트

- **CDP 이해**: Chrome DevTools Protocol의 구조와 활용 방법
- **Inspector Proxy**: React Native 디버깅 인프라의 핵심 구조
- **WebSocket 통신**: 실시간 양방향 통신 구현
- **데이터 변환**: 네이티브 데이터를 CDP 형식으로 변환하는 로직

### 5-3. 향후 전망

Meta에서 개발 중인 공식 Network 패널이 완성되면 더 나은 디버깅 경험을 제공할 것으로 예상된다. 하지만 현재 시점에서는 커스텀 구현이 유일한 대안이며, 이를 통해 React Native에서의 Devtools의 동작과 내부 구조를 더 깊이 이해할 수 있는 기회가 되었다.

## 참조 자료

- [Chrome DevTools Protocol - Network Domain](https://chromedevtools.github.io/devtools-protocol/tot/Network/)
- [Toss SLASH 24 - React Native 네트워크 디버깅](https://static.toss.im/slash24/QR/slash24-06.pdf)
- [@react-native/dev-middleware](https://www.npmjs.com/package/@react-native/dev-middleware)
- [@react-native/debugger-frontend](https://www.npmjs.com/package/@react-native/debugger-frontend)
- [Huntie GitHub Profile](https://github.com/huntie)