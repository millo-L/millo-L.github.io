---
author: millo
title: "[React Native] Solving realm one-to-many relationship issue"
category: reactnative
layout: post
released_at: 2023-05-26 12:30
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: en
tags:
    - ReactNative
    - realm
    - "@realm/react"
    - one-to-many
is_private: false
translation: /reactnative-realm-one-to-many-relationship-2023-05-26-en/
translation_series: none
description: Let's find out about one-to-many relationship of real local db in the react native app.
---

# 1. Introduction

While developing with one-to-many relationship structure in realm, I found an '[TypeError: Cannot read property 'push' of undefined]' error and solve the issue. So, I write this article to share the solution.

# 2. One-to-many relationship in realm

Let's follow the [official document]((https://www.mongodb.com/docs/realm/sdk/react-native/model-data/relationships-and-embedded-objects/#one-to-many-relationship)) and look at the project code I wrote first.

# 2-1. Understanding Flows on the Screen

The left screen is the avatar list screen generated, and it is a flow of writing or reading a diary that corresponds to the avatar on the right screen by clicking avatar. Therefore, the avatar model and the diary model should be created in a one-to-many relationship.

![avatars](../../../../images/2023/05/itsmeee.png)

# 2-2. Models

## [👋 Wait] Version Info

> react-native 0.71.8 <br />
> realm 11.9.0 <br />
> @realm/react 0.4.3 <br />

## 2-2-1. avatar model

All parts are well documented, so it is omitted, and the diaries variable is connected to the diary model in a one-to-many relationship. The type uses Realm.List\<Diary>, a type made by rlem.


```ts
// ./models/avatar.ts

import { Realm } from '@realm/react';
import Diary from './diary';

class Avatar extends Realm.Object<Avatar> {
	_id!: Realm.BSON.ObjectId;

	name!: string;

	images!: string;

	diaries!: Realm.List<Diary>;

	createdAt!: Date;

	updatedAt?: Date;

	static generate(name: string, images: string) {
		return {
			_id: new Realm.BSON.ObjectId(),
			name,
			images,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	static schema: Realm.ObjectSchema = {
		name: 'Avatar',
		properties: {
			_id: 'objectId',
			name: 'string',
			images: 'string',
			diaires: 'Diary[]',
			createdAt: 'date',
			updatedAt: 'date?',
		},
		primaryKey: '_id',
	};
}

export default Avatar;

```

## 2-2-2. diary model

In the diary, there is no need to have information about avatar, so no separate variables are required. If you need avatar's info, follow [official documents](https://www.mongodb.com/docs/realm/sdk/react-native/model-data/relationships-and-embedded-objects/#define-inverse-relationship-properties).

```ts
// ./models/diary.ts

import { Realm } from '@realm/react';

class Diary extends Realm.Object<Diary> {
	_id!: Realm.BSON.ObjectId;

	title!: string;

	content!: string;

	date!: Date;

	createdAt!: Date;

	updatedAt?: Date;

	static generate(title: string, content: string, date: Date, createdAt?: Date) {
		return {
			_id: new Realm.BSON.ObjectId(),
			title,
			content,
			date,
			createdAt: createdAt || new Date(),
			updatedAt: new Date(),
		};
	}

	static schema: Realm.ObjectSchema = {
		name: 'Diary',
		properties: {
			_id: 'objectId',
			title: 'string',
			content: 'string',
			date: 'date',
			createdAt: 'date',
			updatedAt: 'date?',
		},
		primaryKey: '_id',
	};
}

export default Diary;
```

## 2-2-3. RealmContext

```ts
// ./models/index.ts

import { createRealmContext } from '@realm/react';
import Avatar from './avatar';
import Diary from './diary';

const RealmContext = createRealmContext({
	schema: [Avatar, Diary],
});

export default RealmContext;

```

## 2-2-4. Use RealmProvider

Now that you have created all the models, you need to wrap up the other JSX components in App.tsx so that they can be used in all of the subcomponents.

```tsx
// App.tsx

import React from 'react';
// ...
import RealmContext from './models';

// ...

const { RealmProvider } = RealmContext;

export default function App() {
	return (
		<RealmProvider>
			{your components}
		</RealmProvider>
	)
}

```

# 3. One-to-many issue

So far, it goes well without errors. However, the problem is that the diaries variable comes as undefined in the object created by the avatar model. In the end, I thought that the one-to-many relationship was not properly established, so even if I searched all the googling and official documents, there was no solution, so I took all the logs myself and found a solution.

The important thing about the code below is that if you output information about avatars[0], diaries appear as [], but if you approach the avatars[0].diaries variable directly, it appears as undefined.

