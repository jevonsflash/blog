---
thumbnail: images/f61a73c6332249e5bbacafce341792c9.png
title: '[MAUI]模仿iOS多任务切换卡片滑动的交互实现'
excerpt: >-
  App之间的多任务切换相信你们都很熟悉。苹果设备从iOS9开始使用水平排列的叠层卡片来展现多任务，这个设计利用屏幕深度（z方向）和水平空间（x轴方向）的平顺结合，在有限的屏幕空间内，展现了更多的卡片，滑动屏幕时，每一个卡片在屏幕中央的时候也能得到大面积的展示。今天我们在.NET
  MAUI 中实现这个优秀交互效果。
tags:
  - Xamarin
  - MAUI
  - 产品设计
  - Android
  - 跨平台
categories:
  - [.NET MAUI]
  - 产品设计
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-05-02 21:48:00/[MAUI]模仿iOS多任务切换卡片滑动的交互实现.html'
abbrlink: 8b1226dc
date: 2023-05-02 21:48:00
cover:
description:
---
<!-- toc -->
看了上一篇博文的评论，大家对MAUI还是比较感兴趣的，非常感谢大家的关注，这个专栏我争取周更。

App之间的多任务切换相信你们都很熟悉。苹果设备从iOS9开始使用水平排列的叠层卡片来展现多任务

> ![在这里插入图片描述](644861-20230502214528720-151476704.gif)
> 动图来自iPhone 使用手册 - 在 iPhone 上的应用之间切换

这个设计利用屏幕深度（z方向）和水平空间（x轴方向）的平顺结合，在有限的屏幕空间内，展现了更多的卡片，滑动屏幕时，每一个卡片在屏幕中央的时候也能得到大面积的展示。

