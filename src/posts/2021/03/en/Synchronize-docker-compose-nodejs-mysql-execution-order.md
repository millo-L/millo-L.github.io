---
author: millo
title: "[Docker] Synchronize docker-compose (node.js, mysql) execution order"
category: docker
layout: post
released_at: 2021-03-05 17:00
updated_at:
image: ../../../../images/category/docker.png
series: none
lang: en
tags:
    - docker
    - mysql
    - node.js
    - docker-compose
is_private: false
translation: /docker-compose-nodejs-mysql-실행-순서-동기화/
translation_series: none
description: In docker-compose, use dockerize to synchronize the run order of node.js and mysql.
---

# 1. Introduction

In most cases, a stable DB environment is established using AWS' RDS or workstation internal DB, but Docker is available when implementing DB for testing purposes or simple projects. Some people say MySQL's data is not stable, but the problem can be solved by connecting volumes. However, if you connect node.js server and mysql with docker-compose, you can see that there is a connection error. The problem is that mysql runs slower than node.js servers. This requires synchronizing node.js to run slower than mysql.

<span style="color:red">In this posting, node.js and mysql are examples, but can be applied to both servers in different languages and DBs in different languages.</span>

# 2. Folder Structure

As mentioned above, the /sync-docker/db/data folder is a folder that shares the data volume of the mysql docker. Therefore, the information is preserved even if the docker is re-run. In addition, by creating init.sql of the /sync-docker/db/init folder and sharing the volume with mysql docker, the initial DB and tables can be created on a fresh start.

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

First of all, it is essential to create a docker's network to connect the network between containers that are running. This part is explained for a long time, so I'll assume that you know. You can also name the db container in the depends_on portion of the server container and name the network created in the network portion. (where we named the db container 'db')

In the db container, the folder /init and /data mentioned above is associated with the folder inside the db container in the volume section. (For data retention and initialization) In addition, the command section specifies the DB's character scheme as utf8.

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

By default, the /node_modules folder, package-lock.json, package.json, and .gitignore files are always present in node.js, so we will omit the description.

## 4-1. Dockerfile

In the Dockerfile below, a module called **dockerize** is installed, which performs the function of synchronizing the run order between docker containers in docker-compose. After installation, the docker-entrypoint.sh file is run from the container to synchronize the execution sequence.

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

Shell script using dockerize installed in Dockerfile above. It waits until the 3306 port of the db container is connected through the installed dockerize module, i.e., until the db container is ready for operation, and then runs the operation server.

```shell
# docker-entrypoint.sh for node.js

echo "wait db server"
dockerize -wait tcp://db:3306 -timeout 20s

echo "start node server"
nodemon index.js
```

## 4-3. .dockerignore

Specify a folder or file that should not be copied to the docker container.

```bash
# .dockerignore for node.js

.gitignore
/node_modules
```

## 4-4. index.js

The node.js file to run in the node.js docker container. The mysql2 module shall be installed.

```bash
npm install --save mysql2
```

The code was written to determine whether mysql's connection was properly processed. The value of the host below can be changed arbitrarily by changing the name of the db container in docker-compose.yml, and the password value can be changed arbitrarily by changing the value of MYSQL_ROOT_PASSWORD in docker-compose.yml above.
The database can also be changed by arbitrarily modifying init.sql in the MySQL part below.

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

Since mysql does not have many separate files, I will only explain init.sql for initialization. The DB was named SampleDB and the character scheme was utf8.

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

# [Referebces]

-   https://docs.docker.com/compose/
-   https://jupiny.com/2016/11/13/conrtrol-container-startup-order-in-compose/
-   https://odysseyj.tistory.com/46
