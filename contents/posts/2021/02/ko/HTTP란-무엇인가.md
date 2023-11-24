---
author: millo
title: "[Network] HTTP란 무엇인가"
category: network
layout: post
released_at: 2021-02-11 13:00
updated_at:
image: ../../../../images/2021/02/http.png
series: none
lang: ko
tags:
    - HTTP
    - HTTP 동작 방식
    - HTTP 요청 메서드
    - HTTP란
is_private: false
translation:
translation_series:
description: 우리에게 매우 친숙하지만 제대로 알고 있진 못한 HTTP에 대해 알아보자.
---

## 1. 서론

최근 백엔드 개발을 진행하다 보니 데이터 송수신 방식(RPC, gRPC 등)에 대해 공부할 기회가 생겼는 데, 그중 제일 기본적인 방식이 HTTP에 대해 생각보다 자세히 모르고 있다는 생각이 들었다. HTTP는 그저 우리가 웹브라우저를 사용하거나 개발할 때 클라이언트와 서버가 정보를 교환하는 가장 기본적인 프로토콜이라는 정도밖에 알지 못해서 좀 더 자세히 알아보고자 이 포스팅을 작성한다.

## 2. HTTP(HyperText Transfer Protocol)란?

-   초기에는 HTML과 같은 하이퍼미디어 문서를 주로 전송했지만, 최근에는 Plain text, JSON, XML 등 다양한 형태의 정보도 전송하는 애플리케이션 레이어 프로토콜이다.
-   초기에는 웹 브라우저와 웹 서버 간의 커뮤니케이션을 위해 디자인되었지만 최근에는 모바일 애플리케이션 및 IoT 등과의 커뮤니케이션과 같이 다른 목적으로도 사용되고 있다.
-   HTTP는 클라이언트가 요청을 생성하기 위한 연결을 연 다음 응답을 받을 때까지 대기하는 전통적인 클라이언트-서버 모델을 따른다.
-   HTTP는 무상태 프로토콜이며, 이는 서버가 두 요청 간에 어떠한 상태나 데이터를 유지하지 않음을 의미한다. (상태를 유지하기 위한 노력으로 Cookie와 Session을 사용한다.)
-   일반적으로 안정적인 TCP/IP 레이어를 기반으로 사용하는 응용 프로토콜이다.

## 3. HTTP의 동작 방식

> **클라이언트** <br /> > &nbsp;서버에게 요청을 보내는 리소스 사용자 ex) 웹 브라우저, 모바일 애플리케이션, IoT 등 <br /> **서버** <br /> > &nbsp;클라이언트에게 요청에 대한 응답을 제공하는 리소스 관리자

클라이언트(웹 브라우저, 모바일 등)가 브라우저를 통해서 어떠한 서비스를 URI를 통해 서버에 요청(Request)하면 서버에서는 해당 요청에 대한 결과를 응답(Response)하는 형태로 동작한다.

![](../../../../images/2021/02/http-flow.png)

## 4. HTTP 요청 메서드

### GET

특정 리소스를 받기 위한 요청이다. 따라서, 리소스의 생성, 수정 및 삭제 등에 사용해서는 안된다.

### POST

리소스를 생성하거나 컨트롤러를 실행하는 데 사용한다.

### PUT

변경 가능한 리소스를 업데이트하는 데 사용되며 항상 리소스 식별 정보를 포함해야 한다.

### PATCH

변경 가능한 리소스의 부분 업데이트에 사용되며 항상 리소스 식별 정보를 포함해야 한다.<br />
_PUT을 사용해 전체 객체를 업데이트하는 것이 관례여서 거의 사용되지 않는다._

### DELETE

특정 리소스를 제거하는 데 사용한다.<br />
_일반적으로 Request body가 아닌 URI 경로에 제거하려는 리소스의 ID를 전달한다._

### HEAD

클라이언트가 본문 없이 리소스에 대한 헹더만 검색하는 경우 사용한다. <br />
_일반적으로 클라이언트가 서버에 리소스가 있는 지 확인하거나 메타 데이터를 읽으려는 때만 GET 대신 사용한다._

### OPTIONS

클라이언트가 서버의 리소스에 대해 수행 가능한 동작을 알아보기 위해 사용한다. <br />
_일반적으로 서버는 이 리소스에 대해 사용할 수 있는 HTTP 요청 메서드를 포함하는 Allow 헤더를 반환한다. ([CORS](https://millo-l.github.io/Nodejs-express-cors-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/)에 사용)_

## 5. HTTP 메시지

### 요청(Request)

![](../../../../images/2021/02/http-request.png)

-   1번줄: 바로 위에서 설명한 HTTP 요청 메서드를 맨 앞에 적고 그 뒤에는 path, 그 뒤에는 프로토콜의 종류와 버전을 적는다. (GET / HTTP/1.1)
-   2번 줄 이후: HTTP Request Headers 부분이다.
-   2번 줄: 리소스를 요청하는 경로. 즉, 요청하고자 하는 서버의 도메인을 적는다. 위의 예시에서 포트 번호가 생략된 것은 80번 포트(HTTP의 기본 포트)이기 때문이다. (developer.mozilla.org)

### 응답(Response)

HTTP 상태 코드에 대한 설명은 [여기](https://millo-L.github.io/HTTP-상태코드-정리하기/)에서 읽어보세요.

![](../../../../images/2021/02/http-response.png)

-   1번 줄: 프로토콜의 종류와 버전, HTTP 상태 코드, HTTP 상태 메시지를 적는다. (GET / HTTP/1.1)
-   2번 줄 이후: HTTP Reponse Headers 부분이다.

## [참고]

-   https://developer.mozilla.org/ko/docs/Web/HTTP
-   https://developer.mozilla.org/ko/docs/Web/HTTP/Methods
-   https://developer.mozilla.org/ko/docs/Web/HTTP/Overview
