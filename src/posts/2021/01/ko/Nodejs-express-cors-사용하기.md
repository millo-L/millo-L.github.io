---
author: millo
title: "[Node.js] express cors 사용하기"
category: nodejs
layout: post
released_at: 2021-01-29 15:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: none
lang: ko
tags:
    - CORS
    - nodejs
    - Cross-origin Resource Sharing
    - express
is_private: false
translation:
translation_series: none
description: nodejs의 cors.js를 사용해서 CORS 환경을 구축해보자.
---

# 1. 서론

리버스 프록시 서버로 NGINX를 두고 한 워크스테이션에서 Swagger와 node.js 서버를 함께 구동한 적이 있다. Swagger의 포트를 8085로 지정하고 node.js 서버는 443번으로 지정했는 데, CORS 에러가 발생해서 Swagger 페이지에서 샘플로 작성한 request를 node.js로 보낼 수 없었다. 그때 처음으로 CORS가 무엇인지 알게 됐다. 따라서, 해당 내용을 정리해두기 위해 CORS란 무엇인지, 그리고 node.js에서 문제를 해결하기 위해 어떻게 해야 하는지 포스팅을 작성하겠다.

# 2. CORS(Cross-Origin Resource Sharing)란 무엇인가?

CORS란 자신이 속하지 않은 다른 도메인, 다른 프로토콜, 혹은 다른 포트에 있는 리소스를 요청하는 cross-origin HTTP 요청 방식이다. 아래의 [그림 1]을 보자. 왼쪽의 웹사이트는 domain-a.com(서버 A)으로 구동되고 있다. <span style="color:blue">**파란색 이미지**</span>는 웹사이트가 구동중인 domain과 동일한 domain-a.com(서버 A)으로부터 자료를 요청하고 수신하지만 아래의 <span style="color:red">**빨간색 이미지**</span>는 domain-b.com(서버B)이라는 다른 도메인에 자료를 요청하고 수신한다. 이러한 방식이 cross-origin HTTP 방식이다.

![](../../../../images/2021/01/cors.png)

언뜻 보면 그냥 그러려니 하게 되는 데, 중요한 점은 서버는 기본적으로 CORS 방식을 제한해둔다. 즉, 사용하지 못하게 한다. 왜냐 하면, 특정 서버 리소스에 다른 임의의 웹 사이트들이 request를 보낼 수 있다면 악의적으로 특정 서버의 세션을 탈취하거나 서버에 무리가 가는 행위 등 문제가 생길 수 있는 행위를 할 수 있기 때문이다.

그럼 다른 사이트에서 나의 서버에 요청하는 것을 허가하고 싶을 때는 어떻게 해야 할까? 그 방식에는 모두에게 제한 없이 제공하는 방식과 본인이 직접 특정 도메인들만 허용하는 방식이 있다. 이 두 가지 방식을 node.js로 구현해보도록 하자.

# 3. node.js로 CORS 방식 허용하기

우선 코드를 작성할 폴더를 생성하고 필요한 모듈들 설치하자.

```bash
# cors 코드를 작성할 폴더 생성 및 열기
mkdir cors_practice
cd cors_practice

# package.json 생성
npm init -y

# http, express, cors 모듈 설치
npm install http express cors
```

## 3-1. 모두에게 허용하기

아래와 같이 별도의 처리 없이 app.use(cors())를 하게 되면 모든 도메인에서 제한 없이 해당 서버에 요청을 보내고 응답을 받을 수 있다.

```js
// index.js

const http = require("http")
const express = require("express")
const app = express()
const server = createServer(app)
const cors = require("cors")

const PORT = 8080

app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello, World!")
})

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
```

## 3-2. 특정 도메인에만 허용하기

아래와 같이 corsOptions 변수에 자신이 허용할 도메인을 추가하고 app.use(cors(corsOptions))를 하게 되면 해당 도메인은 제한 없이 해당 서버에 요청을 보내고 응답을 받을 수 있다.

```js
// index.js

const http = require("http")
const express = require("express")
const app = express()
const server = createServer(app)
const cors = require("cors")

const PORT = 8080

let corsOptions = {
    origin: "https://www.domain.com",
    credentials: true,
}

app.use(cors(corsOptions))

app.get("/", (req, res) => {
    res.send("Hello, World!")
})

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
```

# [참고]

-   https://www.npmjs.com/package/cors
-   https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
