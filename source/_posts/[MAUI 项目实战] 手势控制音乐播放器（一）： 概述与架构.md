---
thumbnail:
cover:
title: '[MAUI 项目实战] 手势控制音乐播放器（一）： 概述与架构'
excerpt:
description:
date: 2023-04-09 18:13:00
tags:
  - Xamarin
  - MAUI
  - XAML

categories:
  - .NET MAUI
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-04-09 18:13:00/[MAUI 项目实战] 手势控制音乐播放器（一）： 概述与架构.html
---
这是一篇系列博文。请关注我，学习更多.NET MAUI开发知识！

* [[MAUI 项目实战] 手势控制音乐播放器（一）： 概述与架构](https://www.cnblogs.com/jevonsflash/p/17300734.html)
* [[MAUI 项目实战] 手势控制音乐播放器（二）： 手势交互](https://www.cnblogs.com/jevonsflash/p/17298935.html)
* [[MAUI 项目实战] 手势控制音乐播放器（三）： 动画](https://www.cnblogs.com/jevonsflash/p/17299661.html)
* [[MAUI 项目实战] 手势控制音乐播放器（四）：圆形进度条](https://www.cnblogs.com/jevonsflash/p/17299943.html)


在之前的博文中提到这个项目，它是为音乐播放器专门开发的基于手势控制的UI界面。


此UI界面可以让用户在不看屏幕的情况下，通过手势来控制音乐播放器的各种操作，如播放、暂停、下一首、上一首。

![在这里插入图片描述](644861-20230409181127606-1746122039.png)
手势来控制的交互方式适合不方便看手机屏幕时简单的音乐播放需求，在驾车、运动等场景下有较好的用户体验。

![在这里插入图片描述](644861-20230409181127615-475446033.png)
## 架构

### 跨平台
使用[.NET MAU](https://dotnet.microsoft.com/en-us/apps/maui)实现跨平台支持，本项目可运行于Android、iOS平台。

![在这里插入图片描述](644861-20230409181127574-833495771.gif)![在这里插入图片描述](644861-20230409181127602-318419863.gif)


### 播放内核

播放内核使用MatoMusic.Core，查看此博文[[MAUI 项目实战] 音乐播放器（二）：播放内核](https://www.cnblogs.com/jevonsflash/p/17113143.html)

此项目重点关注的是手势交互UI，播放内核的实现将不再赘述。


## 手势原理

在播放界面的8个方向，分别放置控制区域，通过拖拽圆形专辑（pan）到控制区域（pit），实现对应的控制操作。此示例实现了快进，快退，下一曲，上一曲，播放/暂停操作，pan和pit将在下一章节介绍。

拖拽平移和控制区域的关系，可以抽象成四个状态，分别是Out，In，Over，Start。

手势状态类型PanType定义如下：
* In：pan进入pit时触发，
* Out：pan离开pit时触发，
* Over：释放pan时触发，
* Start：pan开始拖拽时触发


```
public enum PanType
{
    Out, In, Over, Start
}
```

对拖拽手势的处理，由手势容器控件PanContainer封装，实现方式将在下一章节介绍。

一次有效的控制，经过Start -> In -> Out -> Over的状态变化，并且手指释放位置是在pit的范围内。

当整个控制触发完成后，控件将触发OnfinishedChoise事件。

### 基本控制
在页面中订阅这个事件，在事件方法中实现控制逻辑。

如上一曲操作，订阅事件后，实现如下逻辑：

```
private void DefaultPanContainer_OnOnfinishedChoise(object sender, PitGrid e)
{
    CurrentPitView = e;
    switch (CurrentPitView.PitName)
    {
        case "LeftPit":
        MusicRelatedViewModel.PreAction(null);
        break;

        ...
    }
}

```

控件会将当前触发的pit传递给事件方法，通过pit的名称，可以判断当前触发的是哪个控制区域。


控件在经过pit时会启用广播事件，使用CommunityToolkit库的 WeakReferenceMessenger实现了消息机制，订阅此事件消息可以接收到控件运动的细节，在事件方法中实现自己的逻辑，如界面元素样式的改变。


```
public NowPlayingPage()
{
    InitializeComponent();
    WeakReferenceMessenger.Default.Register<PanActionArgs, string>(this, TokenHelper.PanAction, PanActionHandler);
    ...
}
```
如在拖拽开始时，显示控制区域的提示信息，拖拽结束时，隐藏提示信息。


```
private async void PanActionHandler(object recipient, PanActionArgs args)
{
    var parentAnimation = new Animation();

    Animation scaleUpAnimation1;
    Animation scaleUpAnimation2;
    switch (args.PanType)
    {
        case PanType.Over:

            scaleUpAnimation1 = new Animation(v => this.PitContentLayout.Opacity = v, PitContentLayout.Opacity, 0, Easing.CubicOut);
            scaleUpAnimation2 = new Animation(v => this.TitleLayout.Opacity = v, TitleLayout.Opacity, 1, Easing.CubicOut);

            parentAnimation.Add(0, 1, scaleUpAnimation1);
            parentAnimation.Add(0, 1, scaleUpAnimation2);

            parentAnimation.Commit(this, "RestoreAnimation", 16, 250);
         
...

```
### 快进/快退
拖拽停留在左右控制区域超过一定时间，将触发“快进”或“快退”

播放界面拥有一个定时器，用于拖拽快进、快退功能
```
private IDispatcherTimer _dispatcherTimer;
```

拖拽进入控制区域时，启动定时器，停留在左右控制区域大于2s时将触发定时器Tick事件，执行快进或快退操作。

```
private async void PanActionHandler(object recipient, PanActionArgs args)
{

    switch (args.PanType)
    {
        ...
        case PanType.In:

            switch (args.CurrentPit?.PitName)
            {
                case "LeftPit":

                    _dispatcherTimer =Dispatcher.CreateTimer();
                    _dispatcherTimer.Interval=new TimeSpan(0, 0, 2);

                    _dispatcherTimer.Tick+=   async (o, e) =>
                    {
                        this.TipLabel.Text = FaIcons.IconFastBackward;
                        this.TipTextLabel.Text = "快退";
                        _runCount++;
                        await MusicRelatedViewModel.StartFastSeeking(-2);


                    };
                    _dispatcherTimer.Start();
                    this.TipTextLabel.Text = "上一曲";

                    break;
    ...
```


_runCount是个全局变量，记录是否已经执行过快进或快退操作，当退出控制区域时，如果已经执行过快进或快退操作，将停止快进或快退操作，并将计时器停止。

```
 case PanType.Out:
    this.PitTipLayout.Children.Clear();
    if (this._runCount > 0)
    {
        MusicRelatedViewModel.EndFastSeeking();
    }
    if (_dispatcherTimer!=null)
    {
        _dispatcherTimer.Stop();

    }
    _runCount = 0;
    this.TipTextLabel.Text = string.Empty;


    break;
```
同理，在松手时，应该停止快进或快退操作，并将计时器停止。
```
case PanType.Over:

    ...
    MusicRelatedViewModel.EndFastSeeking();
    if (_dispatcherTimer!=null)
    {
        _dispatcherTimer.Stop();

    }
    _runCount = 0;
```
### 沉浸模式
_dispatcherTimer2是控制界面进入“沉浸模式”的定时器，当界面无操作5s之后界面将进入沉浸模式，隐藏标题栏。

```
private void SetupFullScreenMode(int delay = 5)
{
    _dispatcherTimer2 =Dispatcher.CreateTimer();
    _dispatcherTimer2.Interval=new TimeSpan(0, 0, delay);

    _dispatcherTimer2.Tick+=   (o, e) =>
    {

        this.MainCircleSlider.BorderWidth = 3;
        this.TitleLayout.FadeTo(0);

    };

    _dispatcherTimer2.Start();
}

```

有操作进行时，恢复到正常模式。
```
case PanType.Start:

    ...

    if (_dispatcherTimer2.IsRunning)
    {
        _dispatcherTimer2.Stop();
    }
    SetupNormalMode();

    break;
```

下一章将逐步展开手势控制的实现细节。

## 项目地址

[Github:maui-samples](https://github.com/jevonsflash/maui-samples)
