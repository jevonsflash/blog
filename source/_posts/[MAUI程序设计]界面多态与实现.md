---
thumbnail: images/19c5371d9cc54100a30683dc869f1a6a.png
title: '[MAUI程序设计]界面多态与实现'
excerpt: >-
  首先用控件模板定义博客条目的外观，“博客条目”是包含博客标题，内容，以及发布时间等信息的卡片，视觉上呈现圆角矩形的白色不透明卡片效果。博客条目控件是一个基于ContentView控件在页面的资源中，添加如下两个ControlTemplate模板，分别用于手机设备和桌面设备。BlogCardViewPhone用于博客条目在手机设备中的呈现，条目菜单侧滑栏方式展开，我们配置SwipeView控件，作为卡片，用一个Frame框架包裹其内容。
tags:
  - Xamarin
  - MAUI
  - XAML
  - 产品设计
  - App
categories:
  - [.NET MAUI]
  - 产品设计
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-05-14 17:47:00/[MAUI程序设计]界面多态与实现.html'
abbrlink: bc3927eb
date: 2023-05-14 17:47:00
cover:
description:
---
<!-- toc -->
.NET MAUI 实现界面多态有很多种方式，今天主要来说说在日常开发中常见的需求该如何应对。
## 需求一：在不同设备上使用不同 UI 外观

.NET MAUI是一个跨平台的UI框架，可在一个项目中开发Android、iOS、Windows、MacOS等多个平台的应用。在不同设备上我们希望应用的界面或交互方式能够有所不同。

比如在本示例中，我们希望博客条目的菜单使用平台特性的交互方式以方便触屏或鼠标的操作：比如手机设备中博客条目的菜单使用侧滑方式呈现，而在桌面设备中使用右键菜单呈现。

要实现不同平台下的控件外观，我们可以定义一个ContentView控件，然后在不同平台上使用不同的**控件模板（ControlTemplate）**。

控件模板（ControlTemplate）是我们的老朋友了，早在WPF时代就已经出现了，它可以完全改变一个控件的可视结构和外观，与使用Style改变控件外观样式和行为样式不同，使用Style只能改变控件已有的属性。

### 定义控件 UI 外观

首先用控件模板定义博客条目的外观，“博客条目”是包含博客标题，内容，以及发布时间等信息的卡片，视觉上呈现圆角矩形的白色不透明卡片效果。

博客条目控件是一个基于ContentView控件

```
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:service="clr-namespace:Lession1.Models;assembly=Lession1"
             x:Class="Lession1.Views.TextBlogView">
    <Grid>
       <VerticalStackLayout>
            <Label Text="{Binding Title}" FontAttributes="Bold">
            </Label>
            <Label Text="{Binding Content}"
                   LineBreakMode="WordWrap"></Label>
        </VerticalStackLayout>
    </Grid>
</ContentView>
```
在页面的资源中，添加如下两个ControlTemplate模板，分别用于手机设备和桌面设备。


1. BlogCardViewPhone用于博客条目在手机设备中的呈现，条目菜单侧滑栏方式展开，我们配置SwipeView控件，作为卡片，用一个Frame框架包裹其内容。设置卡片的阴影，圆角，以及内边距。

![在这里插入图片描述](644861-20230514174411501-283775291.png)

![在这里插入图片描述](644861-20230514174411544-1669754459.png)

代码如下

```
<ControlTemplate x:Key="BlogCardViewPhone">
    <Grid>
        <SwipeView>
            <SwipeView.LeftItems>
                <SwipeItems>
                    <SwipeItem Text="编辑"
                                IconImageSource="delete.png"
                                BackgroundColor="LightGray" />
                    <SwipeItem Text="分享"
                                IconImageSource="delete.png"
                                BackgroundColor="LightGray" />
                    <SwipeItem Text="删除"
                                IconImageSource="delete.png"
                                BackgroundColor="Red" />

                </SwipeItems>
            </SwipeView.LeftItems>
            <Frame  HasShadow="True"
                    Margin="0,10,0,10"
                    CornerRadius="5"
                    Padding="8">
                <VerticalStackLayout>
                    <ContentPresenter />
                    <Label Text="{TemplateBinding BindingContext.PostTime}"
                            FontFamily="FontAwesome"></Label>
                    <Button Text="编辑/发布"
                            Command="{TemplateBinding BindingContext.SwitchState}" />
                </VerticalStackLayout>
            </Frame>
        </SwipeView>
    </Grid>
</ControlTemplate>
```

2. BlogCardViewDesktop用于博客条目在桌面设备中的呈现，条目菜单右键菜单方式展开，我们配置FlyoutBase.ContextFlyout属性，作为卡片，用一个Frame框架包裹其内容。设置卡片的阴影，圆角，以及内边距。

