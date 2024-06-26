---
thumbnail: images/e1815a0851ab43e0973312dd705a4751.png
title: 用Abp实现两步验证（Two-Factor Authentication，2FA）登录（三）：免登录验证
excerpt: >-
  常用的实现方式是在用户登录成功后，生成一个随机的字符串Token，将此Token保存在用户浏览器的 cookie
  中，同时将这个字符串保存在用户的数据库中。当用户再次访问时，如果 cookie
  中的字符串和数据库中的字符串相同，则免登录验证通过。rememberClientToken是存储于cookie中的，当用户登出时不需要清空cookie中的rememberClientToken，以便下次登录跳过两步验证。为了安全，Token采用对称加密传输存储，同时参与校验的还有用户Id，以进一步验证数据一致性。
tags:
  - [.NET]
  - Vue
  - asp.net core
  - 网络安全
categories:
  - [.NET]
  - [Web]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-04-12 21:25:00/用Abp实现两步验证（Two-Factor Authentication，2FA）登录（三）：免登录验证.html'
abbrlink: a0ee7b99
date: 2023-04-12 21:25:00
cover:
description:
---


<!-- toc -->

免登录验证是用户在首次两步验证通过后，在常用的设备（浏览器）中，在一定时间内不需要再次输入验证码直接登录。

常见的网页上提示“**7天免登录验证**”或“**信任此设备，7天内无需两步验证**”等内容。
这样可以提高用户的体验。但同时也会带来一定的安全风险，因此需要用户自己决定是否开启。
![在这里插入图片描述](644861-20230412212222891-982005018.png)

## 原理
常用的实现方式是在用户登录成功后，生成一个随机的字符串Token，将此Token保存在用户浏览器的 cookie 中，同时将这个字符串保存在用户的数据库中。当用户再次访问时，如果 cookie 中的字符串和数据库中的字符串相同，则免登录验证通过。流程图如下：

![在这里插入图片描述](644861-20230412212222888-546882066.png)


为了安全，Token采用对称加密传输存储，同时参与校验的还有用户Id，以进一步验证数据一致性。Token存储于数据库中并设置过期时间(ExpireDate)
认证机制由JSON Web Token（JWT）实现，通过自定义Payload声明中添加Token和用户Id字段，实现校验。

下面来看代码实现：

## 修改请求报文

项目添加对`Microsoft.AspNetCore.Authentication.JwtBearer`包的引用
```
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="7.0.4" />
```

在Authenticate方法参数AuthenticateModel中添加RememberClient和RememberClientToken属性，

当首次登录时，若用户选择免登录，RememberClient为true，
非首次登录时，系统校验RememberClientToken合法性，是否允许跳过两步验证。
```
public class AuthenticateModel
{
  ..

    public bool RememberClient { get; set; }

    public string RememberClientToken { get; set; }
}

```

同时返回值中添加RememberClientToken，用于首次登录生成的Token
```
public class AuthenticateResultModel
{
    ...

    public string RememberClientToken { get; set; }
}

```

## 配置JwtBearerOptions


在TokenAuthController的Authenticate方法中，添加validation参数：
```
var validationParameters = new TokenValidationParameters
{
    ValidAudience = _configuration.Audience,
    ValidIssuer = _configuration.Issuer,
    IssuerSigningKey = _configuration.SecurityKey
};
```
在默认的AbpBoilerplate模板项目中已经为我们生成了默认配置

```
 "Authentication": {
    "JwtBearer": {
      "IsEnabled": "true",
      "SecurityKey": "MatoAppSample_C421AAEE0D114E9C",
      "Issuer": "MatoAppSample",
      "Audience": "MatoAppSample"
    }
  },

```

## 生成Token

在TokenAuthController类中

添加自定义Payload声明类型
```
public const string USER_IDENTIFIER_CLAIM = "USER_IDENTIFIER_CLAIM";
public const string REMEMBER_CLIENT_TOKEN = "REMEMBER_CLIENT_TOKEN";
```

添加生成Token的方法CreateAccessToken，它将根据自定义Payload声明，validationParameters生成经过SHA256加密的Token，过期时间即有效期为7天：
```
private string CreateAccessToken(IEnumerable<Claim> claims, TokenValidationParameters validationParameters)
{
    var now = DateTime.UtcNow;
    var expiration = TimeSpan.FromDays(7);
    var signingCredentials = new SigningCredentials(validationParameters.IssuerSigningKey, SecurityAlgorithms.HmacSha256);


    var jwtSecurityToken = new JwtSecurityToken(
        issuer: validationParameters.ValidIssuer,
        audience: validationParameters.ValidAudience,
        claims: claims,
        notBefore: now,
        expires: now.Add(expiration),
        signingCredentials: signingCredentials
    );

    return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
}
```



