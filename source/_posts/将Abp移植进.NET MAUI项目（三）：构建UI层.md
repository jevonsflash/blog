---
thumbnail: images/a0a15ef5cc98481cb58307e2866c7904.png
title: 将Abp移植进.NET MAUI项目（三）：构建UI层
excerpt: "很开心，终于到了创建页面的时候了！我们需要两个页面MainPage 主页面\tMusicItemPage 条目编辑页面编写主页面新建一个MainPageViewModel.cs，作为MainPage的ViewModel层    public class MainPageViewModel : ViewModelBase    {        private readonly IRepository<Song, long> songRepository;      ."
tags:
  - Xamarin
  - .net
  - MAUI
  - Abp
categories:
  - .NET
  - .NET MAUI
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2022-05-25 18:46:00/将Abp移植进.NET MAUI项目（三）：构建UI层.html'
abbrlink: ab7a5062
date: 2022-05-25 18:46:00
cover:
description:
---
<span data-cke-copybin-start="1"><span data-cke-copybin-start="1">​</span></span><p><span id="cke_bm_1048S"> 很开心，终于到了创建页面的时候了！</span></p><p>我们需要两个页面</p><ul>
<li>MainPage 主页面</li>
<li>MusicItemPage 条目编辑页面</li>
</ul><h2>编写主页面</h2><p> 新建一个MainPageViewModel.cs，作为MainPage的ViewModel层</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="17" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20class%20MainPageViewModel%20%3A%20ViewModelBase%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20private%20readonly%20IRepository%3CSong%2C%20long%3E%20songRepository%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20MainPageViewModel(IRepository%3CSong%2C%20long%3E%20songRepository)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.RefreshCommand%3Dnew%20Command(Refresh%2C%20(o)%20%3D%3E%20true)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.DeleteCommand%3Dnew%20Command(Delete%2C%20(o)%20%3D%3E%20true)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.songRepository%3DsongRepository%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20private%20void%20Delete(object%20obj)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20songRepository.Delete(obj%20as%20Song)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20private%20async%20void%20Refresh(object%20obj)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.IsRefreshing%3Dtrue%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20getSongs%20%3D%20this.songRepository.GetAllListAsync()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20await%20getSongs.ContinueWith(r%20%3D%3E%20IsRefreshing%3Dfalse)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20songs%20%3D%20await%20getSongs%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.Songs%3Dnew%20ObservableCollection%3CSong%3E(songs)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20private%20ObservableCollection%3CSong%3E%20songs%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20ObservableCollection%3CSong%3E%20Songs%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20get%20%7B%20return%20songs%3B%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20set%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20songs%20%3D%20value%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20RaisePropertyChanged()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20private%20Song%20currentSong%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20Song%20CurrentSong%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20get%20%7B%20return%20currentSong%3B%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20set%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20currentSong%20%3D%20value%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20RaisePropertyChanged()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20private%20bool%20_isRefreshing%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20bool%20IsRefreshing%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20get%20%7B%20return%20_isRefreshing%3B%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20set%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20_isRefreshing%20%3D%20value%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20RaisePropertyChanged()%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20public%20Command%20RefreshCommand%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20Command%20DeleteCommand%20%7B%20get%3B%20private%20set%3B%20%7D%5Cn%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">MainPageViewModel : <span class="hljs-title">ViewModelBase
    {
        <span class="hljs-keyword">private <span class="hljs-keyword">readonly IRepository&lt;Song, <span class="hljs-built_in">long&gt; songRepository;

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">MainPageViewModel(<span class="hljs-params">IRepository&lt;Song, <span class="hljs-built_in">long&gt; songRepository)
        {
            <span class="hljs-keyword">this.RefreshCommand=<span class="hljs-keyword">new Command(Refresh, (o) =&gt; <span class="hljs-literal">true);
            <span class="hljs-keyword">this.DeleteCommand=<span class="hljs-keyword">new Command(Delete, (o) =&gt; <span class="hljs-literal">true);
            <span class="hljs-keyword">this.songRepository=songRepository;

        }
        <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">void <span class="hljs-title">Delete(<span class="hljs-params"><span class="hljs-built_in">object obj)
        {
            songRepository.Delete(obj <span class="hljs-keyword">as Song);
        }
        <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">async <span class="hljs-keyword">void <span class="hljs-title">Refresh(<span class="hljs-params"><span class="hljs-built_in">object obj)
        {
            <span class="hljs-keyword">this.IsRefreshing=<span class="hljs-literal">true;
            <span class="hljs-keyword">var getSongs = <span class="hljs-keyword">this.songRepository.GetAllListAsync();
            <span class="hljs-keyword">await getSongs.ContinueWith(r =&gt; IsRefreshing=<span class="hljs-literal">false);
            <span class="hljs-keyword">var songs = <span class="hljs-keyword">await getSongs;
            <span class="hljs-keyword">this.Songs=<span class="hljs-keyword">new ObservableCollection&lt;Song&gt;(songs);
        }

        <span class="hljs-keyword">private ObservableCollection&lt;Song&gt; songs;

        <span class="hljs-keyword">public ObservableCollection&lt;Song&gt; Songs
        {
            <span class="hljs-keyword">get { <span class="hljs-keyword">return songs; }
            <span class="hljs-keyword">set
            {
                songs = <span class="hljs-keyword">value;
                RaisePropertyChanged();
            }
        }

        <span class="hljs-keyword">private Song currentSong;

        <span class="hljs-keyword">public Song CurrentSong
        {
            <span class="hljs-keyword">get { <span class="hljs-keyword">return currentSong; }
            <span class="hljs-keyword">set
            {
                currentSong = <span class="hljs-keyword">value;
                RaisePropertyChanged();
            }
        }

        <span class="hljs-keyword">private <span class="hljs-built_in">bool _isRefreshing;

        <span class="hljs-keyword">public <span class="hljs-built_in">bool IsRefreshing
        {
            <span class="hljs-keyword">get { <span class="hljs-keyword">return _isRefreshing; }
            <span class="hljs-keyword">set
            {
                _isRefreshing = <span class="hljs-keyword">value;
                RaisePropertyChanged();

            }
        }
        <span class="hljs-keyword">public Command RefreshCommand { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public Command DeleteCommand { <span class="hljs-keyword">get; <span class="hljs-keyword">private <span class="hljs-keyword">set; }
    }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>新建一个MainPage页面</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="16" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/881842dfc6d74fa892ba56fd2464ffc3.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F881842dfc6d74fa892ba56fd2464ffc3.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22954%22%2C%22height%22%3A%22666%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="666" src="881842dfc6d74fa892ba56fd2464ffc3.png" width="954"/></span></p><p>编写Xaml为：</p><p>注意这个页面将继承MauiBoilerplate.ContentPageBase</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="15" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22XML%22%2C%22code%22%3A%22%3C%3Fxml%20version%3D%5C%221.0%5C%22%20encoding%3D%5C%22utf-8%5C%22%20%3F%3E%5Cn%3Cmato%3AContentPageBase%20xmlns%3D%5C%22http%3A%2F%2Fschemas.microsoft.com%2Fdotnet%2F2021%2Fmaui%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20xmlns%3Ax%3D%5C%22http%3A%2F%2Fschemas.microsoft.com%2Fwinfx%2F2009%2Fxaml%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20xmlns%3Amato%3D%5C%22clr-namespace%3AMauiBoilerplate%3Bassembly%3DMauiBoilerplate.Core%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20x%3AClass%3D%5C%22MauiBoilerplate.MainPage%5C%22%3E%5Cn%20%20%20%20%3CGrid%3E%5Cn%20%20%20%20%20%20%20%20%3CGrid.RowDefinitions%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3CRowDefinition%20Height%3D%5C%22155%5C%22%3E%3C%2FRowDefinition%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3CRowDefinition%3E%3C%2FRowDefinition%3E%5Cn%20%20%20%20%20%20%20%20%3C%2FGrid.RowDefinitions%3E%5Cn%5Cn%20%20%20%20%20%20%20%20%3CLabel%20Text%3D%5C%22My%20Music%5C%22%20FontSize%3D%5C%2265%5C%22%3E%3C%2FLabel%3E%5Cn%20%20%20%20%20%20%20%20%3CListView%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Grid.Row%3D%5C%221%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20ItemsSource%3D%5C%22%7BBinding%20Songs%2CMode%3DTwoWay%7D%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20x%3AName%3D%5C%22MainListView%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20RowHeight%3D%5C%2274%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20IsPullToRefreshEnabled%3D%5C%22True%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20IsRefreshing%3D%5C%22%7BBinding%20IsRefreshing%7D%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20RefreshCommand%3D%5C%22%7BBinding%20RefreshCommand%7D%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20SelectedItem%3D%5C%22%7BBinding%20CurrentSong%2CMode%3DTwoWay%7D%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3CListView.Header%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CGrid%20HeightRequest%3D%5C%2296%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CGrid.RowDefinitions%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CRowDefinition%3E%3C%2FRowDefinition%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CRowDefinition%3E%3C%2FRowDefinition%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FGrid.RowDefinitions%3E%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CButton%20Clicked%3D%5C%22AddButton_Clicked%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20CornerRadius%3D%5C%22100%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Text%3D%5C%22%EF%81%A7%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HeightRequest%3D%5C%2244%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20WidthRequest%3D%5C%22200%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20FontFamily%3D%5C%22FontAwesome%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3E%3C%2FButton%3E%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CStackLayout%20VerticalOptions%3D%5C%22End%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Margin%3D%5C%220%2C0%2C0%2C8%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Grid.Row%3D%5C%221%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HorizontalOptions%3D%5C%22Center%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Orientation%3D%5C%22Horizontal%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CLabel%20HorizontalTextAlignment%3D%5C%22Center%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20FontSize%3D%5C%22Small%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Text%3D%5C%22%7BBinding%20Songs.Count%7D%5C%22%3E%3C%2FLabel%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CLabel%20%20HorizontalTextAlignment%3D%5C%22Center%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20FontSize%3D%5C%22Small%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Text%3D%5C%22%E9%A6%96%E6%AD%8C%5C%22%3E%3C%2FLabel%3E%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FStackLayout%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FGrid%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FListView.Header%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3CListView.ItemTemplate%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CDataTemplate%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CViewCell%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CGrid%20x%3AName%3D%5C%22ModeControlLayout%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20VerticalOptions%3D%5C%22CenterAndExpand%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CGrid.ColumnDefinitions%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CColumnDefinition%20Width%3D%5C%22*%5C%22%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CColumnDefinition%20Width%3D%5C%22Auto%5C%22%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FGrid.ColumnDefinitions%3E%5Cn%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CStackLayout%20Grid.Column%3D%5C%220%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HorizontalOptions%3D%5C%22Center%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20VerticalOptions%3D%5C%22CenterAndExpand%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CLabel%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Text%3D%5C%22%7BBinding%20MusicTitle%7D%5C%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HorizontalOptions%3D%5C%22FillAndExpand%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HorizontalTextAlignment%3D%5C%22Center%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20FontSize%3D%5C%22Body%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CLabel%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Text%3D%5C%22%7BBinding%20Artist%7D%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HorizontalOptions%3D%5C%22FillAndExpand%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HorizontalTextAlignment%3D%5C%22Center%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20FontSize%3D%5C%22Body%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FStackLayout%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CButton%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20x%3AName%3D%5C%22MoreButton%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HeightRequest%3D%5C%2244%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20WidthRequest%3D%5C%2244%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Margin%3D%5C%2210%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Text%3D%5C%22%EF%85%82%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Clicked%3D%5C%22SongMoreButton_OnClicked%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20FontFamily%3D%5C%22FontAwesome%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Grid.Column%3D%5C%221%5C%22%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20CornerRadius%3D%5C%22100%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HorizontalOptions%3D%5C%22Center%5C%22%20%2F%3E%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FGrid%3E%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FViewCell%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FDataTemplate%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FListView.ItemTemplate%3E%5Cn%20%20%20%20%20%20%20%20%3C%2FListView%3E%5Cn%20%20%20%20%3C%2FGrid%3E%5Cn%3C%2Fmato%3AContentPageBase%3E%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-XML hljs"><span class="hljs-meta">&lt;?xml version="1.0" encoding="utf-8" ?&gt;
<span class="hljs-tag">&lt;<span class="hljs-name">mato:ContentPageBase <span class="hljs-attr">xmlns=<span class="hljs-string">"http://schemas.microsoft.com/dotnet/2021/maui"
             <span class="hljs-attr">xmlns:x=<span class="hljs-string">"http://schemas.microsoft.com/winfx/2009/xaml"
             <span class="hljs-attr">xmlns:mato=<span class="hljs-string">"clr-namespace:MauiBoilerplate;assembly=MauiBoilerplate.Core"
             <span class="hljs-attr">x:Class=<span class="hljs-string">"MauiBoilerplate.MainPage"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">Grid&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Grid.RowDefinitions&gt;
            <span class="hljs-tag">&lt;<span class="hljs-name">RowDefinition <span class="hljs-attr">Height=<span class="hljs-string">"155"&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">RowDefinition&gt;
            <span class="hljs-tag">&lt;<span class="hljs-name">RowDefinition&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">RowDefinition&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">Grid.RowDefinitions&gt;

        <span class="hljs-tag">&lt;<span class="hljs-name">Label <span class="hljs-attr">Text=<span class="hljs-string">"My Music" <span class="hljs-attr">FontSize=<span class="hljs-string">"65"&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">Label&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">ListView 
                <span class="hljs-attr">Grid.Row=<span class="hljs-string">"1"
                <span class="hljs-attr">ItemsSource=<span class="hljs-string">"{Binding Songs,Mode=TwoWay}"
                <span class="hljs-attr">x:Name=<span class="hljs-string">"MainListView"
                <span class="hljs-attr">RowHeight=<span class="hljs-string">"74" 
                <span class="hljs-attr">IsPullToRefreshEnabled=<span class="hljs-string">"True"
                <span class="hljs-attr">IsRefreshing=<span class="hljs-string">"{Binding IsRefreshing}"
                <span class="hljs-attr">RefreshCommand=<span class="hljs-string">"{Binding RefreshCommand}"
                <span class="hljs-attr">SelectedItem=<span class="hljs-string">"{Binding CurrentSong,Mode=TwoWay}"&gt;
            <span class="hljs-tag">&lt;<span class="hljs-name">ListView.Header&gt;
                <span class="hljs-tag">&lt;<span class="hljs-name">Grid <span class="hljs-attr">HeightRequest=<span class="hljs-string">"96"&gt;
                    <span class="hljs-tag">&lt;<span class="hljs-name">Grid.RowDefinitions&gt;
                        <span class="hljs-tag">&lt;<span class="hljs-name">RowDefinition&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">RowDefinition&gt;
                        <span class="hljs-tag">&lt;<span class="hljs-name">RowDefinition&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">RowDefinition&gt;
                    <span class="hljs-tag">&lt;/<span class="hljs-name">Grid.RowDefinitions&gt;


                    <span class="hljs-tag">&lt;<span class="hljs-name">Button <span class="hljs-attr">Clicked=<span class="hljs-string">"AddButton_Clicked"
                            <span class="hljs-attr">CornerRadius=<span class="hljs-string">"100"
                            <span class="hljs-attr">Text=<span class="hljs-string">""
                            <span class="hljs-attr">HeightRequest=<span class="hljs-string">"44"
                            <span class="hljs-attr">WidthRequest=<span class="hljs-string">"200"
                            <span class="hljs-attr">FontFamily=<span class="hljs-string">"FontAwesome"
                                &gt;<span class="hljs-tag">&lt;/<span class="hljs-name">Button&gt;


                    <span class="hljs-tag">&lt;<span class="hljs-name">StackLayout <span class="hljs-attr">VerticalOptions=<span class="hljs-string">"End"
                                 <span class="hljs-attr">Margin=<span class="hljs-string">"0,0,0,8"
                                 <span class="hljs-attr">Grid.Row=<span class="hljs-string">"1"
                                 <span class="hljs-attr">HorizontalOptions=<span class="hljs-string">"Center"
                                 <span class="hljs-attr">Orientation=<span class="hljs-string">"Horizontal"&gt;
                        <span class="hljs-tag">&lt;<span class="hljs-name">Label <span class="hljs-attr">HorizontalTextAlignment=<span class="hljs-string">"Center"
                            <span class="hljs-attr">FontSize=<span class="hljs-string">"Small" 
                            <span class="hljs-attr">Text=<span class="hljs-string">"{Binding Songs.Count}"&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">Label&gt;
                        <span class="hljs-tag">&lt;<span class="hljs-name">Label  <span class="hljs-attr">HorizontalTextAlignment=<span class="hljs-string">"Center"
                            <span class="hljs-attr">FontSize=<span class="hljs-string">"Small" 
                            <span class="hljs-attr">Text=<span class="hljs-string">"首歌"&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">Label&gt;

                    <span class="hljs-tag">&lt;/<span class="hljs-name">StackLayout&gt;
                <span class="hljs-tag">&lt;/<span class="hljs-name">Grid&gt;
            <span class="hljs-tag">&lt;/<span class="hljs-name">ListView.Header&gt;
            <span class="hljs-tag">&lt;<span class="hljs-name">ListView.ItemTemplate&gt;
                <span class="hljs-tag">&lt;<span class="hljs-name">DataTemplate&gt;
                    <span class="hljs-tag">&lt;<span class="hljs-name">ViewCell&gt;
                        <span class="hljs-tag">&lt;<span class="hljs-name">Grid <span class="hljs-attr">x:Name=<span class="hljs-string">"ModeControlLayout" 
                              <span class="hljs-attr">VerticalOptions=<span class="hljs-string">"CenterAndExpand"&gt;
                            <span class="hljs-tag">&lt;<span class="hljs-name">Grid.ColumnDefinitions&gt;
                                <span class="hljs-tag">&lt;<span class="hljs-name">ColumnDefinition <span class="hljs-attr">Width=<span class="hljs-string">"*" /&gt;
                                <span class="hljs-tag">&lt;<span class="hljs-name">ColumnDefinition <span class="hljs-attr">Width=<span class="hljs-string">"Auto" /&gt;
                            <span class="hljs-tag">&lt;/<span class="hljs-name">Grid.ColumnDefinitions&gt;


                            <span class="hljs-tag">&lt;<span class="hljs-name">StackLayout <span class="hljs-attr">Grid.Column=<span class="hljs-string">"0" 
                                             <span class="hljs-attr">HorizontalOptions=<span class="hljs-string">"Center" 
                                             <span class="hljs-attr">VerticalOptions=<span class="hljs-string">"CenterAndExpand"&gt;
                                <span class="hljs-tag">&lt;<span class="hljs-name">Label 
                                    <span class="hljs-attr">Text=<span class="hljs-string">"{Binding MusicTitle}"                                    
                                    <span class="hljs-attr">HorizontalOptions=<span class="hljs-string">"FillAndExpand" 
                                    <span class="hljs-attr">HorizontalTextAlignment=<span class="hljs-string">"Center" 
                                    <span class="hljs-attr">FontSize=<span class="hljs-string">"Body" 
                                    /&gt;
                                <span class="hljs-tag">&lt;<span class="hljs-name">Label
                                    <span class="hljs-attr">Text=<span class="hljs-string">"{Binding Artist}" 
                                    <span class="hljs-attr">HorizontalOptions=<span class="hljs-string">"FillAndExpand" 
                                    <span class="hljs-attr">HorizontalTextAlignment=<span class="hljs-string">"Center" 
                                    <span class="hljs-attr">FontSize=<span class="hljs-string">"Body" 
                                    /&gt;
                            <span class="hljs-tag">&lt;/<span class="hljs-name">StackLayout&gt;
                            <span class="hljs-tag">&lt;<span class="hljs-name">Button 
                                <span class="hljs-attr">x:Name=<span class="hljs-string">"MoreButton"
                                <span class="hljs-attr">HeightRequest=<span class="hljs-string">"44" 
                                <span class="hljs-attr">WidthRequest=<span class="hljs-string">"44" 
                                <span class="hljs-attr">Margin=<span class="hljs-string">"10"
                                <span class="hljs-attr">Text=<span class="hljs-string">""
                                <span class="hljs-attr">Clicked=<span class="hljs-string">"SongMoreButton_OnClicked"
                                <span class="hljs-attr">FontFamily=<span class="hljs-string">"FontAwesome"
                                <span class="hljs-attr">Grid.Column=<span class="hljs-string">"1" 
                                <span class="hljs-attr">CornerRadius=<span class="hljs-string">"100"
                                <span class="hljs-attr">HorizontalOptions=<span class="hljs-string">"Center" /&gt;

                        <span class="hljs-tag">&lt;/<span class="hljs-name">Grid&gt;

                    <span class="hljs-tag">&lt;/<span class="hljs-name">ViewCell&gt;
                <span class="hljs-tag">&lt;/<span class="hljs-name">DataTemplate&gt;
            <span class="hljs-tag">&lt;/<span class="hljs-name">ListView.ItemTemplate&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">ListView&gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">Grid&gt;
<span class="hljs-tag">&lt;/<span class="hljs-name">mato:ContentPageBase&gt;
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p> 编写CodeBehind为：</p><p>注意将它继承ITransientDependency接口</p><p>这个页面之前提到过，已经通过IocManager.Resolve(typeof(MainPage))解析出实例并赋值给App.MainPage了。</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="14" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22public%20partial%20class%20MainPage%20%3A%20ContentPageBase%2C%20ITransientDependency%5Cn%7B%5Cn%20%20%20%20private%20readonly%20MainPageViewModel%20mainPageViewModel%3B%5Cn%20%20%20%20private%20readonly%20MusicItemPageViewModel%20musicItemPageViewModel%3B%5Cn%20%20%20%20private%20readonly%20MusicItemPage%20musicItemPage%3B%5Cn%5Cn%20%20%20%20public%20MainPage(MainPageViewModel%20mainPageViewModel%2C%20MusicItemPageViewModel%20musicItemPageViewModel%2C%20MusicItemPage%20musicItemPage)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20InitializeComponent()%3B%5Cn%20%20%20%20%20%20%20%20this.mainPageViewModel%3DmainPageViewModel%3B%5Cn%20%20%20%20%20%20%20%20this.musicItemPageViewModel%3DmusicItemPageViewModel%3B%5Cn%20%20%20%20%20%20%20%20this.musicItemPage%3DmusicItemPage%3B%5Cn%20%20%20%20%20%20%20%20BindingContext%3Dthis.mainPageViewModel%3B%5Cn%20%20%20%20%20%20%20%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20protected%20override%20void%20OnAppearing()%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20base.OnAppearing()%3B%5Cn%20%20%20%20%20%20%20%20mainPageViewModel.RefreshCommand.Execute(null)%3B%5Cn%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20private%20async%20void%20SongMoreButton_OnClicked(object%20sender%2C%20EventArgs%20e)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20var%20currentsong%20%3D%20(sender%20as%20BindableObject).BindingContext%20as%20Song%3B%5Cn%20%20%20%20%20%20%20%20string%20action%20%3D%20await%20DisplayActionSheet(currentsong.MusicTitle%2C%20%5C%22%E5%8F%96%E6%B6%88%5C%22%2C%20null%2C%20%5C%22%E4%BF%AE%E6%94%B9%5C%22%2C%20%5C%22%E5%88%A0%E9%99%A4%5C%22)%3B%5Cn%20%20%20%20%20%20%20%20if%20(action%3D%3D%5C%22%E4%BF%AE%E6%94%B9%5C%22)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20musicItemPageViewModel.CurrentSong%20%20%3D%20currentsong%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20await%20Navigation.PushModalAsync(musicItemPage)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20else%20if%20(action%3D%3D%5C%22%E5%88%A0%E9%99%A4%5C%22)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20mainPageViewModel.DeleteCommand.Execute(currentsong)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20mainPageViewModel.RefreshCommand.Execute(null)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20private%20async%20void%20AddButton_Clicked(object%20sender%2C%20EventArgs%20e)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20musicItemPageViewModel.CurrentSong%20%20%3D%20new%20Song()%3B%5Cn%20%20%20%20%20%20%20%20await%20Navigation.PushModalAsync(musicItemPage)%3B%5Cn%20%20%20%20%7D%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">public <span class="hljs-keyword">partial <span class="hljs-keyword">class <span class="hljs-title">MainPage : <span class="hljs-title">ContentPageBase, <span class="hljs-title">ITransientDependency
{
    <span class="hljs-keyword">private <span class="hljs-keyword">readonly MainPageViewModel mainPageViewModel;
    <span class="hljs-keyword">private <span class="hljs-keyword">readonly MusicItemPageViewModel musicItemPageViewModel;
    <span class="hljs-keyword">private <span class="hljs-keyword">readonly MusicItemPage musicItemPage;

    <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">MainPage(<span class="hljs-params">MainPageViewModel mainPageViewModel, MusicItemPageViewModel musicItemPageViewModel, MusicItemPage musicItemPage)
    {
        InitializeComponent();
        <span class="hljs-keyword">this.mainPageViewModel=mainPageViewModel;
        <span class="hljs-keyword">this.musicItemPageViewModel=musicItemPageViewModel;
        <span class="hljs-keyword">this.musicItemPage=musicItemPage;
        BindingContext=<span class="hljs-keyword">this.mainPageViewModel;
       
    }

    <span class="hljs-function"><span class="hljs-keyword">protected <span class="hljs-keyword">override <span class="hljs-keyword">void <span class="hljs-title">OnAppearing()
    {
        <span class="hljs-keyword">base.OnAppearing();
        mainPageViewModel.RefreshCommand.Execute(<span class="hljs-literal">null);

    }

    <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">async <span class="hljs-keyword">void <span class="hljs-title">SongMoreButton_OnClicked(<span class="hljs-params"><span class="hljs-built_in">object sender, EventArgs e)
    {
        <span class="hljs-keyword">var currentsong = (sender <span class="hljs-keyword">as BindableObject).BindingContext <span class="hljs-keyword">as Song;
        <span class="hljs-built_in">string action = <span class="hljs-keyword">await DisplayActionSheet(currentsong.MusicTitle, <span class="hljs-string">"取消", <span class="hljs-literal">null, <span class="hljs-string">"修改", <span class="hljs-string">"删除");
        <span class="hljs-keyword">if (action==<span class="hljs-string">"修改")
        {
            musicItemPageViewModel.CurrentSong  = currentsong;
            <span class="hljs-keyword">await Navigation.PushModalAsync(musicItemPage);
        }
        <span class="hljs-keyword">else <span class="hljs-keyword">if (action==<span class="hljs-string">"删除")
        {
            mainPageViewModel.DeleteCommand.Execute(currentsong);
            mainPageViewModel.RefreshCommand.Execute(<span class="hljs-literal">null);
        }
    }

    <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">async <span class="hljs-keyword">void <span class="hljs-title">AddButton_Clicked(<span class="hljs-params"><span class="hljs-built_in">object sender, EventArgs e)
    {
        musicItemPageViewModel.CurrentSong  = <span class="hljs-keyword">new Song();
        <span class="hljs-keyword">await Navigation.PushModalAsync(musicItemPage);
    }
}</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>此页面将显示一个列表，并在列表条目下可以弹出一个菜单</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="13" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/a0a15ef5cc98481cb58307e2866c7904.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fa0a15ef5cc98481cb58307e2866c7904.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22%22%2C%22height%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" src="a0a15ef5cc98481cb58307e2866c7904.png"/></span></p><p> </p><h2> 编写条目编辑页面</h2><p> 新建一个MusicItemPageViewModel.cs，作为MusicItemPage的ViewModel层</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="12" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20public%20class%20MusicItemPageViewModel%20%3A%20ViewModelBase%5Cn%20%7B%5Cn%20%20%20%20%20%20%20%20private%20readonly%20IIocResolver%20iocResolver%3B%5Cn%20%20%20%20%20%20%20%20private%20readonly%20IRepository%3CSong%2C%20long%3E%20songRepository%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20event%20EventHandler%20OnFinished%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20MusicItemPageViewModel(%5Cn%20%20%20%20%20%20%20%20%20%20%20%20IIocResolver%20iocResolver%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20IRepository%3CSong%2C%20long%3E%20songRepository)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.CommitCommand%3Dnew%20Command(Commit%2C%20(o)%20%3D%3E%20CurrentSong!%3Dnull)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.iocResolver%3DiocResolver%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.songRepository%3DsongRepository%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20this.PropertyChanged%2B%3DMusicItemPageViewModel_PropertyChanged%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20private%20void%20MusicItemPageViewModel_PropertyChanged(object%20sender%2C%20System.ComponentModel.PropertyChangedEventArgs%20e)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(e.PropertyName%3D%3Dnameof(CurrentSong))%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20CommitCommand.ChangeCanExecute()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20private%20void%20Commit(object%20obj)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20songRepository.InsertOrUpdate(currentSong)%3B%20%20%20%20%20%20%20%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20private%20Song%20currentSong%3B%5Cn%5Cn%20%20%20%20%20%20%20%20public%20Song%20CurrentSong%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20get%20%7B%20return%20currentSong%3B%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20set%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20currentSong%20%3D%20value%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20RaisePropertyChanged()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"> <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">MusicItemPageViewModel : <span class="hljs-title">ViewModelBase
 {
        <span class="hljs-keyword">private <span class="hljs-keyword">readonly IIocResolver iocResolver;
        <span class="hljs-keyword">private <span class="hljs-keyword">readonly IRepository&lt;Song, <span class="hljs-built_in">long&gt; songRepository;

        <span class="hljs-keyword">public <span class="hljs-keyword">event EventHandler OnFinished;

        <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">MusicItemPageViewModel(<span class="hljs-params">
            IIocResolver iocResolver,
            IRepository&lt;Song, <span class="hljs-built_in">long&gt; songRepository)
        {
            <span class="hljs-keyword">this.CommitCommand=<span class="hljs-keyword">new Command(Commit, (o) =&gt; CurrentSong!=<span class="hljs-literal">null);
            <span class="hljs-keyword">this.iocResolver=iocResolver;
            <span class="hljs-keyword">this.songRepository=songRepository;
            <span class="hljs-keyword">this.PropertyChanged+=MusicItemPageViewModel_PropertyChanged;
        }

        <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">void <span class="hljs-title">MusicItemPageViewModel_PropertyChanged(<span class="hljs-params"><span class="hljs-built_in">object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            <span class="hljs-keyword">if (e.PropertyName==<span class="hljs-keyword">nameof(CurrentSong))
            {
                CommitCommand.ChangeCanExecute();
            }
        }

        <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">void <span class="hljs-title">Commit(<span class="hljs-params"><span class="hljs-built_in">object obj)
        {
            songRepository.InsertOrUpdate(currentSong);       
        }

        <span class="hljs-keyword">private Song currentSong;

        <span class="hljs-keyword">public Song CurrentSong
        {
            <span class="hljs-keyword">get { <span class="hljs-keyword">return currentSong; }
            <span class="hljs-keyword">set
            {
                currentSong = <span class="hljs-keyword">value;
                RaisePropertyChanged();
            }
        }
  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>新建一个MusicItemPage 页面</p><p>编写Xaml为：</p><p>注意这个页面将继承MauiBoilerplate.ContentPageBase</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="11" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22XML%22%2C%22code%22%3A%22%3C%3Fxml%20version%3D%5C%221.0%5C%22%20encoding%3D%5C%22utf-8%5C%22%20%3F%3E%5Cn%3Cmato%3AContentPageBase%20xmlns%3D%5C%22http%3A%2F%2Fschemas.microsoft.com%2Fdotnet%2F2021%2Fmaui%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20xmlns%3Ax%3D%5C%22http%3A%2F%2Fschemas.microsoft.com%2Fwinfx%2F2009%2Fxaml%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20xmlns%3Amato%3D%5C%22clr-namespace%3AMauiBoilerplate%3Bassembly%3DMauiBoilerplate.Core%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20x%3AClass%3D%5C%22MauiBoilerplate.MusicItemPage%5C%22%3E%5Cn%20%20%20%20%3CGrid%3E%5Cn%20%20%20%20%20%20%20%20%3CGrid.RowDefinitions%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3CRowDefinition%3E%3C%2FRowDefinition%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3CRowDefinition%20Height%3D%5C%22155%5C%22%3E%3C%2FRowDefinition%3E%5Cn%20%20%20%20%20%20%20%20%3C%2FGrid.RowDefinitions%3E%5Cn%20%20%20%20%20%20%20%20%3CTableView%20Intent%3D%5C%22Form%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3CTableRoot%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CTableSection%20Title%3D%5C%22%E5%9F%BA%E7%A1%80%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CEntryCell%20Label%3D%5C%22%E6%A0%87%E9%A2%98%5C%22%20%20%20Text%3D%5C%22%7BBinding%20CurrentSong.MusicTitle%2C%20Mode%3DTwoWay%7D%5C%22%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CEntryCell%20%20Label%3D%5C%22%E8%89%BA%E6%9C%AF%E5%AE%B6%5C%22%20%20Text%3D%5C%22%7BBinding%20CurrentSong.Artist%2C%20Mode%3DTwoWay%7D%5C%22%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CEntryCell%20%20Label%3D%5C%22%E4%B8%93%E8%BE%91%5C%22%20%20Text%3D%5C%22%7BBinding%20CurrentSong.Album%2C%20Mode%3DTwoWay%7D%5C%22%2F%3E%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FTableSection%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CTableSection%20Title%3D%5C%22%E5%85%B6%E4%BB%96%5C%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CEntryCell%20%20Label%3D%5C%22%E6%97%B6%E9%95%BF%5C%22%20%20Text%3D%5C%22%7BBinding%20CurrentSong.Duration%7D%5C%22%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CEntryCell%20%20Label%3D%5C%22%E5%8F%91%E5%B8%83%E6%97%A5%E6%9C%9F%5C%22%20%20Text%3D%5C%22%7BBinding%20CurrentSong.ReleaseDate%7D%5C%22%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FTableSection%3E%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FTableRoot%3E%5Cn%20%20%20%20%20%20%20%20%3C%2FTableView%3E%5Cn%20%20%20%20%20%20%20%20%3CButton%20x%3AName%3D%5C%22CommitButton%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Grid.Row%3D%5C%221%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20CornerRadius%3D%5C%22100%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HeightRequest%3D%5C%2244%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20WidthRequest%3D%5C%22200%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Text%3D%5C%22%EF%80%8C%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Command%3D%5C%22%7BBinding%20CommitCommand%7D%5C%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20FontFamily%3D%5C%22FontAwesome%5C%22%20%20%20%20%20%20%20%20%20%20%20%20%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20HorizontalOptions%3D%5C%22Center%5C%22%20%2F%3E%5Cn%20%20%20%20%3C%2FGrid%3E%5Cn%3C%2Fmato%3AContentPageBase%3E%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-XML hljs"><span class="hljs-meta">&lt;?xml version="1.0" encoding="utf-8" ?&gt;
