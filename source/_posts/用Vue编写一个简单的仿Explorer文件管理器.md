---
thumbnail: images/6c22b4ef067344f0839b5aa7c76c4ff2.gif
title: 用Vue编写一个简单的仿Explorer文件管理器
excerpt: "大家一定很熟悉你桌面左上角那个小电脑吧，学名Windows资源管理器，几乎所有的工作都从这里开始，文件云端化是一种趋势。怎样用浏览器实现一个Web版本的Windows资源管理器呢？今天来用Vue好好盘一盘它。一、导航原理首先操作和仔细观察导航栏，我们有几个操作途径：点击“向上”按钮回到上一个目录，点击地址栏的文件夹名称返回任意一个目录\t双击文件夹进入新目录\t点击“前进”，“后退”按钮操作导航其中前进，后退操作，可以点击小三角查看一个列表，点击进入文件夹，列表会记录导航历史，哪怕反复进入同一"
tags:
  - TypeScript
  - Vue
  - Html
categories:
  - JavaScript
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2022-03-11 23:12:00/用Vue编写一个简单的仿Explorer文件管理器.html'
abbrlink: ab1b5118
date: 2022-03-11 23:12:00
cover:
description:
---
<p><span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span><span id="cke_bm_374S">大家一定很熟悉你桌面左上角那个小电脑吧，学名Windows资源管理器，几乎所有的工作都从这里开始，文件云端化是一种趋势。怎样用浏览器实现一个Web版本的Windows资源管理器呢？今天来用Vue好好盘一盘它。</span></p>
<h3>一、导航原理</h3>
<p>首先操作和仔细观察导航栏，我们有几个操作途径：</p>
<ul>
<li>点击&ldquo;向上&rdquo;按钮回到上一个目录，点击地址栏的文件夹名称返回任意一个目录</li>
<li>双击文件夹进入新目录</li>
<li>点击&ldquo;前进&rdquo;，&ldquo;后退&rdquo;按钮操作导航</li>
</ul>
<p>其中前进，后退操作，可以点击小三角查看一个列表，点击进入文件夹，列表会记录导航历史，哪怕反复进入同一个文件夹，列表仍然会记录下来，如下图：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="28" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/56c53f19013f40aeaed4600498b40db4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_12,color_FFFFFF,t_70,g_se,x_16" alt="" width="329" height="273" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/56c53f19013f40aeaed4600498b40db4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_12,color_FFFFFF,t_70,g_se,x_16" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F56c53f19013f40aeaed4600498b40db4.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_12%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22329%22%2C%22height%22%3A%22273%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;</p>
<p>那么我们就能分析并抽象出两个变量：</p>
<ol>
<li>一个用于存储实际导航的变量（navigationStack）</li>
<li>另一个用于存储导航历史的变量（navigationHistoryStack）</li>
</ol>
<p>导航堆栈用于存储每一个浏览文件夹的信息，拼接起这些文件夹就形成了当前路径，&nbsp;一组简单的&lt;li&gt;元素通过绑定导航堆栈，就能形成地址栏（web世界里也叫面包屑导航）了。</p>
<p><strong>navigationStack实际上是一个堆栈，用的是先进后出（FILO）原则</strong></p>
<p>导航历史则是单纯记录了用户的操作轨迹，不会收到导航目标的影响，如刚才所述，哪怕反复进入同一个文件夹，列表仍然会记录下来</p>
<p><strong>navigationHistoryStack实际上是一个队列，用的是先进先出（FIFO）原则</strong></p>
<p>接下来我们开始码代码</p>
<p>我们先新建一个Vue项目（Typescript），打开App.vue文件</p>
<p>script标签里编写代码如下：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="27" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22%3Cscript%20lang%3D'ts'%3E%5Cnexport%20default%20%7B%5Cn%20%20name%3A%20%5C%22App%5C%22%2C%5Cn%20%20data%3A%20()%20%3D%3E%20%7B%5Cn%20%20%20%20return%20%7B%5Cn%20%20%20%20%20%20navigationStack%3A%20new%20Array%3CFileDto%3E()%2C%5Cn%20%20%20%20%20%20navigationHistoryStack%3A%20new%20Array%3CFileDto%3E()%2C%5Cn%20%20%20%20%7D%3B%5Cn%20%20%7D%5Cn%7D%5Cn%3C%2Fscript%3E%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs">&lt;script lang=<span class="hljs-string">'ts'&gt;
<span class="hljs-keyword">export <span class="hljs-keyword">default {
  <span class="hljs-attr">name: <span class="hljs-string">"App",
  <span class="hljs-attr">data: <span class="hljs-function">() =&gt; {
    <span class="hljs-keyword">return {
      <span class="hljs-attr">navigationStack: <span class="hljs-keyword">new <span class="hljs-title class_">Array&lt;<span class="hljs-title class_">FileDto&gt;(),
      <span class="hljs-attr">navigationHistoryStack: <span class="hljs-keyword">new <span class="hljs-title class_">Array&lt;<span class="hljs-title class_">FileDto&gt;(),
    };
  }
}
&lt;/script&gt;
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;</p>
<h3>二、文件夹跳转原理</h3>
<p>我们先来看如下数据结构</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="26" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22export%20class%20FileDto%20%7B%5Cn%20%20id%3A%20number%3B%20%20%20%20%20%20%20%20%2F%2F%E5%94%AF%E4%B8%80id%5Cn%20%20parentId%3A%20number%3B%20%20%20%20%2F%2F%E7%88%B6id%5Cn%20%20fileName%3A%20string%3B%20%20%20%20%2F%2F%E6%96%87%E4%BB%B6%E5%90%8D%E7%A7%B0%5Cn%20%20fileType%3A%20number%3B%20%20%20%20%2F%2F%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%9A1-%E6%96%87%E4%BB%B6%E5%A4%B9%EF%BC%8C2-%E5%B8%B8%E8%A7%84%E6%96%87%E4%BB%B6%5Cn%20%20byteSize%3A%20number%3B%20%20%20%20%2F%2F%E6%96%87%E4%BB%B6%E5%A4%A7%E5%B0%8F%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-keyword">export <span class="hljs-keyword">class <span class="hljs-title class_">FileDto {
  <span class="hljs-attr">id: <span class="hljs-built_in">number;        <span class="hljs-comment">//唯一id
  <span class="hljs-attr">parentId: <span class="hljs-built_in">number;    <span class="hljs-comment">//父id
  <span class="hljs-attr">fileName: <span class="hljs-built_in">string;    <span class="hljs-comment">//文件名称
  <span class="hljs-attr">fileType: <span class="hljs-built_in">number;    <span class="hljs-comment">//文件类型：1-文件夹，2-常规文件
  <span class="hljs-attr">byteSize: <span class="hljs-built_in">number;    <span class="hljs-comment">//文件大小
}</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>FileDto是定义的文件描述类，这是描述一整个树形结构的基本单元，通过唯一id和指定它的上级parentId，通过递归就可以描述你的某一文件，某一文件夹具体在哪一层级的哪一个分支中。现在假设我们有一堆的文件树长这样：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="25" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/eca115fdd0d54f949205f695ac018f4a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_19,color_FFFFFF,t_70,g_se,x_16" alt="" width="494" height="175" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/eca115fdd0d54f949205f695ac018f4a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_19,color_FFFFFF,t_70,g_se,x_16" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Feca115fdd0d54f949205f695ac018f4a.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_19%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22494%22%2C%22height%22%3A%22175%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>定义查询函数checkMessage和当前目录层级的文件集合listMessage：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="24" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22%20%20%20%20%20%20listMessage%3A%20new%20Array%3CFileDto%3E()%2C%5Cn%20%20%20%20%20%20checkMessage%3A%20%7B%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs">      <span class="hljs-attr">listMessage: <span class="hljs-keyword">new <span class="hljs-title class_">Array&lt;<span class="hljs-title class_">FileDto&gt;(),
      <span class="hljs-attr">checkMessage: {},</span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>再定义一个目录访问器gotoList函数，通过传入查询条件，更新当前目录层级的文件列表：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="23" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22gotoList()%20%7B%5Cn%20%20%20%20%20%20this.listMessage%20%3D%20Enumerable.from(FileList)%5Cn%20%20%20%20%20%20%20%20.where((c)%20%3D%3E%20c.parentId%20%3D%3D%20(this.checkMessage%20as%20any).parentId)%5Cn%20%20%20%20%20%20%20%20.toArray()%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-title function_">gotoList() {
      <span class="hljs-variable language_">this.<span class="hljs-property">listMessage = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-title class_">FileList)
        .<span class="hljs-title function_">where(<span class="hljs-function">(<span class="hljs-params">c) =&gt; c.<span class="hljs-property">parentId == (<span class="hljs-variable language_">this.<span class="hljs-property">checkMessage <span class="hljs-keyword">as <span class="hljs-built_in">any).<span class="hljs-property">parentId)
        .<span class="hljs-title function_">toArray();
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;编写UI部分，简单定义一个table，并绑定文件集合listMessage来显示所有文件：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="22" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22html%22%2C%22code%22%3A%22%20%20%20%20%20%20%3Ctable%20border%3D%5C%221%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%3Ctr%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Cth%3Eid%3C%2Fth%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Cth%3E%E6%96%87%E4%BB%B6%E5%90%8D%3C%2Fth%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Cth%3E%E7%B1%BB%E5%9E%8B%3C%2Fth%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Cth%3E%E5%A4%A7%E5%B0%8F%3C%2Fth%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Ftr%3E%5Cn%20%20%20%20%20%20%20%20%3Ctr%20v-for%3D%5C%22item%20in%20listMessage%5C%22%20%3Akey%3D%5C%22item.id%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%7B%7B%20item.id%20%7D%7D%3C%2Ftd%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%5C%22javascript%3Avoid(0)%5C%22%20%40click%3D%5C%22open(item)%5C%22%3E%7B%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20item.fileName%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%7D%3C%2Fa%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3C%2Ftd%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%7B%7B%20item.fileType%20%3D%3D%201%20%3F%20%5C%22%E7%9B%AE%E5%BD%95%5C%22%20%3A%20%5C%22%E6%96%87%E4%BB%B6%5C%22%20%7D%7D%3C%2Ftd%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%7B%7B%20item.fileType%20%3D%3D%201%20%3F%20%5C%22%2F%5C%22%20%3A%20%60%24%7Bitem.byteSize%7DM%60%20%7D%7D%3C%2Ftd%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Ftr%3E%5Cn%20%20%20%20%20%20%3C%2Ftable%3E%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-html hljs">      <span class="hljs-tag">&lt;<span class="hljs-name">table <span class="hljs-attr">border=<span class="hljs-string">"1"&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">tr&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">th&gt;id<span class="hljs-tag">&lt;/<span class="hljs-name">th&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">th&gt;文件名<span class="hljs-tag">&lt;/<span class="hljs-name">th&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">th&gt;类型<span class="hljs-tag">&lt;/<span class="hljs-name">th&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">th&gt;大小<span class="hljs-tag">&lt;/<span class="hljs-name">th&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">tr&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">tr <span class="hljs-attr">v-for=<span class="hljs-string">"item in listMessage" <span class="hljs-attr">:key=<span class="hljs-string">"item.id"&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">td&gt;{{ item.id }}<span class="hljs-tag">&lt;/<span class="hljs-name">td&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">td&gt;
            <span class="hljs-tag">&lt;<span class="hljs-name">a <span class="hljs-attr">href=<span class="hljs-string">"javascript:void(0)" @<span class="hljs-attr">click=<span class="hljs-string">"open(item)"&gt;{{
              item.fileName
            }}<span class="hljs-tag">&lt;/<span class="hljs-name">a&gt;
          <span class="hljs-tag">&lt;/<span class="hljs-name">td&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">td&gt;{{ item.fileType == 1 ? "目录" : "文件" }}<span class="hljs-tag">&lt;/<span class="hljs-name">td&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">td&gt;{{ item.fileType == 1 ? "/" : `${item.byteSize}M` }}<span class="hljs-tag">&lt;/<span class="hljs-name">td&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">tr&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">table&gt;</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>当调用gotoList函数的时候，相当与&ldquo;刷新&rdquo;功能，获取了当前查询条件下的所有文件</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="21" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/33ea1c76a49343a79622a6ea49f47f24.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_19,color_FFFFFF,t_70,g_se,x_16" alt="" width="490" height="119" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/33ea1c76a49343a79622a6ea49f47f24.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_19,color_FFFFFF,t_70,g_se,x_16" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F33ea1c76a49343a79622a6ea49f47f24.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_19%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22490%22%2C%22height%22%3A%22119%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<h3>三、编写导航逻辑</h3>
