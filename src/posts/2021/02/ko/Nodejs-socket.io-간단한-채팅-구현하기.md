---
author: millo
title: "[Node.js] Socket.io 간단한 채팅 구현하기"
category: nodejs
layout: post
released_at: 2021-02-04 13:00
updated_at:
image: ../../../../images/2021/02/socketio.png
series: none
lang: ko
tags:
    - nodejs
    - chat
    - express
    - socket.io
is_private: false
translation:
translation_series: none
description: nodejs에서 socket.io를 사용하여 간단한 chat을 구현해보자.
---

# 1. 서론

오늘은 socket.io를 통한 웹소켓 연결을 진행해보도록 하자. 이번에는 간단하게 html 클라이언트와 연결해서 간단한 채팅을 구현해볼 예정이다. 크게 어려운 부분은 없으므로 잘 따라오면 socket.io가 이런 거구나 정도는 이해할 수 있을 것이다.

# 2. 결과 화면

UI는... 말을 아끼자... 일단 아래의 코드를 작성 후 실행하면 이렇게 채팅이 최종적으로 구현된다.
[여기](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbFUtpi%2FbtqVIbslX5a%2FxN5gP7VKTXncbdYpf6kiM1%2Fimg.gif)를 눌러 확인해보자.

# 3. 환경 설정

개발 환경은 특별한 점은 없고 아래와 같이 코드를 작성할 폴더와 필수적인 모듈을 설치해보자.

### socket.io는 반드시 2.3.0 버전을 아래와 같이 설치해야한다.

```bash
# 폴더 생성 및 열기
mkdir socketio-practice
cd socketio-practice

# package.json 생성
npm init -y

# 필요한 모듈 설치
npm install http express socket.io@2.3.0
```

# 4. 폴더 구조

폴더 구조는 아래와 같다.

```
📦socketio-practice
 ┣ 📂node_modules
 ┣ 📜chat.html
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜server.js
```

# 5. chat.html

간단한 클라이언트의 html 파일이다. socket.io를 사용하기 위해 <socket src="/socket.io/socket.io.js"></script>를 먼저 추가해줘야 한다. 그 이후 socket을 서버와 연결하고 아래의 설명과 같이 송신, 수신 이벤트를 작성하면 된다.

```html
<!-- chat.html -->

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>simple chat</title>
        <script src="/socket.io/socket.io.js"></script>
        <script>
            let socket
            window.onload = () => {
                // socket 연결
                socket = io.connect("/")

                // message 수신 이벤트
                socket.on("message", data => {
                    makeChatDiv(data.name, data.content, data.date)
                })
            }

            // 버튼 클릭 시 메시지 송신
            const sendMessage = () => {
                let name = document.getElementById("name").value
                let content = document.getElementById("content").value

                document.getElementById("name").value = ""
                document.getElementById("content").value = ""

                socket.emit("message", {
                    name,
                    content,
                    date: new Date(),
                })
            }

            // message 수신 시 채팅 컴포넌트 생성
            const makeChatDiv = (name, content, date) => {
                let div = document.createElement("div")
                let nameH3 = document.createElement("h3")
                let contentP = document.createElement("p")
                let dateP = document.createElement("p")

                nameH3.innerHTML = name
                contentP.innerHTML = content
                dateP.innerHTML = date

                div.appendChild(nameH3)
                div.appendChild(contentP)
                div.appendChild(dateP)

                div.className = "chat"

                document.getElementById("chatbox").prepend(div)
            }
        </script>
        <style>
            .chat {
                border: 1px solid black;
                width: 400px;
            }
        </style>
    </head>
    <body>
        <h1>Simple Chat</h1>
        <input id="name" type="text" placeholder="name" />
        <input id="content" type="text" placeholder="content" />
        <button onclick="sendMessage()">보내기</button>
        <hr />
        <div id="chatbox"></div>
    </body>
</html>
```

# 6. server.js

서버는 더욱 간단하다. 클라이언트에게 전달받은 내용을 전달하기만 하면 되기 때문에, 큰 무리 없이 이해할 수 있을 거라 생각한다. 참고로 express.js와 연결하지 않고 http만 사용해도 되지만 후에 사용할 때 확장성을 위해 express.js와 연동했다.

```js
// server.js

const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const fs = require("fs")

const app = express()
const server = http.createServer(app)
const PORT = 8080
const io = socketio.listen(server)

app.get("/", (req, res) => {
    fs.readFile("./chat.html", (error, data) => {
        if (error) {
            console.log(error)
            return res.sendStatus(500)
        }

        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(data)
    })
})

io.sockets.on("connection", socket => {
    socket.on("message", data => {
        io.sockets.emit("message", data)
    })
})

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
```

# [참고]

-   https://socket.io/docs/v2/
-   https://socket.io/docs/v2/client-installation/index.html
-   https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
