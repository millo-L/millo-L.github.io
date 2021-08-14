---
author: millo
title: "[Docker] docker-compose (node.js, mysql) 실행 순서 동기화"
category: docker
layout: post
released_at: 2020-12-24 17:00
updated_at: 2021-03-05 18:34
image: ../../../../images/category/docker.png
series: none
lang: ko
tags:
    - docker
    - mysql
    - node.js
    - docker-compose
is_private: false
translation: /Synchronize-docker-compose-nodejs-mysql-execution-order/
translation_series: none
description: docker-compose에서 dockerize를 사용하여 node.js와 mysql의 실행 순서를 동기화해보자.
---

# 1. 서론

대부분의 경우 AWS의 RDS나 워크스테이션의 DB 등을 사용하여 안정적인 DB 환경을 구축하지만, 테스트 용도나 간단한 프로젝트에서 DB를 구현할 때는 Docker를 이용할 수 있다. 이러면 MySQL의 데이터가 안정적이지 않다고 하는 사람들도 있지만, 그 문제는 volume을 연결하는 방식으로 해결할 수 있다. 그런데 막상 docker-compose로 node.js 서버와 mysql을 연결해보면 연결 오류가 나는 걸 알 수 있다. 그 문제는 바로 실행 순서 때문인데, mysql이 node.js 서버보다 느리게 구동되기 때문이다. 이를 위해 node.js가 mysql보다 느리게 구동되도록 동기화하는 작업이 필요하다.

<span style="color:red">이 포스팅에서는 node.js와 mysql을 예시로 들었지만 다른 언어의 서버, 다른 언어의 DB 모두에 적용할 수 있다.</span>

# 2. 폴더 구조

위에서 언급한 것과 같이 /sync-docker/db/data 폴더는 mysql docker의 데이터 volume을 공유하는 폴더이다. 따라서, docker를 다시 실행하더라도 정보가 보존된다. 또한 /sync-docker/db/init 폴더의 init.sql을 생성하고 volume을 mysql docker와 공유하면 새로 시작할 때 초기의 DB와 Table들을 생성해둘 수 있다.

```
📦sync-docker
 ┣ 📂db
 ┃ ┣ 📂data
 ┃ ┣ 📂init
 ┃ ┃ ┗ 📜init.sql
 ┃ ┗ 📜.gitignore
 ┣ 📂server
 ┃ ┣ 📂node_modules
 ┃ ┣ 📜.dockerignore
 ┃ ┣ 📜.gitignore
 ┃ ┣ 📜docker-entrypoint.sh
 ┃ ┣ 📜Dockerfile
 ┃ ┣ 📜index.js
 ┃ ┣ 📜package-lock.json
 ┃ ┗ 📜package.json
 ┗ 📜docker-compose.yml
```

# 3. docker-compose.yml

우선, 실행되는 컨테이너 간 네트워크를 연결하기 위해선 반드시 docker의 network를 생성해야 한다. 이 부분은 설명이 길어지니 안다고 가정하고 넘어가겠다. 또한, server 컨테이너에서 생성한 network에 접속함과 동시에 depends_on을 사용해 db 컨테이너의 이름을 지정하면 된다. (여기서는 db 컨테이너의 이름을 'db'로 지정했다.)

db 컨테이너에서는 volumes 부분에서 위에서 언급한 /init, /data 폴더를 db 컨테이너 내부의 폴더와 연결한다. (데이터 보존 및 초기화를 위해) 또한, command 부분에서는 DB의 문자 체계를 utf8로 지정하고 있다.

```yml
# docker-compose.yml

version: "3.5"
services:
    server:
        build:
            context: ./server
        restart: always
        ports:
            - 8080:8080
        networks:
            - db-net
        depends_on:
            - db
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
    db-net:
```

# 4. node.js

기본적으로 /node_modules 폴더, package-lock.json, package.json, .gitignore 파일들은 node.js에서 항상 존재하는 것이므로 설명을 생략하겠다.

## 4-1. Dockerfile

아래의 Dockerfile에서 dockerize라는 모듈을 설치하는 데, 이 모듈은 docker-compose에서 docker 컨테이너 간의 실행 순서를 동기화하는 기능을 수행해준다. 설치를 마친 후에 docker-entrypoint.sh 파일을 컨테이너에서 실행시켜 실행 순서를 동기화시켜준다.

```Dockerfile
# Dockerfile for node.js

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

EXPOSE 8080
```

## 4-2. docker-entrypoint.sh

위의 Dockerfile에서 설치한 dockerize를 사용하는 shell script이다. 설치된 dockerize 모듈을 통해 db 컨테이너의 3306 포트가 연결될 때까지 즉, db 컨테이너가 구동 준비를 완료할 때까지 기다린 후 동작을 서버를 실행시킨다.

```shell
# docker-entrypoint.sh for node.js

echo "wait db server"
dockerize -wait tcp://db:3306 -timeout 20s

echo "start node server"
nodemon index.js
```

## 4-3. .dockerignore

docker 컨테이너에 복사되지 않아야 하는 폴더 또는 파일을 지정한다.

```bash
# .dockerignore for node.js

.gitignore
/node_modules
```

## 4-4. index.js

node.js docker 컨테이너에서 실행될 node.js 파일이다. mysql2 모듈을 설치해야 한다.

```bash
npm install --save mysql2
```

mysql의 연결이 제대로 진행됐는지 여부를 판단할 수 있게 코드를 작성했다. 아래의 host의 값은 docker-compose.yml에서 db 컨테이너의 이름을 변경하면 임의로 변경할 수 있고, password 값은 위의 docker-compose.yml에서 MYSQL_ROOT_PASSWORD의 값을 변경하면 임의로 변경할 수 있다.
또한, database도 아래의 MySQL 파트에서 init.sql을 임의로 수정하면 변경할 수 있다.

```js
// index.js

const mysql = require("mysql2/promise");

const dbConnect = async () => {
    try {
        const connection = await mysql.createConnection({
            host: "db",
            user: "root",
            password: "root",
            database: "SampleDB",
        });

        console.log("mysql connection success");
    } catch (error) {
        console.log(error);
    }
};

dbConnect();
```

# 5. MySQL

mysql은 별도의 파일이 많이 존재하지 않으므로 초기화를 위한 init.sql만 설명하도록 하겠다. DB의 이름은 SampleDB로 지정했고, 문자 체계는 utf8로 지정했다.

```sql
CREATE DATABASE SampleDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE SampleDB;

CREATE TABLE User (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL,
    PRIMARY KEY(id)
);
```

# [GitHub]

-   https://github.com/millo-L/nodejs-mysql-dockerize

# [참고]

-   https://docs.docker.com/compose/
-   https://jupiny.com/2016/11/13/conrtrol-container-startup-order-in-compose/
-   https://odysseyj.tistory.com/46
