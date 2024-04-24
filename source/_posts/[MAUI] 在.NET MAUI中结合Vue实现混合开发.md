---
thumbnail: >-
  images/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_20,color_FFFFFF,t_70,g_se,x_16
title: '[MAUI] 在.NET MAUI中结合Vue实现混合开发'
excerpt: >-
  在MAUI微软的官方方案是使用Blazor开发，但是当前市场大多数的Web项目使用Vue，React等技术构建，如果我们没法绕过已经积累的技术，用Blazor重写整个项目并不现实。Vue是当前流行的web框架，
  简单来说是一套模板引擎，利用“模板”和“绑定”两大特性实现web页面mvvm模式开发。利用.NET
  MAUI框架可以将Vue应用嵌入到Web容器中。可以实现跨平台的混合开发。例如我在某医疗行业项目中，已经用这个混合开发的方式生成应用，Vue代码不需要做什么改动，就能跨平台运行：如果你
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
uniqueId: '2022-01-15 10:17:00/[MAUI] 在.NET MAUI中结合Vue实现混合开发.html'
abbrlink: edab1881
date: 2022-01-15 10:17:00
cover:
description:
---
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span></p>
<p><span id="cke_bm_3172S">&nbsp;在MAUI微软的官方方案是使用Blazor开发，但是当前市场大多数的Web项目使用Vue，React等技术构建，如果我们没法绕过已经积累的技术，用Blazor重写整个项目并不现实。</span></p>
<p>Vue是当前流行的web框架， 简单来说是一套模板引擎，利用&ldquo;模板&rdquo;和&ldquo;绑定&rdquo;两大特性实现web页面mvvm模式开发。利用.NET MAUI框架可以将Vue应用嵌入到Web容器中。可以实现跨平台的混合开发。</p>
<p>例如我在某医疗行业项目中，已经用这个混合开发的方式生成应用，Vue代码不需要做什么改动，就能跨平台运行：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="25" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422430-1011534331.png" alt="" width="1200" height="942" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422430-1011534331.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fa0fce0c742b44e93867836fb0eb3dfe3.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_20%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%221200%22%2C%22height%22%3A%22942%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>如果你有一套Vue开发的网站，可以根据这篇文章，尝试移值进你的iPhone，Android以及平板电脑等移动设备。</p>
<p>混合开发的核心工作是构建Web与.net 的互操作，我们将利用Blazor引擎的如下功能：</p>
<ul>
<li>资源的统一管理</li>
<li>js代码的注入</li>
<li>js调用C#代码</li>
<li>C#调用js代码</li>
</ul>
<p>如果你还不了解混合开发的概念，请回看上一章节<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_wrapper_has-card cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="24" data-cke-widget-wrapper="1"><a class="has-card cke_widget_editable cke_widget_element" title="[MAUI] 混合开发概念_jevonsflash的专栏-CSDN博客" href="https://blog.csdn.net/jevonsflash/article/details/121835547" data-cke-enter-mode="2" data-cke-saved-href="https://blog.csdn.net/jevonsflash/article/details/121835547" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fblog.csdn.net%2Fjevonsflash%2Farticle%2Fdetails%2F121835547%22%2C%22text%22%3A%22%5BMAUI%5D%20%E6%B7%B7%E5%90%88%E5%BC%80%E5%8F%91%E6%A6%82%E5%BF%B5_jevonsflash%E7%9A%84%E4%B8%93%E6%A0%8F-CSDN%E5%8D%9A%E5%AE%A2%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.5%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLA92%22%2C%22isCard%22%3Atrue%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.7%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLBL2%22%2C%22id%22%3A%22Rvwcdw-1642212941185%22%2C%22classes%22%3A%7B%22has-card%22%3A1%7D%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422019-413593844.png" data-link-title="[MAUI] 混合开发概念_jevonsflash的专栏-CSDN博客" data-widget="csdnlink"><span class="link-card-box"><span class="link-title">[MAUI] 混合开发概念_jevonsflash的专栏-CSDN博客<span class="link-link"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422019-413593844.png" alt=" " class="link-link-icon" data-cke-realelement="%3Cimg%20class%3D%22link-link-icon%22%20alt%3D%22%20%22%20src%3D%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.5%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLA92%22%2F%3E" />https://blog.csdn.net/jevonsflash/article/details/121835547</span></span></span></a></span></p>
<p>整个工作分为MAUI部分，Vue部分和混合改造。</p>
<h2>MAUI部分</h2>
<p>创建Maui App项目：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="23" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422300-344201630.png" alt="" width="533" height="241" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422300-344201630.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F38be82cb61e947efa1c4ff0533a21806.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_20%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22533%22%2C%22height%22%3A%22241%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>你也可以创建&nbsp;Maui Blazor App 项目，命名为MatoProject，但是这个模板主要围绕Blazor开发，有的功能我们并不需要，得删很多文件。</p>
<p>创建完成后编辑MatoProject.csproj，在Sdk最末尾加上.Razor，VS会自动安装Microsoft.AspNetCore.Components.WebView.Maui依赖包（注意不要手动Nuget添加这个包，否则程序无法运行）</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="22" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422496-837900635.png" alt="" width="323" height="36" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422496-837900635.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fd5046339ea694bb097e08d91f7ece242.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_12%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22323%22%2C%22height%22%3A%2236%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="21" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422405-166395868.png" alt="" width="481" height="151" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422405-166395868.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fce4f9f38a9a24ba897b1014b8e56d27a.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_19%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22481%22%2C%22height%22%3A%22151%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;安装完成后在项目目录中创建一个wwwroot文件夹</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="20" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422404-765965590.png" alt="" width="180" height="47" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422404-765965590.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F931b81d73ad34ba69e6cb4cbc58f9118.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22180%22%2C%22height%22%3A%2247%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>这个文件夹将是混合开发Web部分的根目录，这个名称不能随便定义，我们看看为什么：</p>
<p>打开Microsoft.AspNetCore.Components.WebView.Maui.targets这个文件：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="19" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422441-1423274788.png" alt="" width="855" height="227" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422441-1423274788.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fde234669350b4413b33586e45b8eee5d.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_20%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22855%22%2C%22height%22%3A%22227%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>我们可以看到构建项目时，这个库会将wwwroot文件夹里的内容作为Maui资源（MauiAsset）类型设置标签，编译器则会根据MauiAsset标签将这些内容打包进各个平台的资源文件夹，具体的Maui资源类型可以参考这个文章<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="18" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title=".NET MAUI &ndash; Manage App Resources &ndash; Developer Thoughts (egvijayanand.in)" href="https://egvijayanand.in/2021/08/20/net-maui-manage-app-resources/" data-cke-enter-mode="2" data-cke-saved-href="https://egvijayanand.in/2021/08/20/net-maui-manage-app-resources/" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fegvijayanand.in%2F2021%2F08%2F20%2Fnet-maui-manage-app-resources%2F%22%2C%22text%22%3A%22.NET%20MAUI%20%E2%80%93%20Manage%20App%20Resources%20%E2%80%93%20Developer%20Thoughts%20(egvijayanand.in)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.5%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLA92%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.7%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLBL2%22%2C%22id%22%3A%22ROPeMo-1642212941182%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422019-413593844.png" data-link-title=".NET MAUI &ndash; Manage App Resources &ndash; Developer Thoughts (egvijayanand.in)" data-widget="csdnlink">.NET MAUI &ndash; Manage App Resources &ndash; Developer Thoughts (egvijayanand.in)</a>&nbsp;，</span></p>
<p>打开MauiProgram.cs 在builder 中注册BlazorMauiWebView组件，在服务中使用扩展方法AddBlazorWebView()来添加相关Blazor的服务</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="17" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22using%20Microsoft.Maui%3B%5Cnusing%20Microsoft.Maui.Hosting%3B%5Cnusing%20Microsoft.Maui.Controls.Compatibility%3B%5Cnusing%20Microsoft.Maui.Controls.Hosting%3B%5Cnusing%20Microsoft.AspNetCore.Components.WebView.Maui%3B%5Cnusing%20Microsoft.Extensions.DependencyInjection%3B%5Cn%5Cnnamespace%20MatoProject%5Cn%7B%5Cn%5Ctpublic%20static%20class%20MauiProgram%5Cn%5Ct%7B%5Cn%5Ct%5Ctpublic%20static%20MauiApp%20CreateMauiApp()%5Cn%5Ct%5Ct%7B%5Cn%5Ct%5Ct%5Ctvar%20builder%20%3D%20MauiApp.CreateBuilder()%3B%5Cn%5Ct%5Ct%5Ctbuilder%5Cn%5Ct%5Ct%5Ct%5Ct.RegisterBlazorMauiWebView()%5Cn%5Ct%5Ct%5Ct%5Ct.UseMauiApp%3CApp%3E()%5Cn%5Ct%5Ct%5Ct%5Ct.ConfigureFonts(fonts%20%3D%3E%5Cn%5Ct%5Ct%5Ct%5Ct%7B%5Cn%5Ct%5Ct%5Ct%5Ct%5Ctfonts.AddFont(%5C%22OpenSans-Regular.ttf%5C%22%2C%20%5C%22OpenSansRegular%5C%22)%3B%5Cn%5Ct%5Ct%5Ct%5Ct%7D)%3B%5Cn%5Ct%5Ct%5Ctbuilder.Services.AddBlazorWebView()%3B%5Cn%5Ct%5Ct%5Ctreturn%20builder.Build()%3B%5Cn%5Ct%5Ct%7D%5Cn%5Ct%7D%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">using Microsoft.Maui;
<span class="hljs-keyword">using Microsoft.Maui.Hosting;
<span class="hljs-keyword">using Microsoft.Maui.Controls.Compatibility;
<span class="hljs-keyword">using Microsoft.Maui.Controls.Hosting;
<span class="hljs-keyword">using Microsoft.AspNetCore.Components.WebView.Maui;
<span class="hljs-keyword">using Microsoft.Extensions.DependencyInjection;

