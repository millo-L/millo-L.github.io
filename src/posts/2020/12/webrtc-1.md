---
author: millo
title: WebRTC 이론 정리하기
category: webrtc
path: /webrtc/1
layout: post
released_at: 2020-12-22 17:00
updated_at: 2020-12-22 17:01
image: ../../../images/webrtc.png
series: WebRTC 이론부터 실전까지
slug: WebRTC 이론 정리하기
lang: ko
tags:
    - ICE
    - SDP
    - STUN
    - TURN
    - WebRTC
    - NAT
is_private: false
description: WebRTC 이론 정리하기
---

# 1. WebRTC란 무엇일까?

-   WebRTC(Web Real-Time Communication)란 웹 브라우저 환경 및 Android, IOS 애플리케이션에서도 사용 가능한 비디오, 음성 및 일반 데이터가 **피어간**에 **실시간**으로 전송되도록 지원하는 **오픈 소스**이다.
-   공개 **웹 표준으로 구현**되며 모든 주요 브라우저에서 일반 JavaScript API로 제공한다. (Apple, Google, Microsoft 및 Mozilla가 지원)

# 2. WebRTC의 기술 및 프로토콜 소개

## 2-1. ICE(Interactive Connectivity Establishment)

-   브라우저가 **peer를 통한 연결이 가능하도록 해주는 프레임 워크**이다.
-   **peer간 단순 연결 시 작동하지 않는 이유들**
-   연결을 시도하는 **방화벽**을 통과해야 함
-   **단말에 Public IP가 없다**면 유일한 주소값을 할당해야 한다.
-   **라우터가 peer간의 직접 연결을 허용하지 않을 때** 데이터를 릴레이해야 하는 경우
-   ICE는 위의 작업들을 수행하기 위해 **STUN**과 **TURN** 서버 **둘 다 혹은 하나**의 서버를 사용한다.

## 2-2. STUN(Session Traversal Utilities for NAT) 서버

-   **클라이언트 자신의 Public Address(IP:PORT)를 알려준다.**
-   peer간의 직접 연결을 막는 등의 라우터의 제한을 결정하는 프로토콜 (현재 **다른 peer가 접근 가능하지 여부** 결정)
-   클라이언트는 인터넷을 통해 **클라이언트의 Public Address**와 **라우터의 NAT 뒤에 있는 클라이언트가 접근 가능한지에 대한 답변**을 STUN서버에 요청한다.

![](https://images.velog.io/images/seung3837/post/c9e7972f-96fa-423c-a001-fc631d82a0f0/webrtc-stun.png)

## 2-3. NAT(Network Address Transilation)

-   단말에 공개 IP(Public IP) 주소를 할당하기 위해 사용한다.
-   라우터는 공개 IP 주소를 갖고 있고 모든 단말들은 라우터에 연결되어 있으며 비공개 IP주소(Private IP Address)를 갖는다.
-   요청은 단말의 비공개 주소로부터 라우터의 공개 주소와 유일한 포트를 기반으로 번역한다. 이 덕분에, **각각의 단말이 유일한 공개 IP 없이 인터넷 상에서 검색 가능하다.**
-   몇몇의 라우터들은 **Symmetric NAT**이라고 불리우는 **제한을 위한 NAT**을 채용한다. 즉, **peer들이 오직 이전에 연결한 적 있는 연결들만 허용**한다. 따라서 **STUN서버에 의해 공개 IP주소를 발견한다고 해도 모두가 연결을 할수 있다는 것은 아니다.** (위의 설명에서 STUN 서버에 다른 peer가 접근 가능한지 여부를 요청하는 이유)
-   **이를 위해 TURN이 필요하다.**

## 2-4. TURN(Traversal Using Relays around NAT) 서버

-   **TURN 서버와 연결하고 모든 정보를 그 서버에 전달**하는 것으로 **Symmetric NAT 제한을 우회**하는 것을 의미한다.
-   이를 위해 **TURN 서버와 연결**을 한 후 **모든 peer들에게 저 서버에 모든 패킷을 보내고 다시 나(TURN서버)에게 전달**해달라고 해야 한다.
-   명백히 **오버헤드가 발생**하므로 이 방법은 다른 **대안이 없을 경우만 사용**해야 한다.

![](https://images.velog.io/images/seung3837/post/ff184453-7eb6-4bd5-945f-36df91cf6763/webrtc-turn.png)

-   #### SDP(Session Description Protocol)
    -   해상도나 형식, 코덱, 암호화등의 멀티미디어 컨텐츠의 연결을 설명하기 위한 표준이다.
    -   두 개의 peer가 다른 한쪽이 **데이터가 전송되고 있다는 것을 알게 해준다.**
    -   기본적으로 미디어 컨텐츠 자체가 아닌 **컨텐츠에 대한 메타데이터 설명**이다.
    -   **기술적으로 보자면 SDP 는 프로토콜이 아니다.** 그러나 데이터 포멧은 **디바이스간의 미디어를 공유하기 위한 연결을 설명하기 위해 사용**한다.

# 3. Next Post is...

-   [WebRTC의 구현 방식(P2P, SFU, MCU)](https://velog.io/@seung3837/WebRTC-%EA%B5%AC%ED%98%84-%EB%B0%A9%EC%8B%9D)
-   [React.js with Typescript로 1:1 peer to peer WebRTC 구현하기](https://velog.io/@seung3837/WebRTC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B011-P2P)
-   [React.js with Typescript로 1:N peer to peer WebRTC 구현하기](https://velog.io/@seung3837/WebRTC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B01N-P2P)

# [참고]

-   https://webrtc.org/
-   https://developer.mozilla.org/ko/docs/Web/API/WebRTC_API
