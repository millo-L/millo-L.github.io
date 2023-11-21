---
author: millo
title: "[Node.js] express session 사용하기"
category: nodejs
layout: post
released_at: 2021-02-01 13:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: Authentication 방식 정리하기
lang: ko
tags:
    - Authentication
    - nodejs
    - express-session
    - file store
    - memory store
    - MySQL
    - mysql-session-store
is_private: false
translation:
translation_series: none
description: nodejs에서 session을 사용한 인증 방식을 구현해보자.
---

## 1. 서론

지난 포스팅에서 Session 인증 방식에 대해서 알아봤다. 그렇다면 Node.js로 어떻게 Session 인증 방식을 구현할 수 있을까? 이번 포스팅에서는 Session의 저장 방식 3가지(메모리, 디스크 또는 DB) 모두를 간단하게 구현해보도록 하겠다. 만약 Session 인증 방식에 대한 기본 개념이 명확하지 않다면 지난 포스팅을 보고 오는 것을 추천한다.

## 2. 환경 설정

> **전제 조건** <br/>
> Node.js는 당연히 설치되어 있어야 한다. <br/>
> MySQL로 DB Session을 구현할 것이므로 MySQL을 설치하기 바란다. <br/>
> 당연히 MySQL은 RDS나 Docker 등의 원격 DB로 대체 가능하다.

우선, 실습을 진행할 폴더를 생성하고 필요한 모듈들을 모두 설치하도록 하자.

```bash
## 폴더 생성 및 열기
mkdir session-practice
cd session-practice

## package.json 생성
npm init -y

## 필요한 모듈 설치
npm install http express express-session memorystore session-file-store mysql express-mysql-session body-parser
```

## 3. Memory session store

처음으로 진행해볼 실습은 memory session store이다. 말 그대로 session의 데이터를 메모리에 저장하는 방식이다. 이 방식은 session 정보를 디스크나 DB에 저장하는 것보다 훨씬 빠른 반응 속도를 보인다는 장점이 있지만, 그만큼 메모리에 적재되는 session 양이 많아졌을 때는 부하가 심한 방식이기도 하다. 따라서, 메모리에 적재되는 양을 조절하거나 세션이 유지되는 기간을 조절하는 것이 중요하다.

아래의 코드는 브라우저로 http://localhost:8080 에 접속했을 때, 새로고침을 할 때마다 'View: ' 옆에 있는 숫자가 증가하는 코드이다. 이런 방식이 가능한 이유는 session에 최근 num을 저장하고 있기 때문에 브라우저에서 새로고침이나 재접속을 해도 유지되는 것이다.
아래의 코드에서 checkPeriod는 memorystore에 저장될 기간을 정하는 것이다. 가장 최근 접속이 checkPeriod로 지정된 시간을 넘어가면 메모리의 세션은 자동 파기된다.

```js
// memory-session.js

const http = require("http");
const express = require("express");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

const app = express();
const server = http.createServer(app);
const PORT = 8080;

app.use(
    session({
        secret: "secret key",
        resave: false,
        saveUninitialized: true,
        store: new MemoryStore({
            checkPeriod: 86400000, // 24 hours (= 24 * 60 * 60 * 1000 ms)
        }),
        cookie: { maxAge: 86400000 },
    })
);

app.get("/", (req, res) => {
    console.log(req.session);
    if (req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num += 1;
    }

    res.send(`View: ${req.session.num}`);
});

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
```

## 4. File session store

다음으로 진행해볼 실습은 file session store이다. 말 그대로 session의 데이터를 파일 형태로 디스크에 저장하는 방식이다. 이 방식은 local에 저장하는 방식으로 DB보다는 속도가 빠르지만 memory 방식보다는 속도가 느리다. 하지만 memory에 비해 디스크가 저장 공간이 훨씬 여유롭다는 장점이 있다. 구현하는 방식은 memory store와 비슷하다.
아래의 코드도 memory store 방식도 동일한 기능을 제공하며 http://localhost:8080 에 접속해서 확인할 수 있다. file store 방식의 특징은 해당 파일와 같은 경로에 sessions라는 폴더가 생기고 그곳에 세션의 정보가 기록된다는 점이다. 실행해보면 바로 확인할 수 있을 것이다.

