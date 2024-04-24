---
thumbnail:
cover:
title: '用PyInstaller打包PyQt程序'
excerpt:
description:
date: 2021-01-15 17:22:00
tags:
categories: 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2021-01-15 17:22:00/用PyInstaller打包PyQt程序.html
---
<p>在开发Python应用时需要交付客户，可以使用pyinstaller库来打包成exe文件，在用winzip等自解压格式包装成安装文件交付客户，这次记录一下步骤</p>
<ul>
<li>在工程根目录下新建一个打包脚本 packup.py</li>
<li>在工程根目录下创建icon图标，mainIcon.ico</li>
</ul>
<p>比如我的目录结构如下&nbsp;</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="图像" data-cke-widget-id="10">
<p class="cke_widget_element" data-cke-widget-data="{&amp;quot;hasCaption&amp;quot;:false,&amp;quot;src&amp;quot;:&amp;quot;https://img-blog.csdnimg.cn/20210115170503301.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70&amp;quot;,&amp;quot;alt&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;width&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;height&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;lock&amp;quot;:true,&amp;quot;align&amp;quot;:&amp;quot;center&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="image"><span class="cke_image_resizer_wrapper"><img src="https://img-blog.csdnimg.cn/20210115170503301.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70" alt="" data-cke-saved-src="https://img-blog.csdnimg.cn/20210115170503301.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></p>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<ul>
<li>打开packup.py</li>
<li>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="代码段" data-cke-widget-id="9">
<pre class="cke_widget_element" data-cke-widget-data="{&amp;quot;lang&amp;quot;:&amp;quot;python&amp;quot;,&amp;quot;code&amp;quot;:&amp;quot;import  os\nfrom PyInstaller.__main__ import run\nif __name__ == '__main__':\n    base=os.path.abspath(os.path.dirname(__file__))+\&amp;quot;/frame\&amp;quot;\n    pp =base  + \&amp;quot;/main.py\&amp;quot;\n    pp2=base+\&amp;quot;/common\&amp;quot;\n    pp2_1=base+\&amp;quot;/res\&amp;quot;\n    pp3=base+\&amp;quot;/res/jackinfo.png;./\&amp;quot;\n    pp4=base+\&amp;quot;/controls/testData.json;controls\&amp;quot;\n    pp5=base+\&amp;quot;/config.cfg;../\&amp;quot;\n    # opts=[pp,'-F','-p={0}'.format(pp2),'--icon=mainIcon.ico']\n    opts=[pp,'-p={0}'.format(pp2),\n          '--add-data={0}'.format(pp3),\n          '--add-data={0}'.format(pp4),\n          '--add-data={0}'.format(pp5),\n          '--add-data={0}'.format(pp2_1),\n          '--icon=mainIcon.ico']\n    run(opts)&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="codeSnippet"><code class="language-python hljs"><span class="hljs-keyword">import  os
<span class="hljs-keyword">from PyInstaller.__main__ <span class="hljs-keyword">import run
<span class="hljs-keyword">if __name__ == <span class="hljs-string">'__main__':
    base=os.path.abspath(os.path.dirname(__file__))+<span class="hljs-string">"/frame"
    pp =base  + <span class="hljs-string">"/main.py"
    pp2=base+<span class="hljs-string">"/common"
    pp2_1=base+<span class="hljs-string">"/res"
    pp3=base+<span class="hljs-string">"/res/jackinfo.png;./"
    pp4=base+<span class="hljs-string">"/controls/testData.json;controls"
    pp5=base+<span class="hljs-string">"/config.cfg;../"
    <span class="hljs-comment"># opts=[pp,'-F','-p={0}'.format(pp2),'--icon=mainIcon.ico']
    opts=[pp,<span class="hljs-string">'-p={0}'.format(pp2),
          <span class="hljs-string">'--add-data={0}'.format(pp3),
          <span class="hljs-string">'--add-data={0}'.format(pp4),
          <span class="hljs-string">'--add-data={0}'.format(pp5),
          <span class="hljs-string">'--add-data={0}'.format(pp2_1),
          <span class="hljs-string">'--icon=mainIcon.ico']
    run(opts)</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>下面来解析每一段的含义</p>
</li>
<li>
<p>首先是这个</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="代码段" data-cke-widget-id="8">
<pre class="cke_widget_element" data-cke-widget-data="{&amp;quot;code&amp;quot;:&amp;quot;base=os.path.abspath(os.path.dirname(__file__))+\&amp;quot;/frame\&amp;quot;\n   &amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="codeSnippet"><code class="hljs">base=os.path.abspath(os.path.dirname(__file__))+"/frame"
   </code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>还记的第一张图我的工程目录结构吗？这个frame代表是需要打包到安装程序的根目录，也是软件的根目录</p>