<span class="hljs-tag">&lt;<span class="hljs-name">mato:ContentPageBase <span class="hljs-attr">xmlns=<span class="hljs-string">"http://schemas.microsoft.com/dotnet/2021/maui"
             <span class="hljs-attr">xmlns:x=<span class="hljs-string">"http://schemas.microsoft.com/winfx/2009/xaml"
             <span class="hljs-attr">xmlns:mato=<span class="hljs-string">"clr-namespace:MauiBoilerplate;assembly=MauiBoilerplate.Core"
             <span class="hljs-attr">x:Class=<span class="hljs-string">"MauiBoilerplate.MusicItemPage"&gt;
    <span class="hljs-tag">&lt;<span class="hljs-name">Grid&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Grid.RowDefinitions&gt;
            <span class="hljs-tag">&lt;<span class="hljs-name">RowDefinition&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">RowDefinition&gt;
            <span class="hljs-tag">&lt;<span class="hljs-name">RowDefinition <span class="hljs-attr">Height=<span class="hljs-string">"155"&gt;<span class="hljs-tag">&lt;/<span class="hljs-name">RowDefinition&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">Grid.RowDefinitions&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">TableView <span class="hljs-attr">Intent=<span class="hljs-string">"Form"&gt;
            <span class="hljs-tag">&lt;<span class="hljs-name">TableRoot&gt;
                <span class="hljs-tag">&lt;<span class="hljs-name">TableSection <span class="hljs-attr">Title=<span class="hljs-string">"基础"&gt;
                    <span class="hljs-tag">&lt;<span class="hljs-name">EntryCell <span class="hljs-attr">Label=<span class="hljs-string">"标题"   <span class="hljs-attr">Text=<span class="hljs-string">"{Binding CurrentSong.MusicTitle, Mode=TwoWay}"/&gt;
                    <span class="hljs-tag">&lt;<span class="hljs-name">EntryCell  <span class="hljs-attr">Label=<span class="hljs-string">"艺术家"  <span class="hljs-attr">Text=<span class="hljs-string">"{Binding CurrentSong.Artist, Mode=TwoWay}"/&gt;
                    <span class="hljs-tag">&lt;<span class="hljs-name">EntryCell  <span class="hljs-attr">Label=<span class="hljs-string">"专辑"  <span class="hljs-attr">Text=<span class="hljs-string">"{Binding CurrentSong.Album, Mode=TwoWay}"/&gt;

                <span class="hljs-tag">&lt;/<span class="hljs-name">TableSection&gt;
                <span class="hljs-tag">&lt;<span class="hljs-name">TableSection <span class="hljs-attr">Title=<span class="hljs-string">"其他"&gt;
                    <span class="hljs-tag">&lt;<span class="hljs-name">EntryCell  <span class="hljs-attr">Label=<span class="hljs-string">"时长"  <span class="hljs-attr">Text=<span class="hljs-string">"{Binding CurrentSong.Duration}"/&gt;
                    <span class="hljs-tag">&lt;<span class="hljs-name">EntryCell  <span class="hljs-attr">Label=<span class="hljs-string">"发布日期"  <span class="hljs-attr">Text=<span class="hljs-string">"{Binding CurrentSong.ReleaseDate}"/&gt;
                <span class="hljs-tag">&lt;/<span class="hljs-name">TableSection&gt;

            <span class="hljs-tag">&lt;/<span class="hljs-name">TableRoot&gt;
        <span class="hljs-tag">&lt;/<span class="hljs-name">TableView&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Button <span class="hljs-attr">x:Name=<span class="hljs-string">"CommitButton"
                <span class="hljs-attr">Grid.Row=<span class="hljs-string">"1"
                <span class="hljs-attr">CornerRadius=<span class="hljs-string">"100"
                <span class="hljs-attr">HeightRequest=<span class="hljs-string">"44"
                <span class="hljs-attr">WidthRequest=<span class="hljs-string">"200"
                <span class="hljs-attr">Text=<span class="hljs-string">""
                <span class="hljs-attr">Command=<span class="hljs-string">"{Binding CommitCommand}"
                <span class="hljs-attr">FontFamily=<span class="hljs-string">"FontAwesome"             
                <span class="hljs-attr">HorizontalOptions=<span class="hljs-string">"Center" /&gt;
    <span class="hljs-tag">&lt;/<span class="hljs-name">Grid&gt;
