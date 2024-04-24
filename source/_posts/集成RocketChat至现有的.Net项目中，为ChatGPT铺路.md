---
thumbnail:
cover:
title: '集成RocketChat至现有的.Net项目中，为ChatGPT铺路'
excerpt:
description:
date: 2023-03-01 16:53:00
tags:
categories: 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-03-01 16:53:00/集成RocketChat至现有的.Net项目中，为ChatGPT铺路.html
---
<!-- toc -->
## 前言
今天我们来聊一聊一个Paas的方案，如何集成到一个既有的项目中。
以其中一个需求为例子：在产品项目中，加入IM（即时通信）功能，开始徒手撸代码，会发现工作量很大，去github找开源项目，结果也可能事与愿违：功能不够强大，或者用不同的语言编写的，编译出来程序集无法集成到项目中。
可能当下最好的方案是利用独立的聊天功能组件，作为项目的中间件（Paas方案）。

1. 组件是独立部署，独立运行的，功能的稳定性，搭建速度快，
2. 作为基础设施服务，可以用在其他项目中，并且项目中的对接作为抽象层，可随时替换现有组件。

这个聊天组件就是RocketChat。
RocketChat 是一款免费，开源的聊天软件平台。
其主要功能是：群组聊天、相互通信、私密聊群、桌面通知、文件上传、语音/视频、截图等，实现了用户之间的实时消息转换。
https://github.com/RocketChat/Rocket.Chat

它本身是使用Meteor全栈框架以JavaScript开发的Web聊天服务器。本身带有一个精美的web端，甚至有开源的App端。
集成到一个既有的项目中我们是需要做减法的，然而在实际对接中，我们仍然需要解决一些问题：
首先是Rocket.Chat自己有一套独立的用户系统，其中登录鉴权逻辑，这一部分是我们不需要的。
第二是Rocket.Chat聊天功能依赖这个用户系统，需要简化流程同步用户信息，只保留用户，不需要权限，角色。