今天我们在[.NET MAUI](https://learn.microsoft.com/zh-cn/dotnet/maui/fundamentals/gestures/pan?view=net-maui-7.0)中实现这个优秀交互效果
 ，最终效果如下：

![在这里插入图片描述](644861-20230502214528578-165920705.gif)




使用[.NET MAU](https://dotnet.microsoft.com/en-us/apps/maui)实现跨平台支持，本项目可运行于Android、iOS平台。

## 原理


使用过的App将以屏幕截图的卡片方式展现，卡片从右到左依次排列，最近使用的app卡片将靠前，并叠层在其他久未使用的app卡片之上。

平铺分布

平铺分布是经典的卡片布局，它的卡片分部是均匀的

![在这里插入图片描述](644861-20230502214528340-531819264.png)


在有限的屏幕宽度内呈现6张卡片，叠层放置后每张卡片可显示部分的宽度为屏幕宽度的1/6

卡片在屏幕横轴的位置与其偏移量是一个线性关系，如下图：

![在这里插入图片描述](644861-20230502214528337-15738949.png)



iOS多任务卡片分布

在iOS多任务卡片的布局中，卡片在屏幕范围内的布局由左向右的密度依次降低：

![在这里插入图片描述](644861-20230502214528203-937368681.png)


它的布局位置是由4段二阶贝塞尔曲线拼接成的完整曲线函数计算而来的。

二阶贝塞尔曲线，可以通过三个点，来确定一条平滑的曲线。详情请参考[这里](https://baike.baidu.com/item/%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF)


卡片在屏幕横轴的位置与其偏移量如下图：

![在这里插入图片描述](644861-20230502214528323-1684978270.png)


同样是在页面上从左至右呈现6张卡片。利用贝塞尔曲线函数的特性，编号靠前的卡片（1,2,3）的偏移量“滞后”，编号靠后的卡片（4,5,6）的偏移量“追赶”，这样保证了编号靠后的卡片（较新的App任务）布局密度降低，从而有更大面积的展示。

![在这里插入图片描述](644861-20230502214528399-1265943498.png)



计算每一个卡片的偏移量，卡片的大小随偏移量成正比，效果如下图：

![在这里插入图片描述](644861-20230502214528322-664245179.gif)



接下来我们用几张App截图代替颜色交替的卡片并赋予其动效。

## 创建布局

新建.NET MAUI项目，命名`MultitaskingCardList`。将界面图片资源文件拷贝到项目\Resources\Images中并将他们包含在MauiImage资源清单中。
```
<MauiImage Include="Resources\Images\*" />
```
在MainPage.xaml中，创建一个横向StackLayout作为App后台任务卡片容器，我们将使用绑定集合的方式，将App后台任务添加到这个容器中。

代码如下：

```
<StackLayout Orientation="Horizontal"
    BindingContextChanged="BoxLayout_BindingContextChanged"
    x:Name="BoxLayout"
    BindableLayout.ItemsSource="{Binding AppTombStones}">
```
它的DataTemplate代表一个App后台任务，使用Grid布局，App的截图与名称分别位于Grid的第二行和第一行。

```
<BindableLayout.ItemTemplate>
    <DataTemplate>
        <Grid Style="{StaticResource BoxFrameStyle}" >
            <Grid.RowDefinitions>
                <RowDefinition Height="auto"></RowDefinition>
                <RowDefinition></RowDefinition>
            </Grid.RowDefinitions>
            <Label Margin="25,0,0,0" TranslationY="30"  Text="{Binding AppName}" VerticalOptions="End"></Label>
            <Image  Aspect="AspectFill"
                    Grid.Row="1"
                    HeightRequest="550"
                    WidthRequest="250"
                    Source="{Binding AppScreen}">           
            </Image>

        </Grid>
    </DataTemplate>
</BindableLayout.ItemTemplate>
```

对卡片Grid的样式进行定义：

宽度300，高度550，左边距-220，这使得屏幕区域范围内有大概5-6个卡片可见。
```
<ContentPage.Resources>
    <Style TargetType="Grid"
            x:Key="BoxFrameStyle">

        <Setter Property="WidthRequest"
                Value="300"></Setter>
        <Setter Property="Margin"
                Value="0,0,-220,0"></Setter>
        <Setter Property="AnchorX"
                Value="0"></Setter>
    </Style>
</ContentPage.Resources>
```

效果如下：

![在这里插入图片描述](644861-20230502214528491-526330436.png)


## 创建分布函数

为了快速映射位置与偏移量，我们在页面加载时计算出贝塞尔函数曲线上的离散点


二阶贝塞尔曲线由三个点确定，分别是：
起始点、终止点（也称锚点）、控制点

BezierSegments对象将描述4段连续的，首尾相连的二阶贝塞尔曲线

在MainPage.xaml.cs中订阅页面加载完毕事件PageLoaded，在事件方法中编写代码如下：

```
var p0 = new Point(0, 1);
var p1 = new Point(0.1, 0.9988);
var p2 = new Point(0.175, 0.9955);


var p3 = new Point(0.4, 0.99);
var p4 = new Point(0.575, 0.92);
var p5 = new Point(0.7, 0.88);

var p6 = new Point(0.775, 0.71);
var p7 = new Point(0.9, 0.4);
var p8 = new Point(1, 0);

this.BezierSegments = new Point[][] {

    new Point[]{p0,p1,p2},
    new Point[]{p2,p3,p4},
    new Point[]{p4,p5,p6},
    new Point[]{p6,p7,p8}
};
```
bezeirPointSubdivs,标示贝塞尔曲线上点的数量，值越大，曲线越平滑，但计算量也越大，这里取999
```
var bezeirPointSubdivs = 999;
```
根据二阶贝塞尔函数式：


![在这里插入图片描述](644861-20230502214528431-213552061.png)




将点坐标带入表达式，则可以得出输入输出值之间的映射关系，代码如下：

X轴坐标
```
var bezeirPointX = Math.Pow(1 - (double)j / bezeirPointSubdivs, 2) * BezierSegments[i][0].X + 2 * (double)j / bezeirPointSubdivs * (1 - (double)j / bezeirPointSubdivs) * BezierSegments[i][1].X + Math.Pow((double)j / bezeirPointSubdivs, 2) * BezierSegments[i][2].X;

```

Y轴坐标：
```
var bezeirPointY = Math.Pow(1 - (double)j / bezeirPointSubdivs, 2) * BezierSegments[i][0].Y + 2 * (double)j / bezeirPointSubdivs * (1 - (double)j / bezeirPointSubdivs) * BezierSegments[i][1].Y + Math.Pow((double)j / bezeirPointSubdivs, 2) * BezierSegments[i][2].Y;

```

对每一段的贝塞尔曲线计算，拟合出一条完整曲线
计算而得的离散点存入`BezeirPoints`，代码如下：

```
for (int i = 0; i < this.BezierSegments.Length; i++)
    {
        for (int j = 0; j < bezeirPointSubdivs; j++)
        {
            var bezeirPointX = Math.Pow(1 - (double)j / bezeirPointSubdivs, 2) * BezierSegments[i][0].X + 2 * (double)j / bezeirPointSubdivs * (1 - (double)j / bezeirPointSubdivs) * BezierSegments[i][1].X + Math.Pow((double)j / bezeirPointSubdivs, 2) * BezierSegments[i][2].X;
            var bezeirPointY = Math.Pow(1 - (double)j / bezeirPointSubdivs, 2) * BezierSegments[i][0].Y + 2 * (double)j / bezeirPointSubdivs * (1 - (double)j / bezeirPointSubdivs) * BezierSegments[i][1].Y + Math.Pow((double)j / bezeirPointSubdivs, 2) * BezierSegments[i][2].Y;
            BezeirPoints.Add(new Point(bezeirPointX, bezeirPointY));

        }
    }
```
我们使用线性插值法(linear interpolation)，计算平移手势进度，卡片的分布偏移量以及大小等值。

线性插值法是指使用连接两个已知量的直线来确定在这两个已知量之间的一个未知量的值的方法。具体请参考[这里](https://wiki.mbalib.com/wiki/%E7%BA%BF%E6%80%A7%E6%8F%92%E5%80%BC%E6%B3%95)

![在这里插入图片描述](644861-20230502214528371-1369707238.jpg)


假设我们已知坐标(x0,y0)与(x1,y1),要得到[x0,x1]区间内某一位置x在直线上的值。根据图中所示，我们得到两点式直线方程


![在这里插入图片描述](644861-20230502214528428-598099398.png)



创建调制方法Modulate，代码如下

```
public double Modulate(double value, double[] source, double[] target)
{
    if (source.Length != 2 || target.Length != 2)
    {
        throw new ArgumentOutOfRangeException();
    }

    var start = source[0];
    var end = source[1];
    var targetStart = target[0];
    var targetEnd = target[1];
    if (value < start || value > end)
    {
        return value;
    }
    var k = (value - start) / (end - start);
    var result = k * (targetEnd - targetStart) + targetStart;
    return result;
}
```

## 创建动效


我们将为App后台任务容器创建平移手势，实现各个卡片的滚动动效，当用户指尖在屏幕水平方向上滑动时，卡片内容也应该随之横向滚动。


原本的实现方式是控件自监听平移(Pan)事件，通过x轴方向的平移偏移量，计算卡片容器中各个卡片的偏移量，从而实现卡片滚动动效。但平移过后的惯性滑动要自行计算，滑动手感不够流畅，最终效果并不理想，因此改用MAUI的[ScrollView控件](https://learn.microsoft.com/zh-cn/dotnet/maui/user-interface/controls/scrollview?view=net-maui-7.0)作为滚动框架

因此滚动行为（滚动阻尼，滚动惯性等）由各平台的原生代码实现。


```
<ScrollView x:Name="MainScroller"
    Background="Transparent"
    Orientation="Horizontal"
    Scrolled="ScrollView_Scrolled">

    <!--App后台任务卡片容器-->
    <StackLayout>...</StackLayout>


</ScrollView> 
```

效果如下：

![在这里插入图片描述](644861-20230502214528617-1393854723.gif)


创建RenderTransform方法，实现卡片的平移，缩放，透明度等动效。
relativeOffsetX为卡片去除了滚动的影响，相对于屏幕的X方向位置。即相位置

通过遍历BoxLayout中的各卡片相对位置计算进度值progress

再通过调制方法Modulate，计算卡片的缩放，透明度，偏移量等值。

```
private void RenderTransform(double scrollX)
{
    var layoutWidth = this.MainLayout.DesiredSize.Width;
    if (this.BezeirPoints == null)
    {
        return;
    }
    foreach (var item in this.BoxLayout.Children)
    {
        if (item is VisualElement)
        {
            var relativeOffsetX = (item as VisualElement).X-scrollX;
            var progress = this.Modulate(relativeOffsetX, new double[] { 0, layoutWidth }, new double[] { 0, 1 });
            (item as VisualElement).ScaleTo(Modulate(progress, new double[] { 0, 1 }, new double[] { 0.72, 0.84 }), 0);
            (item as VisualElement).FadeTo(Modulate(progress, new double[] { 0.2, 0.54 }, new double[] { 0, 1 }), 0);
            var modulatedX = Modulate(1 - GetMappingY(progress), new double[] { 0, 1 }, new double[] { 0, layoutWidth });
            var offsetX = modulatedX - relativeOffsetX;
            (item as VisualElement).TranslateTo(offsetX, 0, 0);
        }
    }
}

```

静态效果如下：

![在这里插入图片描述](644861-20230502214528444-684561099.png)


RenderTransform方法的形参scrollX为滚动框架的滚动偏移量，即MainScroller.ScrollX。

订阅滚动事件Scrolled，在事件方法中调用RenderTransform。代码如下：

```
private void ScrollView_Scrolled(object sender, ScrolledEventArgs e)
{
    RenderTransform(e.ScrollX);
}
```


## 创建绑定数据

创建MainPageViewModel.cs，用于界面绑定数据源。

AppTombStone描述App进入后台时的状态（墓碑机制）
```
public class AppTombStone
{
    public AppTombStone() { }

    public string AppName { get; set; }
    public string AppScreen { get; set; }
    public double TestOffset { get; set; }
}
```

在MainPageViewModel构造函数中，初始化AppTombStone列表，代码如下：

```csharp
public class MainPageViewModel : INotifyPropertyChanged
{
    public MainPageViewModel()
    {
        var list = new List<AppTombStone>
        {
            new AppTombStone() { AppName="Edge", AppScreen= "p1.png",TestOffset=0},
            new AppTombStone() { AppName="Map", AppScreen= "p2.png",TestOffset=-10 },
            new AppTombStone() { AppName="Photo", AppScreen= "p3.png",TestOffset=-70 },
            new AppTombStone() { AppName="App Store", AppScreen= "p4.png" ,TestOffset=-90},
            new AppTombStone() { AppName="Calculator", AppScreen= "p5.png",TestOffset=-70 },
            new AppTombStone() { AppName="Music", AppScreen= "p6.png" ,TestOffset=-30},
            new AppTombStone() { AppName="File", AppScreen= "p7.png" },
            new AppTombStone() { AppName="Note", AppScreen= "p8.png" },
            new AppTombStone() { AppName="Paint", AppScreen= "p9.png" },
            new AppTombStone() { AppName="Weather", AppScreen= "p10.png" },
            new AppTombStone() { AppName="Chrome", AppScreen= "p11.png" },
            new AppTombStone() { AppName="Book", AppScreen= "p12.png" },
            new AppTombStone() { AppName="Browser", AppScreen= "p13.png" }
        };

        AppTombStones = new ObservableCollection<AppTombStone>(list);
    }
```



## 细节调整


### 首张卡片的处理

这里遇到个问题，当滚动框架滚动到最左侧时，最下方的卡片会被叠层上方的卡片覆盖，如下图所示：

![在这里插入图片描述](644861-20230502214528467-1549333564.png)


当滚动框架滚动到最左侧时，我们希望首张卡片不被上方的卡片覆盖，那么它至少应当滚动到屏幕的中部，因此需要加一个虚拟的BoxView将首张卡前的空间“撑起来”。

![在这里插入图片描述](644861-20230502214528748-1032018662.gif)


订阅BoxView的BindingContextChanged事件，在事件方法中添加如下代码
```
private void BoxLayout_BindingContextChanged(object sender, EventArgs e)
    {
        this.BoxLayout.Children.Insert(0, new BoxView()
        {
            WidthRequest=300,
            HeightRequest=500,
            BackgroundColor=Colors.Red
        });
    }
```

效果：

![在这里插入图片描述](644861-20230502214528436-1503387327.png)



### 为卡片添加裁剪

使用Image.Clip和Image.Shadow属性，为卡片添加圆角裁剪和阴影效果。

```
<Image  Aspect="AspectFill"
        Grid.Row="1"
        HeightRequest="550"
        WidthRequest="250"
        Source="{Binding AppScreen}">
    <Image.Clip>
        <RoundRectangleGeometry
            CornerRadius="20"
            Rect="0,20,250,480">
        </RoundRectangleGeometry>
    </Image.Clip>
    <Image.Shadow>
        <Shadow Brush="Black"
                Radius="40"
                Offset="-20,0"
                Opacity="0.3" />
    </Image.Shadow>
</Image>
```

### 跳转到最后一张卡片

App后台任务是从右到左排列的，因此在App启动时，需要将滚动框架滚动到最后一张卡片，代码如下：

```csharp
private async void ContentPage_SizeChanged(object sender, EventArgs e)
{
    var layoutWidth = this.MainLayout.DesiredSize.Width;

    var scrollY = this.MainScroller.ScrollY;
    var posX = this.MainScroller.ContentSize.Width-layoutWidth;
    await this.MainScroller.ScrollToAsync(posX, scrollY, false).ContinueWith((t) =>
    {
        RenderTransform(this.MainScroller.ScrollX);
    });

}
```
最终效果：

![在这里插入图片描述](644861-20230502214529013-192197505.gif)

## 项目地址

[Github:maui-samples](https://github.com/jevonsflash/maui-samples)
