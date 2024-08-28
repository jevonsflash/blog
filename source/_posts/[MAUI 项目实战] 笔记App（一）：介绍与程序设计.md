---
thumbnail: images/40d346cd36a248aba9d926f39e1c210a.png
title: '[MAUI 项目实战] 笔记App（一）：介绍与程序设计'
excerpt: >-
  有人说现在记事类app这么多，市场这么卷，为什么还想做一个笔记类App？一来，去年小孩刚出生，需要一个可以记录喂奶时间的app，发现市面上没有一款app能够在两步内简单记录一个时间，可能iOS可以通过备忘录配合捷径做到快速记录，但是安卓上就没有类似的app。二是，自去年做的音乐播放器以来，很长一段时间我在博客上的XF，MAUI都是在介绍局部的功能，[MAUI
  项目实战]专题也很长没更新了，这次通过笔记类App做一次完整项目，包括如何上架MAUI应用等内容一并更新了。
tags:
  - Xamarin
  - MAUI
  - App
  - .net blazor
categories:
  - .NET MAUI
  - 产品设计
  - 移动开发
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2024-07-18 16:37:00/[MAUI 项目实战] 笔记App（一）：介绍与程序设计.html'
abbrlink: e3d2e51e
date: 2024-07-18 16:37:00
cover:
description:
---
<!-- toc -->

系列文章：

