---
author: millo
title: "[Docker] ReactJS Dockerizing하기"
category: docker
layout: post
released_at: 2021-01-30 16:00
updated_at:
image: ../../../../images/category/docker.png
series: none
lang: ko
tags:
    - build
    - docker
    - docker-compose
    - reactjs
    - stdin_open
    - tty
is_private: false
translation:
translation_series: none
description: ReactJS를 도커라이징해서 실행해보자.
---

## 1. 서론

개발 중 ReactJS를 dockerize 한 적이 있다. Dockerfile과 docker-compose.yml 파일로 dockerize를 했는 데 docker-compose.yml 작성 중 ReactJS가 제대로 작동하지 않는 것을 확인하고 무슨 문제인가 한참을 찾았던 경험이 있다. 따라서, 나와 비슷한 문제를 겪고 있는 사람들을 위해 이 포스팅을 작성한다.

결론부터 말하자면 문제는 tty와 stdin_open 값을 true로 줘야한다는 점이다. docker-compose.yml에서는 이 두 값을 true로 설정하면 되고, Dockerfile만을 사용해서 build 후 run할 때는 -it 를 붙여주면 된다. 이유는 ReactJS가 실행될 때 terminal과 stdin을 사용하기 때문이다.

## 2. 환경 설정

ReactJS를 생성해보자.

```bash
## react 앱 생성 및 폴더 열기
create-react-app dockerize-react
cd dockerize-react
```

## 3. 폴더 구조

react app을 처음 생성한 모습 그대로의 폴더 구조이다. 다른 모듈을 설치하거나 특정 파일을 제거하는 등의 작업은 수행하지 않았다. 여기서 추가된 파일들은 .dockerignore, Dockerfile, docker-compose.yml 세 파일뿐이다.

```
 📦dockerize-react
 ┣ 📂node_modules
 ┣ 📂public
 ┃ ┣ 📜favicon.ico
 ┃ ┣ 📜index.html
 ┃ ┣ 📜logo192.png
 ┃ ┣ 📜logo512.png
 ┃ ┣ 📜manifest.json
 ┃ ┗ 📜robots.txt
 ┣ 📂src
 ┃ ┣ 📜App.css
 ┃ ┣ 📜App.js
 ┃ ┣ 📜App.test.js
 ┃ ┣ 📜index.css
 ┃ ┣ 📜index.js
 ┃ ┣ 📜logo.svg
 ┃ ┣ 📜reportWebVitals.js
 ┃ ┗ 📜setupTests.js
 ┣ 📜.dockerignore
 ┣ 📜.gitignore
 ┣ 📜docker-compose.yml
 ┣ 📜Dockerfile
 ┣ 📜package.json
 ┣ 📜README.md
 ┗ 📜yarn.loc
```

## 4. .dockerignore

Dockerfile에서 현재 폴더 목록을 COPY 할 때 제외할 파일 또는 폴더를 지정하는 파일이다. .gitignore가 git에 add하지 않을 파일 또는 폴더를 지정하는 것과 같은 역할을 한다.

```bash
## .dockerignore

.git
.gitignore
/node_modules
Dockerfile
README.md
```

## 5. Dockerfile

dockerize-react를 dockerize 할 파일이다. Dockerfile에 명시된 명령어대로 build를 수행하여 이미지를 생성한다.

```Dockerfile
## Dockerfile

FROM node:12.18.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
```

여기까지 진행했으면 react app을 dockerize할 준비가 완료된 것이다. Dockerfile을 빌드하기만 하면 된다.

```bash
## ~/dockerize-react 폴더 내에서 실행

## Dockerfile build
docker build -t sample:0.1 .

## 위에서 build한 sample:0.1 이미지를 실행시킨다.
docker run -it -p 3000:3000 --name dockerize-react sample:0.1

## 만약 background 실행을 원한다면
## docker run -itd -p 3000:3000 --name dockerize-react sample:0.1
```

이제 http://localhost:3000으로 접속하면 ReactJS의 초기화면을 볼 수 있다.

## 6. docker-compose.yml

만약, 다른 프로그램과 같이 실행하려 한다면 docker-compose.yml 파일을 작성해서 사용하게 될 것이다. 그때는 아래와 같이 작성하면 된다.

```yml
## docker-compose.yml

version: "3.5"
services:
    web:
        build: .
        stdin_open: true
        tty: true
        ports:
            - 3000:3000
```

위와 같이 작성했다면, 실행 명령어를 터미널에 입력하면 된다.

```bash
## ~/dockerize-react 폴더 내에서 실행

docker-compose up

## 만약 background 실행을 원한다면
## docker-compose up -d
```

이제 http://localhost:3000으로 접속하면 ReactJS의 초기화면을 볼 수 있다.

## [참고]

-   https://mherman.org/blog/dockerizing-a-react-app/
