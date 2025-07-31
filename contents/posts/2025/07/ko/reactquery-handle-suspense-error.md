---
author: millo
title: "[React Query] Error Boundary + Suspense + @tanstack/react-query = 우아"
category: reactnative
layout: post
released_at: 2025-07-30 23:30
updated_at:
image: ../../../../images/category/reactquery.png
series: none
lang: ko
tags:
    - React
    - ReactNative
    - ErrorBoundary
    - Suspense
    - "@tanstack/react-query"
is_private: false
translation: /reactquery-handle-suspense-error-en/
translation_series:
description: 비동기 API의 로딩과 에러처리를 선언적으로 관리해보자. (with ErrorBoundary, Suspense, @tanstack/react-query)
---

## 1. 서론

최근 [Network Debugger](/reactnative-devtools-network-debugger/)를 만들면서 Network Throttling 기능까지 추가로 만들게 됐고, 그로 인해 인터넷이 느린 환경과 offline 환경에서의 예외처리를 `ErrorBoundary` + `Suspense` + `@tanstack/react-query`로 하던 중 query reset 관련한 기존 로직에 대한 불편함을 느꼈고 이를 해결하기 위해 시도한 여러가지 방법과 생각보다 김빠지는 우아한 해결방법에 대해 기술에 해보고자 한다.

## 2. React 18 (Suspense) 이전의 에러 처리 방식

`"로딩 중입니다..."`, `"에러가 발생했습니다."`

React 애플리케이션을 만들다 보면 우리는 수많은 비동기 요청과 그에 따른 상태(로딩, 성공, 에러)를 처리해야 한다. 많은 개발자들이 useState를 이용해 isLoading, isError 같은 상태를 직접 관리했었다.

```tsx
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [isError, setIsError] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const result = await api.get('/data');
      setData(result);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, []);

if (isLoading) return <div>로딩 중...</div>;
if (isError) return <div>에러 발생!</div>;
return <div>{data.title}</div>;
```

익숙한 코드지만, 컴포넌트마다 이런 보일러플레이트 코드가 반복되고, 비즈니스 로직과 UI 상태 관리가 뒤섞여 코드는 금방 복잡해진다.

하지만 React 18과 TanStack Query(v4 이상)가 있다면, 우리는 이 싸움을 훨씬 더 `선언적(Declarative)`이고 우아하게 끝낼 수 있다. 이 글에서는 `Suspense`와 `ErrorBoundary`, 그리고 `React Query`를 조합하여 에러를 어떻게 처리하는지, 특히 어떻게 마법처럼 에러를 리셋시키는지 그 내부 원리까지 깊이 파헤쳐 보자.

## 3. 선언적 에러 처리의 삼총사

기존의 명령형 방식에서 벗어나려면 세 가지 핵심 요소가 필요하다.

1. `ErrorBoundary`: 에러 상태를 담당한다. 자식 컴포넌트 트리에서 발생하는 자바스크립트 에러를 포착하여, 에러 발생 시 fallback UI를 보여준다.
2. `Suspense`: 로딩 상태를 담당한다. 자식 컴포넌트의 데이터 로딩(Promise)이 끝날 때까지 기다렸다가, 기다리는 동안에는 fallback UI를 보여준다.
3. `React Query (useSuspenseQuery)`: 데이터 페칭을 담당하며, 위 두 요소의 연결고리 역할을 한다.

데이터를 가져오는 동안에는 Promise를 던져서(throw) `Suspense`를 활성화시킨다.

데이터를 가져오다 실패하면 에러를 던져서 `ErrorBoundary`를 활성화시킨다.

이 조합 덕분에 우리 컴포넌트는 오직 성공 케이스에만 집중할 수 있게 된다.

실제로는 `AsyncBoundary`라는 이름으로 `ErrorBoundary` + `Suspense` 컴포넌트를 만들었지만 이해를 위해 아래와 같이 설명하겠다.

