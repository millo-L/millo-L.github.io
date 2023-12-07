---
author: millo
title: "[React Native] realm one-to-many relationship 적용하기"
category: reactnative
layout: post
released_at: 2023-05-26 12:30
updated_at:
image: ../../../../images/category/reactnative.png
series: none
lang: ko
tags:
    - ReactNative
    - realm
    - "@realm/react"
    - one-to-many
is_private: false
translation: /reactnative-realm-one-to-many-relationship-2023-05-26-en/
translation_series:
description: react native 앱에서 realm local db의 one-to-many relationship에 대해 알아보자.
---

## 1. 서론

사이드 프로젝트로 만든 It's meee([ios](https://apps.apple.com/kr/app/its-meee-%EC%8B%AC%ED%94%8C%ED%95%9C-%EB%8B%A4%EC%9D%B4%EC%96%B4%EB%A6%AC-%EA%B7%80%EC%97%AC%EC%9A%B4-%EB%B6%80%EC%BA%90-%EC%9D%BC%EA%B8%B0/id1564026667), [android](https://play.google.com/store/apps/details?id=io.github.itsmeee&hl=ko&gl=US))앱에서 기존에는 AsyncStorage를 이용해서 meee와 일기를 저장했는데 더 나은 저장방식을 고려해보다가 realm을 선택하게 됐다. [realm](https://realm.io/)은 이미 android, ios에서 로컬 디비를 사용할 때는 종종 선택되는 디비 중 하나였는데, 최근에 react native에도 적용이 쉽게 [@realm/react](https://www.mongodb.com/docs/realm/sdk/react-native/use-realm-react/) 패키지가 추가돼서 사용해보게 됐다. 다만, 공식 문서에서 명시한대로 개발을 따라가게 되면 one-to-many 방식에서 에러가 발생해서 그것에 대한 적당한 해결방법으로 이 글을 적게 됐다.

## 2. one-to-many 적용 방법

우선 [공식문서](https://www.mongodb.com/docs/realm/sdk/react-native/model-data/relationships-and-embedded-objects/#one-to-many-relationship)를 따라서 내가 작성한 프로젝트 코드를 먼저 보도록 하자.

### 2-1. 화면으로 플로우 이해하기

왼쪽 화면이 생성한 meee 리스트 화면이고 meee를 클릭하여 오른쪽 화면에서 그 meee에 해당하는 일기를 적거나 적었던 일기를 읽는 플로우다. 따라서, avatar(meee) 모델과 diary(일기) 모델을 one-to-many 관계로 생성해야한다.

![avatars](../../../../images/2023/05/itsmeee.png)

### 2-2. 모델 구성하기

#### [👋 잠깐] 개발 환경

> react-native 0.71.8 <br />
> realm 11.9.0 <br />
> @realm/react 0.4.3 <br />

#### 2-2-1. avatar 모델

모든 부분은 공식문서에도 잘 나와있으므로 우선 생략하고, diaries 변수가 diary 모델과 one-to-many 관계로 연결된 부분이다. 타입은 rleam에서 만든 타입으로 Realm.List\<Diary>를 사용한다.

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
			diaries: 'Diary[]',
			createdAt: 'date',
			updatedAt: 'date?',
		},
		primaryKey: '_id',
	};
}

export default Avatar;

```

#### 2-2-2. diary 모델

diary에서는 아바타에 대한 정보를 가지고 있을 필요가 없으므로 별도 변수가 필요하진 않다. 만약 관련된 변수가 필요하다면 [공식문서](https://www.mongodb.com/docs/realm/sdk/react-native/model-data/relationships-and-embedded-objects/#define-inverse-relationship-properties)를 따라서 진행하면 된다.

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

#### 2-2-3. RealmContext 생성

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

#### 2-2-4. RealmProvider 적용

이제 모델을 모두 생성했으므로 하위 컴포넌트들 모두에서 해당 모델들을 사용할 수 있게 App.tsx에서 다른 JSX 컴포넌트들을 감싸줘야한다.

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

## 3. one-to-many 변수 생성

아래의 코드와 같이 일기를 아바타와 연결하면 diary 수정, 삭제를 통해 알 수 있었다.(자동적으로 CASCADE 적용)

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
			// 새로운 다이어리를 생성하고
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
			// 새로운 다이어리를 아바타에 연결
			realm.write(() => {
				avatar.diaries.push(newDiary); 
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

## 4. 끝

오늘은 realm을 이용하여 one-to-many 관계를 지정하고 데이터를 저장해봤다. react-native 환경에서 로컬 저장 장치로 AsyncStorage와 sqlite를 사용할 수 있지만 그에 비해 사용법이 더 간단하고 타입 지정이 쉬운 장점이 있어서 한 번쯤은 사용해보는 걸 추천한다.