更改方法`TwoFactorAuthenticateAsync`的签名，添加rememberClient和validationParameters形参


在该方法中添加生成Token的代码
    
```
if (rememberClient)
{
    if (await settingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsRememberBrowserEnabled))
    {
        var expiration = TimeSpan.FromDays(7);

        var tokenValidityKey = Guid.NewGuid().ToString("N");
        var accessToken = CreateAccessToken(new[]
            {
                new Claim(USER_IDENTIFIER_CLAIM, user.ToUserIdentifier().ToString()),
                new Claim(REMEMBER_CLIENT_TOKEN, tokenValidityKey)
            }, validationParameters
        );
        await _userManager.AddTokenValidityKeyAsync(user, tokenValidityKey,
        DateTime.Now.Add(expiration));
        return accessToken;
    }
}

```
## 校验Token

添加校验方法TwoFactorClientRememberedAsync，它表示校验结果是否允许跳过两步验证

```
public async Task<bool> TwoFactorClientRememberedAsync(UserIdentifier userIdentifier, string TwoFactorRememberClientToken, TokenValidationParameters validationParameters)
{
    if (!await settingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsRememberBrowserEnabled))
    {
        return false;
    }

    if (string.IsNullOrWhiteSpace(TwoFactorRememberClientToken))
    {
        return false;
    }

    try
    {
        var tokenHandler = new JwtSecurityTokenHandler();


        if (tokenHandler.CanReadToken(TwoFactorRememberClientToken))
        {
            try
            {
                SecurityToken validatedToken;
                var principal = tokenHandler.ValidateToken(TwoFactorRememberClientToken, validationParameters, out validatedToken);
                var userIdentifierString = principal.Claims.First(c => c.Type == TwoFactorAuthorizationManager.USER_IDENTIFIER_CLAIM);
                if (userIdentifierString == null)
                {
                    throw new SecurityTokenException(TwoFactorAuthorizationManager.USER_IDENTIFIER_CLAIM + " invalid");
                }

                var tokenValidityKeyInClaims = principal.Claims.First(c => c.Type == TwoFactorAuthorizationManager.REMEMBER_CLIENT_TOKEN);


                var currentUserIdentifier = UserIdentifier.Parse(userIdentifierString.Value);

                var user = _userManager.GetUserById(currentUserIdentifier.UserId);
                var isValidityKetValid = AsyncHelper.RunSync(() => _userManager.IsTokenValidityKeyValidAsync(user, tokenValidityKeyInClaims.Value));

                if (!isValidityKetValid)
                {
                    throw new SecurityTokenException(REMEMBER_CLIENT_TOKEN + " invalid");

                }

                return userIdentifierString.Value == userIdentifier.ToString();
            }
            catch (Exception ex)
            {
                LogHelper.LogException(ex);
            }
        }

    }
    catch (Exception ex)
    {
        LogHelper.LogException(ex);
    }

    return false;
}

```


更改方法`IsTwoFactorAuthRequiredAsync`添加twoFactorRememberClientToken和validationParameters形参

添加对TwoFactorClientRememberedAsync的调用

```
public async Task<bool> IsTwoFactorAuthRequiredAsync(AbpLoginResult<Tenant, User> loginResult, string TwoFactorRememberClientToken, TokenValidationParameters validationParameters)
{
    if (!await settingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsEnabled))
    {
        return false;
    }

    if (!loginResult.User.IsTwoFactorEnabled)
    {
        return false;
    }
    if ((await _userManager.GetValidTwoFactorProvidersAsync(loginResult.User)).Count <= 0)
    {
        return false;
    }

    if (await TwoFactorClientRememberedAsync(loginResult.User.ToUserIdentifier(), TwoFactorRememberClientToken, validationParameters))
    {
        return false;
    }

    return true;
}
```

## 修改认证EndPoint

在TokenAuthController的Authenticate方法中，找到校验代码片段，对以上两个方法的调用传入实参

