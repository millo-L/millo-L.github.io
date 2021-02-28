---
author: millo
title: "[Node.js] passport session 사용하기"
category: nodejs
layout: post
released_at: 2021-02-01 15:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: Authentication 방식 정리하기
lang: ko
tags:
    - Authentication
    - nodejs
    - passport
    - passport session
    - session
is_private: false
translation:
translation_series: none
description: nodejs에서 passport 모듈의 session을 사용한 인증 방식을 구현해보자.
---

# 1. 서론

지난 포스팅까지 express-session, jwt에 대한 이론과 실제 모듈 사용까지 진행해봤다. 지난 포스팅까지는 login, logout에 별다른 모듈을 쓰지 않고 구현했지만 오늘은 passport.js를 사용해서 구현해보려 한다. passport.js는 OAuth 2.0을 지원하는 모듈로써 로컬에서 동작하는 로그인도 당연히 지원하는 오픈 소스이다. 때문에 굉장히 많은 사랑을 받고 있는 데, 후에 포스팅하게 될 구글 로그인의 실습을 이 모듈로 진행할 것이기 때문에 미리 숙지할 겸, 그리고 이런 모듈도 있다는 것을 알릴 겸해서 이 포스팅을 작성하게 됐다.

# 2. 환경설정

> **전제 조건** <br/>
> Node.js는 당연히 설치되어 있어야 한다. <br/>
> MySQL로 DB Session을 구현할 것이므로 MySQL을 설치하기 바란다. <br/>
> 당연히 MySQL은 RDS나 Docker 등의 원격 DB로 대체 가능하다.

하지만 MySQL을 사용하길 원치 않는 사람이 있다면, 이 포스팅을 방문해 memory store 또는 file store를 적용해도 무방하다. 세션 부분만 변경하면 되기 때문에 어려움 없이 대체 가능하다.
우선, 실습을 진행할 폴더를 생성하고 필요한 모듈을 설치하자.

```bash
# 폴더 생성 및 여릭
mkdir passport-practice
cd passport-practice

# package.json 생성
npm init -y

# 필요한 모듈 설치
npm install http express express-session express-mysql-session body-parser passport passport-local
```

# 3. 폴더 구조

```
📦passport-practice
 ┣ 📂node_modules
 ┣ 📂webpage
 ┃ ┣ 📜login.html
 ┃ ┗ 📜main.html
 ┣ 📜index.js
 ┣ 📜package-lock.json
 ┗ 📜package.json
```

# 4. login.html

간단한 로그인 페이지이다. id와 pw를 입력하고 제출 버튼을 누르면 서버에 로그인 요청을 보낸다.

```html
<!-- login.html -->

<!DOCTYPE html>
<html>
    <head>
        <title>login</title>
        <meta charset="UTF-8" />
    </head>
    <body>
        <form method="POST" action="/login">
            <input type="text" name="id" placeholder="아이디" />
            <input type="password" name="pw" placeholder="비밀번호" />
            <input type="submit" />
        </form>
    </body>
</html>
```

# 5. main.html

로그인이 성공했을 때 출력되는 페이지이다. logout 링크만 존재한다.

```html
<!-- main.html -->

<!DOCTYPE html>
<html>
    <head>
        <title>main</title>
    </head>
    <body>
        <a href="/logout">logout</a>
    </body>
</html>
```

# 6. index.js

특별한 점이 있다면 passport를 app.use(passport.initialize())해서 반드시 초기화를 해야 한다는 점이다. 물론 세션을 사용하기 때문에 app.use(passport.session())도 반드시 초기화해야 한다. 그 이후의 설명은 아래의 코드와 함께 작성했다.
처음 공부하는 사람에게 헷갈릴 수 있는 점이 있다면, serializeUser와 deserializeUser이다. serializeUser란 로그인을 성공한 user의 정보를 session에 저장하는 함수이고, deserializeUser는 페이지에 방문하는 모든 client에 대한 정보를 req.user 변수에 전달해주는 함수이다. 따라서, req.user로 해당 user가 로그인을 한 유저인지 또한 어떤 user인지에 대한 정보를 각각의 요청들에서 넘겨받을 수 있게 된다.
아래의 코드에서는 req.user를 사용해서 해당 유저의 로그인 여부를 판단했다.

```js
// index.js

const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const MySQLStore = require("express-mysql-session")(session)
const fs = require("fs")
const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy

const app = express()
const server = http.createServer(app)
const PORT = 8080

const options = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1q2w3e4r!@",
    database: "session_test",
}

const sessionStore = new MySQLStore(options)

app.use(
    session({
        secret: "secret key",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
    })
)
app.use(bodyParser.urlencoded({ extended: false }))

// passport 초기화 및 session 연결
app.use(passport.initialize())
app.use(passport.session())

// login이 최초로 성공했을 때만 호출되는 함수
// done(null, user.id)로 세션을 초기화 한다.
passport.serializeUser(function (user, done) {
    done(null, user.id)
})

// 사용자가 페이지를 방문할 때마다 호출되는 함수
// done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
passport.deserializeUser(function (id, done) {
    done(null, id)
})

// 임시 id, pw 배열
const users = [
    { id: "hello", pw: "world" },
    { id: "good", pw: "bye" },
]

// 입력된 id가 존재하는 지 여부와 위치 반환 함수
const findIndexByID = id => {
    let len = users.length

    for (let i = 0; i < len; i++) {
        if (users[i].id === id) return i
    }

    return -1
}

// id, pw login 함수
const login = (id, pw) => {
    let index = findIndexByID(id)

    if (index === -1) return -1
    if (users[index].pw === pw) return 1
    return 0
}

// local login 전략을 세우는 함수
// client에서 전송되는 변수의 이름이 각각 id, pw이므로
// usernameField, passwordField에서 해당 변수의 값을 받음
// 이후부터는 username, password에 각각 전송받은 값이 전달됨
// 위에서 만든 login 함수로 id, pw가 유효한지 검출
// 여기서 로그인에 성공하면 위의 passport.serializeUser 함수로 이동
passport.use(
    new LocalStrategy(
        {
            usernameField: "id",
            passwordField: "pw",
        },
        function (username, password, done) {
            let result = login(username, password)

            if (result === -1)
                return done(null, false, { message: "Incorrect username." })
            else if (result === 0)
                return done(null, false, { message: "Incorrect password." })
            else return done(null, { id: username })
        }
    )
)

// login 요청이 들어왔을 때 성공시 / 로, 실패시 /login 으로 리다이렉트
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
)

// login 페이지
app.get("/login", (req, res) => {
    if (req.user) return res.redirect("/")
    fs.readFile("./webpage/login.html", (error, data) => {
        if (error) {
            console.log(error)
            return res.status(500).send("<h1>500 error</h1>")
        }
        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(data)
    })
})

// main 페이지
app.get("/", (req, res) => {
    if (!req.user) return res.redirect("/login")
    fs.readFile("./webpage/main.html", (error, data) => {
        if (error) {
            console.log(error)
            return res.status(500).send("<h1>500 error</h1>")
        }
        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(data)
    })
})

// logout
// passport의 내장함수인 logout() 호출
app.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
```

# [참고]

-   http://www.passportjs.org/docs/
