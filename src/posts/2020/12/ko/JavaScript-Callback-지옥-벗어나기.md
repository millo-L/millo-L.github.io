---
author: millo
title: "[JavaScript] Callback 지옥 벗어나기"
category: javascript
layout: post
released_at: 2020-12-28 17:00
updated_at:
image: ../../../../images/category/javascript.jpg
series: none
lang: ko
tags:
    - javascript
    - async/await
    - promise
is_private: false
translation:
translation_series: none
description: javascript callback 지옥에서 벗어나기 위해 promise와 async/await를 사용해보자.
---

# 1. 서론

JavaScript는 매우 유연하고 편리한 비동기식 언어이다. 글쓴이도 JavaScript 생태계를 매우 좋아하며 ReactJS, Node.js 등을 자주 사용하고 있다. (최근에는 Go로 갈아타려고 공부중이만..크흠) 정말 편리하고 좋은 언어인 JavaScript에서 가장 불편한 점이 있다면 바로 **Callback 지옥**일 것이다. 비동기 언어를 동기식으로 처리하려다 보니 Callback 안에 Callback 안에 Callback 안에 Callback이... 이러한 Callback 지옥은 **코드 가독성을 떨어뜨려 협업에서 치명적**인 것은 물론이거니와... **자신이 짠 코드마저 2주 뒤에 다시 보면 암호 해석을 해야하는 상황**이 발생하게 된다. 이러한 문제점에 대한 해결책으로 나온 것이 **Promise**이고 이 마저도 코드 가독성을 떨어뜨리기 시작하자 **async/await**를 함께 사용하는 처리가 대세가 되고 있다.

## 1-1. JavaScript에서 코드가 비동기로 작동하는 경우

-   서버 API 호출
-   DB 호출
-   setTimeout 함수
-   무한 루프 또는 매우 많은 루프

# 2. Promise

JavaScript의 Callback 지옥을 해결하기 위한 첫 번째 방안인 Promise이다. Promise 내부에 코드를 작성해 코드가 **정상적으로 작동한다면 resolve**, **비정상적으로 작동한다면 reject**로 코드 작성자가 지정할 수 있으며, 해당 Promise를 할당 받은 변수에서 **.then().catch().finally 등으로 결과 값을 처리**할 수 있다.

### 2-1. Promise의 상태

-   Promise는 다음 중 하나의 상태를 가진다.
    -   **pending**: 초기 상태
    -   **fullfilled**: 연산이 성공적으로 완료된 상태
    -   **rejected**: 연산이 실패한 상태
-   **주의할 점**
    **_프로미스는 대기 중이지 않으며 fullfilled 또는 rejected됐을 때 처리(settled)됐다고 말한다._**

![](../../../../images/2020/12/promises.png)

## 2-2. Promise의 method

### 1. Promise.all(iterable)

-   iterable 내의 모든 Promise가 fullfilled되면 resolve한다. 만약, 어떤 프로미스가 rejected되면 즉시 reject를 반환한다.
-   다시 말해, Promise 배열을 iterable 파라미터로써 입력하면 rejected가 없는 한 해당 Promise들의 **모든 결과들을 각각 반환**한다. (**각각의 Promise들은 비동기적으로 작동한다.**)

### 2. Promise.race(iterable)

-   iterable 내의 어떤 프로미스가 fullfilled하거나 rejected하는 즉시 스스로 resolve하거나 reject하는 프로미스를 반환한다.
-   다시 말해, Promise 배열을 iterable 파라미터로써 입력하면 **가장 빠르게 실행된 한 Promise의 결과만을 반환**한다.

### 3. Promise.reject()

-   주어진 이유로 rejected하는 Promise 객체를 반환한다.

### 4. Promise.resolve()

-   주어진 값으로 fullfilled하는 Promise 객체를 반환한다.

## 2-3. Promise의 Prototype

### 1. Promise.prototype.then()

