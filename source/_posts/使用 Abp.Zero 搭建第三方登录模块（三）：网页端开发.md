---
thumbnail: images/93bc6239f51c44b8a55cb83702b342e9.png
title: 使用 Abp.Zero 搭建第三方登录模块（三）：网页端开发
excerpt: >-
  在此之前我们需写一个参数传递对象，为了保留一定的扩展能力，data中我们定义loginExternalForms，已经实现的微信小程序登录，则对应的authProvider值为“WeChatAuthProvider”，providerAccessCode则为生成的Token值。上一章，我们介绍了服务端的开发，这次我们需要调用GetACode，GetToken，分别获取小程序码，和获取当前状态。afterLoginSuccess函数用于登录成功后的逻辑，停止计时器，并跳转页面，本实例仅做弹窗提示。......
tags:
  - Vue
  - Html
  - 小程序
  - 微信公众号
categories:
  - JavaScript
  - Web
  - 小程序/公众号
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2022-07-19 17:08:00/使用 Abp.Zero 搭建第三方登录模块（三）：网页端开发.html'
abbrlink: 571d661
date: 2022-07-19 17:08:00
cover:
description:
---
<span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span>简短回顾一下网页端的流程，总的来说网页端的职责有三：<ol>
<li>生成一个随机字符作为鉴权会话的临时Token，</li>
<li>生成一个小程序码， Token作为参数固化于小程序码当中</li>
<li>监控整个鉴权过程状态，一旦状态变为AUTHORIZED（已授权）则获取小程序登录凭证code。调用ExternalAuthenticate完成登录。</li>
</ol>
<p>上一章，我们介绍了服务端的开发，这次我们需要调用GetACode，GetToken，分别获取小程序码，和获取当前状态</p>
<p>首先使用vue-cli创建一个web项目，命名为mp-auth</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="22" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22vue%20create%20mp-auth%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">vue create mp-auth</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>新建ajaxRequest.ts，创建request对象，这一对象将利用axios库发送带有访问凭证的Header的请求</p>
<p>这里使用js-cookie库获取cookie中的访问凭证，并添加到Header中&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="21" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22import%20Cookies%20from%20%5C%22js-cookie%5C%22%3B%5Cnimport%20axios%2C%20%7B%20%20CancelTokenSource%20%7D%20from%20'axios'%5Cn%2F%2F%E5%8F%91%E9%80%81%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%5Cnconst%20tokenKey%20%3D%20%5C%22main_token%5C%22%3B%5Cnconst%20getToken%20%3D%20()%20%3D%3E%20Cookies.get(tokenKey)%3B%5Cn%5Cnexport%20const%20request%20%3D%20async%20(url%3A%20string%2C%20methods%2C%20data%3A%20any%2C%20onProgress%3F%3A%20(e)%20%3D%3E%20void%2C%20cancelToken%3F%3A%20CancelTokenSource)%20%3D%3E%20%7B%5Cn%20%20%20%20let%20token%20%3D%20null%5Cn%20%20%20%20let%20timeout%20%3D%203000%3B%5Cn%20%20%20%20if%20(cancelToken)%20%7B%5Cn%20%20%20%20%20%20%20%20token%20%3D%20cancelToken.token%5Cn%20%20%20%20%20%20%20%20timeout%20%3D%200%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20const%20service%20%3D%20axios.create()%5Cn%20%20%20%20service.interceptors.request.use(%5Cn%20%20%20%20%20%20%20%20(config)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20const%20token%20%3D%20getToken()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Add%20X-Access-Token%20header%20to%20every%20request%2C%20you%20can%20add%20other%20custom%20headers%20here%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(token)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config.headers%5B'X-XSRF-TOKEN'%5D%20%3D%20token%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config.headers%5B'Authorization'%5D%20%3D%20'Bearer%20'%20%2B%20token%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20config%5Cn%20%20%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%20%20%20%20(error)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20Promise.reject(error)%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20)%5Cn%5Cn%20%20%20%20const%20re%20%3D%20await%20service.request(%7B%5Cn%20%20%20%20%20%20%20%20url%3A%20url%2C%5Cn%20%20%20%20%20%20%20%20method%3A%20methods%2C%5Cn%20%20%20%20%20%20%20%20data%3A%20data%2C%5Cn%20%20%20%20%20%20%20%20cancelToken%3A%20token%2C%5Cn%20%20%20%20%20%20%20%20timeout%3A%20timeout%2C%5Cn%20%20%20%20%20%20%20%20onUploadProgress%3A%20function%20(progressEvent)%20%7B%20%2F%2F%E5%8E%9F%E7%94%9F%E8%8E%B7%E5%8F%96%E4%B8%8A%E4%BC%A0%E8%BF%9B%E5%BA%A6%E7%9A%84%E4%BA%8B%E4%BB%B6%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(progressEvent.lengthComputable)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(onProgress)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20onProgress(progressEvent)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%7D)%5Cn%20%20%20%20return%20re%20as%20any%3B%5Cn%7D%5Cn%5Cn%2F%2F%2F%E8%8E%B7%E5%BE%97%E5%8F%96%E6%B6%88%E4%BB%A4%E7%89%8C%5Cnexport%20const%20getCancelToken%20%3D%20()%20%3D%3E%20%7B%5Cn%20%20%20%20const%20source%20%3D%20axios.CancelToken.source()%3B%5Cn%20%20%20%20return%20source%3B%5Cn%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"><span class="hljs-keyword">import <span class="hljs-title class_">Cookies <span class="hljs-keyword">from <span class="hljs-string">"js-cookie";
<span class="hljs-keyword">import axios, {  <span class="hljs-title class_">CancelTokenSource } <span class="hljs-keyword">from <span class="hljs-string">'axios'
<span class="hljs-comment">//发送网络请求
<span class="hljs-keyword">const tokenKey = <span class="hljs-string">"main_token";
<span class="hljs-keyword">const <span class="hljs-title function_">getToken = () =&gt; <span class="hljs-title class_">Cookies.<span class="hljs-title function_">get(tokenKey);

