---
author: millo
title: "[Node.js] nodemailer 사용하기"
category: nodejs
layout: post
released_at: 2021-01-29 13:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: none
lang: ko
tags:
    - nodejs
    - mail
    - nodemailer
    - google
is_private: false
translation:
translation_series: none
description: nodejs에서 nodemailer를 사용하여 이메일을 송신을 구현해보자.
---

## 1. 서론

nodemailer는 node.js 서버를 이용하여 mail을 보낼 수 있게 해주는 모듈이다. 대체적으로 node.js 서버를 구현할 때 개인정보 인증으로 이메일 인증을 진행할 때 많이 사용한다. 글쓴이도 사용자 회원가입 후 이메일 인증 그리고 비밀번호 변경 시에 nodemailer를 이용하여 이메일 인증 기능을 구현한 적이 있다. nodemailer는 gmail 계정이 존재해야 사용할 수 있다.(이메일을 보낼 계정이 있어야 하므로) 구현 자체는 어렵지 않으나 gmail 계정의 설정을 변경해야 한다.

## 2. Gmail 계정 설정

> **전제 조건** <br />
> Gmail 계정이 존재한다고 가정한다.

nodemailer의 계정으로 사용할 계정으로 google 로그인을 진행한 후 아래의 첫 번째 링크를 클릭하여 액세스를 허용시킨다. 첫 번째 만으로 되는 경우도 있지만 간혹 제대로 nodemailer가 작동하지 않는 경우는 아래의 두 번째 링크 또한 허용하기 바란다.

-   https://myaccount.google.com/lesssecureapps
-   https://accounts.google.com/b/0/DisplayUnlockCaptcha

## 3. nodemailer로 이메일 전송하기

우선 이메일을 보낼 transport를 생성하고 mail을 보낼 수 있다. 첨부 파일 등의 기능도 존재하지만 이번 글에서는 이메일의 제목과 내용을 보내는 코드만 작성했다.

```js
// email.js

const nodemailer = require("nodemailer");

// 본인 Gmail 계정
const EMAIL = "your_gmail_account@gmail.com";
const EMAIL_PW = "your_gmail_password";

// 이메일 수신자
let receiverEmail = "receiver's email";

// transport 생성
let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL,
        pass: EMAIL_PW,
    },
});

// 전송할 email 내용 작성
let mailOptions = {
    from: EMAIL,
    to: receiverEmail,
    subject: "[nodemailer] Sample Email",
    html: "<h1>Hello, World!</h1>",
};

// email 전송
transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log(info);
    console.log("send mail success!");
});
```

## [참고]

-   https://nodemailer.com/about/