<span class="hljs-tag">&lt;/<span class="hljs-name">mato:ContentPageBase&gt;
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p> 编写CodeBehind为：</p><p>注意将它继承ITransientDependency接口</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="10" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22public%20partial%20class%20MusicItemPage%20%3A%20ContentPageBase%2C%20ITransientDependency%5Cn%7B%5Cn%20%20%20%20private%20readonly%20MusicItemPageViewModel%20musicItemPageViewModel%3B%5Cn%5Cn%20%20%20%20public%20MusicItemPage(MusicItemPageViewModel%20musicItemPageViewModel)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20InitializeComponent()%3B%5Cn%20%20%20%20%20%20%20%20this.musicItemPageViewModel%3DmusicItemPageViewModel%3B%5Cn%20%20%20%20%20%20%20%20this.musicItemPageViewModel.OnValidateErrors%2B%3DMusicItemPageViewModel_OnValidateErrors%3B%5Cn%20%20%20%20%20%20%20%20this.musicItemPageViewModel.OnFinished%2B%3DMusicItemPageViewModel_OnFinished%3B%5Cn%20%20%20%20%20%20%20%20BindingContext%3Dthis.musicItemPageViewModel%3B%5Cn%20%20%20%20%20%20%20%20Unloaded%2B%3DMusicItemPage_Unloaded%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20private%20async%20void%20MusicItemPageViewModel_OnFinished(object%20sender%2C%20EventArgs%20e)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20await%20this.Navigation.PopModalAsync()%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20private%20void%20MusicItemPage_Unloaded(object%20sender%2C%20EventArgs%20e)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20musicItemPageViewModel.CurrentSong%20%3D%20null%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20private%20async%20void%20MusicItemPageViewModel_OnValidateErrors(object%20sender%2C%20List%3CSystem.ComponentModel.DataAnnotations.ValidationResult%3E%20e)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20var%20content%20%3D%20string.Join('%2C'%2C%20e)%3B%5Cn%20%20%20%20%20%20%20%20await%20DisplayAlert(%5C%22%E8%AF%B7%E6%B3%A8%E6%84%8F%5C%22%2C%20content%2C%20%5C%22%E5%A5%BD%E7%9A%84%5C%22)%3B%5Cn%20%20%20%20%7D%5Cn%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">public <span class="hljs-keyword">partial <span class="hljs-keyword">class <span class="hljs-title">MusicItemPage : <span class="hljs-title">ContentPageBase, <span class="hljs-title">ITransientDependency
{
    <span class="hljs-keyword">private <span class="hljs-keyword">readonly MusicItemPageViewModel musicItemPageViewModel;

    <span class="hljs-function"><span class="hljs-keyword">public <span class="hljs-title">MusicItemPage(<span class="hljs-params">MusicItemPageViewModel musicItemPageViewModel)
    {
        InitializeComponent();
        <span class="hljs-keyword">this.musicItemPageViewModel=musicItemPageViewModel;
        <span class="hljs-keyword">this.musicItemPageViewModel.OnValidateErrors+=MusicItemPageViewModel_OnValidateErrors;
        <span class="hljs-keyword">this.musicItemPageViewModel.OnFinished+=MusicItemPageViewModel_OnFinished;
        BindingContext=<span class="hljs-keyword">this.musicItemPageViewModel;
        Unloaded+=MusicItemPage_Unloaded;
    }

    <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">async <span class="hljs-keyword">void <span class="hljs-title">MusicItemPageViewModel_OnFinished(<span class="hljs-params"><span class="hljs-built_in">object sender, EventArgs e)
    {
       <span class="hljs-keyword">await <span class="hljs-keyword">this.Navigation.PopModalAsync();
    }

    <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">void <span class="hljs-title">MusicItemPage_Unloaded(<span class="hljs-params"><span class="hljs-built_in">object sender, EventArgs e)
    {
        musicItemPageViewModel.CurrentSong = <span class="hljs-literal">null;
    }

    <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">async <span class="hljs-keyword">void <span class="hljs-title">MusicItemPageViewModel_OnValidateErrors(<span class="hljs-params"><span class="hljs-built_in">object sender, List&lt;System.ComponentModel.DataAnnotations.ValidationResult&gt; e)
    {
        <span class="hljs-keyword">var content = <span class="hljs-built_in">string.Join(<span class="hljs-string">',', e);
        <span class="hljs-keyword">await DisplayAlert(<span class="hljs-string">"请注意", content, <span class="hljs-string">"好的");
    }
}</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>这个页面提供歌曲条目新增和编辑的交互功能</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="9" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/c8ee3419d5a7456f809a2a3b59f0c969.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2Fc8ee3419d5a7456f809a2a3b59f0c969.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22507%22%2C%22height%22%3A%22923%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="923" src="c8ee3419d5a7456f809a2a3b59f0c969.png" width="507"/></span></p><p> </p><h2>[可选]使用Abp校验数据功能</h2><p>这个部分使用Abp的ValidationConfiguration功能校验表单数据，以展示Abp功能的使用</p><p>首先在MusicItemPageViewModel 构造函数中添加对IValidationConfiguration对象的注入</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="8" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/97a4c37d4c97482a81d5e960140a9ba4.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F97a4c37d4c97482a81d5e960140a9ba4.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22639%22%2C%22height%22%3A%22383%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" height="383" src="97a4c37d4c97482a81d5e960140a9ba4.png" width="639"/></span></p><p> 添加OnValidateErrors事件，并且在Page中订阅这个事件。此事件将在校验未通过时触发</p><p>MusicItemPageViewModel.cs中：</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="7" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22public%20event%20EventHandler%3CList%3CValidationResult%3E%3E%20OnValidateErrors%3B%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs"><span class="hljs-keyword">public <span class="hljs-keyword">event EventHandler&lt;List&lt;ValidationResult&gt;&gt; OnValidateErrors;</span></span></code></pre>
</div><p> MusicItemPage.xaml.cs中：</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="6" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20%20%20%20%20this.musicItemPageViewModel.OnValidateErrors%2B%3DMusicItemPageViewModel_OnValidateErrors%3B%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">        <span class="hljs-keyword">this.musicItemPageViewModel.OnValidateErrors+=MusicItemPageViewModel_OnValidateErrors;</span></code></pre>
</div><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="5" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20private%20async%20void%20MusicItemPageViewModel_OnValidateErrors(object%20sender%2C%20List%3CSystem.ComponentModel.DataAnnotations.ValidationResult%3E%20e)%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20var%20content%20%3D%20string.Join('%2C'%2C%20e)%3B%5Cn%20%20%20%20%20%20%20%20await%20DisplayAlert(%5C%22%E8%AF%B7%E6%B3%A8%E6%84%8F%5C%22%2C%20content%2C%20%5C%22%E5%A5%BD%E7%9A%84%5C%22)%3B%5Cn%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">async <span class="hljs-keyword">void <span class="hljs-title">MusicItemPageViewModel_OnValidateErrors(<span class="hljs-params"><span class="hljs-built_in">object sender, List&lt;System.ComponentModel.DataAnnotations.ValidationResult&gt; e)
    {
        <span class="hljs-keyword">var content = <span class="hljs-built_in">string.Join(<span class="hljs-string">',', e);
        <span class="hljs-keyword">await DisplayAlert(<span class="hljs-string">"请注意", content, <span class="hljs-string">"好的");
    }</span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>编写校验逻辑代码</p><p>MusicItemPageViewModel.cs中：</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="4" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20%20%20%20%20protected%20List%3CValidationResult%3E%20GetValidationErrors(Song%20validatingObject)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20List%3CValidationResult%3E%20validationErrors%20%3D%20new%20List%3CValidationResult%3E()%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20foreach%20(var%20validatorType%20in%20_configuration.Validators)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20using%20(var%20validator%20%3D%20iocResolver.ResolveAsDisposable%3CIMethodParameterValidator%3E(validatorType))%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20validationResults%20%3D%20validator.Object.Validate(validatingObject)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20validationErrors.AddRange(validationResults)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20validationErrors%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">        <span class="hljs-function"><span class="hljs-keyword">protected List&lt;ValidationResult&gt; <span class="hljs-title">GetValidationErrors(<span class="hljs-params">Song validatingObject)
        {
            List&lt;ValidationResult&gt; validationErrors = <span class="hljs-keyword">new List&lt;ValidationResult&gt;();

            <span class="hljs-keyword">foreach (<span class="hljs-keyword">var validatorType <span class="hljs-keyword">in _configuration.Validators)
            {
                <span class="hljs-keyword">using (<span class="hljs-keyword">var validator = iocResolver.ResolveAsDisposable&lt;IMethodParameterValidator&gt;(validatorType))
                {
                    <span class="hljs-keyword">var validationResults = validator.Object.Validate(validatingObject);
                    validationErrors.AddRange(validationResults);
                }

            }
            <span class="hljs-keyword">return validationErrors;
        }