```tsx
import React, { useEffect } from 'react';
// ...
import RealmContext from './models';

// ...

const { useQuery, useRealm } = RealmContext;

export default function AvatarListBody() {
	const avatars = useQuery(Avatar).sorted('updatedAt', true);
	// ...

	useEffect(() => {
		if (avatars.length === 0) return;
		console.log(avatars[0]); // {"_id": "64701fcf44ecf3b8e8117121", "createdAt": 2023-05-26T02:56:15.105Z, "diaires": [], "images": "...", "name": "...", "updatedAt": 2023-05-26T02:56:15.105Z}
		console.log(avatars[0].diaries); // undefined
		console.log(avatars.map((avatar) => avatar.diaries)) // [undefined, undefined, ...]
	}, [avatars]);

	// ...

	return (
		// ...
	);
}

```


## 3-1. Find one-to-many variable(diaries)

As a result of searching the official documents, entries() exist in the built-in function of the Realm.Object type. When outputting the result value of the entries() function, the variable names and variable values present in the avatar object in Array<[key(string), value(value's data type)]> type are added to the array in the order in which the variables of [the model](https://millo-l.github.io/reactnative-realm-one-to-many-relationship-2023-05-26-en/#2-2-1-avatar-model) are declared above.

I wrote the diaries variable 4th from above, so I printed entries()[3][1] and when I printed the type, the object type came out. This means that the object type of JavaScript is a call by reference variable, so if the inside of the variable is changed, the actual variable will also change.

```tsx
import React, { useEffect } from 'react';
// ...
import RealmContext from './models';

// ...

const { useQuery, useRealm } = RealmContext;

export default function AvatarListBody() {
	const avatars = useQuery(Avatar).sorted('updatedAt', true);
	// ...

	useEffect(() => {
		if (avatars.length === 0) return; 
		console.log(avatars[0]); // {"_id": "64701fcf44ecf3b8e8117121", "createdAt": 2023-05-26T02:56:15.105Z, "diaires": [], "images": "...", "name": "...", "updatedAt": 2023-05-26T02:56:15.105Z}
		console.log(avatars[0].entries()); // [["_id", "64701fcf44ecf3b8e8117121"], ["name", "..."], ["images", "..."], ["diaires", [Array]], ["createdAt", 2023-05-26T02:56:15.105Z], ["updatedAt", 2023-05-26T02:56:15.105Z]]
		console.log(avatars[0].entries()[3][1]) // []
		console.log(typeof avatars[0].entries()[3][1]) // object
	}, [avatars]);

	// ...

	return (
		// ...
	);
}

```

## 3-2. Use one-to-many variable(diaries)

As shown in the code below, it was found through diary modification and deletion that even if the diary was connected to the avatar with avatar.entries()[3][1].push(newDiary);.(Automatically apply CASCADE)

```tsx
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
// ...
import RealmContext from '~/models';
import Diary from '~/models/diary';

// ...
type WriteDiaryRouteProp = RouteProp<NaviParamList, 'WriteDiaryScreen'>;

const { useRealm } = RealmContext;

export default function WriteDiaryScreen() {
	// ...
	const realm = useRealm();
	const { avatar } = useRoute<WriteDiaryRouteProp>().params;
	const [data, setData] = useState<WriteDiaryData>({
		title: '',
		content: '',
		date: dayjs().toDate(),
	});

	// ...

	const onPressSave = useCallback(() => {
		try {
			// create new diary
			const newDiary = realm.write(() => {
				return realm.create(
					Diary,
					Diary.generate(
						data.title,
						data.content,
						dayjs(data.date).startOf('day').toDate(),
					),
				);
			});
			// connect avatar with new diary
			realm.write(() => {
				avatar.entries()[3][1].push(newDiary); 
				// originally avatar.diaries.push(newDiary);
				// but write avatar.diaries.push(newDiary);
				// [TypeError: Cannot read property 'push' of undefined] issue occured
			});
		} catch (e) {
			console.log(e);
		}
	}, [avatar]);

	// ...

	return (
		// ... 
	);
}

```

## 3-3. Making it functional

The entry() function is retrieved only when approaching the diaries variable, so let's function it. The other parts are the same as [above](https://millo-l.github.io/reactnative-realm-one-to-many-relationship-2023-05-26-en/#2-2-1-avatar-model) and only the function below need to be added.

```ts
// ./models/avatar.ts

// ...

export function getAvatarDiaries(avatar: Avatar & Realm.Object<any>): Realm.List<Diary> {
	return avatar.entries()[3][1];
}

// ...

```

# 4. End

This part certainly seems to be a problem with the realm package. I hope it will be revised as soon as possible.