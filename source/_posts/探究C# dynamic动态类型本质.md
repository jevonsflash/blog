---
thumbnail:
cover:
title: '探究C# dynamic动态类型本质'
excerpt:
description:
date: 2023-03-19 09:01:00
tags:
  - .net
  - asp.net core
  - C#

categories:
  - .NET
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-03-19 09:01:00/探究C# dynamic动态类型本质.html
---
本周在做接口动态传参的时候思考了个问题：如何把一个json字符串，转成C#动态类?
比如由
```
{
    'userId': 100,
    'id': 1,
    'title': 'hello world',
    'completed': false
}
```
生成
```
dynamic obj = new
{
    userId = 100,
    id = 1,
    title = "hello world",
    completed = false,
};
```

解决这个问题前，我们先来了解一下`dynamic`动态类型。

## 动态类型是什么？

首先动态类型是静态类，不是一种称之为“动态”的类型，只不过这个类型的对象会跳过静态类型检查。也就是在编译过程中不报错，但是运行程序将对象初始化之后，它该是什么类型，那么还是什么类型。

看个例子，有两个动态类型`obj1`，`obj2`
```
dynamic obj1 = new
{
    userId = 100,
    id = 1,
    title = "hello world",
    completed = false,
};


dynamic obj2 = new System.Dynamic.ExpandoObject();
result.userId = 100;
result.id = 1;
result.title = "hello world";
result.completed = false;

Console.WriteLine("---obj1---");
Console.WriteLine(obj1.userId);
Console.WriteLine(obj1.id);
Console.WriteLine(obj1.title);
Console.WriteLine(obj1.completed);

Console.WriteLine("\n---obj2---");
Console.WriteLine(obj2.userId);
Console.WriteLine(obj2.id);
Console.WriteLine(obj2.title);
Console.WriteLine(obj2.completed);
```
运行结果如下
![在这里插入图片描述](644861-20230408184742924-746762484.png)

他们输出的结果一样，但你认为他们的返回结果是一样的吗？
`obj1`是一个类型为`AnonymousType<int,int,string,bool>`的匿名类，我们可以很轻松地通过反射的方式遍历其成员变量：
```
Type t = obj1.GetType();
PropertyInfo[] pi = t.GetProperties();
foreach (PropertyInfo p in pi)
{

    var key = p.Name;
    var value = p.GetValue(obj1, null);
    Console.WriteLine(key + ": " + value);

}
```
打印如下：

```
userId: 100
id: 1
title: hello world
completed: False
```




而`obj2`则是`System.Dynamic.ExpandoObject`类型的对象，而且从初始化到对象生命周期结束。始终是这个类型。

我们对`obj2`运行同样的代码，发现会报错

```
Type t = obj2.GetType();
PropertyInfo[] pi = t.GetProperties();
foreach (PropertyInfo p in pi)
{

    var key = p.Name;
    var value = p.GetValue(obj1, null);
    Console.WriteLine(key + ": " + value);

}
```
![在这里插入图片描述](644861-20230408184743283-366988634.png)

报错的原因是`obj2`并不包含真正的`userId`成员变量，因为其本质是个`ExpandoObject`对象，

可见`dynamic`关键字并不会改变C#变量在运行时的类型，它仅仅是在编译阶段跳过了静态类型检查。

## 动态类型的特点是什么？

然而你是可以通过重新赋值改变类型的，当然这是公共语言运行时 (CLR) 提供的动态技术。
```
dynamic number = 1;
Console.WriteLine(number.GetType());  //输出System.Int

number = "text";
Console.WriteLine(number.GetType());  //输出System.String
```
当我用ILspy反编译工具查看IL源码的时候，竟发现`number`变量的类型是`object`，也就是整个过程经过了装箱拆箱，经过了从内存栈创建地址引用到堆中区域的改变。`dynamic`帮我们完成了这些动作。所以本质上内存中同一个对象不会平白无故从`int`类型转换为`string`。毕竟C#不能像其他弱类型语言那样使用。
![在这里插入图片描述](644861-20230408184743096-1259158989.png)

`obj1`匿名类的成员变量是只读的。给它赋一个其他类型的值，将会报错；
而给`obj2`的成员变量赋其他类型的值，则不会报错。

```
obj1.userId = "100"; //运行时报错
obj2.userId = "100";
```

在来看obj2，因为`System.Dynamic.ExpandoObject` 类型因实现了 `IDynamicMetaObjectProvider` 因此它能通过`.成员变量`的方式访问内容。

又因为`System.Dynamic.ExpandoObject`实现了`IDictionary<string, object?>`因此可以通过向字典添加KeyValue对象的形式向`ExpandoObject`对象添加成员变量，用`[key]`方式访问内容。代码如下

```
foreach (var entry in obj1)
{
    (obj2 as IDictionary<string, object>).Add(entry.Key, entry.Value.ToString());
}
```
通过`.成员变量`的方式访问内容，可以说这是伪装的成员变量。但稍微一测试，就露馅了。

## 动态类型如何用？
现在我们来回答“如何把一个json字符串，转成C#动态类”这个问题，**答案是做不到**。

首先用`Newtonsoft.Json`库转换的结果，无论是用`JObject.Parse(json)`还是`JsonConvert.DeserializeObject(json)`
最后返回的结果是`JToken`类型的对象，
通过反编译`Newtonsoft.Json.dll`，查看`JToken`类型，可见它还是一个继承了`IDictionary<string, object?>`和`IDynamicMetaObjectProvider`的类型，
![在这里插入图片描述](644861-20230408184743206-194109041.png)

```
string json = @"{
    'userId': 100,
    'id': 1,
    'title': 'hello world',
    'completed': false
}";
var obj1 = JObject.Parse(json);

dynamic obj2 = new System.Dynamic.ExpandoObject();

foreach (var entry in obj1)
{
    (obj2 as IDictionary<string, object>).Add(entry.Key, entry.Value.ToString());
}

```

运行如上同样的代码检查obj2

```
Type t = obj2.GetType();
PropertyInfo[] pi = t.GetProperties();
foreach (PropertyInfo p in pi)
{

    var key = p.Name;
    var value = p.GetValue(obj1, null);
    Console.WriteLine(key + ": " + value);

}
```
![在这里插入图片描述](644861-20230408184743003-675790652.png)


可以通过这样向`obj2`动态添加成员变量，但是始终是字典方式提供的**伪对象**。