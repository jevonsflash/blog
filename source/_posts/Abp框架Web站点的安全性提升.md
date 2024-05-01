---
thumbnail: images/66580681f877496180ace8f55beb5f13.png
title: Abp框架Web站点的安全性提升
excerpt: >-
  本文将从GB/T 28448-2019《信息安全技术
  网络安全等级保护测评要求》规定的安全计算环境中解读、摘要若干安全要求，结合Abp框架，对站点进行安全升级。
tags:
  - Abp
  - 网络安全
  - 鉴权
categories:
  - [.NET]
  - DevOps
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-04-18 13:48:00/Abp框架Web站点的安全性提升.html'
abbrlink: '5e3878'
date: 2023-04-18 13:48:00
cover:
description:
---

本文将从GB/T 22239《信息安全技术 网络安全等级保护基本要求》规定的安全计算环境中解读、摘要若干安全要求，结合Abp框架，对站点进行安全升级。

## 【身份鉴别】应对登录的用户进行身份标识和鉴别，身份标识具有唯一性，身份鉴别信息具有复杂度要求并定期更换。

### 解决方案

1. 设置密码最小长度

2. 密码由数字、字母和特殊字符组合而成

3. 设置密码每隔90天需要更换一次


### 实施
在AbpSettings表中配置开启PasswordComplexity密码复杂度校验，设置密码最小长度为7位

![在这里插入图片描述](644861-20230418134322632-1221933010.png)



