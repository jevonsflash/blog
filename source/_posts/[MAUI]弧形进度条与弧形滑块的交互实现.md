---
thumbnail: images/4f06f8f6208c43ceb45023a4036f95ee.png
title: '[MAUI]弧形进度条与弧形滑块的交互实现'
excerpt: >-
  Maxiumum：最大值Minimum：最小值Progress：当前进度AnimationLength：动画时长BorderWidth：描边宽度LabelContent：标签内容ContainerColor：容器颜色，即进度条的背景色ProgressColor：进度条颜色set;set;set;set;set;set;set;set;以及ValueChange事件，此事件用于在进度值改变时触发。
tags:
  - 控件
  - Xamarin
  - MAUI
categories:
  - [.NET MAUI]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-06-18 15:03:00/[MAUI]弧形进度条与弧形滑块的交互实现.html'
abbrlink: 8bc3857e
date: 2023-06-18 15:03:00
cover:
description:
---
<!-- toc -->
进度条（ProgressBar）用于展示任务的进度，告知用户当前状态和预期；

滑块（Slider）通过拖动滑块在一个固定区间内进行选择数值范围。

进度条和滑块都是进度值在UI界面的映射，其中滑块可以抽象成为带控制柄（Thumb）的进度条，是界面元素和进度值的双向绑定。

在某些场景下，我们需要一种更加直观的进度条，比如弧形进度条。今天在MAUI中实现一个弧形进度条和滑块。

![在这里插入图片描述](644861-20230618150057075-1979238891.gif)