-   Promise에서 resolve된 value를 처리한다.

### 2. Promise.prototype.catch()

-   Promise에서 reject된 error를 처리한다.

### 3. Promise.prototype.finally()

-   Promise에서 resolve인지 reject인지 상관없이 동작한다.

## 2-4. Promise 예시

2초가 지난 후 0 ~ 9까지의 랜덤한 수를 생성한 후 짝수면 값을 반환하고 홀수면 에러를 반환하는 코드를 Promise를 사용해서 작성해보자.

```js
const isRandomNumberEven = new Promise((resolve, reject) => {
    setTimeout(() => {
        let random = Math.floor(Math.random() * 10)
        if (random % 2 === 0) {
            resolve(random)
        } else {
            reject(new Error("The random number is odd"))
        }
    }, 2000)
})

isRandomNumberEven
    .then(random => {
        // 짝수이면
        console.log(`random number is ${random}`)
    })
    .catch(error => {
        // 홀수이면
        console.log(error)
    })
    .finally(() => {
        // 짝수이든 홀수이든
        console.log(
            "The handler is called when the promise is settled, whether fulfilled or rejected."
        )
    })
```

Promise를 사용하며 주의해야할 점은 **Promise가 생성되자마자 Promise 내부 코드가 실행된다**는 점이다.
위의 코드에서 Promise의 내부 코드는 isRandomNumberEven.then()... 부분에 실행되는 것이 아니고 new Promise()... 부분에서 바로 실행된다. isRandomNumberEven.then()... 부분에서는 그저 Promise의 내부 코드가 동작한 결과만을 가지고 있을 뿐이다. 이를 항상 생각하면서 **불필요하게 Promise가 동작하지 않게 주의**해야 한다.

# 3. async/await

위의 Promise를 사용하면 비동기식으로 동작하는 코드들을 정리할 수 있을 것 같았지만... Promise가 코드 내에서 굉장히 많이 사용되면서 오히려 가독성이 떨어지는 상황이 발생했다. **Callback 지옥을 해결하니 Promise 지옥이 펼쳐진 셈**이다. 그래서 나온 Callback 지옥을 해결하기 위한 두 번째 해결책이 **async/await** 이다.
주의해야할 점은 **await는 async 함수 내부에서만 사용 가능하다는 점**이다.
사용법은 정말 간단하다.

## 3-1. async

먼저, async 함수의 사용법이다. 함수 선언 앞에 async만 붙여주면 된다. 그 후 처리 방법은 Promise.then().catch().finally()와 동일하다.

```js
async function func() {
    return 1
}
func().then(alert) // 1

const fun = async () => {
    return 2
}
fun().then(alert) // 2
```

## 3-2. await

async 함수 내에서 Promise의 값이 반환될 때까지 기다리는 코드이다.

## 3-3. async/await 예시

### 공통 사용 함수

```js
function resolveAfter2Seconds() {
    console.log("starting slow promise")
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("slow")
            console.log("slow promise is done")
        }, 2000)
    })
}

function resolveAfter1Second() {
    console.log("starting fast promise")
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("fast")
            console.log("fast promise is done")
        }, 1000)
    })
}
```

### 1. 동기 처리

아래의 sequentialStart() 함수에서는 **slow와 fast 모두 await가 걸려있기 때문에 동기적으로 처리**되어 모든 값이 나오기 위해 3초가 소모된다.

```js
async function sequentialStart() {
    console.log("==SEQUENTIAL START==")

    // 1. Execution gets here almost instantly
    const slow = await resolveAfter2Seconds()
    console.log(slow) // 2. this runs 2 seconds after 1.

    const fast = await resolveAfter1Second()
    console.log(fast) // 3. this runs 3 seconds after 1.
}
sequentialStart()
// after 2 seconds, logs "slow", then after 1 more second, "fast"
```

### 2. 각각의 Promise 비동기 처리 후 반환만 동기 처리

