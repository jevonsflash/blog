---
thumbnail: images/3329da6845684af7a322331cb35c6005.png
title: 将Abp默认事件总线改造为分布式事件总线
excerpt: >-
  定义NotificationEventData，用于传递自定义事件。set;set;set;set;在消费者端，定义一个事件处理器，用于处理自定义事件。在生产者端，触发自定义事件。运行程序，可以看到消费者端打印出了自定义事件。
tags:
  - Abp
categories:
  - .NET
  - 架构
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-12-20 17:14:00/将Abp默认事件总线改造为分布式事件总线.html'
abbrlink: 30f4df2
date: 2023-12-20 17:14:00
cover:
description:
---

<!-- toc -->
# 原理

本地事件总线是通过Ioc容器来实现的。

IEventBus接口定义了事件总线的基本功能，如注册事件、取消注册事件、触发事件等。

Abp.Events.Bus.EventBus是本地事件总线的实现类，其中私有成员`ConcurrentDictionary<Type, List<IEventHandlerFactory>> _handlerFactories`是事件订阅表。通过维护事件订阅表来实现事件处理器的注册和取消注册。当对应类型的事件触发时，通过订阅表查找所有事件处理器，通过Ioc容器来获取处理器实例，然后通过反射来调用事件处理器的"HandleEvent"方法。


## 创建分布式事件总线

首先，我们需要一个分布式事件总线中间件，用来将事件从本地事件总线转发到分布式事件总线。常用的中间件有RabbitMQ、Kafka、Redis等。

