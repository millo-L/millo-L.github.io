---
author: millo
title: "[Go] Using Struct as Class"
category: go
layout: post
released_at: 2021-03-13 15:30
updated_at:
image: ../../../../images/category/go.png
series: none
lang: en
tags:
    - go
    - golang
    - struct
    - Embedding
    - Receiver
is_private: false
translation: /Go언어에서-구조체를-Class처럼-사용하기/
translation_series:
description: Let's use Go's struct like class of an object-oriented language.
---

## 1. Introduction

Recently, I started studying Golang, and it seems to have a different charm than Javscript that I used before. I have previously worked on a project using object-oriented compilation languages such as C++, JAVA, and C#. At this time, I have experience in coding conveniently using class inheritance and member functions. One of the big features of hearing information about Golang was that there was no class in Golang. Is it possible to code in Go language without class as convenient as object orientation? I will post about this content.

## 2. Alternatives proposed by Golang

The Go language clearly presents a substitute for the part I mentioned above. It is the **Receiver** and **Embedding**. Using these two in a struct allows us to construct the same environment as an object-oriented member function and an inheritance structure (the role of a member variable is a variable within the struct).

## 3. Receiver

The Receiver corresponds to the role of member functions in object-oriented languages. It is to declare that a particular function can only be used by a particular struct.

```go
package main

import "fmt"

type Cat struct {
	name string
}

// By specifying (a Cat), it became a function that only Cat struct could be called.
func (a Cat) cry() {
	fmt.Println("meow~")
}

func main() {
	kitty := Cat{"kitty"}
	kitty.cry() // meow~
	cry()       // error
}


```

In the code above, the cry() function is the Receiver. This allows us to specify that the function is only available on a particular struct. Calls from other variables, such as common functions, return an error.

## 4. Embedding

Embedding corresponds to the role of inheritance relations in object-object-oriented languages. It can have the same effect as the other struct inherits. Of course, it is possible to override using the Receiver above.

```go
package main

import "fmt"

type Animal struct {
	name string
}

func (a Animal) introduce() {
	fmt.Println("my pet's name is " + a.name + ".")
}

type Cat struct {
	// Declaring the data type of Animal struct is the same role as inheritance.
	Animal
}

type Dog struct {
	// Declaring the data type of Animal struct is the same role as inheritance.
	Animal
}

func main() {
	a := Animal{"dudu"}
	kitty := Cat{}
	puppy := Dog{}

	kitty.Animal.name = "kitty"
	puppy.Animal.name = "puppy"

	a.introduce()     // my pet's name is dudu.
	kitty.introduce() // my pet's name is kitty.
	puppy.introduce() // my pet's name is puppy.

	kitty.Animal.introduce() // my pet's name is kitty.
	puppy.Animal.introduce() // my pet's name is puppy.
}

```

The above code only declares the Animal data type within the Cat and Dog struct allows the use of features such as inheritance structures in object-oriented languages. As shown in the code above, both kitty.introduce() and kitty.Animal.introduce() represent the same value. However, when specifying a value for a variable in Animal, the value must be entered in the form kitty.Animal.name.

### 4-1. Embedding Overriding

Overliding can also be done simply.

```go
package main

import "fmt"

type Animal struct {
	name string
}

func (a Animal) introduce() {
	fmt.Println("my pet's name is " + a.name + ".")
}

type Cat struct {
	// Declaring the data type of Animal struct is the same role as inheritance.
	Animal
}

// Overriding
func (c Cat) introduce() {
	fmt.Println("my cat's name is " + a.name + ".")
}

type Dog struct {
	// Declaring the data type of Animal struct is the same role as inheritance.
	Animal
}

// Overriding
func (d Dog) introduce() {
	fmt.Println("my dog's name is " + a.name + ".")
}

func main() {
	a := Animal{"dudu"}
	kitty := Cat{}
	puppy := Dog{}

	kitty.Animal.name = "kitty"
	puppy.Animal.name = "puppy"

	a.introduce()     // my pet's name is dudu.
	kitty.introduce() // my cat's name is kitty.
	puppy.introduce() // my dog's name is puppy.

	kitty.Animal.introduce() // my pet's name is kitty.
	puppy.Animal.introduce() // my pet's name is puppy.
}
```

As shown in the code above, the Receiver can be performed on Cat and Dog struct respectively. Generating a Receiver with the same function name as the parent struct (Embedding) allows us to implement functions such as overriding. Thus, when implemented, kitty.introduce() and kitty.Animal.introduce() are completely different values.

## [References]

https://golang.org/doc/effective_go.html#embedding
https://eli.thegreenplace.net/2020/embedding-in-go-part-1-structs-in-structs/