<span class="hljs-keyword">export <span class="hljs-keyword">const request = <span class="hljs-keyword">async (<span class="hljs-attr">url: string, methods, <span class="hljs-attr">data: any, onProgress?: <span class="hljs-function">(<span class="hljs-params">e) =&gt; <span class="hljs-keyword">void, cancelToken?: <span class="hljs-title class_">CancelTokenSource) =&gt; {
    <span class="hljs-keyword">let token = <span class="hljs-literal">null
    <span class="hljs-keyword">let timeout = <span class="hljs-number">3000;
    <span class="hljs-keyword">if (cancelToken) {
        token = cancelToken.<span class="hljs-property">token
        timeout = <span class="hljs-number">0;
    }

    <span class="hljs-keyword">const service = axios.<span class="hljs-title function_">create()
    service.<span class="hljs-property">interceptors.<span class="hljs-property">request.<span class="hljs-title function_">use(
        <span class="hljs-function">(<span class="hljs-params">config) =&gt; {
            <span class="hljs-keyword">const token = <span class="hljs-title function_">getToken();
            <span class="hljs-comment">// Add X-Access-Token header to every request, you can add other custom headers here
            <span class="hljs-keyword">if (token) {
                config.<span class="hljs-property">headers[<span class="hljs-string">'X-XSRF-TOKEN'] = token
                config.<span class="hljs-property">headers[<span class="hljs-string">'Authorization'] = <span class="hljs-string">'Bearer ' + token
            }
            <span class="hljs-keyword">return config
        },
        <span class="hljs-function">(<span class="hljs-params">error) =&gt; {
            <span class="hljs-title class_">Promise.<span class="hljs-title function_">reject(error)
        }
    )

    <span class="hljs-keyword">const re = <span class="hljs-keyword">await service.<span class="hljs-title function_">request({
        <span class="hljs-attr">url: url,
        <span class="hljs-attr">method: methods,
        <span class="hljs-attr">data: data,
        <span class="hljs-attr">cancelToken: token,
        <span class="hljs-attr">timeout: timeout,
        <span class="hljs-attr">onUploadProgress: <span class="hljs-keyword">function (<span class="hljs-params">progressEvent) { <span class="hljs-comment">//原生获取上传进度的事件
            <span class="hljs-keyword">if (progressEvent.<span class="hljs-property">lengthComputable) {
                <span class="hljs-keyword">if (onProgress) {
                    <span class="hljs-title function_">onProgress(progressEvent);
                }
            }
        },
    })
    <span class="hljs-keyword">return re <span class="hljs-keyword">as any;
}

