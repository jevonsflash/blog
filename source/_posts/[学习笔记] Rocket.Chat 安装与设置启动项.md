---
thumbnail:
cover:
title: '[学习笔记] Rocket.Chat 安装与设置启动项'
excerpt:
description:
date: 2022-02-15 09:43:00
tags:
  - Linux
  - ubuntu
  - centos
  - rocket.chat

categories:
  - DevOps
  - Linux
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2022-02-15 09:43:00/[学习笔记] Rocket.Chat 安装与设置启动项.html
---
<p>这篇文章主要介绍手动安装的方式来安装Rocket.Chat，在Rocket.Chat官方有三种安装方式，</p>
<ol>
<li>面向开发人员的直接使用meteor部署</li>
<li>传统的源码编译安装</li>
<li>Docker方式部署</li>
</ol>
<p>接下来分别介绍：</p>
<h2 id="%E4%BD%BF%E7%94%A8Meteor%E6%96%B9%E5%BC%8F%E9%83%A8%E7%BD%B2">使用Meteor方式部署</h2>
<p>Meteor是一种Web应用构建平台（官网<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="45" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="https://meteor.com/" href="https://meteor.com/" data-cke-enter-mode="2" data-cke-saved-href="https://meteor.com/" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fmeteor.com%2F%22%2C%22text%22%3A%22https%3A%2F%2Fmeteor.com%2F%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22fSMlU0-1653397801699%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="https://meteor.com/" data-widget="csdnlink">https://meteor.com/</a>），已经包含了nodejs，mongodb等环境，所以我们只需要安装Meteor和对应的rocketchat工具即可</span></p>
<h3><strong>安装Rocket.Chat</strong></h3>
<p>下载对应的Release版本，这里以2.4.14为例</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="44" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="https://codeload.github.com/RocketChat/Rocket.Chat/tar.gz/refs/tags/2.4.14" href="https://codeload.github.com/RocketChat/Rocket.Chat/tar.gz/refs/tags/2.4.14" data-cke-enter-mode="2" data-cke-saved-href="https://codeload.github.com/RocketChat/Rocket.Chat/tar.gz/refs/tags/2.4.14" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fcodeload.github.com%2FRocketChat%2FRocket.Chat%2Ftar.gz%2Frefs%2Ftags%2F2.4.14%22%2C%22text%22%3A%22https%3A%2F%2Fcodeload.github.com%2FRocketChat%2FRocket.Chat%2Ftar.gz%2Frefs%2Ftags%2F2.4.14%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.8%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM0H8%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%2204NjXZ-1653397801698%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release1.9.8/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M0H8" data-link-title="https://codeload.github.com/RocketChat/Rocket.Chat/tar.gz/refs/tags/2.4.14" data-widget="csdnlink">https://codeload.github.com/RocketChat/Rocket.Chat/tar.gz/refs/tags/2.4.14</a></span></p>
<p>根据文档安装和配置</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="43" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="Linux - Rocket.Chat Developer" href="https://developer.rocket.chat/rocket.chat/rocket.chat-server/linux" data-cke-enter-mode="2" data-cke-saved-href="https://developer.rocket.chat/rocket.chat/rocket.chat-server/linux" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fdeveloper.rocket.chat%2Frocket.chat%2Frocket.chat-server%2Flinux%22%2C%22text%22%3A%22Linux%20-%20Rocket.Chat%20Developer%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.8%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM0H8%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22eF6ETv-1653397801698%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release1.9.8/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M0H8" data-link-title="Linux - Rocket.Chat Developer" data-widget="csdnlink">Linux - Rocket.Chat Developer</a></span></p>
<h3><strong>配置Service</strong></h3>
<p>在/etc/systemd/system/目录下新建名称为rocketchat.service的文件，填写如下内容&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="42" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22%5BUnit%5D%5CnDescription%3DThe%20Rocket.Chat%20server%20running%20on%20Linux%5CnAfter%3Dnetwork.target%20remote-fs.target%20nss-lookup.target%20nginx.service%20mongod.service%5Cn%5BService%5D%5CnWorkingDirectory%3D%2Fhome%2Fxamarin%2Fweb%2FRocket.Chat-2.4.14%2F%5CnExecStart%3D%2Fusr%2Flocal%2Fbin%2Fmeteor%20npm%20start%5CnStandardOutput%3Dsyslog%5CnStandardError%3Dsyslog%5CnSyslogIdentifier%3Drocketchat%5CnUser%3Dxamarin%5CnEnvironment%3DROOT_URL%3Dhttp%3A%2F%2Flocalhost%3A3000%2F%20PORT%3D3000%5Cn%5BInstall%5D%5CnWantedBy%3Dmulti-user.target%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">[Unit]
Description=The Rocket.Chat server running on Linux
After=network.target remote-fs.target nss-lookup.target nginx.service mongod.service
[Service]
WorkingDirectory=/home/xamarin/web/Rocket.Chat-2.4.14/
ExecStart=/usr/local/bin/meteor npm start
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=rocketchat
User=xamarin
Environment=ROOT_URL=http://localhost:3000/ PORT=3000
[Install]
WantedBy=multi-user.target</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>保存文件后执行：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="41" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22%20sudo%20systemctl%20daemon-reload%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs"> sudo systemctl daemon-reload
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>接下来测试服务：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="40" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22sudo%20systemctl%20start%20rocketchat.service%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">sudo systemctl start rocketchat.service
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>如果服务启动Ok没有问题 ，我们把这个服务设置成自启动</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="39" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22sudo%20systemctl%20enable%20rocketchat.service%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">sudo systemctl enable rocketchat.service</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>.Net5 的后台接口程序也设置成自动启动</p>
<p>在/etc/systemd/system/目录下新建名称为kestrel-cah.service的文件</p>
<p>键入如下内容</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="38" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22%5BUnit%5D%5CnDescription%3DCAH%20Web%20API%20App%20running%20on%20Linux%5Cn%5Cn%5BService%5D%5CnWorkingDirectory%3D%2Fhome%2Fxamarin%2Fweb%2F%5Bdll%E6%89%80%E5%9C%A8%E5%9C%B0%E5%9D%80%5D%5CnExecStart%3D%2Fusr%2Flocal%2Fdotnet%2Fdotnet%20XXX.Web.Host.dll%5CnRestart%3Dalways%5Cn%23%20Restart%20service%20after%2010%20seconds%20if%20the%20dotnet%20service%20crashes%3A%5CnRestartSec%3D10%5CnKillSignal%3DSIGINT%5CnSyslogIdentifier%3Ddotnet-cah%5CnUser%3Dxamarin%5CnEnvironment%3DDOTNET_PRINT_TELEMETRY_MESSAGE%3Dfalse%5Cn%5Cn%5BInstall%5D%5CnWantedBy%3Dmulti-user.target%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">[Unit]
Description=CAH Web API App running on Linux

