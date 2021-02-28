---
author: millo
title: "[Node.js] express 사용하기"
category: nodejs
layout: post
released_at: 2021-01-27 19:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: none
lang: ko
tags:
    - nodejs
    - express
    - route
is_private: false
translation:
translation_series: none
description: nodejs의 express.js를 사용하여 서버를 구현해보자.
---

# 1. 서론

node.js를 서버로 사용하는 경우 가장 표준으로 인식되는 express.js에 대해 알아보도록 하자. 사실 크게 어려운 부분은 없으며, Restful API를 개발하기에 매우 간편하다.

# 2. 환경설정

> **전제 조건** <br/>
> 당연히 node.js는 설치돼있다고 가정한다. <br/>
> 혹시 설치하지 않은 분은 [여기](https://nodejs.org/ko/download/)를 클릭해서 설치하세요.

우선 폴더를 하나 만들어 node.js 개발 환경을 구축하도록 하자.

```bash
# 폴더 생성 및 열기
mkdir express_practice
cd express_practice

# package.json 초기화
npm init -y

# http, express 모듈 설치
npm install http express
```

# 3. Hello world! 출력하기

가장 간단한 Hello world를 출력하는 코드를 작성해보자.

```js
// helloworld.js 파일

const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const PORT = 8080

app.get("/", (req, res) => {
    res.send("Hello world")
})

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
```

실행 후 브라우저 혹은 postman을 통해 http://localhost:8080으로 접속해보자.

```bash
node helloworld.js
```

# 4. Restful API 구현

user의 계정 정보를 CRUD하는 간단한 Rest API를 구현해보자.

```js
// rest.js 파일

const express = require("express")
const http = require("http")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

const server = http.createServer(app)
const PORT = 8080

// 임시 user id, password
let users = [
    {
        id: "hello",
        password: "1234",
    },
    {
        id: "world",
        password: "1234",
    },
]

// 임시 user 배열에서 user의 index 반환
const findUserIndex = id => {
    let index = -1
    let len = users.length

    for (let i = 0; i < len; i++) {
        if (users[i].id === id) {
            index = i
            break
        }
    }

    return index
}

// 임시 user 배열에 새로운 user 등록
const register = (id, password) => {
    let index = findUserIndex(id)
    if (index !== -1) return false

    users.push({ id, password })
    return true
}

// 임시 user에 존재하는 id, password인지 검사
const login = (id, password) => {
    let index = findUserIndex(id)
    if (index === -1) return false

    if (users[index].id === id && users[index].password === password)
        return true

    return false
}

// 임시 user 배열에서 password 변경
const changePassword = (id, password) => {
    let index = findUserIndex(id)
    if (index === -1) return false

    users[index].password = password
    return true
}

// 임시 user 배열에서 user 삭제
const deleteUser = id => {
    let index = findUserIndex(id)
    if (index === -1) return false

    users.splice(index, 1)
    return true
}

// 회원가입
app.post("/", (req, res) => {
    let id = req.body.id
    let password = req.body.password

    if (!register(id, password)) return res.status(401).send("duplicate id")
    res.send(`success to register ${id}'s account`)
})

// 특정 user의 정보 가져오기
app.get("/:id", (req, res) => {
    let id = req.params.id

    if (findUserIndex(id) === -1) return res.status(401).send("invalid id")

    res.send(`Hello world ${id}`)
})

// 특정 user 정보 수정
app.put("/:id", (req, res) => {
    let id = req.params.id
    let password = req.body.password

    if (!changePassword(id, password))
        return res.status(401).send("password change fail")
    res.send(`success to change ${id}'s password`)
})

// 특정 user 삭제
app.delete("/:id", (req, res) => {
    let id = req.params.id

    if (!deleteUser(id)) return res.status(401).send("delete fail")
    res.send(`success to delete ${id}'s account`)
})

// user login
app.post("/login", (req, res) => {
    let id = req.body.id
    let password = req.body.password

    if (!login(id, password)) return res.status(401).send("login fail")

    res.send("hello " + id)
})

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
```

# [참고]

-   https://expressjs.com/