<span class="hljs-comment">///获得取消令牌
<span class="hljs-keyword">export <span class="hljs-keyword">const <span class="hljs-title function_">getCancelToken = () =&gt; {
    <span class="hljs-keyword">const source = axios.<span class="hljs-property">CancelToken.<span class="hljs-title function_">source();
    <span class="hljs-keyword">return source;
}
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>回到App.vue</p>
<p>我们按照网页端这个三个职责的顺序，分步骤完成代码</p>
<h2><strong>生成Token</strong></h2>
<p>首先建立两个变量，存储当前的Token和状态枚举值</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="20" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22export%20default%20%7B%5Cn%20%20name%3A%20%5C%22App%5C%22%2C%5Cn%20%20data%3A%20()%20%3D%3E%20%7B%5Cn%20%20%20%20return%20%7B%5Cn%20%20%20%20%20%20wechatMiniappLoginToken%3A%20null%2C%5Cn%20%20%20%20%20%20wechatMiniappLoginStatus%3A%20%5C%22WAIT%5C%22%2C%5Cn%20%20%20%20%7D%3B%5Cn%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"><span class="hljs-keyword">export <span class="hljs-keyword">default {
  <span class="hljs-attr">name: <span class="hljs-string">"App",
  <span class="hljs-attr">data: <span class="hljs-function">() =&gt; {
    <span class="hljs-keyword">return {
      <span class="hljs-attr">wechatMiniappLoginToken: <span class="hljs-literal">null,
      <span class="hljs-attr">wechatMiniappLoginStatus: <span class="hljs-string">"WAIT",
    };
  },</span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>methods中建立getToken函数，这里使用8位随机数作为token值</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="19" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20methods%3A%20%7B%5Cn%20%20%20%20getToken()%20%7B%5Cn%20%20%20%20%20%20if%20(this.wechatMiniappLoginToken%20%3D%3D%20null)%20%7B%5Cn%20%20%20%20%20%20%20%20var%20date%20%3D%20new%20Date()%3B%5Cn%20%20%20%20%20%20%20%20var%20token%20%3D%20%60%24%7B(Math.random()%20*%20100000000)%5Cn%20%20%20%20%20%20%20%20%20%20.toFixed(0)%5Cn%20%20%20%20%20%20%20%20%20%20.toString()%5Cn%20%20%20%20%20%20%20%20%20%20.padEnd(8%2C%20%5C%220%5C%22)%7D%60%3B%5Cn%20%20%20%20%20%20%20%20this.wechatMiniappLoginToken%20%3D%20token%3B%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20return%20this.wechatMiniappLoginToken%3B%5Cn%20%20%20%20%7D%5Cn%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">  <span class="hljs-attr">methods: {
    <span class="hljs-title function_">getToken() {
      <span class="hljs-keyword">if (<span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginToken == <span class="hljs-literal">null) {
        <span class="hljs-keyword">var date = <span class="hljs-keyword">new <span class="hljs-title class_">Date();
        <span class="hljs-keyword">var token = <span class="hljs-string">`<span class="hljs-subst">${(<span class="hljs-built_in">Math.random() * <span class="hljs-number">100000000)
          .toFixed(<span class="hljs-number">0)
          .toString()
          .padEnd(<span class="hljs-number">8, <span class="hljs-string">"0")}`;
        <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginToken = token;
      }
      <span class="hljs-keyword">return <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginToken;
    }
   }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h2><strong>生成小程序码</strong></h2>
