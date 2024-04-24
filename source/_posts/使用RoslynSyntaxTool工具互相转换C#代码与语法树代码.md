---
thumbnail: images/3feb72db6b94424abf6ff5e5a469c1c0.png
title: 使用RoslynSyntaxTool工具互相转换C#代码与语法树代码
excerpt: 此工具能将C#代码，转换成使用语法工厂构造器（SyntaxFactory）生成等效语法树代码
tags:
  - 小工具
  - .net
  - Roslyn
categories:
  - .NET
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2022-05-16 14:49:00/使用RoslynSyntaxTool工具互相转换C#代码与语法树代码.html'
abbrlink: cd1fec19
date: 2022-05-16 14:49:00
cover:
description:
---
<h1><span data-cke-copybin-start="1"><span data-cke-copybin-start="1">RoslynSyntaxTool</span></span></h1>
<h2>项目地址</h2>
<p>Github:　<a href="https://github.com/MatoApps/RoslynSyntaxTool">RoslynSyntaxTool</a></p>
<h2>基础概念</h2>
<p>Syntax Api:</p>
<p>Roslyn 是微软开源的 .NET 编译平台。编译平台支持 C# 和 Visual Basic 代码编译，并提供丰富的语法分析 API。</p>
<p>语法树(SyntaxTree)是一种由编译器 API 公开的基础数据结构。这些树描述了C#源代码的词法和语法结构。</p>
<p>利用语法分析 API可以将一段C#代码翻译成等效的语法树代码。</p>
<p>关于语法分析请查看官方文档&nbsp;<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="语法分析 (Roslyn API) 入门 | Microsoft Docs" href="https://docs.microsoft.com/zh-cn/dotnet/csharp/roslyn-sdk/get-started/syntax-analysis" data-cke-enter-mode="2" data-cke-saved-href="https://docs.microsoft.com/zh-cn/dotnet/csharp/roslyn-sdk/get-started/syntax-analysis" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fdocs.microsoft.com%2Fzh-cn%2Fdotnet%2Fcsharp%2Froslyn-sdk%2Fget-started%2Fsyntax-analysis%22%2C%22text%22%3A%22%E8%AF%AD%E6%B3%95%E5%88%86%E6%9E%90%20(Roslyn%20API)%20%E5%85%A5%E9%97%A8%20%7C%20Microsoft%20Docs%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22J4jWF0-1652683631466%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="语法分析 (Roslyn API) 入门 | Microsoft Docs" data-widget="csdnlink">语法分析 (Roslyn API) 入门 | Microsoft Docs</a></span></p>
<p>可以通过<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="&nbsp;Roslyn 入门系列文章" href="https://blog.csdn.net/WPwalter/article/details/79616402" data-cke-enter-mode="2" data-cke-saved-href="https://blog.csdn.net/WPwalter/article/details/79616402" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fblog.csdn.net%2FWPwalter%2Farticle%2Fdetails%2F79616402%22%2C%22text%22%3A%22%C2%A0Roslyn%20%E5%85%A5%E9%97%A8%E7%B3%BB%E5%88%97%E6%96%87%E7%AB%A0%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22Eh3Wlg-1652683631465%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="&nbsp;Roslyn 入门系列文章" data-widget="csdnlink">&nbsp;Roslyn 入门系列文章</a>&nbsp;学习Roslyn相关知识&nbsp;</span></p>
<h2 id="%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF">应用场景</h2>
<ul>
<li>需要动态编译的，如在开发微服务中动态生成代理类，项目的插件化改造等</li>
<li>需要动态生成C#代码脚本的，如项目模板生成器，C#脚本生成工具等</li>
<li>需要分析C#使用场景，如代码安全性审查等</li>
<li>...</li>
</ul>
<h2 id="%E4%BB%8B%E7%BB%8D">介绍</h2>
<p>RoslynSyntaxTool利用语法分析 API，提供以下功能：</p>
<ul>
<li>将指定的C#代码转为等效的语法树代码</li>
<li>将语法树代码还原为C#代码</li>
<li>图形化查看语法树结构</li>
<li>查看语法树节点属性详情</li>
</ul>
<p>这是独立开发者的一个开源项目, 希望得到您的意见反馈，请将Bugs汇报至我的邮箱</p>
<p>&nbsp;</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/3feb72db6b94424abf6ff5e5a469c1c0.png" alt="" width="1080" height="720" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/3feb72db6b94424abf6ff5e5a469c1c0.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F3feb72db6b94424abf6ff5e5a469c1c0.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%221080%22%2C%22height%22%3A%22720%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220516144918417-367341982.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片">编辑<span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/f7ab1086a30f4411ae37449b5b4e8716.png" alt="" width="1080" height="720" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/f7ab1086a30f4411ae37449b5b4e8716.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Ff7ab1086a30f4411ae37449b5b4e8716.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%221080%22%2C%22height%22%3A%22720%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220516144918417-367341982.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片">编辑<span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/7bad19ac6e814b0fb0773d31626f7c46.png" alt="" width="1087" height="808" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/7bad19ac6e814b0fb0773d31626f7c46.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F7bad19ac6e814b0fb0773d31626f7c46.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%221087%22%2C%22height%22%3A%22808%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202205/644861-20220516144918417-367341982.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​<span class="cke_widget_edit_container" title="编辑图片">编辑</span></span></span></span></span></span></span></span></span></span></span></span></p>
<h2 id="%E6%84%9F%E8%B0%A2">感谢</h2>
<p>KirillOsenkov的RoslynOuter项目，链接:&nbsp;<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="https://github.com/KirillOsenkov/RoslynQuoter" href="https://github.com/KirillOsenkov/RoslynQuoter" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/KirillOsenkov/RoslynQuoter" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2FKirillOsenkov%2FRoslynQuoter%22%2C%22text%22%3A%22https%3A%2F%2Fgithub.com%2FKirillOsenkov%2FRoslynQuoter%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%22YGdCaO-1652683631461%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="https://github.com/KirillOsenkov/RoslynQuoter" data-widget="csdnlink">https://github.com/KirillOsenkov/RoslynQuoter</a></span></p>
<p>语法树代码生成器代码借鉴自此项目</p>
<h2 id="%E6%9B%B4%E6%96%B0%E5%86%85%E5%AE%B9">更新内容：</h2>
<table>
<thead>
<tr><th>Date</th><th>Version</th><th>Content</th></tr>
</thead>
<tbody>
<tr>
<td>V1.0</td>
<td>2021-3-16</td>
<td>初始版本</td>
</tr>
<tr>
<td>V2.0</td>
<td>2022-5-16</td>
<td>1. 升级项目框架至.Net 6.0 2. 增加ConvertToCSharp页面 3. 更新README</td>
</tr>
</tbody>
</table>
<h2 id="%E5%AE%89%E8%A3%85%E8%AF%B4%E6%98%8E">安装说明：</h2>
<ol>
<li>
<p>下载安装包&nbsp;<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="https://raw.githubusercontent.com/MatoApps/RoslynSyntaxTool/master/RST/rst.zip" href="https://raw.githubusercontent.com/MatoApps/RoslynSyntaxTool/master/RST/rst.zip" data-cke-enter-mode="2" data-cke-saved-href="https://raw.githubusercontent.com/MatoApps/RoslynSyntaxTool/master/RST/rst.zip" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fraw.githubusercontent.com%2FMatoApps%2FRoslynSyntaxTool%2Fmaster%2FRST%2Frst.zip%22%2C%22text%22%3A%22https%3A%2F%2Fraw.githubusercontent.com%2FMatoApps%2FRoslynSyntaxTool%2Fmaster%2FRST%2Frst.zip%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%2267ieab-1652683631460%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="https://raw.githubusercontent.com/MatoApps/RoslynSyntaxTool/master/RST/rst.zip" data-widget="csdnlink">https://raw.githubusercontent.com/MatoApps/RoslynSyntaxTool/master/RST/rst.zip</a></span></p>
</li>
<li>
<p>解压并双击 setup.exe 安装</p>
</li>
</ol>
<h2 id="%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83">运行环境</h2>
<ul>
<li>Microsoft Windows 7 及以上</li>
</ul>
<h2 id="%E5%B7%B2%E7%9F%A5%E9%97%AE%E9%A2%98">已知问题：</h2>
<h2 id="%E4%BD%9C%E8%80%85%E4%BF%A1%E6%81%AF">作者信息：</h2>
<p>作者：林小</p>
<p>邮箱：jevonsflash@qq.com</p>
<h2 id="license">License</h2>
<p>The MIT License (MIT)</p>
<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-end="1">​</span></span></p>
<p><span data-cke-copybin-start="1"><span data-cke-copybin-end="1">Github:　<a href="https://github.com/MatoApps/RoslynSyntaxTool">RoslynSyntaxTool</a></span></span></p>