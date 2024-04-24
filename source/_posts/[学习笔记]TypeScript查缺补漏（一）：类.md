---
thumbnail: images/a7b426f027554ddcbce196b962043da2.png
title: '[学习笔记]TypeScript查缺补漏（一）：类'
excerpt: >-
  private在编译后JavaScript中没有影响，仅对TypeScript编译器有影响，而使用#符号声明的私有属性在JavaScript中会被编译为常规的私有属性。Getter/Setter可以在不改变属性的访问权限的情况下，对属性的值进行更精细的控制。装饰器是使用
  @
  符号来标识的特殊类型的函数，可以用来扩展类或方法的行为。尽管箭头函数是在对象的方法中定义的，但是它不会捕获到调用该方法的对象作为自己的this上下文。在箭头函数中，this不指向调用该函数的对象，而是指向定义该箭头函数时的上下文。
tags:
  - TypeScript
categories:
  - JavaScript
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-10-31 21:34:00/[学习笔记]TypeScript查缺补漏（一）：类.html'
abbrlink: a61f9927
date: 2023-10-31 21:34:00
cover:
description:
---
<!-- toc -->
# 基础知识


## 创建类型

```
class Abc { }
```
## 类的初始化

```
const abc = new Abc();
```





## 类型和值

类既可以作为类型使用，也可以作为值使用。

```

const a:Bag = new Bag()

```

## JSDoc 注释

JSDoc 是 JavaScript 的一种注释规范，它使用特定的注释格式来自动生成 API 文档。JSDoc 通过注释来提取信息，例如函数名、参数类型和返回类型等，然后使用这些信息生成人类可读的文档。

示例：

