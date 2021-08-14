---
author: millo
title: "[Node.js] moment 사용하기"
category: nodejs
layout: post
released_at: 2021-01-27 22:00
updated_at:
image: ../../../../images/category/nodejs.jpg
series: none
lang: ko
tags:
    - nodejs
    - javascript
    - moment
is_private: false
translation:
translation_series: none
description: nodejs에서 moment.js를 사용해보자.
---

# 1. 서론

node.js는 javascript 기반으로 기본적으로 시간 및 날짜 오브젝트인 Date를 가지고 있다. 하지만 Date 오브젝트를 사용하여 코드를 작성하면 가독성이 떨어지는 경우가 생겨 moment.js를 사용하는 경우가 있다. 물론 성능과 속도 측면에서 보면 moment가 뒤쳐질 수 있으나 경우에 따라서 개발자가 잘 결정해서 사용하는 것이 중요하다.

# 2. 환경 설정

우선, moment.js를 설치하고 실행할 폴더를 생성하고, 해당 폴더에 package.json 생성 및 moment.js 설치를 진행한다.

```bash
# 폴더 생성 및 열기
mkdir moment_practice
cd moment_practice

# package.json 초기화
npm init -y

# moment.js 설치
npm install moment
```

# moment.js 사용하기

## 3-1. 현재 날짜: moment()

```js
// moment_practice.js

const moment = require("moment");

// 현재 날짜
console.log("========== today ==========");
console.log(moment());
```

## 3-2. 특정 날짜 지정: moment('date')

```js
// 특정 날짜 지정
console.log("========== specific date ==========");
console.log(moment("2021-01-27", "YYYY-MM-DD")); // Moment<2021-01-27T00:00:00+09:00>
```

## 3-3. 형식 지정: format()

```js
// 현재 날짜 형식 지정
console.log("========== format ==========");
let date = moment("2021-01-27");
// 년-월-일
console.log(date.format("YYYY-MM-DD")); // 2021-01-27
// 시:분:초
console.log(date.format("HH:mm:ss")); // 00:00:00
// 요일
console.log(date.format("dddd")); // Wednesday
// 년-월-일 요일
console.log(date.format("YYYY-MM-DD dddd")); // 2021-01-27
// 년-월-일 시:분:초
console.log(date.format("YYYY-MM-DD HH:mm:ss")); // 2021-01-27 00:00:00
// 년-월-일 요일 시:분:초
console.log(date.format("YYYY-MM-DD dddd HH:mm:ss")); // 2021-01-27 Wednesday 00:00:00
```

## 3-4. 날짜 더하거나 빼기: add(), subtract()

```js
// 날짜 더하거나 빼기
console.log("========== add or subtract day, month, year ==========");
console.log(moment("2021-01-27").add(1, "days")); // 2021-01-28
console.log(moment("2021-01-27").add(2, "months")); // 2021-03-27
console.log(moment("2021-01-27").add(2, "years")); // 2023-01-27
console.log(moment("2021-01-27").subtract(1, "days")); // 2021-01-26
console.log(moment("2021-01-27").subtract(2, "months")); // 2020-11-27
console.log(moment("2021-01-27").subtract(2, "years")); // 2019-01-27
```

### 날짜 더하거나 뺄 때 생길 수 있는 문제점

한 moment 변수를 기준으로 날짜를 연속적으로 더하거나 빼게 되면 해당 변수도 add or subtract 함수를 실행하는 도중 값이 변하게 된다.

```js
// 날짜 더하고 뺄 때 문제점
console.log("========== problems when adding or subtracting dates ==========");
let now = moment("2021-01-27");
console.log(now.add(3, "days")); // 2021-01-30
console.log(now.subtract(5, "days")); // 2021-01-25
console.log(now); // 2021-01-25
```

### 해결 방법: clone()

add or subtract를 하기 전에 clone() 함수를 사용하면 된다.

```js
// 해결 방법
console.log("========== solutions to the above problems ==========");
let fixedNow = moment("2021-01-27");
console.log(fixedNow.clone().add(3, "days")); // 2021-01-30
console.log(fixedNow.clone().subtract(5, "days")); // 2021-01-22
console.log(fixedNow); // 2021-01-27
```

