---
author: millo
title: WebRTC 성능 비교(P2P vs SFU)
category: webrtc
layout: post
released_at: 2021-01-16 17:00
updated_at:
image: ../../../../images/category/webrtc.png
series: WebRTC 이론부터 실전까지
lang: ko
tags:
    - WebRTC
    - SFU
    - Mesh
    - P2P
    - Media Server
    - Signaling Server
is_private: false
translation: /WebRTC-Performance-Comparison-(P2P-vs-SFU)/
translation_series: /WebRTC-theory-to-practice
description: WebRTC의 이론을 기반으로 만든 1:N P2P vs SFU 성능비교를 해보자.
---

# 1. 서론

지난 포스팅을 마지막으로 P2P(Mesh)와 SFU 방식의 1:N 화상회의 WebRTC 구현을 마쳤다. 구현의 마지막은 항상 성능 테스트 아닌가 해서 정말 간단하게 성능 테스트를 진행해봤다. 테스트를 위해서는 서버와 클라이언트가 독립적인 공간이 좋았겠지만 상황상 불가능했다는 것을 이해해줬으면 한다.

# 2. 성능 테스트(Performance Test)

## 2-1. 기기(Devices)

| device |                description                |
| :----: | :---------------------------------------: |
|  CPU   | AMD Ryzen 5 3600 6-Core Processor 3.59GHz |
|  RAM   |                   32GB                    |
|  GPU   |       NVIDIA GeForce RTX 2060 SUPER       |
|   OS   |              Windows 10 Pro               |

## 2-2. 환경 설정(Settings)

-   모든 client들과 server는 **한 기기에서 실행**됐다.
-   위에서 말하는 1:N 방식은 일반적인 **화상 회의를 기준**으로 한다.

## 2-3. Client Side Performance(Chrome browser CPU usage)

-   모든 client들이 한 기기에서 실행되므로 CPU 점유율은 Chrome browser를 기준으로 책정했다.

| the number of users | P2P/Mesh(Signaling Server) | SFU(Media Server) |
| :-----------------: | :------------------------: | :---------------: |
|          2          |             4%             |        5%         |
|          3          |            10%             |        8%         |
|          4          |            22%             |       9.5%        |
|          5          |            34%             |        18%        |
|          6          |            47%             |        25%        |
|          7          |            64%             |        30%        |
|          8          |            80%             |        30%        |

## 2-4. Server Side Performance(CPU usage)

-   server를 node.js로 구현했으므로 CPU 점유율은 Node.js 프로세스를 기준으로 책정했다.

| the number of users | P2P/Mesh(Signaling Server) | SFU(Media Server) |
| :-----------------: | :------------------------: | :---------------: |
|          2          |            0.1%            |        2%         |
|          3          |            0.1%            |        13%        |
|          4          |            0.1%            |        24%        |
|          5          |            0.1%            |        32%        |
|          6          |            0.1%            |        41%        |
|          7          |            0.1%            |        48%        |
|          8          |            0.1%            |        50%        |

# 3. 결과 정리(Results)

## 3-1. SFU Server(Media Server)

-   client가 6명이 되었을 때부터 몇몇 영상에서 **실시간 성이 급격히 감소**했다.
-   client가 7명 이상일 때는 **몇몇 영상이 몇 초간 멈춰있는 등의 심한 부하**가 발생했다.
-   **Server Side**에서는 Signaling Server에 비해 **매우 높은 CPU 점유율**을 보였다.
-   **Client Side**에서는 Signaling Server에 비해 **절반 정도의 CPU 점유율**을 보여, 확실히 Client 쪽 부하가 줄어든 것을 볼 수 있었다.

## 3-2. Signaling Server (P2P/Mesh)

-   client가 증가함에 따라 조금씩 영상들에서 delay와 실시간성 감소가 느껴졌지만 영상이 멈추진 않았다.
-   Server Side의 CPU 점유율이 client의 증가에 상관없이 0.1%로 유지됐다.
-   Client Side의 CPU 점유율이 client가 증가함에 따라 매우 크게 증가했다.

# 4. 느낀 점

이 포스팅으로 정말정말정말 WebRTC 관련 글은 끝이다. 미디어 서버는 돈 많은 사람들만 만드는 것인가 하는 느낌이 들기도 하지만 원래 SFU 서버는 다수의 화상회의 보다는 실시간 스트리밍이 적합하기 때문에 관련 테스트도 해보고 싶긴하다. YouTube 스트리밍이나 아프리카 TV, 트위치 등과 같이 스트리밍을 하는 경우 한 명이 송출하고 다른 사람은 받기만하면 되는 구조이기 때문에 SFU 서버는 이보다 훨씬 성능이 좋게 나올 것이라 예상해볼 수 있다. 어쨌든 이러한 점들을 뒤로한 채 추후에 WebRTC를 써볼 일이 있으면 이어서 포스팅을 해보도록 하겠다. 사실 화면 공유, P2P 파일 공유 등과 같은 작업을 해보고 싶긴 했는 데 일단 바쁜 일이 마무리 되면 해보도록 하겠다. 아무튼 작년부터 시작한 WebRTC 관련 포스팅을 올해 초에 마무리하게 되서 기쁘고 이 포스팅들이 다른 사람들에게 도움이 됐으면 한다.

# [GitHub]

-   [1:N P2P WebRTC](https://github.com/millo-L/Typescript-ReactJS-WebRTC-1-N-P2P)
-   [1:N SFU WebRTC](https://github.com/millo-L/Typescript-ReactJS-WebRTC-1-N-SFU)

# [관련 포스팅]

-   [1:N P2P WebRTC](https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-N-P2P/)
-   [1:N SFU WebRTC](https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-N-SFU/)
-   [WebRTC의 서버 구현 방식](<https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84-%EB%B0%A9%EC%8B%9D(Mesh-SFU-MCU)/>)