[Service]
WorkingDirectory=/home/xamarin/web/[dll所在地址]
ExecStart=/usr/local/dotnet/dotnet XXX.Web.Host.dll
Restart=always
# Restart service after 10 seconds if the dotnet service crashes:
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=dotnet-cah
User=xamarin
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>用同样的方法执行systemctl 的几个步骤</p>
<p>完成！</p>
<h2 id="Troubleshooting%3A">Troubleshooting:</h2>
<p>如果systemd有报错，可以通过如下命令查看</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="37" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22sudo%20systemctl%20status%20kestrel-cah.service%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">sudo systemctl status kestrel-cah.service</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="36" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22sudo%20journalctl%20-fu%20%20kestrel-cah.service%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">sudo journalctl -fu  kestrel-cah.service
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;默认情况下日志记录在syslog，如果看报错详细，可以通过如下命令查看</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="35" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22%20sudo%20cat%20%2Fvar%2Flog%2Fmessages%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs"> sudo cat /var/log/messages</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;</p>
<h2 id="%E4%BD%BF%E7%94%A8%E4%BC%A0%E7%BB%9F%E6%96%B9%E5%BC%8F%E9%83%A8%E7%BD%B2">使用传统方式部署</h2>
<h3><strong>确定版本</strong></h3>
<p>首先下载对应的Release版本，这里以2.4.14为例</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="34" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="Release 2.4.14 &middot; RocketChat/Rocket.Chat (github.com)" href="https://github.com/RocketChat/Rocket.Chat/releases/tag/2.4.14" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/RocketChat/Rocket.Chat/releases/tag/2.4.14" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2FRocketChat%2FRocket.Chat%2Freleases%2Ftag%2F2.4.14%22%2C%22text%22%3A%22Release%202.4.14%20%C2%B7%20RocketChat%2FRocket.Chat%20(github.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22pwjR9r-1653397801697%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="Release 2.4.14 &middot; RocketChat/Rocket.Chat (github.com)" data-widget="csdnlink">Release 2.4.14 &middot; RocketChat/Rocket.Chat (github.com)</a></span></p>
<p>根据文档安装和配置</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="33" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="Manual Installation - Rocket.Chat Docs" href="https://docs.rocket.chat/quick-start/installing-and-updating/other-deployment-methods/manual-installation" data-cke-enter-mode="2" data-cke-saved-href="https://docs.rocket.chat/quick-start/installing-and-updating/other-deployment-methods/manual-installation" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fdocs.rocket.chat%2Fquick-start%2Finstalling-and-updating%2Fother-deployment-methods%2Fmanual-installation%22%2C%22text%22%3A%22Manual%20Installation%20-%20Rocket.Chat%20Docs%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22FIAiGO-1653397801696%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="Manual Installation - Rocket.Chat Docs" data-widget="csdnlink">Manual Installation - Rocket.Chat Docs</a></span></p>
<p>&nbsp;</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="32" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/9497c27cd82f405e974cbbb62ba300b6.png" alt="" width="522" height="387" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/9497c27cd82f405e974cbbb62ba300b6.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F9497c27cd82f405e974cbbb62ba300b6.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22522%22%2C%22height%22%3A%22387%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></span></p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="32" data-cke-widget-wrapper="1"><span class="cke_reset cke_widget_drag_handler_container"><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片"><br /></span></span></span></span></p>
<p>注意我们待会要安装合适版本的Nodejs和Mongodb</p>
<h3 id="%E5%AE%89%E8%A3%85Nodejs%208.17.0">安装Nodejs 8.17.0</h3>
<p>先下载二进制包</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="31" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="https://nodejs.org/dist/v8.17.0/node-v8.17.0-linux-x64.tar.gz" href="https://nodejs.org/dist/v8.17.0/node-v8.17.0-linux-x64.tar.gz" data-cke-enter-mode="2" data-cke-saved-href="https://nodejs.org/dist/v8.17.0/node-v8.17.0-linux-x64.tar.gz" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fnodejs.org%2Fdist%2Fv8.17.0%2Fnode-v8.17.0-linux-x64.tar.gz%22%2C%22text%22%3A%22https%3A%2F%2Fnodejs.org%2Fdist%2Fv8.17.0%2Fnode-v8.17.0-linux-x64.tar.gz%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22ECKzCr-1653397801696%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="https://nodejs.org/dist/v8.17.0/node-v8.17.0-linux-x64.tar.gz" data-widget="csdnlink">https://nodejs.org/dist/v8.17.0/node-v8.17.0-linux-x64.tar.gz</a></span></p>
<p>将二进制包上传至目标机器的临时目录中(~/下载)</p>
<p>解压至/usr/local/nodejs安装目录</p>
<div>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="30" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20mkdir%20%2Fusr%2Flocal%2Fnodejs%20%5Cnsudo%20tar%20-zxvf%20node-v8.17.0-linux-x64.tar.gz%20-C%20%2Fusr%2Flocal%2Fnodejs%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo <span class="hljs-built_in">mkdir /usr/local/nodejs 
sudo tar -zxvf node-v8.17.0-linux-x64.tar.gz -C /usr/local/nodejs</span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
</div>
<p>&nbsp;打开.bashrc，设置环境变量NODE_PATH，并将它添加至PATH</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="29" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22%23%20Nodejs%5Cnexport%20NODE_PATH%3D%2Fusr%2Flocal%2Fnodejs%2Fnode-v8.17.0-linux-x64%5Cnexport%20PATH%3D%24PATH%3A%24NODE_PATH%2Fbin%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs"><span class="hljs-comment"># Nodejs
<span class="hljs-built_in">export NODE_PATH=/usr/local/nodejs/node-v8.17.0-linux-x64
<span class="hljs-built_in">export PATH=<span class="hljs-variable">$PATH:<span class="hljs-variable">$NODE_PATH/bin</span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>重新载入.bashrc&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="28" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22source%20~%2F.bashrc%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs"><span class="hljs-built_in">source ~/.bashrc</span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;查看node版本，已经可以显示，安装完成</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="27" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22node%20-version%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">node -version</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="26" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/238e2bbfa00a46048432af637268a742.png" alt="" width="342" height="32" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/238e2bbfa00a46048432af637268a742.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F238e2bbfa00a46048432af637268a742.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22342%22%2C%22height%22%3A%2232%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸"><span class="cke_widget_edit_container" title="编辑图片"><br /></span></span></span></span></p>
<p>&nbsp;</p>
<h3 id="%E5%AE%89%E8%A3%85MongoDB">安装MongoDB</h3>
<p>从官网下载二进制包&nbsp;</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="25" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="MongoDB Community Download | MongoDB" href="https://www.mongodb.com/try/download/community" data-cke-enter-mode="2" data-cke-saved-href="https://www.mongodb.com/try/download/community" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fwww.mongodb.com%2Ftry%2Fdownload%2Fcommunity%22%2C%22text%22%3A%22MongoDB%20Community%20Download%20%7C%20MongoDB%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22qJUulC-1653397801690%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="MongoDB Community Download | MongoDB" data-widget="csdnlink">MongoDB Community Download | MongoDB</a></span></p>
<p>&nbsp;将二进制包上传至目标机器的临时目录中(~/下载)</p>
<p>解压至cd /opt/mongodb/安装目录</p>
<div>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="24" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20mkdir%20cd%20%2Fopt%2Fmongodb%2F%5Cnsudo%20tar%20-zxvf%20mongodb-linux-x86_64-rhel80-4.4.12.tgz%20-C%20cd%20%2Fopt%2Fmongodb%2F%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo <span class="hljs-built_in">mkdir <span class="hljs-built_in">cd /opt/mongodb/
sudo tar -zxvf mongodb-linux-x86_64-rhel80-4.4.12.tgz -C <span class="hljs-built_in">cd /opt/mongodb/</span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
</div>
<p>&nbsp;打开.bashrc，设置环境变量NODE_PATH，并将它添加至PATH</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="23" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22%23%20Mongodb%5Cnexport%20MONGODB_HOME%3D%2Fopt%2Fmongodb%2Fmongodb-linux-x86_64-rhel80-4.4.12%5Cnexport%20PATH%3D%24PATH%3A%24MONGODB_HOME%2Fbin%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs"><span class="hljs-comment"># Mongodb
<span class="hljs-built_in">export MONGODB_HOME=/opt/mongodb/mongodb-linux-x86_64-rhel80-4.4.12
<span class="hljs-built_in">export PATH=<span class="hljs-variable">$PATH:<span class="hljs-variable">$MONGODB_HOME/bin</span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>重新载入.bashrc&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="22" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22source%20~%2F.bashrc%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs"><span class="hljs-built_in">source ~/.bashrc</span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>建立配置文件</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="21" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20nano%20~%2Fmongod.conf%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo nano ~/mongod.conf</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>键入以下内容</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="20" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22storage%3A%5Cn%20%20journal%3A%5Cn%20%20%20%20enabled%3A%20true%5Cn%20%20engine%3A%20wiredTiger%5Cn%5Cnnet%3A%5Cn%20%20port%3A%2027017%5Cn%20%20bindIpAll%3A%20true%5Cn%5CnprocessManagement%3A%5Cn%20%20timeZoneInfo%3A%20%2Fusr%2Fshare%2Fzoneinfo%5Cn%5Cnreplication%3A%5Cn%20%20replSetName%3A%20rs01%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">storage:
  journal:
    enabled: true
  engine: wiredTiger

