---
author: millo
title: "[Typescript] mongoose methods, statics 사용하기"
category: typescript
layout: post
released_at: 2021-03-02 22:24
updated_at:
image: ../../../../images/2021/03/typescript.png
series: none
lang: ko
tags:
    - typescript
    - nodejs
    - mongodb
    - mongoose
    - statics
    - methods
is_private: false
translation:
translation_series: none
description: typescript 환경에서 mongoose의 methods와 statics를 사용해보자.
---

# 1. 서론

typescript 환경에서 mongoose 모듈을 사용하여 methods와 statics를 사용할 상황이 생겼는 데, nodejs에서는 바로 실행되던 부분이 typescript에서는 조금 더 까다롭게 설정이 되서 포스팅을 적는다. typescript 자체가 워낙 자료형에 민감하기 때문에 더욱 그런 것 같다. 그 덕분에 코드 리뷰나 협업에서는 편리함을 느끼지만 간혹 이렇게 불편함이 생길 때가 있는 것 같다.

# 2. 코드

## 2-1. 전체 코드

우선 전체 코드를 보도록 하자. <br />
큰 틀을 보자면 User라는 mongodb의 모델이 사용할 변수와 methods, statics 들의 자료형을 interface를 통해서 명시하고 해당 interface를 포함하는 model을 생성한다. 자세한 사항은 아래에서 차근차근 진행하도록 하자.

```ts
// user.ts

import mongoose, { Schema, Document, Model } from "mongoose"
import bcrypt from "bcrypt"

interface IUser {
    username: string
    hashedPassword: string
}

interface IUserDocument extends IUser, Document {
    setPassword: (password: string) => Promise<void>
    checkPassword: (password: string) => Promise<boolean>
}

interface IUserModel extends Model<IUserDocument> {
    findByUsername: (username: string) => Promise<IUserDocument>
}

const UserSchema: Schema<IUserDocument> = new Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
})

UserSchema.methods.setPassword = async function (password: string) {
    const hash = await bcrypt.hash(password, 10)
    this.hashedPassword = hash
}

UserSchema.methods.checkPassword = async function (password: string) {
    const result = await bcrypt.compare(password, this.hashedPassword)
    return result
}

UserSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username })
}

const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema)
export default User
```

## 2-2. 모델에서 사용할 변수 interface

아래의 interface는 User 모델에서 사용할 변수들의 이름과 자료형을 명시하는 역할을 한다.

```ts
interface IUser {
    username: string
    hashedPassword: string
}
```

## [👋 잠깐] methods와 statics의 차이점

methods를 사용할 때는 이 <span style="color:red">method를 호출한 객체가 method 내에서의 this가 되고</span>,<br /> statics를 사용할 때는 이 <span style="color:red">statics를 호출한 객체에 상관없이 this가 모델 자체가 된다.</span>

### methods

따라서, 위의 코드에서 setPassword와 checkPassword는 한 객체에 대해서 각각 해당 객체에 비밀번호를 설정하거나 해당 객체의 비밀번호와 일치하는 지 여부를 확인할 수 있다.

### statics

반면, findByUsername은 Model 내에서 해당 username인 User를 반환할 수 있다.

## 2-3. 모델에서 사용할 methods interface

아래의 interface는 User 모델에서 사용할 변수에 덧붙여 methods의 이름과 자료형을 명시하는 역할을 한다. <br />
다만, 위의 interface와 다른 점은 IUser 뿐만 아니라 <span style="color:red">mongoose의 class 인 **Document**도 extends 한다는 점이다.</span> <br />
이후 해당 interface를 토대로 mongoose Schema를 생성한다.

```ts
interface IUserDocument extends IUser, Document {
    setPassword: (password: string) => Promise<void>
    checkPassword: (password: string) => Promise<boolean>
}

const UserSchema: Schema<IUserDocument> = new Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
})

UserSchema.methods.setPassword = async function (password: string) {
    const hash = await bcrypt.hash(password, 10)
    this.hashedPassword = hash
}

UserSchema.methods.checkPassword = async function (password: string) {
    const result = await bcrypt.compare(password, this.hashedPassword)
    return result
}
```

## 2-4. 모델에서 사용할 statics interface

아래의 interface는 위의 변수와 methods 그리고 mongoose의 Document class를 포함한 interface를 Model 형태로 extends하고 User 모델에서 사용할 statics를 명시하는 역할을 한다.

```ts
interface IUserModel extends Model<IUserDocument> {
    findByUsername: (username: string) => Promise<IUserDocument>
}

UserSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username })
}
```

## 2-5. User 모델 선언

위에서 만든 IUserDocument(변수 + methods의 interface)와 statics 까지 포함한 interface를 기반으로 User model을 선언한다. 이 후 해당 model을 import하면 위의 변수, methods, statics 기능을 모두 사용할 수 있다.

```ts
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema)
export default User
```

## 2-5. User Model Declaration

The user model is declared based on the interface including the IUserDocument (the interface of the variables + methods) and statics created above. The above variables, methods, and statics functions are all available when the model is then imported.

```ts
interface IUserModel extends Model<IUserDocument> {
    findByUsername: (username: string) => Promise<IUserDocument>
}

UserSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username })
}
```