</li>
<li>
<p>接下来这个</p>
</li>
</ul>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="代码段" data-cke-widget-id="7">
<pre class="cke_widget_element" data-cke-widget-data="{&amp;quot;code&amp;quot;:&amp;quot;pp =base  + \&amp;quot;/main.py\&amp;quot;&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="codeSnippet"><code class="hljs">pp =base  + "/main.py"</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>这个main.py是主入口，最后也会打包成main.exe并赋予图标</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="图像" data-cke-widget-id="6">
<p class="cke_widget_element" data-cke-widget-data="{&amp;quot;hasCaption&amp;quot;:false,&amp;quot;src&amp;quot;:&amp;quot;https://img-blog.csdnimg.cn/20210115165935406.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70&amp;quot;,&amp;quot;alt&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;width&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;height&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;lock&amp;quot;:true,&amp;quot;align&amp;quot;:&amp;quot;center&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="image"><span class="cke_image_resizer_wrapper"><img src="https://img-blog.csdnimg.cn/20210115165935406.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70" alt="" data-cke-saved-src="https://img-blog.csdnimg.cn/20210115165935406.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></p>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<ul>
<li>然后是参数，第一个参数-p 表示项目中涉及依赖的文件或目录的路径，也就是项目需要import 加载到的文件，有时候import写法不能让python解析器关联到，就需要手动设置这一参数</li>
</ul>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="代码段" data-cke-widget-id="5">
<pre class="cke_widget_element" data-cke-widget-data="{&amp;quot;code&amp;quot;:&amp;quot;pp2 = base + \&amp;quot;/common\&amp;quot;&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="codeSnippet"><code class="hljs">pp2 = base + "/common"</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<ul>
<li>然后是项目需要用到但是不需要依赖的，比如一些图片，配置文件等资源文件，使用参数--add-data</li>
</ul>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="代码段" data-cke-widget-id="4">
<pre class="cke_widget_element" data-cke-widget-data="{&amp;quot;code&amp;quot;:&amp;quot;    pp2_1=base+\&amp;quot;/res\&amp;quot;\n    pp3=base+\&amp;quot;/res/jackinfo.png;./\&amp;quot;\n    pp4=base+\&amp;quot;/controls/testData.json;controls\&amp;quot;\n    pp5=base+\&amp;quot;/config.cfg;../\&amp;quot;&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="codeSnippet"><code class="hljs">    pp2_1=base+"/res"
    pp3=base+"/res/jackinfo.png;./"
    pp4=base+"/controls/testData.json;controls"
    pp5=base+"/config.cfg;../"</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>多个文件间可以用引号隔开，如/res/jackinfo.png;./</p>
<ul>
<li>最后一个是icon图标，用刚刚创建的图标文件</li>
</ul>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="代码段" data-cke-widget-id="3">
<pre class="cke_widget_element" data-cke-widget-data="{&amp;quot;code&amp;quot;:&amp;quot;--icon=mainIcon.ico&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="codeSnippet"><code class="hljs">--icon=mainIcon.ico</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<ul>
<li>最后传这个opts对象给run函数跑一下</li>
</ul>
<div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="代码段" data-cke-widget-id="2">
<pre class="cke_widget_element" data-cke-widget-data="{&amp;quot;code&amp;quot;:&amp;quot;run(opts)\n&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="codeSnippet"><code class="hljs">run(opts)
</code></pre>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>其他可选参数：</p>
<table class=" cke_show_border">
<tbody>
<tr>
<td>-F</td>
<td>-onefile,打包成一个exe文件</td>
</tr>
<tr>
<td>-D</td>
<td>-onefile，创建一个目录，包含exe文件，但会依赖很多文件（默认选项）</td>
</tr>
<tr>
<td>-c</td>
<td>-console，-nowindowed，使用控制台，无窗口（默认）</td>
</tr>
<tr>
<td>-w</td>
<td>-Windowed，-noconsole，使用窗口，无控制台</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
<p>最后运行packup.py，看一下打包的效果：</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="图像" data-cke-widget-id="1">
<p class="cke_widget_element" data-cke-widget-data="{&amp;quot;hasCaption&amp;quot;:false,&amp;quot;src&amp;quot;:&amp;quot;https://img-blog.csdnimg.cn/20210115170235986.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70&amp;quot;,&amp;quot;alt&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;width&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;height&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;lock&amp;quot;:true,&amp;quot;align&amp;quot;:&amp;quot;center&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="image"><span class="cke_image_resizer_wrapper"><img src="https://img-blog.csdnimg.cn/20210115170235986.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70" alt="" data-cke-saved-src="https://img-blog.csdnimg.cn/20210115170235986.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></p>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>&nbsp;</p>
<p>可以看到最后的代码和依赖库都打包成了dll文件</p>
<div class="cke_widget_wrapper cke_widget_block cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-widget-wrapper="1" data-cke-filter="off" data-cke-display-name="图像" data-cke-widget-id="0">
<p class="cke_widget_element" data-cke-widget-data="{&amp;quot;hasCaption&amp;quot;:false,&amp;quot;src&amp;quot;:&amp;quot;https://img-blog.csdnimg.cn/20210115170808833.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70&amp;quot;,&amp;quot;alt&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;width&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;height&amp;quot;:&amp;quot;&amp;quot;,&amp;quot;lock&amp;quot;:true,&amp;quot;align&amp;quot;:&amp;quot;center&amp;quot;,&amp;quot;classes&amp;quot;:[]}" data-cke-widget-upcasted="1" data-cke-widget-keep-attr="0" data-widget="image"><span class="cke_image_resizer_wrapper"><img src="https://img-blog.csdnimg.cn/20210115170808833.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70" alt="" data-cke-saved-src="https://img-blog.csdnimg.cn/20210115170808833.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2pldm9uc2ZsYXNo,size_16,color_FFFFFF,t_70" /><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></p>
<span class="cke_reset cke_widget_drag_handler_container"><img src="https://img2020.cnblogs.com/blog/644861/202201/644861-20220115102707210-752621488.gif" width="15" height="15" class="cke_reset cke_widget_drag_handler" title="点击并拖拽以移动" data-cke-widget-drag-handler="1" /></span></div>
<p>完结，转载请注明文章出处</p>