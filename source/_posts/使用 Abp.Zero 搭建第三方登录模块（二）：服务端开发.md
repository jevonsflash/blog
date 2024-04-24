---
thumbnail:
cover:
title: '使用 Abp.Zero 搭建第三方登录模块（二）：服务端开发'
excerpt:
description:
date: 2022-06-24 11:05:00
tags:
  - 小程序
  - 微信公众号

categories:
  - .NET
  - Web
  - 小程序/公众号
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2022-06-24 11:05:00/使用 Abp.Zero 搭建第三方登录模块（二）：服务端开发.html
---
<span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span>
<h2><span id="cke_bm_296S">微信SDK库的集成</span></h2>
<p>微信SDK库是针对微信相关 API 进行封装的模块 ，目前开源社区中微信SDK库数量真是太多了，我选了一个比较好用的EasyAbp WeChat库。</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="16" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="EasyAbp/Abp.WeChat: Abp 微信 SDK 模块，包含对微信小程序、公众号、企业微信、开放平台、第三方平台等相关接口封装。 (github.com)" href="https://github.com/EasyAbp/Abp.WeChat" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/EasyAbp/Abp.WeChat" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2FEasyAbp%2FAbp.WeChat%22%2C%22text%22%3A%22EasyAbp%2FAbp.WeChat%3A%20Abp%20%E5%BE%AE%E4%BF%A1%20SDK%20%E6%A8%A1%E5%9D%97%EF%BC%8C%E5%8C%85%E5%90%AB%E5%AF%B9%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E3%80%81%E5%85%AC%E4%BC%97%E5%8F%B7%E3%80%81%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E3%80%81%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E3%80%81%E7%AC%AC%E4%B8%89%E6%96%B9%E5%B9%B3%E5%8F%B0%E7%AD%89%E7%9B%B8%E5%85%B3%E6%8E%A5%E5%8F%A3%E5%B0%81%E8%A3%85%E3%80%82%20(github.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.4%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM5H6%22%2C%22id%22%3A%22q6IyXM-1656039724780%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.4/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M5H6" data-link-title="EasyAbp/Abp.WeChat: Abp 微信 SDK 模块，包含对微信小程序、公众号、企业微信、开放平台、第三方平台等相关接口封装。 (github.com)" data-widget="csdnlink">EasyAbp/Abp.WeChat: Abp 微信 SDK 模块，包含对微信小程序、公众号、企业微信、开放平台、第三方平台等相关接口封装。 (github.com)</a></span></p>
<p>当然这个库是ABP vNext 框架的，需要稍微改写一下。封装好后我们需要以下几个接口</p>
<p>小程序码生成接口：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="15" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%5Cnpublic%20Task%3CGetUnlimitedACodeResponse%3E%20GetUnlimitedACodeAsync(string%20scene%2C%20string%20page%20%3D%20null%2C%20short%20width%20%3D%20430%2C%20bool%20autoColor%20%3D%20false%2C%20LineColorModel%20lineColor%20%3D%20null%2C%20bool%20isHyaline%20%3D%20false)%5Cn%20%20%20%20%20%20%20%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">
<span class="hljs-function"><span class="hljs-keyword">public Task&lt;GetUnlimitedACodeResponse&gt; <span class="hljs-title">GetUnlimitedACodeAsync(<span class="hljs-params"><span class="hljs-built_in">string scene, <span class="hljs-built_in">string page = <span class="hljs-literal">null, <span class="hljs-built_in">short width = <span class="hljs-number">430, <span class="hljs-built_in">bool autoColor = <span class="hljs-literal">false, LineColorModel lineColor = <span class="hljs-literal">null, <span class="hljs-built_in">bool isHyaline = <span class="hljs-literal">false)
       </span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;获取用户OpenId与SessionKey的接口</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="14" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22public%20async%20Task%3CCode2SessionResponse%3E%20Code2SessionAsync(string%20jsCode%2C%20string%20grantType%20%3D%20%5C%22authorization_code%5C%22)%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">async Task&lt;Code2SessionResponse&gt; <span class="hljs-title">Code2SessionAsync(<span class="hljs-params"><span class="hljs-built_in">string jsCode, <span class="hljs-built_in">string grantType = <span class="hljs-string">"authorization_code")