```
...
await userManager.InitializeOptionsAsync(loginResult.Tenant?.Id);
string twoFactorRememberClientToken = null;
if (await twoFactorAuthorizationManager.IsTwoFactorAuthRequiredAsync(loginResult, model.RememberClientToken, validationParameters))
{
    if (string.IsNullOrEmpty(model.TwoFactorAuthenticationToken))
    {
        return new AuthenticateResultModel
        {
            RequiresTwoFactorAuthenticate = true,
            UserId = loginResult.User.Id,
            TwoFactorAuthenticationProviders = await userManager.GetValidTwoFactorProvidersAsync(loginResult.User),

        };
    }
    else
    {
        twoFactorRememberClientToken = await twoFactorAuthorizationManager.TwoFactorAuthenticateAsync(loginResult.User, model.TwoFactorAuthenticationToken, model.TwoFactorAuthenticationProvider, model.RememberClient, validationParameters);
    }
}
```


完整的TwoFactorAuthorizationManager代码如下：

```
public class TwoFactorAuthorizationManager : ITransientDependency
{
    public const string USER_IDENTIFIER_CLAIM = "USER_IDENTIFIER_CLAIM";
    public const string REMEMBER_CLIENT_TOKEN = "REMEMBER_CLIENT_TOKEN";

    private readonly UserManager _userManager;
    private readonly ISettingManager settingManager;
    private readonly SmsCaptchaManager smsCaptchaManager;
    private readonly EmailCaptchaManager emailCaptchaManager;

    public TwoFactorAuthorizationManager(
        UserManager userManager,
        ISettingManager settingManager,
        SmsCaptchaManager smsCaptchaManager,
        EmailCaptchaManager emailCaptchaManager)
    {
        this._userManager = userManager;
        this.settingManager = settingManager;
        this.smsCaptchaManager = smsCaptchaManager;
        this.emailCaptchaManager = emailCaptchaManager;
    }



    public async Task<bool> IsTwoFactorAuthRequiredAsync(AbpLoginResult<Tenant, User> loginResult, string TwoFactorRememberClientToken, TokenValidationParameters validationParameters)
    {
        if (!await settingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsEnabled))
        {
            return false;
        }

        if (!loginResult.User.IsTwoFactorEnabled)
        {
            return false;
        }
        if ((await _userManager.GetValidTwoFactorProvidersAsync(loginResult.User)).Count <= 0)
        {
            return false;
        }

        if (await TwoFactorClientRememberedAsync(loginResult.User.ToUserIdentifier(), TwoFactorRememberClientToken, validationParameters))
        {
            return false;
        }

        return true;
    }

    public async Task<bool> TwoFactorClientRememberedAsync(UserIdentifier userIdentifier, string TwoFactorRememberClientToken, TokenValidationParameters validationParameters)
    {
        if (!await settingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsRememberBrowserEnabled))
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(TwoFactorRememberClientToken))
        {
            return false;
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();


            if (tokenHandler.CanReadToken(TwoFactorRememberClientToken))
            {
                try
                {
                    SecurityToken validatedToken;
                    var principal = tokenHandler.ValidateToken(TwoFactorRememberClientToken, validationParameters, out validatedToken);
                    var userIdentifierString = principal.Claims.First(c => c.Type == TwoFactorAuthorizationManager.USER_IDENTIFIER_CLAIM);
                    if (userIdentifierString == null)
                    {
                        throw new SecurityTokenException(TwoFactorAuthorizationManager.USER_IDENTIFIER_CLAIM + " invalid");
                    }

                    var tokenValidityKeyInClaims = principal.Claims.First(c => c.Type == TwoFactorAuthorizationManager.REMEMBER_CLIENT_TOKEN);


                    var currentUserIdentifier = UserIdentifier.Parse(userIdentifierString.Value);

                    var user = _userManager.GetUserById(currentUserIdentifier.UserId);
                    var isValidityKetValid = AsyncHelper.RunSync(() => _userManager.IsTokenValidityKeyValidAsync(user, tokenValidityKeyInClaims.Value));

                    if (!isValidityKetValid)
                    {
                        throw new SecurityTokenException(REMEMBER_CLIENT_TOKEN + " invalid");

                    }

                    return userIdentifierString.Value == userIdentifier.ToString();
                }
                catch (Exception ex)
                {
                    LogHelper.LogException(ex);
                }
            }

        }
        catch (Exception ex)
        {
            LogHelper.LogException(ex);
        }

        return false;
    }

    public async Task<string> TwoFactorAuthenticateAsync(User user, string token, string provider, bool rememberClient, TokenValidationParameters validationParameters)
    {
        if (provider == "Email")
        {
            var isValidate = await emailCaptchaManager.VerifyCaptchaAsync(token, CaptchaPurpose.TWO_FACTOR_AUTHORIZATION);
            if (!isValidate)
            {
                throw new UserFriendlyException("验证码错误");
            }
        }

        else if (provider == "Phone")
        {
            var isValidate = await smsCaptchaManager.VerifyCaptchaAsync(token, CaptchaPurpose.TWO_FACTOR_AUTHORIZATION);
            if (!isValidate)
            {
                throw new UserFriendlyException("验证码错误");
            }
        }
        else
        {
            throw new UserFriendlyException("验证码提供者错误");
        }


        if (rememberClient)
        {
            if (await settingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsRememberBrowserEnabled))
            {
                var expiration = TimeSpan.FromDays(7);

                var tokenValidityKey = Guid.NewGuid().ToString("N");
                var accessToken = CreateAccessToken(new[]
                    {
                        new Claim(USER_IDENTIFIER_CLAIM, user.ToUserIdentifier().ToString()),
                        new Claim(REMEMBER_CLIENT_TOKEN, tokenValidityKey)
                    }, validationParameters
                );

                await _userManager.AddTokenValidityKeyAsync(user, tokenValidityKey,
                DateTime.Now.Add(expiration));
                return accessToken;


            }
        }

        return null;
    }

    private string CreateAccessToken(IEnumerable<Claim> claims, TokenValidationParameters validationParameters)
    {
        var now = DateTime.UtcNow;
        var expiration = TimeSpan.FromDays(7);
        var signingCredentials = new SigningCredentials(validationParameters.IssuerSigningKey, SecurityAlgorithms.HmacSha256);


        var jwtSecurityToken = new JwtSecurityToken(
            issuer: validationParameters.ValidIssuer,
            audience: validationParameters.ValidAudience,
            claims: claims,
            notBefore: now,
            expires: now.Add(expiration),
            signingCredentials: signingCredentials
        );

        return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
    }


    public async Task SendCaptchaAsync(long userId, string provider)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            throw new UserFriendlyException("找不到用户");

        }

        if (provider == "Email")
        {
            if (!user.IsEmailConfirmed)
            {
                throw new UserFriendlyException("未绑定邮箱");
            }
            await emailCaptchaManager.SendCaptchaAsync(user.Id, user.EmailAddress, CaptchaPurpose.TWO_FACTOR_AUTHORIZATION);
        }
        else if (provider == "Phone")
        {
            if (!user.IsPhoneNumberConfirmed)
            {
                throw new UserFriendlyException("未绑定手机号");
            }
            await smsCaptchaManager.SendCaptchaAsync(user.Id, user.PhoneNumber, CaptchaPurpose.TWO_FACTOR_AUTHORIZATION);
        }
        else
        {
            throw new UserFriendlyException("验证码提供者错误");
        }
    }



}
```