```js
// file-session.js

const http = require("http");
const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express();
const server = http.createServer(app);
const PORT = 8080;

app.use(
    session({
        secret: "secret key",
        resave: false,
        saveUninitialized: true,
        store: new FileStore(),
    })
);

app.get("/", (req, res) => {
    console.log(req.session);
    if (req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num += 1;
    }

    res.send(`View: ${req.session.num}`);
});

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
```

## 5. MySQL session store

mysql session store 방식에서는 간단한 로그인 예제를 만들어서 실행해보도록 하자. 로그인을 한 회원이 다시 새로고침을 한다면 main 페이지로 자동으로 redirect 되는 실습을 구현해보자. 그 전에 먼저 파일 경로와 실습에 사용할 Database를 생성해두도록 하자.

#### 폴더 구조

```
📦session-practice
 ┣ 📂node_modules
 ┣ 📂webpage
 ┃ ┣ 📜login.html
 ┃ ┗ 📜main.html
 ┣ 📜db-session.js
 ┣ 📜package-lock.json
 ┗ 📜package.json
```

#### 데이터 베이스 생성

```sql
## MySQL Command Line Client
CREATE DATABASE session_test;
```

### 5-1. login.html

로그인을 진행할 간단한 html 파일을 작성해보자. 아이디와 비밀번호를 입력하고 submit 버튼을 누르면 서버로 로그인 요청을 보낸다.

```html
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

### 5-2. main.html

로그인이 성공했을 때의 main.html 파일을 작성해보자. 간단하게 logout 버튼만 존재하고 해당 버튼을 누르면 세션 정보가 삭제되어 다시 로그인을 진행해야 한다.

```html
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

### 5-3. db-session.js

node.js 서버를 작성해보자. user의 id, pw는 임시로 생성한 것이므로 본인이 원하는 방식으로 변경하면 된다. 물론 저장시에도 저런 방법을 사용하면 안 되고, 반드시 pw를 암호화해야 한다. 크게 이해하기 어려운 부분은 없을 것으로 예상되므로 session 설명으로 넘어가겠다.
로그인이 성공했을 때 session에 user를 지정한다. 그 이후로는 login 페이지로 이동하면 자동으로 main 페이지로 리다이렉트를 진행하게 된다. 반대로 로그인을 하지 않은 user가 바로 main 페이지로 이동하려 해도 login 페이지로 자동으로 리다이렉트 된다. 이런 식으로 session을 체크하면 로그인을 했는지 안 했는지에 따라 특정 기능을 부여할지 말지를 선택할 수 있게 된다.

```js
// db-session.js

const http = require("http");
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = (module.exports = express());
const server = http.createServer(app);
const MySQLStore = require("express-mysql-session")(session);
const PORT = 8080;

const options = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "session_test",
};

const sessionStore = new MySQLStore(options);

app.use(
    session({
        secret: "secret key",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(bodyParser.urlencoded({ extended: false }));

// login 페이지
app.get("/login", (req, res) => {
    if (req.session.user !== undefined) return res.redirect("/");

    fs.readFile("./webpage/login.html", (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

// 임시 user
const users = [
    { id: "hello", pw: "world" },
    { id: "good", pw: "bye" },
];

// id, pw 체크
const login = (id, pw) => {
    let len = users.length;

    for (let i = 0; i < len; i++) {
        if (id === users[i].id && pw === users[i].pw) return id;
    }

    return "";
};

// login 요청
app.post("/login", (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;

    let user = login(id, pw);
    if (user === "") return res.redirect("/login");

    req.session.user = user;
    req.session.save(err => {
        if (err) {
            console.log(err);
            return res.status(500).send("<h1>500 error</h1>");
        }
        res.redirect("/");
    });
});

// main 페이지
app.get("/", (req, res) => {
    if (req.session.user === undefined) return res.redirect("/login");

    fs.readFile("./webpage/main.html", (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

// logout 요청
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(error);
            return res.status(500).send("<h1>500 error</h1>");
        }
        res.redirect("/");
    });
});

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
```

## [참고]

-   https://www.npmjs.com/package/express-session
-   https://www.npmjs.com/package/session-file-store
-   https://www.npmjs.com/package/memorystore
-   https://www.npmjs.com/package/express-mysql-session
-   https://opentutorials.org/course/3400/21838