아래의 concurrentStart() 함수에서는 **slow와 fast가 비동기적으로 실행**됐으나 **await slow가 먼저 실행되므로 fast는 실행이 완료된 후 기다렸다가 출력**된다.

```js
async function concurrentStart() {
    console.log("==CONCURRENT START with await==")
    const slow = resolveAfter2Seconds() // starts timer immediately
    const fast = resolveAfter1Second() // starts timer immediately

    // 1. Execution gets here almost instantly
    console.log(await slow) // 2. this runs 2 seconds after 1.
    console.log(await fast) // 3. this runs 2 seconds after 1., immediately after 2., since fast is already resolved
}
concurrentStart()
// after 2 seconds, logs "slow" and then "fast"
```

### 3. Promise.all(iterable) Method를 이용한 각각의 Promise 비동기 처리 후 반환만 동기 처리

아래의 concurrentPromise() 함수에서는 위의 2-2.1 에서 알아봤던 **Promise.all(iterable) Method를 사용**하여 Promise들을 비동기적으로 실행한 것이다. Promise들 중 **가장 오래 걸리는 Promise가 종료된 후 모든 결과값이 반환**된다.

```js
function concurrentPromise() {
    console.log("==CONCURRENT START with Promise.all==")
    return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then(
        messages => {
            console.log(messages[0]) // slow
            console.log(messages[1]) // fast
        }
    )
}
concurrentPromise()
// same as concurrentStart
```

### 4. 각각의 Promise 비동기 처리 후 전체 종료를 동기 처리

아래의 paraller 함수는 각각의 Promise의 **반환값을 비동기적으로 반환**한 후 **가장 오래 걸리는 Promise가 종료되는 것을 await를 사용해서 동기적으로 처리**했다.

```js
async function parallel() {
    console.log("==PARALLEL with await Promise.all==")

    // Start 2 "jobs" in parallel and wait for both of them to complete
    await Promise.all([
        (async () => console.log(await resolveAfter2Seconds()))(),
        (async () => console.log(await resolveAfter1Second()))(),
    ])
}
parallel()
// truly parallel: after 1 second, logs "fast", then after 1 more second, "slow"
```

## 3-4. 예외처리

기존의 Promise의 경우 예외처리를 .catch() 체인으로 진행했지만 async/await에서는 예외처리를 try-catch-finally 구문으로 진행할 수 있다.

```js
// 기존 방식
function getProcessedData(url) {
    return downloadData(url) // returns a promise
        .catch(e => {
            return downloadFallbackData(url) // returns a promise
        })
        .then(v => {
            return processDataInWorker(v) // returns a promise
        })
}
// async/await 방식
async function getProcessedData(url) {
    let v
    try {
        v = await downloadData(url)
    } catch (e) {
        v = await downloadFallbackData(url)
    }
    return processDataInWorker(v)
}
```

# 4. 느낀 점

의미전달을 명확히 하고 싶고 정확한 정보만을 기록하고 싶은 마음에 검색들을 진행한 후 포스트를 작성했다. 작성하다보니 최대한 쉽게 쓰고 싶었지만 딱딱한 전달체를 벗어나기는 힘든 것 같다. 남들에게 말로 설명할 때랑 글로 설명할 때는 확연히 다르다는 걸 매번 깨닫는 것 같다. 이어서 Promise와 async/await는 JavaScript에서 없어서는 안될 비동기의 꽃이라고 불리는 처리 방식이므로 JavaScript 생태계에 머무는 사람이라면 반드시 숙지하고 있어야할 부분이다. 나도 이를 정리함으로써 한 번 더 유용성과 활용 방식에 대해서 배울 수 있었다. 이 포스트가 미래의 나 또는 JavaScript를 처음 시작하거나 Callback 지옥에서 헤어나오지 못하는 사람들에게 도움이 됐으면 한다.

# [참고]

-   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
-   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
