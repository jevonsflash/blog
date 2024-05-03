---
title: js 、prototype、__proto__ 的理解
categories:
  - - 转载
  - - Javascript
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2021-07-04 23:17:21/js 、prototype、__proto__ 的理解.html'
abbrlink: c3caebc8
date: 2021-07-04 23:17:21
thumbnail:
cover:
description:
tags:
---
<!-- toc -->


### 阅读之前必须知道的基本知识

首先要了解js的基本规则 原型继承

简单的看如下 代码

function MakeObj(){ths.a=2;}

MakeObj.prototype.b=3;//在原型上创建属性b 赋值为3

let mObj=new MakeObj();

mObj.a //就是自有属性

mObj.b //就是继承属性 值为3

怎么继承来的呢？就是通过mObj.\_\_proto\_\_指向MakeObj.prototype继承来的，可以理解为Make.prototype把属性传递给mObj.\_\_proto\_\_，mObj.\_\_proto\_\_再传递给mObj，让mObj得到了继承来的属性，如果要问为什么有这层关系，那是js的原型继承规则定义的，造物主设计成这样的。

  

**上面出现了几个关键字 prototype ， \_\_proto\_\_ 要想更加深入了解 ，首先自己要提出几个问题**

1..prototype是什么，如何产生的，哪些对象有这个属性 哪些对象没有

2.\_\_proto\_\_是什么，如何产生的 ，哪些对象有这个属性 哪些对象没有

3.他们相互之间有什么关系

涉及到哪些对象有这个属性，哪些对象无，首先要解决的问题时进行对象分类；有无某个属性反应的是对象特征，不同类的对象就有不同的特征，知道对象分类后 就能够回答上面的问题了

  

  

### **1.对象分类**

下面是我个人定义的对象分类，主要是为了方便理解记忆

js对象分成3类， 由Object 创建的 叫普通对象，，由Function创建的叫函数对象,伴随函数对象创建的prototype叫原型对象。

看下面代码就能够大概理解了

var obj={};//普通对象

function fun(){} //fun叫函数对象

fun.prototype; // 原型对象

var obj={}; 是一种创建对象的语法糖，其本质是var obj=new Object();

定义一个函数 function fun(){},也是语法糖 其实质是调用var fun=new Function();

其实Object是一个函数对象 因为他也是Function创建的，所以可以说 **普通对象是由函数对象创建的，函数对象是由Function创建；原型对象是伴随函数对象创建而产生的。**

**总结 对象根据特殊性可分成三类 函数对象 原型对象 普通对象**

  

### **2.普通对象的特征说明**

普通对象是函数对象new一下创建的，他要从函数对象prototype原型那里继承到属性，所以就必定有\_\_proto\_\_这个属性，行类人叫他隐式原型。

普通对象的特征就清楚了 ，**普通对象一定有一个自有的隐式原型\_\_proto\_\_属性。**

隐式原型是怎么产生的呢，**在new 的时候自动生成的，js的原型继承规则自动让他指向函数对象的prototype.**

  

### **3.函数对象的特征说明**  

直接给出答案，**函数对象他的特征就是 一定有两个自有属性 prototype ， \_\_proto\_\_,**

一.根据原型继承规则，函数对象要通过prototype属性提供继承信息给由他new的普通对象，所以函数对象一定有prototype原型属性，

二. 函数对象他们的本质是new Function产生的，所以就要从Function.prototype属性上继承信息，要能够继承信息 就必须有 隐式原型\_\_proto\_\_ ；在这里可以明白 函数对象相对于Function而言 也就是一个普通对象，也是别人new 出来的，是别人new出来的就是普通对象。只不过通过Object new 出来的，和通过Function new出来的是有差异的。

  

  

### **4.原型对象prototype说明**

prototype对象他有一个constructor属性 ； 他指向对应的函数对象，即fun.prototype.constructor===fun为true;(这些都是js设计者设计成这样的，有什么好处下面有分析)

这种关系的简单记忆法: **因为要创建函数对象伴随着产生了原型对象，所以原型对象的constructor指向他的创建者函数对象，**重复理解 :系统因为要创建fun函数对象，所以伴随着产生了fun.prototype原型对象，为了记住祖宗 所以fun.prototype.constructor指向fun函数对象。

原型上有一个constructor属性有什么好处呢，造物主为什么要这样设计-------因为这样函数对象创建的普通对象就能够继承到这个属性，就可以很简单的访问到对应的函数对象/构造函数。