<p>导航堆栈处理函数</p>
<p>刚刚我们分析了导航原理，导航堆栈的作用是形成地址，我们定义一个导航堆栈处理逻辑：</p>
<ol>
<li>判断当前页面是否在导航堆栈中</li>
<li>若是，则弹出至目标在导航堆栈中所在的位置</li>
<li>若否，则压入导航堆栈</li>
</ol>
<p>&nbsp;其中toFolder函数用于实际导航并刷新页面的，稍后介绍</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="20" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22navigationTo(folder%3A%20FileBriefWithThumbnailDto)%20%7B%5Cn%20%20%20%20var%20toIndex%20%3D%20Enumerable.from(this.NavigationStack).indexOf(folder)%3B%5Cn%20%20%20%20if%20(toIndex%20%3E%3D%200)%20%7B%5Cn%20%20%20%20%20%20this.NavigationStack.splice(%5Cn%20%20%20%20%20%20%20%20toIndex%20%2B%201%2C%5Cn%20%20%20%20%20%20%20%20this.NavigationStack.length%20-%20toIndex%20-%201%5Cn%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20this.NavigationStack.push(folder)%3B%5Cn%20%20%20%20%7D%5Cn%20%20%20%20if%20(this.toFolder(folder))%20%7B%5Cn%20%20%20%20%20%20this.navigationHistoryStack.unshift(folder)%3B%5Cn%20%20%20%20%7D%5Cn%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-title function_">navigationTo(<span class="hljs-params">folder: FileBriefWithThumbnailDto) {
    <span class="hljs-keyword">var toIndex = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack).<span class="hljs-title function_">indexOf(folder);
    <span class="hljs-keyword">if (toIndex &gt;= <span class="hljs-number">0) {
      <span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack.<span class="hljs-title function_">splice(
        toIndex + <span class="hljs-number">1,
        <span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack.<span class="hljs-property">length - toIndex - <span class="hljs-number">1
      );
    } <span class="hljs-keyword">else {
      <span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack.<span class="hljs-title function_">push(folder);
    }
    <span class="hljs-keyword">if (<span class="hljs-variable language_">this.<span class="hljs-title function_">toFolder(folder)) {
      <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-title function_">unshift(folder);
    }
  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&ldquo;向上&rdquo;导航函数：</p>