```tsx
// MyComponent.jsx
function MyComponent() {
  // 로딩과 에러 상태는 더 이상 신경 쓰지 않는다!
  const { data } = useSuspenseQuery({ queryKey: ['myData'], queryFn: fetchData });

  // 이 코드는 데이터가 성공적으로 왔을 때만 실행된다.
  return <div>{data.title}</div>;
}

// App.jsx
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallbackRender={({ error }) => <div>에러: {error.message}</div>}>
      <Suspense fallback={<div>로딩 중...</div>}>
        <MyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

정말 깔끔하죠? 하지만 여기서 한 가지 의문이 생긴다. 에러가 발생해서 ErrorBoundary의 fallback UI가 보였을 때, 사용자는 어떻게 다시 시도할 수 있을까?

## 4. 그래서 에러 리셋은?

### 4-1. 기존 방식

실제로 아래와 동일하게 구현하지는 않고 [QueryOptions](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)로 미리 생성해둔 옵션으로 `queryClient.refetchQueries(queryOptions())`형식으로 처리했다.

하지만 결론적으로 `Suspense` 하위의 컴포넌트에서 실행하는 query에 대한 정보들을 알고 있어야 한다. 아래의 예시는 간단한 경우이지만 queryKey에 들어갈 변수가 여러 개라고 생각해보면 생각보다 상황이 복잡해진다.

```tsx

function App() {
  const queryClient = useQueryClient();

  return (
    <ErrorBoundary
      onReset={() => queryClient.refetchQueries({ queryKey: ['myData'] })}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          <h2>이런, 문제가 발생했어요. 😢</h2>
          <p>{error.message}</p>
          {/* 3. 이 버튼이 마법을 부린다! */}
          <button onClick={resetErrorBoundary}>다시 시도</button>
        </div>
      )}
    >
      <Suspense fallback={<div>로딩 중...</div>}>
        <MyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 4-2. 우아한 해결방법

"다시 시도" 기능을 구현하기 위해 등장하는 것이 바로 `QueryErrorResetBoundary`다. 이 컴포넌트는 React Query가 에러 상태를 `"잊고"` 다시 쿼리를 실행하도록 만드는 재설정 메커니즘을 제공한다.

사용법은 간단하다. 기존의 `ErrorBoundary`를 `QueryErrorResetBoundary`로 감싸고, reset 함수를 ErrorBoundary의 onReset prop으로 넘겨주기만 하면 된다.

```tsx

import { QueryErrorResetBoundary } from '@tanstack/react-query';

function App() {
  return (
    // 1. QueryErrorResetBoundary로 감싼다.
    <QueryErrorResetBoundary>
      {/* 2. reset 함수를 onReset prop에 넘겨준다. */}
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <h2>이런, 문제가 발생했어요. 😢</h2>
              <p>{error.message}</p>
              {/* 3. 이 버튼이 마법을 부린다! */}
              <button onClick={resetErrorBoundary}>다시 시도</button>
            </div>
          )}
        >
          <Suspense fallback={<div>로딩 중...</div>}>
            <MyComponent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

## 5. 내부 동작 파헤치기: 명령이 아닌 신호

이제 사용자가 "다시 시도" 버튼을 누르면, 에러가 났던 쿼리가 다시 실행됩니다. 그런데 이게 어떻게 가능한 걸까요? QueryErrorResetBoundary가 어떻게 useSuspenseQuery에게 "리셋해!" 라고 명령을 내리는 걸까?

결론부터 말하자면, QueryErrorResetBoundary는 쿼리에게 직접 명령을 내리지 않는다. 대신 "리셋 신호"를 방송하고, 쿼리가 그 신호를 스스로 해석하여 동작하는 매우 똑똑한 방식을 사용한다.

이 상호작용은 두 주체의 명확한 역할 분담으로 이루어진다.

### 5-1. QueryErrorResetBoundary의 역할: 방송국 

`QueryErrorResetBoundary`는 React의 `Context API`를 이용해 자신의 영역 내부에 간단한 상태와 함수를 제공한다.

- 상태: "리셋이 요청되었는가?"를 나타내는 boolean 값 (isReset).
- 함수: 이 isReset 상태를 true로 바꾸는 reset 함수.

이 컴포넌트의 유일한 임무는 "다시 시도" 버튼이 눌렸을 때, 자신의 영역 전체에 "리셋 신호가 켜졌다!" 고 알리는 것이다. 어떤 쿼리가 에러 상태인지는 전혀 알지 못하며 관심도 없다.

### 5-2. useBaseQuery의 역할: 수신기 

`useQuery`와 `useSuspenseQuery`의 근간이 되는 `useBaseQuery` 훅은 내부적으로 다음 두 가지 정보를 모두 알고 있다.

- 자신의 상태: 현재 내가 에러 상태인가? (result.isError)
- 방송 내용: 상위 `QueryErrorResetBoundary`의 리셋 신호가 켜졌나? (errorResetBoundary.isReset())

그리고 `useBaseQuery`는 렌더링될 때마다 이 두 정보를 조합하여 "지금 에러를 던져야 하는가?" 를 결정한다. 이 결정은 getHasError라는 유틸리티 함수에서 이루어진다.

```tsx
// errorBoundaryUtils.ts 의 핵심 로직
const getHasError = ({ result, errorResetBoundary }) => {
  return (
    // 1. 내가 에러 상태이고,
    result.isError &&
    // 2. 리셋 신호는 아직 켜지지 않았을 때
    !errorResetBoundary.isReset()
    // ... 기타 조건
  );
};

