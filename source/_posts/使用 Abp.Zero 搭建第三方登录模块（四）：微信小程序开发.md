---
thumbnail: images/794d8ece53b7469eb90e14b48c5b2a78.png
title: 使用 Abp.Zero 搭建第三方登录模块（四）：微信小程序开发
excerpt: >-
  微信小程序主要为用户授权行为提供交互功能，用户在扫码之后，提供一个交互UI，如下在中介绍了服务端已经搭建的接口，这次我们将调用Access和Authenticate，分别调用来完成已扫码和已授权状态的更新。......
tags:
  - TypeScript
  - 小程序
  - 微信公众号
categories:
  - JavaScript
  - 小程序/公众号
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2022-07-19 17:12:00/使用 Abp.Zero 搭建第三方登录模块（四）：微信小程序开发.html'
abbrlink: 74407f40
date: 2022-07-19 17:12:00
cover:
description:
---
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span>简短回顾一下微信小程序端的流程：</p><ol>
<li>用户通过扫码进入小程序的鉴权页面，更新状态到ACCESSED已扫码</li>
<li>用户点击确认授权，微信通过wx.login()接口获取第三方登录的必要信息：Code登录凭证。</li>
</ol><p>微信小程序主要为用户授权行为提供交互功能，用户在扫码之后，提供一个交互UI，如下：</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="21" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/7657ed740d054422975e0ff24709f242.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F7657ed740d054422975e0ff24709f242.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22261%22%2C%22height%22%3A%22604%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="604" src="7657ed740d054422975e0ff24709f242.png" width="261"/></span></p><p id="articleContentId">在<a href="https://www.cnblogs.com/jevonsflash/p/16408071.html">使用 Abp.Zero 搭建第三方登录模块（二）：服务端开发 - 林晓lx - 博客园 (cnblogs.com)</a><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_wrapper_link-info cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="20" data-cke-widget-wrapper="1">中介绍了服务端已经搭建的接口，这次我们将调用Access和Authenticate，分别调用来完成已扫码和已授权状态的更新。</span></p><h2>项目搭建</h2><p> 首先使用vue-cli创建一个web项目，命名为mp-weixin</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="19" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22vue%20create%20-p%20dcloudio%2Funi-preset-vue%20mp-weixin%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">vue create -p dcloudio/uni-preset-vue mp-weixin</code></pre>
</div><p> 在Pages下创建login/index.vue页面，作为登录授权页</p><p>目录结构如下：</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="18" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/b048939021bd4bd9896db6be1de41fa2.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fb048939021bd4bd9896db6be1de41fa2.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22425%22%2C%22height%22%3A%22186%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="186" src="b048939021bd4bd9896db6be1de41fa2.png" width="425"/></span></p><p>pages.json：</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="17" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%7B%5Cn%5Ct%5C%22pages%5C%22%3A%20%5B%20%2F%2Fpages%E6%95%B0%E7%BB%84%E4%B8%AD%E7%AC%AC%E4%B8%80%E9%A1%B9%E8%A1%A8%E7%A4%BA%E5%BA%94%E7%94%A8%E5%90%AF%E5%8A%A8%E9%A1%B5%EF%BC%8C%E5%8F%82%E8%80%83%EF%BC%9Ahttps%3A%2F%2Funiapp.dcloud.io%2Fcollocation%2Fpages%5Cn%5Ct%5Ct%7B%5Cn%5Ct%5Ct%5Ct%5C%22path%5C%22%3A%20%5C%22pages%2Findex%2Findex%5C%22%2C%5Cn%5Ct%5Ct%5Ct%5C%22style%5C%22%3A%20%7B%5Cn%5Ct%5Ct%5Ct%5Ct%5C%22navigationBarTitleText%5C%22%3A%20%5C%22uni-app%5C%22%5Cn%5Ct%5Ct%5Ct%7D%5Cn%5Ct%5Ct%7D%2C%5Cn%5Ct%5Ct%7B%5Cn%5Ct%5Ct%5Ct%5C%22path%5C%22%3A%20%5C%22pages%2Flogin%2Findex%5C%22%2C%5Cn%5Ct%5Ct%5Ct%5C%22style%5C%22%3A%20%7B%5Cn%5Ct%5Ct%5Ct%5Ct%5C%22navigationBarTitleText%5C%22%3A%20%5C%22%E6%8E%88%E6%9D%83%E9%A1%B5%5C%22%5Cn%5Ct%5Ct%5Ct%7D%5Cn%5Ct%5Ct%7D%5Cn%5Ct%5D%2C%5Cn%5Ct%5C%22globalStyle%5C%22%3A%20%7B%5Cn%5Ct%5Ct%5C%22navigationBarTextStyle%5C%22%3A%20%5C%22black%5C%22%2C%5Cn%5Ct%5Ct%5C%22navigationBarTitleText%5C%22%3A%20%5C%22uni-app%5C%22%2C%5Cn%5Ct%5Ct%5C%22navigationBarBackgroundColor%5C%22%3A%20%5C%22%23F8F8F8%5C%22%2C%5Cn%5Ct%5Ct%5C%22backgroundColor%5C%22%3A%20%5C%22%23F8F8F8%5C%22%5Cn%5Ct%7D%5Cn%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">{
	<span class="hljs-string">"pages": [ <span class="hljs-comment">//pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
			<span class="hljs-string">"path": <span class="hljs-string">"pages/index/index",
			<span class="hljs-string">"style": {
				<span class="hljs-string">"navigationBarTitleText": <span class="hljs-string">"uni-app"
			}
		},
		{
			<span class="hljs-string">"path": <span class="hljs-string">"pages/login/index",
			<span class="hljs-string">"style": {
				<span class="hljs-string">"navigationBarTitleText": <span class="hljs-string">"授权页"
			}
		}
	],
	<span class="hljs-string">"globalStyle": {
		<span class="hljs-string">"navigationBarTextStyle": <span class="hljs-string">"black",
		<span class="hljs-string">"navigationBarTitleText": <span class="hljs-string">"uni-app",
		<span class="hljs-string">"navigationBarBackgroundColor": <span class="hljs-string">"#F8F8F8",
		<span class="hljs-string">"backgroundColor": <span class="hljs-string">"#F8F8F8"
	}
}
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p> login目录下新建ajaxRequire.ts， 创建request对象，这一对象将利用uni-axios-ts库发送ajax请求</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="16" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22import%20axios%20from%20'uni-axios-ts'%5Cn%2F%2F%E5%8F%91%E9%80%81%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%5Cnexport%20const%20request%20%3D%20async%20(url%3A%20string%2C%20methods%2C%20data%3A%20any%2C%20onProgress%3F%3A%20(e)%20%3D%3E%20void%2C%20cancelToken%3F)%20%3D%3E%20%7B%5Cn%20%20%20%20let%20token%20%3D%20null%5Cn%20%20%20%20let%20timeout%20%3D%203000%3B%5Cn%20%20%20%20if%20(cancelToken)%20%7B%5Cn%20%20%20%20%20%20%20%20token%20%3D%20cancelToken.token%5Cn%20%20%20%20%20%20%20%20timeout%20%3D%200%3B%5Cn%20%20%20%20%7D%5Cn%20%20%20%20const%20service%20%3D%20axios.create()%5Cn%5Cn%5Cn%20%20%20%20service.interceptors.request.use(%5Cn%20%20%20%20%20%20%20%20(config)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20config.header%5B'Content-Type'%5D%20%3D%20%5C%22application%2Fjson%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20config%5Cn%20%20%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%20%20%20%20(error)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20Promise.reject(error)%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20)%5Cn%5Cn%5Cn%20%20%20%20const%20re%20%3D%20await%20service.request(%7B%5Cn%20%20%20%20%20%20%20%20headers%3A%20%7B%20'Content-Type'%3A%20'multipart%2Fform-data'%20%7D%2C%5Cn%20%20%20%20%20%20%20%20url%3A%20url%2C%5Cn%20%20%20%20%20%20%20%20method%3A%20methods%2C%5Cn%20%20%20%20%20%20%20%20data%3A%20data%2C%5Cn%20%20%20%20%20%20%20%20cancelToken%3A%20token%2C%5Cn%20%20%20%20%20%20%20%20timeout%3A%20timeout%2C%5Cn%20%20%20%20%20%20%20%20onUploadProgress%3A%20function%20(progressEvent)%20%7B%20%2F%2F%E5%8E%9F%E7%94%9F%E8%8E%B7%E5%8F%96%E4%B8%8A%E4%BC%A0%E8%BF%9B%E5%BA%A6%E7%9A%84%E4%BA%8B%E4%BB%B6%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(progressEvent.lengthComputable)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(onProgress)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20onProgress(progressEvent)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%7D)%5Cn%20%20%20%20return%20re%20as%20any%3B%5Cn%7D%5Cn%5Cn%2F%2F%2F%E8%8E%B7%E5%BE%97%E5%8F%96%E6%B6%88%E4%BB%A4%E7%89%8C%5Cnexport%20const%20getCancelToken%20%3D%20()%20%3D%3E%20%7B%5Cn%20%20%20%20const%20source%20%3D%20axios.CancelToken.source()%3B%5Cn%20%20%20%20return%20source%3B%5Cn%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"><span class="hljs-keyword">import axios <span class="hljs-keyword">from <span class="hljs-string">'uni-axios-ts'
<span class="hljs-comment">//发送网络请求
<span class="hljs-keyword">export <span class="hljs-keyword">const request = <span class="hljs-keyword">async (<span class="hljs-attr">url: string, methods, <span class="hljs-attr">data: any, onProgress?: <span class="hljs-function">(<span class="hljs-params">e) =&gt; <span class="hljs-keyword">void, cancelToken?) =&gt; {
    <span class="hljs-keyword">let token = <span class="hljs-literal">null
    <span class="hljs-keyword">let timeout = <span class="hljs-number">3000;
    <span class="hljs-keyword">if (cancelToken) {
        token = cancelToken.<span class="hljs-property">token
        timeout = <span class="hljs-number">0;
    }
    <span class="hljs-keyword">const service = axios.<span class="hljs-title function_">create()


    service.<span class="hljs-property">interceptors.<span class="hljs-property">request.<span class="hljs-title function_">use(
        <span class="hljs-function">(<span class="hljs-params">config) =&gt; {
            config.<span class="hljs-property">header[<span class="hljs-string">'Content-Type'] = <span class="hljs-string">"application/json"
            <span class="hljs-keyword">return config
        },
        <span class="hljs-function">(<span class="hljs-params">error) =&gt; {
            <span class="hljs-title class_">Promise.<span class="hljs-title function_">reject(error)
        }
    )


    <span class="hljs-keyword">const re = <span class="hljs-keyword">await service.<span class="hljs-title function_">request({
        <span class="hljs-attr">headers: { <span class="hljs-string">'Content-Type': <span class="hljs-string">'multipart/form-data' },
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
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>index.vue中创建loginExternalForms作为参数传输对象</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="15" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22export%20default%20%7B%5Cn%20%20data()%20%7B%5Cn%20%20%20%20return%20%7B%5Cn%20%20%20%20%20%20loginExternalForms%3A%20%7B%5Cn%20%20%20%20%20%20%20%20WeChat%3A%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20token%3A%20%5C%22%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20providerAccessCode%3A%20%5C%22%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%3B%5Cn%20%20%7D%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"><span class="hljs-keyword">export <span class="hljs-keyword">default {
  <span class="hljs-title function_">data() {
    <span class="hljs-keyword">return {
      <span class="hljs-attr">loginExternalForms: {
        <span class="hljs-title class_">WeChat: {
          <span class="hljs-attr">token: <span class="hljs-string">"",
          <span class="hljs-attr">providerAccessCode: <span class="hljs-string">"",
        },
      }
    };
  }
}</span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>onLoad函数中，option存有扫描小程序码中的scene参数，将scene参数赋值给token变量</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="14" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20onLoad(option)%20%7B%5Cn%20%20%20%20this.loginExternalForms.WeChat.token%20%3D%20option.scene%3B%5Cn%20%20%20%20this.start()%3B%5Cn%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs"> <span class="hljs-title function_">onLoad(<span class="hljs-params">option) {
    <span class="hljs-variable language_">this.<span class="hljs-property">loginExternalForms.<span class="hljs-property">WeChat.<span class="hljs-property">token = option.<span class="hljs-property">scene;
    <span class="hljs-variable language_">this.<span class="hljs-title function_">start();
  },</span></span></span></span></span></span></span></span></span></code></pre>
</div><p>start中我们调用Access接口，更改状态至ACCESSED（已扫码） ，若返回成功，则提示点用户点击确认授权，若返回的结果异常"WechatMiniProgramLoginInvalidToken"时，表明此时小程序码已过期，需在网页端更新小程序码。</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="13" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20%20async%20start()%20%7B%5Cn%20%20%20%20%20%20var%20currentForms%20%3D%20this.loginExternalForms%5B%5C%22WeChat%5C%22%5D%3B%5Cn%20%20%20%20%20%20this.loading%20%3D%20true%3B%5Cn%20%20%20%20%20%20await%20request(%60%24%7Bthis.prefix%7D%2FMiniProgram%2FAccess%60%2C%20%5C%22post%5C%22%2C%20currentForms)%5Cn%20%20%20%20%20%20%20%20.then((re)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20this.successMessage(%5C%22%E6%82%A8%E5%B7%B2%E6%89%AB%E6%8F%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%8C%E8%AF%B7%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4%E7%99%BB%E5%BD%95%E4%BB%A5%E5%AE%8C%E6%88%90%5C%22)%3B%5Cn%20%20%20%20%20%20%20%20%7D)%5Cn%20%20%20%20%20%20%20%20.catch((c)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20var%20err%20%3D%20c.response%3F.data%3F.error%3F.message%3B%5Cn%20%20%20%20%20%20%20%20%20%20if%20(err%20!%3D%20null)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(err%20%3D%3D%20%5C%22WechatMiniProgramLoginInvalidToken%5C%22)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.isInvalid%20%3D%20true%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.errorMessage(c.err)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D)%5Cn%20%20%20%20%20%20%20%20.finally(()%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20setTimeout(()%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.loading%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%20%20%7D%2C%201.5%20*%201000)%3B%5Cn%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">    <span class="hljs-keyword">async <span class="hljs-title function_">start() {
      <span class="hljs-keyword">var currentForms = <span class="hljs-variable language_">this.<span class="hljs-property">loginExternalForms[<span class="hljs-string">"WeChat"];
      <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">true;
      <span class="hljs-keyword">await <span class="hljs-title function_">request(<span class="hljs-string">`<span class="hljs-subst">${<span class="hljs-variable language_">this.prefix}/MiniProgram/Access`, <span class="hljs-string">"post", currentForms)
        .<span class="hljs-title function_">then(<span class="hljs-function">(<span class="hljs-params">re) =&gt; {
          <span class="hljs-variable language_">this.<span class="hljs-title function_">successMessage(<span class="hljs-string">"您已扫描二维码，请点击确认登录以完成");
        })
        .<span class="hljs-title function_">catch(<span class="hljs-function">(<span class="hljs-params">c) =&gt; {
          <span class="hljs-keyword">var err = c.<span class="hljs-property">response?.<span class="hljs-property">data?.<span class="hljs-property">error?.<span class="hljs-property">message;
          <span class="hljs-keyword">if (err != <span class="hljs-literal">null) {
            <span class="hljs-keyword">if (err == <span class="hljs-string">"WechatMiniProgramLoginInvalidToken") {
              <span class="hljs-variable language_">this.<span class="hljs-property">isInvalid = <span class="hljs-literal">true;
            } <span class="hljs-keyword">else {
              <span class="hljs-variable language_">this.<span class="hljs-title function_">errorMessage(c.<span class="hljs-property">err);
            }
          }
        })
        .<span class="hljs-title function_">finally(<span class="hljs-function">() =&gt; {
          <span class="hljs-built_in">setTimeout(<span class="hljs-function">() =&gt; {
            <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">false;
          }, <span class="hljs-number">1.5 * <span class="hljs-number">1000);
        });
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>Prefix是你的服务地址前缀</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="12" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22prefix%3A%20%5C%22https%3A%2F%2Flocalhost%3A44311%2Fapi%2Fservices%2Fapp%5C%22%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">prefix: "https://localhost:44311/api/services/app"</code></pre>
</div><p>在Html中，我们创建授权登录与取消按钮，仅当isInvalid 为true时可以点击授权</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="11" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22html%22%2C%22code%22%3A%22%20%20%20%20%20%20%3Cbutton%5Cn%20%20%20%20%20%20%20%20%40click%3D%5C%22handleWxLogin%5C%22%5Cn%20%20%20%20%20%20%20%20%3Adisabled%3D%5C%22isInvalid%20%7C%7C%20loading%5C%22%5Cn%20%20%20%20%20%20%20%20class%3D%5C%22sub-btn%5C%22%5Cn%20%20%20%20%20%20%3E%5Cn%20%20%20%20%20%20%20%20%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95%5Cn%20%20%20%20%20%20%3C%2Fbutton%3E%5Cn%5Cn%20%20%20%20%20%20%3Cbutton%20%40click%3D%5C%22cancelWxLogin%5C%22%20%3Adisabled%3D%5C%22loading%5C%22%20class%3D%5C%22sub-btn%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%E5%8F%96%E6%B6%88%5Cn%20%20%20%20%20%20%3C%2Fbutton%3E%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-html hljs">      <span class="hljs-tag">&lt;<span class="hljs-name">button
        @<span class="hljs-attr">click=<span class="hljs-string">"handleWxLogin"
        <span class="hljs-attr">:disabled=<span class="hljs-string">"isInvalid || loading"
        <span class="hljs-attr">class=<span class="hljs-string">"sub-btn"
      &gt;
        授权登录
      <span class="hljs-tag">&lt;/<span class="hljs-name">button&gt;

      <span class="hljs-tag">&lt;<span class="hljs-name">button @<span class="hljs-attr">click=<span class="hljs-string">"cancelWxLogin" <span class="hljs-attr">:disabled=<span class="hljs-string">"loading" <span class="hljs-attr">class=<span class="hljs-string">"sub-btn"&gt;
        取消
      <span class="hljs-tag">&lt;/<span class="hljs-name">button&gt;</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>创建 handleExternalLogin用于处理用户点击授权登录后的逻辑，调用Authenticate接口，更新状态至AUTHORIZED（已授权）在此之前需要调用uni.login获取小程序登录凭证code。</p><p>有关uni.login函数，请参考官方文档<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="10" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" data-cke-enter-mode="2" data-cke-saved-href="https://uniapp.dcloud.io/api/plugins/login.html" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Funiapp.dcloud.io%2Fapi%2Fplugins%2Flogin.html%22%2C%22text%22%3A%22uni.login(OBJECT)%20%7C%20uni-app%E5%AE%98%E7%BD%91%20(dcloud.io)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.7%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM666%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.7%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM666%22%2C%22id%22%3A%22BZfnae-1658221754828%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.7/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M666" data-link-title="uni.login(OBJECT) | uni-app官网 (dcloud.io)" data-widget="csdnlink" href="https://uniapp.dcloud.io/api/plugins/login.html" title="uni.login(OBJECT) | uni-app官网 (dcloud.io)">uni.login(OBJECT) | uni-app官网 (dcloud.io)</a></span></p><p>uniapp支持多种小程序，为了保留一定的扩展能力，handleExternalLogin函数中我们保留参数authProvider，已实现的微信小程序登录handleWxLogin函数调用时传递参数"WeChat"，</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="9" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20%20async%20handleExternalLogin(authProvider)%20%7B%5Cn%20%20%20%20%20%20var%20currentForms%20%3D%20this.loginExternalForms%5BauthProvider%5D%3B%5Cn%20%20%20%20%20%20this.loading%20%3D%20true%3B%5Cn%20%20%20%20%20%20await%20request(%5Cn%20%20%20%20%20%20%20%20%60%24%7Bthis.prefix%7D%2FMiniProgram%2FAuthenticate%60%2C%5Cn%20%20%20%20%20%20%20%20%5C%22post%5C%22%2C%5Cn%20%20%20%20%20%20%20%20currentForms%5Cn%20%20%20%20%20%20)%5Cn%20%20%20%20%20%20%20%20.then((re)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20uni.redirectTo(%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20%5C%22%2Fpages%2Findex%2Findex%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20%7D)%5Cn%20%20%20%20%20%20%20%20.catch((c)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20var%20err%20%3D%20c.response%3F.data%3F.error%3F.message%3B%5Cn%20%20%20%20%20%20%20%20%20%20if%20(err%20!%3D%20null)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(err%20%3D%3D%20%5C%22WechatMiniProgramLoginInvalidToken%5C%22)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.isInvalid%20%3D%20true%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.errorMessage(c.err)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20setTimeout(()%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.loading%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%20%20%7D%2C%201.5%20*%201000)%3B%5Cn%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%7D%2C%5Cn%5Cn%5Cn%20%20%20async%20handleWxLogin()%20%7B%5Cn%20%20%20%20%20%20const%20that%20%3D%20this%3B%5Cn%20%20%20%20%20%20uni.login(%7B%5Cn%20%20%20%20%20%20%20%20provider%3A%20%5C%22weixin%5C%22%2C%5Cn%20%20%20%20%20%20%20%20success%3A%20(loginRes)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20that.loginExternalForms.WeChat.providerAccessCode%20%3D%20loginRes.code%3B%5Cn%20%20%20%20%20%20%20%20%20%20that.handleExternalLogin(%5C%22WeChat%5C%22)%3B%5Cn%20%20%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">    <span class="hljs-keyword">async <span class="hljs-title function_">handleExternalLogin(<span class="hljs-params">authProvider) {
      <span class="hljs-keyword">var currentForms = <span class="hljs-variable language_">this.<span class="hljs-property">loginExternalForms[authProvider];
      <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">true;
      <span class="hljs-keyword">await <span class="hljs-title function_">request(
        <span class="hljs-string">`<span class="hljs-subst">${<span class="hljs-variable language_">this.prefix}/MiniProgram/Authenticate`,
        <span class="hljs-string">"post",
        currentForms
      )
        .<span class="hljs-title function_">then(<span class="hljs-function">(<span class="hljs-params">re) =&gt; {
          uni.<span class="hljs-title function_">redirectTo({
            <span class="hljs-attr">url: <span class="hljs-string">"/pages/index/index",
          });
        })
        .<span class="hljs-title function_">catch(<span class="hljs-function">(<span class="hljs-params">c) =&gt; {
          <span class="hljs-keyword">var err = c.<span class="hljs-property">response?.<span class="hljs-property">data?.<span class="hljs-property">error?.<span class="hljs-property">message;
          <span class="hljs-keyword">if (err != <span class="hljs-literal">null) {
            <span class="hljs-keyword">if (err == <span class="hljs-string">"WechatMiniProgramLoginInvalidToken") {
              <span class="hljs-variable language_">this.<span class="hljs-property">isInvalid = <span class="hljs-literal">true;
            } <span class="hljs-keyword">else {
              <span class="hljs-variable language_">this.<span class="hljs-title function_">errorMessage(c.<span class="hljs-property">err);
            }
          }
          <span class="hljs-built_in">setTimeout(<span class="hljs-function">() =&gt; {
            <span class="hljs-variable language_">this.<span class="hljs-property">loading = <span class="hljs-literal">false;
          }, <span class="hljs-number">1.5 * <span class="hljs-number">1000);
        });
    },


   <span class="hljs-keyword">async <span class="hljs-title function_">handleWxLogin() {
      <span class="hljs-keyword">const that = <span class="hljs-variable language_">this;
      uni.<span class="hljs-title function_">login({
        <span class="hljs-attr">provider: <span class="hljs-string">"weixin",
        <span class="hljs-attr">success: <span class="hljs-function">(<span class="hljs-params">loginRes) =&gt; {
          that.<span class="hljs-property">loginExternalForms.<span class="hljs-property">WeChat.<span class="hljs-property">providerAccessCode = loginRes.<span class="hljs-property">code;
          that.<span class="hljs-title function_">handleExternalLogin(<span class="hljs-string">"WeChat");
        },
      });
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>创建取消登录函数</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20%20cancelWxLogin()%20%7B%5Cn%20%20%20%20%20%20uni.redirectTo(%7B%5Cn%20%20%20%20%20%20%20%20url%3A%20%5C%22%2Fpages%2Findex%2Findex%5C%22%2C%5Cn%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">    <span class="hljs-title function_">cancelWxLogin() {
      uni.<span class="hljs-title function_">redirectTo({
        <span class="hljs-attr">url: <span class="hljs-string">"/pages/index/index",
      });
    },</span></span></span></span></code></pre>
</div><p>执行成功通知函数</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22javascript%22%2C%22code%22%3A%22%20%20%20%20successMessage(value%20%3D%20%5C%22%E6%89%A7%E8%A1%8C%E6%88%90%E5%8A%9F%5C%22)%20%7B%5Cn%20%20%20%20%20%20uni.showToast(%7B%5Cn%20%20%20%20%20%20%20%20title%3A%20value%2C%5Cn%20%20%20%20%20%20%20%20icon%3A%20%5C%22success%5C%22%2C%5Cn%20%20%20%20%20%20%20%20duration%3A%201.5%20*%201000%2C%5Cn%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-javascript hljs">    <span class="hljs-title function_">successMessage(<span class="hljs-params">value = <span class="hljs-string">"执行成功") {
      uni.<span class="hljs-title function_">showToast({
        <span class="hljs-attr">title: value,
        <span class="hljs-attr">icon: <span class="hljs-string">"success",
        <span class="hljs-attr">duration: <span class="hljs-number">1.5 * <span class="hljs-number">1000,
      });
    },</span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>接下来简单编写一个界面，</p><p>界面将清晰的反映isInvalid与loading状态时对应的UI交互：</p><p><strong>正常</strong></p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/a847c6b198074b60a288222108316690.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fa847c6b198074b60a288222108316690.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22390%22%2C%22height%22%3A%22228%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="228" src="a847c6b198074b60a288222108316690.png" width="390"/></span></p><p><strong>小程序码过期 </strong></p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/940a8d0528c048b18e50927aca2de450.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F940a8d0528c048b18e50927aca2de450.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22388%22%2C%22height%22%3A%22183%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="183" src="940a8d0528c048b18e50927aca2de450.png" width="388"/></span></p><h2>整体测试</h2><p><strong>模拟器测试</strong></p><p>打开网页后，将图像另存为</p><p> <span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/6fa00c3ee7674c47a68c670fdbc1dca9.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F6fa00c3ee7674c47a68c670fdbc1dca9.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22419%22%2C%22height%22%3A%22186%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="186" src="6fa00c3ee7674c47a68c670fdbc1dca9.png" width="419"/></span></p><p> 在微信小程序调试工具，“通过二维码编译”</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/205bdae860e840d99c3e14cc5f4c7865.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F205bdae860e840d99c3e14cc5f4c7865.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22245%22%2C%22height%22%3A%22187%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="187" src="205bdae860e840d99c3e14cc5f4c7865.png" width="245"/></span></p><p> 等待手机界面显示授权页面后点击“授权登录”：</p><p> <span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/d07973dd30aa44b49d6683ff21e61e03.gif" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fd07973dd30aa44b49d6683ff21e61e03.gif%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22%22%2C%22height%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" src="d07973dd30aa44b49d6683ff21e61e03.gif"/></span></p><p> GetCurrentUser接口返回正确数据，并显示于web页面之上</p><p> <span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/3b3782eb39444ed8b37263b0a9ecb240.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F3b3782eb39444ed8b37263b0a9ecb240.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22%22%2C%22height%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" src="3b3782eb39444ed8b37263b0a9ecb240.png"/></span></p><p> </p><p>至此完成了小程序端的开发工作</p><h2>项目地址</h2><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/jevonsflash/abp-mp-auth" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fjevonsflash%2Fabp-mp-auth%22%2C%22text%22%3A%22jevonsflash%2Fabp-mp-auth%20(github.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.7%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM666%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.7%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM666%22%2C%22id%22%3A%223vgcTM-1658221754803%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.7/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M666" data-link-title="jevonsflash/abp-mp-auth (github.com)" data-widget="csdnlink" href="https://github.com/jevonsflash/abp-mp-auth" title="jevonsflash/abp-mp-auth (github.com)">jevonsflash/abp-mp-auth (github.com)</a></span></p><p> </p><h2>结束语</h2><p>小程序登录具有一定的扩展性，虽然通篇介绍微信小程序登录，但登录鉴权作为小程序抽象功能，uniapp集成了各个平台（微信、支付宝、百度、字节跳动小程序）的登录接口，通过uni.login可以获取相应平台的code</p><p><span data-cke-copybin-start="1"><span data-cke-copybin-end="1">​</span></span></p>