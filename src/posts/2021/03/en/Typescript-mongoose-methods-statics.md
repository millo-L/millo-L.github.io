---
author: millo
title: "[Typescript] mongoose methods, statics"
category: typescript
layout: post
released_at: 2021-03-03 11:30
updated_at:
image: ../../../../images/category/typescript.png
series: none
lang: en
tags:
    - typescript
    - nodejs
    - mongodb
    - mongoose
    - statics
    - methods
is_private: false
translation: /Typescript-mongodb-method-statics-사용하기/
translation_series: none
description: Mongoose's methods and statics in a typescript environment.
---

# 1. Introduction

In a typescript environment, the mongoose module was used to use methods and statics, and in nodejs, the part that was running immediately became a bit more challenging in typescript, so the posting was written. Typescript itself is so sensitive to data types that it feels convenient in code review and collaboration, but sometimes it seems to be this uncomfortable.

# 2. Code

## 2-1. Whole Code

Let's look at the whole code first. <br />
Overall, a model containing the variables and methods and statistics used by mongodb's model, User, is specified through the interface. Let's proceed with the details step by step below.

```ts
// user.ts

import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
    username: string;
    hashedPassword: string;
}

interface IUserDocument extends IUser, Document {
    setPassword: (password: string) => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
    findByUsername: (username: string) => Promise<IUserDocument>;
}

const UserSchema: Schema<IUserDocument> = new Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
});

UserSchema.methods.setPassword = async function (password: string) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password: string) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
};

UserSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username });
};

const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
```

## 2-2. Variable interface to use in the model

The following interface specifies the name and data type of variables to be used in the User model.

```ts
interface IUser {
    username: string;
    hashedPassword: string;
}
```

## [👋 Wait] The difference between methods and statics

When methods are used, <span style="color:red">'this' is the object called method</span>, and when using statistics, <span style="color:red">'this' is the model itself</span>, regardless of the object called statistics".

### methods

Thus, in the above code, setPassword and checkPassword can set a password for each object or determine whether it matches the password for that object.

### statics

FindByUsername, on the other hand, can find and return the user name within the model.

## 2-3. Methods interface to use in the model

The interface below is used to specify the names and data types of methods in addition to the variables to be used in the User model. <br />
However, the difference from the interface above is that not only IUser but also **Document**, Mongoose's class, is extended. <br />
It then creates a mongoose schema based on the interface.

```ts
interface IUserDocument extends IUser, Document {
    setPassword: (password: string) => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema<IUserDocument> = new Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
});

UserSchema.methods.setPassword = async function (password: string) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password: string) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
};
```

## 2-4. Statics interface for model use

The interface below extends the interface, including the above variables, methods, and the document class of mongoose, in the form of a model, and specifies the statistics to be used in the User model.

```ts
interface IUserModel extends Model<IUserDocument> {
    findByUsername: (username: string) => Promise<IUserDocument>;
}

UserSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username });
};
```

## 2-5. User Model Declaration

The user model is declared based on the interface including the IUserDocument (the interface of the variables + methods) and statics created above. The above variables, methods, and statics functions are all available when the model is then imported.

```ts
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
```