// useBaseQuery.ts 의 핵심 로직
if (getHasError({ result, errorResetBoundary })) {
  throw result.error;
}
```

이 코드가 바로 모든 마법의 비밀이다.

1. 에러 발생 시: 쿼리의 `isError`는 true고, 리셋 신호 `isReset`은 false다. 따라서 `getHasError`는 true를 반환하고, 쿼리는 에러를 던져서 `Error Boundary`를 활성화시킨다.
2. "다시 시도" 클릭 후: 리셋 신호 isReset이 true로 바뀐다. 이제 `getHasError`는 !isReset() 조건 때문에 false를 반환한다. 따라서 쿼리는 더 이상 에러를 던지지 않는다.

#### 그렇다면 리페치는 언제?

`useBaseQuery`가 에러 던지기를 멈추면, React는 컴포넌트 렌더링을 계속 진행한다. 이때 쿼리 옵저버는 `"어, 나 에러 상태였는데 데이터가 없네? 다시 가져와야겠다!"` 라고 스스로 인지하고, 자신의 본래 로직에 따라 자연스럽게 리페치를 시작한다.

이것은 마치 신호등과 같다. 리셋 신호는 빨간불을 초록불로 바꿔줄 뿐, 차를 밀어주지 않는다. 차는 초록불을 보고 스스로 출발한다.

## 결론

`React Query`의 `Suspense` 및 `ErrorBoundary` 지원은 단순히 로딩과 에러 상태 코드를 줄여주는 것 이상의 가치를 가집니다. 데이터 페칭과 관련된 UI 상태 관리를 React의 `선언적인 패러다임`에 완벽하게 통합함으로써, 개발자가 비즈니스 로직에 더 집중할 수 있도록 해줍니다.

`QueryErrorResetBoundary`와 `useBaseQuery`의 상호작용은 복잡해 보일 수 있지만, 그 핵심은 `"직접적인 명령 대신, 상태를 공유하고 스스로 반응한다"` 는 React의 철학을 그대로 따르고 있습니다. 이제 우리도 명령형 에러 처리와의 싸움을 멈추고, 이 우아한 패턴을 통해 더 견고하고 예측 가능한 애플리케이션을 만들어보는 것은 어떨까요?

## 개인적 생각

개인사업자로 2년 가량 지냈을 때는 기술적 깊이 보다는 비즈니스 측면에서 새로운 기획을 시도하고 개발은 그것을 검증하기 위한 수단이었다. 오랜만에 뤼튼이라는 기업에 들어와서 개발자라는 역할에 집중하다보니 기술적 깊이에 대해 계속 알아보게 되는게 정말 좋은 경험이라는 생각이 된다.

추후에 내가 다시 개인사업이나 창업을 하게 되더라도 아이가 자라서도 자전거 타는 방법을 잊어버리지 않듯, 이 경험들은 나의 좋은 뿌리가 되어줄 것이라고 믿는다.

## 참조 자료

- https://www.npmjs.com/package/react-error-boundary
- https://tanstack.com/query/latest/docs/framework/react/guides/query-options
- https://tanstack.com/query/latest/docs/framework/react/reference/QueryErrorResetBoundary
- https://github.com/TanStack/query/blob/main/packages/react-query/src/useBaseQuery.ts
- https://github.com/TanStack/query/blob/main/packages/react-query/src/errorBoundaryUtils.ts