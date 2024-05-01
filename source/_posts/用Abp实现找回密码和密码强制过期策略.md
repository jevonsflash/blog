---
thumbnail: images/0a7c28eeb27045ddbb00f12a35347126.png
title: 用Abp实现找回密码和密码强制过期策略
excerpt: >-
  用户找回密码，确切地说是，为了保证用户账号安全，原始密码将不再以明文的方式找回，而是通过短信或者邮件的方式发送一个随机的重置校验码（带校验码的页面连接），用户点击该链接，跳转到重置密码页面，输入新的密码。这个重置校验码是一次性的，用户重置密码后立即失效。用户找回密码是在用户没有登录时进行的，因此需要先校验身份（除用户名+密码外的第二种身份验证方式）。第二种身份验证的前提是绑定了手机号或者邮箱，如果没有绑定，那么只能通过管理员进行原始密码重置。
tags:
  - [.NET]
  - Vue
  - asp.net core
  - sms
  - 鉴权
categories:
  - [.NET]
  - [Web]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-04-14 11:59:00/用Abp实现找回密码和密码强制过期策略.html'
abbrlink: a985b2df
date: 2023-04-14 11:59:00
cover:
description:
---
<!-- toc -->
用户找回密码，确切地说是**重置密码**，为了保证用户账号安全，原始密码将不再以明文的方式找回，而是通过短信或者邮件的方式发送一个随机的重置校验码（带校验码的页面连接），用户点击该链接，跳转到重置密码页面，输入新的密码。这个重置校验码是一次性的，用户重置密码后立即失效。

用户找回密码是在用户没有登录时进行的，因此需要先校验身份（除用户名+密码外的第二种身份验证方式）。
第二种身份验证的前提是绑定了手机号或者邮箱，如果没有绑定，那么只能通过管理员进行原始密码重置。


密码强制过期策略，是指用户在一段时间内没有修改密码，在下次登录时系统阻止用户登录，直到用户修改了密码后方可继续登录。此策略提高用户账号的安全性。

![在这里插入图片描述](644861-20230414115727064-1492685742.png)


找回密码和密码过期重置密码，两种机制有相近的业务逻辑，即密码重置。今天我们来实现这个功能。


## 重置密码

Abp框架中，AbpUserBase类中已经定义了重置校验码PasswordResetCode属性，以及SetNewPasswordResetCode方法，用于生成新的重置校验码。
```
[StringLength(328)]
public virtual string PasswordResetCode { get; set; }
```
```
public virtual void SetNewPasswordResetCode()
{
    PasswordResetCode = Guid.NewGuid().ToString("N").Truncate(328);
}
```




在UserAppService中添加ResetPasswordByCode,用于响应重置密码的请求。
在其参数ResetPasswordByLinkDto中携带了校验信息PasswordResetCode，因此添加了特性`[AbpAllowAnonymous]`，不需要登录认证即可调用此接口

密码更新完成后，立刻将PasswordResetCode重置为null，以防止重复使用。


```
[AbpAllowAnonymous]
public async Task<bool> ResetPasswordByCode(ResetPasswordByLinkDto input)
{
    await _userManager.InitializeOptionsAsync(AbpSession.TenantId);

    var currentUser = await _userManager.GetUserByIdAsync(input.UserId);
    if (currentUser == null || currentUser.PasswordResetCode.IsNullOrEmpty() || currentUser.PasswordResetCode != input.ResetCode)
    {
        throw new UserFriendlyException("PasswordResetCode不正确");
    }

    var loginAsync = await _logInManager.LoginAsync(currentUser.UserName, input.NewPassword, shouldLockout: false);
    if (loginAsync.Result == AbpLoginResultType.Success)
    {
        throw new UserFriendlyException("重置的密码不应与之前密码相同");
    }

    if (currentUser.IsDeleted || !currentUser.IsActive)
    {
        return false;
    }

    CheckErrors(await _userManager.ChangePasswordAsync(currentUser, input.NewPassword));
    currentUser.PasswordResetCode = null;
    currentUser.LastPasswordModificationTime = DateTime.Now;
    await this._userManager.UpdateAsync(currentUser);

    return true;
}
```



