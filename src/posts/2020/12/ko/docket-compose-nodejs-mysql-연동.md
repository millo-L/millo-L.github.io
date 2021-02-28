---
author: millo
title: "[Docker] docker-copmose node.js, mysql 연동"
category: docker
layout: post
released_at: 2020-12-24 17:00
updated_at:
image: ../../../../images/category/docker.png
series: none
lang: ko
tags:
    - docker
    - mysql
    - node.js
    - docker-compose
is_private: false
translation:
translation_series: none
description: docker-compose로 node.js와 mysql을 연동해보자.
---

# 1. 내가 겪은 문제점들

## 1-1. docker 컨테이너끼리 별도의 처리 없이는 네트워크 연결이 안됨

## 1-2. 서버(node.js)와 mysql은 컨테이너 구동 완료 시간이 다르기 때문에 서버가 mysql보다 먼저 완료되면 db connection이 refuse되는 오류가 발생

# 2. 해결 방법

## 2-1. 1-1에 대한 해결 방법

도커느님께서는 이러한 경우에 대한 해결책으로 link라는 개념을 가지고 있었다. 하지만 link 개념은 더 이상 지원하지 않는 개념이므로 network를 사용했다.
어찌됐든 일단 제가 해결한 방법을 말하자면, docker-compose.yml 파일과 다른 파일들과의 상대적 경로를 확인은 아래에 파일 경로를 보면 되고

```
📦think
 ┣ 📂db
 ┃ ┣ 📂data
 ┃ ┣ 📂init
 ┃ ┃ ┗ 📜db.sql
 ┃ ┗ 📜.gitignore
 ┣ 📂server
 ┃ ┣ 📂dist
 ┃ ┣ 📂node_modules
 ┃ ┣ 📂src
 ┃ ┣ 📜.dockerignore
 ┃ ┣ 📜.env
 ┃ ┣ 📜.gitignore
 ┃ ┣ 📜docker-entrypoint.sh
 ┃ ┣ 📜Dockerfile
 ┃ ┣ 📜package-lock.json
 ┃ ┣ 📜package.json
 ┃ ┗ 📜tsconfig.json
 ┣ 📂web
 ┃ ┣ 📂node_modules
 ┃ ┣ 📂public
 ┃ ┣ 📂src
 ┃ ┣ 📜.babelrc
 ┃ ┣ 📜.dockerignore
 ┃ ┣ 📜.gitignore
 ┃ ┣ 📜Dockerfile
 ┃ ┣ 📜package-lock.json
 ┃ ┣ 📜package.json
 ┃ ┣ 📜README.md
 ┃ ┣ 📜tsconfig.json
 ┃ ┗ 📜yarn.lock
 ┣ 📜docker-compose.yml
 ┗ 📜README.md
```

실제 docker-compose.yml의 파일 내용은 이렇다!
일단, server와 web간의 통신을 위한 network는 docker-net이라는 network를 만들어 사용했고, server와 db간의 통신은 db-net이라는 network를 만들어 별도로 사용했다.
web와 db가 서버를 거치지 않고 통신하는 경우가 없다는 이유도 있고, 굳이 web과 db가 연결되게 할 필요가 없다는 이유도 있다. (상관 없을 수도 있지만... 혹시 다른 의견이 있으시면 댓글로 알려주세요...감사합니다!)

```yml
version: "3.5"
services:
    server:
        build:
            context: ./server
        restart: always
        ports:
            - 8080:8080
        networks:
            - docker-net
            - db-net
        depends_on:
            - db
        env_file:
            - ./server/.env
    web:
        build:
            context: ./web
        stdin_open: true
        tty: true
        ports:
            - 8085:3000
        networks:
            - docker-net
    db:
        image: mysql:8.0.20
        command: mysqld --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
        restart: always
        volumes:
            - ./db/init:/docker-entrypoint-initdb.d
            - ./db/data:/var/lib/mysql
        environment:
            MYSQL_ROOT_PASSWORD: root
        networks:
            - db-net
        ports:
            - 8086:3306

networks:
    docker-net:
    db-net:
```

이렇게 docker-compose.yml 파일을 만들고 각각을 web, server를 각각 실행시키기 위한 Dockerfile도 완성이 됐다면 docker-compose up을 터미널에 입력해서 docker의 실행사항을 직접 확인해볼 수 있다. 여기서 오류가 난다면 무언가 잘못된거겠죠?? 일단 이렇게만 진행을 하게 되면 web과 server 사이에는 통신이 원활히 진행되지만 server가 db를 connect할 때 ECONNREFUSED 에러가 뜨는 것을 확인할 수 있다.

그렇다면 이 에러는 어떻게 해결할 수 있을까??

## 3-2. 2-2에 대한 해결 방법

이 에러가 처음 발생했을 때 이건 또 무엇인가... 하면서 디버깅을 해봤는 데 최종적으로 다다른 결론은 db 컨테이너가 구동 완료된 시점보다 server 컨테이너가 구동 완료된 시점이 빨랐기 때문이었다. server 컨테이너는 이미 구동이 완료되어 mysql에 연결 시도를 하지만 db 컨테이너는 아직 구동이 완료되지 않았기 때문에 connection이 refused 된 것이었다. 이에 대한 해결방법은 server를 실행하기 전에 db 서버의 구동 완료를 확인하는 것이다.

위의 파일 경로에서 server/docker-entrypoint.sh 파일의 코드를 보자.
dockerize라는 프로그램은 도커 컨테이너의 실행순서를 결정해줄 수 있는 프로그램이다.
이로 인해 db 컨테이너의 구동을 확인하고 server를 실행시킬 수 있다.

```shell
echo "wait db server"
dockerize -wait tcp://db:3306 -timeout 20s

echo "start node server"
nodemon ./dist/
```

위의 쉘 스크립트 파일을 server의 Dockerfile에서 구동시키면 db서버의 연결이 가능할 때까지 기다리고 node.js server가 실행된다.

server Dockerfile의 코드를 보자.

```Dockerfile
FROM node:12.18.0

ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz


RUN npm install -g nodemon
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ./docker-entrypoint.sh

RUN npm run build

EXPOSE 8080
```

아래 코드는 dockerize를 설치하는 작업이다.

```shell
ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz
```

이렇게 코드를 짜면 server와 db 간의 network 연결과 connection 모두 작동된다.

# 3. 느낀 점

항상 느끼지만 코딩이란 건 오류를 해결해가는 과정인 것 같다. 2일 동안 이 문제로 끙끙거렸는 데, 항상 그렇듯 해결하고 나니 홀가분해지고 뿌듯함이 느껴진다. 혹시 똑같은 문제로 고통 받고 계시다면 이 글이 조금이나마 도움이 됐으면 한다.

## [참고]

-   https://jupiny.com/2016/11/13/conrtrol-container-startup-order-in-compose/
-   https://odysseyj.tistory.com/46