</span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>Commit提交方法，改造如下：</p><p>当GetValidationErrors返回的校验错误列表中有内容时，将OnValidateErrors事件Invoke</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="3" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20%20%20%20%20private%20void%20Commit(object%20obj)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20validateErrors%20%3D%20GetValidationErrors(this.CurrentSong)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(validateErrors.Count%3D%3D0)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20songRepository.InsertOrUpdate(currentSong)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20this.OnFinished%3F.Invoke(this%2C%20EventArgs.Empty)%3B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20else%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20OnValidateErrors%3F.Invoke(this%2C%20validateErrors)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">        <span class="hljs-function"><span class="hljs-keyword">private <span class="hljs-keyword">void <span class="hljs-title">Commit(<span class="hljs-params"><span class="hljs-built_in">object obj)
        {
            <span class="hljs-keyword">var validateErrors = GetValidationErrors(<span class="hljs-keyword">this.CurrentSong);
            <span class="hljs-keyword">if (validateErrors.Count==<span class="hljs-number">0)
            {
                songRepository.InsertOrUpdate(currentSong);
                <span class="hljs-keyword">this.OnFinished?.Invoke(<span class="hljs-keyword">this, EventArgs.Empty);

            }
            <span class="hljs-keyword">else
            {
                OnValidateErrors?.Invoke(<span class="hljs-keyword">this, validateErrors);
            }
        }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>接下来在实体中定义校验规则，校验器将按照这些规则返回校验结果</p><div class="cke_widget_wrapper cke_widget_block cke_widget_codeSnippet cke_widget_selected" data-cke-display-name="代码段" data-cke-filter="off" data-cke-widget-id="2" data-cke-widget-wrapper="1">