```
/**  
 * 这是一个函数注释  
 * @param {string} 参数名 - 参数描述  
 * @returns {number} 返回值描述  
 */  
function myFunction(参数名) {  
  // 函数实现  
  return 0;  
}

```
在这个例子中，/** 开始一个多行注释，然后在注释中使用 @param 和 @returns 来描述函数的参数和返回值。JSDoc 还支持其他注释标签，例如 @description、@type 和 @example 等。


## 字段

```
class User extends Account implements Updatable, Serializable {
    id: string;                     //普通字段
    displayName?: boolean;          //可选字段
    name!: string;                  //非可选字段
    #attributes: Map<any， any>;    //私有字段
    roles = ["user"];               //有默认值的字段
    readonly createdAt = new Date() // 带有默认值的只读字段
}
```

### 私有字段

```
class Foo {  
    private myAny = 1;  
}  
  
class Bar {  
    #myAny = 1;  
}

```

私有成员只能在它们所属的类内部访问，类的外部无法直接访问这些私有成员。

示例：

```
class MyClass {  
    #myPrivateVariable: string;  
  
    public myPublicMethod() {  
        console.log(this.#myPrivateVariable); // 正确，可以在类内部访问私有成员  
    }  
}  
  
const obj = new MyClass();  
console.log(obj.#myPrivateVariable); // 错误，私有成员无法从外部访问
```

区别
private在编译后JavaScript中没有影响，仅对TypeScript编译器有影响，而使用#符号声明的私有属性在JavaScript中会被编译为常规的私有属性。


### 可选和非可选字段

感叹号（!）用于标记属性或方法为非可选（non-optional）。这意味着该属性或方法在类实例化时必须提供值，否则将导致编译错误。
```
class Person {  
  constructor(public name: string, public age: number!) {  
  }  
}  

const person = new Person("Alice", 25); // 正确，age 属性必须提供值  
const personOptional = new Person("Bob"); // 错误，age 属性未提供值

```

问号（?）用于标记属性或方法为可选（optional）。这意味着该属性或方法在类实例化时可以省略，不会导致编译错误。

```
class Person {  
  constructor(public name: string, public age?: number) {  
  }  
}  
  
const person = new Person("Alice"); // 正确，age 属性未提供值  
const personOptional = new Person("Bob", 25); // 正确，age 属性提供了值

```

### 字段类型约束

`[key: string]: number; `是一种对象类型的写法，表示对象的键是字符串类型，值是数字类型。

示例：

```
const person: { [key: string]: number } = {  
  age: 25,  
  height: 170,  
  weight: 65  
};
```

## Getter/Setter

Getter 是一个获取属性的方法，Setter 是一个设置属性的方法。可以使用 get 和 set 关键字来定义它们。
Getter/Setter可以在不改变属性的访问权限的情况下，对属性的值进行更精细的控制。比如可以在读取或设置属性的值时添加额外的逻辑。
```
class Person {  
  private _name: string;  
  
  get name(): string {  
    return this._name;  
  }  
  
  set name(value: string) {  
    this._name = value;  
  }  
}  
  
let person = new Person();  
person.name = "John"; // 使用 setter 设置值  
console.log(person.name); // 使用 getter 获取值，输出 "John"

```

## 静态成员

静态方法中this指向类本身，而不是类的实例对象。

```
class StaticClass {  
    n?:number=4;

    //静态字段
    static s:number

    //静态方法
    static staticMethod() {  
        this.s=5
        console.log('This is a static method');  
  }  
}

StaticClass.staticMethod(); // 调用静态方法
var staticClass=new StaticClass();
console.log(staticClass.n)     //类成员不受影响 ，输出4
console.log(staticClass.s)     //undefined 


console.log(StaticClass.n)     //undefined
console.log(StaticClass.s)     //静态类成员不受影响 ，输出5
```

## 函数重载

在 TypeScript 中，可以使用函数重载（Function Overloading）来定义多个同名函数，它们具有不同的参数类型或参数数量。这可以帮助提高代码的可读性和可用性。

要实现函数重载，需要遵循以下规则：

1. 重载的函数必须同名。
2. 重载的函数参数类型或数量必须不同。
3. 重载的函数可以有一个或多个重载。
4. 函数重载不能改变函数的返回类型。

示例：

```
  update: (retryTimes: number) => void;
  update(retryTimes: number): void;
```

## 构造函数


构造函数是用于创建和初始化对象实例时候被调用的特殊方法，用于初始化对象的属性并为其分配内存空间。

示例：

```
class Person {  
  private name: string;  
  private age: number;  
  
  constructor(name: string, age: number) {  
    this.name = name;  
    this.age = age;  
  }  
  
  greet() {  
    console.log(`名字 ${this.name} 年龄 ${this.age}`);  
  }  
}  
  
var person = new Person("John", 30);  
person.greet(); // 输出 "名字 John 年龄 30" 
```

### 参数属性

可以使用参数属性（Parameter Properties）来在类中定义与函数参数相关的属性。参数属性提供了一种简洁的方式来声明与函数参数相关的属性，而不需要显式地使用 this 关键字。

示例：

```
class Person {  
  constructor(public name: string, public age: number) {}  
}

var person = new Person("John", 30);  
console.log(person.name); // 输出 "John"  
console.log(person.age); // 输出 30
```


## 类的实例化


```
  
  (): JSONResponse              //  可以通过 () 调用这个对象 -（JS中的函数是可以调用的对象） 
  new(s: string): JSONResponse; // 可以在此类对象上使用 new
```


示例：实例化泛型对象

```
class Person {  
  age= 25;
  height= 170;  
  weight= 65;
  constructor() {  
  }  
}  

class PersonService<TService> {
    Service?: TService;
    Init(service?: { new(): TService }) {
        if (service != null) {
            this.Service = new service();
        }
    }
}

var p = new PersonService<Person>(); 
p.Init(Person);
console.log(p.Service?.age);  // 25
console.log(p.Service?.height);  // 170
console.log(p.Service?.weight);  // 65

```
# 箭头函数

在箭头函数中，this不指向调用该函数的对象，而是指向定义该箭头函数时的上下文。
尽管箭头函数是在对象的方法中定义的，但是它不会捕获到调用该方法的对象作为自己的this上下文。

示例：

```
let obj = {  
    value: "I am an object",  
    printValue: () => { console.log(this.value); }  
}  
  
obj.printValue(); // 输出："I am an object"

```

## this的作用域

### 全局
在全局作用域或单独的函数作用域中，this引用的是全局对象。

```
console.log(this); // 在全局作用域中输出：window对象  
  
function testFunc() {  
    console.log(this); // 在函数作用域中输出：window对象  
}  
  
testFunc();
```


### 类和对象方法
当函数作为对象的方法被调用时，this指的是obj对象。
```
let obj = {  
    name: 'Example Object',  
    printName: function() {  
        console.log(this.name);   
    }  
}  
  
obj.printName(); // 输出："Example Object"
```
当调用类中的函数时，this指的是类的实例对象。
```
class MyClass {  
    myMethod() {  
        console.log(this); // 输出：MyClass的实例对象  
    }  
}  
  
const obj = new MyClass();  
obj.myMethod();
```


# 泛型

泛型是一种允许你在定义类、接口、函数和方法时使用类型参数的功能。泛型允许你编写灵活的代码，同时保持类型安全。通过使用泛型，你可以在强类型环境中编写可重用的代码，而无需担心具体的类型实现细节。

## 泛型类

```

class Box<Type>{
    contents?: Type
    constructor(value: Type) {
    this.contents = value;
}}

var stringBox = new Box("a package");
console.log(stringBox.contents) // a package

```

## 泛型接口

```
interface Generator<T> {  
  generate(): T;  
}  
  
class RandomNumberGenerator implements Generator<number> {  
  generate() {  
    return Math.random();  
  }  
}  
  
let generator = new RandomNumberGenerator();  
let randomNumber = generator.generate(); // 类型为 number

```

## 泛型函数

```
function identity<T>(arg: T): T {  
  return arg;  
}  
  
let x = identity<number>(123); // 类型为 number  
let y = identity<string>("hello"); // 类型为 string
```



# 装饰器

装饰器是使用 @ 符号来标识的特殊类型的函数，可以用来扩展类或方法的行为。实现类似面向切面编程的特性。

可以在类、类方法、访问器、属性和方法参数上使用装饰器

示例：

```
function log(target: any, obj:any) {  
  console.log(target)
  console.log(`Creating instance of ${target.name}`);  
}  
  
@log  
class MyClass {  
  myMethod() {  
    console.log("Hello, World!");  
  }  
}  

const instance = new MyClass();
```


TypeScript示例可在https://www.typescriptlang.org/play中调试