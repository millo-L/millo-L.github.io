---
author: millo
title: "[JavaScript] Date 객체 사용하기"
category: javascript
layout: post
released_at: 2021-01-30 14:00
updated_at:
image: ../../../../images/category/javascript.jpg
series: none
lang: ko
tags:
    - javascript
    - date
    - 날짜 계산
    - 시간 계산
is_private: false
translation:
translation_series:
description: javascript의 Date 객체를 사용해서 시간과 날짜를 출력해보자.
---

## 1. 서론

[지난 포스팅](https://millo-L.github.io/Nodejs-moment-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/)에서는 node.js에서 moment.js 모듈을 사용하는 방법에 대해서 소개했다. 이번에는 JavaScript의 기본 내장 객체인 Date 객체에 대해 알아보도록 하자.

## 2. Date 객체 사용하기

### 2-1. 현재 날짜: new Date()

```js
let now = new Date();
console.log(now); // Sat Jan 30 12:24:00 GMT+0900 (대한민국 표준시)
```

### 2-2. 특정 날짜 지정

```js
// Sat Jan 30 03:24:00 GMT+0900 (대한민국 표준시)

console.log(new Date("January 30, 2021 03:24:00"));
console.log(new Date("20201-01-30T03:24:00"));
console.log(new Date(2021, 01, 30)); // the month is 0-indexed
console.log(new Date(2021, 01, 30, 3, 24, 0));
console.log(new Date(1611944640)); // passing epoch timestamp
```

### 2-3. UNIX 시간으로 나타내기

#### 현재 시간

```js
let now = Date.now(); // 1611976260
console.log(new Date(now)); // Sat Jan 30 12:11:00 GMT+0900 (대한민국 표준시)
```

#### 특정 시간

```js
console.log(Date.parse("2020-01-01")); // 1577804400
console.log(Date.parse("2020-01-01 12:00:00")); // 1577847600
```

### 2-4. 년, 월, 일, 요일, 시간 받아오기

#### 년: getFullYear()

```js
let date = new Date("2021-01-30");
console.log(date.getFullYear()); // 2021
```

#### 월: getMonth()

1월(0) ~ 12월(11)로 정수를 반환한다.

```js
let date = new Date("2021-01-30");
console.log(date.getMonth()); // 0
```

#### 일: getDate()

1일(1) ~ 31일(31)로 정수를 반환한다.

```js
let date = new Date("2021-01-30");
console.log(date.getDate()); // 30
```

#### 년, 월, 일 한 번에 받기

```js
let specificDate = new Date("2021-01-30");
let [year, month, date] = specificDate
    .toLocaleDateString("ko-KR")
    .split("/")[0]
    .split("-");
console.log(`${year}-${month}-${date}`); // 2021-01-30
```

#### 요일: getDay()

일(0) ~ 토(6)로 정수를 반환한다.

```js
let date = new Date("2021-01-30");
console.log(date.getDay()); // 6
```

#### 시: getHours()

```js
let date = new Date("2021-01-30 12:00:00");
console.log(date.getHours()); // 12
```

#### 분: getMinutes

```js
let date = new Date("2021-01-30 12:30:00");
console.log(date.getMinutes()); // 30
```

#### 초: getSeconds

```js
let date = new Date("2021-01-30 12:00:12");
console.log(date.getSeconds()); // 12
```

#### 시, 분, 초 한 번에 받기

```js
let specificDate = new Date("2020-01-30 12:23:34");
let [hour, minute, second] = specificDate
    .toLocaleTimeString("ko-KR")
    .split(/:| /);
console.log(`${hour}:${minute}:${second}`); // 12:23:34
```

## [참고]

-   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