<pre class="cke_widget_element" data-cke-widget-data="%7B%22lang%22%3A%22cs%22%2C%22code%22%3A%22%20%20%20%20public%20class%20Song%20%3A%20FullAuditedEntity%3Clong%3E%2C%20IValidatableObject%5Cn%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%5BKey%2C%20DatabaseGenerated(DatabaseGeneratedOption.Identity)%5D%5Cn%20%20%20%20%20%20%20%20public%20override%20long%20Id%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%5BRequired%5D%5Cn%20%20%20%20%20%20%20%20%5BStringLength(6%2C%20ErrorMessage%20%3D%20%5C%22%E6%AD%8C%E6%9B%B2%E5%90%8D%E7%A7%B0%E8%A6%81%E5%9C%A86%E4%B8%AA%E5%AD%97%E4%BB%A5%E5%86%85%5C%22)%5D%5Cn%20%20%20%20%20%20%20%20public%20string%20MusicTitle%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%5BRequired%5D%5Cn%20%20%20%20%20%20%20%20%5BStringLength(10%2C%20ErrorMessage%20%3D%20%5C%22%E6%AD%8C%E6%9B%B2%E5%90%8D%E7%A7%B0%E8%A6%81%E5%9C%A810%E4%B8%AA%E5%AD%97%E4%BB%A5%E5%86%85%5C%22)%5D%5Cn%20%20%20%20%20%20%20%20public%20string%20Artist%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%5BRequired%5D%5Cn%20%20%20%20%20%20%20%20%5BStringLength(10%2C%20ErrorMessage%20%3D%20%5C%22%E6%AD%8C%E6%9B%B2%E5%90%8D%E7%A7%B0%E8%A6%81%E5%9C%A810%E4%B8%AA%E5%AD%97%E4%BB%A5%E5%86%85%5C%22)%5D%5Cn%20%20%20%20%20%20%20%20public%20string%20Album%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20TimeSpan%20Duration%20%7B%20get%3B%20set%3B%20%7D%5Cn%20%20%20%20%20%20%20%20public%20DateTime%20ReleaseDate%20%7B%20get%3B%20set%3B%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20public%20IEnumerable%3CValidationResult%3E%20Validate(ValidationContext%20validationContext)%5Cn%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(ReleaseDate%20!%3D%20default%20%26%26%20ReleaseDate%3EDateTime.Now)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20yield%20return%20new%20ValidationResult(%5C%22ReleaseDate%E4%B8%8D%E8%83%BD%E5%A4%A7%E4%BA%8E%E5%BD%93%E5%A4%A9%5C%22%2C%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20new%5B%5D%20%7B%20nameof(ReleaseDate)%20%7D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="codeSnippet"><code class="language-cs hljs">    <span class="hljs-keyword">public <span class="hljs-keyword">class <span class="hljs-title">Song : <span class="hljs-title">FullAuditedEntity&lt;<span class="hljs-title">long&gt;, <span class="hljs-title">IValidatableObject
    {
        [<span class="hljs-meta">Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        <span class="hljs-keyword">public <span class="hljs-keyword">override <span class="hljs-built_in">long Id { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        [<span class="hljs-meta">Required]
        [<span class="hljs-meta">StringLength(6, ErrorMessage = <span class="hljs-string">"歌曲名称要在6个字以内")]
        <span class="hljs-keyword">public <span class="hljs-built_in">string MusicTitle { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        [<span class="hljs-meta">Required]
        [<span class="hljs-meta">StringLength(10, ErrorMessage = <span class="hljs-string">"歌曲名称要在10个字以内")]
        <span class="hljs-keyword">public <span class="hljs-built_in">string Artist { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        [<span class="hljs-meta">Required]
        [<span class="hljs-meta">StringLength(10, ErrorMessage = <span class="hljs-string">"歌曲名称要在10个字以内")]
        <span class="hljs-keyword">public <span class="hljs-built_in">string Album { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-keyword">public TimeSpan Duration { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }
        <span class="hljs-keyword">public DateTime ReleaseDate { <span class="hljs-keyword">get; <span class="hljs-keyword">set; }

        <span class="hljs-function"><span class="hljs-keyword">public IEnumerable&lt;ValidationResult&gt; <span class="hljs-title">Validate(<span class="hljs-params">ValidationContext validationContext)
        {
            <span class="hljs-keyword">if (ReleaseDate != <span class="hljs-literal">default &amp;&amp; ReleaseDate&gt;DateTime.Now)
            {
                <span class="hljs-function"><span class="hljs-keyword">yield <span class="hljs-keyword">return <span class="hljs-keyword">new <span class="hljs-title">ValidationResult(<span class="hljs-params"><span class="hljs-string">"ReleaseDate不能大于当天",
                                  <span class="hljs-keyword">new[] { <span class="hljs-keyword">nameof(ReleaseDate) });
            }

        }
    }
</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></code></pre>
</div><p>运行，新建条目。当我们如下填写的时候，将会弹出提示框</p><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption cke_widget_selected" data-cke-display-name="图像" data-cke-filter="off" data-cke-widget-id="1" data-cke-widget-wrapper="1"><img alt="" class="cke_widget_element" data-cke-saved-src="https://img-blog.csdnimg.cn/8a5ab9c2ff8b43b78562fc308ceeb9fc.png" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22https%3A%2F%2Fimg-blog.csdnimg.cn%2F8a5ab9c2ff8b43b78562fc308ceeb9fc.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%22%22%2C%22height%22%3A%22%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="image" src="8a5ab9c2ff8b43b78562fc308ceeb9fc.png"/></span></p><p>iOS平台也测试通过 </p><p><img alt="" height="652" loading="lazy" src="644861-20220528231004497-2002906869.png" width="1043"/></p><p> </p><p> </p><p>至此我们完成了所有的工作。</p><h2>结束语</h2><p>Abp是一个很好用的.Net开发框架，Abp库帮助我们抽象了整个项目以及更多的设计模式应用，其名称Asp Boilerplate，虽然有一个Asp在其中，但其功能不仅仅可以构建AspNet Core应用，</p><p>经过我们的探索用Abp构建了跨平台应用，同样它还可以用于Xamarin，Wpf甚至是WinForms这些基于桌面的应用。</p><p>欢迎参与讨论和转发。</p><h2>项目地址</h2><p><span class="cke_widget_wrapper cke_widget_inline cke_widget_csdnlink cke_widget_selected" data-cke-display-name="a" data-cke-filter="off" data-cke-widget-id="0" data-cke-widget-wrapper="1"><a class="cke_widget_editable cke_widget_element" data-cke-enter-mode="2" data-cke-saved-href="https://github.com/jevonsflash/maui-abp-sample" data-cke-widget-data="%7B%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fjevonsflash%2Fmaui-abp-sample%22%2C%22text%22%3A%22jevonsflash%2Fmaui-abp-sample%20(github.com)%22%2C%22desc%22%3A%22%22%2C%22icon%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22isCard%22%3Afalse%2C%22hasResquest%22%3Atrue%2C%22iconDefault%22%3A%22https%3A%2F%2Fcsdnimg.cn%2Frelease%2Fblog_editor_html%2Frelease2.1.3%2Fckeditor%2Fplugins%2FCsdnLink%2Ficons%2Ficon-default.png%3Ft%3DM4AD%22%2C%22id%22%3A%222QPpDw-1653475466585%22%2C%22classes%22%3Anull%7D" data-cke-widget-editable="text" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-link-icon="https://csdnimg.cn/release/blog_editor_html/release2.1.3/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=M4AD" data-link-title="jevonsflash/maui-abp-sample (github.com)" data-widget="csdnlink" href="https://github.com/jevonsflash/maui-abp-sample" title="jevonsflash/maui-abp-sample (github.com)">jevonsflash/maui-abp-sample (github.com)</a></span></p><span data-cke-copybin-start="1"><span data-cke-copybin-end="1">​</span></span>