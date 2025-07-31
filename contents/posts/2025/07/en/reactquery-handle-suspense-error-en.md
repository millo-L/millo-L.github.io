---
author: millo
title: "[React Query] Error Boundary + Suspense + @tanstack/react-query = Super Coooool!!"
category: reactnative
layout: post
released_at: 2025-07-30 12:30
updated_at:
image: ../../../../images/category/reactquery.png
series: none
lang: en
tags:
    - React
    - ReactNative
    - ErrorBoundary
    - Suspense
    - "@tanstack/react-query"
is_private: false
translation: /reactquery-handle-suspense-error/
translation_series:
description: Let's manage async API loading and error handling declaratively with ErrorBoundary, Suspense, and @tanstack/react-query.
---

## 1. Introduction

Recently, while building a [Network Debugger](/reactnative-devtools-network-debugger-en/), I ended up adding Network Throttling functionality as well. This led me to handle exceptions in slow internet and offline environments using `ErrorBoundary` + `Suspense` + `@tanstack/react-query`. During this process, I experienced some inconvenience with the existing logic related to query reset. I'd like to share the various approaches I tried to solve this and the surprisingly simple yet super cool solution I discovered.

## 2. Error Handling Before React 18 (Suspense)

`"Loading..."`, `"An error occurred."`

When building React applications, we constantly deal with numerous asynchronous requests and their corresponding states (loading, success, error). Many developers have managed states like isLoading and isError directly using useState.

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

if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error occurred!</div>;
return <div>{data.title}</div>;
```

While this code is familiar, such boilerplate repeats in every component, and business logic becomes intertwined with UI state management, quickly making the code complex.

However, with React 18 and TanStack Query (v4+), we can end this battle in a much more `declarative` and super cool way. In this article, let's deeply explore how to handle errors by combining `Suspense`, `ErrorBoundary`, and `React Query`, and especially dig into the internal principles of how error reset works like magic.

## 3. The Three Musketeers of Declarative Error Handling

To break away from the imperative approach, we need three key elements:

1. `ErrorBoundary`: Handles error states. It catches JavaScript errors occurring in the child component tree and shows fallback UI when errors occur.
2. `Suspense`: Handles loading states. It waits until child component data loading (Promise) is complete and shows fallback UI during the waiting period.
3. `React Query (useSuspenseQuery)`: Handles data fetching and serves as the bridge between the above two elements.

While fetching data, it throws a Promise to activate `Suspense`.

When data fetching fails, it throws an error to activate `ErrorBoundary`.

Thanks to this combination, our components can focus solely on the success case.

Although I actually created an `AsyncBoundary` component that combines `ErrorBoundary` + `Suspense`, I'll explain it as follows for better understanding.

```tsx
// MyComponent.jsx
function MyComponent() {
  // No longer need to worry about loading and error states!
  const { data } = useSuspenseQuery({ queryKey: ['myData'], queryFn: fetchData });

  // This code only runs when data arrives successfully.
  return <div>{data.title}</div>;
}

