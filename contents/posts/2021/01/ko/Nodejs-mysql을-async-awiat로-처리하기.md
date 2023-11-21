---
author: millo
title: "[Node.js] mysql을 async/await로 처리하기"
category: nodejs
layout: post
released_at: 2021-01-29 14:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: none
lang: ko
tags:
    - nodejs
    - "async/await"
    - MySQL
    - mysql2
is_private: false
translation:
translation_series: none
description: nodejs에서 mysql2.js로 async/await로 mysql connection을 사용해보자.
---

## 1. 서론

node.js 에서 콜백 지옥을 피하기 위해서는 Promise 또는 async/await를 써야 한다. 이때 Promise를 선택하게 되면 다시 Promise chain의 콜백 지옥에 빠지게 된다. 그래서 대부분의 사람들이 사용하는 처리 방식이 async/await이다.(물론, Promise와 함께 사용하는 경우도 많다.) mysql도 이러한 async/await 방식으로 구현할 수 있다. 다만, 사용하는 모듈은 mysql 모듈이 아니고, mysql2 모듈이다. 다른 모듈이므로 반드시 mysql2를 설치해야한다. mysql은 async/await 방식 사용이 불가능하다. 만약, async/await에 대한 이해가 아직 부족하다면 이 포스팅을 읽고 오기 바란다.

## 2. 환경 설정

> **전제 조건** <br/>
> mysql은 기본적으로 설치되어 있다고 가정한다. <br/>
> 로컬 환경에 mysql이 깔려있지 않은 경우 [여기](https://dev.mysql.com/downloads/installer/)로 들어가 설치하기 바란다. <br/>
> 또한, 당연히 원격이나 docker를 이용한 MySQL을 이용해도 무방하다.

node.js에서 mysql2 모듈을 테스트할 폴더를 생성하고 해당 폴더에 package.json을 생성한 후 mysql2를 설치한다.

```bash
mkdir mysql2_practice
cd mysql2_practice

npm init -y

npm install mysql2
```

로컬 또는 원격 MySQL에 아래의 예시 DB 및 테이블을 생성한다.

```sql
// init.sql
// init sample DB and example TABLE

CREATE DATABASE sample;

USE sample;

CREATE TABLE example(
	id INT NOT NULL AUTO_INCREMENT,
      name VARCAHR(32) NOT NULL,
      PRIMARY KEY(id)
);
```

## 3. mysql2를 async/await로 구현하기

아래의 코드는 mysql2를 사용하여 mysql에 connection 한 뒤 SELECT, INSERT, UPDATE, DELETE가 이루어지는 결과를 console.log로 찍어보는 코드이다. async/await를 사용하니 기본의 mysql을 모듈을 사용할 때보다 훨씬 가독성이 증가하는 것을 알 수 있다. async/await의 장점은 코드를 읽는 순서로 실행되게 한다는 것이다. 간단한 예시이지만 이 코드를 이용해서 다른 코드를 작성하는 데 큰 어려움은 없을 것이다.

```js
// mysql.js

const mysql = require("mysql2/promise")
let connection;
let insertId;

const db = async () => {
    try {
        // db connection
        connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "1q2w3e4r!@",
            database: "sample",
        })

        // Select all rows from example table
        let [rows, fields] = await connection.query("SELECT * FROM example")
        console.log(rows)
    } catch (e) {
        console.log(e)
    }
    try {
        // insert data
        let data = {
            name: "sample0",
        }

        // insert data into example table
        let [results] = await connection.query(
            "INSERT INTO example SET ?",
            data
        )
        // inserted data's id(auto_increment)
        insertId = results.insertId

        // Select all rows from example table
        let [rows, fields] = await connection.query("SELECT * FROM example")
        console.log(rows)
    catch (e) {
        console.log(e)
    }
    try {
        // update row
        let [results] = await connection.query("UPDATE example SET name=? WHERE id=?", [
            "updated_sample",
            insertId,
        ])

        // Select all rows from example table
        let [rows, fields] = await connection.query("SELECT * FROM example")
        console.log(rows)
    } catch (e) {
        console.log(e)
    }
    try {
        // delete row
        let [results] = await connection.query("DELETE FROM example WHERE id=?", [insertId])

        // Select all rows from example table
        let [rows, fields] = await connection.query("SELECT * FROM example")
        console.log(rows)
    } catch (e) {
        console.log(e)
    }
}

db()
```

## [참고]

-   https://www.npmjs.com/package/mysql2
-   https://millo-l.github.io/JavaScript-Callback-%EC%A7%80%EC%98%A5-%EB%B2%97%EC%96%B4%EB%82%98%EA%B8%B0/