## 3-5. 시간 순서 비교

### isBefore(): moment()의 날짜가 isBefore 파라미터 날짜보다 이전인지 여부

```js
// isBefore: moment()의 날짜가 isBefore 파라미터 날짜보다 이전인지 여부
console.log("========== isBefore ==========");
console.log(moment("2020-12-31").isBefore("2021-01-01")); // true
console.log(moment("2020-12-31").isBefore("2020-12-30")); // false
```

### isAfter(): moment()의 날짜가 isAfter의 파라미터 날짜보다 이후인지 여부

```js
// isAfter: moment()의 날짜가 isAfter의 파라미터 날짜보다 이후인지 여부
console.log("========== isAfter ==========");
console.log(moment("2020-12-31").isAfter("2021-01-01")); // false
console.log(moment("2020-12-31").isAfter("2020-12-30")); // true
```

### isSame(): moment()의 날짜가 isSame의 파라미터 날짜와 같은지 여부

```js
// isSame: moment()의 날짜가 isSame의 파라미터 날짜와 같은지 여부
console.log("========== isSame ==========");
console.log(moment("2020-12-31").isSame("2021-01-01")); // false
console.log(moment("2020-12-31").isSame("2020-12-31")); // true
```

### isSameOrBefore(): moment()의 날짜가 isSameOrBefore의 파라미터 날짜와 같거나 이후인지 여부

```js
// isSameOrBefore: moment()의 날짜가 isSameOrBefore의 파라미터 날짜와 같거나 이후인지 여부
console.log("========== isSameOrBefore ==========");
console.log(moment("2020-12-31").isSameOrBefore("2021-01-01")); // true
console.log(moment("2020-12-31").isSameOrBefore("2020-12-31")); // true
console.log(moment("2020-12-31").isSameOrBefore("2020-12-30")); // false
```

### isSameOrAfter(): moment()의 날짜가 isSameOrAfter의 파라미터 날짜와 같거나 이후인지 여부

```js
// isSameOrAfter: moment()의 날짜가 isSameOrAfter의 파라미터 날짜와 같거나 이후인지 여부
console.log("========== isSameOrAfter ==========");
console.log(moment("2020-12-31").isSameOrAfter("2021-01-01")); // false
console.log(moment("2020-12-31").isSameOrAfter("2020-12-31")); // true
console.log(moment("2020-12-31").isSameOrAfter("2020-12-30")); // true
```

### isBetween(): moment()의 날짜가 isBetween의 파라미터들 사이의 날짜인지 여부

isBetween의 첫 번째 파라미터는 항상 두 번쨰 파라미터보다 이전인 날짜여야 한다. 그렇지 않으면 결과가 제대로 출력되지 않는다.

```js
// isBetween: moment()의 날짜가 isBetween의 파라미터들 사이의 날짜인지 여부
console.log("========== isBetween ==========");
console.log(moment("2020-12-31").isBetween("2020-12-01", "2021-01-01")); // true
console.log(moment("2020-12-31").isBetween("2021-01-01", "2021-01-02")); // false

// isBetween의 첫 번째 파라미터는 항상 두 번쨰 파라미터보다 이전인 날짜여야 한다.
// 그렇지 않으면 항상 false
console.log(moment("2020-12-31").isBetween("2021-01-01", "2020-12-01")); // false
```

## 3-6. 시간 차이: diff()

moment()의 날짜를 기준으로 diff의 첫 번쨰 파라미터 날짜와의 차이를 두 번째 파라미터를 기준으로 계산하여 출력한다.

```js
// 시간의 차이
console.log("========== diff ==========");
console.log(moment("2020-12-31").diff("2020-12-30", "days")); // 1
console.log(moment("2020-12-30").diff("2020-12-31", "days")); // -1
console.log(moment("2020-12-31").diff("2020-12-30", "minute")); // 1440
console.log(moment("2020-12-30").diff("2020-12-31", "minute")); // -1440
```

# [참고]

-   https://momentjs.com/docs/
