---
thumbnail: images/0d66ca2a6fab450fb77a26a791d75c0a.png
title: 使用 Abp.Zero 搭建第三方登录模块（一）：原理篇
excerpt: >-
  第三方登录是基于用户在第三方平台上（如微信，QQ，
  百度）已有的账号来快速完成系统的登录、注册-登录等功能。以微信的鉴权为例：假如你的网站有一个扫码登录的功能，会弹出一个由微信提供的二维码页面，你需要用手机上的微信扫码，操作一下，就可以完成登录。如这个链接：微信登录
  (qq.com) 
  嗯。从研发和使用上来说这是最快捷，也是目前大部分站点用的扫码登录方式。但这个是依赖于微信开放平台的功能，微信作为鉴权服务的提供方，有义务监管第三方的网站（你的网站相对于微信就是第三方），因此你需要有企业或组织的营业执照，经过
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
uniqueId: '2022-06-24 11:07:00/使用 Abp.Zero 搭建第三方登录模块（一）：原理篇.html'
abbrlink: d8ce29b2
date: 2022-06-24 11:07:00
cover:
description:
---
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1">这是一篇系列博文，我将从原理分析、设计到代码编写，搭建一套基于微信小程序登录的网站第三方登录模块：</span></span></p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1"><a href="https://www.cnblogs.com/jevonsflash/p/16408081.html">使用 Abp.Zero 搭建第三方登录模块（一）：原理篇 - 林晓lx - 博客园 (cnblogs.com)</a></span></span></p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1"><a href="https://www.cnblogs.com/jevonsflash/p/16408071.html">使用 Abp.Zero 搭建第三方登录模块（二）：服务端开发 - 林晓lx - 博客园 (cnblogs.com)</a></span></span></p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1"><a href="https://www.cnblogs.com/jevonsflash/p/16494824.html">使用 Abp.Zero 搭建第三方登录模块（三）：网页端开发 - 林晓lx - 博客园 (cnblogs.com)</a></span></span></p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1"><a href="https://www.cnblogs.com/jevonsflash/p/16494848.html">使用 Abp.Zero 搭建第三方登录模块（四）：微信小程序开发 - 林晓lx - 博客园 (cnblogs.com)</a>​</span></span></p>
<p><span><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719171324586-1554700978.png" alt="" loading="lazy" /></span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p><span id="cke_bm_886S">第三方登录是基于用户在第三方平台上（如微信，QQ， 百度）已有的账号来快速完成系统的登录、注册-登录等功能。</span></p>
<h2>微信的鉴权</h2>
<p>以微信的鉴权为例：</p>
<p>假如你的网站有一个扫码登录的功能，会弹出一个由微信提供的二维码页面，你需要用手机上的微信扫码，操作一下，就可以完成登录。如这个链接：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="微信登录 (qq.com)" href="https://open.weixin.qq.com/connect/qrconnect?appid=wxbdc5610cc59c1631&amp;redirect_uri=https%3A%2F%2Fpassport.yhd.com%2Fwechat%2Fcallback.do&amp;response_type=code&amp;scope=snsapi_login&amp;state=72030e82406805350b520d8380792ec6#wechat_redirect" data-cke-enter-mode="2" data-cke-saved-href="https://open.weixin.qq.com/connect/qrconnect?appid=wxbdc5610cc59c1631&amp;redirect_uri=https%3A%2F%2Fpassport.yhd.com%2Fwechat%2Fcallback.do&amp;response_type=code&amp;scope=snsapi_login&amp;state=72030e82406805350b520d8380792ec6#wechat_redirect" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fopen.weixin.qq.com%2Fconnect%2Fqrconnect%3Fappid%3Dwxbdc5610cc59c1631%26redirect_uri%3Dhttps%253A%252F%252Fpassport.yhd.com%252Fwechat%252Fcallback.do%26response_type%3Dcode%26scope%3Dsnsapi_login%26state%3D72030e82406805350b520d8380792ec6%23wechat_redirect%22%2C%22text%22%3A%22%E5%BE%AE%E4%BF%A1%E7%99%BB%E5%BD%95%20(qq.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.4%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM5H6%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.4%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM5H6%22%2C%22id%22%3A%22AbmcrM-1656039946584%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.4/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M5H6" data-link-title="微信登录 (qq.com)" data-widget="csdnlink">微信登录 (qq.com)</a></span></p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/93337c1c8c9b43598fabaad30fd1a52f.jpeg" alt="" width="166" height="359" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/93337c1c8c9b43598fabaad30fd1a52f.jpeg" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F93337c1c8c9b43598fabaad30fd1a52f.jpeg%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22166%22%2C%22height%22%3A%22359%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110716551-476355512.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片"><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/0e33b9f7fdd240afa31d4a273f76cb58.png" alt="" width="507" height="363" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/0e33b9f7fdd240afa31d4a273f76cb58.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F0e33b9f7fdd240afa31d4a273f76cb58.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22507%22%2C%22height%22%3A%22363%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110716551-476355512.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片"><br /></span></span></span></span></span></span></span></span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>嗯。从研发和使用上来说这是最快捷，也是目前大部分站点用的扫码登录方式。但这个是依赖于微信开放平台的功能，微信作为鉴权服务的提供方，有义务监管第三方的网站（你的网站相对于微信就是第三方），因此你需要有企业或组织的营业执照，经过认证，才有资格申请这个功能。（听说认证还需要交钱，OMG）</p>
<p>对于个人来说，这显然不是一个可行的方式。</p>
<p>那么我们还有两个选择：</p>
<p>1. 微信公众号鉴权：你的网页在微信客户端中被访问，通过跳转至鉴权链接，弹出一个鉴权页面，操作一下即可完成登录，请阅读官方文档<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="网页授权 | 微信开放文档 (qq.com)" href="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html" data-cke-enter-mode="2" data-cke-saved-href="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fdevelopers.weixin.qq.com%2Fdoc%2Foffiaccount%2FOA_Web_Apps%2FWechat_webpage_authorization.html%22%2C%22text%22%3A%22%E7%BD%91%E9%A1%B5%E6%8E%88%E6%9D%83%20%7C%20%E5%BE%AE%E4%BF%A1%E5%BC%80%E6%94%BE%E6%96%87%E6%A1%A3%20(qq.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.4%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM5H6%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.4%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM5H6%22%2C%22id%22%3A%22IOwxoO-1656039946582%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.4/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M5H6" data-link-title="网页授权 | 微信开放文档 (qq.com)" data-widget="csdnlink">网页授权 | 微信开放文档 (qq.com)</a></span></p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1">
<p class="img-center cke_widget_element" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fimg_convert%2F95dc7f90c14b233d60e50a648433d417.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22%22%2C%22height%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22center%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image"><span class="cke_image_resizer_wrapper"><img src="https://img-blog.csdnimg.cn/img_convert/95dc7f90c14b233d60e50a648433d417.png" alt="" data-cke-saved-src="https://img-blog.csdnimg.cn/img_convert/95dc7f90c14b233d60e50a648433d417.png" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></p>


</div>
<p>&nbsp;</p>
<p>这是不需要认证的，我认为从微信的角度来说，微信客户端的浏览器控件作为集成在微信里的功能，有能力把控鉴权链接是从已在微信后台登记的合法域名跳转的，但是你的网站仍然要备案和走https协议</p>
<p>2. 微信小程序鉴权：这与微信公众号鉴权类似，区别是微信小程序SDK提供了登录功能，小程序不需要认证，可获取用信息，&nbsp;请阅读官方文档<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="wx.login(Object object) | 微信开放文档 (qq.com)" href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html" data-cke-enter-mode="2" data-cke-saved-href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fdevelopers.weixin.qq.com%2Fminiprogram%2Fdev%2Fapi%2Fopen-api%2Flogin%2Fwx.login.html%22%2C%22text%22%3A%22wx.login(Object%20object)%20%7C%20%E5%BE%AE%E4%BF%A1%E5%BC%80%E6%94%BE%E6%96%87%E6%A1%A3%20(qq.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.4%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM5H6%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.4%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM5H6%22%2C%22id%22%3A%22bcQXUG-1656039946581%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.4/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M5H6" data-link-title="wx.login(Object object) | 微信开放文档 (qq.com)" data-widget="csdnlink">wx.login(Object object) | 微信开放文档 (qq.com)</a></span></p>
<h2>第三方登录的流程</h2>
<p>首先用户通过主动的确认授权，第三方平台会生成一个登录凭证，根据第三方平台的<strong>用户凭证</strong>，&nbsp;<strong>登录凭证</strong>，返回<strong>会话令牌</strong>和用户在<strong>第三方账号的唯一Id</strong>，令牌用于获取第三方平台的账号信息，比如头像，昵称，地址，电话号码等，如果用户是第一次登录，则可以用这些账号信息建立一个系统账号。</p>
<p>登录凭证和令牌，都具有时效性</p>
<p>在微信鉴权中，相关的概念的具体为：</p>
<ul>
<li>登录凭证：Code</li>
<li>会话令牌：SessionKey</li>
<li>账号的唯一Id：OpenId</li>
<li>用户凭证：AppId、AppSecret</li>


</ul>
<p>&nbsp;</p>
<p>思考如何实现自己的登录逻辑：</p>
<p>公众号的登录页面，和微信小程序可以通过扫码作为入口。再通过我们自己后端的鉴权服务，类似如下的流程</p>
<ol>
<li>点击网页微信小程序登录，网页生成一个Token，调用getwxacode()接口，将scene设置为Token值，page设置为小程序鉴权页面，生成小程序码。</li>
<li>用户使用微信客户端扫码，进入小程序鉴权页面，从参数获取 scene（就是 Token)，并调用后端接口，将Token作为Key记录至服务端Cache（Key/Value）中</li>
<li>用户在小程序中点击同意登录，调用&nbsp;wx.login() 获取 Code，并调用后端接口，将该Code值录入到以Token为Key的Value中</li>
<li>与此同时网页在轮询调用查询Cache条目的接口，一旦获取到Token对应的Code值，表明完成授权</li>
<li>网页调用第三方登录接口，将Code值传给后端服务作为登录凭证。调用相关微信第三方登录接口，以换取SessionKey，OpenId，再利用SessionKey查询相关头像，昵称，地址，电话等信息返回</li>