![在这里插入图片描述](644861-20230514174411467-39057155.png)


代码如下：
```
<ControlTemplate x:Key="BlogCardViewDesktop">
    <Frame HasShadow="True"
            Margin="0,10,0,10"
            CornerRadius="5"
            Padding="8">
        <FlyoutBase.ContextFlyout>
            <MenuFlyout>
                <MenuFlyoutItem Text="编辑" />
                <MenuFlyoutItem Text="分享" />
                <MenuFlyoutItem Text="删除" />
            </MenuFlyout>
        </FlyoutBase.ContextFlyout>

        <VerticalStackLayout>
            <ContentPresenter  />
            <Label Text="{TemplateBinding BindingContext.PostTime}"
                    FontFamily="FontAwesome"></Label>
            <Button Text="编辑/发布"
                    Command="{TemplateBinding BindingContext.SwitchState}" />
        </VerticalStackLayout>
    </Frame>

</ControlTemplate>

```


.NET MAUI 提供了ContentPresenter作为模板控件中的内容占位符，用于标记模板化自定义控件或模板化页面要显示的内容将在何处显示。
 
各平台模板中的`<ContentPresenter  />` 将显示控件的Content属性，也就是将TextBlogView中定义的内容，放到ContentPresenter处。

```
<view:TextBlogView ControlTemplate="{StaticResource BlogCardViewPhone}">
</view:TextBlogView>
```

### 基于平台自定义配置

.NET MAUI 提供了 OnPlatform 标记扩展和 OnIdiom 标记扩展。以便在不同平台上使用不同的控件模板。

通过 OnPlatform 标记扩展可基于每个平台控件属性：

| 属性 | 描述 |
| --- | --- |
|Default |  平台的属性的默认值。|
|Android| 属性在 Android 上应用的值。|
|iOS | 属性在 iOS 上应用的值。|
|MacCatalyst| 设置为要在 Mac Catalyst 的值。|
|Tizen | 属性在 Tizen 平台的值。|
|WinUI | 属性在 WinUI 的值。|

通过  OnIdiom  标记扩展可基于设备语义上的控件属性

| 属性 | 描述 |
| --- | --- |
|Default  |设备语义的属性的默认值。 |
|Phone |属性在手机上应用的值。 |
|Tablet |属性在平板电脑的值。 |
|Desktop|设置为要在桌面平台的值。 |
|TV |属性在电视平台的值。 |
|Watch |属性在可穿戴设备（手表）平台的值。 |

在本示例中，我们使用OnIdiom标记扩展，分别为手机和桌面设备配置不同的模板。

```
<view:TextBlogView>
    <view:TextBlogView.ControlTemplate>
        <OnIdiom Phone="{StaticResource BlogCardViewPhone}"
                    Desktop="{StaticResource BlogCardViewDesktop}">
        </OnIdiom>
    </view:TextBlogView.ControlTemplate>
</view:TextBlogView>
```




## 需求二：在不同数据类别中使用不同的 UI 外观

**数据模板（DataTemplate）** 可以在支持的控件上（如：CollectionView）定义数据表示形式
可以使用**数据模板选择器（DataTemplateSelector）** 来实现更加灵活的模板选择。

DataTemplateSelector 可用于在运行时根据数据绑定属性的值来选择 DataTemplate。 这样可将多个 DataTemplate 应用于同一类型的对象，以自定义特定对象的外观。

相对于ControlTemplate方式，DataTemplateSelector是从Xamarin.Forms 2.1引入的新特性。


### 定义视图 UI 外观

创建两种视图和模板选择器：

![在这里插入图片描述](644861-20230514174411369-1401131221.png)




* TextBlog: 文本博客
* PhotoBlog: 图片博客



编写文本博客条目展示标题和内容，创建TextBlogView.xaml，定义如下：
```
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:service="clr-namespace:Lession1.Models;assembly=Lession1"
             x:Class="Lession1.Views.TextBlogView">
    <Grid>
       <VerticalStackLayout>
            <Label Text="{Binding Title}" FontAttributes="Bold">
            </Label>
            <Label Text="{Binding Content}"
                   LineBreakMode="WordWrap"></Label>
        </VerticalStackLayout>
    </Grid>
</ContentView>
```

编写图片博客条目展示标题和博客中图片的缩略图，创建PhotoBlogView.xaml，定义如下：