<span class="hljs-keyword">namespace <span class="hljs-title">MatoProject
{
	<span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-keyword">class <span class="hljs-title">MauiProgram
	{
		<span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static MauiApp <span class="hljs-title">CreateMauiApp()
		{
			<span class="hljs-keyword">var builder = MauiApp.CreateBuilder();
			builder
				.RegisterBlazorMauiWebView()
				.UseMauiApp&lt;App&gt;()
				.ConfigureFonts(fonts =&gt;
				{
					fonts.AddFont(<span class="hljs-string">"OpenSans-Regular.ttf", <span class="hljs-string">"OpenSansRegular");
				});
			builder.Services.AddBlazorWebView();
			<span class="hljs-keyword">return builder.Build();
		}
	}
}</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>打开MainPage.xaml，编辑原生应用的主页面：</p>
<p>建立BlazorWebView控件铺满屏幕，并设置HostPage为Web部分的主页index.html</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="16" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22XML%22%2C%22code%22%3A%22%3CContentPage%20xmlns%3D%5C%22http%3A%2F%2Fschemas.microsoft.com%2Fdotnet%2F2021%2Fmaui%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20xmlns%3Ax%3D%5C%22http%3A%2F%2Fschemas.microsoft.com%2Fwinfx%2F2009%2Fxaml%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20x%3AClass%3D%5C%22MatoProject.MainPage%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20xmlns%3Ab%3D%5C%22clr-namespace%3AMicrosoft.AspNetCore.Components.WebView.Maui%3Bassembly%3DMicrosoft.AspNetCore.Components.WebView.Maui%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20BackgroundColor%3D%5C%22%7BDynamicResource%20SecondaryColor%7D%5C%22%3E%5Cn%5Cn%20%20%20%20%3CGrid%3E%5Cn%20%20%20%20%20%20%20%20%3Cb%3ABlazorWebView%20HostPage%3D%5C%22wwwroot%2Findex.html%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Cb%3ABlazorWebView.RootComponents%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cb%3ARootComponent%20Selector%3D%5C%22%23blazorapp%5C%22%20x%3AName%3D%5C%22MainWebView%5C%22%20ComponentType%3D%5C%22%7Bx%3AType%20local%3AIndex%7D%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fb%3ABlazorWebView.RootComponents%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Fb%3ABlazorWebView%3E%5Cn%20%20%20%20%3C%2FGrid%3E%5Cn%3C%2FContentPage%3E%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-XML hljs"><span class="hljs-tag">&lt;<span class="hljs-name">ContentPage <span class="hljs-attr">xmlns=<span class="hljs-string">"http://schemas.microsoft.com/dotnet/2021/maui"
             <span class="hljs-attr">xmlns:x=<span class="hljs-string">"http://schemas.microsoft.com/winfx/2009/xaml"
             <span class="hljs-attr">x:Class=<span class="hljs-string">"MatoProject.MainPage"
             <span class="hljs-attr">xmlns:b=<span class="hljs-string">"clr-namespace:Microsoft.AspNetCore.Components.WebView.Maui;assembly=Microsoft.AspNetCore.Components.WebView.Maui"
             <span class="hljs-attr">BackgroundColor=<span class="hljs-string">"{DynamicResource SecondaryColor}"&gt;

    <span class="hljs-tag">&lt;<span class="hljs-name">Grid&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">b:BlazorWebView <span class="hljs-attr">HostPage=<span class="hljs-string">"wwwroot/index.html"&gt;
            <span class="hljs-tag">&lt;<span class="hljs-name">b:BlazorWebView.RootComponents&gt;
                <span class="hljs-tag">&lt;<span class="hljs-name">b:RootComponent <span class="hljs-attr">Selector=<span class="hljs-string">"#blazorapp" <span class="hljs-attr">x:Name=<span class="hljs-string">"MainWebView" <span class="hljs-attr">ComponentType=<span class="hljs-string">"{x:Type local:Index}/&gt;
            &lt;/b:BlazorWebView.RootComponents&gt;
        &lt;/b:BlazorWebView&gt;
    &lt;/Grid&gt;
