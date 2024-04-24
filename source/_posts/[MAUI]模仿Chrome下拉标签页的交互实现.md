---
thumbnail:
cover:
title: '[MAUI]模仿Chrome下拉标签页的交互实现'
excerpt:
description:
date: 2023-05-28 18:00:00
tags:
  - Xamarin
  - MAUI
  - XAML
  - 产品设计

categories:
  - .NET MAUI
  - 产品设计
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-05-28 18:00:00/[MAUI]模仿Chrome下拉标签页的交互实现.html
---
<!-- toc -->
今天来说说怎样在[.NET MAUI ](https://learn.microsoft.com/zh-cn/dotnet/maui/fundamentals/gestures/pan?view=net-maui-7.0)中制作一个灵动的类标签页控件，这类控件常用于页面中多个子页面的导航功能。

比如在手机版的Chrome中，当用户在网页中下拉时将出现“新建标签页”，“刷新”，“关闭标签页”三个选项，通过不间断的横向手势滑动，可以在这三个选项之间切换。选项指示器是一个带有粘滞效果的圆，如下图：

> ![在这里插入图片描述](644861-20230528175319626-387886868.jpg)
> 图 - iOS版Edge浏览器下拉刷新功能

浏览网页常用选项融入到了原“下拉刷新”交互中，对比传统交互方式它更显便捷和流畅，根据Steve Krug之《Don't Make Me Think》的核心思想，用户无需思考点击次序，只需要使用基础动作就能完成交互。



今天在[.NET MAUI ](https://learn.microsoft.com/zh-cn/dotnet/maui/fundamentals/gestures/pan?view=net-maui-7.0)中实现Chrome下拉标签页交互，以及常见的新闻类App中的标签页切换交互
 ，最终效果如下：

![在这里插入图片描述](644861-20230528175319814-1419373995.gif)
![在这里插入图片描述](644861-20230528175319782-872601435.gif)



使用[.NET MAU](https://dotnet.microsoft.com/en-us/apps/maui)实现跨平台支持，本项目可运行于Android、iOS平台。

## 创建粘滞效果的圆控件

粘滞效果模仿了水滴，或者“史莱姆”等等这种粘性物质受外力作用的形变效果。

要实现此效果，首先请出我们的老朋友——贝塞尔曲线，二阶贝塞尔曲线可以根据三点：起始点、终止点（也称锚点）、控制点绘制出一条平滑的曲线，利用多段贝塞尔曲线函数，可以拟合出一个圆。

通过微调各曲线的控制点，可以使圆产生形变效果，即模仿了粘滞效果。

### 贝塞尔曲线绘制圆

用贝塞尔曲线无法完美绘制出圆，只能无限接近圆。

对于n的贝塞尔曲线，到曲线控制点的最佳距离是(4/3)*tan(pi/(2n))，详细推导过程可以查看这篇文章https://spencermortensen.com/articles/bezier-circle/

![在这里插入图片描述](644861-20230528175319639-713977457.png)



因此，对于4分，它是(4/3)*tan(pi/8) = 4*(sqrt(2)-1)/3 = 0.552284749831。

![在这里插入图片描述](644861-20230528175319812-55275834.png)


### 创建控件

我们创建控件StickyPan，在Xaml部分，我们创建一个包含四段BezierSegment的Path，代码如下：

```
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             SizeChanged="ContentView_SizeChanged"
             Background="white"            
             x:Class="StickyTab.Controls.StickyPan">
    <Grid>
        <Path x:Name="MainPath">
            <Path.Data>
                <PathGeometry>
                    <PathFigure x:Name="figure1" Stroke="red">
                        <PathFigure.Segments>
                            <PathSegmentCollection>
                                <BezierSegment x:Name="arc1" />
                                <BezierSegment x:Name="arc2" />
                                <BezierSegment x:Name="arc3" />
                                <BezierSegment x:Name="arc4" />
                            </PathSegmentCollection>
                        </PathFigure.Segments>
                    </PathFigure>
                </PathGeometry>
            </Path.Data>
     
        </Path>
    </Grid>
</ContentView>
```

我们对4段贝塞尔曲线的各起始点、终止点以及控制点定义如下

![在这里插入图片描述](644861-20230528175319762-684207799.png)


请记住这些点的名称，在给圆添加形变时会引用这些点。


圆的大小为控件的宽高，圆心为控件的中心点。根据公式，我们计算出控制点的偏移量
```
private double C = 0.552284749831f;

public double RadiusX => this.Width/2;
public double RadiusY => this.Height/2;
public Point Center => new Point(this.Width/2, this.Height/2);

public double DifferenceX => RadiusX * C;
public double DifferenceY => RadiusY * C;


```

根据控制点偏移量计算出各控制点的坐标
以及贝塞尔曲线的起始点和终止点：

```
Point p0 = new Point(Width/2, 0);
Point h1 = new Point(Width/2-DifferenceX, 0);
Point h2 = new Point(this.Width/2+DifferenceX, 0);
Point h3 = new Point(this.Width, this.Height/2-  DifferenceY);
Point p1 = new Point(this.Width, this.Height/2);
Point h4 = new Point(this.Width, this.Height/2+DifferenceY);
Point h5 = new Point(this.Width/2+DifferenceX, this.Height);
Point p2 = new Point(this.Width/2, this.Height);
Point h6 = new Point(this.Width/2-DifferenceX, this.Height);
Point h7 = new Point(0, this.Height/2+DifferenceY);
Point p3 = new Point(0, this.Height/2);
Point h8 = new Point(0, this.Height/2-DifferenceY);

```

如此，我们便绘制了一个圆
```
this.figure1.StartPoint =  p0;

this.arc1.Point1 = h2;
this.arc1.Point2 = h3;
this.arc1.Point3 = p1;


this.arc2.Point1 = h4;
this.arc2.Point2 = h5;
this.arc2.Point3 = p2;

this.arc3.Point1 = h6;
this.arc3.Point2 = h7;
this.arc3.Point3 = p3;

this.arc4.Point1 = h8;
this.arc4.Point2 = h1;

this.arc4.Point3 = p0;
```
效果如下：

![在这里插入图片描述](644861-20230528175319726-516058606.png)


### 创建形变


现在想象这个圆是一颗水珠，假设我们要改变圆的形状，形成向右的“水滴状”。

水的体积是不会变的，当一边发生扩张形变，相邻的两边必定收缩形变。


假设x方向的形变量为dy，y方向的形变量为dx，收缩形变系数为0.4，扩张形变系数为0.8，应用到p0、p1、p2、p3的点坐标变化如下：

```

var dx = 400*0.8;
var dy = 400*0.4;
p0= p0.Offset(0, Math.Abs(dy));
p1= p1.Offset(dx, 0);
p2 = p2.Offset(0, -Math.Abs(dy));
```

p0变换后的坐标为p0',p1变换后的坐标为p1',p2变换后的坐标为p2'。
变换前后的对比如下：

![在这里插入图片描述](644861-20230528175319761-1208255528.png)


### 可控形变

请注意，上一小节提到的形变量dx、dy是固定的，我们需要将形变量变为可变，这样才能实现水滴的形变。

我们定义两个变量_offsetX、_offsetY，用于控制形变量的大小。计算形变量的正负值确定形变的方向。不同方向上平移作用的点不同，计算出各点的坐标变化如下：

```
var dx = _offsetX * 0.8 + _offsetY * 0.4;
var dy = _offsetX * 0.4 + _offsetY * 0.8;
if (_offsetX != 0)
{
    if (dx > 0)
    {
        p1 = p1.Offset(dx, 0);

    }
    else
    {
        p3 = p3.Offset(dx, 0);
    }
    p0 = p0.Offset(0, Math.Abs(dy));
    p2 = p2.Offset(0, -Math.Abs(dy));
}

if (_offsetY != 0)
{
    if (dy > 0)
    {
        p2 = p2.Offset(0, dy);
    }

    else
    {
        p0 = p0.Offset(0, dy);
    }
    p1 = p1.Offset(-Math.Abs(dx), 0);
    p3 = p3.Offset(Math.Abs(dx), 0);

}
```

这样在x，y方向可以产生自由形变


![在这里插入图片描述](644861-20230528175319866-1538040856.gif)



注意此时我们引入了PanWidth、PanHeight两个属性描述圆的尺寸，因为圆会发生扩张形变，圆的边缘不应该再为控件边缘

```
public double RadiusX => this.PanWidth / 2;
public double RadiusY => this.PanHeight / 2;


//圆形居中补偿
var adjustX = (this.Width - PanWidth) / 2 ;
var adjustY = (this.Height - PanHeight) / 2 ;

Point p0 = new Point(PanWidth / 2 + adjustX, adjustY);
Point p1 = new Point(this.PanWidth + adjustX, this.PanHeight / 2 + adjustY);
Point p2 = new Point(this.PanWidth / 2 + adjustX, this.PanHeight + adjustY);
Point p3 = new Point(adjustX, this.PanHeight / 2 + adjustY);
```

### 形变边界

首先确定一个“容忍度”，当形变量超过容忍度时，不再产生形变，这样可以避免形变过大，导致圆形形变过渡。

这个容忍度将由控件到目标点的距离决定，可以想象这个粘稠的水滴在粘连时，距离越远，粘连越弱。当距离超过容忍度时，粘连就会断开。

此时offsetX、offsetY正好可以代表这个距离，我们可以通过offsetX、offsetY计算出距离，然后与容忍度比较，超过容忍度则将不黏连。

```
var _offsetX = OffsetX;
//超过容忍度则将不黏连
if (OffsetX <= -(this.Width - PanWidth) / 2 || OffsetX > (this.Width - PanWidth) / 2)
{
    _offsetX = 0;
}

var _offsetY = OffsetY;
//超过容忍度则将不黏连
if (OffsetY <= -(this.Height - PanHeight) / 2 || OffsetY > (this.Height - PanHeight) / 2)
{
    _offsetY = 0;
}

```

容忍度不应超过圆边界到控件边界的距离，此处为±50；



![在这里插入图片描述](644861-20230528175319781-1226015255.gif)




因为是黏连，所以在容忍度范围内，要模拟粘连的效果，圆发生形变时，实际上是力作用于圆上的点，所以是圆上的点发生位移，而不是圆本身。

将offsetX和offsetY考虑进补偿偏移量计算，重新计算贝塞尔曲线各点的坐标

```
var adjustX = (this.Width - PanWidth) / 2 - _offsetX;
var adjustY = (this.Height - PanHeight) / 2 - _offsetY;

Point p0 = new Point(PanWidth / 2 + adjustX, adjustY);
Point p1 = new Point(this.PanWidth + adjustX, this.PanHeight / 2 + adjustY);
Point p2 = new Point(this.PanWidth / 2 + adjustX, this.PanHeight + adjustY);
Point p3 = new Point(adjustX, this.PanHeight / 2 + adjustY);
```

![在这里插入图片描述](644861-20230528175319770-946482990.gif)



当改变控件和目标距离时，圆有了一种“不想离开”的感觉，此时模拟了圆的粘滞效果。



### 形变动画

当圆的形变超过容忍度时，圆会恢复到原始状态，此时需要一个动画，模拟回弹效果。

我们不必计算动画路径细节，只需要计算动画的起始点和终止点：

* 重新计算原始状态的贝塞尔曲线各点的位置作为终止点

* 贝塞尔曲线各点的当前位置，作为起始点

创建方法Animate，代码如下：

```
private void Animate(Action<double, bool> finished = null)
{
    Content.AbortAnimation("ReshapeAnimations");
    var scaleAnimation = new Animation();


    var adjustX = (this.Width - PanWidth) / 2;
    var adjustY = (this.Height - PanHeight) / 2;

    Point p0Target = new Point(PanWidth / 2 + adjustX, adjustY);
    Point p1Target = new Point(this.PanWidth + adjustX, this.PanHeight / 2 + adjustY);
    Point p2Target = new Point(this.PanWidth / 2 + adjustX, this.PanHeight + adjustY);
    Point p3Target = new Point(adjustX, this.PanHeight / 2 + adjustY);

    Point p0Origin = this.figure1.StartPoint;
    Point p1Origin = this.arc1.Point3;
    Point p2Origin = this.arc2.Point3;
    Point p3Origin = this.arc3.Point3;

    ...
}
```

使用线性插值法，根据进度值r，计算各点坐标。线性插值法在[之前的文章](https://www.cnblogs.com/jevonsflash/p/17368362.html)有介绍，或参考[这里](https://wiki.mbalib.com/wiki/%E7%BA%BF%E6%80%A7%E6%8F%92%E5%80%BC%E6%B3%95)，此篇将不赘述。


```
var animateAction = (double r) =>
{

    Point p0 = new Point((p0Target.X - p0Origin.X) * r + p0Origin.X, (p0Target.Y - p0Origin.Y) * r + p0Origin.Y);
    Point p1 = new Point((p1Target.X - p1Origin.X) * r + p1Origin.X, (p1Target.Y - p1Origin.Y) * r + p1Origin.Y);
    Point p2 = new Point((p2Target.X - p2Origin.X) * r + p2Origin.X, (p2Target.Y - p2Origin.Y) * r + p2Origin.Y);
    Point p3 = new Point((p3Target.X - p3Origin.X) * r + p3Origin.X, (p3Target.Y - p3Origin.Y) * r + p3Origin.Y);

    Point h1 = new Point(p0.X - DifferenceX, p0.Y);
    Point h2 = new Point(p0.X + DifferenceX, p0.Y);
    Point h3 = new Point(p1.X, p1.Y - DifferenceY);
    Point h4 = new Point(p1.X, p1.Y + DifferenceY);
    Point h5 = new Point(p2.X + DifferenceX, p2.Y);
    Point h6 = new Point(p2.X - DifferenceX, p2.Y);
    Point h7 = new Point(p3.X, p3.Y + DifferenceY);
    Point h8 = new Point(p3.X, p3.Y - DifferenceY);


    this.figure1.StartPoint = p0;
    this.arc1.Point1 = h2;
    this.arc1.Point2 = h3;
    this.arc1.Point3 = p1;


    this.arc2.Point1 = h4;
    this.arc2.Point2 = h5;
    this.arc2.Point3 = p2;

    this.arc3.Point1 = h6;
    this.arc3.Point2 = h7;
    this.arc3.Point3 = p3;

    this.arc4.Point1 = h8;
    this.arc4.Point2 = h1;

    this.arc4.Point3 = p0;
};

```

将动画添加到Animation对象中，然后提交动画。

动画触发，将在400毫秒内完成圆的复原。


```
var scaleUpAnimation0 = new Animation(animateAction, 0, 1);
scaleAnimation.Add(0, 1, scaleUpAnimation0);
scaleAnimation.Commit(this, "ReshapeAnimations", 16, 400, finished: finished);

```

效果如下：

![在这里插入图片描述](644861-20230528175319677-1091612842.gif)



可以使用自定义缓动函数调整动画效果， 在[之前的文章](https://www.cnblogs.com/jevonsflash/p/17299661.html)介绍了自定义缓动函数，此篇将不赘述。

使用如下图像的函数曲线，可以使动画添加一个惯性回弹效果。

![在这里插入图片描述](644861-20230528175319780-1126939483.png)



应用此函数，代码如下：
```
var mySpringOut = (double x) => (x - 1) * (x - 1) * ((5f + 1) * (x - 1) + 5) + 1;
var scaleUpAnimation0 = new Animation(animateAction, 0, 1, mySpringOut);
...
```

运行效果如下，这使得这个带有粘性的圆的回弹过程更有质量感

![在这里插入图片描述](644861-20230528175319656-1211386214.gif)



如果你觉得这样不够“弹”

可以使用阻尼振荡函数作为动画自定义缓动函数，此函数拟合的图像如下：

![在这里插入图片描述](644861-20230528175319599-626698345.png)


运行效果如下：


![在这里插入图片描述](644861-20230528175319830-771909675.gif)

## 创建手势控件

 [.NET MAUI ](https://learn.microsoft.com/zh-cn/dotnet/maui/fundamentals/gestures/pan?view=net-maui-7.0)跨平台框架包含了识别平移手势的功能，在之前的博文[[MAUI 项目实战] 手势控制音乐播放器（二）： 手势交互](https://www.cnblogs.com/jevonsflash/p/17298935.html)中利用此功能实现了pan-pit拖拽系统。此篇将不赘述。

简单来说就是拖拽物(pan)体到坑(pit)中，手势容器控件PanContainer描述了pan运动和pit位置的关系，并在手势运动中产生一系列消息事件。




## 创建页面布局

新建.NET MAUI项目，命名`StickyTab`

在`MainPage.xaml`中添加如下代码：


```
<ContentPage.Content>
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="200" />
            <RowDefinition Height="1*" />
        </Grid.RowDefinitions>
        <Grid Grid.Row="0"
                BackgroundColor="#F1F1F1">
            <Grid x:Name="PitContentLayout"
                    ZIndex="1">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="1*" />
                    <ColumnDefinition Width="1*" />
                    <ColumnDefinition Width="1*" />
                </Grid.ColumnDefinitions>

                <controls1:PitGrid x:Name="NewTabPit"
                                    PitName="NewTabPit"
                                    WidthRequest="100"
                                    HeightRequest="200"
                                    Grid.Column="0">

                    <Label   x:Name="NewTabLabel"
                                TextColor="Black"
                                FontFamily="FontAwesome"
                                FontSize="28"
                                HorizontalOptions="CenterAndExpand"
                                Margin="0"></Label>
                    <Label  Margin="0,100,0,0"
                            Opacity="0"
                                Text="新建标签页"
                                TextColor="#6E6E6E"
                                FontSize="18"
                                HorizontalOptions="CenterAndExpand"
                            ></Label>


                </controls1:PitGrid>
                <controls1:PitGrid x:Name="RefreshPit"
                                    PitName="RefreshPit"
                                    WidthRequest="100"
                                    HeightRequest="200"
                                    Grid.Column="1">

                    <Label   x:Name="RefreshLabel"
                                TextColor="Black"
                                FontFamily="FontAwesome"
                                FontSize="28"
                                HorizontalOptions="CenterAndExpand"
                                Margin="0"></Label>
                    <Label  Margin="0,100,0,0"
                            Opacity="0"
                            Text="刷新"
                            TextColor="#6E6E6E"
                            FontSize="18"
                            HorizontalOptions="CenterAndExpand"></Label>
                </controls1:PitGrid>
                <controls1:PitGrid x:Name="CloseTabPit"
                                    PitName="CloseTabPit"
                                    WidthRequest="100"
                                    HeightRequest="200"
                                    Grid.Column="2">

                    <Label   x:Name="CloseTabLabel"
                                TextColor="Black"
                                FontFamily="FontAwesome"
                                FontSize="28"
                                HorizontalOptions="CenterAndExpand"
                                Margin="0"></Label>
                    <Label  Margin="0,100,0,0"
                            Opacity="0"
                            Text="关闭标签页"
                            TextColor="#6E6E6E"
                            FontSize="18"
                            HorizontalOptions="CenterAndExpand"></Label>
                </controls1:PitGrid>
            </Grid>
            <controls1:PanContainer BackgroundColor="Transparent" ZIndex="0"
                                    x:Name="DefaultPanContainer"
                                    OnTapped="DefaultPanContainer_OnOnTapped"
                                    AutoAdsorption="False"
                                    PanScale="1.0"
                                    SpringBack="True"
                                    PanScaleAnimationLength="100"
                                    Orientation="Horizontal">

                <Grid PropertyChanged="BindableObject_OnPropertyChanged"
                        VerticalOptions="Start"
                        HorizontalOptions="Start">

                    <controls:StickyPan x:Name="MainStickyPan"
                                        Background="Transparent"
                                        PanStrokeBrush="Transparent"
                                        PanFillBrush="White"
                                        AnimationLength="400"
                                        PanHeight="80"
                                        PanWidth="80"
                                        HeightRequest="120"
                                        WidthRequest="120">
                        
                        
                        
                    </controls:StickyPan>

                </Grid>


            </controls1:PanContainer>

        </Grid>
    </Grid>
</ContentPage.Content>

```

页面布局看起来像这样：


![在这里插入图片描述](644861-20230528175319578-738021940.png)


### 更新拖拽物位置

在Xaml中我们订阅了`PropertyChanged`事件，当拖拽物的位置发生变化时，我们需要更新拖拽系统中目标坑的位置。

_currentDefaultPit变量用于记录当前拖拽物所在的坑，当拖拽物离开坑时，我们需要将其设置为null。

```
private PitGrid _currentDefaultPit;


private void BindableObject_OnPropertyChanged(object sender, PropertyChangedEventArgs e)
{
    if (e.PropertyName == nameof(Width))
    {
        this.DefaultPanContainer.PositionX = (this.PitContentLayout.Width - (sender as Grid).Width) / 2;
    }
    else if (e.PropertyName == nameof(Height))
    {
        this.DefaultPanContainer.PositionY = (this.PitContentLayout.Height - (sender as Grid).Height) / 2;

    }
    else if (e.PropertyName == nameof(TranslationX))
    {
        var centerX = 0.0;
        if (_currentDefaultPit != null)
        {
            centerX = _currentDefaultPit.X + _currentDefaultPit.Width / 2;
        }
        this.MainStickyPan.OffsetX = this.DefaultPanContainer.Content.TranslationX + this.DefaultPanContainer.Content.Width / 2 - centerX;

    }
}

```
如下动图说明了目标坑变化时的效果，当拖拽物离开“刷新”时，粘滞效果的目标坑转移到了“新建标签页”上，接近“新建标签页”时产生对它的粘滞效果


![在这里插入图片描述](644861-20230528175319603-117155047.gif)


### 其它细节

在拖拽物之于坑的状态改变时，显示或隐藏拖拽物本身以及提示文本

```
private void PanActionHandler(object recipient, PanActionArgs args)
{
    switch (args.PanType)
    {
        case PanType.Out:
            tipLabel = args.CurrentPit?.Children.LastOrDefault() as Label;
            if (tipLabel!=null)
            {
                tipLabel.FadeTo(0);
            }
            break;
        case PanType.In:
            tipLabel = args.CurrentPit?.Children.LastOrDefault() as Label;
            if (tipLabel!=null)
            {
                tipLabel.FadeTo(1);
            }
            break;
        case PanType.Over:
            tipLabel.FadeTo(0);
            ShowLayout(0);
            break;
        case PanType.Start:
            ShowLayout();
            break;
    }
    _currentDefaultPit = args.CurrentPit;

}

private void ShowLayout(double opacity = 1)
{
    var length = opacity==1 ? 250 : 0;
    this.DefaultPanContainer.FadeTo(opacity, (uint)length);
}


```


最终效果如下：


![在这里插入图片描述](644861-20230528175319814-1419373995.gif)
新闻类标签交互部分与Chrome下拉标签页交互类似，此篇将不展开讲解。
最终效果如下：
![在这里插入图片描述](644861-20230528175319782-872601435.gif)

## 项目地址

[Github:maui-samples](https://github.com/jevonsflash/maui-samples)