// App.jsx
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallbackRender={({ error }) => <div>Error: {error.message}</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <MyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

Really clean, isn't it? But here's one question: when an error occurs and ErrorBoundary's fallback UI is shown, how can users retry?

## 4. So How About Error Reset?

### 4-1. Conventional Approach

I didn't actually implement it exactly like below, but used pre-created options with [QueryOptions](https://tanstack.com/query/latest/docs/framework/react/guides/query-options) in the format `queryClient.refetchQueries(queryOptions())`.

However, the conclusion is that you need to know information about queries executed in components under `Suspense`. The example below is a simple case, but imagine if there were multiple variables to include in the queryKey - the situation becomes quite complex.

```tsx

function App() {
  const queryClient = useQueryClient();

  return (
    <ErrorBoundary
      onReset={() => queryClient.refetchQueries({ queryKey: ['myData'] })}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          <h2>Oops, something went wrong. 😢</h2>
          <p>{error.message}</p>
          {/* 3. This button works the magic! */}
          <button onClick={resetErrorBoundary}>Try Again</button>
        </div>
      )}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <MyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 4-2. Super Cool Solution

What emerges to implement the "retry" functionality is `QueryErrorResetBoundary`. This component provides a reset mechanism that makes React Query "forget" the error state and execute queries again.

The usage is simple. Just wrap the existing `ErrorBoundary` with `QueryErrorResetBoundary` and pass the reset function to ErrorBoundary's onReset prop.

```tsx

import { QueryErrorResetBoundary } from '@tanstack/react-query';

function App() {
  return (
    // 1. Wrap with QueryErrorResetBoundary.
    <QueryErrorResetBoundary>
      {/* 2. Pass the reset function to the onReset prop. */}
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <h2>Oops, something went wrong. 😢</h2>
              <p>{error.message}</p>
              {/* 3. This button works the magic! */}
              <button onClick={resetErrorBoundary}>Try Again</button>
            </div>
          )}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <MyComponent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

## 5. Digging Into Internal Mechanics: Signals, Not Commands

Now when users click the "Try Again" button, the query that had an error will be executed again. But how is this possible? How does QueryErrorResetBoundary give commands to useSuspenseQuery saying "Reset!"?

To conclude first, QueryErrorResetBoundary doesn't give direct commands to queries. Instead, it uses a very smart approach where it broadcasts a "reset signal" and queries interpret that signal themselves and act accordingly.

This interaction consists of clear role division between two parties.

### 5-1. QueryErrorResetBoundary's Role: Broadcasting Station

`QueryErrorResetBoundary` uses React's `Context API` to provide simple state and functions within its area.

- State: A boolean value (isReset) indicating "Was reset requested?"
- Function: A reset function that changes this isReset state to true.

This component's only mission is to announce "Reset signal is on!" to its entire area when the "Try Again" button is pressed. It doesn't know which queries are in error state and doesn't care.

### 5-2. useBaseQuery's Role: Receiver

The `useBaseQuery` hook, which forms the foundation of `useQuery` and `useSuspenseQuery`, internally knows both pieces of information:

- Its own state: Am I currently in error state? (result.isError)
- Broadcast content: Is the reset signal from the parent QueryErrorResetBoundary on? (errorResetBoundary.isReset())

And `useBaseQuery` combines these two pieces of information every time it renders to decide "Should I throw an error now?" This decision is made in a utility function called getHasError.

```tsx
// Core logic in errorBoundaryUtils.ts
const getHasError = ({ result, errorResetBoundary }) => {
  return (
    // 1. I'm in error state, and
    result.isError &&
    // 2. Reset signal isn't on yet
    !errorResetBoundary.isReset()
    // ... other conditions
  );
};

// Core logic in useBaseQuery.ts
if (getHasError({ result, errorResetBoundary })) {
  throw result.error;
}
```

This code is the secret behind all the magic.

1. When error occurs: Query's `isError` is true and reset signal `isReset` is false. Therefore `getHasError` returns true, and the query throws an error to activate `Error Boundary`.
2. After "Try Again" click: Reset signal isReset becomes true. Now `getHasError` returns false due to the !isReset() condition. Therefore the query no longer throws errors.

#### So When Does Refetch Happen?

When `useBaseQuery` stops throwing errors, React continues component rendering. At this point, the query observer realizes "Hey, I was in error state but I have no data? I should fetch again!" and naturally starts refetching according to its original logic.

This is like a traffic light. The reset signal only changes red light to green light; it doesn't push the car. The car sees the green light and starts moving by itself.

## Conclusion

React Query's `Suspense` and `ErrorBoundary` support has value beyond simply reducing loading and error state code. By perfectly integrating UI state management related to data fetching into React's `declarative paradigm`, it allows developers to focus more on business logic.

The interaction between `QueryErrorResetBoundary` and `useBaseQuery` may seem complex, but its core follows React's philosophy of `"sharing state and reacting autonomously instead of direct commands"`. Now, how about we stop fighting with imperative error handling and create more robust and predictable applications through this super cool pattern?

## Personal Thoughts

When I was a sole proprietor for about 2 years, I focused more on business aspects, trying new ideas, and development was a means to validate them rather than pursuing technical depth. Coming back to work at a company called Wrtn and focusing on my role as a developer, I find it a really good experience to continuously explore technical depth.

Even when I return to individual business or startups in the future, just as a child doesn't forget how to ride a bicycle as they grow up, I believe these experiences will become good roots for me.

## References

- https://www.npmjs.com/package/react-error-boundary
- https://tanstack.com/query/latest/docs/framework/react/guides/query-options
- https://tanstack.com/query/latest/docs/framework/react/reference/QueryErrorResetBoundary
- https://github.com/TanStack/query/blob/main/packages/react-query/src/useBaseQuery.ts
- https://github.com/TanStack/query/blob/main/packages/react-query/src/errorBoundaryUtils.ts