<p>向上的作用属于一个特定的导航堆栈处理：</p>
<ol>
<li>直接弹出最上的条目，</li>
<li>拿到最上层条目并导航</li>
</ol>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="19" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22%20%20navigationBack()%20%7B%5Cn%20%20%20%20this.NavigationStack.pop()%3B%5Cn%20%20%20%20var%20lastItem%20%3D%20Enumerable.from(this.NavigationStack).lastOrDefault()%3B%5Cn%20%20%20%20if%20(this.getIsNull(lastItem))%20%7B%5Cn%20%20%20%20%20%20return%3B%5Cn%20%20%20%20%7D%5Cn%20%20%20%20if%20(this.toFolder(lastItem))%20%7B%5Cn%20%20%20%20%20%20this.NavigationHistoryStack.push(lastItem)%3B%5Cn%20%20%20%20%7D%5Cn%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs">  <span class="hljs-title function_">navigationBack() {
    <span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack.<span class="hljs-title function_">pop();
    <span class="hljs-keyword">var lastItem = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack).<span class="hljs-title function_">lastOrDefault();
    <span class="hljs-keyword">if (<span class="hljs-variable language_">this.<span class="hljs-title function_">getIsNull(lastItem)) {
      <span class="hljs-keyword">return;
    }
    <span class="hljs-keyword">if (<span class="hljs-variable language_">this.<span class="hljs-title function_">toFolder(lastItem)) {
      <span class="hljs-variable language_">this.<span class="hljs-property">NavigationHistoryStack.<span class="hljs-title function_">push(lastItem);
    }
  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>定义跳转函数toFolder，之后许多函数引用此函数，这个函数单纯执行跳转，传入文件描述对象，执行导航，刷新页面，返回bool值代表成功与否：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="18" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22toFolder(folder%3A%20FileDto)%20%7B%5Cn%20%20%20%20%20%20if%20((this.checkMessage%20as%20any).parentId%20%3D%3D%20folder.id)%20%7B%5Cn%20%20%20%20%20%20%20%20return%20false%3B%5Cn%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20(this.checkMessage%20as%20any).parentId%20%3D%20folder.id%3B%5Cn%5Cn%20%20%20%20%20%20this.gotoList()%3B%5Cn%20%20%20%20%20%20return%20true%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-title function_">toFolder(<span class="hljs-params">folder: FileDto) {
      <span class="hljs-keyword">if ((<span class="hljs-variable language_">this.<span class="hljs-property">checkMessage <span class="hljs-keyword">as <span class="hljs-built_in">any).<span class="hljs-property">parentId == folder.<span class="hljs-property">id) {
        <span class="hljs-keyword">return <span class="hljs-literal">false;
      }

      (<span class="hljs-variable language_">this.<span class="hljs-property">checkMessage <span class="hljs-keyword">as <span class="hljs-built_in">any).<span class="hljs-property">parentId = folder.<span class="hljs-property">id;

      <span class="hljs-variable language_">this.<span class="hljs-title function_">gotoList();
      <span class="hljs-keyword">return <span class="hljs-literal">true;
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>简单的写一下导航操作区域和地址栏的Ui界面：&nbsp;</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="17" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/c2b02f6c5bb6435ca1c68e96b0e238c5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_17,color_FFFFFF,t_70,g_se,x_16" alt="" width="446" height="79" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/c2b02f6c5bb6435ca1c68e96b0e238c5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_17,color_FFFFFF,t_70,g_se,x_16" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fc2b02f6c5bb6435ca1c68e96b0e238c5.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_17%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22446%22%2C%22height%22%3A%2279%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="16" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22html%22%2C%22code%22%3A%22%20%20%20%20%3Cdiv%20class%3D%5C%22crumbs%5C%22%3E%5Cn%20%20%20%20%20%20%3Cul%3E%5Cn%20%20%20%20%20%20%20%20%3Cli%20v-for%3D%5C%22(item%2C%20index)%20in%20navigationStack%5C%22%20%3Akey%3D%5C%22item.id%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%7B%7B%20index%20%3E%200%20%3F%20%5C%22%20%2F%5C%22%20%3A%20%5C%22%5C%22%20%7D%7D%5Cn%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%5C%22javascript%3Avoid(0)%5C%22%20%40click%3D%5C%22navigationTo(item)%5C%22%3E%7B%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20item.fileName%5Cn%20%20%20%20%20%20%20%20%20%20%7D%7D%3C%2Fa%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Fli%3E%5Cn%20%20%20%20%20%20%3C%2Ful%3E%5Cn%20%20%20%20%3C%2Fdiv%3E%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-html hljs">    <span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">class=<span class="hljs-string">"crumbs"&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">ul&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">li <span class="hljs-attr">v-for=<span class="hljs-string">"(item, index) in navigationStack" <span class="hljs-attr">:key=<span class="hljs-string">"item.id"&gt;
          {{ index &gt; 0 ? " /" : "" }}
          <span class="hljs-tag">&lt;<span class="hljs-name">a <span class="hljs-attr">href=<span class="hljs-string">"javascript:void(0)" @<span class="hljs-attr">click=<span class="hljs-string">"navigationTo(item)"&gt;{{
            item.fileName
          }}<span class="hljs-tag">&lt;/<span class="hljs-name">a&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">li&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">ul&gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h3>四、编写历史导航处理逻辑</h3>