配置密码强制过期策略，参考[用Abp实现找回密码和密码强制过期策略](https://www.cnblogs.com/jevonsflash/p/17317904.html)


## 【身份鉴别】应具有登录失败处理功能，应配置并启用结束会话、限制非法登录次数和当登录连接超时自动退出等相关措施。


### 解决方案

1. 登录后无操作15分钟，系统自动退出登录状态。

2. 连续登录失败5次后，锁定账户15分钟


### 实施
在WebCoreModule中，将Jwt Bearer Token的过期时间从默认的1天改为15分钟


![在这里插入图片描述](644861-20230418134322576-1695926589.png)



配置用户登录失败锁定
默认将新增用户的IsLockoutEnabled打开

```
public User()
{
    this.IsLockoutEnabled = true;
}
```

在AbpSettings表中配置开启用户登录失败锁定，并配置失败尝试次数和锁定时长

![在这里插入图片描述](644861-20230418134322627-886620155.png)



## 【身份鉴别】应采用口令、密码技术、生物技术等两种或两种以上组合的鉴别技术对用户进行身份鉴别，且其中一种鉴别技术至少应使用密码技术来实现。

### 解决方案

采用两种以上组合的鉴别技术对用户进行身份鉴别，采用用户名+手机短信验证码方式登录

### 实施
对Abp框架改造，加入两步验证功能，参考[用Abp实现两步验证（Two-Factor Authentication，2FA）登录（一）：认证模块](https://www.cnblogs.com/jevonsflash/p/17297520.html)

## 【访问控制】应对登录的用户分配账户和权限；并授予管理用户所需的最小权限，实现管理用户的权限分离。

### 解决方案
1. 删除或者禁用默认账户，

2. 禁用超级管理员，

3. 设置独立的审计管理员、安全管理员等。

### 实施

更改AbpPermissions，AbpRoles，AbpUserRoles表，合理安排用户角色的权限配置。



## 【入侵防范】应通过设定终端接入方式或网络地址范围对通过网络进行管理的管理终端进行限制。

### 解决方案

限制管理员的登录地址范围，仅允许特定IP进行登录管理。

### 实施

使用IP白名单限制管理员账户登录。


AppSettingNames.cs：

```
public static class AppSettingNames
{
    ...
    public const string AdminIpAddressWhitelist = "CAH.AdminIpAddressWhitelist";
}

```


AppSettingProvider.cs：
```
public class AppSettingProvider : SettingProvider
{
    public override IEnumerable<SettingDefinition> GetSettingDefinitions(SettingDefinitionProviderContext context)
    {
        return new[]
        {
            ...
            new SettingDefinition(AppSettingNames.AdminIpAddressWhitelist, "127.0.0.1,::1,localhost,0.0.0.0", scopes: SettingScopes.Application | SettingScopes.Tenant | SettingScopes.User, isVisibleToClients: true),
        };
    }
}
```

在身份验证终节点方法Authenticate中，添加对管理员账户IP白名单的校验：

```

var ipAddress = this._logInManager.ClientInfoProvider.ClientIpAddress;
var adminIpAddressWhitelist = await SettingManager.GetSettingValueForTenantAsync(AppSettingNames.AdminIpAddressWhitelist, loginResult.Tenant.Id);
var IpCheckRequired = false;
var roles = await userManager.GetRolesAsync(loginResult.User);
if (roles.Contains(StaticRoleNames.Tenants.Admin) || roles.Contains(StaticRoleNames.Tenants.Super))
{
    IpCheckRequired = true;
}
if (!string.IsNullOrEmpty(adminIpAddressWhitelist))
{
    if (!adminIpAddressWhitelist.Split(',').Contains(ipAddress) && IpCheckRequired)
    {
        throw new UserFriendlyException("IP不在允许的列表中");
    }
}


```

## 【入侵防范】应提供数据有效性检验功能，保证通过人机接口输入或通过通信接口输入的内容符合系统设定要求。

### 解决方案

1. 对上传接口进行文件格式限制转义处理。
2. 对系统配置防范XSS跨站脚本攻击


### 实施

文件系统中配置仅允许业务相关的文件类型上传

```
 "FileStorage": {
    ...
    "AllowOnlyConfiguredFileExtensions": true,
    "FileExtensionsConfiguration": ".jpg,.png",
    }
```

配置上传文本中高危脚本过滤，参考[[Asp.Net Core] 网站中的XSS跨站脚本攻击和防范](https://www.cnblogs.com/jevonsflash/p/17319294.html)




## 【安全审计】应对审计记录进行保护，定期备份，避免受到未预期的删除、修改或覆盖等

### 解决方案
审计日志存储6个月以上。

### 实施
对AbpAuditLogs中的数据定期异地备份，保存时长至少6个月以上。


## 【数据完整性、保密性】应采用校验技术或密码技术保证重要数据在存储过程中的完整性以及保密性，包括但不限于鉴别数据、重要业务数据、重要审计数据、重要配置数据、重要视频数据和重要个人信息等



### 解决方案
1. 采用AES加密对身份证号码等重要数据进行加密后再存储
2. 传输报文中对敏感数据进行脱敏处理
3. 页面中对敏感数据进行脱敏处理


### 实施


使用加密转换器对身份证号字段进行加密存储，参考[在EF Core中为数据表按列加密存储](https://www.cnblogs.com/jevonsflash/p/17288803.html)


```
modelBuilder.Entity<User>().Property(c => c.IdentificationNumber).HasConversion<EncryptionConverter<string>>();

```

修改User到UserDto的字段映射，对手机号，身份证号和邮箱地址进行正则替换。


```
public UserMapProfile()
{
    CreateMap<UserDto, User>();
    CreateMap<UserDto, User>()
        .ForMember(x => x.Roles, opt => opt.Ignore())
        .ForMember(x => x.CreationTime, opt => opt.Ignore())
        .ForMember(x => x.IdentificationNumber, opt => opt.Ignore())
        .ForMember(x => x.EmailAddress, opt => opt.Ignore())
        .ForMember(x => x.PhoneNumber, opt => opt.Ignore());

    CreateMap<User, UserDto>()
            .ForMember(
                dest => dest.PhoneNumber,
                opt => opt.MapFrom(
                    src => Regex.Replace(src.PhoneNumber, "(\\d{3})\\d{4}(\\d{4})", "$1****$2")))

            .ForMember(
                dest => dest.IdentificationNumber,
                opt => opt.MapFrom(
                    src => Regex.Replace(src.IdentificationNumber, "(?<=\\w{3})\\w(?=\\w{4})", "*")))


            .ForMember(
                dest => dest.EmailAddress,
                opt => opt.MapFrom(
                    src => Regex.Replace(src.EmailAddress, "(^\\w)[^@]*(@.*$)", "$1****$2")));



    CreateMap<CreateUserDto, User>();
    CreateMap<CreateUserDto, User>().ForMember(x => x.Roles, opt => opt.Ignore());
}
```

页面中修改更新方式


![在这里插入图片描述](644861-20230418134322538-615541917.png)



## 【数据备份恢复】应提供重要数据的本地数据备份与恢复功能


### 解决方案

在本地定期备份配置数据、业务数据。根据实际业务需求定期对备份数据进行恢复测试，保存相关的恢复测试记录。

### 实施

项目按照[SQL server完全备份指南](https://www.cnblogs.com/jevonsflash/p/17141767.html)进行备份作业，

由运维人员定期对业务数据进行异地备份，根据实际业务需求定期对备份数据进行恢复测试，并对恢复测试进行记录