## 找回密码


### 发送验证码

使用[AbpBoilerplate.Sms](https://github.com/MatoApps/Sms)作为短信服务库。

之前的项目中，我们定义好了ICaptchaManager接口，已经实现了验证码的发送、验证码校验、解绑手机号、绑定手机号

这4个功能，通过定义用途（purpose）字段以校验区分短信模板

```
public interface ICaptchaManager
{
    Task BindAsync(string token);
    Task UnbindAsync(string token);
    Task SendCaptchaAsync(long userId, string phoneNumber, string purpose);
    Task<bool> VerifyCaptchaAsync(string token, string purpose = "IDENTITY_VERIFICATION");
}
```


添加一个用于重置密码的purpose，在CaptchaPurpose枚举类型中添加`RESET_PASSWORD`

```
public class CaptchaPurpose
{
    ...

    public const string RESET_PASSWORD = "RESET_PASSWORD";

}

```


在SMS服务商管理端后台申请一个短信模板，用于重置密码。

![在这里插入图片描述](644861-20230414115726952-1157808196.png)


打开短信验证码的领域服务类SmsCaptchaManager， 添加`RESET_PASSWORD`对应短信模板的编号

```
public async Task SendCaptchaAsync(long userId, string phoneNumber, string purpose)
{
    var captcha = CommonHelper.GetRandomCaptchaNumber();
    var model = new SendSmsRequest();
    model.PhoneNumbers = new string[] { phoneNumber };
    model.SignName = "MatoApp";
    model.TemplateCode = purpose switch
    {
        ...
        CaptchaPurpose.RESET_PASSWORD => "SMS_1587660"    //添加重置密码对应短信模板的编号
    };

    ...
}
```



接下来我们创建ResetPasswordManager类，用于处理找回密码和密码过期重置密码的业务逻辑。
注入UserManager，ISmsService，SmsCaptchaManager，EmailCaptchaManager。

```
public class ResetPasswordManager : ITransientDependency
{
    private readonly UserManager userManager;
    private readonly ISmsService smsService;
    private readonly SmsCaptchaManager smsCaptchaManager;
    private readonly EmailCaptchaManager emailCaptchaManager;

    public ResetPasswordManager(
        UserManager userManager,
        ISmsService smsService,
        SmsCaptchaManager smsCaptchaManager,
        EmailCaptchaManager emailCaptchaManager
        )
    {
        this.userManager = userManager;
        this.smsService = smsService;
        this.smsCaptchaManager = smsCaptchaManager;
        this.emailCaptchaManager = emailCaptchaManager;
    }
```

在ResetPasswordManager中添加SendForgotPasswordCaptchaAsync方法，用于短信或邮箱方式的身份验证。

```
public async Task SendForgotPasswordCaptchaAsync(string provider, string phoneNumberOrEmail)
{

    User user;
    if (provider == "Email")
    {
        user = await userManager.FindByEmailAsync(phoneNumberOrEmail);
        if (user == null)
        {
            throw new UserFriendlyException("未找到绑定邮箱的用户");
        }
        await emailCaptchaManager.SendCaptchaAsync(user.Id, user.EmailAddress, CaptchaPurpose.RESET_PASSWORD);


    }
    else if (provider == "Phone")
    {
        user = await userManager.FindByNameOrPhoneNumberAsync(phoneNumberOrEmail);
        if (user == null)
        {
            throw new UserFriendlyException("未找到绑定手机号的用户");
        }
        await smsCaptchaManager.SendCaptchaAsync(user.Id, user.PhoneNumber, CaptchaPurpose.RESET_PASSWORD);
    }


}
```

### 校验验证码

添加VerifyAndSendResetPasswordLinkAsync方法，用于校验验证码，并发送重置密码的链接。
```
public async Task VerifyAndSendResetPasswordLinkAsync(string token, string provider)
{
    if (provider == "Email")
    {
        EmailCaptchaTokenCacheItem currentItem = await emailCaptchaManager.GetToken(token);
        if (currentItem == null || currentItem.Purpose != CaptchaPurpose.RESET_PASSWORD)
        {
            throw new UserFriendlyException("验证码不正确或已过期");
        }

        var user = await userManager.GetUserByIdAsync(currentItem.UserId);
        var emailAddress = currentItem.EmailAddress;
        await SendEmailResetPasswordLink(user, emailAddress);

        await emailCaptchaManager.RemoveToken(token);
    }

    else if (provider == "Phone")
    {

        SmsCaptchaTokenCacheItem currentItem = await smsCaptchaManager.GetToken(token);
        if (currentItem == null || currentItem.Purpose != CaptchaPurpose.RESET_PASSWORD)
        {
            throw new UserFriendlyException("验证码不正确或已过期");
        }

        var user = await userManager.GetUserByIdAsync(currentItem.UserId);
        var phoneNumber = currentItem.PhoneNumber;
        await SendSmsResetPasswordLink(user, phoneNumber);

        await smsCaptchaManager.RemoveToken(token);
    }
    else
    {
        throw new UserFriendlyException("验证码提供者错误");
    }

}

```

### 发送重置密码链接

创建SendSmsResetPasswordLink，用于对当前用户产生一个NewPasswordResetCode，并发送重置密码的短信链接。

```
private async Task SendSmsResetPasswordLink(User user, string phoneNumber)
{
    var model = new SendSmsRequest();
    user.SetNewPasswordResetCode();
    var passwordResetCode = user.PasswordResetCode;
    model.PhoneNumbers = new string[] { phoneNumber };
    model.SignName = "MatoApp";
    model.TemplateCode = "SMS_255330989";
    //for aliyun
    model.TemplateParam = JsonConvert.SerializeObject(new { username = user.UserName, code = passwordResetCode });

    //for tencent-cloud
    //model.TemplateParam = JsonConvert.SerializeObject(new string[] { user.UserName, passwordResetCode });


    var result = await smsService.SendSmsAsync(model);

    if (string.IsNullOrEmpty(result.BizId) && result.Code != "OK")
    {
        throw new UserFriendlyException("验证码发送失败，错误信息:" + result.Message);
    }
}

```


### 创建接口

在UserAppService暴露出SendForgotPasswordCaptcha和VerifyAndSendResetPasswordLink两个接口，

注意这两个接口都需要添加`[AbpAllowAnonymous]`特性，因为在用户未登录的情况下，也需要使用这两个接口。

```
[AbpAllowAnonymous]
public async Task SendForgotPasswordCaptcha(ForgotPasswordProviderDto input)
{
    var provider = input.Provider;
    var phoneNumberOrEmail = input.ProviderNumber;

    await forgotPasswordManager.SendForgotPasswordCaptchaAsync(provider, phoneNumberOrEmail);

}

[AbpAllowAnonymous]
public async Task VerifyAndSendResetPasswordLink(SendResetPasswordLinkDto input)
{
    var provider = input.Provider;
    var token = input.Token;
    await forgotPasswordManager.VerifyAndSendResetPasswordLinkAsync(token, provider);

}
```
这两个接口分别在用户忘记密码的两个阶段调用，
1. 第一阶段是发送验证码，
2. 第二阶段是校验验证码并发送重置密码的链接。

![在这里插入图片描述](644861-20230414115726997-1551953379.png)



## 密码强制过期策略

在User实体中添加一个属性，用于记录密码最后修改时间，在登录时验证这个时间至此时的时间跨度，如果超过一定时间（例如90天），强制用户重置密码。

```
[Required]
public DateTime LastPasswordModificationTime { get; set; }

```


### 改写接口

将重置校验码PasswordResetCode添加到AuthenticateResultModel中

```
public string PasswordResetCode { get; set; }

```


打开TokenAuthController，注入ResetPasswordManager服务对象


登录验证终节点方法Authenticate中，添加对密码强制过期的逻辑代码

```
[HttpPost]
public async Task<AuthenticateResultModel> Authenticate([FromBody] AuthenticateModel model)
{

    var loginResult = await GetLoginResultAsync(
                model.UserNameOrEmailAddress,
                model.Password,
                GetTenancyNameOrNull()
            );


    ...

    //Password Expiration Check
    if (DateTime.Now - loginResult.User.LastPasswordModificationTime > TimeSpan.FromDays(90))
    {
        loginResult.User.SetNewPasswordResetCode();

        return new AuthenticateResultModel
        {
            PasswordResetCode = loginResult.User.PasswordResetCode,
            UserId = loginResult.User.Id,
        };
    }

}

```
当登录账号的LastPasswordModificationTime距此时大于90天时，将阻止登录，并提示账户密码已过期，需要修改密码
![在这里插入图片描述](644861-20230414115726956-769854552.png)
![在这里插入图片描述](644861-20230414115726918-1792160554.png)





## Vue网页端开发

### 重置密码页面

创建Web端的重置密码页面，用于用户重置密码。
![在这里插入图片描述](644861-20230414115727135-272053811.png)


当用户通过短信或邮箱接收到重置密码的链接后，点击链接，会跳转到重置密码的页面，用户输入新密码后，点击提交，就可以完成密码重置。

连接格式如下

`http://localhost:8080/reset-password-sample/reset.html?code=f16b5fbb057d4a04bce5b9e7f24e1d56&userId=1`

**项目参与实际生产中请加密参数，在此为了简单起见采用明文传递。**


```html
<template>
  <div id="app">
    <div class="title-container center">
      <h3 class="title">修改密码</h3>
    </div>
    <el-row>
      <el-form
        ref="loginForm"
        :model="input"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <el-form-item label="验证码">
          <el-input v-model="input.code" placeholder="请输入验证码" clearable />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="input.newPassword"
            placeholder="请输入新密码"
            clearable
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码（确认）" prop="newPassword2">
          <el-input
            v-model="input.newPassword2"
            placeholder="请再次输入新密码"
            clearable
            show-password
          />
        </el-form-item>

        <el-row type="flex" class="row-bg">
          <el-col :offset="6" :span="10">
            <el-button
              type="primary"
              style="width: 100%"
              @click.native.prevent="submit"
              >修改
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>
```

创建页面时会根据url中的参数，获取code和userId。

```javascript
created: async function () {
    var url = window.location.href;
    var reg = /[?&]([^?&#]+)=([^?&#]+)/g;
    var param = {};
    var ret = reg.exec(url);
    while (ret) {
      param[ret[1]] = ret[2];
      ret = reg.exec(url);
    }
    if ("code" in param) {
      this.input.code = param["code"];
    }
    if ("userId" in param) {
      this.input.userId = param["userId"];
    }
  },

```
点击修改时会触发submit方法，这个方法会调用ResetPasswordByCode接口，将UserId，newPassword以及resetCode回传。

```javascript
 async submit() {
      if ((this.input.newPassword != this.input.newPassword2) == null) {
        this.$message.warning("两次输入的密码不一致！");
        return;
      }

      await request(
        `${this.host}${this.prefix}/User/ResetPasswordByCode`,
        "post",
        {
          userId: this.input.userId,
          newPassword: this.input.newPassword,
          resetCode: this.input.code,
        }
      )
        .catch((re) => {
          var res = re.response.data;
          this.errorMessage(res.error.message);
        })
        .then(async (res) => {
          var data = res.data.result;
          this.successMessage("密码修改成功！");
          
          window.location.href = "/reset-password-sample.html";
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 1.5 * 1000);
        });
    },

```


### 忘记密码控件

在登录页面中，添加忘记密码的控件。

![在这里插入图片描述](644861-20230414115727112-603855879.png)


resetPasswordStage 是判定当前是哪个阶段的变量，
0表示正常用户名密码登录（初始状态），1表示输入手机号或邮箱验证身份，2表示通过验证即将发送重置密码的链接。

默认两种方式，一种是短信验证码，一种是邮箱验证码，这里我们采用了elementUI的tab组件，来实现两种方式的切换。

```
<template v-else-if="resetPasswordStage == 1">
    <p>
    请输入与要找回的账户关联的手机号或邮箱。我们将为你发送密码重置连接
    </p>
    <el-tabs tab-position="top" v-model="forgotPasswordProvider.provider">
    <el-tab-pane :lazy="true" label="通过手机号找回" name="Phone">
        <el-row>
        <el-col :span="24">
            <el-input
            v-model="forgotPasswordProvider.providerNumber"
            :placeholder="'请输入手机号'"
            tabindex="2"
            >
            <el-button
                slot="append"
                @click="sendResetPasswordLink"
                :disabled="forgotPasswordProvider.providerNumber == ''"
                >下一步</el-button
            >
            </el-input>
        </el-col>
        </el-row>
    </el-tab-pane>

    <el-tab-pane :lazy="true" label="通过邮箱找回" name="Email">
        <el-row>
        <el-col :span="24">
            <el-alert
            v-if="showResetRequireSuccess"
            title="密码重置连接已发送至登录用户对应的邮箱，请查收"
            type="info"
            >
            </el-alert>
        </el-col>
        <el-col :span="24">
            <p>建设中..</p>
        </el-col>
        </el-row>
    </el-tab-pane>
    </el-tabs>
</template>
```

不通的阶段，将分别调用不同的接口，sendResetPasswordLink以及verifyAndSendResetPasswordLink。

调用verifyAndSendResetPasswordLink接口完毕时，resetPasswordStage将设置位初始状态，即0。

```javascript
async sendResetPasswordLink() {
    await request(
    `${this.host}${this.prefix}/User/SendForgotPasswordCaptcha`,
    "post",
    this.forgotPasswordProvider
    )
    .catch((re) => {
        var res = re.response.data;
        this.errorMessage(res.error.message);
    })
    .then(async (re) => {
        if (re) {
        this.successMessage("发送验证码成功");
        this.resetPasswordStage++;
        }
    });
},
async verifyAndSendResetPasswordLink() {
    await request(
    `${this.host}${this.prefix}/User/VerifyAndSendResetPasswordLink`,
    "post",
    {
        provider: this.forgotPasswordProvider.provider,
        token: this.captchaToken,
    }
    )
    .catch((re) => {
        var res = re.response.data;
        this.errorMessage(res.error.message);
    })
    .then(async (re) => {
        if (re) {
        this.successMessage("发送连接成功");
        this.resetPasswordStage = 0;
        }
    });
},
```


### 密码过期提示

主页面中添加对passwordResetCode的响应，当passwordResetCode不为空时，显示一个提示框，提示用户密码已超过90天未修改，请修改密码。

```
<el-alert
    v-if="passwordResetCode != null"
    close-text="点此修改密码"
    title="密码已超过90天未修改，为了安全，请修改密码"
    type="info"
    @close="
        gotoUrl(
        '/reset-password-sample/reset.html?code=' +
            passwordResetCode +
            '&userId=' +
            userId
        )
    "
    >
</el-alert>
```

![在这里插入图片描述](644861-20230414115727057-1075623114.png)
用户点击`点此修改密码`按钮时将跳转至重置密码页面。
## 项目地址
[Github:matoapp-samples](https://github.com/jevonsflash/matoapp-samples)