列如 function Test2(){}; var obj2=new Test2(); obj2.constructor ===Test2 就为true; 知道一个普通对象的构造函数有什么用，我想到的是深度复制时可以使用。当然其他的情况靠大家去用了 函数对象上如果还有其他自定义的属性 方法等,那访问起来就很方便了。

**还有一个问题prototype对象 创建他的函数是谁呢** ，是Object创建的，

类似这样的代码 new Object({constructor:'对应函数对象'}) ,这里有一个不明显的知识点，原型对象既然是Object函数创建的，所以他也是一个普通对象，所以原型对象有一个自有属性 隐式原型\_\_proto\_\_，它指向Object.prototype.

这里总结一下 **自动生成的原型对象最大的特征是constructor没有指向自己的构造者,而被重置为对应的函数对象**

**为什么要区分自动生成的原型对象?，如果你覆盖原型对象，constructor属性就会指向真实的创建对象**

**看如下代码**

function Test(){ }

Test.prototype={bb:45};

这个时候 Test.prototype.constructor 就指向Object了

覆盖后原型对象就彻底变成了一个普通对象 ，当然你也可以手动设置回来, 如让 Test.prototype.constructor=Test;

原型对象与普通对象的区别 就是看constructor是否真实的指向自己的构造函数,另外还有是自有还是继承来的,普通对象constructor是继承来的,原型对象是constructor属性是自有的。

  

在这里补充一个隐藏的知识点,函数的创建过程 :

**js上帝用Function创建了函数对象，然后又用Object创建了它的原型对象，然后函数对象，原型对象都有普通对象的全部特征。**

###   

### 5.总结一下

**a.函数对象一定有两个自有属性 prototype 和\_\_proto\_\_;**

**b.原型对象一定有两个constructor，\_\_proto\_\_属性。**  

**c.普通对象一定有 一个 \_\_proto\_\_自有属性,**

**d 相互关系**

**普通对象的隐式原型\_\_proto\_\_指向创建者的的原型prototype 属性 ，即完全相等;**

**原型对象的prototype.constructor指向伴随着产生他的创建者，即完全相等;**

  

### **6.Object 与Function的关系**

看到这里，最大的Boss要出场了,他们两个之间有什么关系呢。

a.Object是Function创建的 ，

所以 Object.\_\_proto\_\_===Function.prototype 为true, Object.constructor===Function 为true.

  

b. Function.prototype 原型对象 是Object创建的 所以有

Function.prototype.\_\_proto\_\_===Object.prototype 为true

符合那句话特征:函数对象Function创建,原型对象Object创建，掌握这句话 就好记住这个关系了。

a ,b两条已经说清楚了 Object 与Function的关系，但是有两个问题还存在Object.prototype是谁创建的，Function 是谁创建的

  

**Object.prototype是谁创建的**

Object.prototype,他有一个特征 Object.prototype.\_\_proto\_\_===null为true ，说明他不从任何对象那里继承属性，而普通对象一般都从Object.prototype对象上继承属性， Object.prototype是原型继承链的顶端。

不继承任何属性的对象如何创建？万能的Object提供了Object.Create方法可以创建,代码如下

Object.prototype=Object.Create(null); 这样创建的对象就不继承任何属性了

**总结 Object.prototype=Object.Create(null); 创建了Object.prototype原型对象**

**Function 是谁创建的**

是js上帝创建的了

打印Function.\_\_proto\_\_得到的是 ƒ () { \[native code\] }

打印 Function.constructor 得到的是 ƒ Function() { \[native code\] }

  

  

### **7.从js看如何创建一门编程语言**

创建 js 这门语言 其实首先定义一条原型继承的规则，底层实现 Function对象的逻辑，然后用Function就可以构造各种对象了，其中把Object特殊化 让他承担起原型继承的重任。

js一门解释执行的语言，定义解释规则时 其实只要定义好Function的解释规则就行，因为一切对象都可以抽象成由Function直接或间接创建 。

当然这里我有点猜，不过不要紧 ,猜也是人们创建基本认知的过程，对错的认知都会让人远离陌生未知带来的恐惧。

  

最后用一句话总结 《道德经》第四十二章首句：道生一，一生二，[二生三](https://link.zhihu.com/?target=https%3A//baike.baidu.com/item/%25E4%25BA%258C%25E7%2594%259F%25E4%25B8%2589/12674292)，三生万物 -------------js语言创建过程也是这样 。