<p>&ldquo;后退&rdquo;函数</p>
<ol>
<li>首先确定当前页面在历史导航的哪个位置</li>
<li>拿到角标后+1（因为是队列，所以越早的角标越大），拿到历史导航队列中后一个页面条目，并执行导航函数</li>
</ol>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="15" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22navigationHistoryBack()%20%7B%5Cn%20%20%20%20var%20currentIndex%20%3D%20Enumerable.from(this.NavigationHistoryStack).indexOf(%5Cn%20%20%20%20%20%20(c)%20%3D%3E%20c.id%20%3D%3D%20(this.checkMessage%20as%20any).parentId%5Cn%20%20%20%20)%3B%5Cn%20%20%20%20if%20(currentIndex%20%3C%20this.NavigationHistoryStack.length%20-%201)%20%7B%5Cn%20%20%20%20%20%20var%20forwardIndex%20%3D%20currentIndex%20%2B%201%3B%5Cn%20%20%20%20%20%20var%20folder%3D%20this.NavigationHistoryStack%5BforwardIndex%5D%20%20%20%20%20%5Cn%20%20%20%20%20%20this.toFolder(folder)%3B%5Cn%20%20%20%20%7D%5Cn%20%20%7D%5Cn%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-title function_">navigationHistoryBack() {
    <span class="hljs-keyword">var currentIndex = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-variable language_">this.<span class="hljs-property">NavigationHistoryStack).<span class="hljs-title function_">indexOf(
      <span class="hljs-function">(<span class="hljs-params">c) =&gt; c.<span class="hljs-property">id == (<span class="hljs-variable language_">this.<span class="hljs-property">checkMessage <span class="hljs-keyword">as <span class="hljs-built_in">any).<span class="hljs-property">parentId
    );
    <span class="hljs-keyword">if (currentIndex &lt; <span class="hljs-variable language_">this.<span class="hljs-property">NavigationHistoryStack.<span class="hljs-property">length - <span class="hljs-number">1) {
      <span class="hljs-keyword">var forwardIndex = currentIndex + <span class="hljs-number">1;
      <span class="hljs-keyword">var folder= <span class="hljs-variable language_">this.<span class="hljs-property">NavigationHistoryStack[forwardIndex]     
      <span class="hljs-variable language_">this.<span class="hljs-title function_">toFolder(folder);
    }
  }