</span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;</p>
<h2>&nbsp;第三方登录模块</h2>
<h3>Abp.Zero 第三方登录机制</h3>
<p>我们先来回顾一下第三方登录在Abp.Zero 中的实现方式</p>
<p>AbpUserLogin表中存储<strong>第三方账户唯一Id</strong>和系统中的User的对应关系，如图</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="13" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/2273b862634947839deea77b229cf24e.png" alt="" width="644" height="135" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/2273b862634947839deea77b229cf24e.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F2273b862634947839deea77b229cf24e.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22644%22%2C%22height%22%3A%22135%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片">编辑</span></span></span></span></p>
<p>在登陆时，在ExternalAuthenticate方法中，需要传递<strong>登录凭证</strong>，也就是ProviderAccessCode，这是一个临时凭据，根据它拿到并调用对应Provider的GetUserInfo方法，获取第三方登录信息，包括<strong>第三方账户唯一Id</strong></p>
<p>之后调用GetExternalUserInfo，它会去AbpUserLogin表中根据<strong>第三方账户唯一Id</strong>查找是否有已注册的用户</p>
<p>若有，直接返回这个用户信息；</p>
<p>若没有，则先注册一个用户，插入对应关系。并返回用户。</p>
<p>接下来就是普通登录的流程：验证用户状态，验证密码，插入登录信息等操作。</p>
<h3>编写代码</h3>
<p>appsettings.json中添加微信小程序的配置，配置好AppId和AppSecret</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="12" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22...%5Cn%5Cn%5C%22WeChat%5C%22%3A%20%7B%5Cn%20%20%20%20%5C%22MiniProgram%5C%22%3A%20%7B%5Cn%20%20%20%20%20%20%5C%22Token%5C%22%3A%20%5C%22%5C%22%2C%5Cn%20%20%20%20%20%20%5C%22OpenAppId%5C%22%3A%20%5C%22%5C%22%2C%5Cn%20%20%20%20%20%20%5C%22AppId%5C%22%3A%20%5C%22000000000000000000%5C%22%2C%5Cn%20%20%20%20%20%20%5C%22AppSecret%5C%22%3A%20%5C%22XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX%5C%22%2C%5Cn%20%20%20%20%20%20%5C%22EncodingAesKey%5C%22%3A%20%5C%22%5C%22%5Cn%20%20%20%20%7D%20%20%5Cn%7D%5Cn%5Cn...%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">...

"WeChat": {
    "MiniProgram": {
      "Token": "",
      "OpenAppId": "",
      "AppId": "000000000000000000",
      "AppSecret": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "EncodingAesKey": ""
    }  
}

...</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;</p>
<p>新建一个WeChatAuthProvider 并继承于ExternalAuthProviderApiBase，编写登录</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="11" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20internal%20class%20WeChatAuthProvider%20%3A%20ExternalAuthProviderApiBase%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20private%20readonly%20LoginService%20loginService%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20WeChatAuthProvider(LoginService%20loginService)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.loginService%20%3D%20loginService%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20override%20async%20Task%3CExternalAuthUserInfo%3E%20GetUserInfo(string%20accessCode)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20result%20%3D%20new%20ExternalAuthUserInfo()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20weChatLoginResult%20%3D%20await%20loginService.Code2SessionAsync(accessCode)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%E5%B0%8F%E7%A8%8B%E5%BA%8F%E8%B0%83%E7%94%A8%E8%8E%B7%E5%8F%96token%E6%8E%A5%E5%8F%A3%20https%3A%2F%2Fapi.weixin.qq.com%2Fcgi-bin%2Ftoken%20%E8%BF%94%E5%9B%9E%E7%9A%84token%E5%80%BC%E6%97%A0%E6%B3%95%E7%94%A8%E4%BA%8E%E7%BD%91%E9%A1%B5%E6%8E%88%E6%9D%83%E6%8E%A5%E5%8F%A3%EF%BC%81%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2Ftips%EF%BC%9Ahttps%3A%2F%2Fwww.cnblogs.com%2Fremon%2Fp%2F6420418.html%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2Fvar%20userInfo%20%3D%20await%20loginService.GetUserInfoAsync(weChatLoginResult.OpenId)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20seed%20%3D%20Guid.NewGuid().ToString(%5C%22N%5C%22).Substring(0%2C%207)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20result.Name%20%3D%20seed%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20result.UserName%20%3D%20seed%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20result.Surname%20%3D%20%5C%22%E5%BE%AE%E4%BF%A1%E7%94%A8%E6%88%B7%5C%22%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20result.ProviderKey%20%3D%20weChatLoginResult.OpenId%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20result.Provider%20%3D%20nameof(WeChatAuthProvider)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20result%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">internal <span class="hljs-keyword">class <span class="hljs-title">WeChatAuthProvider : <span class="hljs-title">ExternalAuthProviderApiBase
    {
        <span class="hljs-keyword">private <span class="hljs-keyword">readonly LoginService loginService;

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">WeChatAuthProvider(<span class="hljs-params">LoginService loginService)
        {
            <span class="hljs-keyword">this.loginService = loginService;
        }

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">override <span class="hljs-keyword">async Task&lt;ExternalAuthUserInfo&gt; <span class="hljs-title">GetUserInfo(<span class="hljs-params"><span class="hljs-built_in">string accessCode)
        {

            <span class="hljs-keyword">var result = <span class="hljs-keyword">new ExternalAuthUserInfo();
            <span class="hljs-keyword">var weChatLoginResult = <span class="hljs-keyword">await loginService.Code2SessionAsync(accessCode);

            <span class="hljs-comment">//小程序调用获取token接口 https://api.weixin.qq.com/cgi-bin/token 返回的token值无法用于网页授权接口！
            <span class="hljs-comment">//tips：https://www.cnblogs.com/remon/p/6420418.html
            <span class="hljs-comment">//var userInfo = await loginService.GetUserInfoAsync(weChatLoginResult.OpenId);

            <span class="hljs-keyword">var seed = Guid.NewGuid().ToString(<span class="hljs-string">"N").Substring(<span class="hljs-number">0, <span class="hljs-number">7);

            result.Name = seed;
            result.UserName = seed;
            result.Surname = <span class="hljs-string">"微信用户";
            result.ProviderKey = weChatLoginResult.OpenId;
            result.Provider = <span class="hljs-keyword">nameof(WeChatAuthProvider);

            <span class="hljs-keyword">return result;
        }
    }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;WebCore项目中，将WeChatAuthProvider 注册到Abp.Zero第三方登录的Providers中</p>
