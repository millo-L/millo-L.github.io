---
author: millo
title: "[Node.js] PBKDF2 비밀번호 암호화하기"
category: nodejs
layout: post
released_at: 2021-02-10 13:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: none
lang: ko
tags:
    - nodejs
    - crypto
    - PBKDF2
    - pbkdf2-password
    - 로그인
    - 비밀번호
    - 비밀번호 암호화
    - 회원가입
is_private: false
translation:
translation_series: none
description: nodejs에서 PBKDF2 암호화 방식을 사용해보자.
---

## 1. 서론

사용자들의 비밀번호 정보를 DB에 저장할 때는 반드시 암호화가 필요하다. 그러기 위한 가장 일반적인 방식이 바로 PBKDF2 방식이다. 오늘은 이 방식이 무엇인지? 그리고 node.js에서는 어떻게 구현할 수 있는지에 대해 알아보자.

## 2. PBKDF2(Password-Based Key Derivation Function Version 2)란?

PBKDF2는 미국 NIST에서 승인받은 사용자 패스워드를 기반으로 키(Key) 유도를 하기 위한 함수이다. 사용자 패스워드에 해시함수, 솔트(Salt), 반복 횟수 등을 지정하여 패스워드에 대한 다이제스트(Digest)를 생성하는 방식이다.

> **Salt란?** <br /> &nbsp;비밀번호를 암호화하기 위한 키 값 (절대 외부로 유출되서는 안됨) <br /> **Digest란?** <br /> &nbsp;비밀번호를 Salt로 암호화한 결과 값

## 3. PBKDF2로 비밀번호 암호화하기

이번 실습에서는 별도의 html 파일을 만들지 않고, 특정 문자열을 암호화해서 Salt와 Digest를 생성(회원가입 기능)하고, 다른 문자열을 Salt를 사용해서 암호화하여 일치하는 지 비교(로그인 기능)하는 과정을 통해 비밀번호를 암호화하여 생성하고 비교 방식에 대해 알아보도록 하자. 방식은 크게 pbkdf2-password라는 모듈을 설치해서 사용하는 방식과 node.js 기본 내장 함수는 crypto를 사용하는 방식 두 가지 모두 사용해보도록 하자.

### 3-1. 개발 환경 구축

우선, 실습을 진행할 폴더를 생성하고 필요한 모듈을 설치하도록 하자.

```bash
## 폴더 생성 및 열기
mkdir pbkdf2-practice
cd pbkdf2-practice

## package.json 생성
npm init -y

## 필요한 모듈 설치
npm install pbkdf2-password
```

### 3-2. pbkdf2-password 사용하기

우선, pbkdf2-password 모듈을 사용해보자. pbkdf2-password 모듈은 PBKDF2 방식을 사용하기 쉽게 생성한 방식이므로 사용하기가 매우 간단하다. 아래와 같이 회원가입 시에는 password만을 hasher의 파라미터로 넣어서 salt가 자동 생성되게 한 후 salt값을 DB에 digest와 함께 저장한다. 그 후 회원이 로그인을 요청할 때는 저장되어 있는 salt와 함께 암호화해본 후 기존의 암호화와 되어 있는 digest와 동일한 지 비교하여 비밀번호 일치 여부를 확인하면 된다.

```js
// index.js

const pbkdf2Password = require("pbkdf2-password");
const hasher = pbkdf2Password();

const password = "비밀번호486";

// password인 비밀번호486을 암호화
// 회원가입 때는 이와 같이 password만을 파라미터로 넣는다.
hasher({ password }, (error, pw, salt, hash) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log("암호화 된 비밀번호 '비밀번호486'");
    console.log("==============================================");
    console.log(hash);
    console.log("==============================================");
    console.log("암호화에 사용한 salt");
    console.log("==============================================");
    console.log(salt);
    console.log("==============================================");

    // password인 비밀번호485을 암호화
    // 로그인 때는 이와 같이 password와 저장되어 있는 salt를 같이 파라미터로 넣는다.
    hasher({ password: "비밀번호485", salt }, (error2, pw2, salt2, hash2) => {
        if (error2) {
            console.log(error2);
            return;
        }

        console.log("암호화 된 비밀번호 '비밀번호485'");
        console.log("==============================================");
        console.log(hash2);
        console.log("==============================================");

        if (hash === hash2) {
            console.log("로그인 성공!");
        } else {
            console.log("로그인 실패!");
        }
    });
});
```

### 3-3. crypto 사용하기

위의 모듈을 사용할 때와 다른 점이 있다면 salt도 직접 생성한다는 점과, pbkdf2 함수 내에서 암호화의 반복 횟수와 결괏값의 길이를 지정한다는 점이다. crypto도 PBKDF2 방식을 동일하게 지원하지만 위의 모듈은 그 방식을 사용자가 좀 더 쓰기 편하게 만들었고, 이 방식은 사용자가 좀 더 세밀하게 지정할 수 있게 해 놨다. 똑같은 암호화 방식이므로 뭐가 더 좋다 나쁘다 할 건 없는 것 같지만 차이점은 알고 쓰는 게 좋을 것 같다.

```js
// index.js

const crypto = require("crypto");

const password = "비밀번호486";

// 회원가입할 때
// salt 생성
crypto.randomBytes(64, (error, buf) => {
    if (error) {
        console.log(error);
        return;
    }
    const salt = buf.toString("base64");
    // 생성한 salt 기반으로 비밀번호 암호화
    crypto.pbkdf2(password, salt, 256, 64, "sha512", (err, key) => {
        if (err) {
            console.log(err);
            return;
        }
        const hash = key.toString("base64");

        // 로그인 시에 비밀번호 비교
        const pw = "비밀번호485";
        crypto.pbkdf2(pw, salt, 256, 64, "sha512", (err2, key2) => {
            if (err2) {
                console.log(err2);
                return;
            }

            const hash2 = key2.toString("base64");
            if (hash === hash2) {
                console.log("로그인 성공!");
            } else {
                console.log("로그인 실패!");
            }
        });
    });
});
```

## [참고]

-   https://nodejs.org/docs/latest-v12.x/api/crypto.html
-   https://www.npmjs.com/package/pbkdf2-password