```
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:service="clr-namespace:Lession1.Models;assembly=Lession1"
             x:Class="Lession1.Views.PhotoBlogView">
    <Grid>
        <Label Text="{Binding Title}"
                FontAttributes="Bold">
        </Label>
        <StackLayout BindableLayout.ItemsSource="{Binding Images}"
                        Orientation="Horizontal">
            <BindableLayout.ItemTemplate>
                <DataTemplate>
                    <Image Source="{Binding}"
                            Aspect="AspectFill"
                            WidthRequest="44"
                            HeightRequest="44" />
                </DataTemplate>
            </BindableLayout.ItemTemplate>
        </StackLayout>
    </Grid>
</ContentView>
```


![在这里插入图片描述](644861-20230514174411452-449672158.png)



### 创建数据模板

在页面的资源中，添加各个视图创建数据模板（DataTemplate）类型的资源。

```
<ContentPage.Resources>
    <DataTemplate x:Key="PhotoBlog">
        <view:PhotoBlogView>
            <view:PhotoBlogView.ControlTemplate>
                <OnIdiom Phone="{StaticResource BlogCardViewPhone}"
                            Tablet="{StaticResource BlogCardViewDesktop}"
                            Desktop="{StaticResource BlogCardViewDesktop}">
                </OnIdiom>
            </view:PhotoBlogView.ControlTemplate>
        </view:PhotoBlogView>
    </DataTemplate>
    <DataTemplate x:Key="TextBlog">
        <view:TextBlogView>
            <view:TextBlogView.ControlTemplate>

                <OnIdiom Phone="{StaticResource BlogCardViewPhone}"
                            Tablet="{StaticResource BlogCardViewDesktop}"
                            Desktop="{StaticResource BlogCardViewDesktop}">
                </OnIdiom>

            </view:TextBlogView.ControlTemplate>
        </view:TextBlogView>
    </DataTemplate>
  
</ContentPage.Resources>

```


### 创建选择器

创建BlogDataTemplateSelector,根据博客的类型，返回不同的数据模板（DataTemplate）对象。

```
public class BlogDataTemplateSelector : DataTemplateSelector
{
    public object ResourcesContainer { get; set; }

    protected override DataTemplate OnSelectTemplate(object item, BindableObject container)
    {
        if (item == null)
        {
            return default;
        }
        if (item is Blog)
        {
            var dataTemplateName = (item as Blog).Type;
            if (dataTemplateName == null) { return default; }
            if (ResourcesContainer == null)
            {
                return Application.Current.Resources[dataTemplateName] as DataTemplate;
            }
            return (ResourcesContainer as VisualElement).Resources[dataTemplateName] as DataTemplate;

        }
        return default;

    }
}

```
DataTemplate将在页面资源字典中被创建。若没有绑定ResourcesContainer，则在App.xaml中寻找。

同样， 将BlogDataTemplateSelector添加到页面的资源中
```
  <view:BlogDataTemplateSelector x:Key="BlogDataTemplateSelector"
ResourcesContainer="{x:Reference MainContentPage}" />
```

注意，此时BlogDataTemplateSelector.ResourcesContainer指向MainContentPage，显式设置MainPage对象的名称：`x:Name="MainContentPage"`


### 定义数据

我们定义一个Blog类， 用于表示博客条目，包含标题，内容，发布时间，图片等属性。


```
public class Blog 
{
    public Blog()
    {
        PostTime = DateTime.Now;
        State = BlogState.Edit;
    }

    
    public Guid NoteId { get; set; }
    public string Title { get; set; }
    public string Type { get; set; }
    public BlogState State { get; set; }
    public string Content { get; set; }
    public List<string> Images { get; set; }
    public DateTime PostTime { get; set; }
    public bool IsHidden { get; set; }
}
```


定义博客列表的绑定数据源 `ObservableCollection<Blog> Blogs`，给数据源初始化一些数据，用于测试。

```
private async void CreateBlogAction(object obj)
{
    var type = obj as string;
    if (type == "TextBlog")
    {
        var blog = new Blog()
        {
            NoteId = Guid.NewGuid(),
            Title = type + " Blog",
            Type = type,
            Content = type + " Blog Test, There are so many little details that a software developer must take care of before publishing an application. One of the most time-consuming is the task of adding icons to your toolbars, buttons, menus, headers, footers and so on.",
            State = BlogState.PreView,
            IsHidden = false,

        };
        this.Blogs.Add(blog);

    }
    else if (type == "PhotoBlog")
    {
        var blog = new Blog()
        {
            NoteId = Guid.NewGuid(),
            Title = type + " Blog",
            Type = type,
            Content = type + " Blog Test",
            Images = new List<string>() { "p1.png", "p2.png", "p3.png", "p4.png" },
            State = BlogState.PreView,
            IsHidden = false,
        };
        this.Blogs.Add(blog);
    }
}

```
设置博客列表控件CollectionView绑定的数据源为Blogs，并设置数据模板选择器为BlogDataTemplateSelector