至此我们就完成了后端部分的开发


## 修改前端

### 登录

在两步验证的页面中添加一个checkbox，用于选择是否记住客户端

```
<el-checkbox v-model="loginForm.rememberClient">
    7天内不再要求两步验证
</el-checkbox>
```




JavaScript部分添加对rememberClientToken的处理，存储于cookie中，即便在网页刷新后也能保持免两步验证的状态



```
const rememberClientTokenKey = "main_rememberClientToken";
const setRememberClientToken = (rememberClientToken: string) =>
  Cookies.set(rememberClientTokenKey, rememberClientToken);
const cleanRememberClientToken = () => Cookies.remove(rememberClientTokenKey);
const getRememberClientToken = () => Cookies.get(rememberClientTokenKey);
```


在请求body中添加rememberClientToken, rememberClient的值

```
 var rememberClientToken = getRememberClientToken();
var rememberClient=this.loginForm.rememberClient;

userNameOrEmailAddress = userNameOrEmailAddress.trim();
await request(`${this.host}api/TokenAuth/Authenticate`, "post", {
    userNameOrEmailAddress,
    password,
    twoFactorAuthenticationToken,
    twoFactorAuthenticationProvider,
    rememberClientToken,
    rememberClient
})
```

请求成功后，返回报文中包含rememberClientToken，将其存储于cookie中

```
setRememberClientToken(data.rememberClientToken);
```

### 登出

登出的逻辑不用做其他的修改，只需要将页面的两步验证的token清空即可，
```
this.loginForm.twoFactorAuthenticationToken = "";
this.loginForm.password = "";
```
rememberClientToken是存储于cookie中的，当用户登出时不需要清空cookie中的rememberClientToken，以便下次登录跳过两步验证

除非在浏览器设置中清空cookie，下次登录时，rememberClientToken就会失效。


## 最终效果

![在这里插入图片描述](644861-20230412212222844-975706162.gif)


## 项目地址
[Github:matoapp-samples](https://github.com/jevonsflash/matoapp-samples)