&lt;/ContentPage&gt;</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h3>&nbsp;</h3>
<p>建立_import.razor</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="15" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22XML%22%2C%22code%22%3A%22%40using%20System.Net.Http%5Cn%40using%20Microsoft.AspNetCore.Components.Forms%5Cn%40using%20Microsoft.AspNetCore.Components.Routing%5Cn%40using%20Microsoft.AspNetCore.Components.Web%5Cn%40using%20Microsoft.AspNetCore.Components.Web.Virtualization%5Cn%40using%20Microsoft.JSInterop%5Cn%40using%20MatoProject%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-XML hljs">@using System.Net.Http
@using Microsoft.AspNetCore.Components.Forms
@using Microsoft.AspNetCore.Components.Routing
@using Microsoft.AspNetCore.Components.Web
@using Microsoft.AspNetCore.Components.Web.Virtualization
@using Microsoft.JSInterop
@using MatoProject
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h2>Vue部分</h2>
<p>至此我们建立好了原生开发的Web容器，接下来需要处理Vue项目了：</p>
<p>cd到项目目录，使用vue-cli创建一个空白Vue项目：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="14" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422377-1137423788.png" alt="" width="613" height="205" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422377-1137423788.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F606bd6aa7af24b18a1e4fff99ebab3c3.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_20%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22613%22%2C%22height%22%3A%22205%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;这里可以按照Vue的编程喜好建立，比如我选择了2.0项目，支持Typescript，es6的class命名方式等，最终都要通过webpack打包成静态资源，所以无所谓。</p>
<p>建立src/api/fooService.ts，创建如下的函数：</p>
<p>window['DotNet']对象将是MAUI Blazor中注入的交互操作对象</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="13" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22export%20async%20function%20GetAll(data)%20%7B%5Cn%20%20%20%20var%20result%20%3D%20null%5Cn%20%20%20%20%20%20%20%20await%20window%5B'DotNet'%5D.invokeMethodAsync('MatoProject'%2C%20'GetFoo')%5Cn%20%20%20%20%20%20%20%20%20%20%20%20.then(data%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20console.log(%5C%22DotNet%20method%20return%20the%20value%3A%5C%22%20%2B%20data)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20result%20%3D%20data%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20return%20result%5Cn%7D%5Cn%5Cn%5Cnexport%20async%20function%20Add(data)%20%7B%5Cn%20%20%20%20var%20result%20%3D%20null%5Cn%20%20%20%20%20%20%20%20await%20window%5B'DotNet'%5D.invokeMethodAsync('MatoProject'%2C%20'Add'%2C%20data)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20.then(data%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20console.log(%5C%22DotNet%20method%20return%20the%20value%3A%5C%22%20%2B%20data)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20result%20%3D%20data%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20return%20result%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-keyword">export <span class="hljs-keyword">async <span class="hljs-keyword">function <span class="hljs-title function_">GetAll(<span class="hljs-params">data) {
    <span class="hljs-keyword">var result = <span class="hljs-literal">null
        <span class="hljs-keyword">await <span class="hljs-variable language_">window[<span class="hljs-string">'DotNet'].<span class="hljs-title function_">invokeMethodAsync(<span class="hljs-string">'MatoProject', <span class="hljs-string">'GetFoo')
            .<span class="hljs-title function_">then(<span class="hljs-function"><span class="hljs-params">data =&gt; {
                <span class="hljs-variable language_">console.<span class="hljs-title function_">log(<span class="hljs-string">"DotNet method return the value:" + data);
                result = data
            });
    <span class="hljs-keyword">return result
}


<span class="hljs-keyword">export <span class="hljs-keyword">async <span class="hljs-keyword">function <span class="hljs-title function_">Add(<span class="hljs-params">data) {
    <span class="hljs-keyword">var result = <span class="hljs-literal">null
        <span class="hljs-keyword">await <span class="hljs-variable language_">window[<span class="hljs-string">'DotNet'].<span class="hljs-title function_">invokeMethodAsync(<span class="hljs-string">'MatoProject', <span class="hljs-string">'Add', data)
            .<span class="hljs-title function_">then(<span class="hljs-function"><span class="hljs-params">data =&gt; {
                <span class="hljs-variable language_">console.<span class="hljs-title function_">log(<span class="hljs-string">"DotNet method return the value:" + data);
                result = data
            });
    <span class="hljs-keyword">return result
}</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>打开Home.vue 编辑：</p>
<p>这是Web的主页面，我们需要三个按钮以及相关函数，测试js与C#的交互操作。</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="12" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22html%22%2C%22code%22%3A%22%3Ctemplate%3E%5Cn%20%20%3Cdiv%20class%3D%5C%22home%5C%22%3E%5Cn%20%20%20%20%3Cimg%20alt%3D%5C%22Vue%20logo%5C%22%20src%3D%5C%22..%2Fassets%2Flogo.png%5C%22%20%2F%3E%5Cn%20%20%20%20%3Cdiv%3E%5Cn%20%20%20%20%20%20%3Ch3%3Efoo%3A%3C%2Fh3%3E%5Cn%20%20%20%20%20%20%3Cbutton%20%40click%3D%5C%22getFoo%5C%22%3Eclick%20to%20get%20foo%3C%2Fbutton%3E%5Cn%20%20%20%20%20%20%3Cbr%20%2F%3E%5Cn%20%20%20%20%20%20%3Cspan%3E%7B%7B%20foo%20%7D%7D%3C%2Fspan%3E%5Cn%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%3Cdiv%3E%5Cn%20%20%20%20%20%20%3Ch3%3Ebar%3A%3C%2Fh3%3E%5Cn%20%20%20%20%20%20%3Cspan%3E%7B%7B%20bar%20%7D%7D%3C%2Fspan%3E%5Cn%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%3Cdiv%3E%5Cn%20%20%20%20%20%20%3Cbutton%20%40click%3D%5C%22add%5C%22%3Eclick%20here%20to%20add%3C%2Fbutton%3E%5Cn%20%20%20%20%20%20%3Cspan%3Eclick%20count%3A%7B%7B%20cnt%20%7D%7D%3C%2Fspan%3E%5Cn%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%3C%2Fdiv%3E%5Cn%3C%2Ftemplate%3E%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-html hljs"><span class="hljs-tag">&lt;<span class="hljs-name">template&gt;
  <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">class=<span class="hljs-string">"home"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">img <span class="hljs-attr">alt=<span class="hljs-string">"Vue logo" <span class="hljs-attr">src=<span class="hljs-string">"../assets/logo.png" /&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">div&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">h3&gt;foo:<span class="hljs-tag">&lt;/<span class="hljs-name">h3&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">button @<span class="hljs-attr">click=<span class="hljs-string">"getFoo"&gt;click to get foo<span class="hljs-tag">&lt;/<span class="hljs-name">button&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">br /&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">span&gt;{{ foo }}<span class="hljs-tag">&lt;/<span class="hljs-name">span&gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">div&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">h3&gt;bar:<span class="hljs-tag">&lt;/<span class="hljs-name">h3&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">span&gt;{{ bar }}<span class="hljs-tag">&lt;/<span class="hljs-name">span&gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">div&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">button @<span class="hljs-attr">click=<span class="hljs-string">"add"&gt;click here to add<span class="hljs-tag">&lt;/<span class="hljs-name">button&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">span&gt;click count:{{ cnt }}<span class="hljs-tag">&lt;/<span class="hljs-name">span&gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
  <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
<span class="hljs-tag">&lt;/<span class="hljs-name">template&gt;</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="11" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22%5Cn%3Cscript%20lang%3D%5C%22ts%5C%22%3E%5Cnimport%20%7B%20Component%2C%20Vue%20%7D%20from%20%5C%22vue-property-decorator%5C%22%3B%5Cnimport%20HelloWorld%20from%20%5C%22%40%2Fcomponents%2FHelloWorld.vue%5C%22%3B%20%2F%2F%20%40%20is%20an%20alias%20to%20%2Fsrc%5Cnimport%20%7B%20GetAll%2C%20Add%20%7D%20from%20%5C%22%40%2Fapi%2FfooService%5C%22%3B%5Cn%5Cn%40Component(%7B%5Cn%20%20components%3A%20%7B%5Cn%20%20%20%20HelloWorld%2C%5Cn%20%20%7D%2C%5Cn%7D)%5Cnexport%20default%20class%20Home%20extends%20Vue%20%7B%5Cn%20%20foo%3A%20string%20%3D%20%5C%22%5C%22%3B%5Cn%20%20bar%3A%20string%20%3D%20%5C%22%5C%22%3B%5Cn%20%20cnt%3A%20number%20%3D%200%3B%5Cn%5Cn%20%20async%20created()%20%7B%5Cn%20%20%20%20window%5B%5C%22postBar%5C%22%5D%20%3D%20this.postBar%3B%5Cn%20%20%7D%5Cn%20%20async%20add()%20%7B%5Cn%20%20%20%20this.cnt%20%3D%20await%20Add(%7B%20a%3A%20this.cnt%2C%20b%3A%201%20%7D)%3B%5Cn%20%20%7D%5Cn%5Cn%20%20async%20getFoo()%20%7B%5Cn%20%20%20%20var%20foo%20%3D%20await%20GetAll(null)%3B%5Cn%20%20%20%20this.foo%20%3D%20foo%3B%5Cn%20%20%7D%5Cn%5Cn%20%20async%20postBar(data)%20%7B%5Cn%20%20%20%20this.bar%20%3D%20data%3B%5Cn%20%20%20%20console.log(%5C%22DotNet%20invocked%20the%20function%20with%20param%3A%5C%22%20%2B%20data)%3B%5Cn%20%20%20%20return%20this.bar%3B%5Cn%20%20%7D%5Cn%7D%5Cn%3C%2Fscript%3E%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs">
&lt;script lang=<span class="hljs-string">"ts"&gt;
<span class="hljs-keyword">import { <span class="hljs-title class_">Component, <span class="hljs-title class_">Vue } <span class="hljs-keyword">from <span class="hljs-string">"vue-property-decorator";
<span class="hljs-keyword">import <span class="hljs-title class_">HelloWorld <span class="hljs-keyword">from <span class="hljs-string">"@/components/HelloWorld.vue"; <span class="hljs-comment">// @ is an alias to /src
<span class="hljs-keyword">import { <span class="hljs-title class_">GetAll, <span class="hljs-title class_">Add } <span class="hljs-keyword">from <span class="hljs-string">"@/api/fooService";

<span class="hljs-meta">@Component({
  <span class="hljs-attr">components: {
    <span class="hljs-title class_">HelloWorld,
  },
})
<span class="hljs-keyword">export <span class="hljs-keyword">default <span class="hljs-keyword">class <span class="hljs-title class_">Home <span class="hljs-keyword">extends <span class="hljs-title class_ inherited__">Vue {
  <span class="hljs-attr">foo: <span class="hljs-built_in">string = <span class="hljs-string">"";
  <span class="hljs-attr">bar: <span class="hljs-built_in">string = <span class="hljs-string">"";
  <span class="hljs-attr">cnt: <span class="hljs-built_in">number = <span class="hljs-number">0;

  <span class="hljs-keyword">async <span class="hljs-title function_">created() {
    <span class="hljs-variable language_">window[<span class="hljs-string">"postBar"] = <span class="hljs-variable language_">this.<span class="hljs-property">postBar;
  }
  <span class="hljs-keyword">async <span class="hljs-title function_">add() {
    <span class="hljs-variable language_">this.<span class="hljs-property">cnt = <span class="hljs-keyword">await <span class="hljs-title class_">Add({ <span class="hljs-attr">a: <span class="hljs-variable language_">this.<span class="hljs-property">cnt, <span class="hljs-attr">b: <span class="hljs-number">1 });
  }

  <span class="hljs-keyword">async <span class="hljs-title function_">getFoo() {
    <span class="hljs-keyword">var foo = <span class="hljs-keyword">await <span class="hljs-title class_">GetAll(<span class="hljs-literal">null);
    <span class="hljs-variable language_">this.<span class="hljs-property">foo = foo;
  }

  <span class="hljs-keyword">async <span class="hljs-title function_">postBar(<span class="hljs-params">data) {
    <span class="hljs-variable language_">this.<span class="hljs-property">bar = data;
    <span class="hljs-variable language_">console.<span class="hljs-title function_">log(<span class="hljs-string">"DotNet invocked the function with param:" + data);
    <span class="hljs-keyword">return <span class="hljs-variable language_">this.<span class="hljs-property">bar;
  }
}
&lt;/script&gt;
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>到此已经完成了一个简单的Vue项目</p>
<p>运行打包命令：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="10" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22PS%20D%3A%5C%5CProject%5C%5Cmaui-vue-hybirddev%5C%5Chybird-host%3E%20yarn%20build%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">PS D:\Project\maui-vue-hybirddev\hybird-host&gt; yarn build</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>将dist目录中的所有内容复制到wwwroot文件夹下。</p>
<h2>混合改造</h2>
<p>这是混合开发的重点，改造MAUI项目，以适配Vue</p>
<p>打开wwwroot/index.js重写为：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="9" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22html%22%2C%22code%22%3A%22%3C!DOCTYPE%20html%3E%5Cn%3Chtml%20lang%3D%5C%22%5C%22%3E%5Cn%3Chead%3E%5Cn%20%20%20%20%3Cmeta%20charset%3D%5C%22utf-8%5C%22%3E%5Cn%20%20%20%20%3Cmeta%20http-equiv%3D%5C%22X-UA-Compatible%5C%22%20content%3D%5C%22IE%3Dedge%5C%22%3E%5Cn%20%20%20%20%3Cmeta%20name%3D%5C%22viewport%5C%22%20content%3D%5C%22width%3Ddevice-width%2Cinitial-scale%3D1%5C%22%3E%5Cn%20%20%20%20%3Clink%20rel%3D%5C%22icon%5C%22%20href%3D%5C%22favicon.ico%5C%22%3E%5Cn%20%20%20%20%3Ctitle%3Ehybird-host%3C%2Ftitle%3E%5Cn%20%20%20%20%3Clink%20href%3D%5C%22js%2Fabout.dc8b0f2b.js%5C%22%20rel%3D%5C%22prefetch%5C%22%3E%5Cn%20%20%20%20%3Clink%20href%3D%5C%22css%2Fapp.03043124.css%5C%22%20rel%3D%5C%22preload%5C%22%20as%3D%5C%22style%5C%22%3E%5Cn%20%20%20%20%3Clink%20href%3D%5C%22js%2Fapp.b6b5425b.js%5C%22%20rel%3D%5C%22preload%5C%22%20as%3D%5C%22script%5C%22%20crossorigin%3D%5C%22anonymous%5C%22%3E%5Cn%20%20%20%20%3Clink%20href%3D%5C%22js%2Fchunk-vendors.cf6d8f84.js%5C%22%20rel%3D%5C%22preload%5C%22%20as%3D%5C%22script%5C%22%20crossorigin%3D%5C%22anonymous%5C%22%3E%5Cn%20%20%20%20%3Clink%20href%3D%5C%22css%2Fapp.03043124.css%5C%22%20rel%3D%5C%22stylesheet%5C%22%3E%5Cn%3C%2Fhead%3E%5Cn%3Cbody%3E%5Cn%20%20%20%20%3Cdiv%20id%3D%5C%22blazorapp%5C%22%3ELoading...%3C%2Fdiv%3E%5Cn%20%20%20%20%3Cscript%20src%3D%5C%22_framework%2Fblazor.webview.js%5C%22%20autostart%3D%5C%22false%5C%22%3E%3C%2Fscript%3E%5Cn%3C%2Fbody%3E%5Cn%3C%2Fhtml%3E%5Cn%5Cn%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-html hljs"><span class="hljs-meta">&lt;!DOCTYPE <span class="hljs-keyword">html&gt;
<span class="hljs-tag">&lt;<span class="hljs-name">html <span class="hljs-attr">lang=<span class="hljs-string">""&gt;
<span class="hljs-tag">&lt;<span class="hljs-name">head&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">meta <span class="hljs-attr">charset=<span class="hljs-string">"utf-8"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">meta <span class="hljs-attr">http-equiv=<span class="hljs-string">"X-UA-Compatible" <span class="hljs-attr">content=<span class="hljs-string">"IE=edge"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">meta <span class="hljs-attr">name=<span class="hljs-string">"viewport" <span class="hljs-attr">content=<span class="hljs-string">"width=device-width,initial-scale=1"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">link <span class="hljs-attr">rel=<span class="hljs-string">"icon" <span class="hljs-attr">href=<span class="hljs-string">"favicon.ico"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">title&gt;hybird-host<span class="hljs-tag">&lt;/<span class="hljs-name">title&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">link <span class="hljs-attr">href=<span class="hljs-string">"js/about.dc8b0f2b.js" <span class="hljs-attr">rel=<span class="hljs-string">"prefetch"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">link <span class="hljs-attr">href=<span class="hljs-string">"css/app.03043124.css" <span class="hljs-attr">rel=<span class="hljs-string">"preload" <span class="hljs-attr">as=<span class="hljs-string">"style"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">link <span class="hljs-attr">href=<span class="hljs-string">"js/app.b6b5425b.js" <span class="hljs-attr">rel=<span class="hljs-string">"preload" <span class="hljs-attr">as=<span class="hljs-string">"script" <span class="hljs-attr">crossorigin=<span class="hljs-string">"anonymous"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">link <span class="hljs-attr">href=<span class="hljs-string">"js/chunk-vendors.cf6d8f84.js" <span class="hljs-attr">rel=<span class="hljs-string">"preload" <span class="hljs-attr">as=<span class="hljs-string">"script" <span class="hljs-attr">crossorigin=<span class="hljs-string">"anonymous"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">link <span class="hljs-attr">href=<span class="hljs-string">"css/app.03043124.css" <span class="hljs-attr">rel=<span class="hljs-string">"stylesheet"&gt;
<span class="hljs-tag">&lt;/<span class="hljs-name">head&gt;
<span class="hljs-tag">&lt;<span class="hljs-name">body&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">id=<span class="hljs-string">"blazorapp"&gt;Loading...<span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">script <span class="hljs-attr">src=<span class="hljs-string">"_framework/blazor.webview.js" <span class="hljs-attr">autostart=<span class="hljs-string">"false"&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">script&gt;
<span class="hljs-tag">&lt;/<span class="hljs-name">body&gt;
<span class="hljs-tag">&lt;/<span class="hljs-name">html&gt;


</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p><strong>注意，仅全部重写body部分，不要更改head的link标签内容，仅在js后面加上crossorigin="anonymous" 以解决跨域问题。</strong></p>
<p>建立Index.razor文件：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%40using%20Microsoft.Maui.Controls%5Cn%40inject%20IJSRuntime%20JSRuntime%5Cn%40implements%20IDisposable%5Cn%3Cnoscript%3E%3Cstrong%3EWe're%20sorry%20but%20CareAtHome%20doesn't%20work%20properly%20without%20JavaScript%20enabled.%20Please%20enable%20it%20to%20continue.%3C%2Fstrong%3E%3C%2Fnoscript%3E%3Cdiv%20id%3D%5C%22app%5C%22%3E%3C%2Fdiv%3E%5Cn%40code%20%7B%5Cn%5Cn%20%20%20%20%5BJSInvokable%5D%5Cn%20%20%20%20public%20static%20Task%3Cstring%3E%20GetFoo()%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20return%20Task.FromResult(%5C%22this%20is%20foo%20call%20C%23%20method%20from%20js%5C%22)%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%5BJSInvokable%5D%5Cn%20%20%20%20public%20static%20Task%3Cint%3E%20Add(AddInput%20addInput)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20return%20Task.FromResult(addInput.a%20%2B%20addInput.b)%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20public%20async%20void%20Post(object%20o%2C%20EventArgs%20a)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20await%20JSRuntime.InvokeAsync%3Cstring%3E(%5C%22postBar%5C%22%2C%20%5C%22this%20is%20bar%20call%20js%20method%20from%20C%23%5C%22)%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20protected%20override%20async%20Task%20OnAfterRenderAsync(bool%20firstRender)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20((App.Current%20as%20App).MainPage%20as%20MainPage).OnPostBar%20%2B%3D%20this.Post%3B%5Cn%20%20%20%20%20%20%20%20try%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(firstRender)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20await%20JSRuntime.InvokeAsync%3CIJSObjectReference%3E(%5C%22import%5C%22%2C%20%5C%22.%2Fjs%2Fchunk-vendors.cf6d8f84.js%5C%22%2C%20new%20%7B%20crossorigin%20%3D%20%5C%22anonymous%5C%22%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20await%20JSRuntime.InvokeAsync%3CIJSObjectReference%3E(%5C%22import%5C%22%2C%20%5C%22.%2Fjs%2Fapp.b6b5425b.js%5C%22%2C%20new%20%7B%20crossorigin%20%3D%20%5C%22anonymous%5C%22%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20catch%20(Exception%20ex)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20Console.WriteLine(ex)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20public%20void%20Dispose()%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20(Application.Current.MainPage%20as%20MainPage).OnPostBar%20-%3D%20this.Post%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%5Cn%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">@using Microsoft.Maui.Controls
@inject IJSRuntime JSRuntime
@implements IDisposable
&lt;noscript&gt;&lt;strong&gt;We<span class="hljs-string">'re sorry but CareAtHome doesn't work properly without JavaScript enabled. Please enable it to <span class="hljs-keyword">continue.&lt;/strong&gt;&lt;/noscript&gt;&lt;div id=<span class="hljs-string">"app"&gt;&lt;/div&gt;
@code {

    [<span class="hljs-meta">JSInvokable]
    <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-title">Task&lt;<span class="hljs-title">string&gt; <span class="hljs-title">GetFoo()
    {
        <span class="hljs-keyword">return Task.FromResult(<span class="hljs-string">"this is foo call C# method from js");
    }

    [<span class="hljs-meta">JSInvokable]
    <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-title">Task&lt;<span class="hljs-title">int&gt; <span class="hljs-title">Add(<span class="hljs-params">AddInput addInput)
    {
        <span class="hljs-keyword">return Task.FromResult(addInput.a + addInput.b);
    }

    <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">async <span class="hljs-keyword">void <span class="hljs-title">Post(<span class="hljs-params"><span class="hljs-built_in">object o, EventArgs a)
    {
        <span class="hljs-keyword">await JSRuntime.InvokeAsync&lt;<span class="hljs-built_in">string&gt;(<span class="hljs-string">"postBar", <span class="hljs-string">"this is bar call js method from C#");
    }

    <span class="hljs-function"><span class="hljs-keyword">protected <span class="hljs-keyword">override <span class="hljs-keyword">async Task <span class="hljs-title">OnAfterRenderAsync(<span class="hljs-params"><span class="hljs-built_in">bool firstRender)
    {
        ((App.Current <span class="hljs-keyword">as App).MainPage <span class="hljs-keyword">as MainPage).OnPostBar += <span class="hljs-keyword">this.Post;
        <span class="hljs-keyword">try
        {
            <span class="hljs-keyword">if (firstRender)
            {
                <span class="hljs-keyword">await JSRuntime.InvokeAsync&lt;IJSObjectReference&gt;(<span class="hljs-string">"import", <span class="hljs-string">"./js/chunk-vendors.cf6d8f84.js", <span class="hljs-keyword">new { crossorigin = <span class="hljs-string">"anonymous" });
                <span class="hljs-keyword">await JSRuntime.InvokeAsync&lt;IJSObjectReference&gt;(<span class="hljs-string">"import", <span class="hljs-string">"./js/app.b6b5425b.js", <span class="hljs-keyword">new { crossorigin = <span class="hljs-string">"anonymous" });
            }


        }
        <span class="hljs-keyword">catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

    }

    <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">void <span class="hljs-title">Dispose()
    {
        (Application.Current.MainPage <span class="hljs-keyword">as MainPage).OnPostBar -= <span class="hljs-keyword">this.Post;
    }


}
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>注意以下这两个语句需要对应打包生成的实际文件名，并且加上跨域标签</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22await%20JSRuntime.InvokeAsync%3CIJSObjectReference%3E(%5C%22import%5C%22%2C%20%5C%22.%2Fjs%2Fchunk-vendors.cf6d8f84.js%5C%22%2C%20new%20%7B%20crossorigin%20%3D%20%5C%22anonymous%5C%22%20%7D)%3B%5Cnawait%20JSRuntime.InvokeAsync%3CIJSObjectReference%3E(%5C%22import%5C%22%2C%20%5C%22.%2Fjs%2Fapp.b6b5425b.js%5C%22%2C%20new%20%7B%20crossorigin%20%3D%20%5C%22anonymous%5C%22%20%7D)%3B%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">await JSRuntime.InvokeAsync&lt;IJSObjectReference&gt;(<span class="hljs-string">"import", <span class="hljs-string">"./js/chunk-vendors.cf6d8f84.js", <span class="hljs-keyword">new { crossorigin = <span class="hljs-string">"anonymous" });
<span class="hljs-keyword">await JSRuntime.InvokeAsync&lt;IJSObjectReference&gt;(<span class="hljs-string">"import", <span class="hljs-string">"./js/app.b6b5425b.js", <span class="hljs-keyword">new { crossorigin = <span class="hljs-string">"anonymous" });
</span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;MainPage.xaml建立一个按钮并且设置触发事件方法：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22XML%22%2C%22code%22%3A%22%3CButton%20Text%3D%5C%22Post%20Bar%20To%20WebView%5C%22%20HorizontalOptions%3D%5C%22Center%5C%22%20VerticalOptions%3D%5C%22End%5C%22%20HeightRequest%3D%5C%2240%5C%22%20Clicked%3D%5C%22PostBar_Clicked%5C%22%3E%3C%2FButton%3E%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-XML hljs"><span class="hljs-tag">&lt;<span class="hljs-name">Button <span class="hljs-attr">Text=<span class="hljs-string">"Post Bar To WebView" <span class="hljs-attr">HorizontalOptions=<span class="hljs-string">"Center" <span class="hljs-attr">VerticalOptions=<span class="hljs-string">"End" <span class="hljs-attr">HeightRequest=<span class="hljs-string">"40" <span class="hljs-attr">Clicked=<span class="hljs-string">"PostBar_Clicked"&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">Button&gt;
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;CodeBehind:</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22using%20System%3B%5Cnusing%20Microsoft.Maui.Controls%3B%5Cnusing%20Microsoft.Maui.Essentials%3B%5Cn%5Cnnamespace%20MatoProject%5Cn%7B%5Cn%5Ctpublic%20partial%20class%20MainPage%20%3A%20ContentPage%5Cn%5Ct%7B%5Cn%20%20%20%20%20%20%20%20public%20event%20EventHandler%3CEventArgs%3E%20OnPostBar%3B%5Cn%5Cn%5Ct%5Ctint%20count%20%3D%200%3B%5Cn%5Cn%5Ct%5Ctpublic%20MainPage()%5Cn%5Ct%5Ct%7B%5Cn%5Ct%5Ct%5CtInitializeComponent()%3B%5Cn%5Ct%5Ct%7D%5Cn%5Cn%5Ct%5Ctprivate%20async%20void%20PostBar_Clicked(object%20sender%2C%20EventArgs%20args)%5Cn%5Ct%5Ct%7B%5Cn%5Ct%5Ct%5CtOnPostBar%3F.Invoke(this%2C%20args)%3B%5Cn%5Ct%5Ct%7D%5Cn%5Ct%7D%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">using System;
<span class="hljs-keyword">using Microsoft.Maui.Controls;
<span class="hljs-keyword">using Microsoft.Maui.Essentials;

<span class="hljs-keyword">namespace <span class="hljs-title">MatoProject
{
	<span class="hljs-keyword">public <span class="hljs-keyword">partial <span class="hljs-keyword">class <span class="hljs-title">MainPage : <span class="hljs-title">ContentPage
	{
        <span class="hljs-keyword">public <span class="hljs-keyword">event EventHandler&lt;EventArgs&gt; OnPostBar;

		<span class="hljs-built_in">int count = <span class="hljs-number">0;

		<span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">MainPage()
		{
			InitializeComponent();
		}

		<span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">async <span class="hljs-keyword">void <span class="hljs-title">PostBar_Clicked(<span class="hljs-params"><span class="hljs-built_in">object sender, EventArgs args)
		{
			OnPostBar?.Invoke(<span class="hljs-keyword">this, args);
		}
	}
}</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>至此，所有的代码工作已经完成，在PC上可以选择Windows或者Android模拟器来运行程序</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422423-1280788261.png" alt="" width="545" height="258" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422423-1280788261.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F2fcc176b798442eda58f56f687587ab5.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_20%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22545%22%2C%22height%22%3A%22258%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>运行效果：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422425-1836624584.png" alt="" width="1018" height="581" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422425-1836624584.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fb2dc859425d44f6fab2f390a3033c9c1.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_20%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%221018%22%2C%22height%22%3A%22581%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>若在windows平台上运行，原生控件使用 Edge&nbsp;WebView2 呈现器加载页面， 按f12会调用原生的调试工具，在这里看到打印</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1"><img src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422387-1933205129.png" alt="" width="622" height="271" class="cke_widget_element" data-cke-saved-src="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422387-1933205129.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F898430271d624659a4c297fa64ba4201.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_20%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22622%22%2C%22height%22%3A%22271%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115101644699-398025165.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;现在，可能有人会问为什么要使用这样的技术架构？明明可能有更好用的混合开发技术Ionic，React Native，Uni-app。首先不可否认这些技术都有他们的特点与优势，但当你拥有一个成熟的Xamarin框架，你可以轻松迁移到MAUI，利用EFCore实现数据持久化或者集成Abp框架来配置依赖注入，全局事件，本地化等移动开发常用的功能（<a href="https://www.cnblogs.com/jevonsflash/p/16310387.html">将Abp移植进.NET MAUI项目（一）：搭建项目 - 林晓lx - 博客园 (cnblogs.com)</a>）。Xamarin是一个设备抽象层，提供的WebView也有较好的H5兼容性。</p>
<p>当然主要原因还是在快速开发上，你的代码积累才是宝贵的，更少的修改代码量才是王道，如果你在用React技术栈编写Web代码，也许React Native才是你最佳选择 。<strong>没有最优的技术，只有最适合你的技术。</strong></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;代码仓库：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="jevonsflash/maui-vue-hybirddev: maui-vue-hybirddev (github.com)" href="https://github.com/jevonsflash/maui-vue-hybirddev" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/jevonsflash/maui-vue-hybirddev" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fjevonsflash%2Fmaui-vue-hybirddev%22%2C%22text%22%3A%22jevonsflash%2Fmaui-vue-hybirddev%3A%20maui-vue-hybirddev%20(github.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.5%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLA92%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.7%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLBL2%22%2C%22id%22%3A%22FhCgEL-1642212941135%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422019-413593844.png" data-link-title="jevonsflash/maui-vue-hybirddev: maui-vue-hybirddev (github.com)" data-widget="csdnlink">jevonsflash/maui-vue-hybirddev: maui-vue-hybirddev (github.com)</a></span></p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="jevonsflash/maui-vue-hybirddev (gitee.com)" href="https://gitee.com/jevonsflash/maui-vue-hybirddev" data-cke-enter-mode="2" data-cke-saved-href="https://gitee.com/jevonsflash/maui-vue-hybirddev" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgitee.com%2Fjevonsflash%2Fmaui-vue-hybirddev%22%2C%22text%22%3A%22jevonsflash%2Fmaui-vue-hybirddev%20(gitee.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.5%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLA92%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease1.9.7%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DLBL2%22%2C%22id%22%3A%22Fcybc8-1642212941135%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://img2023.cnblogs.com/blog/644861/202310/644861-20231022164422019-413593844.png" data-link-title="jevonsflash/maui-vue-hybirddev (gitee.com)" data-widget="csdnlink">jevonsflash/maui-vue-hybirddev (gitee.com)</a></span></p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-end="1">​</span></span></p>