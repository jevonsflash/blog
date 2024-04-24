---
thumbnail:
cover:
title: 'Abp.Zero 手机号免密登录验证与号码绑定功能的实现（二）：改造Abp默认实现'
excerpt:
description:
date: 2022-11-01 18:13:00
tags:
  - sms
  - 阿里云
  - 腾讯云

categories:
  - .NET
  - Web
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2022-11-01 18:13:00/Abp.Zero 手机号免密登录验证与号码绑定功能的实现（二）：改造Abp默认实现.html
---
接下来我们重写原Abp的部分实现，来驳接手机号相关业务。

## 改造User类
重写PhoneNumber使得电话号码为必填项，和中国大陆手机号11位长度

```
public new const int MaxPhoneNumberLength = 11;

[Required]
[StringLength(MaxPhoneNumberLength)]
public override string PhoneNumber { get; set; }


```

## 改造UserStore类
扩展通过PhoneNumber查找用户的方法
```

public async Task<User> FindByNameOrPhoneNumberAsync(string userNameOrPhoneNumber)
{

    return await UserRepository.FirstOrDefaultAsync(
        user => user.NormalizedUserName == userNameOrPhoneNumber || user.PhoneNumber == userNameOrPhoneNumber
    );
}

[UnitOfWork]
public async Task<User> FindByNameOrPhoneNumberAsync(int? tenantId, string userNameOrPhoneNumber)
{
    using (_unitOfWorkManager.Current.SetTenantId(tenantId))
    {
        return await FindByNameOrPhoneNumberAsync(userNameOrPhoneNumber);
    }
}
```


## 改造UserManager类
添加检测重复电话号码的方法CheckDuplicateUsernameOrPhoneNumber
```

public async Task<IdentityResult> CheckDuplicateUsernameOrPhoneNumber(long? expectedUserId, string userName, string phone)
{
    var user = await FindByNameAsync(userName);
    if (user != null && user.Id != expectedUserId)
    {
        throw new UserFriendlyException(string.Format(L("Identity.DuplicateUserName"), userName));
    }

    user = await FindByNameOrPhoneNumberAsync(GetCurrentTenantId(), phone);
    if (user != null && user.Id != expectedUserId)
    {
        throw new UserFriendlyException("电话号码重复", phone);
    }

    return IdentityResult.Success;
}

```

重写对用户的Create和Update，使其先检测是否重复电话号码。

```
//override

public override async Task<IdentityResult> CreateAsync(User user)
{
    var result = await CheckDuplicateUsernameOrPhoneNumber(user.Id, user.UserName, user.PhoneNumber);
    if (!result.Succeeded)
    {
        return result;
    }


    return await base.CreateAsync(user);
}

public override async Task<IdentityResult> UpdateAsync(User user)
{
    var result = await CheckDuplicateUsernameOrPhoneNumber(user.Id, user.UserName, user.PhoneNumber);
    if (!result.Succeeded)
    {
        return result;
    }

    return await base.UpdateAsync(user);
}
```

## 改造LogInManager类
分别重写LoginAsyncInternal，TryLoginFromExternalAuthenticationSourcesAsync两个方法，在用Email找不到用户之后，添加用手机号码查找用户的逻辑，添加的代码如下：
```
...
if (user == null)
{
    user = await userManager.FindByNameOrPhoneNumberAsync(tenantId, combinationName);
}
```


## 编写验证源
新建电话号码验证源类PhoneNumberExternalAuthenticationSource，并实现验证码校验逻辑，具体的代码
```
public class PhoneNumberExternalAuthenticationSource : DefaultExternalAuthenticationSource<Tenant, User>, ITransientDependency
{
    private readonly CaptchaManager captchaManager;

    public PhoneNumberExternalAuthenticationSource(CaptchaManager captchaManager)
    {
        this.captchaManager=captchaManager;
    }
    /// <inheritdoc/>
    public override string Name { get; } = "SMS验证码登录";

    /// <inheritdoc/>
    public override async Task<bool> TryAuthenticateAsync(string phoneNumber, string token, Tenant tenant)
    {
        //for test
        //return true;
        var currentItem = await captchaManager.GetToken(token);
        if (currentItem==null || currentItem.PhoneNumber!=phoneNumber || currentItem.Purpose!=CaptchaPurpose.LOGIN)
        {
            return false;
        }
        await captchaManager.RemoveToken(token);
        return true;
    }

    /// <inheritdoc/>
    public override Task<User> CreateUserAsync(string userNameOrEmailAddress, Tenant tenant)
    {
        var seed = Guid.NewGuid().ToString("N").Substring(0, 7);
        var surname = "手";
        var name = "机用户"+seed;
        var userName = PinyinUtil.PinYin(surname+name);

            var result = new User()
            {
                Surname = surname,
                Name = name,
                UserName =  userName,
                IsPhoneNumberConfirmed = true,
                IsActive=true,
                TenantId = tenant?.Id,
                PhoneNumber = userNameOrEmailAddress,
                Settings = null,
                IsEmailConfirmed = true,
                EmailAddress=$"{userName}@abc.com"
            };
        return Task.FromResult(result);

    }

    /// <inheritdoc/>
    public override Task UpdateUserAsync(User user, Tenant tenant)
    {
        return Task.FromResult(0);
    }

}
```

## 配置

在Web.Core项目中的WebCoreModule文件中，将PhoneNumberExternalAuthenticationSource添加至扩展身份验证源配置中
```
private void ConfigureExternalAuth()
{
    var userManagementConfig = IocManager.Resolve<IUserManagementConfig>();
    userManagementConfig.ExternalAuthenticationSources.Add(typeof(PhoneNumberExternalAuthenticationSource));
}
```


在Web.Host项目中的 appsettings.json 文件中，添加AliyunSms库的相关配置，详细说明请参考[AbpBoilerplate.Sms](https://github.com/MatoApps/Sms)。

```
  "AliyunSms": {
    "RegionId": "cn-hangzhou",
    "AccessKey": "{Your AccessKey}",  //阿里云后台管理页面中获取AccessKey
    "AccessKeySecret": "{Your AccessKeySecret}"  //阿里云后台管理页面中获取AccessKeySecret
  },
```
  
  至此，后端的所有任务结束，下一章将介绍前端项目的搭建


## 项目地址
[Github:matoapp-samples](https://github.com/jevonsflash/matoapp-samples)