﻿---
thumbnail:
cover:
title: '[学习笔记]TypeScript查缺补漏（二）：类型与控制流分析'
excerpt:
description:
date: 2023-11-01 18:53:00
tags:
  - TypeScript

categories:
  - JavaScript
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-11-01 18:53:00/[学习笔记]TypeScript查缺补漏（二）：类型与控制流分析.html
---
<!-- toc -->
# 类型约束

TypeScript中的类型是一种用于描述变量、函数参数和函数返回值的特征的方式。

代码中定义类型的部分不会在原生JavaScript环境中编译

![在这里插入图片描述](644861-20231101185222363-606579948.png)

## 基本类型

包括number、string、boolean、null、undefined和symbol。

## 联合类型

联合类型（Union Types）是指用“|”符号将多个类型组合成一个的类型。这意味着一个变量可以存储多种类型的值

```
let value: number | string = 42;
```

# 控制流分析

TypeScript 本身是一种静态类型语言，它在编译时进行类型检查，因此控制流分析在编译阶段就已经开始了

比如：

```
function getUserInput():string|number{
  if(new Date() != new Date("2023-11-01")){
    return "yes";
  }
  else {
    return 0;
  }
}
```
此时Typescript的控制流分析将data类型视为 string | number

![在这里插入图片描述](644861-20231101185222394-660708137.png)


## instanceof和typeof

typeof操作符用于获取一个值的类型。它返回一个字符串，表示值的类型

instanceof操作符用于判断一个对象是否属于某个类的实例

使用typeof input === "string" 和 input instanceof String 这两个判断有什么区别：

typeof只能用于判断基本类型，instanceof可以用于判断自定义的类型，例如类，接口，数组等
instanceof 可以用于判断一个对象是否是某个类的实例，包括继承自该类的子类。

## 类型守卫和窄化

类型守卫用于获取变量类型信息，通常使用在条件块语句中。类型守卫是返回布尔值的常规函数，接受一个类型并告诉 TypeScript 是否可以缩小到更具体的类型。

缩小到更具体的类型的过程称之为“窄化（Narrowing）”，它能根据代码中的逻辑减少联合中的类型数量。大多数窄化来自if语句中的表达式，其中不同的类型操作符在新的范围内窄化。



### typeof判断
```
var input = getUserInput()
input  // string |number
if (typeof input === "string") {
  input  // string
}
```

### instanceof判断
```
var input = getUserInput()
input  // number | number[]
if (input instanceof Array)) {
  input  // number[]
}
```


### in判断

```
var input = getUserInput()
input  // string | {error: ...}
if ("error" in input) {
  input  // {error: ...}
}

```

### 内建函数，或自定义函数

```

var input = getUserInput()
input  // number | number[]
if (Array.isArray(input)) {
  input  // number[]
}

```

```

// 验证是否是number类型
function isNumber(x: any): x is number {
  return typeof x === "number";
}

// 验证是否是string类型
function isString(x: any): x is string {
  return typeof x === "string";
}


var input=getUserInput(); //string | number
if (isNumber(input)){
  input // number
}

```

### 赋值

赋值过后的变量，也将发生“窄化”

```
let data: string | number = ..
data // string | number
data ="Hello"
data // string

```

### 布尔运算
执行布尔运算时在一行代码里也会发生窄化
```
var input = getUserInput()
input  // number | string
const inputLength = (typeof input ==="string" && input.length) || input //string
```

## 保留共同属性
当联合类型的所有成员都有相同的属性名称时，这些属性会被保留

```
type Responses =
|{ status: 200, data: any }
|{status :301, to: string }
|{status: 400,error: Error }

const response = getResponse()
response // Responses
switch(response.status) {
  case 200: return response.data
  case 301: return redirect(response.to)
  case 400: return response.error
}
```




# 字面量类型（literal type）

字面量类型指的是使用字面量语法来定义的类型。字面量类型是一种特殊的类型，它允许你使用字面量值来定义类型的约束。

字面量类型包括以下几种：

1. 数字字面量类型：使用数字字面量来定义数字类型的约束。例如，0、1、2 等。
2. 字符串字面量类型：使用字符串字面量来定义字符串类型的约束。例如，"hello"、"world" 等。
3. 布尔字面量类型：使用布尔字面量 true 和 false 来定义布尔类型的约束。
4. 元组字面量类型：使用元组字面量 [item1, item2, ...] 来定义元组类型的约束。例如，[1, "hello"] 表示一个包含一个数字和一个字符串的元组。
5. null 和 undefined 字面量类型：使用 null 和 undefined 字面量来表示 null 和 undefined 类型的约束。
6. 空类型字面量：使用 {} 来定义一个空类型的约束，表示该类型没有任何属性或方法。
7. 任意值字面量类型：使用 any 关键字来定义任意值的约束，表示该类型可以接受任何类型的值。

编译器在编译期间进行类型检查，提高代码的可读性和可维护性。

通常字面量类型不会单独出现，而是配合联合类型，用于约束类型的值

```
declare function handleRequest(url: string, method: "GET" | "POST"): void;

handleRequest(req.url, "GET");  //编译通过

handleRequest(req.url, "MYGET");  //编译不通过，值不合法
```

## as const 作用
使用“as const”将类型锁定为其字面量版本

在 TypeScript 中，as const 用来明确告诉 TypeScript 编译器这个变量是只读的（const），并且它的类型是字面量类型

还是刚刚的例子

```
declare function handleRequest(url: string, method: "GET" | "POST"): void;
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```
编译器会报错

![在这里插入图片描述](644861-20231101185222399-1570927175.png)


原因是req类型被识别为


![在这里插入图片描述](644861-20231101185222350-1373310673.png)

```
const req = { url: "https://example.com", method: "GET" } as const;

```

当加上“as const”识别为字面量版本的类型


![在这里插入图片描述](644861-20231101185221719-29696440.png)



-本章完-