</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&ldquo;前进&rdquo;函数</p>
<ol>
<li>首先确定当前页面在历史导航的哪个位置</li>
<li>拿到角标后-1（因为是队列，所以越晚的角标越小），拿到历史导航队列中前一个页面条目，并执行导航函数</li>
</ol>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="14" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22%5Cn%5Cn%20%20navigationHistoryForward()%20%7B%5Cn%20%20%20%20var%20currentIndex%20%3D%20Enumerable.from(this.NavigationHistoryStack).indexOf(%5Cn%20%20%20%20%20%20(c)%20%3D%3E%20c.id%20%3D%3D%20(this.checkMessage%20as%20any).parentId%5Cn%20%20%20%20)%3B%5Cn%20%20%20%20if%20(currentIndex%20%3E%200)%20%7B%5Cn%20%20%20%20%20%20var%20forwardIndex%20%3D%20currentIndex%20-%201%3B%5Cn%20%20%20%20%20%20var%20folder%3D%20this.NavigationHistoryStack%5BforwardIndex%5D%5Cn%20%20%20%20%20%20this.toFolder(folder)%3B%5Cn%20%20%20%20%7D%5Cn%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs">

  <span class="hljs-title function_">navigationHistoryForward() {
    <span class="hljs-keyword">var currentIndex = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-variable language_">this.<span class="hljs-property">NavigationHistoryStack).<span class="hljs-title function_">indexOf(
      <span class="hljs-function">(<span class="hljs-params">c) =&gt; c.<span class="hljs-property">id == (<span class="hljs-variable language_">this.<span class="hljs-property">checkMessage <span class="hljs-keyword">as <span class="hljs-built_in">any).<span class="hljs-property">parentId
    );
    <span class="hljs-keyword">if (currentIndex &gt; <span class="hljs-number">0) {
      <span class="hljs-keyword">var forwardIndex = currentIndex - <span class="hljs-number">1;
      <span class="hljs-keyword">var folder= <span class="hljs-variable language_">this.<span class="hljs-property">NavigationHistoryStack[forwardIndex]
      <span class="hljs-variable language_">this.<span class="hljs-title function_">toFolder(folder);
    }
  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>然后我们需要一个函数，用于显示历史队列中（当前）标签：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="13" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22getIsCurrentHistoryNavigationItem(item)%20%7B%5Cn%20%20%20%20var%20itemIndex%20%3D%20Enumerable.from(this.NavigationHistoryStack).indexOf(%5Cn%20%20%20%20%20%20(c)%20%3D%3E%20c.id%20%3D%3D%20item.id%5Cn%20%20%20%20)%3B%5Cn%20%20%20%20var%20result%20%3D%20(this.checkMessage%20as%20any).parentId%20%3D%3D%20itemIndex%3B%5Cn%20%20%20%20return%20result%3B%5Cn%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-title function_">getIsCurrentHistoryNavigationItem(<span class="hljs-params">item) {
    <span class="hljs-keyword">var itemIndex = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-variable language_">this.<span class="hljs-property">NavigationHistoryStack).<span class="hljs-title function_">indexOf(
      <span class="hljs-function">(<span class="hljs-params">c) =&gt; c.<span class="hljs-property">id == item.<span class="hljs-property">id
    );
    <span class="hljs-keyword">var result = (<span class="hljs-variable language_">this.<span class="hljs-property">checkMessage <span class="hljs-keyword">as <span class="hljs-built_in">any).<span class="hljs-property">parentId == itemIndex;
    <span class="hljs-keyword">return result;
  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>简单的写一下导航操作区域：</p>
<p>导航按钮以及历史列表：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="12" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/673192b9322f4110a9a56892dfc1b8f3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_7,color_FFFFFF,t_70,g_se,x_16" alt="" width="189" height="255" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/673192b9322f4110a9a56892dfc1b8f3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_7,color_FFFFFF,t_70,g_se,x_16" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F673192b9322f4110a9a56892dfc1b8f3.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_7%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22189%22%2C%22height%22%3A%22255%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>代码如下：&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="11" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22html%22%2C%22code%22%3A%22%3Cdiv%20class%3D%5C%22buttons%5C%22%3E%5Cn%20%20%20%20%20%20%3Cdiv%3E%5Cn%20%20%20%20%20%20%20%20%3Cbutton%20%40click%3D%5C%22navigationHistoryBack%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Cimg%5Cn%20%20%20%20%20%20%20%20%20%20%20%20style%3D%5C%22transform%3A%20rotate(180deg)%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Asrc%3D%5C%22require('%40%2Fassets%2Farr.png')%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Fbutton%3E%5Cn%20%20%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%20%20%3Cdiv%3E%5Cn%20%20%20%20%20%20%20%20%3Cbutton%20%40click%3D%5C%22navigationHistoryForward%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Cimg%20%3Asrc%3D%5C%22require('%40%2Fassets%2Farr.png')%5C%22%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Fbutton%3E%5Cn%20%20%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%20%20%3Cdiv%3E%5Cn%20%20%20%20%20%20%20%20%3Ca%20%40click%3D%5C%22show%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Cimg%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Asrc%3D%5C%22require('%40%2Fassets%2Farr2.png')%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Astyle%3D%5C%22%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20transform%3A%20showHistory%20%3F%20'rotate(0deg)'%20%3A%20'rotate(-180deg)'%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Fa%3E%5Cn%20%20%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%20%20%3Cul%20class%3D%5C%22history%5C%22%20v-show%3D%5C%22showHistory%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%3Cli%20v-for%3D%5C%22(item%2C%20index)%20in%20navigationHistoryStack%5C%22%20%3Akey%3D%5C%22index%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Cspan%3E%7B%7B%20item.fileName%20%7D%7D%3C%2Fspan%3E%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%3Cspan%20v-if%3D%5C%22getIsCurrentHistoryNavigationItem(item)%5C%22%3E%20(%E5%BD%93%E5%89%8D)%3C%2Fspan%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Fli%3E%5Cn%20%20%20%20%20%20%3C%2Ful%3E%5Cn%5Cn%20%20%20%20%20%20%3Cdiv%3E%5Cn%20%20%20%20%20%20%20%20%3Cbutton%20%40click%3D%5C%22navigationBack%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%3Cimg%5Cn%20%20%20%20%20%20%20%20%20%20%20%20style%3D%5C%22transform%3A%20rotate(-90deg)%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Asrc%3D%5C%22require('%40%2Fassets%2Farr.png')%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%3C%2Fbutton%3E%5Cn%20%20%20%20%20%20%3C%2Fdiv%3E%5Cn%20%20%20%20%3C%2Fdiv%3E%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-html hljs"><span class="hljs-tag">&lt;<span class="hljs-name">div <span class="hljs-attr">class=<span class="hljs-string">"buttons"&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">div&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">button @<span class="hljs-attr">click=<span class="hljs-string">"navigationHistoryBack"&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">img
            <span class="hljs-attr">style=<span class="hljs-string">"transform: rotate(180deg)"
            <span class="hljs-attr">:src=<span class="hljs-string">"require('@/assets/arr.png')"
          /&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">button&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">div&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">button @<span class="hljs-attr">click=<span class="hljs-string">"navigationHistoryForward"&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">img <span class="hljs-attr">:src=<span class="hljs-string">"require('@/assets/arr.png')" /&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">button&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">div&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">a @<span class="hljs-attr">click=<span class="hljs-string">"show"&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">img
            <span class="hljs-attr">:src=<span class="hljs-string">"require('@/assets/arr2.png')"
            <span class="hljs-attr">:style=<span class="hljs-string">"{
              transform: showHistory ? 'rotate(0deg)' : 'rotate(-180deg)',
            }"
          /&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">a&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
      <span class="hljs-tag">&lt;<span class="hljs-name">ul <span class="hljs-attr">class=<span class="hljs-string">"history" <span class="hljs-attr">v-show=<span class="hljs-string">"showHistory"&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">li <span class="hljs-attr">v-for=<span class="hljs-string">"(item, index) in navigationHistoryStack" <span class="hljs-attr">:key=<span class="hljs-string">"index"&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">span&gt;{{ item.fileName }}<span class="hljs-tag">&lt;/<span class="hljs-name">span&gt;

          <span class="hljs-tag">&lt;<span class="hljs-name">span <span class="hljs-attr">v-if=<span class="hljs-string">"getIsCurrentHistoryNavigationItem(item)"&gt; (当前)<span class="hljs-tag">&lt;/<span class="hljs-name">span&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">li&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">ul&gt;

      <span class="hljs-tag">&lt;<span class="hljs-name">div&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">button @<span class="hljs-attr">click=<span class="hljs-string">"navigationBack"&gt;
          <span class="hljs-tag">&lt;<span class="hljs-name">img
            <span class="hljs-attr">style=<span class="hljs-string">"transform: rotate(-90deg)"
            <span class="hljs-attr">:src=<span class="hljs-string">"require('@/assets/arr.png')"
          /&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">button&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">div&gt;</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h3><strong>五、问题修复与优化</strong></h3>