<p>微信的AppId和AppSecret分别对应ClientId，ClientSecret</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="10" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20private%20void%20ConfigureExternalAuth()%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20IocManager.Register%3CIExternalAuthConfiguration%2C%20ExternalAuthConfiguration%3E()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20externalAuthConfiguration%20%3D%20IocManager.Resolve%3CIExternalAuthConfiguration%3E()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20appId%20%3D%20_appConfiguration%5B%5C%22WeChat%3AMiniProgram%3AAppId%5C%22%5D%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20appSecret%20%3D%20_appConfiguration%5B%5C%22WeChat%3AMiniProgram%3AAppSecret%5C%22%5D%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20externalAuthConfiguration.Providers.Add(new%20ExternalLoginProviderInfo(%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20nameof(WeChatAuthProvider)%2C%20appId%2C%20appSecret%2C%20typeof(WeChatAuthProvider))%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">   <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">void <span class="hljs-title">ConfigureExternalAuth()
        {

            IocManager.Register&lt;IExternalAuthConfiguration, ExternalAuthConfiguration&gt;();
            <span class="hljs-keyword">var externalAuthConfiguration = IocManager.Resolve&lt;IExternalAuthConfiguration&gt;();
            <span class="hljs-keyword">var appId = _appConfiguration[<span class="hljs-string">"WeChat:MiniProgram:AppId"];
            <span class="hljs-keyword">var appSecret = _appConfiguration[<span class="hljs-string">"WeChat:MiniProgram:AppSecret"];
            externalAuthConfiguration.Providers.Add(<span class="hljs-keyword">new ExternalLoginProviderInfo(
                <span class="hljs-keyword">nameof(WeChatAuthProvider), appId, appSecret, <span class="hljs-keyword">typeof(WeChatAuthProvider))
                );
           
             );
        }</span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>改写TokenAuthController.cs&nbsp;中的ExternalAuthenticate方法</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="9" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20%20%20%20%20private%20async%20Task%3CExternalAuthenticateResultModel%3E%20ExternalAuthenticate(ExternalAuthenticateModel%20model)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20externalUser%20%3D%20await%20GetExternalUserInfo(model)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%E5%B0%86openId%E4%BC%A0%E7%BB%99ProviderKey%5Cn%20%20%20%20%20%20%20%20%20%20%20%20model.ProviderKey%20%3D%20externalUser.ProviderKey%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20loginResult%20%3D%20await%20_logInManager.LoginAsync(new%20UserLoginInfo(model.AuthProvider%2C%20model.ProviderKey%2C%20model.AuthProvider)%2C%20GetTenancyNameOrNull())%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20switch%20(loginResult.Result)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20case%20AbpLoginResultType.Success%3A%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20accessToken%20%3D%20CreateAccessToken(CreateJwtClaims(loginResult.Identity))%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20new%20ExternalAuthenticateResultModel%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20AccessToken%20%3D%20accessToken%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20EncryptedAccessToken%20%3D%20GetEncryptedAccessToken(accessToken)%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20ExpireInSeconds%20%3D%20(int)_configuration.Expiration.TotalSeconds%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20case%20AbpLoginResultType.UnknownExternalLogin%3A%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20newUser%20%3D%20await%20RegisterExternalUserAsync(externalUser)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!newUser.IsActive)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20new%20ExternalAuthenticateResultModel%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20WaitingForActivation%20%3D%20true%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Try%20to%20login%20again%20with%20newly%20registered%20user!%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20loginResult%20%3D%20await%20_logInManager.LoginAsync(new%20UserLoginInfo(model.AuthProvider%2C%20model.ProviderKey%2C%20model.AuthProvider)%2C%20GetTenancyNameOrNull())%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(loginResult.Result%20!%3D%20AbpLoginResultType.Success)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20_abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20loginResult.Result%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20model.ProviderKey%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20GetTenancyNameOrNull()%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20new%20ExternalAuthenticateResultModel%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20AccessToken%20%3D%20CreateAccessToken(CreateJwtClaims(loginResult.Identity))%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20ExpireInSeconds%20%3D%20(int)_configuration.Expiration.TotalSeconds%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20default%3A%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20_abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20loginResult.Result%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20model.ProviderKey%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20GetTenancyNameOrNull()%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">        <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">async Task&lt;ExternalAuthenticateResultModel&gt; <span class="hljs-title">ExternalAuthenticate(<span class="hljs-params">ExternalAuthenticateModel model)
        {
            <span class="hljs-keyword">var externalUser = <span class="hljs-keyword">await GetExternalUserInfo(model);

            <span class="hljs-comment">//将openId传给ProviderKey
            model.ProviderKey = externalUser.ProviderKey;

            <span class="hljs-keyword">var loginResult = <span class="hljs-keyword">await _logInManager.LoginAsync(<span class="hljs-keyword">new UserLoginInfo(model.AuthProvider, model.ProviderKey, model.AuthProvider), GetTenancyNameOrNull());

            <span class="hljs-keyword">switch (loginResult.Result)
            {
                <span class="hljs-keyword">case AbpLoginResultType.Success:
                    {
                        <span class="hljs-keyword">var accessToken = CreateAccessToken(CreateJwtClaims(loginResult.Identity));
                        <span class="hljs-keyword">return <span class="hljs-keyword">new ExternalAuthenticateResultModel
                        {
                            AccessToken = accessToken,
                            EncryptedAccessToken = GetEncryptedAccessToken(accessToken),
                            ExpireInSeconds = (<span class="hljs-built_in">int)_configuration.Expiration.TotalSeconds
                        };
                    }
                <span class="hljs-keyword">case AbpLoginResultType.UnknownExternalLogin:
                    {
                        <span class="hljs-keyword">var newUser = <span class="hljs-keyword">await RegisterExternalUserAsync(externalUser);
                        <span class="hljs-keyword">if (!newUser.IsActive)
                        {
                            <span class="hljs-keyword">return <span class="hljs-keyword">new ExternalAuthenticateResultModel
                            {
                                WaitingForActivation = <span class="hljs-literal">true
                            };
                        }

                        <span class="hljs-comment">// Try to login again with newly registered user!
                        loginResult = <span class="hljs-keyword">await _logInManager.LoginAsync(<span class="hljs-keyword">new UserLoginInfo(model.AuthProvider, model.ProviderKey, model.AuthProvider), GetTenancyNameOrNull());
                        <span class="hljs-keyword">if (loginResult.Result != AbpLoginResultType.Success)
                        {
                            <span class="hljs-keyword">throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(
                                loginResult.Result,
                                model.ProviderKey,
                                GetTenancyNameOrNull()
                            );
                        }

                        <span class="hljs-keyword">return <span class="hljs-keyword">new ExternalAuthenticateResultModel
                        {
                            AccessToken = CreateAccessToken(CreateJwtClaims(loginResult.Identity)),
                            ExpireInSeconds = (<span class="hljs-built_in">int)_configuration.Expiration.TotalSeconds
                        };
                    }
                <span class="hljs-literal">default:
                    {
                        <span class="hljs-keyword">throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(
                            loginResult.Result,
                            model.ProviderKey,
                            GetTenancyNameOrNull()
                        );
                    }
            }
        }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;改写TokenAuthController.cs&nbsp;中的GetExternalUserInfo方法</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20private%20async%20Task%3CExternalAuthUserInfo%3E%20GetExternalUserInfo(ExternalAuthenticateModel%20model)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20userInfo%20%3D%20await%20_externalAuthManager.GetUserInfo(model.AuthProvider%2C%20model.ProviderAccessCode)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2Fif%20(userInfo.ProviderKey%20!%3D%20model.ProviderKey)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%20%20%20throw%20new%20UserFriendlyException(L(%5C%22CouldNotValidateExternalUser%5C%22))%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20userInfo%3B%5Cn%20%20%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"> <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">async Task&lt;ExternalAuthUserInfo&gt; <span class="hljs-title">GetExternalUserInfo(<span class="hljs-params">ExternalAuthenticateModel model)
        {
            <span class="hljs-keyword">var userInfo = <span class="hljs-keyword">await _externalAuthManager.GetUserInfo(model.AuthProvider, model.ProviderAccessCode);
            <span class="hljs-comment">//if (userInfo.ProviderKey != model.ProviderKey)
            <span class="hljs-comment">//{
            <span class="hljs-comment">//    throw new UserFriendlyException(L("CouldNotValidateExternalUser"));
            <span class="hljs-comment">//}

            <span class="hljs-keyword">return userInfo;
        }</span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h2>鉴权状态验证模块</h2>