```
<ContentPage.Content>
    <Grid Margin="10">
        <Grid.RowDefinitions>
            <RowDefinition Height="auto" />
            <RowDefinition Height="1*" />
        </Grid.RowDefinitions>
        <!--标题区域-->
        <Label Text="My Blog"
                TextColor="SlateGray"
                FontSize="Header"
                FontAttributes="Bold"></Label>
        <CollectionView x:Name="MainCollectionView"
                        Grid.Row="1"
                        ItemsSource="{Binding Blogs}"
                        ItemTemplate="{StaticResource BlogDataTemplateSelector}" />


    </Grid>
</ContentPage.Content>
```
则列表中的每个博客条目将根据博客类型，使用不同的数据模板进行渲染。

效果如下：

![在这里插入图片描述](644861-20230514174411564-911349019.png)


## 需求三：在不同数据状态中使用不同的 UI 外观

此功能没有一个固定的解决方案，可以根据实际情况，选择合适的方式实现。

比如在本项目中，博客存在编辑和发布两个状态

```
public enum BlogState
{
    Edit,
    PreView
}

```
### 使用绑定模型更改控件的外观

最简单的方式是用IsVisible来控制控件中元素的显示和隐藏。

在本示例中，TextBlogView需要对编辑中的状态和预览中的状态进行区分。
EnumToBoolConverter是枚举到bool值的转换器，它返回当前绑定对象的State属性与指定的BlogState枚举项是否一致，详情请查看  [ .NET MAUI 社区工具包](https://learn.microsoft.com/zh-cn/dotnet/communitytoolkit/maui/converters/enum-to-bool-converter)

```
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:service="clr-namespace:Lession1.Models;assembly=Lession1"
             x:Class="Lession1.Views.TextBlogView">
    <Grid>
        <VerticalStackLayout IsVisible="{Binding State, Converter={StaticResource EnumToBoolConverter}, ConverterParameter={x:Static service:BlogState.PreView}}">
            <Label Text="{Binding Title}" FontAttributes="Bold">
            </Label>
            <Label Text="{Binding Content}"
                   LineBreakMode="WordWrap"></Label>
        </VerticalStackLayout>

        <VerticalStackLayout IsVisible="{Binding State, Converter={StaticResource EnumToBoolConverter}, ConverterParameter={x:Static service:BlogState.Edit}}">
            <Label Text="编辑"
                   FontAttributes="Bold">
            </Label>
            <Entry Text="{Binding Title}"
                   Placeholder="标题"></Entry>
            <Editor Text="{Binding Content}"
                    AutoSize="TextChanges"
                    Placeholder="内容"></Editor>
        </VerticalStackLayout>
    </Grid>

</ContentView>
```


编辑状态：

![在这里插入图片描述](644861-20230514174411503-2034689792.png)


发布状态：


![在这里插入图片描述](644861-20230514174411586-1315075091.png)


### 使用视觉状态更改控件的外观

还可以使用定义自定义视觉状态对界面进行控制。

在本示例中，使用VisualStateManager定义了两个视觉状态，分别对应Label的编辑状态和发布状态，当State属性的值发生变化时，会触发对应的视觉状态。

```
<Label Grid.Row="1">
    <VisualStateManager.VisualStateGroups>
        <VisualStateGroup>
            <VisualState Name="BlogPreView">
                <VisualState.StateTriggers>
                    <StateTrigger
                                    IsActive="{Binding State, Converter={StaticResource EnumToBoolConverter}, ConverterParameter={x:Static service:BlogState.PreView}}" />
                </VisualState.StateTriggers>
                <VisualState.Setters>
                    <Setter Property="Text"
                            Value="当前为发布模式" />

                </VisualState.Setters>
            </VisualState>
            <VisualState Name="BlogEdit">
                <VisualState.StateTriggers>
                    <StateTrigger IsActive="{Binding State, Converter={StaticResource EnumToBoolConverter}, ConverterParameter={x:Static service:BlogState.Edit}}" />
                </VisualState.StateTriggers>
                <VisualState.Setters>
                    <Setter Property="Text"
                            Value="当前为编辑模式" />

                </VisualState.Setters>
            </VisualState>
        </VisualStateGroup>
    </VisualStateManager.VisualStateGroups>

</Label>

```


编辑状态：


![在这里插入图片描述](644861-20230514174411571-2120346248.png)


发布状态：

![在这里插入图片描述](644861-20230514174411565-645125352.png)



## 项目地址

[Github:maui-learning](https://github.com/jevonsflash/maui-learning)


关注我，学习更多.NET MAUI开发知识！