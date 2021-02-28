---
author: millo
title: "[Node.js] express static folder 지정하기"
category: nodejs
layout: post
released_at: 2021-01-30 13:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: none
lang: ko
tags:
    - nodejs
    - express
    - express.static
    - public
    - static files
    - static folder
is_private: false
translation:
translation_series: none
description: nodejs에서 express를 사용해 static folder를 지정해보자.
---

# 1. 서론

처음 내가 Node.js로 웹사이트를 개발할 때 로컬에서 html 파일을 브라우저로 켰을 때는 css, js, image 파일들이 모두 제대로 적용됐는 데, node.js로 html 파일을 구동하면 아무것도 적용되지 않는 것이 너무 당황스러웠다. 뭔가 잘못된 것인가 하다가 로컬에서 html 파일을 구동할 때의 static files(css, js, image 등)와의 상대 경로와 node.js 서버를 사용하여 구동할 때의 상대 경로가 전혀 다르다는 것을 인지했다. 이 것을 해결하기 위해 static folder를 지정할 수 있고, 서버에서는 해당 static folder에 접근해서 static files를 가져온다. 따라서, html 파일을 작성할 때도 해당 url로 static files(css, js, image 등)의 상대 경로를 작성해야 한다.

# 2. 환경설정

간단한 html, css 프로젝트를 만들만한 폴더를 하나 추가하고 개발환경을 생성해보자.

```bash
# 코드를 작성할 폴더 생성 및 열기
mkdir public_practice
cd public_practice

# package.json 초기화
npm init -y

# 필요한 모듈 설치
npm install http express
```

# 3. 폴더 구조

폴더 구조는 아래와 같이 지정했다. static files(css, js, image 등)은 public이라는 폴더 내부에 나눠서 저장된다. 우리는 public이라는 폴더 자체를 static folder로 지정해서 그 내부의 static files를 사용할 예정이다.

```
📦public_practice
 ┣ 📂node_modules
 ┣ 📂public
 ┃ ┣ 📂js
 ┃ ┣ 📂images
 ┃ ┗ 📂styles
 ┃ ┃ ┗ 📜block_style.css
 ┣ 📂webpage
 ┃ ┗ 📜block.html
 ┣ 📜index.js
 ┣ 📜package-lock.json
 ┗ 📜package.json
```

# 4. html 파일 생성하기

static files에 대한 접근 확인만을 위해 테스트만을 진행하기 위해 html을 생성하는 것이므로 색깔을 가진 div 정사각형 블록 하나만 생성해보도록 하자. 여기서 주의할 점은 <link /> 태그에서 href 부분의 경로이다. 우리는 서버를 이용해서 static files를 public 폴더에 저장해놨으므로 public 폴더 내부의 경로를 지정하면 /styles/block_style.css가 된다. 이는 html 파일이 서비스되고 있는 서버의 url을 기본으로 적용하게 되므로 전체적인 url은 http://localhost:8080/styles/block_style.css이다. 하지만, 동일한 서버에서 제공하는 static files는 아래와 같이 http://localhost:8080 부분이 생략 가능하다.

```html
<!--block.html-->

<!DOCTYPE html>
<html>
    <head>
        <title>test_public</title>
        <link rel="stylesheet" href="/styles/block_style.css" />
    </head>
    <body>
        <div id="test_block"></div>
    </body>
</html>
```

# 5. block_style.css 작성

block_style.css가 html 파일에 적용된다면 서버 구동 후에 http://localhost:8080에 접속했을 때 검은색 블록 하나가 화면에 출력돼야 한다.

```css
/* block_style.css */

#test_block {
    width: 200px;
    height: 200px;
    background-color: black;
}
```

# 6. node.js 서버 작성

static folder를 지정하는 것은 매우 간단하다. express에 내장되어있는 static 함수를 사용해서 path를 지정하면 된다. Get 요청이 들어오면 fs 모듈을 사용해서 파일을 읽어와서 html 데이터를 전송한다.

```js
// index.js

const http = require("http")
const express = require("express")
const fs = require("fs")
const app = express()
const server = http.createServer(app)
const PORT = 8080

const WEBPATH = "./webpage"

app.use(express.static("public"))

app.get("/", (req, res) => {
    fs.readFile(`${WEBPATH}/block.html`, (error, data) => {
        if (error) {
            console.log(error)
            return res.status(500).send("<h1>500 Error</h1>")
        }
        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(data)
    })
})

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
```

# [참고]

-   https://expressjs.com/en/starter/static-files.html
