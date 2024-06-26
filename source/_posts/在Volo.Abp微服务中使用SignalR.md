---
thumbnail: images/ba307bfc276b4de8a250727d9d4dd512.png
title: 在Volo.Abp微服务中使用SignalR
excerpt: 假设需要通过Signalr发送消息通知，并在前端接收消息通知的功能。
tags:
  - asp.net core
  - Volo.Abp
  - SignalR
categories:
  - [.NET]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-08-03 17:48:00/在Volo.Abp微服务中使用SignalR.html'
abbrlink: 6a33f4ba
date: 2023-08-03 17:48:00
cover:
description:
---

假设需要通过SignalR发送消息通知，并在前端接收消息通知的功能

## 创建SignalR服务

在项目中引用
```
abp add-package Volo.Abp.AspNetCore.SignalR
```
在Module文件中添加对模块依赖

```
[DependsOn(
    ...
    typeof(AbpAspNetCoreSignalRModule)
    )]
public class IdentityApplicationModule : AbpModule
```

创建接口INotificationHub
```
public interface INotificationHub
{
    // 发送消息
    Task ReceiveTextMessageAsync(SendNotificationDto input);
}

```
也可以不创建接口，AbpHub类，定义了泛型和非泛型的类型。


创建NotificationHub类，继承AbpHub<INotificationHub>。
可以直接继承Microsoft.AspNetCore.SignalR.Hub，但是这样就不能使用已注入的属性，如 CurrentUser
```
/// <summary>
/// SignalR消息Hub
/// </summary>
[HubRoute("signalr/Identity/notification")]
[Authorize]
[DisableAuditing]
public class NotificationHub : AbpHub<INotificationHub>
{

}
```

### 发送SignalR消息

在需要调用的地方注入IHubContext，并初始化
```
private readonly IHubContext<NotificationHub, INotificationHub> _hubContext;
public NotificationAppService(IHubContext<NotificationHub, INotificationHub> hubContext) 
{
    _hubContext = hubContext;
}
```


使用下面的方式发送给指定用户或者所有用户

```
public async Task SendMessageToUsersAsync(List<string> userIds, SendNotificationDto sendNotificationDto)
{
    await _hubContext.Clients
        .Users(userIds.AsReadOnly().ToList())
        .ReceiveTextMessageAsync(sendNotificationDto);
}


public async Task SendMessageToAllAsync(SendNotificationDto sendNotificationDto)
{
    await _hubContext.Clients.All.ReceiveBroadCastMessageAsync(sendNotificationDto);
}
```

### 配置Ocelet网关

为/signalr/identity/路由创建转发规则

当SignalR开始连接时，首先发送协商协议请求，协商协议返回availableTransports告诉客户端支持哪些协议，以及connetcionId和connectionToken，这两个值会在后续的连接中使用。

![在这里插入图片描述](644861-20230803174704358-1547486526.png)

在当前路由配置下，请求地址是：/signalr/identity/negotiate，此http请求会通过网关转发到IdentityServer。

在Gateway项目的appsettings.json中配置网关转发规则，如下：

```
"Routes": [
    {
      "DownstreamPathTemplate": "/signalr/identity/{everything}",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [
        {
          "Host": "localhost",
          "Port": 44368
        }
      ],
      "UpstreamPathTemplate": "/signalr/identity/{everything}",
      "UpstreamHttpMethod": [ "Put", "Delete", "Get", "Post" ]
    },
    ...
```


除此之外还要配置ws协议的转发规则，SignalR首先尝试建立WebSocket连接，WebSocket是 SignalR的最佳传输方式，配置如下：
```
  {
    "DownstreamPathTemplate": "/signalr/identity/{everything}",
    "DownstreamScheme": "ws",
    "Priority": 1,
    "DownstreamHostAndPorts": [
      {
        "Host": "localhost",
        "Port": 44368
      }
    ],
    "UpstreamPathTemplate": "/signalr/identity/{everything}",
    "UpstreamHttpMethod": [ "Put", "Delete", "Get", "Post" ]
  },
```

尽量使用kestrel运行网关程序，IIS7.0之前不支持websocket，若使用IIS请确保Websocket功能已经打开。
在UseOcelot()之前添加UseWebSockets()，以便网关能接收ws或wss协议的请求。若不加这个网关会在转发时返回499错误码。
```
app.UseWebSockets();
app.UseOcelot().Wait();
```
## 创建SignalR客户端

客户端安装取决于你的UI框架/客户端类型。若使用Asp.NetCore MVC或Razor，请参考abp[官方文档](https://docs.abp.io/zh-Hans/abp/latest/SignalR-Integration)
这里补充其他UI框架的使用方法。在webpackage项目中添加对SignalR的依赖

```
yarn add @microsoft/signalr
```

创建一个hubConnection
在main.js中添加如下代码

```
const hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl(baseURL + requestUrl, {
    headers: header,
    accessTokenFactory: () => getAccessToken(),
    transport: signalR.HttpTransportType.WebSockets,
    logMessageContent: true,
    logger: signalR.LogLevel.Information,
  })
  .withAutomaticReconnect()
  .withHubProtocol(new signalR.JsonHubProtocol())
  .build();
```

accessTokenFactory回调用于获取access_token的，会在每次请求时调用以保证获取最新的access_token。


### 连接服务
在需要使用的地方调用hubConnection方法

```
hubConnection.start() //开始连接
hubConnection.stop()  //停止连接
```

### 订阅消息
```
hubConnection.on("ReceiveTextMessage", (newMsg) => {
  console.info("new msg recived!", newMsg)
});
```



## 身份验证

WebSockets不支持自定义Header，所以不能使用Authorization，需要使用access_token参数传递令牌

### 客户端
在客户端中配置getAccessToken，如下：

```
const getAccessToken: Function = (): string => {
  var token = UserModule.token !== undefined ? UserModule.token : ""; 
  return token;
}
```

UserModule.token是当前登录用户的token，需要在登录成功后保存到UserModule中。


### 服务端

在服务端中，若已经使用了IdentityServer，则需要在Startup中配置IdentityServerAuthentication，配置如下：

```
context.Services.AddAuthentication("Bearer")
    .AddIdentityServerAuthentication(options =>
    {
        options.Authority = configuration["AuthServer:Authority"];
        options.ApiName = configuration["AuthServer:ApiName"];
        options.RequireHttpsMetadata = Convert.ToBoolean(configuration["AuthServer:RequireHttpsMetadata"]);
        options.TokenRetriever = (request) =>
        {
            var path = request.Path;
            if (path.StartsWithSegments("/signalr"))
            {
                var accessToken = request.Query["access_token"].FirstOrDefault();

                if (!accessToken.IsNullOrWhiteSpace())
                {
                    return accessToken;
                }
            }
            return TokenRetrieval.FromAuthorizationHeader().Invoke(request);

        };                  
    });
    
```

如果你适用IISExpress运行项目，注意此时SignalR的url参数可能过长而报告404.15 - Query String Too Long，IIS默认限制是2048，需要在C:\Windows\System32\inetsrv\config\applicationHost.config中配置maxQueryString规则，如下：

```
<configuration>
   <system.webServer>
      <security>
         <requestFiltering>
             <requestLimits maxQueryString="4096" />
         </requestFiltering>
      </security>
   </system.webServer>
</configuration>

```
