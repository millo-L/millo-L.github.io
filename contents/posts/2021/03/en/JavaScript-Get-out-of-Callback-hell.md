---
author: millo
title: "[JavaScript] Get out of Callback hell"
category: javascript
layout: post
released_at: 2021-03-05 19:30
updated_at:
image: ../../../../images/category/javascript.jpg
series: none
lang: en
tags:
    - javascript
    - async/await
    - promise
is_private: false
translation: /JavaScript-Callback-지옥-벗어나기/
translation_series: none
description: Let's use promise and async/await to get out of JavaScript Callback hell.
---

## 1. Introduction

JavaScript is a highly flexible and convenient asynchronous language. I like the JavaScript ecosystem very much, and I often use ReactJS, Node.js, etc. (Recently, I've been studying to transfer to Go.Hmmm) The most inconvenient thing about JavaScript, a really convenient and good language, is Callback Hell. I tried to synchronize JavaScript, which is an asynchronous language, but there was a callback in the callback, a callback in the callback... These Callback hells are not only fatal in collaboration, but also in a way that reduces code readability. If you look at even the code you made two weeks later, you will have to interpret it. The solution to these problems is Promise, and nevertheless, as code readability has begun to decline, the processing of using async/await together has become a trend.

### When code is acting asynchronously in JavaScript?

-   Call server API
-   DB Call
-   setTimeout function
-   Infinite loop or very many loops

## 2. Promise

Promise is the first way to solve JavaScript's Callback Hell. If the code is written inside Promise and works normally, resolve, reject can be specified by the code author, and .then().catch().Finally, the result value can be processed with the result value can be processed.

#### 2-1. Status of Promise

-   Promise has one of the following states.
    -   **pending**: Initial state
    -   **fullfilled**: Operations completed successfully
    -   **rejected**: Operations failed state

> **Note** <br /> A promise is said to be settled if it is either fulfilled or rejected, but not pending.

![](../../../../images/2020/12/promises.png)

### 2-2. Static methods of Promise

#### 1. Promise.all(iterable)

-   Wait for all promises to be resolved, or for any to be rejected.
-   If the returned promise resolves, it is resolved with an aggregating array of the values from the resolved promises, in the same order as defined in the iterable of multiple promises.
-   If it rejects, it is rejected with the reason from the first promise in the iterable that was rejected.
-   In other words, if the Promise array is entered as an itemable parameter, it returns all the results of each of the Promises unless rejected. (each Promise works asynchronously.)

#### 2. Promise.race(iterable)

-   Wait until any of the promises is resolved or rejected.
-   If the returned promise resolves, it is resolved with the value of the first promise in the iterable that resolved.
-   If it rejects, it is rejected with the reason from the first promise that was rejected.
-   In other words, inputting the Promise array as an enable parameter returns only the results of one Promise that ran the fastest.

#### 3. Promise.reject()

-   Returns a new Promise object that is rejected with the given reason.

#### 4. Promise.resolve()

-   Returns a new Promise object that is resolved with the given value.

### 2-3. Instance methods of Promise

#### 1. Promise.prototype.then()

-   Appends fulfillment and rejection handlers to the promise, and returns a new promise resolving to the return value of the called handler, or to its original settled value if the promise was not handled (i.e. if the relevant handler onFulfilled or onRejected is not a function).

#### 2. Promise.prototype.catch()

-   Appends a rejection handler callback to the promise, and returns a new promise resolving to the return value of the callback if it is called, or to its original fulfillment value if the promise is instead fulfilled.

#### 3. Promise.prototype.finally()

-   Appends a handler to the promise, and returns a new promise that is resolved when the original promise is resolved. The handler is called when the promise is settled, whether fulfilled or rejected.

### 2-4. Promise Exmaple

After 2 seconds, create a random number from 0 to 9, and write a code using Promise that returns an even sleep value and returns an odd sleep error.

```js
const isRandomNumberEven = new Promise((resolve, reject) => {
    setTimeout(() => {
        let random = Math.floor(Math.random() * 10);
        if (random % 2 === 0) {
            resolve(random);
        } else {
            reject(new Error("The random number is odd"));
        }
    }, 2000);
});

isRandomNumberEven
    .then(random => {
        // even
        console.log(`random number is ${random}`);
    })
    .catch(error => {
        // odd
        console.log(error);
    })
    .finally(() => {
        // whatever
        console.log(
            "The handler is called when the promise is settled, whether fulfilled or rejected."
        );
    });
```

**One thing to be careful about using Promise is that the Promise internal code runs as soon as Promise is created.**
In the code above, the internal code for Promise is isRandomNumberEven.then()... It does not run on part, but directly on part new Promise()... In the isRandomNumberEven.then()..., it only has the result of the internal code of Promise working. You should always think about this and be careful not to needlessly operate Promise.

## 3. async/await

With Promise above, I thought I could clean up the code that works asynchronously, but... Promise has been used so much in code that it is less readable. Solving Callback Hell, Promise Hell unfolds. So the second solution to solve the Callback hell is async/await.
It should be noted that awit is only available inside the async function.
It's really simple to use.

### 3-1. async

First, the use of the async function. All you have to do is put async before the function declaration. Subsequently, the processing method is same as Promise.then().catch().finally().

```js
async function func() {
    return 1;
}
func().then(alert); // 1

const fun = async () => {
    return 2;
};
fun().then(alert); // 2
```

### 3-2. await

A code that waits for the value of Promise to be returned within the async function.

### 3-3. async/await Example

#### Common Usage Functions

```js
function resolveAfter2Seconds() {
    console.log("starting slow promise");
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("slow");
            console.log("slow promise is done");
        }, 2000);
    });
}

function resolveAfter1Second() {
    console.log("starting fast promise");
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("fast");
            console.log("fast promise is done");
        }, 1000);
    });
}
```

#### 1. Sync Processing

In the sequentialStart() function below, both slow and fast are handled synchronously, which takes three seconds to produce all the values.

```js
async function sequentialStart() {
    console.log("==SEQUENTIAL START==");

    // 1. Execution gets here almost instantly
    const slow = await resolveAfter2Seconds();
    console.log(slow); // 2. this runs 2 seconds after 1.

    const fast = await resolveAfter1Second();
    console.log(fast); // 3. this runs 3 seconds after 1.
}
sequentialStart();
// after 2 seconds, logs "slow", then after 1 more second, "fast"
```

#### 2. Synchronize returns only after each Promise asynchronous processing

In the currentStart() function below, slow and fast are executed asynchronously, but await slow is executed first, so fast is output after the run is completed.

```js
async function concurrentStart() {
    console.log("==CONCURRENT START with await==");
    const slow = resolveAfter2Seconds(); // starts timer immediately
    const fast = resolveAfter1Second(); // starts timer immediately

    // 1. Execution gets here almost instantly
    console.log(await slow); // 2. this runs 2 seconds after 1.
    console.log(await fast); // 3. this runs 2 seconds after 1., immediately after 2., since fast is already resolved
}
concurrentStart();
// after 2 seconds, logs "slow" and then "fast"
```

#### 3. Synchronize only returns after each Promise asynchronous processing using the Promise.all(iterable) method

The following function concurrentPromise() uses the Promise.all(iterable) method, which was identified in 2-2.1 above, to execute Promises asynchronously. All results are returned after the longest of the Promises is terminated.

```js
function concurrentPromise() {
    console.log("==CONCURRENT START with Promise.all==");
    return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then(
        messages => {
            console.log(messages[0]); // slow
            console.log(messages[1]); // fast
        }
    );
}
concurrentPromise();
// same as concurrentStart
```

#### 4. Synchronize the entire shutdown after each Promise asynchronous processing

The paraller function below synchronously handled the longest termination of Promise after returning the return value of each Promise asynchronously using await.

```js
async function parallel() {
    console.log("==PARALLEL with await Promise.all==");

    // Start 2 "jobs" in parallel and wait for both of them to complete
    await Promise.all([
        (async () => console.log(await resolveAfter2Seconds()))(),
        (async () => console.log(await resolveAfter1Second()))(),
    ]);
}
parallel();
// truly parallel: after 1 second, logs "fast", then after 1 more second, "slow"
```

### 3-4. Exception Handler

For conventional Promise, exception handle was carried out in the .catch() chain, but exception processing can be carried out in async/await as a try-catch-finally syntax.

```js
// Promise
function getProcessedData(url) {
    return downloadData(url) // returns a promise
        .catch(e => {
            return downloadFallbackData(url); // returns a promise
        })
        .then(v => {
            return processDataInWorker(v); // returns a promise
        });
}
// async/await
async function getProcessedData(url) {
    let v;
    try {
        v = await downloadData(url);
    } catch (e) {
        v = await downloadFallbackData(url);
    }
    return processDataInWorker(v);
}
```

## [References]

-   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
-   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
