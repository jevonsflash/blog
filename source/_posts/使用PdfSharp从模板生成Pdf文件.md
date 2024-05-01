---
thumbnail: images/8e950993bb724d9cb4f5a53b45aece37.png
title: 使用PdfSharp从模板生成Pdf文件
excerpt: >-
  最近在做一个生成文档的需求。通过先制作一个包含各字段占位符的文档模板，导入这个模板并填写内容替换掉占位符，再输出成最终文件。由于版式固定，安全性更好，业务上常用Pdf作为最终标准化的格式，
  在.Net平台下，可以使用PdfSharp导入，编辑，导出Pdf文档。
tags:
  - [.NET]
categories:
  - [.NET]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2022-10-25 15:47:00/使用PdfSharp从模板生成Pdf文件.html'
abbrlink: e8d90a89
date: 2022-10-25 15:47:00
cover:
description:
---
<span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span>
<p>最近在做一个生成文档的需求。通过先制作一个包含各字段占位符的文档模板，导入这个模板并填写内容替换掉占位符，再输出成最终文件。</p>
<p>由于版式固定，安全性更好，业务上常用Pdf作为最终标准化的格式，&nbsp;在.Net平台下，可以使用PdfSharp导入，，导出Pdf文档。这次做一个生成电子处方Pdf的小示例：</p>
<h2>制作模板</h2>
<p>使用一个Pdf器（如福昕PDF器）创建模板RecipeTemplate</p>
<p>用[形状]绘制表格框体，用[文本]工具，先插入好固定的内容，比如标题、和各栏目冒号之前的内容。</p>
<p>绘制完成如下图</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="14" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/8e950993bb724d9cb4f5a53b45aece37.png" alt="" width="570" height="527" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/8e950993bb724d9cb4f5a53b45aece37.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F8e950993bb724d9cb4f5a53b45aece37.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22570%22%2C%22height%22%3A%22527%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;再用[表单 - 文本域] 工具，在各个需要生成内容的地方插入表单项。</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="13" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/25ab27f8eeab4f76a97f52bc08379f96.png" alt="" width="306" height="115" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/25ab27f8eeab4f76a97f52bc08379f96.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F25ab27f8eeab4f76a97f52bc08379f96.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22306%22%2C%22height%22%3A%22115%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>文本域名称中，填入占位符</p>
<p>假定占位符规则为：</p>
<ol>
<li>图片占位符： #{字段名称}#</li>
<li>文字占位符： ${字段名称}$</li>
</ol>
<p>那么&ldquo;医院名称&rdquo;展位符则设置如下：&nbsp;</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="12" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/ab7cfc99526d46ffa7d5ec73e37fca05.png" alt="" width="214" height="107" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/ab7cfc99526d46ffa7d5ec73e37fca05.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fab7cfc99526d46ffa7d5ec73e37fca05.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22214%22%2C%22height%22%3A%22107%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;</p>
<p>&nbsp;完成所有字段的占位符，如下图：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="11" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/22dde602ac5e4c29a8f7646bab38f025.png" alt="" width="440" height="621" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/22dde602ac5e4c29a8f7646bab38f025.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F22dde602ac5e4c29a8f7646bab38f025.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22440%22%2C%22height%22%3A%22621%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;</p>
<h2>编写代码</h2>
<p>用visual studio新建一个PdfGenerator的项目，保存RecipeTemplate.pdf至Assets目录并设置复制输出目录方式为&ldquo;始终复制&rdquo;</p>
<p>项目引用PdfSharp库</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="10" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22bash%22%2C%22code%22%3A%22dotnet%20add%20package%20PdfSharp%20--version%201.50.5147%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-bash hljs">dotnet add package PdfSharp --version 1.50.5147</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>创建模型类RecipeDocInfo，此类用于承载业务数据</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="9" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20class%20RecipeDocInfo%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20public%20int%20Id%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20HospitalName%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20DepartmentName%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20ClientName%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20ClientAge%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20ClientSex%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20Rps%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20DraftEmployeeName%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20Name%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20decimal%20Price%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20Status%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20AuditEmployeeName%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20DraftEmployeeSignature%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20AuditEmployeeSignature%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20string%20StartTimeString%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">RecipeDocInfo
    {
        <span class="hljs-keyword">public <span class="hljs-built_in">int Id { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string HospitalName { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string DepartmentName { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string ClientName { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string ClientAge { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string ClientSex { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string Rps { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string DraftEmployeeName { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string Name { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">decimal Price { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string Status { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string AuditEmployeeName { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string DraftEmployeeSignature { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string AuditEmployeeSignature { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public <span class="hljs-built_in">string StartTimeString { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
    }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;Exporter.cs中，创建ExportDocxByObject方法，使用PdfReader.Open()可以获取PdfDocument对象</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22public%20static%20PdfDocument%20ExportDocxByObject(string%20templatePath%2C%20object%20data)%5Cn%7B%5Cn%20%20%20%20%20%20var%20doc%20%3D%20PdfReader.Open(templatePath%2C%20PdfDocumentOpenMode.Modify)%3B%5Cn%20%20%20%20%20%20return%20doc%3B%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static PdfDocument <span class="hljs-title">ExportDocxByObject(<span class="hljs-params"><span class="hljs-built_in">string templatePath, <span class="hljs-built_in">object data)
{
      <span class="hljs-keyword">var doc = PdfReader.Open(templatePath, PdfDocumentOpenMode.Modify);
      <span class="hljs-keyword">return doc;
}</span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>PdfDocument.AcroForm()方法可以拿到Pdf文档中的表单对象，该对象中的Fields存储表单项目集合，遍历Key值获取每个表单项</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22PdfAcroForm%20form%20%3D%20doc.AcroForm%3B%5Cnforeach%20(var%20fieldName%20in%20form.Fields.Names)%5Cn%7B%5Cn%20%20%20%20%20var%20run%20%3D%20form.Fields%5BfieldName%5D%20as%20PdfTextField%3B%5Cn%20%20%20%20%20text%20%3D%20run.Name%3B%20%20%2F%2F%E8%8E%B7%E5%8F%96%E6%AF%8F%E4%B8%80%E4%B8%AA%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%90%8D%E7%A7%B0%5Cn%5Cn%7D%20%20%20%20%20%20%20%20%20%20%5Cn%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">PdfAcroForm form = doc.AcroForm;
<span class="hljs-keyword">foreach (<span class="hljs-keyword">var fieldName <span class="hljs-keyword">in form.Fields.Names)
{
     <span class="hljs-keyword">var run = form.Fields[fieldName] <span class="hljs-keyword">as PdfTextField;
     text = run.Name;  <span class="hljs-comment">//获取每一个占位符名称

}          

</span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;表单项的Name属性为我们设置的表单名称，即占位符。</p>
<p>接下来处理数据对象，通过反射方式获取对象成员名称，并与占位符作匹配，若占位符包含（string.Contains()）该成员名称，则将值写入这个表单项的Value中，这里注意一个多行处理的情况。</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22foreach%20(PropertyInfo%20p%20in%20pi)%5Cn%7B%5Cn%5Ctstring%20key%20%3D%20%24%5C%22%24%7Bp.Name%7D%24%5C%22%3B%5Cn%5Ctif%20(text.Contains(key))%5Cn%5Ct%7B%5Cn%5Ct%5Ctvar%20value%20%3D%20%5C%22%5C%22%3B%5Cn%5Ct%5Cttry%5Cn%5Ct%5Ct%7B%5Cn%5Ct%5Ct%5Ctvalue%20%3D%20%20p.GetValue(model%2C%20null).ToString()%3B%5Cn%5Ct%5Ct%7D%5Cn%5Ct%5Ctcatch%20(Exception%20ex)%5Cn%5Ct%5Ct%7B%5Cn%5Ct%5Ct%7D%5Cn%5Cn%5Ct%5Ctif%20(value.Contains('%5C%5Cn'))%5Cn%5Ct%5Ct%7B%5Cn%5Ct%5Ct%5Ctrun.MultiLine%20%3D%20true%3B%5Cn%5Cn%5Ct%5Ct%7D%5Cn%5Cn%5Ct%5Ctrun.Value%20%3D%20new%20PdfString(value)%3B%5Cn%5Ct%5Ctrun.ReadOnly%20%3D%20true%3B%5Cn%5Ct%7D%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">foreach (PropertyInfo p <span class="hljs-keyword">in pi)
{
	<span class="hljs-built_in">string key = <span class="hljs-string">$"$<span class="hljs-subst">{p.Name}$";
	<span class="hljs-keyword">if (text.Contains(key))
	{
		<span class="hljs-keyword">var <span class="hljs-keyword">value = <span class="hljs-string">"";
		<span class="hljs-keyword">try
		{
			<span class="hljs-keyword">value =  p.GetValue(model, <span class="hljs-literal">null).ToString();
		}
		<span class="hljs-keyword">catch (Exception ex)
		{
		}

		<span class="hljs-keyword">if (<span class="hljs-keyword">value.Contains(<span class="hljs-string">'\n'))
		{
			run.MultiLine = <span class="hljs-literal">true;

		}

		run.Value = <span class="hljs-keyword">new PdfString(<span class="hljs-keyword">value);
		run.ReadOnly = <span class="hljs-literal">true;
	}
}</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;readOnly设置为true，以防止Pdf表单中的值被随意修改。</p>
<p>同理我们处理图片：</p>
<p>首先数据对象中的内容，应为图片的本地路径或者网络Url</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22var%20filePath%20%3D%20p.GetValue(model%2C%20null)%20as%20string%3B%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">var filePath = p.GetValue(model, <span class="hljs-literal">null) <span class="hljs-keyword">as <span class="hljs-built_in">string;</span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;然后读取，绘制图片，注意图片的大小以及位置坐标显示，与表单所对应的框架（/Rect）一致</p>
<p>详细的绘图方式，请参考官方文档：<span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="PDFsharp Sample: Graphics - PDFsharp and MigraDoc Wiki" href="http://www.pdfsharp.net/wiki/Graphics-sample.ashx" data-cke-enter-mode="2" data-cke-saved-href="http://www.pdfsharp.net/wiki/Graphics-sample.ashx" data-cke-widget-data="%7B%22url%22%3A%22http%3A%2F%2Fwww.pdfsharp.net%2Fwiki%2FGraphics-sample.ashx%22%2C%22text%22%3A%22PDFsharp%20Sample%3A%20Graphics%20-%20PDFsharp%20and%20MigraDoc%20Wiki%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.2.0%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM85B%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.2.0%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM85B%22%2C%22id%22%3A%22p2zP58-1666684020816%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.2.0/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M85B" data-link-title="PDFsharp Sample: Graphics - PDFsharp and MigraDoc Wiki" data-widget="csdnlink">PDFsharp Sample: Graphics - PDFsharp and MigraDoc Wiki</a></span></p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22var%20rectangle%20%3D%20run.Elements.GetRectangle(%5C%22%2FRect%5C%22)%3B%5Cnvar%20xForm%20%3D%20new%20XForm(doc%2C%20rectangle.Size)%3B%5Cnusing%20(var%20xGraphics%20%3D%20XGraphics.FromPdfPage(doc.Pages%5B0%5D))%5Cn%7B%5Cn%5Ctvar%20image%20%3D%20XImage.FromStream(fileStream)%3B%5Cn%5CtxGraphics.DrawImage(image%2C%20rectangle.ToXRect()%20%2Bnew%20XPoint(0%2C%20400))%3B%5Cn%5Ctvar%20state%20%3D%20xGraphics.Save()%3B%5Cn%5CtxGraphics.Restore(state)%3B%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">var rectangle = run.Elements.GetRectangle(<span class="hljs-string">"/Rect");
<span class="hljs-keyword">var xForm = <span class="hljs-keyword">new XForm(doc, rectangle.Size);
<span class="hljs-keyword">using (<span class="hljs-keyword">var xGraphics = XGraphics.FromPdfPage(doc.Pages[<span class="hljs-number">0]))
{
	<span class="hljs-keyword">var image = XImage.FromStream(fileStream);
	xGraphics.DrawImage(image, rectangle.ToXRect() +<span class="hljs-keyword">new XPoint(<span class="hljs-number">0, <span class="hljs-number">400));
	<span class="hljs-keyword">var state = xGraphics.Save();
	xGraphics.Restore(state);
}</span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>完成Exporter.cs之后，在Main函数中使用</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22public%20class%20Program%5Cn%7B%5Cn%5Ctpublic%20static%20async%20Task%20Main(string%5B%5D%20args)%5Cn%5Ct%7B%5Cn%5Ct%5CtConsole.WriteLine(%5C%22Generator%20begin%5C%22)%3B%5Cn%5Ct%5Ctvar%20docinfo%20%3D%20GetRecipeDocInfo()%20%7B%20%20...%20%20%7D%3B%5Cn%5Ct%5Ctvar%20result%20%3D%20Exporter.ExportDocxByObject(%2F*template%20path*%2F%2C%20docinfo)%3B%5Cn%5Ct%5Ctresult.Save(%2F*output%20path*%2F)%3B%5Cn%5Ct%7D%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">Program
{
	<span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-keyword">static <span class="hljs-keyword">async Task <span class="hljs-title">Main(<span class="hljs-params"><span class="hljs-built_in">string[] args)
	{
		Console.WriteLine(<span class="hljs-string">"Generator begin");
		<span class="hljs-keyword">var docinfo = GetRecipeDocInfo() {  ...  };
		<span class="hljs-keyword">var result = Exporter.ExportDocxByObject(<span class="hljs-comment">/*template path*/, docinfo);
		result.Save(<span class="hljs-comment">/*output path*/);
	}
}</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<h2>&nbsp;测试</h2>
<p>至此完成了所有工作，运行程序，待程序执行完毕后，打开output目录下生成的文档，看看最后效果：</p>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><img src="https://img-blog.csdnimg.cn/c93ec78be9e74137beaa240998d4956e.png" alt="" width="410" height="579" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/c93ec78be9e74137beaa240998d4956e.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fc93ec78be9e74137beaa240998d4956e.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22410%22%2C%22height%22%3A%22579%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" /><span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2022.cnblogs.com/blog/644861/202210/644861-20221025154702798-996595367.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<h2>项目地址：</h2>
<p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" title="jevonsflash/PdfGenerator (github.com)" href="https://github.com/jevonsflash/PdfGenerator" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/jevonsflash/PdfGenerator" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fjevonsflash%2FPdfGenerator%22%2C%22text%22%3A%22jevonsflash%2FPdfGenerator%20(github.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.2.0%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM85B%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.2.0%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM85B%22%2C%22id%22%3A%22LhhumN-1666684020804%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.2.0/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M85B" data-link-title="jevonsflash/PdfGenerator (github.com)" data-widget="csdnlink">jevonsflash/PdfGenerator (github.com)</a></span></p>
<p>&nbsp;</p>
<h2>结束语</h2>
<p>根据这一思想，我们可以直观地我们想要的最终文件，无论这个文档多么复杂，我们只用关心占位符和最终的值。</p>
<p>同样，这一思想也可以应用到NPOI库来生成Word文档。</p>
<span data-cke-copybin-start="1"><span data-cke-copybin-end="1">​</span></span>