<p>整个鉴权登录的过程我们需要维护鉴权状态（Status），在获取到<strong>登录凭证</strong>AccessCode&nbsp;后及时写入值。</p>
<p>鉴权状态将有：</p>
<p><strong>CREATED</strong>:&nbsp; 已建立，等待用户扫码</p>
<p><strong>ACCESSED</strong>: 已扫码，等待用户确认授权</p>
<p><strong>AUTHORIZED</strong>: 已授权完成</p>
<p><strong>EXPIRED</strong>: 小程序码过期，已失效</p>
<p>我们需要建立一个缓存，来存储上述值</p>
<p>建立WechatMiniappLoginTokenCacheItem， 分别创建Status属性和ProviderAccessCode&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20class%20WechatMiniappLoginTokenCacheItem%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20string%20Status%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20ProviderAccessCode%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">WechatMiniappLoginTokenCacheItem
    {
        <span class="hljs-keyword">public <span class="hljs-built_in">string Status { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string ProviderAccessCode { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
    }</span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>建立缓存类型WechatMiniappLoginTokenCache。</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20class%20WechatMiniappLoginTokenCache%20%3A%20MemoryCacheBase%3CWechatMiniappLoginTokenCacheItem%3E%2C%20ISingletonDependency%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20WechatMiniappLoginTokenCache()%20%3A%20base(nameof(WechatMiniappLoginTokenCache))%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">WechatMiniappLoginTokenCache : <span class="hljs-title">MemoryCacheBase&lt;<span class="hljs-title">WechatMiniappLoginTokenCacheItem&gt;, <span class="hljs-title">ISingletonDependency
    {
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">WechatMiniappLoginTokenCache() : <span class="hljs-title">base(<span class="hljs-params"><span class="hljs-keyword">nameof(WechatMiniappLoginTokenCache))
        {

        }
    }</span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>在Domain项目中新建MiniappManager类作为领域服务，并注入ACodeService微信小程序码生成服务 和WechatMiniappLoginTokenCache缓存对象</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20public%20class%20MiniappManager%20%3A%20DomainService%5Cn%20%20%20%20%7B%5Cn%5Cn%20%20%20%20%20%20%20%20private%20readonly%20ACodeService%20aCodeService%3B%5Cn%20%20%20%20%20%20%20%20private%20readonly%20WechatMiniappLoginTokenCache%20wechatMiniappLoginTokenCache%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20MiniappManager(ACodeService%20aCodeService%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20WechatMiniappLoginTokenCache%20wechatMiniappLoginTokenCache)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.aCodeService%3DaCodeService%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.wechatMiniappLoginTokenCache%3DwechatMiniappLoginTokenCache%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20...%5Cn%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"> <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">MiniappManager : <span class="hljs-title">DomainService
    {

        <span class="hljs-keyword">private <span class="hljs-keyword">readonly ACodeService aCodeService;
        <span class="hljs-keyword">private <span class="hljs-keyword">readonly WechatMiniappLoginTokenCache wechatMiniappLoginTokenCache;

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">MiniappManager(<span class="hljs-params">ACodeService aCodeService,
            WechatMiniappLoginTokenCache wechatMiniappLoginTokenCache)
        {
            <span class="hljs-keyword">this.aCodeService=aCodeService;
            <span class="hljs-keyword">this.wechatMiniappLoginTokenCache=wechatMiniappLoginTokenCache;
        }

        ...

}</span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;</p>
<p>分别建立SetTokenAsync，GetTokenAsync和CheckTokenAsync，分别用于设置Token对应值，获取Token对应值和Token对应值合法性校验</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20public%20virtual%20async%20Task%3CWechatMiniappLoginTokenCacheItem%3E%20GetTokenAsync(string%20token)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20cacheItem%20%3D%20await%20wechatMiniappLoginTokenCache.GetAsync(token%2C%20null)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20cacheItem%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20public%20virtual%20async%20Task%20SetTokenAsync(string%20token%2C%20string%20status%2C%20string%20providerAccessCode%2C%20bool%20isCheckToken%20%3D%20true%2C%20DateTimeOffset%3F%20absoluteExpireTime%20%3D%20null)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(isCheckToken)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20await%20this.CheckTokenAsync(token)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20await%20wechatMiniappLoginTokenCache.SetAsync(token%2C%20new%20WechatMiniappLoginTokenCacheItem()%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Status%3Dstatus%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20ProviderAccessCode%3DproviderAccessCode%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20absoluteExpireTime%3A%20absoluteExpireTime)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20public%20virtual%20async%20Task%20CheckTokenAsync(string%20token)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20cacheItem%20%3D%20await%20wechatMiniappLoginTokenCache.GetAsync(token%2C%20null)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(cacheItem%20%3D%3D%20null)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20new%20UserFriendlyException(%5C%22WechatMiniappLoginInvalidToken%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%5C%22%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%99%BB%E5%BD%95Token%E4%B8%8D%E5%90%88%E6%B3%95%5C%22)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20else%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(cacheItem.Status%3D%3D%5C%22AUTHORIZED%5C%22)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20new%20UserFriendlyException(%5C%22WechatMiniappLoginInvalidToken%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%5C%22%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%99%BB%E5%BD%95Token%E5%B7%B2%E5%A4%B1%E6%95%88%5C%22)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"> <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">virtual <span class="hljs-keyword">async Task&lt;WechatMiniappLoginTokenCacheItem&gt; <span class="hljs-title">GetTokenAsync(<span class="hljs-params"><span class="hljs-built_in">string token)
        {
            <span class="hljs-keyword">var cacheItem = <span class="hljs-keyword">await wechatMiniappLoginTokenCache.GetAsync(token, <span class="hljs-literal">null);
            <span class="hljs-keyword">return cacheItem;
        }


        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">virtual <span class="hljs-keyword">async Task <span class="hljs-title">SetTokenAsync(<span class="hljs-params"><span class="hljs-built_in">string token, <span class="hljs-built_in">string status, <span class="hljs-built_in">string providerAccessCode, <span class="hljs-built_in">bool isCheckToken = <span class="hljs-literal">true, DateTimeOffset? absoluteExpireTime = <span class="hljs-literal">null)
        {
            <span class="hljs-keyword">if (isCheckToken)
            {
                <span class="hljs-keyword">await <span class="hljs-keyword">this.CheckTokenAsync(token);

            }
            <span class="hljs-keyword">await wechatMiniappLoginTokenCache.SetAsync(token, <span class="hljs-keyword">new WechatMiniappLoginTokenCacheItem()
            {
                Status=status,
                ProviderAccessCode=providerAccessCode
            }, absoluteExpireTime: absoluteExpireTime);
        }



        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">virtual <span class="hljs-keyword">async Task <span class="hljs-title">CheckTokenAsync(<span class="hljs-params"><span class="hljs-built_in">string token)
        {
            <span class="hljs-keyword">var cacheItem = <span class="hljs-keyword">await wechatMiniappLoginTokenCache.GetAsync(token, <span class="hljs-literal">null);

            <span class="hljs-keyword">if (cacheItem == <span class="hljs-literal">null)
            {
                <span class="hljs-keyword">throw <span class="hljs-keyword">new UserFriendlyException(<span class="hljs-string">"WechatMiniappLoginInvalidToken",
            <span class="hljs-string">"微信小程序登录Token不合法");
            }
            <span class="hljs-keyword">else
            {
                <span class="hljs-keyword">if (cacheItem.Status==<span class="hljs-string">"AUTHORIZED")
                {
                    <span class="hljs-keyword">throw <span class="hljs-keyword">new UserFriendlyException(<span class="hljs-string">"WechatMiniappLoginInvalidToken",
           <span class="hljs-string">"微信小程序登录Token已失效");
                }
            }
        }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;</p>
<p>编写GetACodeAsync，生成微信小程序码</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22public%20async%20Task%3Cbyte%5B%5D%3E%20GetACodeAsync(string%20token%2C%20string%20page%2C%20DateTimeOffset%3F%20absoluteExpireTime%20%3D%20null)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20await%20wechatMiniappLoginTokenCache.SetAsync(token%2C%20new%20WechatMiniappLoginTokenCacheItem()%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Status%3D%5C%22CREATED%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20absoluteExpireTime%3A%20absoluteExpireTime)%3B%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20result%20%3D%20await%20aCodeService.GetUnlimitedACodeAsync(token%2C%20page)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20result.BinaryData%3B%5Cn%20%20%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">public <span class="hljs-keyword">async Task&lt;<span class="hljs-built_in">byte[]&gt; GetACodeAsync(<span class="hljs-built_in">string token, <span class="hljs-built_in">string page, DateTimeOffset? absoluteExpireTime = <span class="hljs-literal">null)
        {

            <span class="hljs-keyword">await wechatMiniappLoginTokenCache.SetAsync(token, <span class="hljs-keyword">new WechatMiniappLoginTokenCacheItem()
            {
                Status=<span class="hljs-string">"CREATED",
            },
            absoluteExpireTime: absoluteExpireTime);


            <span class="hljs-keyword">var result = <span class="hljs-keyword">await aCodeService.GetUnlimitedACodeAsync(token, page);

            <span class="hljs-keyword">return result.BinaryData;
        }</span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>生成后会将Token值写入缓存，此时状态为CREATED，对应的页面为&ldquo;已扫码&rdquo;</p>
<p>之后以byte[]方式返回小程序码图片</p>
<h2>编写Api接口</h2>
<p>在Application项目中新建MiniappAppService&nbsp;类作为领域服务，并注入MiniappManager对象</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20%5BAbpAllowAnonymous%5D%5Cn%20%20%20%20%2F%2F%5BAbpAuthorize(PermissionNames.Pages_Wechat)%5D%5Cn%20%20%20%20public%20class%20MiniappAppService%20%3A%20AppServiceBase%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20static%20TimeSpan%20TokenCacheDuration%20%3D%20TimeSpan.FromMinutes(5)%3B%5Cn%20%20%20%20%20%20%20%20public%20static%20TimeSpan%20AuthCacheDuration%20%3D%20TimeSpan.FromMinutes(5)%3B%5Cn%20%20%20%20%20%20%20%20private%20readonly%20MiniappManager%20miniappManager%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20MiniappAppService(MiniappManager%20miniappManager)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.miniappManager%3DminiappManager%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20...%5Cn%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    [<span class="hljs-meta">AbpAllowAnonymous]
    <span class="hljs-comment">//[AbpAuthorize(PermissionNames.Pages_Wechat)]
    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">MiniappAppService : <span class="hljs-title">AppServiceBase
    {
        <span class="hljs-keyword">public <span class="hljs-keyword">static TimeSpan TokenCacheDuration = TimeSpan.FromMinutes(<span class="hljs-number">5);
        <span class="hljs-keyword">public <span class="hljs-keyword">static TimeSpan AuthCacheDuration = TimeSpan.FromMinutes(<span class="hljs-number">5);
        <span class="hljs-keyword">private <span class="hljs-keyword">readonly MiniappManager miniappManager;

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">MiniappAppService(<span class="hljs-params">MiniappManager miniappManager)
        {
            <span class="hljs-keyword">this.miniappManager=miniappManager;
        }

        ...
    }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>编写各方法</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20%20%20%20%20%5BHttpGet%5D%5Cn%20%20%20%20%20%20%20%20%5BWrapResult(WrapOnSuccess%20%3D%20false%2C%20WrapOnError%20%3D%20false)%5D%5Cn%20%20%20%20%20%20%20%20public%20async%20Task%3CIActionResult%3E%20GetACodeAsync(GetACodeAsyncInput%20input)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20mode%20%3D%20input.Mode%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20result%20%3D%20await%20miniappManager.GetACodeAsync(input.Scene%2C%20input.Page%2C%20DateTimeOffset.Now.Add(TokenCacheDuration))%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20new%20FileContentResult(result%2C%20MimeTypeNames.ImagePng)%3B%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%5BHttpGet%5D%5Cn%20%20%20%20%20%20%20%20%5BAbpAllowAnonymous%5D%5Cn%20%20%20%20%20%20%20%20public%20virtual%20async%20Task%3CWechatMiniappLoginTokenCacheItem%3E%20GetTokenAsync(string%20token)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20cacheItem%20%3D%20await%20miniappManager.GetTokenAsync(token)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20cacheItem%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%5BAbpAllowAnonymous%5D%5Cn%20%20%20%20%20%20%20%20public%20virtual%20async%20Task%20AccessAsync(string%20token)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20await%20miniappManager.SetTokenAsync(token%2C%20%5C%22ACCESSED%5C%22%2C%20null%2C%20true%2C%20DateTimeOffset.Now.Add(AuthCacheDuration))%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%5BAbpAllowAnonymous%5D%5Cn%20%20%20%20%20%20%20%20public%20virtual%20async%20Task%20AuthenticateAsync(ChangeStatusInput%20input)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20await%20miniappManager.SetTokenAsync(input.Token%2C%20%5C%22AUTHORIZED%5C%22%2C%20input.ProviderAccessCode%2C%20true%2C%20DateTimeOffset.Now.Add(TimeSpan.FromMinutes(1)))%3B%5Cn%20%20%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">        [<span class="hljs-meta">HttpGet]
        [<span class="hljs-meta">WrapResult(WrapOnSuccess = false, WrapOnError = false)]
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">async Task&lt;IActionResult&gt; <span class="hljs-title">GetACodeAsync(<span class="hljs-params">GetACodeAsyncInput input)
        {
            <span class="hljs-keyword">var mode = input.Mode;

            <span class="hljs-keyword">var result = <span class="hljs-keyword">await miniappManager.GetACodeAsync(input.Scene, input.Page, DateTimeOffset.Now.Add(TokenCacheDuration));

            <span class="hljs-keyword">return <span class="hljs-keyword">new FileContentResult(result, MimeTypeNames.ImagePng);


        }

        [<span class="hljs-meta">HttpGet]
        [<span class="hljs-meta">AbpAllowAnonymous]
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">virtual <span class="hljs-keyword">async Task&lt;WechatMiniappLoginTokenCacheItem&gt; <span class="hljs-title">GetTokenAsync(<span class="hljs-params"><span class="hljs-built_in">string token)
        {
            <span class="hljs-keyword">var cacheItem = <span class="hljs-keyword">await miniappManager.GetTokenAsync(token);
            <span class="hljs-keyword">return cacheItem;
        }




        [<span class="hljs-meta">AbpAllowAnonymous]
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">virtual <span class="hljs-keyword">async Task <span class="hljs-title">AccessAsync(<span class="hljs-params"><span class="hljs-built_in">string token)
        {
            <span class="hljs-keyword">await miniappManager.SetTokenAsync(token, <span class="hljs-string">"ACCESSED", <span class="hljs-literal">null, <span class="hljs-literal">true, DateTimeOffset.Now.Add(AuthCacheDuration));
        }

        [<span class="hljs-meta">AbpAllowAnonymous]
        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">virtual <span class="hljs-keyword">async Task <span class="hljs-title">AuthenticateAsync(<span class="hljs-params">ChangeStatusInput input)
        {
            <span class="hljs-keyword">await miniappManager.SetTokenAsync(input.Token, <span class="hljs-string">"AUTHORIZED", input.ProviderAccessCode, <span class="hljs-literal">true, DateTimeOffset.Now.Add(TimeSpan.FromMinutes(<span class="hljs-number">1)));
        }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>GetACodeAsync：获取小程序码Api，</p>
<p>GetTokenAsync：获取Token对应值Api，</p>
<p>AccessAsync：已扫码调用的Api，</p>
<p>AuthenticateAsync：已授权调用的Api，</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/8d4a8e83eba9479495de76de10b281f9.png" alt="" width="1046" height="291" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/8d4a8e83eba9479495de76de10b281f9.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F8d4a8e83eba9479495de76de10b281f9.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%221046%22%2C%22height%22%3A%22291%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110510468-1149094486.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片">编辑</span></span></span></span></p>
<p>&nbsp;</p>
<p>至此，完成了所有服务端接口</p>
<span data-cke-copybin-start="1"><span data-cke-copybin-end="1">​</span></span>