<p>问题1：历史条目判断错误</p>
<p>测试的时候会发现一个问题，用id判断当前页面所在的堆栈位置，会始终定位到最近一次，相当于FirstOrDefault，因为历史队列可以重复添加，所以需要引入一个isCurrent的bool值属性，来作为判断依据。</p>
<p>这相当于是增加了状态变量，从&ldquo;无状态&rdquo;变换成&ldquo;有状态&rdquo;，意味着我们要维护这个状态。好处是可以简单的从isCurrent就能判断状态，坏处就是要另写代码维护状态，增加了代码的复杂性。</p>
<p>将navigationTo函数改写成如下：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="10" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22%5CnnavigationTo(folder%3A%20FileBriefWithThumbnailDto)%20%7B%5Cn%20%20%20%20var%20toIndex%20%3D%20Enumerable.from(this.NavigationStack).indexOf(folder)%3B%5Cn%20%20%20%20if%20(toIndex%20%3E%3D%200)%20%7B%5Cn%20%20%20%20%20%20this.NavigationStack.splice(%5Cn%20%20%20%20%20%20%20%20toIndex%20%2B%201%2C%5Cn%20%20%20%20%20%20%20%20this.NavigationStack.length%20-%20toIndex%20-%201%5Cn%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20this.NavigationStack.push(folder)%3B%5Cn%20%20%20%20%7D%5Cn%20%20%20%20if%20(this.toFolder(folder))%20%7B%5Cn%20%20%20%20%20%20%20%20this.navigationHistoryStack.forEach((element)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20element%5B%5C%22isCurrent%5C%22%5D%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20folder%5B%5C%22isCurrent%5C%22%5D%20%3D%20true%3B%5Cn%20%20%20%20%20%20%20%20this.navigationHistoryStack.unshift(folder)%3B%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs">
<span class="hljs-title function_">navigationTo(<span class="hljs-params">folder: FileBriefWithThumbnailDto) {
    <span class="hljs-keyword">var toIndex = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack).<span class="hljs-title function_">indexOf(folder);
    <span class="hljs-keyword">if (toIndex &gt;= <span class="hljs-number">0) {
      <span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack.<span class="hljs-title function_">splice(
        toIndex + <span class="hljs-number">1,
        <span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack.<span class="hljs-property">length - toIndex - <span class="hljs-number">1
      );
    } <span class="hljs-keyword">else {
      <span class="hljs-variable language_">this.<span class="hljs-property">NavigationStack.<span class="hljs-title function_">push(folder);
    }
    <span class="hljs-keyword">if (<span class="hljs-variable language_">this.<span class="hljs-title function_">toFolder(folder)) {
        <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-title function_">forEach(<span class="hljs-function">(<span class="hljs-params">element) =&gt; {
          element[<span class="hljs-string">"isCurrent"] = <span class="hljs-literal">false;
        });
        folder[<span class="hljs-string">"isCurrent"] = <span class="hljs-literal">true;
        <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-title function_">unshift(folder);
      }
  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>判断是否为当前的函数则简化为如下：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="9" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22%20%20%20%20getIsCurrentHistoryNavigationItem(item)%20%7B%5Cn%20%20%20%20%20%20var%20result%20%3D%20item%5B%5C%22isCurrent%5C%22%5D%3B%5Cn%20%20%20%20%20%20return%20result%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs">    <span class="hljs-title function_">getIsCurrentHistoryNavigationItem(<span class="hljs-params">item) {
      <span class="hljs-keyword">var result = item[<span class="hljs-string">"isCurrent"];
      <span class="hljs-keyword">return result;
    },</span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>从导航历史队列跳转的目录，也需要处理导航堆栈，因此从navigationTo函数中将这一部分剥离出来单独形成函数命名为dealWithNavigationStack：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22dealWithNavigationStack(folder)%20%7B%5Cn%20%20%20%20%20%20var%20toIndex%20%3D%20Enumerable.from(this.navigationStack).indexOf(%5Cn%20%20%20%20%20%20%20%20(c)%20%3D%3E%20c.id%20%3D%3D%20folder.id%5Cn%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%20%20if%20(toIndex%20%3E%3D%200)%20%7B%5Cn%20%20%20%20%20%20%20%20this.navigationStack.splice(%5Cn%20%20%20%20%20%20%20%20%20%20toIndex%20%2B%201%2C%5Cn%20%20%20%20%20%20%20%20%20%20this.navigationStack.length%20-%20toIndex%20-%201%5Cn%20%20%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20this.navigationStack.push(folder)%3B%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-title function_">dealWithNavigationStack(<span class="hljs-params">folder) {
      <span class="hljs-keyword">var toIndex = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-variable language_">this.<span class="hljs-property">navigationStack).<span class="hljs-title function_">indexOf(
        <span class="hljs-function">(<span class="hljs-params">c) =&gt; c.<span class="hljs-property">id == folder.<span class="hljs-property">id
      );
      <span class="hljs-keyword">if (toIndex &gt;= <span class="hljs-number">0) {
        <span class="hljs-variable language_">this.<span class="hljs-property">navigationStack.<span class="hljs-title function_">splice(
          toIndex + <span class="hljs-number">1,
          <span class="hljs-variable language_">this.<span class="hljs-property">navigationStack.<span class="hljs-property">length - toIndex - <span class="hljs-number">1
        );
      } <span class="hljs-keyword">else {
        <span class="hljs-variable language_">this.<span class="hljs-property">navigationStack.<span class="hljs-title function_">push(folder);
      }
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&ldquo;前进&rdquo;函数与&ldquo;后退&rdquo;函数分别改写为：&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22navigationHistoryForward()%20%7B%5Cn%20%20%20%20%20%20var%20currentIndex%20%3D%20Enumerable.from(this.navigationHistoryStack).indexOf(%5Cn%20%20%20%20%20%20%20%20(c)%20%3D%3E%20c%5B%5C%22isCurrent%5C%22%5D%5Cn%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%20%20if%20(currentIndex%20%3E%200)%20%7B%5Cn%20%20%20%20%20%20%20%20var%20forwardIndex%20%3D%20currentIndex%20-%201%3B%5Cn%5Cn%20%20%20%20%20%20%20%20var%20folder%20%3D%20this.navigationHistoryStack%5BforwardIndex%5D%3B%5Cn%20%20%20%20%20%20%20%20this.dealWithNavigationStack(folder)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20if%20(this.toFolder(folder))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20this.navigationHistoryStack.forEach((element)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20element%5B%5C%22isCurrent%5C%22%5D%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20this.navigationHistoryStack%5BforwardIndex%5D%5B%5C%22isCurrent%5C%22%5D%20%3D%20true%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-title function_">navigationHistoryForward() {
      <span class="hljs-keyword">var currentIndex = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack).<span class="hljs-title function_">indexOf(
        <span class="hljs-function">(<span class="hljs-params">c) =&gt; c[<span class="hljs-string">"isCurrent"]
      );
      <span class="hljs-keyword">if (currentIndex &gt; <span class="hljs-number">0) {
        <span class="hljs-keyword">var forwardIndex = currentIndex - <span class="hljs-number">1;

        <span class="hljs-keyword">var folder = <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack[forwardIndex];
        <span class="hljs-variable language_">this.<span class="hljs-title function_">dealWithNavigationStack(folder);

        <span class="hljs-keyword">if (<span class="hljs-variable language_">this.<span class="hljs-title function_">toFolder(folder)) {
          <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-title function_">forEach(<span class="hljs-function">(<span class="hljs-params">element) =&gt; {
            element[<span class="hljs-string">"isCurrent"] = <span class="hljs-literal">false;
          });
          <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack[forwardIndex][<span class="hljs-string">"isCurrent"] = <span class="hljs-literal">true;
        }
      }
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22navigationHistoryBack()%20%7B%5Cn%20%20%20%20%20%20var%20currentIndex%20%3D%20Enumerable.from(this.navigationHistoryStack).indexOf(%5Cn%20%20%20%20%20%20%20%20(c)%20%3D%3E%20c%5B%5C%22isCurrent%5C%22%5D%5Cn%20%20%20%20%20%20)%3B%5Cn%20%20%20%20%20%20if%20(currentIndex%20%3C%20this.navigationHistoryStack.length%20-%201)%20%7B%5Cn%20%20%20%20%20%20%20%20var%20forwardIndex%20%3D%20currentIndex%20%2B%201%3B%5Cn%5Cn%20%20%20%20%20%20%20%20var%20folder%20%3D%20this.navigationHistoryStack%5BforwardIndex%5D%3B%5Cn%20%20%20%20%20%20%20%20this.dealWithNavigationStack(folder)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20if%20(this.toFolder(folder))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20this.navigationHistoryStack.forEach((element)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20element%5B%5C%22isCurrent%5C%22%5D%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20this.navigationHistoryStack%5BforwardIndex%5D%5B%5C%22isCurrent%5C%22%5D%20%3D%20true%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"><span class="hljs-title function_">navigationHistoryBack() {
      <span class="hljs-keyword">var currentIndex = <span class="hljs-title class_">Enumerable.<span class="hljs-title function_">from(<span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack).<span class="hljs-title function_">indexOf(
        <span class="hljs-function">(<span class="hljs-params">c) =&gt; c[<span class="hljs-string">"isCurrent"]
      );
      <span class="hljs-keyword">if (currentIndex &lt; <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-property">length - <span class="hljs-number">1) {
        <span class="hljs-keyword">var forwardIndex = currentIndex + <span class="hljs-number">1;

        <span class="hljs-keyword">var folder = <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack[forwardIndex];
        <span class="hljs-variable language_">this.<span class="hljs-title function_">dealWithNavigationStack(folder);

        <span class="hljs-keyword">if (<span class="hljs-variable language_">this.<span class="hljs-title function_">toFolder(folder)) {
          <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-title function_">forEach(<span class="hljs-function">(<span class="hljs-params">element) =&gt; {
            element[<span class="hljs-string">"isCurrent"] = <span class="hljs-literal">false;
          });
          <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack[forwardIndex][<span class="hljs-string">"isCurrent"] = <span class="hljs-literal">true;
        }
      }
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>问题2：文件描述对象重叠</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/d6b962dfac3340b19b28bffe8653ff4c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_13,color_FFFFFF,t_70,g_se,x_16" alt="" width="343" height="258" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/d6b962dfac3340b19b28bffe8653ff4c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5p6X5pmTbHg=,size_13,color_FFFFFF,t_70,g_se,x_16" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fd6b962dfac3340b19b28bffe8653ff4c.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_d3F5LXplbmhlaQ%2Cshadow_50%2Ctext_Q1NETiBA5p6X5pmTbHg%3D%2Csize_13%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22343%22%2C%22height%22%3A%22258%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;</p>
<p>先看现象，重复进入&ldquo;文件夹A&rdquo;的时候，都标记为（当前），这显然是错误的</p>
<p>请留意navigationTo中的这一段代码：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22%20if%20(this.toFolder(folder))%20%7B%5Cn%20%20%20%20%20%20%20%20this.navigationHistoryStack.forEach((element)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20element%5B%5C%22isCurrent%5C%22%5D%20%3D%20false%3B%5Cn%20%20%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20folder%5B%5C%22isCurrent%5C%22%5D%20%3D%20true%3B%5Cn%20%20%20%20%20%20%20%20this.navigationHistoryStack.unshift(folder)%3B%5Cn%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs"> <span class="hljs-keyword">if (<span class="hljs-variable language_">this.<span class="hljs-title function_">toFolder(folder)) {
        <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-title function_">forEach(<span class="hljs-function">(<span class="hljs-params">element) =&gt; {
          element[<span class="hljs-string">"isCurrent"] = <span class="hljs-literal">false;
        });
        folder[<span class="hljs-string">"isCurrent"] = <span class="hljs-literal">true;
        <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-title function_">unshift(folder);
      }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>这里隐藏了一个bug，逻辑是将所有的历史队列条目去除当前标记，然后将最新的目标标记为当前并压入历史队列，这里的&nbsp;folder这一对象来自于listMessages，</p>
