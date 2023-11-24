---
author: millo
title: "[Node.js] Use express"
category: nodejs
layout: post
released_at: 2021-03-21 19:45
updated_at:
image: ../../../../images/category/nodejs.jpg
series: none
lang: en
tags:
    - nodejs
    - express
    - route
is_private: false
translation: /Nodejs-express-사용하기/
translation_series:
description: Let's implement the server using express.js in nodejs.
---

## 1. Introdution

If you use node.js as a server, let's learn about express.js, which is considered the most standard. node.js is very easy to develop RESTful APIs.

## 2. Configuration Settings

> **Prerequisite Actions** <br/>
> Naturally, node.js is assumed to be installed. <br/>
> If you haven't installed it, click [here](https://nodejs.org/en/download/) to install it.

First, let's create a folder to create a node.js development environment.

```bash
## Creating and opening folders
mkdir express_practice
cd express_practice

## init package.json
npm init -y

## install http, express modules
npm install http express
```

## 3. Print Hello world!

Let's write a code to print Hello world.

```js
// helloworld.js file

const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const PORT = 8080;

app.get("/", (req, res) => {
    res.send("Hello world");
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

After running, try connecting to http://localhost:8080 through a browser or postman.

```bash
node helloworld.js
```

## 4. RESTful API

Let's implement a simple RESTful API to CRUD the user's account information.

```js
// rest.js file

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);
const PORT = 8080;

// Temporary user id, password
let users = [
    {
        id: "hello",
        password: "1234",
    },
    {
        id: "world",
        password: "1234",
    },
];

// Return index of user in temporary user array
const findUserIndex = id => {
    let index = -1;
    let len = users.length;

    for (let i = 0; i < len; i++) {
        if (users[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};

// Register a new user with a temporary user array
const register = (id, password) => {
    let index = findUserIndex(id);
    if (index !== -1) return false;

    users.push({ id, password });
    return true;
};

// Check if id, password exists in temporary user array
const login = (id, password) => {
    let index = findUserIndex(id);
    if (index === -1) return false;

    if (users[index].id === id && users[index].password === password)
        return true;

    return false;
};

// Change the password in the temporary user array
const changePassword = (id, password) => {
    let index = findUserIndex(id);
    if (index === -1) return false;

    users[index].password = password;
    return true;
};

// Delete user from temporary user array
const deleteUser = id => {
    let index = findUserIndex(id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
};

// register api
app.post("/", (req, res) => {
    let id = req.body.id;
    let password = req.body.password;

    if (!register(id, password)) return res.status(401).send("duplicate id");
    res.send(`success to register ${id}'s account`);
});

// Get information for a specific user
app.get("/:id", (req, res) => {
    let id = req.params.id;

    if (findUserIndex(id) === -1) return res.status(401).send("invalid id");

    res.send(`Hello world ${id}`);
});

// Modifying specific user information
app.put("/:id", (req, res) => {
    let id = req.params.id;
    let password = req.body.password;

    if (!changePassword(id, password))
        return res.status(401).send("password change fail");
    res.send(`success to change ${id}'s password`);
});

// Delete a specific user
app.delete("/:id", (req, res) => {
    let id = req.params.id;

    if (!deleteUser(id)) return res.status(401).send("delete fail");
    res.send(`success to delete ${id}'s account`);
});

// user login
app.post("/login", (req, res) => {
    let id = req.body.id;
    let password = req.body.password;

    if (!login(id, password)) return res.status(401).send("login fail");

    res.send("hello " + id);
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

## [References]

-   https://expressjs.com/
