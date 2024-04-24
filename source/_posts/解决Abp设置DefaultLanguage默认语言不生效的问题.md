---
thumbnail:
cover:
title: '解决Abp设置DefaultLanguage默认语言不生效的问题'
excerpt:
description:
date: 2023-04-04 20:57:00
tags:
  - asp.net core
  - Abp
  - C#

categories:
  - .NET
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-04-04 20:57:00/解决Abp设置DefaultLanguage默认语言不生效的问题.html
---
<!-- toc -->
## 现象

默认地，Abp的语言提供程序将返回的CultureInfo为En，在一些默认实现的接口（比如`/api/TokenAuth/Authenticate`）返回的错误信息是英文
![在这里插入图片描述](95de1bba563e47e7a7db20290af169b3.png)
目标是改成简体中文显示，但是即便我们在AbpSettings表中加入了DefaultLanguage为`"zh-Hans" `     
```
 AddSettingIfNotExists(LocalizationSettingNames.DefaultLanguage, "zh-Hans", tenantId);
```
仍然不能正确返回我们想要的简体中文

## 原因分析


Asp.Net Core 为我们提供了一些默认的语言提供程序，在调用中间件UseRequestLocalization初始化后。Microsoft.AspNetCore.Builder.RequestLocalizationOptions.RequestCultureProviders中包含如下类型语言提供程序：

1. QueryStringRequestCultureProvider
2. CookieRequestCultureProvider
3. AcceptLanguageHeaderRequestCultureProvider

当请求到来时，会按照顺序依次调用这些语言提供程序，直到有语言提供程序的规则命中并返回了CultureInfo，这个CultureInfo就会被用于当前请求的语言设置。


详情请参考[本地化中间件](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/localization?view=aspnetcore-3.1#localization-middleware)

Abp提供了三个默认语言提供程序，分别是：
1. AbpUserRequestCultureProvider：从特定User的AbpSettings中返回CultureInfo；
2. AbpLocalizationHeaderRequestCultureProvider：从请求头中获取语言设置，然后返回CultureInfo；
3. AbpDefaultRequestCultureProvider：从AbpSettings中获取默认语言设置。

当调用app.UseAbpRequestLocalization()时，Abp会将这三个语言提供程序注册到RequestLocalizationOptions.RequestCultureProviders中。他们的顺序如下：

```
var userProvider = new AbpUserRequestCultureProvider();

//0: QueryStringRequestCultureProvider
options.RequestCultureProviders.Insert(1, userProvider);
options.RequestCultureProviders.Insert(2, new AbpLocalizationHeaderRequestCultureProvider());
//3: CookieRequestCultureProvider
//4: AcceptLanguageHeaderRequestCultureProvider
options.RequestCultureProviders.Insert(5, new AbpDefaultRequestCultureProvider());
```


在插入Abp.Localization.DefaultLanguageName配置为`"zh-Hans"`时，这个规则应由AbpDefaultRequestCultureProvider对应生效

此时断点调试后发现AbpDefaultRequestCultureProvider不会被调用。因为在此前已经命中了Asp.Net Core 默认的CookieRequestCultureProvider或
AcceptLanguageHeaderRequestCultureProvider语言提供程序。

因此我们需要把AbpSettings中获取默认语言设置的优先级提高，即将AbpDefaultRequestCultureProvider排在默认的提供程序之前。

## 解决问题

`app.UseAbpRequestLocalization()`改写为：
```
app.UseAbpRequestLocalization((options) =>
{

    var cookieRequestCultureProvider = options.RequestCultureProviders[3];
    options.RequestCultureProviders.RemoveAt(3);
    options.RequestCultureProviders.Insert(5, cookieRequestCultureProvider);

    var acceptLanguageHeaderRequestCultureProvider = options.RequestCultureProviders[3];
    options.RequestCultureProviders.RemoveAt(3);
    options.RequestCultureProviders.Insert(5, acceptLanguageHeaderRequestCultureProvider);
});
```
确保数据库配置了正确的语言信息
![在这里插入图片描述](55ad687f1b1a4bd3875e6f5bb9f92166.png)

此时再运行程序，调用`/api/TokenAuth/Authenticate`接口时报错信息已经变为简体中文

![在这里插入图片描述](2ab9d07a1d0c40b4aaead4aa6bdf62e0.png)