<p>JavaScript在5中基本数据类型（Undefined、Null、Boolean、Number和String）之外的类型，都是按地址访问的，因此赋值的是对象的引用而不是对象本身，当重复进入文件夹时，folder与上一次进入添加到队列中的folder，<strong>实际上是同一个对象！</strong></p>
<p>因此所有的&ldquo;文件夹A&rdquo;都被标记为&ldquo;（当前）&rdquo;了</p>
<p>我们需要将&nbsp;this.navigationHistoryStack.unshift(folder);改写，提取出一个名称为pushNavigationHistoryStack的入队函数：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22TypeScript%22%2C%22code%22%3A%22%20%20%20pushNavigationHistoryStack(item)%20%7B%5Cn%20%20%20%20%20%20var%20newItem%20%3D%20Object.assign(%7B%7D%2C%20item)%3B%5Cn%5Cn%20%20%20%20%20%20if%20(this.navigationHistoryStack.length%20%3E%2010)%20%7B%5Cn%20%20%20%20%20%20%20%20this.navigationHistoryStack.pop()%3B%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20this.navigationHistoryStack.unshift(newItem)%3B%5Cn%20%20%20%20%7D%2C%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-TypeScript hljs">   <span class="hljs-title function_">pushNavigationHistoryStack(<span class="hljs-params">item) {
      <span class="hljs-keyword">var newItem = <span class="hljs-title class_">Object.<span class="hljs-title function_">assign({}, item);

      <span class="hljs-keyword">if (<span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-property">length &gt; <span class="hljs-number">10) {
        <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-title function_">pop();
      }
      <span class="hljs-variable language_">this.<span class="hljs-property">navigationHistoryStack.<span class="hljs-title function_">unshift(newItem);
    },</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>这里加入了一个控制，历史队列最多容纳10个条目，大于10个有新的条目入队列时，将剔除最后一条（也就是最早的一条记录，记录越早角标越大）。</p>