开源社区已经有实现好的库，本项目参考了 [wuyi6216/Abp.RemoteEventBus](https://github.com/wuyi6216/Abp.RemoteEventBus)

这里已经定义好了一个分布式事件总线接口

```csharp

public interface IDistributedEventBus : IDisposable
{
    void MessageHandle(string topic, string message);

    void Publish(IDistributedEventData eventData);

    void Subscribe(string topic);

    void Unsubscribe(string topic);

    void UnsubscribeAll();
}

```

为了兼容本地事件总线，我们需要定义一个分布式事件总线接口，继承自IEventBus接口。

```csharp

public interface IMultipleEventBus : IDistributedEventBus, IEventBus
{

}


```





## 实现自动订阅和事件转发

当注册本地事件时，将订阅分布式事件，事件Topic为类型的字符串表现形式

```
public IDisposable Register(Type eventType, IEventHandlerFactory factory)
{
    GetOrCreateHandlerFactories(eventType);
    List<IEventHandlerFactory> currentLists;
    if (_handlerFactories.TryGetValue(eventType, out currentLists))
    {
        lock (currentLists)
        {
            if (currentLists.Count == 0)
            {
                //Register to distributed event
                this.Subscribe(eventType.ToString());
            }
            currentLists.Add(factory);
        }
    }
    return new FactoryUnregistrar(this, eventType, factory);
}

```

创建TriggerRemote，此方法用于将本地事件参数打包成为分布式事件消息payload，并发布该消息

```
public void TriggerRemote(Type eventType, object eventSource, IEventData eventData)
{
    var exceptions = new List<Exception>();
    eventData.EventSource = eventSource;
    try
    {
        var payloadDictionary = new Dictionary<string, object>
                {
                    { PayloadKey, eventData }
                };
        var distributedeventData = new DistributedEventData(eventType.ToString(), payloadDictionary);
        Publish(distributedeventData);
    }

    catch (Exception ex)
    {
        exceptions.Add(ex);
    }
    if (exceptions.Any())
    {
        if (exceptions.Count == 1)
        {
            exceptions[0].ReThrow();
        }

        throw new AggregateException("More than one error has occurred while triggering the event: " + eventType, exceptions);
    }
}


```

当触发本地事件时，将消息转发至分布式事件总线。
在Trigger方法中调用TriggerRemote，事件状态回调和事件异常回调将不会被转发。


```
if (!(typeof(DistributedEventBusEvent) == eventType
   || typeof(DistributedEventBusEvent).IsAssignableFrom(eventType)
   || typeof(DistributedEventMessageHandleExceptionData) == eventType
   || typeof(DistributedEventHandleExceptionData) == eventType
    ))
{
    if (typeof(DistributedEventArgs) != eventType)
    {
        TriggerRemote(eventType, eventSource, eventData);

    }
}
```

在消费端接收到分布式事件消息时，从Topic中解析类型，转发给本地事件。若此类型在本地事件注册过，则将消息反序列化为本地事件参数，然后触发本地事件。
本地事件处理器将触发最终的处理方法。

```

public virtual void MessageHandle(string topic, string message)
{
    Logger.Debug($"Receive message on topic {topic}");
    try
    {
        var eventData = _remoteEventSerializer.Deserialize<DistributedEventData>(message);
        var eventArgs = new DistributedEventArgs(eventData, topic, message);
        Trigger(this, new DistributedEventBusHandlingEvent(eventArgs));

        if (!string.IsNullOrEmpty(eventData.Type))
        {
            string pattern = @"(.*?)\[(.*?)\]";
            Match match = Regex.Match(eventData.Type, pattern);
            if (match.Success)
            {

                var type = match.Groups[1].Value;
                var type2 = match.Groups[2].Value;

                var localTriggerType = typeFinder.Find(c => c.FullName == type).FirstOrDefault();
                var genericType = typeFinder.Find(c => c.FullName == type2).FirstOrDefault();

                if (localTriggerType != null && genericType != null)
                {

                    if (localTriggerType.GetTypeInfo().IsGenericType
                        && localTriggerType.GetGenericArguments().Length == 1
                        && !genericType.IsAbstract && !genericType.IsInterface
                        )
                    {
                        var localTriggerGenericType = localTriggerType.GetGenericTypeDefinition().MakeGenericType(genericType);


                        if (eventData.Data.TryGetValue(PayloadKey, out var payload))
                        {
                            var payloadObject = (payload as JObject).ToObject(localTriggerGenericType);
                            Trigger(localTriggerGenericType, this, (IEventData)payloadObject);

                        }
                    }
                }


            }
            else
            {
                var localTriggerType = typeFinder.Find(c => c.FullName == eventData.Type).FirstOrDefault();
                if (localTriggerType != null && !localTriggerType.IsAbstract && !localTriggerType.IsInterface)
                {
                    if (eventData.Data.TryGetValue(PayloadKey, out var payload))
                    {
                        var payloadObject = (payload as JObject).ToObject(localTriggerType);
                        Trigger(localTriggerType, this, (IEventData)payloadObject);

                    }

                }
            }
            Trigger(this, new DistributedEventBusHandledEvent(eventArgs));

        }
    }
    catch (Exception ex)
    {
        Logger.Error("Consume remote message exception", ex);
        Trigger(this, new DistributedEventMessageHandleExceptionData(ex, topic, topic));
    }
}

```



# 使用

DistributedEventBus有不同的实现方式，这里以Redis为例

## 启动Redis服务

下载Redis并启动服务，使用默认端口6379

## 配置

生产者和消费者端都需要配置分布式事件总线

首先引用Abp.DistributedEventBus.Redis，并配置Abp模块依赖


`[DependsOn(typeof(AbpDistributedEventBusRedisModule))]`


在PreInitialize方法中配置Redis连接信息

```
 Configuration.Modules.DistributedEventBus().UseRedis().Configure(setting =>
 {
     setting.Server = "127.0.0.1:6379";
 });

```

用MultipleEventBus替换Abp默认事件总线

```
 //todo: 事件总线
 Configuration.ReplaceService(
  typeof(IEventBus),
  () => IocManager.IocContainer.Register(
      Component.For<IEventBus>().ImplementedBy<MultipleEventBus>()
  ));
```




## 传递Abp默认事件

我们知道在使用仓储时，Abp会自动触发一些事件，如创建、更新、删除等。我们来测试这些事件是否能通过分布式事件总线来传递。

定义一个实体类，用于传递实体的增删改事件。

```csharp

public class Person : FullAuditedEntity<int>
{

    public string Name { get; set; }
    public int Age { get; set; }
    public string PhoneNumber { get; set; }

}

```

在消费者端，定义一个事件处理器，用于处理实体的增删改事件。

```csharp

public class RemoteEntityChangedEventHandler :
    IEventHandler<EntityUpdatedEventData<Person>>,
    IEventHandler<EntityCreatedEventData<Person>>,
    IEventHandler<EntityDeletedEventData<Person>>,
    ITransientDependency
{

    void IEventHandler<EntityUpdatedEventData<Person>>.HandleEvent(EntityUpdatedEventData<Person> eventData)
    {
        var person = eventData.Entity;
        Console.WriteLine($"Remote Entity Updated - Name:{person.Name}, Age:{person.Age}, PhoneNumber:{person.PhoneNumber}");
    }

    void IEventHandler<EntityCreatedEventData<Person>>.HandleEvent(EntityCreatedEventData<Person> eventData)
    {
        var person = eventData.Entity;
        Console.WriteLine($"Remote Entity Created - Name:{person.Name}, Age:{person.Age}, PhoneNumber:{person.PhoneNumber}");

    }

    void IEventHandler<EntityDeletedEventData<Person>>.HandleEvent(EntityDeletedEventData<Person> eventData)
    {
        var person = eventData.Entity;
        Console.WriteLine($"Remote Entity Deleted - Name:{person.Name}, Age:{person.Age}, PhoneNumber:{person.PhoneNumber}");

    }
}


```

在生产者端，用IRepository对实体进行增删改操作。

```csharp

var person = new Person()
{

    Name = "John",
    Age = 36,
    PhoneNumber = "18588888888"

};

personRepository.Insert(person);

var person2 = new Person()
{

    Name = "John2",
    Age = 36,
    PhoneNumber = "18588888889"

};
personRepository.Insert(person2);

var persons = personRepository.GetAllList();
foreach (var p in persons)
{
    p.Age += 1;
    personRepository.Update(p);
    Console.WriteLine($"Entity Updated - Name:{p.Name}, Age:{p.Age}, PhoneNumber:{p.PhoneNumber}");

}
foreach (var p in persons)
{
    personRepository.Delete(p);
    Console.WriteLine($"Entity Deleted - Name:{p.Name}, Age:{p.Age}, PhoneNumber:{p.PhoneNumber}");

}


```

运行程序（同时运行消费者端和生产者端），可以看到消费者端打印出了实体的增删改事件。


![在这里插入图片描述](644861-20231220171312862-1954524450.png)


注意：

分布式事件总线在两个独立系统间传递事件，所以需要定义一个共同的类型对象，用于事件参数的传递。
因此消费者端需要引用生产者端的模块，以便获取共同的类型对象。

```
public override Assembly[] GetAdditionalAssemblies()
{
    var clientModuleAssembly = typeof(Person).GetAssembly();
    return [clientModuleAssembly];
}
```






## 传递自定义事件

定义NotificationEventData，用于传递自定义事件。

```

public class NotificationEventData : EventData
{
    public int Id { get; set; }
    
    public string Title { get; set; }

    public string Message { get; set; }

    public bool IsRead { get; set; }
}
```

在消费者端，定义一个事件处理器，用于处理自定义事件。

```
public class NotificationEventHandler :
    IEventHandler<NotificationEventData>,      
    ITransientDependency
{
    
    void IEventHandler<NotificationEventData>.HandleEvent(NotificationEventData eventData)
    {
        Console.WriteLine($"Id: {eventData.Id}");
        Console.WriteLine($"Title: {eventData.Title}");
        Console.WriteLine($"Message: {eventData.Message}");
        Console.WriteLine($"IsRead: {eventData.IsRead}");

    }
}
```


在生产者端，触发自定义事件。

```
var eventBus = IocManager.Instance.Resolve<IEventBus>();


eventBus.Trigger<NotificationEventData>(new NotificationEventData()
{
    Title = "Hi",
    Message = "Customized definition event test!",
    Id = 100,
    IsRead = true,
});
```

运行程序（同时运行消费者端和生产者端），可以看到消费者端打印出了自定义事件。

![在这里插入图片描述](644861-20231220171312795-1889529012.png)

# 项目地址

[Github:DistributedEventBus](https://github.com/jevonsflash/DistributedEventBus)