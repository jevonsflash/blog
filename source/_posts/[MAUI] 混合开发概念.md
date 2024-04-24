---
thumbnail: images/b6ee43c2e343cfc78508ccef68c9d5d3.png
title: '[MAUI] 混合开发概念'
excerpt: >-
  混合开发的概念是相对与原生开发来说的：App不直接运行原生程序，而是在原生程序中运行一个Web程序，原生程序中包含Web运行时，用于承载Web页面。暂且将原生应用称之为Web容器，Web容器应该能让JavaScript代码与原生平台的代码交互，互相调用，同时为上层提供交互逻辑，例如导航，事件，Cookie，刷新等内容。之前使用Xamarin可以利用WebView控件做混合开发，但是到目前为止WebView功能还是比较孱弱。用WebView实现混合开发主要是通过重写各个平台的自定义呈现器（Renderer
tags:
  - Xamarin
  - .net
  - MAUI
  - XAML
categories:
  - .NET MAUI
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2022-01-15 10:15:00/[MAUI] 混合开发概念.html'
abbrlink: f9023f4a
date: 2022-01-15 10:15:00
cover:
description:
---
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span></p>
<p>混合开发的概念是相对与原生开发来说的：App不直接运行原生程序，而是在原生程序中运行一个Web程序，原生程序中包含Web运行时，用于承载Web页面。暂且将原生应用称之为Web容器，Web容器应该能让JavaScript代码与原生平台的代码交互，互相调用，同时为上层提供交互逻辑，例如导航，事件，Cookie，刷新等内容。</p>
<p>之前使用Xamarin可以利用WebView控件做混合开发，但是到目前为止WebView功能还是比较孱弱。用WebView实现混合开发主要是通过重写各个平台的自定义呈现器（Renderer）编写逻辑对其进行自定义，将JavaScript代码注入，实现调用C#代码的功能。自己要实现较完整和好用的Web容器比较困难，像Xam.pluging和Xamarin Community Toolkit等社区也有较好的WebView实现 ，Xamarin对各平台的呈现器如下：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1">
<p class="cke_widget_element" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fimg_convert%2Fb6ee43c2e343cfc78508ccef68c9d5d3.png%22%2C%22alt%22%3A%22WebView%20%E7%B1%BB%E5%8F%8A%E5%85%B6%E5%AE%9E%E7%8E%B0%E6%9C%AC%E6%9C%BA%E7%B1%BB%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E7%B3%BB%22%2C%22width%22%3A%22%22%2C%22height%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22center%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image"><span class="cke_image_resizer_wrapper"><img src="https://img-blog.csdnimg.cn/img_convert/b6ee43c2e343cfc78508ccef68c9d5d3.png" alt="WebView 类及其实现本机类之间的关系" data-cke-saved-src="https://img-blog.csdnimg.cn/img_convert/b6ee43c2e343cfc78508ccef68c9d5d3.png" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></p>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101527410-730125684.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;如今Maui的Preview版本已经发布，该版本将Xamarin SDK统一到.Net6，并起了个全新的名称&nbsp;Multi-platform App UI（MAUI）， 无论是Xamarin还是MAUI，底层还是用的还是mono，编程方式不变，但现在它已作为.Net6核心的内容发布，与同属 Asp.net 6 的&nbsp;Blazor共享相同的基类库，这意味着可以在Maui上使用Blazor了，打开VisualStudio 2022 Preview，创建新项目，可以选择Maui Blazor App模板作为混合开发项目（如下图），这两个框架可以算是目前微软最先进的技术。</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/2d59e3cfe88e451f95bb4f33d6fd3de9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_20,color_FFFFFF,t_70,g_se,x_16" alt="" width="1026" height="679" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/2d59e3cfe88e451f95bb4f33d6fd3de9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_20,color_FFFFFF,t_70,g_se,x_16" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F2d59e3cfe88e451f95bb4f33d6fd3de9.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_20%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%221026%22%2C%22height%22%3A%22679%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101527410-730125684.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>我们用<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="&nbsp;BlazorWebView" href="https://github.com/dotnet/maui/tree/main/src/BlazorWebView" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/dotnet/maui/tree/main/src/BlazorWebView" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fdotnet%2Fmaui%2Ftree%2Fmain%2Fsrc%2FBlazorWebView%22%2C%22text%22%3A%22%C2%A0BlazorWebView%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.5%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLA92%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.7%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLBL2%22%2C%22id%22%3A%22f2VIeU-1642212876488%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release1.9.5/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=LA92" data-link-title="&nbsp;BlazorWebView" data-widget="csdnlink">&nbsp;BlazorWebView</a>&nbsp;这个控件代替之前的WebView，实现js与C#交互，</span></p>
<p>其实Blazor引擎很强大，不止于js与C#交互的这一功能，&nbsp;介于目前国内大多数的web技术用的是Vue，React等模板引擎，下一章节我们将Vue技术结合进来，打造最目前强混合开发框架！</p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-end="1">​</span></span></p>