<p>Html部分，插入一个图片，将token传入scene参数</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="18" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22html%22%2C%22code%22%3A%22%3Cimg%20%3Asrc%3D%5C%22%60%24%7Bprefix%7D%2FMiniProgram%2FGetACode%3Fscene%3D%24%7BgetToken()%7D%26page%3D%24%7BminiappPage%7D%26mode%3Dcontent%60%5C%22%2F%3E%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-html hljs"><span class="hljs-tag">&lt;<span class="hljs-name">img <span class="hljs-attr">:src=<span class="hljs-string">"`${prefix}/MiniProgram/GetACode?scene=${getToken()}&amp;page=${miniappPage}&amp;mode=content`"/&gt;</span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>Prefix是你的服务地址前缀</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="17" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22prefix%3A%20%5C%22https%3A%2F%2Flocalhost%3A44311%2Fapi%2Fservices%2Fapp%5C%22%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"><span class="hljs-attr">prefix: <span class="hljs-string">"https://localhost:44311/api/services/app"</span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>page为小程序中鉴权页面的路径，需注意的是在小程序未发布时无法跳转至页面，报错41030，若要使用扫码来跳转指定页面，小程序需要先发布</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="16" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22miniappPage%3A%20%5C%22pages%2Flogin%2Findex%5C%22%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"><span class="hljs-attr">miniappPage: <span class="hljs-string">"pages/login/index"</span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h2><strong>监控整个鉴权过程状态</strong></h2>
<p>首先需要一个函数，根据当前的Token获取当前鉴权状态，并且不断循环这一操作，这里编写start函数，并以每1秒钟轮询状态，代码如下：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="15" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20start()%20%7B%5Cn%20%20%20%20%20%20clearInterval(this.timerId)%3B%5Cn%20%20%20%20%20%20this.timerId%20%3D%20setInterval(async%20()%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20if%20(!this.loading)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20this.loading%20%3D%20true%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20await%20request(%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%60%24%7Bthis.prefix%7D%2FMiniProgram%2FGetToken%3Ftoken%3D%24%7Bthis.wechatMiniappLoginToken%7D%60%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%5C%22get%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20null%5Cn%20%20%20%20%20%20%20%20%20%20)%20%20%20%20%20%20%20%20%20%20%20%20%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%7D%2C%201000)%3B%5Cn%20%20%20%20%7D%2C%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">   <span class="hljs-title function_">start() {
      <span class="hljs-built_in">clearInterval(<span class="hljs-variable language_">this.<span class="hljs-property">timerId);
      <span class="hljs-variable language_">this.<span class="hljs-property">timerId = <span class="hljs-built_in">setInterval(<span class="hljs-keyword">async () =&gt; {
        <span class="hljs-keyword">if (!<span class="hljs-variable language_">this.<span class="hljs-property">loading) {
          <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">true;

          <span class="hljs-keyword">await <span class="hljs-title function_">request(
            <span class="hljs-string">`<span class="hljs-subst">${<span class="hljs-variable language_">this.prefix}/MiniProgram/GetToken?token=<span class="hljs-subst">${<span class="hljs-variable language_">this.wechatMiniappLoginToken}`,
            <span class="hljs-string">"get",
            <span class="hljs-literal">null
          )            
        }
      }, <span class="hljs-number">1000);
    },
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>在页面开始函数代码Created中调用这一函数</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="14" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20created%3A%20function%20()%20%7B%5Cn%20%20%20%20this.start()%3B%5Cn%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">  <span class="hljs-attr">created: <span class="hljs-keyword">function () {
    <span class="hljs-variable language_">this.<span class="hljs-title function_">start();
  },</span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>接下来处理轮询结果，如果没有拿到值，说明Token已过期，wechatMiniappLoginStatus状态为"EXPIRED"</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="13" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20%20%20%20%20%20%20%20await%20request(%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%60%24%7Bthis.prefix%7D%2FMiniProgram%2FGetToken%3Ftoken%3D%24%7Bthis.wechatMiniappLoginToken%7D%60%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%5C%22get%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20null%5Cn%20%20%20%20%20%20%20%20%20%20)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20.then(async%20(re)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(re.data.result%20%3D%3D%20null)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.wechatMiniappLoginStatus%20%3D%20%5C%22EXPIRED%5C%22%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.wechatMiniappLoginToken%20%3D%20null%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.loading%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">          <span class="hljs-keyword">await <span class="hljs-title function_">request(
            <span class="hljs-string">`<span class="hljs-subst">${<span class="hljs-variable language_">this.prefix}/MiniProgram/GetToken?token=<span class="hljs-subst">${<span class="hljs-variable language_">this.wechatMiniappLoginToken}`,
            <span class="hljs-string">"get",
            <span class="hljs-literal">null
          )
            .<span class="hljs-title function_">then(<span class="hljs-keyword">async (re) =&gt; {
              <span class="hljs-keyword">if (re.<span class="hljs-property">data.<span class="hljs-property">result == <span class="hljs-literal">null) {
                <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginStatus = <span class="hljs-string">"EXPIRED";
                <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginToken = <span class="hljs-literal">null;
                <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">false;
              }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>注意：</p>
<p>在后端项目的MiniProgramAppService.cs中，我们定义的</p>
<p>TokenCacheDuration为5分钟，表明二维码的有效时间为5分钟。</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="12" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22public%20static%20TimeSpan%20TokenCacheDuration%20%3D%20TimeSpan.FromMinutes(5)%3B%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">public <span class="hljs-keyword">static TimeSpan TokenCacheDuration = TimeSpan.FromMinutes(<span class="hljs-number">5);</span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>相应的Token为Expired时，将wechatMiniappLoginToken置空，这一属性变动vue会通知img的src值变动而刷新小程序码，同时获取新的Token值赋值给wechatMiniappLoginToken，这也是刷新小程序码的逻辑</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="11" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22this.wechatMiniappLoginToken%20%3D%20null%3B%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"><span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginToken = <span class="hljs-literal">null;</span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>这样能以简单方式，实现二维码刷新功能。</p>
<p>界面中新建一个刷新小程序码的按钮：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="10" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22html%22%2C%22code%22%3A%22%20%20%20%20%20%20%3Cel-button%5Cn%20%20%20%20%20%20%20%20v-if%3D%5C%22wechatMiniappLoginToken%20!%3D%20null%5C%22%5Cn%20%20%20%20%20%20%20%20type%3D%5C%22primary%5C%22%5Cn%20%20%20%20%20%20%20%20size%3D%5C%22medium%5C%22%5Cn%20%20%20%20%20%20%20%20%40click%3D%5C%22wechatMiniappLoginToken%20%3D%20null%5C%22%5Cn%20%20%20%20%20%20%20%20%3E%E5%88%B7%E6%96%B0%5Cn%20%20%20%20%20%20%3C%2Fel-button%3E%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-html hljs">      <span class="hljs-tag">&lt;<span class="hljs-name">el-button
        <span class="hljs-attr">v-if=<span class="hljs-string">"wechatMiniappLoginToken != null"
        <span class="hljs-attr">type=<span class="hljs-string">"primary"
        <span class="hljs-attr">size=<span class="hljs-string">"medium"
        @<span class="hljs-attr">click=<span class="hljs-string">"wechatMiniappLoginToken = null"
        &gt;刷新
      <span class="hljs-tag">&lt;/<span class="hljs-name">el-button&gt;</span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>编写一个externalLogin方法，在用于获取Code后，调用后端第三方登录接口，获取访问凭证存储于Cookie中</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="9" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22async%20externalLogin(userInfo%3A%20%7B%5Cn%20%20%20%20%20%20authProvider%3A%20string%3B%5Cn%20%20%20%20%20%20providerKey%3A%20string%3B%5Cn%20%20%20%20%20%20providerAccessCode%3A%20string%3B%5Cn%20%20%20%20%7D)%20%7B%5Cn%20%20%20%20%20%20let%20authProvider%20%3D%20userInfo.authProvider%3B%5Cn%20%20%20%20%20%20let%20providerKey%20%3D%20userInfo.providerKey%3B%5Cn%20%20%20%20%20%20let%20providerAccessCode%20%3D%20userInfo.providerAccessCode%3B%5Cn%5Cn%20%20%20%20%20%20await%20request(%5Cn%20%20%20%20%20%20%20%20%60https%3A%2F%2Flocalhost%3A44311%2Fapi%2FTokenAuth%2FExternalAuthenticate%60%2C%5Cn%20%20%20%20%20%20%20%20%5C%22post%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20authProvider%2C%5Cn%20%20%20%20%20%20%20%20%20%20providerKey%2C%5Cn%20%20%20%20%20%20%20%20%20%20providerAccessCode%2C%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20).then(async%20(res)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20var%20data%20%3D%20res.data.result%3B%5Cn%20%20%20%20%20%20%20%20setToken(data.accessToken)%3B%5Cn%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"><span class="hljs-keyword">async <span class="hljs-title function_">externalLogin(<span class="hljs-params">userInfo: {
      authProvider: string;
      providerKey: string;
      providerAccessCode: string;
    }) {
      <span class="hljs-keyword">let authProvider = userInfo.<span class="hljs-property">authProvider;
      <span class="hljs-keyword">let providerKey = userInfo.<span class="hljs-property">providerKey;
      <span class="hljs-keyword">let providerAccessCode = userInfo.<span class="hljs-property">providerAccessCode;

      <span class="hljs-keyword">await <span class="hljs-title function_">request(
        <span class="hljs-string">`https://localhost:44311/api/TokenAuth/ExternalAuthenticate`,
        <span class="hljs-string">"post",
        {
          authProvider,
          providerKey,
          providerAccessCode,
        }
      ).<span class="hljs-title function_">then(<span class="hljs-keyword">async (res) =&gt; {
        <span class="hljs-keyword">var data = res.<span class="hljs-property">data.<span class="hljs-property">result;
        <span class="hljs-title function_">setToken(data.<span class="hljs-property">accessToken);
      });
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;定义setToken函数，使用js-cookie库将访问凭证写入浏览器cookie中</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22const%20tokenKey%20%3D%20%5C%22main_token%5C%22%3B%5Cnconst%20setToken%20%3D%20(token%3A%20string)%20%3D%3E%20Cookies.set(tokenKey%2C%20token)%3B%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"><span class="hljs-keyword">const tokenKey = <span class="hljs-string">"main_token";
<span class="hljs-keyword">const <span class="hljs-title function_">setToken = (<span class="hljs-params">token: string) =&gt; <span class="hljs-title class_">Cookies.<span class="hljs-title function_">set(tokenKey, token);</span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;</p>
<p>在此之前我们需写一个参数传递对象，为了保留一定的扩展能力，data中我们定义loginExternalForms，已经实现的微信小程序登录，则对应的authProvider值为&ldquo;WeChatAuthProvider&rdquo;，providerAccessCode则为生成的Token值</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20%20%20%20loginExternalForms%3A%20%7B%5Cn%20%20%20%20%20%20%20%20WeChat%3A%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20authProvider%3A%20%5C%22WeChatAuthProvider%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20providerKey%3A%20%5C%22default%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20providerAccessCode%3A%20%5C%22%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">      <span class="hljs-attr">loginExternalForms: {
        <span class="hljs-title class_">WeChat: {
          <span class="hljs-attr">authProvider: <span class="hljs-string">"WeChatAuthProvider",
          <span class="hljs-attr">providerKey: <span class="hljs-string">"default",
          <span class="hljs-attr">providerAccessCode: <span class="hljs-string">"",
        },
      },</span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>接下来包装externalLogin方法，在调用完成前后做一些操作，比如登录成功后，将调afterLoginSuccess方法</p>
<p>为了保留一定的扩展能力，handleExternalLogin函数中我们保留参数authProvider，已实现的微信小程序登录handleWxLogin函数调用时传递参数"WeChat"</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20%20async%20handleExternalLogin(authProvider)%20%7B%5Cn%20%20%20%20%20%20%2F%2F%20(this.%24refs.baseForm%20as%20any).validate(async%20(valid)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%2F%2F%20%20%20if%20(valid%20%3D%3D%20null)%20%7B%5Cn%20%20%20%20%20%20var%20currentForms%20%3D%20this.loginExternalForms%5BauthProvider%5D%3B%5Cn%5Cn%20%20%20%20%20%20this.loading%20%3D%20true%3B%5Cn%20%20%20%20%20%20return%20await%20this.ExternalLogin(currentForms).then(async%20(re)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20return%20await%20request(%5Cn%20%20%20%20%20%20%20%20%20%20%60%24%7Bthis.prefix%7D%2FUser%2FGetCurrentUser%60%2C%5Cn%20%20%20%20%20%20%20%20%20%20%5C%22get%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20null%5Cn%20%20%20%20%20%20%20%20).then(async%20(re)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20var%20result%20%3D%20re.data.result%20as%20any%3B%5Cn%20%20%20%20%20%20%20%20%20%20return%20await%20this.afterLoginSuccess(result)%3B%5Cn%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%7D%2C%5Cn%5Cn%20%20%20%20async%20handleWxLogin(providerAccessCode)%20%7B%5Cn%20%20%20%20%20%20this.loginExternalForms.WeChat.providerAccessCode%20%3D%20providerAccessCode%3B%5Cn%20%20%20%20%20%20return%20await%20this.handleExternalLogin(%5C%22WeChat%5C%22)%3B%5Cn%20%20%20%20%7D%2C%5Cn%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">    <span class="hljs-keyword">async <span class="hljs-title function_">handleExternalLogin(<span class="hljs-params">authProvider) {
      <span class="hljs-comment">// (this.$refs.baseForm as any).validate(async (valid) =&gt; {
      <span class="hljs-comment">//   if (valid == null) {
      <span class="hljs-keyword">var currentForms = <span class="hljs-variable language_">this.<span class="hljs-property">loginExternalForms[authProvider];

      <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">true;
      <span class="hljs-keyword">return <span class="hljs-keyword">await <span class="hljs-variable language_">this.<span class="hljs-title class_">ExternalLogin(currentForms).<span class="hljs-title function_">then(<span class="hljs-keyword">async (re) =&gt; {
        <span class="hljs-keyword">return <span class="hljs-keyword">await <span class="hljs-title function_">request(
          <span class="hljs-string">`<span class="hljs-subst">${<span class="hljs-variable language_">this.prefix}/User/GetCurrentUser`,
          <span class="hljs-string">"get",
          <span class="hljs-literal">null
        ).<span class="hljs-title function_">then(<span class="hljs-keyword">async (re) =&gt; {
          <span class="hljs-keyword">var result = re.<span class="hljs-property">data.<span class="hljs-property">result <span class="hljs-keyword">as any;
          <span class="hljs-keyword">return <span class="hljs-keyword">await <span class="hljs-variable language_">this.<span class="hljs-title function_">afterLoginSuccess(result);
        });
      });
    },

    <span class="hljs-keyword">async <span class="hljs-title function_">handleWxLogin(<span class="hljs-params">providerAccessCode) {
      <span class="hljs-variable language_">this.<span class="hljs-property">loginExternalForms.<span class="hljs-property">WeChat.<span class="hljs-property">providerAccessCode = providerAccessCode;
      <span class="hljs-keyword">return <span class="hljs-keyword">await <span class="hljs-variable language_">this.<span class="hljs-title function_">handleExternalLogin(<span class="hljs-string">"WeChat");
    },

</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>afterLoginSuccess函数用于登录成功后的逻辑，停止计时器，并跳转页面，本实例仅做弹窗提示</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20%20successMessage(value%20%3D%20%5C%22%E6%89%A7%E8%A1%8C%E6%88%90%E5%8A%9F%5C%22)%20%7B%5Cn%20%20%20%20%20%20this.%24notify(%7B%5Cn%20%20%20%20%20%20%20%20title%3A%20%5C%22%E6%88%90%E5%8A%9F%5C%22%2C%5Cn%20%20%20%20%20%20%20%20message%3A%20value%2C%5Cn%20%20%20%20%20%20%20%20type%3A%20%5C%22success%5C%22%2C%5Cn%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%7D%2C%20%20%20%20%5Cn%5Cn%20%20%20%20async%20afterLoginSuccess(userinfo)%20%7B%5Cn%20%20%20%20%20%20clearInterval(this.timerId)%3B%5Cn%20%20%20%20%20%20this.successMessage(%5C%22%E7%99%BB%E5%BD%95%E6%88%90%E5%8A%9F%5C%22)%3B%5Cn%20%20%20%20%20%20this.userInfo%20%3D%20userinfo%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">    <span class="hljs-title function_">successMessage(<span class="hljs-params">value = <span class="hljs-string">"执行成功") {
      <span class="hljs-variable language_">this.$notify({
        <span class="hljs-attr">title: <span class="hljs-string">"成功",
        <span class="hljs-attr">message: value,
        <span class="hljs-attr">type: <span class="hljs-string">"success",
      });
    },    

    <span class="hljs-keyword">async <span class="hljs-title function_">afterLoginSuccess(<span class="hljs-params">userinfo) {
      <span class="hljs-built_in">clearInterval(<span class="hljs-variable language_">this.<span class="hljs-property">timerId);
      <span class="hljs-variable language_">this.<span class="hljs-title function_">successMessage(<span class="hljs-string">"登录成功");
      <span class="hljs-variable language_">this.<span class="hljs-property">userInfo = userinfo;
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>继续编写start函数</p>
<p>如果拿到的token至不为空，则传递值给wechatMiniappLoginStatus，当wechatMiniappLoginStatus状态为"AUTHORIZED"时调用handleWxLogin函数：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(re.data.result%20%3D%3D%20null)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.wechatMiniappLoginStatus%20%3D%20%5C%22EXPIRED%5C%22%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.wechatMiniappLoginToken%20%3D%20null%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.loading%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20result%20%3D%20re.data.result%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.wechatMiniappLoginStatus%20%3D%20result.status%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.wechatMiniappLoginStatus%20%3D%3D%20%5C%22AUTHORIZED%5C%22%20%26%26%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20result.providerAccessCode%20!%3D%20null%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20await%20this.handleWxLogin(result.providerAccessCode)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20.then(()%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.wechatMiniappLoginToken%20%3D%20null%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.loading%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20.catch((e)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.wechatMiniappLoginToken%20%3D%20null%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.loading%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20clearInterval(this.timerId)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.loading%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">              <span class="hljs-keyword">if (re.<span class="hljs-property">data.<span class="hljs-property">result == <span class="hljs-literal">null) {
                <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginStatus = <span class="hljs-string">"EXPIRED";
                <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginToken = <span class="hljs-literal">null;
                <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">false;
              } <span class="hljs-keyword">else {
                <span class="hljs-keyword">var result = re.<span class="hljs-property">data.<span class="hljs-property">result;
                <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginStatus = result.<span class="hljs-property">status;
                <span class="hljs-keyword">if (
                  <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginStatus == <span class="hljs-string">"AUTHORIZED" &amp;&amp;
                  result.<span class="hljs-property">providerAccessCode != <span class="hljs-literal">null
                ) {
                  <span class="hljs-keyword">await <span class="hljs-variable language_">this.<span class="hljs-title function_">handleWxLogin(result.<span class="hljs-property">providerAccessCode)
                    .<span class="hljs-title function_">then(<span class="hljs-function">() =&gt; {
                      <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginToken = <span class="hljs-literal">null;
                      <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">false;
                    })
                    .<span class="hljs-title function_">catch(<span class="hljs-function">(<span class="hljs-params">e) =&gt; {
                      <span class="hljs-variable language_">this.<span class="hljs-property">wechatMiniappLoginToken = <span class="hljs-literal">null;
                      <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">false;
                      <span class="hljs-built_in">clearInterval(<span class="hljs-variable language_">this.<span class="hljs-property">timerId);
                    });
                } <span class="hljs-keyword">else {
                  <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">false;
                }
              }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>接下来简单编写一个界面，</p>
<p>界面将清晰的反映wechatMiniappLoginStatus各个状态时对应的UI交互：</p>
<p>WAIT(等待扫码)：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/d421c0ad815849b783afb6e84c89472a.png" alt="" width="667" height="725" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/d421c0ad815849b783afb6e84c89472a.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fd421c0ad815849b783afb6e84c89472a.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22667%22%2C%22height%22%3A%22725%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片"><br /></span></span></span></span></p>
<p>ACCESSED(已扫码)：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/e9e0050ae01c4ea5acdeab29529cc59c.png" alt="" width="667" height="725" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/e9e0050ae01c4ea5acdeab29529cc59c.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fe9e0050ae01c4ea5acdeab29529cc59c.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22667%22%2C%22height%22%3A%22725%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片"><br /></span></span></span></span></p>
<p>&nbsp;ACCESSED(已扫码)：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/3b3782eb39444ed8b37263b0a9ecb240.png" alt="" width="667" height="725" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/3b3782eb39444ed8b37263b0a9ecb240.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F3b3782eb39444ed8b37263b0a9ecb240.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22667%22%2C%22height%22%3A%22725%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片"><br /></span></span></span></span></p>
<p>&nbsp;</p>
<p>完整的Html代码如下：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22html%22%2C%22code%22%3A%22%3Ctemplate%3E%5Cn%20%20%3Cdiv%20id%3D%5C%22app%5C%22%3E%5Cn%20%20%20%20%3C!--%20%3Cimg%20alt%3D%5C%22Vue%20logo%5C%22%20src%3D%5C%22.%2Fassets%2Flogo.png%5C%22%20%2F%3E%5Cn%20%20%20%20%3CHelloWorld%20msg%3D%5C%22Welcome%20to%20Your%20Vue.js%20App%5C%22%20%2F%3E%20--%3E%5Cn%20%20%20%20%3Cdiv%20style%3D%5C%22height%3A%20450px%5C%22%3E%5Cn%20%20%20%20%20%20%3Cdiv%20v-if%3D%5C%22wechatMiniappLoginStatus%20%3D%3D%20'ACCESSED'%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%3Cel-result%5Cn%20%20%20%20%20%20%20%20%20%20icon%3D%5C%22info%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20title%3D%5C%22%E5%B7%B2%E6%89%AB%E7%A0%81%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20subTitle%3D%5C%22%E8%AF%B7%E5%9C%A8%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%B8%8A%E6%A0%B9%E6%8D%AE%E6%8F%90%E7%A4%BA%E8%BF%9B%E8%A1%8C%E6%93%8D%E4%BD%9C%5C%22%5Cn%20%20%20%20%20%20%20%20%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Fel-result%3E%5Cn%20%20%20%20%20%20%3C%2Fdiv%3E%5Cn%5Cn%20%20%20%20%20%20%3Cdiv%20v-else-if%3D%5C%22wechatMiniappLoginStatus%20%3D%3D%20'AUTHORIZED'%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%3Cel-result%5Cn%20%20%20%20%20%20%20%20%20%20icon%3D%5C%22success%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20title%3D%5C%22%E5%B7%B2%E6%8E%88%E6%9D%83%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%3AsubTitle%3D%5C%22loading%20%3F%20'%E8%AF%B7%E7%A8%8D%E5%80%99..'%20%3A%20'%E6%AD%A3%E5%9C%A8%E4%BD%BF%E7%94%A8%E5%BE%AE%E4%BF%A1%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%E7%B3%BB%E7%BB%9F'%5C%22%5Cn%20%20%20%20%20%20%20%20%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Fel-result%3E%5Cn%20%20%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%20%20%3Cdiv%20v-else%20class%3D%5C%22center%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%3Cimg%5Cn%20%20%20%20%20%20%20%20%20%20%3Asrc%3D%5C%22%60%24%7Bprefix%7D%2FMiniProgram%2FGetACode%3Fscene%3D%24%7BgetToken()%7D%26page%3D%24%7BminiappPage%7D%26mode%3Dcontent%60%5C%22%5Cn%20%20%20%20%20%20%20%20%2F%3E%5Cn%20%20%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%3Cdiv%20class%3D%5C%22center%5C%22%3E%5Cn%20%20%20%20%20%20%3Cel-button%5Cn%20%20%20%20%20%20%20%20v-if%3D%5C%22wechatMiniappLoginToken%20!%3D%20null%5C%22%5Cn%20%20%20%20%20%20%20%20type%3D%5C%22primary%5C%22%5Cn%20%20%20%20%20%20%20%20size%3D%5C%22medium%5C%22%5Cn%20%20%20%20%20%20%20%20%40click%3D%5C%22wechatMiniappLoginToken%20%3D%20null%5C%22%5Cn%20%20%20%20%20%20%20%20%3E%E5%88%B7%E6%96%B0%3C%2Fel-button%5Cn%20%20%20%20%20%20%3E%5Cn%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%3Cdiv%20class%3D%5C%22center%5C%22%3E%5Cn%20%20%20%20%20%20%3Cspan%3E%7B%7B%20userInfo%20%7D%7D%3C%2Fspan%3E%5Cn%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%3C%2Fdiv%3E%5Cn%3C%2Ftemplate%3E%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-html hljs"><span class="hljs-tag">&lt;<span class="hljs-name">template&gt;
  <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">id=<span class="hljs-string">"app"&gt;
    <span class="hljs-comment">&lt;!-- &lt;img alt="Vue logo" src="./assets/logo.png" /&gt;
    &lt;HelloWorld msg="Welcome to Your Vue.js App" /&gt; --&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">style=<span class="hljs-string">"height: 450px"&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">v-if=<span class="hljs-string">"wechatMiniappLoginStatus == 'ACCESSED'"&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">el-result
          <span class="hljs-attr">icon=<span class="hljs-string">"info"
          <span class="hljs-attr">title=<span class="hljs-string">"已扫码"
          <span class="hljs-attr">subTitle=<span class="hljs-string">"请在小程序上根据提示进行操作"
        &gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">el-result&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;

      <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">v-else-if=<span class="hljs-string">"wechatMiniappLoginStatus == 'AUTHORIZED'"&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">el-result
          <span class="hljs-attr">icon=<span class="hljs-string">"success"
          <span class="hljs-attr">title=<span class="hljs-string">"已授权"
          <span class="hljs-attr">:subTitle=<span class="hljs-string">"loading ? '请稍候..' : '正在使用微信账号登录系统'"
        &gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">el-result&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">v-else <span class="hljs-attr">class=<span class="hljs-string">"center"&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">img
          <span class="hljs-attr">:src=<span class="hljs-string">"`${prefix}/MiniProgram/GetACode?scene=${getToken()}&amp;page=${miniappPage}&amp;mode=content`"
        /&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">class=<span class="hljs-string">"center"&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">el-button
        <span class="hljs-attr">v-if=<span class="hljs-string">"wechatMiniappLoginToken != null"
        <span class="hljs-attr">type=<span class="hljs-string">"primary"
        <span class="hljs-attr">size=<span class="hljs-string">"medium"
        @<span class="hljs-attr">click=<span class="hljs-string">"wechatMiniappLoginToken = null"
        &gt;刷新&lt;/el-button
      &gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">class=<span class="hljs-string">"center"&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">span&gt;{{ userInfo }}<span class="hljs-tag">&lt;/<span class="hljs-name">span&gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
  <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
<span class="hljs-tag">&lt;/<span class="hljs-name">template&gt;
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202207/644861-20220719170744735-923296600.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>至此我们已完成网页端的开发工作</p>
<span data-cke-copybin-start="1"><span data-cke-copybin-end="1">​</span></span>