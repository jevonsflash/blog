---
thumbnail:
cover:
title: '带农历日历的DatePicker控件！Xamarin控件开发小记'
excerpt:
description:
date: 2018-07-23 23:50:00
tags:
  - Xamarin
  - DatePicker
  - 日期选择

categories:
  - [.NET MAUI]
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2018-07-23 23:50:00/带农历日历的DatePicker控件！Xamarin控件开发小记.html
---
<p>闲来无事开发了个日期选择控件，感兴趣的同学前往：</p><p><a data-cke-saved-href="https://github.com/MatoApps/Mato.DatePicker" href="https://github.com/MatoApps/Mato.DatePicker">https://github.com/MatoApps/Mato.DatePicker</a></p><h1>Mato.DatePicker</h1><p><a href="https://github.com/MatoApps/Mato.DatePicker/blob/master/Assets/ss.gif" target="_blank"><img alt="avatar" src="https://github.com/MatoApps/Mato.DatePicker/raw/master/Assets/ss.gif"/></a></p><h2><a class="anchor" href="https://github.com/MatoApps/Mato.DatePicker#%E8%AF%B4%E6%98%8E" id="user-content-说明"></a>说明</h2><ol>
<li>这是一个带有农历日历的日期选择Xamarin控件</li>
<li>可以指定初始日期</li>
<li>多选和单选日期</li>
</ol><h2><a class="anchor" href="https://github.com/MatoApps/Mato.DatePicker#%E5%BC%95%E7%94%A8" id="user-content-引用"></a>引用</h2><ol>
<li>PCL：<a href="https://www.nuget.org/packages/Mato.DatePicker.PCL/" rel="nofollow">https://www.nuget.org/packages/Mato.DatePicker.PCL/</a></li>
<li>Android：<a href="https://www.nuget.org/packages/Mato.DatePicker.Android/" rel="nofollow">https://www.nuget.org/packages/Mato.DatePicker.Android/</a></li>
<li>iOS: <a href="https://www.nuget.org/packages/Mato.DatePicker.iOS/" rel="nofollow">https://www.nuget.org/packages/Mato.DatePicker.iOS/</a></li>
</ol><h2><a class="anchor" href="https://github.com/MatoApps/Mato.DatePicker#%E7%94%A8%E6%B3%95" id="user-content-用法"></a>用法</h2><ol>
<li>在引用iOS安装包时候需要在<code>AppDelegate.cs</code>做如下操作：</li>
</ol><div class="cnblogs_code">
<pre><span style="color: #0000ff;">public</span> <span style="color: #0000ff;">override</span> <span style="color: #0000ff;">bool</span><span style="color: #000000;"> FinishedLaunching(UIApplication app, NSDictionary options)
{
...
    </span><span style="color: #0000ff;">global</span><span style="color: #000000;">::Xamarin.Forms.Forms.Init();   
    Mato.DatePicker.iOS.ChinaDateServer ssChinaDateServer</span>=<span style="color: #0000ff;">new</span> Mato.DatePicker.iOS.ChinaDateServer(); <span style="color: #008000;">//</span><span style="color: #008000;">在此插入这段语句</span>
    LoadApplication(<span style="color: #0000ff;">new</span><span style="color: #000000;"> App());
}</span></pre>
</div><p> </p><p>同样的，在引用Android安装包后，需要在<code>MainActivity.cs</code>做如下操作：</p><div class="cnblogs_code">
<pre><span style="color: #0000ff;">protected</span> <span style="color: #0000ff;">override</span> <span style="color: #0000ff;">void</span><span style="color: #000000;"> OnCreate(Bundle bundle)
{
...
    </span><span style="color: #0000ff;">global</span>::Xamarin.Forms.Forms.Init(<span style="color: #0000ff;">this</span><span style="color: #000000;">, bundle);
    DatePicker.Android.ChinaDateServer ssChinaDateServer </span>= <span style="color: #0000ff;">new</span> DatePicker.Android.ChinaDateServer(); <span style="color: #008000;">//</span><span style="color: #008000;">在此插入这段语句</span>
    LoadApplication(<span style="color: #0000ff;">new</span><span style="color: #000000;"> App());
}</span></pre>
</div><p> </p><ol start="2">
<li>在这个页面中提供了如何使用这一控件<a href="https://github.com/MatoApps/Mato.DatePicker/blob/master/Mato.Sample/Mato.Sample/MainPage.xaml">https://github.com/MatoApps/Mato.DatePicker/blob/master/Mato.Sample/Mato.Sample/MainPage.xaml</a></li>
</ol>