[[MAUI 项目实战] 笔记App（一）：介绍与程序设计](https://www.cnblogs.com/jevonsflash/p/18309871)
[[MAUI 项目实战] 笔记App（二）：数据库设计](https://www.cnblogs.com/jevonsflash/p/18311048)


# 前言

有人说现在记事类app这么多，市场这么卷，为什么还想做一个笔记类App？

一来，去年小孩刚出生，需要一个可以记录喂奶时间的app，发现市面上没有一款app能够在两步内简单记录一个时间，可能iOS可以通过备忘录配合捷径做到快速记录，但是安卓上就没有类似的app。

二是，自去年做的音乐播放器以来，很长一段时间我在博客上的XF，MAUI都是在介绍局部的功能，[MAUI 项目实战]专题也很长没更新了，这次通过笔记类App做一次完整项目，包括如何上架MAUI应用等内容一并更新了。

一开始用MAUI简单做了一个功能，就记录喂奶量 + 喂奶时间 + 提醒。后期逐步做成一个可以动态添加摘要片段的功能。取名为《凡事摘要》。

目前安卓版本已发布打包，并上架腾讯应用商城：[凡事摘要](https://sj.qq.com/appdetail/com.mato.matoproductivity)，iOS版本的部分页面还有问题需要调试，最近比较忙，我会抽出时间继续完善。在这个时间点我决定把App所有的代码都放在GitHub上，方便大家学习。也欢迎有兴趣的小伙伴一起参与。


# 软件规格说明

## 主要功能


* 笔记管理：新增笔记，编辑笔记标题，增加笔记片段，修改笔记片段内容，删除笔记等功能。
* 场景管理：新增场景，编辑场景标题，封面等，增加场景片段，修改场景片段内容，删除场景等功能。
* 数据统计：查看统计数据。
* 应用快捷入口管理：增加或删除场景快捷方式。
* 其它设置：换肤，是否显示预览页面等


## 运行环境

 运行环境为Android 10.0及以上版本，ARM架构CPU，四核2.0GHz， 4GB内存，16GB存储空间，5.5英寸及以上LCD显示屏的Android设备。

## 开源组件库

| 组件库名称  | 
 --- | 
| .NET Runtime | 
| C#/WinRT | 
| Xamarin.Forms | 
| ASP.NET Core Blazor | 
| AutoMapper | 
| ASP.NET Boilerplate (Abp) | 
| CommunityToolkit.Maui | 
| Castle.Windsor | 
| Newtonsoft.Json |   
| Microsoft.EntityFrameworkCore | 

## 设备权限


| 权限名称 | 使用目的 | 使用场景 | 
| --- | --- | --- | 
| 设备GPS传感器信息 | 获取当前地理位置用于地址解析 | 创建笔记 |
| 设读取设备或存储卡中的内容 | 上传图片时获取用户相册图片文件 | APP前台运行时 |
| 相机 | 上传图片时通过设备相机获取图片 | 创建笔记 |
| 读取联系人 | 创建联系人片段时读取设备联系人信息 | 创建笔记 |
| 录制音频 | 创建声音片段时通过麦克风录制音频 | 创建笔记 |

## 第三方服务

| 服务名称 | 服务资源 | 服务内容 |  链接 |
| --- | --- | --- |  --- |
| 百度智能云 |  用户创建的音频 | 提供语音转文字服务 |https://cloud.baidu.com/ |
| 和风天气 |  用户当前地理位置 | 提供本地天气信息 |https://www.qweather.com |
| 高德开放平台 |  用户当前地理位置 | 提供当前地理位置的地址解析服务 |https://lbs.amap.com/ |


# 使用介绍

## 场景列表页

场景列表页用于呈现所有场景，软件默认会有一些场景，用户可以添加新的场景，也可以删除场景。
![在这里插入图片描述](644861-20240721143344194-247406536.png)


### 从场景创建笔记

用户在“场景”页面点击场景列表中的条目，可创建对应场景的笔记。如在点击“喂奶”场景，软件会创建一条笔记，并跳转到编辑页面，点击“保存”按钮，在笔记列表中会呈现此笔记。

![在这里插入图片描述](644861-20240721143344199-973050385.png)


### 编辑场景

编辑场景可对现有场景进行修改，包括修改场景名称，封面，增加、删除、修改场景片段。
点击“...”按钮，打开编辑场景页面，编辑完成后，点击“保存”按钮完成编辑

![在这里插入图片描述](644861-20240721143344233-713920861.png)



### 新增场景片段

在编辑场景页面，点击“+”按钮，可新增场景片段。如在弹出的片段列表中，点击“笔记”

![在这里插入图片描述](644861-20240721143344202-1638628239.png)

### 编辑场景片段

在编辑场景页面，点击片段标题可修改标题内容，按住片段右侧的按钮可拖拽，在其它位置释放手指可完成排序。

![在这里插入图片描述](644861-20240721143344079-1853649028.png)

### 删除场景片段

在编辑场景页面，向左滑动片段，点击“删除”按钮，即可完成片段删除

![在这里插入图片描述](644861-20240721143344052-12576903.png)

### 删除场景

在编辑场景页面，点击“删除”按钮，或在场景列表页面，长按场景条目，点击“-”按钮，即可完成场景删除

![在这里插入图片描述](644861-20240721143344183-684913954.png)


## 笔记列表页

笔记列表页用于呈现所有笔记，用户可以添加新的笔记，也可以编辑或删除现有的笔记。

![在这里插入图片描述](644861-20240721143344148-1834755196.png)

### 创建新笔记

在笔记列表页面点击“+”按钮，可创建一条新的笔记。此时，软件会跳转到编辑页面，点击“保存”按钮，在笔记列表中会呈现此笔记。

![在这里插入图片描述](644861-20240721143344240-429113863.png)


### 编辑笔记

编辑笔记可对现有笔记进行修改，包括修改笔记标题，增加、删除、修改笔记片段。
在笔记列表页中，向左滑动笔记条目，点击“编辑”按钮，打开编辑笔记页面，编辑完成后，点击“保存”按钮完成编辑

![在这里插入图片描述](644861-20240721143344251-1657340453.png)


### 新增笔记片段

在编辑笔记页面，点击“+”按钮，可新增笔记片段。如在弹出的片段列表中，点击“笔记”

![在这里插入图片描述](644861-20240721143344254-1272912372.png)


### 编辑笔记片段

在编辑笔记页面，点击片段标题可修改标题内容，按住片段右侧的按钮可拖拽，在其它位置释放手指可完成排序。

![在这里插入图片描述](644861-20240721143344236-1001648990.png)

### 删除笔记片段

在编辑笔记页面，向左滑动片段，点击“删除”按钮，即可完成片段删除

![在这里插入图片描述](644861-20240721143344256-642215871.png)

### 删除笔记

在笔记列表页向左滑动笔记条目，点击“删除”按钮，或在编辑笔记页面，点击“删除”按钮，即可完成笔记删除

![在这里插入图片描述](644861-20240721143344085-612330811.png)

## 统计

笔记中的数值片段中的数值，可以进行统计。
在笔记编辑页面，添加一个数值片段，输入数值并保存，切换到统计页面，可以看到这些数值为纵轴、时间为横轴的趋势图

![在这里插入图片描述](644861-20240721143344188-1407053508.png)



## 其它设置

### PIN到快捷方式

对于符合“快速创建”的场景，用户可以在“场景”页面，点击“PIN到快捷方式”按钮，将场景添加到桌面快捷方式，方便用户快速创建笔记。

![在这里插入图片描述](644861-20240721143344284-537709312.png)


### 换肤功能

软件支持换肤功能，用户可以在“我的”页面，点击“黑暗”、“明亮”或“自动”按钮切换软件主题。

![在这里插入图片描述](644861-20240721143344255-1805735805.png)


# 程序设计

## 框架

使用Abp框架，我之前写过如何 [将Abp移植进.NET MAUI项目](https://www.cnblogs.com/jevonsflash/p/16310387.html)，本项目也是按照这篇博文完成项目搭建。

这次的项目，主要通过原型和工厂模式建设基于模板的笔记内容。

没有使用过多的跨平台特性，如果需要了解更多MAUI跨平台知识，请参考之前[音乐播放器系列文章](https://www.cnblogs.com/jevonsflash/p/17113139.html)。

## 定义

* Note - 笔记，可以成整页打开的内容
* NoteTemplate - 笔记模板，或称为场景，是可以快速创建笔记的模板
* NoteSegment - 笔记片段，它是一个笔记（Note）的组成
* NoteSegmentTemplate - 笔记片段模板，对应场景中可快速创建笔记片段的模板
* NoteSegmentPayload - 笔记片段负载，存储具体笔记片段的内容
* NoteSegmentService - 笔记片段服务类，为笔记片段，或笔记片段模板提供增删改等具体的业务逻辑
* NoteSegmentServiceFactory - 笔记片段服务工厂，为笔记片段服务类提供工厂方法


## 核心类

INoteSegment：它是笔记片段的抽象类，模板类NoteSegmentTemplate和笔记片段类NoteSegment都实现了INoteSegment

![在这里插入图片描述](644861-20240721143344100-1624374133.png)


它包含了笔记片段的属性，如标题、颜色、图标、是否隐藏、是否可删除、排序、状态、类型等。同时它关联一个笔记片段负载类INoteSegmentPayload

```
public interface INoteSegment
{
    string Color { get; set; }
    string Desc { get; set; }
    string Icon { get; set; }
    bool IsHidden { get; set; }
    bool IsRemovable { get; set; }
    int Rank { get; set; }
    string Status { get; set; }
    string Title { get; set; }
    string Type { get; set; }

    INoteSegmentPayload GetNoteSegmentPayload(string key);
    INoteSegmentPayload GetOrSetNoteSegmentPayload(string key, INoteSegmentPayload noteSegmentPayload);
    void SetNoteSegmentPayload(INoteSegmentPayload noteSegmentPayload);
}

```


INoteSegementService：凡事摘要拥有不同的笔记类型，如：时间戳片段，文本片段，文件片段等，App中可以通过添加片段按钮查看所有类型。


![在这里插入图片描述](644861-20240721143344137-2128060649.png)


这些片段通过片段服务类（NoteSegementService）来描述该如何存储，使用Payload中的数据。

不同的片段类型，通过不同的片段服务类来实现。比如，在时间戳片段中，我们要存储当前时间和计算倒计时，而文件片段中，我们要存储文件路径，文件名，文件大小，文件类型等信息。

这些都是通过片段服务类来实现的。

![在这里插入图片描述](644861-20240721143344113-933742018.png)


具体类型如下：


| 类型 | 描述 |
| --- | --- |
| DateTimeSegmentService | 时间戳片段服务类 |
| KeyValueSegmentService | 数值片段服务类 |
| FileSegmentService | 文件片段服务类 |
| TextSegmentService | 文本片段服务类 |
| TodoSegmentService | 待办片段服务类 |
| WeatherSegmentService | 天气片段服务类 |
| LocationSegmentService | 地点片段服务类 |
| TimerSegmentService | 闹钟片段服务类 |
| ContactSegmentService | 联系人片段服务类 |
| VoiceSegmentService | 录音片段服务类 |
| MediaSegmentService | 媒体片段服务类 |
| ScriptSegmentService | 绘制片段服务类 |
| DocumentSegmentService | 文件片段服务类 |

片段服务类包含了一个INoteSegment，它是当前的笔记片段对象


![在这里插入图片描述](644861-20240721143344091-1162869154.png)



INoteSegmentServiceFactory:

片段服务类的工厂类，除此之外还有一个INoteSegmentTemplateServiceFactory，他们都是根据笔记片段，或者笔记模板中的片段类型创建对应的片段服务类。

![在这里插入图片描述](644861-20240721143344098-2011269119.png)


用于笔记的片段服务类的工厂类:
```
public interface INoteSegmentServiceFactory: ISingletonDependency
{
    INoteSegmentService GetNoteSegmentService(NoteSegment noteSegment);
}
```

用于笔记模板的片段服务类的工厂类

```
public interface INoteSegmentTemplateServiceFactory: ISingletonDependency
{
    INoteSegmentService GetNoteSegmentService(NoteSegmentTemplate noteSegmentTemplate);
}
```

NoteSegmentService作为笔记片段服务的基类，它继承了`ViewModelBase`，实际上服务基类是各笔记片段视图层的ViewModel，视图界面元素通过绑定服务类中的属性来显示或更新数据。

![在这里插入图片描述](644861-20240721143344075-867092582.png)


每一种服务类都对应的一个视图。渲染时，Xaml通过NoteSegmentDataTemplateSelector模板选择器来选择对应的视图。有关界面部分将在另一篇文章介绍。

# 项目地址

**使用和发布请遵循[GPL-3.0 license](https://www.gnu.org/licenses/gpl-3.0.html)许可，请勿用于商业用途。**

[GitHub:MatoProductivity](https://github.com/jevonsflash/MatoProductivity)
