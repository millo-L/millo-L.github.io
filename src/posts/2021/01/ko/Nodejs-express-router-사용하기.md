---
author: millo
title: "[Node.js] express router 사용하기"
category: nodejs
layout: post
released_at: 2021-01-27 20:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: none
lang: ko
tags:
    - nodejs
    - express
    - route
    - router
is_private: false
translation:
translation_series: none
description: nodejs의 express.js의 router를 사용하여 서버를 구현해보자.
---

# 1. 서론

node.js의 Restful API들을 모두 한 js 파일에 작성하게 되면 코드를 알아보기가 점점 힘들어진다. 그렇기 때문에 토픽에 맞는 router를 생성해서 path를 지정하면 각 js별로 토픽이 정해져 있어 유지 보수가 더 간단해지고 팀원들 간의 코드 리뷰에도 큰 도움이 된다.

시작하기에 앞서 지난 시간에 포스팅한 코드를 사용할 것이므로 만약 이 포스팅에 먼저 들어왔다면 여기로 가서 지난 포스팅을 간략하게 읽고 오길 바란다.

# 2. 폴더 구조

우리는 아래의 구조로 간단한 라우터들을 구현할 것이다. 먼저 index.js에서 요청을 받아서 각각의 path에 따라 account.js(전 시간의 rest.js)와 helloworld.js에 요청을 넘겨서 처리할 것이다.

```
📦express_practice
 ┣ 📂router
 ┃ ┣ 📜account.js
 ┃ ┗ 📜helloworld.js
 ┣ 📜index.js
 ┣ 📜package-lock.json
 ┗ 📜package.json
```

# 3. express router 구현하기

## 3-1. index.js

index.js 파일은 user의 request가 처음 도달하는 js이다. 여기서 각각의 router들(accout.js, helloworld.js)에게 request를 넘겨주어 처리를 한다.

```js
// index.js 파일

const express = require("express")
const http = require("http")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

const server = http.createServer(app)
const PORT = 8080

const accountRouter = require("./router/account")
const helloworldRouter = require("./router/helloworld")

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

app.use("/account", accountRouter)
app.use("/helloworld", helloworldRouter)
```

## 3-2. helloworld.js

위의 index.js에서 "/helloworld" path로 helloworld.js를 routing했으므로 helloworld.js의 동작을 확인하기 위해서는 포스트맨을 이용해서 http://localhost:8080/helloworld에 접속해보면 된다.

```js
// helloworld.js 파일

const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Hello world")
})

module.exports = router
```

## 3-3. account.js(전 포스팅의 rest.js)

위의 index.js에서 "/account" path로 account.js를 routing했으므로 account.js의 동작을 확인하기 위해서는 포스트맨을 이용해서 http://localhost:8080/account에 접속해보면 된다.

```js
// account.js 파일

let express = require("express")
const router = express.Router()

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

const register = (id, password) => {
    let index = findUserIndex(id)
    if (index !== -1) return false

    users.push({ id, password })
    return true
}

const login = (id, password) => {
    let index = findUserIndex(id)
    if (index === -1) return false

    if (users[index].id === id && users[index].password === password)
        return true

    return false
}

const changePassword = (id, password) => {
    let index = findUserIndex(id)
    if (index === -1) return false

    users[index].password = password
    return true
}

const deleteUser = id => {
    let index = findUserIndex(id)
    if (index === -1) return false

    users.splice(index, 1)
    return true
}

router.post("/", (req, res) => {
    let id = req.body.id
    let password = req.body.password

    if (!register(id, password)) return res.status(401).send("duplicate id")
    res.send(`success to register ${id}'s account`)
})

router.get("/:id", (req, res) => {
    let id = req.params.id

    if (findUserIndex(id) === -1) return res.status(401).send("invalid id")

    res.send(`Hello world ${id}`)
})

router.put("/:id", (req, res) => {
    let id = req.params.id
    let password = req.body.password

    if (!changePassword(id, password))
        return res.status(401).send("password change fail")
    res.send(`success to change ${id}'s password`)
})

router.delete("/:id", (req, res) => {
    let id = req.params.id

    if (!deleteUser(id)) return res.status(401).send("delete fail")
    res.send(`success to delete ${id}'s account`)
})

router.post("/login", (req, res) => {
    let id = req.body.id
    let password = req.body.password

    if (!login(id, password)) return res.status(401).send("login fail")

    res.send("hello " + id)
})

module.exports = router
```

# [참고]

-   https://expressjs.com/
-   https://www.postman.com/