使用[.NET MAU](https://dotnet.microsoft.com/en-us/apps/maui)实现跨平台支持，本项目可运行于Android、iOS平台。



## 弧形基类
新建.NET MAUI项目，命名`CircleWidget`

在项目中添加SkiaSharp绘制功能的引用`Microsoft.Maui.Graphics.Skia`以及`SkiaSharp.Views.Maui.Controls`。
```
<ItemGroup>
    <PackageReference Include="Microsoft.Maui.Graphics.Skia" Version="7.0.59" />
    <PackageReference Include="SkiaSharp.Views.Maui.Controls" Version="2.88.3" />
</ItemGroup>
```

### 定义

对于弧形进度条的绘制，以及属性定义等，我们将其抽象为一个基类CircleProgressBase.cs，代码如下：

```
public abstract class CircleProgressBase : ContentView, IProgress
```

控件将包含以下可绑定属性：
* Maxiumum：最大值
* Minimum：最小值
* Progress：当前进度
* AnimationLength：动画时长
* BorderWidth：描边宽度
* LabelContent：标签内容
* ContainerColor：容器颜色，即进度条的背景色
* ProgressColor：进度条颜色

```
public abstract double Maximum { get; set; }
public abstract double Minimum { get; set; }
public abstract Color ContainerColor { get; set; }
public abstract Color ProgressColor { get; set; }

public abstract double Progress { get; set; }
public abstract double AnimationLength { get; set; }
public abstract double BorderWidth { get; set; }
public abstract View LabelContent { get; set; }
```

以及ValueChange事件，此事件用于在进度值改变时触发。

```
public event EventHandler<double> ValueChanged;

```

实时进度值RealtimeProgress，应用于缓动动画中的实时渲染，稍后会详细说明。

```
protected double _realtimeProgress;
```

以及进度条宽度补偿值，稍后会详细说明。

```
protected float _mainRectPadding;

```
### 绘制弧

Skia中，通过AddArc方法绘制弧，需要传入一个SKRect对象，其代表一个弧（或椭弧）的外接矩形。startAngle和sweepAngle分别代表顺时针起始角度和扫描角度。

通过startAngle和sweepAngle可以绘制出一个弧，如下图红色部分所示：

![在这里插入图片描述](644861-20230618150056986-2078262960.png)


在OnCanvasViewPaintSurface中，通过给定起始角度为正上方，扫描角度为360对于100%进度，通过插值计算出当前进度对应的扫描角度，绘制出进度条。

```
protected virtual void OnCanvasViewPaintSurface(object sender, SKPaintSurfaceEventArgs args)
{
    SKImageInfo info = args.Info;
    SKSurface surface = args.Surface;
    SKCanvas canvas = surface.Canvas;
    canvas.Clear();
    SKRect rect = new SKRect(_mainRectPadding, _mainRectPadding, info.Width - _mainRectPadding, info.Height - _mainRectPadding);
    float startAngle = -90;
    float sweepAngle = (float)((_realtimeProgress / SumValue) * 360);

    canvas.DrawOval(rect, OutlinePaint);

    using (SKPath path = new SKPath())
    {
        path.AddArc(rect, startAngle, sweepAngle);

        canvas.DrawPath(path, ArcPaint);
    }
}
```

其中SumValue表明进度条的总进度，通过Maximum和Minimum计算得出。
```
public double SumValue => Maximum - Minimum;

```

创建进度条轨道背景画刷和进度条画刷：


```csharp
protected SKPaint _outlinePaint;

public SKPaint OutlinePaint
{
    get
    {
        if (_outlinePaint == null)
        {
            RefreshMainRectPadding();
            SKPaint outlinePaint = new SKPaint
            {
                Color = this.ContainerColor.ToSKColor(),
                Style = SKPaintStyle.Stroke,
                StrokeWidth = (float)BorderWidth,
            };
            _outlinePaint = outlinePaint;
        }
        return _outlinePaint;
    }
}

protected SKPaint _arcPaint;

public SKPaint ArcPaint
{
    get
    {
        if (_arcPaint == null)
        {
            RefreshMainRectPadding();
            SKPaint arcPaint = new SKPaint
            {
                Color = this.ProgressColor.ToSKColor(),
                Style = SKPaintStyle.Stroke,
                StrokeWidth = (float)BorderWidth,
                StrokeCap = SKStrokeCap.Round,
            };
            _arcPaint = arcPaint;
        }

        return _arcPaint;
    }
}

```

## 弧形进度条(ProgressBar)


控件由进度条和进度文本Label组成，进度文本位于控件中心

创建CircleProgressBar，他将继承CircleProgressBase，在Xaml部分我们添加弧形进度条的布局，代码如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<controls:CircleProgressBase xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
                             xmlns:forms="clr-namespace:SkiaSharp.Views.Maui.Controls;assembly=SkiaSharp.Views.Maui.Controls"
                             xmlns:controls="clr-namespace:CircleWidget.Controls;assembly=CircleWidget"
                             x:Class="CircleWidget.Controls.CircleProgressBar">
    <controls:CircleProgressBase.Content>
        <Grid>
            <forms:SKCanvasView x:Name="canvasView"
                                PaintSurface="OnCanvasViewPaintSurface" />
            <ContentView x:Name="MainContent"></ContentView>
            <Label FontSize="28"
                   HorizontalOptions="Center"
                   VerticalOptions="Center"
                   x:Name="labelView"></Label>
        </Grid>

    </controls:CircleProgressBase.Content>
</controls:CircleProgressBase>
```

SKCanvasView是SkiaSharp.Views.Maui.Controls封装的View控件。

效果如下

![在这里插入图片描述](644861-20230618150056933-333105619.png)



CodeBehind 中，我们将添加各抽象属性的具体实现。

在Progress值变更时，重新渲染进度条，并触发ValueChanged事件。
```

var obj = (CircleProgressBar)bindable;
obj.canvasView?.InvalidateSurface();
obj.ValueChanged?.Invoke(obj, obj.Progress);

```




### 添加动画

我们在控件外部更改Progress值的时候，因为缓动函数的执行，进度条并未立即达到目标值，在此期间，_realtimeProgress值代表实时发生的进度值。

Progress值的变更，是一个“请求”，类似HeightRequest。完成动画实际上是一个异步过程。

添加函数UpdateProgressWithAnimate，当触发Progress值变更请求时，调用此函数，将会执行动画。

```

protected virtual void UpdateProgressWithAnimate(Action<double, bool> finished = null)
{
    this.AbortAnimation("ReshapeAnimations");
    var scaleAnimation = new Animation();


    double progressTarget = this.Progress;

    double progressOrigin = this._realtimeProgress;

    var animateAction = (double r) =>
    {
        this._realtimeProgress = r;
        ValueChanged?.Invoke(this, this._realtimeProgress);
    };
 
    var scaleUpAnimation0 = new Animation(animateAction, progressOrigin, progressTarget);
    scaleAnimation.Add(0, 1, scaleUpAnimation0);
    scaleAnimation.Commit(this, "ReshapeAnimations", 16, (uint)this.AnimationLength, finished: finished);

}

```

可以给动画添加一个自定义缓动函数

如添加一个反复弹跳至目标值的缓动函数，拟合函数图像如下：

![在这里插入图片描述](644861-20230618150057173-282774420.png)


应用到代码中：

```
var myEasing = (double x) => {
    if (x < 1 / 2.75f)
    {
        return 7.5625f * x * x;
    }
    if (x < 2 / 2.75f)
    {
        x -= 1.5f / 2.75f;
        return 7.5625f * x * x + .75f;
    }
    if (x < 2.5f / 2.75f)
    {
        x -= 2.25f / 2.75f;
        return 7.5625f * x * x + .9375f;
    }
    x -= 2.625f / 2.75f;
    return 7.5625f * x * x + .984375f;
};
var scaleUpAnimation0 = new Animation(animateAction, progressOrigin, progressTarget, myEasing);
scaleAnimation.Add(0, 1, scaleUpAnimation0);
scaleAnimation.Commit(this, "ReshapeAnimations", 16, (uint)this.AnimationLength, finished: finished);
```

在Progress值变更时的触发函数改写为：

```
var obj = (CircleSlider)bindable;
obj.UpdateProgressWithAnimate();
```

效果如下：

![在这里插入图片描述](644861-20230618150057039-1205316486.gif)


当然，这在每一次的变更时，都会应用动画。如果频繁密集地更改进度，这将会导致动画的堆积，造成性能问题。

我们通过一个阈值限制动画发生的频次，当变更的进度值超过阈值时，才应用动画。

CircleProgressBase 中添加一个常量：
```
protected const int ANIMATE_THROTTLE = 10;

```

当新值相较于旧值的变化幅度超过阈值时（10%或以上的进度变更请求），应用动画，否则直接更新进度条。

```
protected virtual void UpdateProgress()
{
    this._realtimeProgress = this.Progress;
    ValueChanged?.Invoke(this, this._realtimeProgress);
}
```

```
var obj = (CircleSlider)bindable;
var valueChangedSpan = (double)oldValue - (double)newValue;
if (Math.Abs(valueChangedSpan) > ANIMATE_THROTTLE)
{
    obj.UpdateProgressWithAnimate();
}
else
{
    obj.UpdateProgress();
}
```




### 宽度补偿

在Skia中，当我们设置path的宽度（StrokeWidth）, path的绘制是以path的中心线为基准，向两边扩张的，如下图

![在这里插入图片描述](644861-20230618150057017-1597079724.png)


当默认绘制区域（canvas）的尺寸等同于控件尺寸时，绘制有可能溢出，为了保持绘制在控件内部，我们需要对绘制区域进行补偿。

创建_mainRectPadding的更新函数RefreshMainRectPadding，当控件尺寸变更时
```

protected virtual void RefreshMainRectPadding()
{
    //边界补偿
    this._mainRectPadding = (float)(this.BorderWidth / 2);
    this.Padding = this._mainRectPadding;
}
```
当BorderWidth变更时，调用此函数，更新_mainRectPadding的值。

```
protected virtual void CircleProgressBar_PropertyChanged(object sender, PropertyChangedEventArgs e)
{
    ...
    if (e.PropertyName == nameof(BorderWidth))
    {
        this.RefreshMainRectPadding();
    }
}
```

### 文本

最后将进度文本控件值变更添加到CircleProgressBar_ValueChanged中，完成控件的实现。

```
private void CircleProgressBar_ValueChanged(object sender, double e)
{
    this.labelView.Text = e.ToString(LABEL_FORMATE);
    this.canvasView?.InvalidateSurface();
}
```

LABEL_FORMATE是一个常量，用于格式化进度文本的显示。
string格式化请参考[官方文档](https://learn.microsoft.com/zh-cn/dotnet/api/system.double.tostring?view=net-7.0)

```
protected const string LABEL_FORMATE = "0";
```

## 弧形滑块(Slider)

弧形滑块的实现，与弧形进度条的实现类似，我们只需要在CircleProgressBar的基础上，添加控制柄的布局和拖动事件处理

创建CircleSlider，他将继承CircleProgressBase，在Xaml部分，我们在原弧形进度条的布局基础上，添加弧形滑块控制柄的布局，代码如下：

```
<!-- 进度条布局 -->
...

<!-- 控制柄布局 -->
<ContentView x:Name="ThumbContent"
                Background="transparent"
                HeightRequest="50"
                WidthRequest="50">
    <ContentView.GestureRecognizers>
        <PanGestureRecognizer PanUpdated="PanGestureRecognizer_PanUpdated"></PanGestureRecognizer>
    </ContentView.GestureRecognizers>
    <Border Background="white"
            Opacity="0.5"
            StrokeThickness="0">
        <Border.StrokeShape>
            <RoundRectangle CornerRadius="50" />
        </Border.StrokeShape>
        <Border.Shadow>
            <Shadow Brush="Black"
                    Offset="20,20"
                    Radius="40"
                    Opacity="0.8" />
        </Border.Shadow>
    </Border>
</ContentView>
```

### 创建控制柄


重写OnCanvasViewPaintSurface方法，添加控制柄的位置更新逻辑

```
protected override void OnCanvasViewPaintSurface(object sender, SKPaintSurfaceEventArgs args)
{

    ...
    var thumbX = Math.Sin(sweepAngle * Math.PI / 180) * (this.Width/2-1.25*this._mainRectPadding);
    var thumbY = Math.Cos(sweepAngle * Math.PI / 180) * (this.Height / 2-1.25*this._mainRectPadding);

    this.ThumbContent.TranslationX=thumbX;
    this.ThumbContent.TranslationY=-thumbY;

}
```
效果如下：
![在这里插入图片描述](644861-20230618150057087-114729514.gif)


### 拖动事件处理

添加一个PanGestureRecognizer的事件处理函数，用于处理控制柄的拖动事件

首先计算触摸点的坐标，以圆心为原点，触摸点的坐标（PositionX,PositionY）是原ThumbContent的坐标（TranslationX,TranslationY）与触摸点的偏移量（e.TotalX,e.TotalY）的和。

当控制柄被拖动时，我们需要计算出拖动的角度，触摸点与圆心的连线与X轴的夹角即为拖动的角度（sweepAngle）。

很容易得出，PositionX与PositionY的比值，是角度sweepAngle的正切值，他们的关系如下图所示：

![在这里插入图片描述](644861-20230618150057014-354084307.png)


将角度转换为进度值，更新进度条的值。



```
private void PanGestureRecognizer_PanUpdated(object sender, PanUpdatedEventArgs e)
{
    var thumb = sender as ContentView;
    var PositionX = thumb.TranslationX+e.TotalX;
    var PositionY = thumb.TranslationY+e.TotalY;

    this.test.TranslationX = thumb.TranslationX+e.TotalX;
    this.test.TranslationY = thumb.TranslationY+e.TotalY;

    var sweepAngle = AngleNormalize(Math.Atan2(PositionX, -PositionY)*180/Math.PI);

    var targetProgress = sweepAngle*SumValue/360;
    this.Progress=targetProgress;

}
```
![在这里插入图片描述](644861-20230618150057198-1749453764.gif)



sweepAngle的取值范围为[-180,180]，我们需要将其转换为[0,360]的取值范围，这里我们使用AngleNormalize函数进行转换。

```
private double AngleNormalize(double value)
{
    double twoPi = 360;
    while (value <= -180) value += twoPi;
    while (value >   180) value -= twoPi;
    value= (value + twoPi) % twoPi;
    return value;
}
```

将可绑定属性Progress的绑定模式改为TwoWay。
```
public static readonly BindableProperty ProgressProperty =
BindableProperty.Create("Progress", typeof(double), typeof(CircleSlider), 0.5, defaultBindingMode:BindingMode.TwoWay)
```


最终效果如下：


![在这里插入图片描述](644861-20230618150057075-1979238891.gif)



## 项目地址

[Github:maui-samples](https://github.com/jevonsflash/maui-samples)

Mato.Maui控件库
[Mato.Maui](https://github.com/jevonsflash/Mato.Maui)