<p>接下来运行yarn serve来看看最终效果：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/ef5244ca81af4f868a8ea757df846bec.gif" alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/ef5244ca81af4f868a8ea757df846bec.gif" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fef5244ca81af4f868a8ea757df846bec.gif%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22%22%2C%22height%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202203/644861-20220311231146317-1166894824.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;</p>
<p>&nbsp;代码仓库：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="jevonsflash/vue-explorer-sample (github.com)" href="https://github.com/jevonsflash/vue-explorer-sample" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/jevonsflash/vue-explorer-sample" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fjevonsflash%2Fvue-explorer-sample%22%2C%22text%22%3A%22jevonsflash%2Fvue-explorer-sample%20(github.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.0.8%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM276%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.0.8%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM276%22%2C%22id%22%3A%22HZrpPe-1647011356722%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.0.8/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M276" data-link-title="jevonsflash/vue-explorer-sample (github.com)" data-widget="csdnlink">jevonsflash/vue-explorer-sample (github.com)</a></span></p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="jevonsflash/vue-explorer-sample (gitee.com)" href="https://gitee.com/jevonsflash/vue-explorer-sample" data-cke-enter-mode="2" data-cke-saved-href="https://gitee.com/jevonsflash/vue-explorer-sample" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgitee.com%2Fjevonsflash%2Fvue-explorer-sample%22%2C%22text%22%3A%22jevonsflash%2Fvue-explorer-sample%20(gitee.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.0.8%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM276%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.0.8%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM276%22%2C%22id%22%3A%22jWs2Wx-1647011356721%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.0.8/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M276" data-link-title="jevonsflash/vue-explorer-sample (gitee.com)" data-widget="csdnlink">jevonsflash/vue-explorer-sample (gitee.com)</a></span></p>
<p><br />
</p>
<p>
<span data-cke-copybin-start="1">
<span data-cke-copybin-end="1">​</span></span></p>