---
author: millo
title: "[Go] 구조체를 Class처럼 사용하기"
category: go
layout: post
released_at: 2021-01-20 17:00
updated_at:
image: ../../../../images/category/go.png
series: none
lang: ko
tags:
    - go
    - golang
    - struct
    - Embedding
    - Receiver
is_private: false
translation: /Using-struct-as-class-in-golang/
translation_series: none
description: Go언어의 구조체를 객체 지향 언어의 Class처럼 사용해보자.
---

# 1. 서론

최근 Go언어를 독학하기 시작했는 데 기존의 Javscript 생태계와는 다른 매력이 있는 것 같다. 나는 기존의 C++, JAVA, C# 등의 객체지향 컴파일 언어들을 이용해서 프로젝트를 진행해본 적이 있다. 이 때 class 상속 및 멤버 함수 등을 이용해서 편리하게 코딩을 경험이 있다. Go언어에 대한 정보를 들었을 때 큰 특징 중 하나는 **Go언어에는 class가 없다**는 점이었다. class가 없는 **Go언어에서 객체 지향만큼 편리하게 코딩을 할 수 있을까?** 이 내용에 대해서 포스팅을 해보도록 하겠다.

# 2. Go언어에서 제시한 대안

Go언어에서는 내가 위에서 말한 부분의 대체제를 명확하게 제시한다. 바로 **Receiver**와 **Embedding**이다. 이 둘을 구조체에서 사용하게 되면 객체 지향의 **멤버 함수, 상속 구조**와 동일한 환경을 구성할 수 있다.(멤버 변수의 역할은 구조체 내의 변수가 한다.) 그럼 어떻게 사용하는 지에 대해서 알아보자.

# 3. Receiver

Receiver란 객체 지향 언어에서 **멤버 함수의 역할**에 해당한다. 바로 **특정 함수를 특정 구조체만 사용할 수 있게 선언**하는 것이다.

```go
package main

import "fmt"

type Cat struct {
	name string
}

// (a Cat)을 명시함으로써 Cat 구조체만 호출할 수 있는 함수가 됐다.
func (a Cat) cry() {
	fmt.Println("야옹~")
}

func main() {
	kitty := Cat{"나비"}
	kitty.cry() // 야옹~
	cry()       // error
}


```

위의 코드에서 cry()함수가 바로 Receiver다. 거창한 것은 없지만 이렇게 함으로써 **특정 구조체에서만 함수를 사용할 수 있게 지정**할 수 있다. 그 외의 다른 변수에서의 호출이나, 일반적인 함수같은 호출은 error를 반환한다.

# 4. Embedding

Embedding이란 객체 지향 언어에서 **상속 관계의 역할**에 해당한다. **특정 구조체를 다른 구조체가 상속한 것과 같은 효과**를 낼 수 있다. 물론 **위의 Receiver를 이용한 오버라이딩도 가능**하다.

```go
package main

import "fmt"

type Animal struct {
	name string
}

func (a Animal) introduce() {
	fmt.Println("애완동물의 이름은 " + a.name + "입니다.")
}

type Cat struct {
	// Animal 구조체의 자료형만 선언하면 상속과 같은 역할
	Animal
}

type Dog struct {
	// Animal 구조체의 자료형만 선언하면 상속과 같은 역할
	Animal
}

func main() {
	a := Animal{"꿀꿀이"}
	kitty := Cat{}
	puppy := Dog{}

	kitty.Animal.name = "나비"
	puppy.Animal.name = "뭉치"

	a.introduce()     // 내 애완동물의 이름은 꿀꿀이입니다.
	kitty.introduce() // 내 애완동물의 이름은 나비입니다.
	puppy.introduce() // 내 애완동물의 이름은 뭉치입니다.

	kitty.Animal.introduce() // 내 애완동물의 이름은 나비입니다.
	puppy.Animal.introduce() // 내 애완동물의 이름은 뭉치입니다.
}

```

위의 코드에서 Cat과 Dog **구조체 안에 Animal 자료형만 선언하면 객체 지향 언어에서의 상속구조**와 같은 기능을 사용할 수 있다. 위의 코드와 같이 kitty.introduce()와 kitty.Animal.introduce()가 모두 같은 값을 나타내는 것을 알 수 있다. 다만, **Animal의 변수에 값을 지정할 때에는 반드시 kitty.Animal.name 형식으로 값을 넣어야한다.**

## 4-1. Embedding Overriding

오버라이딩도 간단하게 진행할 수 있다.

```go
package main

import "fmt"

type Animal struct {
	name string
}

func (a Animal) introduce() {
	fmt.Println("내 애완동물의 이름은 " + a.name + "입니다.")
}

type Cat struct {
	// Animal 구조체의 자료형만 선언하면 상속과 같은 역할
	Animal
}

func (c Cat) introduce() {
	fmt.Println("내 고양이의 이름은 " + c.name + "입니다.")
}

type Dog struct {
	// Animal 구조체의 자료형만 선언하면 상속과 같은 역할
	Animal
}

func (d Dog) introduce() {
	fmt.Println("내 강아지의 이름은 " + d.name + "입니다.")
}

func main() {
	a := Animal{"꿀꿀이"}
	kitty := Cat{}
	puppy := Dog{}

	kitty.Animal.name = "나비"
	puppy.Animal.name = "뭉치"

	a.introduce()     // 내 애완동물의 이름은 꿀꿀이입니다.
	kitty.introduce() // 내 고양이의 이름은 나비입니다.
	puppy.introduce() // 내 강아지의 이름은 뭉치입니다.

	kitty.Animal.introduce() // 내 애완동물의 이름은 나비입니다.
	puppy.Animal.introduce() // 내 애완동물의 이름은 뭉치입니다.
}
```

위의 코드와 같이 Receiver를 Cat, Dog 구조체에 각각 진행할 수 있다. 이 때 **Embedding한 구조체와 동일한 함수명을 가진 Receiver를 생성하면 overriding과 같은 기능을 구현할 수 있다.** 따라서, 이렇게 구현하게 되면 kitty.introduce()와 kitty.Animal.introduce()는 전혀 다른 값이 된다.

# 느낀 점

Go언어는 공부할수록 정말 편리하게 만들었다는 게 느껴진다. Go언어 창시자분들이 C++로 분산 프로그래밍 관련 코딩을 하다가 대체제로 만든 것이 Go언어라고 하던 데 그래서 그런지 C++의 장점은 살리고 단점은 없애는 노력을 많이 기울인 것 같다. 아직 Go언어를 공부하는 단계이므로 장단점을 정확히 알진 못하지만 그 점에 초점을 맞춰 공부해 나갈 예정이다. 이 포스팅이 Go언어에 관심있는 분들에게 도움이 됐으면 한다.

# [참고]

https://golang.org/doc/effective_go.html#embedding
https://eli.thegreenplace.net/2020/embedding-in-go-part-1-structs-in-structs/