net:
  port: 27017
  bindIpAll: true

processManagement:
  timeZoneInfo: /usr/share/zoneinfo

replication:
  replSetName: rs01</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;建立数据库存储目录</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="19" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20mkdir%20%2Fdata%2Fdb%5Cnsudo%20chmod%20777%20%2Fdata%2Fdb%2F%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo <span class="hljs-built_in">mkdir /data/db
sudo <span class="hljs-built_in">chmod 777 /data/db/</span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>注意，rocketchat需要开启分布式</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="18" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22mongo%20--eval%20%5C%22printjson(rs.initiate())%5C%22%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">mongo --<span class="hljs-built_in">eval <span class="hljs-string">"printjson(rs.initiate())"</span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>启动mongod，数据库已运行成功&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="17" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22mongod%20-f%20%2Fhome%2Fxamarin%2Fmongod.config%20%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">mongod -f /home/xamarin/mongod.config </code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>添加启动项<br />
&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="16" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20nano%20%2Fetc%2Fsystemd%2Fsystem%2Fmongod.service%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo nano /etc/systemd/system/mongod.service
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>键入以下内容&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="15" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22%5BUnit%5D%5CnDescription%3Dmongod%20running%20on%20Linux%5CnAfter%3Dnetwork.target%20remote-fs.target%20nss-lookup.target%20nginx.service%5Cn%5BService%5D%5CnExecStart%3D%2Fopt%2Fmongodb%2Fmongodb-linux-x86_64-rhel80-4.4.12%2Fbin%2Fmongod%20-f%20%2Fhome%2Fxamarin%2Fmongod.conf%5CnUser%3Dxamarin%5Cn%5BInstall%5D%5CnWantedBy%3Dmulti-user.target%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">[Unit]
Description=mongod running on Linux
After=network.target remote-fs.target nss-lookup.target nginx.service
[Service]
ExecStart=/opt/mongodb/mongodb-linux-x86_64-rhel80-4.4.12/bin/mongod -f /home/xamarin/mongod.conf
User=xamarin
[Install]
WantedBy=multi-user.target
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;[可选]如果在宿主机上使用数据库管理工具，则需要打开27017端口，以便外部访问</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="14" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20firewall-cmd%20--zone%3Dpublic%20--add-port%3D27017%2Ftcp%20--permanent%20%5Cnsudo%20firewall-cmd%20--reload%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo firewall-cmd --zone=public --add-port=27017/tcp --permanent 
sudo firewall-cmd --reload</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="13" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20semanage%20port%20-a%20-t%20http_port_t%20%20-p%20tcp%2027017%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo semanage port -a -t http_port_t  -p tcp 27017</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h3 id="%E5%AE%89%E8%A3%85Rocket.Chat%E6%9C%8D%E5%8A%A1">安装Rocket.Chat服务</h3>
<p>下载二进制包至目标机器的临时目录中(~/下载)</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="26" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22curl%20-L%20https%3A%2F%2Freleases.rocket.chat%2F2.4.14%2Fdownload%20-o%20~%2F%E4%B8%8B%E8%BD%BD%2Frocket.chat-2.4.14.tgz%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">curl -L https://releases.rocket.chat/2.4.14/download -o ~/下载/rocket.chat-2.4.14.tgz</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2023.cnblogs.com/blog/644861/202303/644861-20230302120804855-204843837.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>在网速不好的环境也可用迅雷下载后，将二进制包上传至临时目录中(~/下载)</p>
<p>解压至安装目录</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="25" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20mkdir%20%2Fopt%2Frocketchat%5Cnsudo%20tar%20-zxvf%20rocket.chat-2.4.14.tgz%20-C%20%2Fopt%2Frocketchat%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo <span class="hljs-built_in">mkdir /opt/rocketchat
sudo tar -zxvf rocket.chat-2.4.14.tgz -C /opt/rocketchat</span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2023.cnblogs.com/blog/644861/202303/644861-20230302120804855-204843837.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>安装编译服务工具</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="11" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20yum%20install%20gcc-c%2B%2B%5Cnsudo%20yum%20groupinstall%20'Development%20Tools'%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo yum install gcc-c++
sudo yum groupinstall <span class="hljs-string">'Development Tools'</span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>前往安装目录下的bundle/server</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="10" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22cd%20%2Fopt%2Frocketchat%2Fbundle%2Fserver%2F%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs"><span class="hljs-built_in">cd /opt/rocketchat/bundle/server/</span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>安装npm依赖包&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="9" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22npm%20i%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">npm i</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;添加启动项</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20nano%20%2Fetc%2Fsystemd%2Fsystem%2Frocketchat.service%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo nano /etc/systemd/system/rocketchat.service
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>键入以下内容</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22%5BUnit%5D%5CnDescription%3DThe%20Rocket.Chat%20server%20running%20on%20Linux%5CnAfter%3Dnetwork.target%20remote-fs.target%20nss-lookup.target%20nginx.service%20mongod.service%5Cn%5BService%5D%5CnExecStart%3D%2Fusr%2Flocal%2Fnodejs%2Fnode-v8.17.0-linux-x64%2Fbin%2Fnode%20%2Fopt%2Frocketchat%2Fbundle%2Fmain.js%5CnStandardOutput%3Dsyslog%5CnStandardError%3Dsyslog%5CnSyslogIdentifier%3Drocketchat%5CnUser%3Dxamarin%5CnEnvironment%3DROOT_URL%3Dhttp%3A%2F%2Flocalhost%3A3000%5CnEnvironment%3DPORT%3D3000%5CnEnvironment%3DMONGO_URL%3Dmongodb%3A%2F%2Flocalhost%3A27017%2Frocketchat%3FreplicaSet%3Drs01%5CnEnvironment%3DMONGO_OPLOG_URL%3Dmongodb%3A%2F%2Flocalhost%3A27017%2Flocal%3FreplicaSet%3Drs01%5Cn%5BInstall%5D%5CnWantedBy%3Dmulti-user.target%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">[Unit]
Description=The Rocket.Chat server running on Linux
After=network.target remote-fs.target nss-lookup.target nginx.service mongod.service
[Service]
ExecStart=/usr/local/nodejs/node-v8.17.0-linux-x64/bin/node /opt/rocketchat/bundle/main.js
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=rocketchat
User=xamarin
Environment=ROOT_URL=http://localhost:3000
Environment=PORT=3000
Environment=MONGO_URL=mongodb://localhost:27017/rocketchat?replicaSet=rs01
Environment=MONGO_OPLOG_URL=mongodb://localhost:27017/local?replicaSet=rs01
[Install]
WantedBy=multi-user.target
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;完成之后测试是否正常启动：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20systemctl%20daemon-reload%20%5Cnsudo%20systemctl%20start%20rocketchat.service%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo systemctl daemon-reload 
sudo systemctl start rocketchat.service
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20systemctl%20status%20rocketchat.service%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo systemctl status rocketchat.service
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>服务已经正常运行</p>
<p>&nbsp;&nbsp;<span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/5cfb4ffcfa12468fa45f8d0a3c8bde42.png" alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/5cfb4ffcfa12468fa45f8d0a3c8bde42.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F5cfb4ffcfa12468fa45f8d0a3c8bde42.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22%22%2C%22height%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片"><br /></span></span></span></span></p>
<p>&nbsp;将两个服务添加至开机启动项</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20systemctl%20enable%20rocketchat.service%5Cnsudo%20systemctl%20enable%20mongod.service%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo systemctl <span class="hljs-built_in">enable rocketchat.service
sudo systemctl <span class="hljs-built_in">enable mongod.service
</span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;</p>
<h2 id="TrubbleShooting%EF%BC%9A">TrubbleShooting：</h2>
<p>出现</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22%5C%22NotYetInitialized%3A%20Replication%20has%20not%20yet%20been%20configured%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">"NotYetInitialized: Replication has not yet been configured</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>Rocketchat要求配置mongodb的分布式，所以需要开启Replic方式，并且初始化Selector</p>
<p>&nbsp;</p>
<p>出现</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22getaddrinfo%20ENOTFOUND%20xxxx%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">getaddrinfo ENOTFOUND xxxx</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>xxxx为域名，需要将它添加至host文件中</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22xxxx%20127.0.0.1%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">xxxx 127.0.0.1</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220524211305174-29770356.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span></p>
<h2><span id="cke_bm_493S">&nbsp;使用Docker方式部署</span></h2>
<p>安装docker-compose</p>
<p>可以使用curl命令下载&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22curl%20-SL%20https%3A%2F%2Fgithub.com%2Fdocker%2Fcompose%2Freleases%2Fdownload%2Fv2.5.1%2Fdocker-compose-linux-x86_64%20-o%20%2Fusr%2Flocal%2Fbin%2Fdocker-compose%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">curl -SL https://github.com/docker/compose/releases/download/v2.5.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220609175436925-1982037647.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;在国内如果网络不好的情况下，可以用如下操作代替上面命令</p>
<p>下载二进制文件：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-linux-x86_64" href="https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-linux-x86_64" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-linux-x86_64" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fdocker%2Fcompose%2Freleases%2Fdownload%2Fv2.6.0%2Fdocker-compose-linux-x86_64%22%2C%22text%22%3A%22https%3A%2F%2Fgithub.com%2Fdocker%2Fcompose%2Freleases%2Fdownload%2Fv2.6.0%2Fdocker-compose-linux-x86_64%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22uBEFiy-1654768367292%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-linux-x86_64" data-widget="csdnlink">https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-linux-x86_64</a></span></p>
<p>将二进制文件拷贝至目标机器中的 /usr/local/bin/docker-compose<br />
&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20chmod%20%2Bx%20%2Fusr%2Flocal%2Fbin%2Fdocker-compose%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo <span class="hljs-built_in">chmod +x /usr/local/bin/docker-compose
</span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220609175436925-1982037647.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>查看是否安装完成&nbsp;</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/c38b240133fe48c784ca2d1d0440aede.png" alt="" width="350" height="35" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/c38b240133fe48c784ca2d1d0440aede.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fc38b240133fe48c784ca2d1d0440aede.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22350%22%2C%22height%22%3A%2235%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220609175436925-1982037647.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片"><br /></span></span></span></span></p>
<p>在sudoer信任的目录下创建docker-compose的软连接 ，以便以sudo方式执行docker-compose</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22sudo%20ln%20-s%20%2Fusr%2Flocal%2Fbin%2Fdocker-compose%20%2Fusr%2Fbin%2Fdocker-compose%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">sudo <span class="hljs-built_in">ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
</span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220609175436925-1982037647.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>在合适的目录下创建docker-compose.yml文件，并输入以下内容：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22version%3A%20'2'%5Cn%5Cnservices%3A%5Cn%20%20rocketchat%3A%5Cn%20%20%20%20image%3A%20registry.rocket.chat%2Frocketchat%2Frocket.chat%3A2.4.14%5Cn%20%20%20%20command%3A%20%3E%5Cn%20%20%20%20%20%20bash%20-c%5Cn%20%20%20%20%20%20%20%20%5C%22for%20i%20in%20%60seq%201%2030%60%3B%20do%5Cn%20%20%20%20%20%20%20%20%20%20node%20main.js%20%26%26%5Cn%20%20%20%20%20%20%20%20%20%20s%3D%24%24%3F%20%26%26%20break%20%7C%7C%20s%3D%24%24%3F%3B%5Cn%20%20%20%20%20%20%20%20%20%20echo%20%5C%5C%5C%22Tried%20%24%24i%20times.%20Waiting%205%20secs...%5C%5C%5C%22%3B%5Cn%20%20%20%20%20%20%20%20%20%20sleep%205%3B%5Cn%20%20%20%20%20%20%20%20done%3B%20(exit%20%24%24s)%5C%22%5Cn%20%20%20%20restart%3A%20unless-stopped%5Cn%20%20%20%20volumes%3A%5Cn%20%20%20%20%20%20-%20.%2Fuploads%3A%2Fapp%2Fuploads%5Cn%20%20%20%20environment%3A%5Cn%20%20%20%20%20%20-%20PORT%3D3000%5Cn%20%20%20%20%20%20-%20ROOT_URL%3Dhttp%3A%2F%2Flocalhost%3A3000%5Cn%20%20%20%20%20%20-%20MONGO_URL%3Dmongodb%3A%2F%2Fmongo%3A27017%2Frocketchat%5Cn%20%20%20%20%20%20-%20MONGO_OPLOG_URL%3Dmongodb%3A%2F%2Fmongo%3A27017%2Flocal%5Cn%20%20%20%20%20%20-%20REG_TOKEN%3D%24%7BREG_TOKEN%7D%5Cn%23%20%20%20%20%20%20%20-%20MAIL_URL%3Dsmtp%3A%2F%2Fsmtp.email%5Cn%23%20%20%20%20%20%20%20-%20HTTP_PROXY%3Dhttp%3A%2F%2Fproxy.domain.com%5Cn%23%20%20%20%20%20%20%20-%20HTTPS_PROXY%3Dhttp%3A%2F%2Fproxy.domain.com%5Cn%20%20%20%20depends_on%3A%5Cn%20%20%20%20%20%20-%20mongo%5Cn%20%20%20%20ports%3A%5Cn%20%20%20%20%20%20-%203000%3A3000%5Cn%20%20%20%20labels%3A%5Cn%20%20%20%20%20%20-%20%5C%22traefik.backend%3Drocketchat%5C%22%5Cn%20%20%20%20%20%20-%20%5C%22traefik.frontend.rule%3DHost%3A%20your.domain.tld%5C%22%5Cn%5Cn%20%20mongo%3A%5Cn%20%20%20%20image%3A%20mongo%3A4.0%5Cn%20%20%20%20restart%3A%20unless-stopped%5Cn%20%20%20%20volumes%3A%5Cn%20%20%20%20%20-%20.%2Fdata%2Fdb%3A%2Fdata%2Fdb%5Cn%20%20%20%20%20%23-%20.%2Fdata%2Fdump%3A%2Fdump%5Cn%20%20%20%20command%3A%20mongod%20--smallfiles%20--oplogSize%20128%20--replSet%20rs0%20--storageEngine%3Dmmapv1%5Cn%20%20%20%20labels%3A%5Cn%20%20%20%20%20%20-%20%5C%22traefik.enable%3Dfalse%5C%22%5Cn%5Cn%20%20%23%20this%20container's%20job%20is%20just%20run%20the%20command%20to%20initialize%20the%20replica%20set.%5Cn%20%20%23%20it%20will%20run%20the%20command%20and%20remove%20himself%20(it%20will%20not%20stay%20running)%5Cn%20%20mongo-init-replica%3A%5Cn%20%20%20%20image%3A%20mongo%3A4.0%5Cn%20%20%20%20command%3A%20%3E%5Cn%20%20%20%20%20%20bash%20-c%5Cn%20%20%20%20%20%20%20%20%5C%22for%20i%20in%20%60seq%201%2030%60%3B%20do%5Cn%20%20%20%20%20%20%20%20%20%20mongo%20mongo%2Frocketchat%20--eval%20%5C%5C%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20rs.initiate(%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20_id%3A%20'rs0'%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20members%3A%20%5B%20%7B%20_id%3A%200%2C%20host%3A%20'localhost%3A27017'%20%7D%20%5D%7D)%5C%5C%5C%22%20%26%26%5Cn%20%20%20%20%20%20%20%20%20%20s%3D%24%24%3F%20%26%26%20break%20%7C%7C%20s%3D%24%24%3F%3B%5Cn%20%20%20%20%20%20%20%20%20%20echo%20%5C%5C%5C%22Tried%20%24%24i%20times.%20Waiting%205%20secs...%5C%5C%5C%22%3B%5Cn%20%20%20%20%20%20%20%20%20%20sleep%205%3B%5Cn%20%20%20%20%20%20%20%20done%3B%20(exit%20%24%24s)%5C%22%5Cn%20%20%20%20depends_on%3A%5Cn%20%20%20%20%20%20-%20mongo%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">version: '2'