准备工作：[搭建Rocket.Chat服务](https://www.cnblogs.com/jevonsflash/p/15895118.html)

Rocket.Chat有两套Api，一个是基于https的REST Api，和一个基于wss的Realtime API， https://developer.rocket.chat/reference/api/realtime-api
这两个Api都需要鉴权。


解决这个有两套方案，一个是通过完全的后端接管，两个Api都经过后端项目进行转发，另一个是后端只接管REST Api， Realtime API和Rocket.Chat服务直接通信


## 项目搭建
### 后端
新建一个.Net 6 Abp项目后，添加AbpBoilerplate.RocketChat库，AbpBoilerplate.RocketChat的具体介绍请参考https://blog.csdn.net/jevonsflash/article/details/128342430
```
dotnet add package AbpBoilerplate.RocketChat
```

在Domain层中创建IM项目，创建Authorization目录存放与IM鉴权相关的代码，ImWebSocket目录用于存放处理Realtime API相关的代码.

在搭建Rocket.Chat环节，还记得有一个设置管理员的步骤吗？在AdminUserName和AdminPassword配置中，指定这个管理员的密码，

管理员用于在用户未登录时，提供操作的权限主体，

```
  "Im": {
    "Provider": "RocketChat",
    "Address": "http://localhost:3000/",
    "WebSocketAddress": "ws://localhost:3000/",
    "AdminUserName": "super",
    "AdminPassword": "123qwe",
    "DefaultPassword": "123qwe"
  }
```

### 前端
用vue2来搭建一个简单的前端界面，需要用到以下库
* element-UI库
* axios
* vuex
* signalr
新建一个vue项目，在package.json中的 "dependencies"添加如下：
```
"axios": "^0.26.1",
"element-ui": "^2.15.6",
"@microsoft/signalr": "^5.0.6"
"vuex": "^3.6.2"
```



## 代理账号
代理账号是一个管理员账号
在程序的启动时，要登录这个管理员账号，并保存Token，程序停止时退出登录这个账号。
我们需要一个cache存储管理员账号的登录信息（用户ID和Token）
在Threads目录下创建ImAdminAgentAuthBackgroundWorker，
并在ImModule中注册这个后台任务

```
private async Task LoginAdminAgent()
{
    var userName = rocketChatConfiguration.AdminUserName;
    var password = rocketChatConfiguration.AdminPassword;
    var loginResult = await imManager.Authenticate(userName, password);
    if (loginResult.Success && loginResult.Content != null)
    {
        var cache = imAdminAgentCache.GetCache("ImAdminAgent");
        await cache.SetAsync("UserId", loginResult.Content.Data.UserId);
        await cache.SetAsync("AuthToken", loginResult.Content.Data.AuthToken);
        await cache.SetAsync("UserName", userName);
    }
    else
    {
        throw new UserFriendlyException("无法登录IM服务Admin代理账号");
    }
}

public override async void Stop()
{
    base.Stop();
    var cache = imAdminAgentCache.GetCache("ImAdminAgent");
    var token = (string)cache.Get("AuthToken", (i) => { return string.Empty; });
    var userId = (string)cache.Get("UserId", (i) => { return string.Empty; });

    if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(userId))
    {
        return;
    }

    using (_iocManager.IocContainer.BeginScope()) //extension method
    {
        _iocManager.Resolve<SessionContextDto>().Token = token;
        _iocManager.Resolve<SessionContextDto>().UserId = userId;
        _iocManager.Resolve<SessionContextDto>().IsAuthorized = true;


        try
        {
            await imManager.Logout();
        }
        catch (Exception ex)
        {

            throw;
        }
    }

}

```
SessionContextDto是一个会话上下文对象，在.net项目中，登录校验成功后写入，在请求Rocket.Chat的时候读取，并写入到请求头中。


在ImModule的PostInitialize方法中注册ImAdminAgentAuthBackgroundWorker

```
public override void PostInitialize()
{
    var workerManager = IocManager.Resolve<IBackgroundWorkerManager>();
    workerManager.Add(IocManager.Resolve<ImAdminAgentAuthBackgroundWorker>());
}
```

用户登录时，需要传用户名密码，用户名是跟.net项目中相同的，密码可以独立设置，也可以设定约定一个默认密码，那么新建用户和登录的时候，可以不用传密码，直接使用默认密码即可，用户成功登录后，将用户ID和Token回传给前端。

定义传输对象类AuthenticateResultDto
```
public class AuthenticateResultDto
{
    public string AccessToken { get; set; }
    public string UserId { get; set; }
}
```
在应用层中创建类ImAppService，创建应用层服务Authenticate，用于用户登录。
```
 private async Task<AuthenticateResultDto> Authenticate(MatoAppSample.Authorization.Users.User user, string password = null)
{
    var loginResult = await _imManager.Authenticate(user.UserName, password);

    if (loginResult.Success)
    {
        var userId = loginResult.Content.Data.UserId;
        var token = loginResult.Content.Data.AuthToken;
        this.imAuthTokenCache.Set(user.UserName, new ImAuthTokenCacheItem(userId, token), new TimeSpan(1, 0, 0));
    }
    else
    {
        this.imAuthTokenCache.Remove(user.UserName);
        throw new UserFriendlyException($"登录失败, {loginResult.Error}");

    }
    return new AuthenticateResultDto
    {
        AccessToken = loginResult.Content.Data.AuthToken,
        UserId = loginResult.Content.Data.UserId
    };
}
```

## 鉴权方式介绍

由于Rocket.Chat的Realtime API基于REST API基础上进行鉴权，在调用完成`/api/v1/login`接口后，需要在已经建立的Websocket连接中发送
```
{
    "msg": "method",
    "method": "login",
    "id": "42",
    "params":[
        { "resume": "auth-token" }
    ]
}
```
详见[官方文档](https://developer.rocket.chat/reference/api/realtime-api/method-calls/login#using-an-authentication-token)

在集成RocketChat时，对于Realtime API方案有二：
1. 前端鉴权，前端通过Abp登录后，调用`/api/v1/login`接口，返回token之后存入前端Token缓存中，之后前端将与Rocketchat直接建立websocket联系，订阅的聊天消息和房间消息将被直接推送至前端。

    优点是消息订阅推送直接，效率较高，但前端需要同时顾及Abp的鉴权和RocketChat Realtime API鉴权，前端的代码逻辑复杂，代理账号逻辑复杂，后期扩展性差。小型项目适合此方式

2. 后端鉴权，前端通过Abp登录后，调用`/api/v1/login`接口，返回token之后存入后端Token缓存中，由后端发起websocket连接，订阅的聊天消息和房间消息将被转发成signalR消息发送给前端，由后端缓存过期机制统一管理各连接的生命周期。

    优点是统一了前端的消息推送机制，架构更趋于合理，对于多用户端的大型项目，能够减少前端不必要的代码逻辑。但是后端的代码会复杂一些。适合中大型项目。

Realtime API 的前端鉴权

![在这里插入图片描述](ce8045aad08442cca4745eb9e7be1b93.png)
Realtime API 的后端鉴权

![在这里插入图片描述](1d0412c94ab042cdbcbf573dde8df4b7.png)


## 登录校验模块

### 前端鉴权方式

由于是从小程序，或者web端共用的所以要分别从Header和Cookie中获取登录信息，IHttpContextAccessor类型的参数用于从http请求上下文对象中访问Header或Cookie，

整个流程如下：

![在这里插入图片描述](e7b2ce2dd61f4999869c553998701040.png)


创建AuthorizedFrontendWrapper.cs，新建AuthorizationVerification方法，此方法是登录校验逻辑

```
private static void AuthorizationVerification(IHttpContextAccessor _httpContextAccessor, bool useAdminIfNotAuthorized, out StringValues? token, out StringValues? userId)
{
    var isCommonUserLoginPassed = true;
    token = _httpContextAccessor.HttpContext?.Request.Headers["X-Auth-Token"];
    userId = _httpContextAccessor.HttpContext?.Request.Headers["X-User-Id"];
    if (!ValidateToken(token, userId))
    {

        token = _httpContextAccessor.HttpContext?.Request.Cookies["chat_token"];
        userId = _httpContextAccessor.HttpContext?.Request.Cookies["chat_uid"];
        if (!ValidateToken(token, userId))
        {
            isCommonUserLoginPassed = false;
        }
    }

    var cache = Manager.GetCache("ImAdminAgent");
    if (!isCommonUserLoginPassed)
    {
        if (useAdminIfNotAuthorized)
        {
            //若不存在则取admin作为主体
            token = (string)cache.Get("AuthToken", (i) => { return string.Empty; });
            userId = (string)cache.Get("UserId", (i) => { return string.Empty; });
            if (!ValidateToken(token, userId))
            {
                throw new UserFriendlyException("操作未取得IM服务授权, 当前用户未登录，且初始代理用户未登录");
            }
        }
        else
        {
            throw new UserFriendlyException("操作未取得IM服务授权, 当前用户未登录");
        }
    }
    else
    {
        if ((string)cache.Get("UserId", (i) => { return string.Empty; }) == userId.Value)
        {
            token = (string)cache.Get("AuthToken", (i) => { return string.Empty; });
            if (!ValidateToken(token, userId))
            {
                throw new UserFriendlyException("操作未取得IM服务授权, 初始代理用户未登录");
            }
        }
    }
}

```
## 后端鉴权方式

整个流程如下：

![在这里插入图片描述](a1adc72f11db471a98ad7d4daa82a708.png)


创建AuthorizedBackendWrapper.cs，新建AuthorizationVerification方法，登录校验代码如下

```
public void AuthorizationVerification(out string token, out string userId)
{
    User user = null;
    try
    {
        user = userManager.FindByIdAsync(abpSession.GetUserId().ToString()).Result;
    }
    catch (Exception)
    {
    }

    var userName = user != null ? user.UserName : rocketChatConfiguration.AdminUserName;
    var password = user != null ? ImUserDefaultPassword : rocketChatConfiguration.AdminPassword;
    var userIdAndToken = imAuthTokenCache.Get(userName, (i) => { return default; });
    if (userIdAndToken == default)
    {
        var loginResult = imManager.Authenticate(userName, password).Result;
        if (loginResult.Success && loginResult.Content != null)
        {
            userId = loginResult.Content.Data.UserId;
            token = loginResult.Content.Data.AuthToken;
            var imAuthTokenCacheItem = new ImAuthTokenCacheItem(userId, token);
            imAuthTokenCache.Set(userName, imAuthTokenCacheItem, new TimeSpan(1, 0, 0));
            var userIdentifier = abpSession.ToUserIdentifier();
            if (userIdentifier != null)
            {
                Task.Run(async () =>
                {
                    await Login(imAuthTokenCacheItem, userIdentifier, userName);
                });
            }
        }
        else
        {
            var adminUserName = rocketChatConfiguration.AdminUserName;
            var adminPassword = rocketChatConfiguration.AdminPassword;
            var adminLoginResult = imManager.Authenticate(adminUserName, adminPassword).Result;
            if (adminLoginResult.Success && adminLoginResult.Content != null)
            {
                userId = adminLoginResult.Content.Data.UserId;
                token = adminLoginResult.Content.Data.AuthToken;
                if (!ValidateToken(token, userId))
                {
                    throw new UserFriendlyException("操作未取得IM服务授权, 无法登录账号" + userName);
                }
            }
            else
            {
                throw new UserFriendlyException("账号登录失败:" + adminLoginResult.Error);

            }

        }

    }
    else
    {
        userId = userIdAndToken.UserId;
        token = userIdAndToken.Token;
    }
    if (!ValidateToken(token, userId))
    {
        throw new UserFriendlyException("操作未取得IM服务授权, 登录失败");
    }
}

```

## 登录委托

在AuthorizedFrontendWrapper（或AuthorizedBackendWrapper）中

写一个登录委托AuthorizedChatAction，用于包装一个需要登录之后才能使用的操作
```
public static async Task AuthorizedChatAction(Func<Task> func, IocManager _iocManager)
{
    if (_iocManager.IsRegistered<SessionContextDto>())
    {
        string token, userId;
        AuthorizationVerification(out token, out userId);

        using (_iocManager.IocContainer.Begin()) //extension method
        {
            _iocManager.Resolve<SessionContextDto>().Token = token;
            _iocManager.Resolve<SessionContextDto>().UserId = userId;
            _iocManager.Resolve<SessionContextDto>().IsAuthorized = true;
            try
            {
                await func();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
    else
    {
        throw new UserFriendlyException("没有注册即时通信会话上下文对象");
    }
}
```




## 使用登录委托

我们在创建IM相关方法的时候，需要用AuthorizedFrontendWrapper（或AuthorizedBackendWrapper），来包装登录校验的逻辑。

```
public async Task<bool> DeleteUser(long userId)
{
    var user = await _userManager.GetUserByIdAsync(userId);
    var result = await AuthorizedBackendWrapper.AuthorizedChatAction(() =>
    {
        return _imManager.DeleteUser(user.UserName);
    }, _iocManager);

    if (!result.Success || !result.Content)
    {
        throw new UserFriendlyException($"删除失败, {result.Error}");
    }
    return result.Content;
}
```

## 处理聊天消息

### 前端鉴权方式



新建`messageHandler_frontend_auth.ts`处理程序

客户端支持WebSocket的浏览器中，在创建socket后，可以通过onopen、onmessage、onclose和onerror四个事件对socket进行响应。

我已经封装好了一个WebSocket 通信模块`\web\src\utils\socket.ts`，Socket对象是一个WebSocket抽象，后期将扩展到uniapp小程序项目上使用的WebSocket。通过这个对象可以方便的进行操作。

创建一个Socket对象`wsConnection`，用于接收和发送基于wss的Realtime API消息


```
const wsRequestUrl: string = "ws://localhost:3000/websocket";

const socketOpt: ISocketOption = {
  server: wsRequestUrl,
  reconnect: true,
  reconnectDelay: 2000,
};

const wsConnection: Socket = new Socket(socketOpt);
```
WebSocket的所有操作都是采用事件的方式触发的，这样不会阻塞UI，是的UI有更快的响应时间，有更好的用户体验。


连接建立后，客户端和服务器就可以通过TCP连接直接交换数据。我们订阅onmessage事件触发newMsgHandler处理信息
```
wsConnection.$on("message", newMsgHandler);
```

当链接打开后，立即发送`{"msg":"connect","version":"1","support":["1","pre2","pre1"]}`报文
```
wsConnection.$on("open", (newMsg) => {
    console.info("WebSocket Connected");
    wsConnection.send({
      msg: "connect",
      version: "1",
      support: ["1"],
    });
  });
```
建立链接后，会从Rocket.Chat收到connected消息，此时需要发送登录请求的消息到Rocket.Chat
接收到报文
```
"{"msg":"connected","session":"cMvzWpCNSCR24bwCf"}"
```

发送报文

```
{"msg":"method","method":"login","params":[{"resume":"wY67O8rJFyf2FrqD5vxpQjIUs5tdThmyfW_VaA7MrsG"}],"id":"1"}
```


接下来，在newMsgHandler方法中，根据msg类型，处理一系列的消息

```
const newMsgHandler: Function = (newMsgRaw) => {
  if (!getIsNull(newMsgRaw)) {
    if (newMsgRaw.msg == "ping") {
      wsConnection.send({
        msg: "pong",
      });
    } else if (newMsgRaw.msg == "connected") {
      let newMsg: ConnectedWsDto = newMsgRaw
      let session = newMsg.session;
      if (
        wsConnection.isConnected
      ) {
        wsConnection.send({
          msg: "method",
          method: "login",
          params: [
            {
              resume: UserModule.chatToken,
            },
          ],
          id: "1",
        });
      }
    } else if (newMsgRaw.msg == "added") {
      subEvent("stream-notify-user", "message");
      subEvent("stream-notify-user", "subscriptions-changed");
      subEvent("stream-notify-user", "rooms-changed");
    } else if (newMsgRaw.msg == "changed") {
      let newMsg: SubChangedWsDto = newMsgRaw
      if (newMsg.collection == "stream-notify-user") {
        let fields = newMsg.fields;
        if (fields.eventName.indexOf("/") != -1) {
          let id = fields.eventName.split('/')[0];
          let eventName = fields.eventName.split('/')[1];
          if (eventName == "subscriptions-changed") {
            let args = fields.args;
            let msg: ISubscription = null;
            let method: string;
            args.forEach((arg) => {
              if (typeof arg == "string") {
                if (arg == "remove" || arg == "insert") {
                  method = arg;
                }
              }
              else if (typeof arg == "object") {
                msg = arg
              }
            });
            $EventBus.$emit("getRoomSubscriptionChangedNotification", { msg, method });
          }
          else if (eventName == "rooms-changed") {
            let args = fields.args;
            let msg: RoomMessageNotificationDto = null;
            args.forEach((arg) => {
              if (typeof arg == "object") {
                msg = arg
              }
            });
            $EventBus.$emit("getRoomMessageNotification", msg.lastMessage);

          }
        }
        else {
          let id = fields.eventName
        }


      }
      else if (newMsg.collection == "stream-room-messages") {
        let fields = newMsg.fields;

        let id = fields.eventName
        let msg: MessageItemDto = fields.args;

        $EventBus.$emit("getRoomMessageNotification", msg);
      }
    }
  }
}
```

store/chat.ts文件中，定义了ChatState用于存储聊天信息，当有消息收到，或者房间信息变更时，更新这些存储对象
```
export interface IChatState {
  currentChannel: ChannelDto;
  channelList: Array<ChannelDto>;
  currentMessage: MessageDto;
}
```

### 后端校验方式
Login时将生成webSocket对象，并发送connect消息
```
public async Task Login(ImAuthTokenCacheItem imAuthTokenCacheItem, UserIdentifier userIdentifier, string userName)
{
    using (var webSocket = new ClientWebSocket())
    {
        webSocket.Options.RemoteCertificateValidationCallback = delegate { return true; };
        var url = Flurl.Url.Combine(rocketChatConfiguration.WebSocketHost, "websocket");
        await webSocket.ConnectAsync(new Uri(url), CancellationToken.None);
        if (webSocket.State == WebSocketState.Open)
        {

            var model = new ImWebSocketConnectRequest()
            {
                Msg = "connect",
                Version = "1",
                Support = new string[] { "1" }
            };
            var jsonStr = JsonConvert.SerializeObject(model);
            var sendStr = Encoding.UTF8.GetBytes(jsonStr);
            await webSocket.SendAsync(sendStr, WebSocketMessageType.Text, true, CancellationToken.None);
            await Echo(webSocket, imAuthTokenCacheItem, userIdentifier, userName);
        }
    }
}

```

每次接收指令时，将判断缓存中的Token值是否合法，若不存在，或过期（session变化），将主动断开websocket连接
在接收Realtime API消息后，解析方式同前端鉴权逻辑
在拿到数据后，做signalR转发。

```
private async Task Echo(WebSocket webSocket, ImAuthTokenCacheItem imAuthTokenCacheItem, UserIdentifier userIdentifier, string userName)
{
    JsonSerializerSettings serializerSettings = new JsonSerializerSettings()
    {
        NullValueHandling = NullValueHandling.Ignore
    };
    var buffer = new byte[1024 * 4];
    var receiveResult = await webSocket.ReceiveAsync(
        new ArraySegment<byte>(buffer), CancellationToken.None);
    string session=string.Empty;
    ImAuthTokenCacheItem im;
    while (!receiveResult.CloseStatus.HasValue)
    {
        im = imAuthTokenCache.GetOrDefault(userName);
        if (im == null)
        {
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure,
                "缓存超时自动退出",
                CancellationToken.None);
            Console.WriteLine(userName + "超时主动断开IM连接");

            break;


        }
        else
        {
            if (!string.IsNullOrEmpty(session) && im.Session!=session)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure,
                    "缓存更新自动退出",
                    CancellationToken.None);
                Console.WriteLine(userName + "缓存更新主动断开IM连接");

                break;
            }
        }
        var text = Encoding.UTF8.GetString(buffer.AsSpan(0, receiveResult.Count));
        if (!string.IsNullOrEmpty(text))
        {
            dynamic response = JsonConvert.DeserializeObject<dynamic>(text);
            if (response.msg == "ping")
            {

                var model = new ImWebSocketCommandRequest()
                {
                    Msg = "pong",
                };

                var jsonStr = JsonConvert.SerializeObject(model, serializerSettings);
                var sendStr = Encoding.UTF8.GetBytes(jsonStr);
                await webSocket.SendAsync(sendStr, WebSocketMessageType.Text, true, CancellationToken.None);

            }
            if (response.msg == "connected")
            {
                session = response.session;

                var model = new ImWebSocketCommandRequest()
                {
                    Msg = "method",
                    Method = "login",
                    Params = new object[]{
                        new {
                            resume = imAuthTokenCacheItem.Token,
                        }
                    },
                    Id = "1"
                };
                imAuthTokenCacheItem.Session = session;
                imAuthTokenCache.Set(userName, imAuthTokenCacheItem, new TimeSpan(1, 0, 0));

                var jsonStr = JsonConvert.SerializeObject(model, serializerSettings);
                var sendStr = Encoding.UTF8.GetBytes(jsonStr);
                await webSocket.SendAsync(sendStr, WebSocketMessageType.Text, true, CancellationToken.None);

            }
            else if (response.msg == "added")
            {
                await SubEvent(webSocket, imAuthTokenCacheItem, "stream-notify-user", "message");
                await SubEvent(webSocket, imAuthTokenCacheItem, "stream-notify-user", "subscriptions-changed");
                await SubEvent(webSocket, imAuthTokenCacheItem, "stream-notify-user", "rooms-changed");
            }
            else if (response.msg == "changed")
            {
                var newMsg = response;
                if (newMsg.collection == "stream-notify-user")
                {
                    var fields = newMsg.fields;
                    var fullEventName = fields.eventName.ToString();
                    if (fullEventName.IndexOf("/") != -1)
                    {
                        var id = fullEventName.Split('/')[0];
                        var eventName = fullEventName.Split('/')[1];
                        if (eventName == "subscriptions-changed")
                        {
                            var args = fields.args;
                            dynamic msg = null;
                            var method = string.Empty;

                            foreach (var arg in args as IEnumerable<dynamic>)
                            {

                                if (arg.ToString() == "remove" || arg.ToString() == "insert")
                                {
                                    method = arg.ToString();
                                }

                                else
                                {
                                    msg = arg;
                                }
                            }

                            await signalREventPublisher.PublishAsync(userIdentifier, "getRoomSubscriptionChangedNotification", new { msg, method });
                        }
                        else if (eventName == "rooms-changed")
                        {
                            var args = fields.args;
                            dynamic msg = null;
                            var method = string.Empty;
                            foreach (var arg in args as IEnumerable<dynamic>)
                            {

                                if (arg.ToString() == "updated")
                                {
                                    method = arg.ToString();
                                }

                                else
                                {
                                    msg = arg;
                                }
                            };

                            var jobject = msg.lastMessage as JObject;

                            await signalREventPublisher.PublishAsync(userIdentifier, "getRoomMessageNotification", jobject);

                        }
                    }
                    else
                    {
                        var id = fields.eventName;
                    }
                }

            }
            else if (response.collection == "stream-room-messages")
            {
                var fields = response.fields;
                var id = fields.eventName;
                var msg = fields.args;
                var jobject = msg as JObject;
                await signalREventPublisher.PublishAsync(userIdentifier, "getRoomMessageNotification", jobject);
            }
        }
        try
        {
            receiveResult = await webSocket.ReceiveAsync(
new ArraySegment<byte>(buffer), CancellationToken.None);
        }
        catch (Exception ex)
        {
            Console.WriteLine(userName + "异常断开IM连接");

            break;
        }

    }

    try
    {
        await webSocket.CloseAsync(
receiveResult.CloseStatus.Value,
receiveResult.CloseStatusDescription,
CancellationToken.None);
    }
    catch (Exception ex)
    {
    }

    imAuthTokenCache.Remove(userName);

}

private async Task SubEvent(WebSocket webSocket, ImAuthTokenCacheItem imAuthTokenCacheItem, string name, string type)
{
    var eventstr = $"{imAuthTokenCacheItem.UserId}/${type}";
    var id = RandomHelper.GetRandom(100000).ToString().PadRight(5, '0');

    var model = new ImWebSocketCommandRequest()
    {
        Msg = "sub",
        Params = new object[]{eventstr,
            new {
                useCollection= false,
                args = new string[]{ }
            }
        },
        Id = id,
        Name = name,
    };
    var jsonStr = JsonConvert.SerializeObject(model);
    var sendStr = Encoding.UTF8.GetBytes(jsonStr);
    await webSocket.SendAsync(sendStr, WebSocketMessageType.Text, true, CancellationToken.None);
}

```
SignalREventPublisher.cs 中的PublishAsync，将消息转发给对应的用户。
```
public async Task PublishAsync(IUserIdentifier userIdentifier, string method, object message)
{

    try
    {
        var onlineClients = _onlineClientManager.GetAllByUserId(userIdentifier);
        foreach (var onlineClient in onlineClients)
        {
            var signalRClient = _hubContext.Clients.Client(onlineClient.ConnectionId);
            if (signalRClient == null)
            {
                Logger.Debug("Can not get user " + userIdentifier.ToUserIdentifier() + " with connectionId " + onlineClient.ConnectionId + " from SignalR hub!");
                continue;
            }

            await signalRClient.SendAsync(method, message);
        }
    }
    catch (Exception ex)
    {
        Logger.Warn("Could not send notification to user: " + userIdentifier.ToUserIdentifier());
        Logger.Warn(ex.ToString(), ex);
    }

}

```

前端代码则要简单得多
新建`messageHandler_backend_auth.ts`处理程序
```
import * as signalR from "@microsoft/signalr";
```

创建一个HubConnection对象`hubConnection`，用于接收SignalR消息

```
const baseURL = "http://localhost:44311/"; // url = base url + request url
const requestUrl = "signalr";
let header = {};
if (UserModule.token) {
  header = {
    "X-XSRF-TOKEN": UserModule.token,
    Authorization: "Bearer " + UserModule.token,
  };
}

//signalR config
const hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl(baseURL + requestUrl, {
    headers: header,
    accessTokenFactory: () => getAccessToken(),
    transport: signalR.HttpTransportType.WebSockets,
    logMessageContent: true,
    logger: signalR.LogLevel.Trace,
  })
  .withAutomaticReconnect()
  .withHubProtocol(new signalR.JsonHubProtocol())
  .build();
```

我们只需要响应后端程序中定义好的signalR消息的methodName就可以了
```
hubConnection.on("getRoomMessageNotification", (n: MessageItemDto) => {
  console.info(n.msg)
  if (ChatModule.currentChannel._id != n.rid) {
    ChatModule.increaseChannelUnread(n.rid);
  } else {
    if (n.t == null) {
      n.from =
        n.u.username == UserModule.userName
          ? constant.MSG_FROM_SELF
          : constant.MSG_FROM_OPPOSITE;
    } else {
      n.from = constant.MSG_FROM_SYSTEM;
    }
    ChatModule.appendMessage(n);
  }
});

hubConnection.on("getRoomSubscriptionChangedNotification", (n) => {
  console.info(n.method, n.msg)

  if (n.method == "insert") {
    console.info(n.msg + "has been inserted!");

    ChatModule.insertChannel(n.msg);

  }
  else if (n.method == "update") {

  }
});
```

至此，完成了所有的集成工作。

此文目的是介绍一种思路，使用缓存生命周期管理的相关机制，规避第三方用户系统对现有项目的用户系统的影响。举一反三，可以用到其他Paas的方案集成中。最近ChatGPT很火，可惜没时间研究怎么接入，有闲工夫的同学们可以尝试着写一个ChatGPT聊天机器人，欢迎大家评论留言！

最终效果如图
![在这里插入图片描述](1d9f6a70ba6f4ae5855fbed95b3f59c4.gif#pic_center)
## 项目地址
[Github:matoapp-samples](https://github.com/jevonsflash/matoapp-samples)