</ol>
<p>&nbsp;</p>
<p>用户的操作路径：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/e5ef66e3b520494182060903bd8e3689.png" alt="" width="1200" height="505" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/e5ef66e3b520494182060903bd8e3689.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fe5ef66e3b520494182060903bd8e3689.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%221200%22%2C%22height%22%3A%22505%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220624110716551-476355512.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片"><br /></span></span></span></span></p>
<p>经过对比与思考，我们用调用方式更简单的微信小程序的鉴权方式。后端采用.Net6 +&nbsp;Abp.Zero快速搭建用户系统，利用Abp.Zero集成的第三方登录功能快速实现微信登录。为了节省时间还需要一个现成的微信SDK库。</p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span><span id="cke_bm_468S">为了提升用户体验，界面UI需要清晰的响应各个状态时的静态UI以及状态变化时的及时通知</span></p>
<h2>最终效果</h2>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/3bf47b3e8f484a64b833a4ebd0312ca9.gif" alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/3bf47b3e8f484a64b833a4ebd0312ca9.gif" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F3bf47b3e8f484a64b833a4ebd0312ca9.gif%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22%22%2C%22height%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719194113506-1981661221.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-end="1">&nbsp;</span></span></p>
<p>接下来，开始项目搭建</p>
<p><a href="https://www.cnblogs.com/jevonsflash/p/16408071.html">使用 Abp.Zero 搭建第三方登录模块（二）：服务端开发 - 林晓lx - 博客园 (cnblogs.com)</a></p>