services:
  rocketchat:
    image: registry.rocket.chat/rocketchat/rocket.chat:2.4.14
    command: &gt;
      bash -c
        "for i in `seq 1 30`; do
          node main.js &amp;&amp;
          s=$$? &amp;&amp; break || s=$$?;
          echo \"Tried $$i times. Waiting 5 secs...\";
          sleep 5;
        done; (exit $$s)"
    restart: unless-stopped
    volumes:
      - ./uploads:/app/uploads
    environment:
      - PORT=3000
      - ROOT_URL=http://localhost:3000
      - MONGO_URL=mongodb://mongo:27017/rocketchat
      - MONGO_OPLOG_URL=mongodb://mongo:27017/local
      - REG_TOKEN=${REG_TOKEN}
#       - MAIL_URL=smtp://smtp.email
#       - HTTP_PROXY=http://proxy.domain.com
#       - HTTPS_PROXY=http://proxy.domain.com
    depends_on:
      - mongo
    ports:
      - 3000:3000
    labels:
      - "traefik.backend=rocketchat"
      - "traefik.frontend.rule=Host: your.domain.tld"

  mongo:
    image: mongo:4.0
    restart: unless-stopped
    volumes:
     - ./data/db:/data/db
     #- ./data/dump:/dump
    command: mongod --smallfiles --oplogSize 128 --replSet rs0 --storageEngine=mmapv1
    labels:
      - "traefik.enable=false"

  # this container's job is just run the command to initialize the replica set.
  # it will run the command and remove himself (it will not stay running)
  mongo-init-replica:
    image: mongo:4.0
    command: &gt;
      bash -c
        "for i in `seq 1 30`; do
          mongo mongo/rocketchat --eval \"
            rs.initiate({
              _id: 'rs0',
              members: [ { _id: 0, host: 'localhost:27017' } ]})\" &amp;&amp;
          s=$$? &amp;&amp; break || s=$$?;
          echo \"Tried $$i times. Waiting 5 secs...\";
          sleep 5;
        done; (exit $$s)"
    depends_on:
      - mongo</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220609175436925-1982037647.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>最后执行运行命令</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22sudo%20docker-compose%20up%20-d%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">sudo docker-compose up -d</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220609175436925-1982037647.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h2>TrubbleShooting：</h2>
<p>若运行中出现</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22code%22%3A%22find%3A%20'%2Fdata%2Fdb'%3A%20Permission%20denied%5Cnchown%3A%20changing%20ownership%20of%20'%2Fdata%2Fdb'%3A%20Permission%20denied%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="hljs">find: '/data/db': Permission denied
chown: changing ownership of '/data/db': Permission denied</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220609175436925-1982037647.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>解决办法</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22setenforce%200%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">setenforce 0</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202206/644861-20220609175436925-1982037647.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p><br />
</p>
<p>
<span data-cke-copybin-start="1">
<span data-cke-copybin-end="1">​</span></span><br />
</p>
<p>
<span data-cke-copybin-start="1">
<span data-cke-copybin-end="1">​</span></span></p>