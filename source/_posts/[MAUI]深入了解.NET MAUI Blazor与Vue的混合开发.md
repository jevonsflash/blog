---
thumbnail: images/33f05fd0973645679fb354020c369e59.png
title: '[MAUI]深入了解.NET MAUI Blazor与Vue的混合开发'
excerpt: >-
  每个BlazorWebView控件包含根组件（RootComponent）定义，ComponentType是在应用程序启动时加载页面时的类型，该类型需要继承自Microsoft.AspNetCore.Components.IComponent，由于我们的导航是由MAUI处理的，因此我们不需要使用Blazor路由，直接使用Razor组件。开发应用需要一个独立的host项目。中引入，还有一种是使用并置的js文件，这种方式是所谓的"CodeBehind"，因为更利于组织代码，这里我们使用并置的js文件。
tags:
  - Xamarin
  - [.NET]
  - MAUI
  - Vue
categories:
  - [.NET]
  - [.NET MAUI]
  - [移动开发]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-10-18 17:15:00/[MAUI]深入了解.NET MAUI Blazor与Vue的混合开发.html'
abbrlink: 6d63c941
date: 2023-10-18 17:15:00
cover:
description:
---
<!-- toc -->
.NET MAUI结合Vue的混合开发可以使用更加熟悉的Vue的语法代替Blazor语法，你现有项目不必重写。之前写过一篇[[MAUI] 在.NET MAUI中结合Vue实现混合开发](https://www.cnblogs.com/jevonsflash/p/15806237.html) ，其中介绍了如何创建一个vue应用并将其打包至MAUI项目，这种方式依赖vue-cli创建和打包静态站点，好处是可以使用Node.js 的构建但MAUI仅仅作为容器。开发应用需要一个独立的host项目

这次用集成的方式。将vue作为MAUI的一部分，这样就可以在MAUI项目中直接使用vue了。

![在这里插入图片描述](644861-20231018171330510-1106940016.gif)

## Vue在混合开发中的特点

首先要说的是，Vue框架是渐进性的，所谓渐进性，就是Vue不会强求你使用所有的框架特性，你可以根据需要逐步使用。

同样地，element-ui也可以通过引入样式和组件库，配合Vue使用

因此我们不需要Vue Router、Vuex、Vue CLI、单文件组件这些高级特性，仅仅引入Vue.js即可使用Vue模板语法。我们将利用Blazor引擎的如下功能：


* 组件化开发
* 静态资源管理
* js代码的注入
* js调用C#代码
* C#调用js代码

由.NET MAUI提供的功能：
* 路由管理
* 状态管理

由Vue提供模板语法，事件处理，计算属性/侦听器等，以及Element-UI提供交互组件。

## 创建MAUI项目

创建一个MAUI项目，这里使用的是Visual Studio 2022 17.7.3，创建一个Blazor MAUI App项目命名`MAUI-Vue-Hybriddev-Integrated`，选择Android和iOS作为目标平台，选择.NET 7.0作为目标框架。

![在这里插入图片描述](644861-20231018171330515-1026754162.png)



从[Vue官网](https://v2.cn.vuejs.org/v2/guide/installation.html)下载最新的Vue.js



![在这里插入图片描述](644861-20231018171330544-206665017.png)


将其放置在`wwwroot`目录下，然后在`index.html`中引入
![在这里插入图片描述](644861-20231018171330467-1446524008.png)


```html
    <script src="lib/vuejs/vue.js"></script>
```

## 创建Vue应用

在Views目录下创建 `HomePage.xaml`作为Vue应用的容器，在页面中创建`<BlazorWebView>`视图元素，并设置`HostPage`为`wwwroot/index.html`，这样就可以在MAUI中使用Vue了。

```xml
<BlazorWebView x:Name="blazorWebView"
               HostPage="wwwroot/index.html">
    <BlazorWebView.RootComponents>
        <RootComponent Selector="#app"
                       x:Name="rootComponent"
                       ComponentType="{x:Type views:HomePageWeb}" />
    </BlazorWebView.RootComponents>
</BlazorWebView>
```

每个BlazorWebView控件包含根组件（RootComponent）定义，ComponentType是在应用程序启动时加载页面时的类型，该类型需要继承自Microsoft.AspNetCore.Components.IComponent，由于我们的导航是由MAUI处理的，因此我们不需要使用Blazor路由，直接使用Razor组件


在Views目录下创建`HomePageWeb.razor`，这是Vue应用页面相当于Vue的单文件组件，这里可以使用Vue的模板语法，而不是Blazor的Razor语法。
![在这里插入图片描述](644861-20231018171330524-1427469414.png)



我们在`HomePageWeb.razor`中写下Vue官方文档中Hello Vue示例代码

```html

<div id="vue-app">
    {{ message }}
</div>


<script type="text/javascript">
    var app = new Vue({
        el: '#vue-app',
        data: {
            message: 'Hello Vue!',
        }
    })

</script>
```

注意：Vue的根元素名称不要跟Blazor的根元素名称相同，否则会报错。

![在这里插入图片描述](644861-20231018171330550-413171490.png)


此时更改JavaScript里的内容，你会发现Blazor页面不会热加载。

> 请勿将 \<script\> 标记置于 Razor 组件文件 (.razor) 中，因为 \<script\> 标记无法由Blazor 动态更新。

于是需要将script部分代码放置在外部，此时有两种方案，一个是放在`wwwroot/js`目录下，然后在`wwwroot/index.html`中引入，还有一种是使用并置的js文件，这种方式是所谓的"CodeBehind"，因为更利于组织代码，这里我们使用并置的js文件。

创建一个`HomePageWeb.razor.js`文件，将script部分代码放置在其中，然后在`HomePageWeb.razor`中引入

![在这里插入图片描述](644861-20231018171330772-790571248.png)


```csharp
protected override async Task OnAfterRenderAsync(bool firstRender)
{

    if (firstRender)
    {
        await JSRuntime.InvokeAsync<IJSObjectReference>("import", "./Views/HomePageWeb.razor.js");
    }
}
```

发布应用后，框架会自动将脚本移动到 Web 根目录。 在此示例中，脚本被移动到./wwwroot/Views/HomePageWeb.razor.js

## 使用element-ui组件库

同样，我们在[element-ui官方CDN](https://unpkg.com/browse/element-ui@2.15.14/)下载样式文件和组件库，首先在`index.html`中引入样式和组件库

```html
<link href="css/app.css" rel="stylesheet" />
...
<script src="lib/element-ui/index.js"></script>
```

然后在`HomePageWeb.razor`中使用组件

```html
<div id="vue-app">
    {{ message }}
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-button @click="showDialog = true">提交</el-button>
    <el-dialog :visible.sync="showDialog" title="消息">
        <p>{{input}}</p>
        <p>提交成功</p>
    </el-dialog>
</div>
```

CodeBehind中引入组件

```
var app = new Vue({
    el: '#vue-app',
    data: {
        message: 'Hello Vue!',
        showDialog: false,
        input: 'text message from vue'
    }
})
```

运行效果如下：

![在这里插入图片描述](644861-20231018171330751-2016984330.png)

![在这里插入图片描述](644861-20231018171330747-1436092221.png)


## JavaScript和原生代码的交互

Blazor组件中的代码可以通过注入IJSRuntime来调用JavaScript代码，JavaScript代码可以通过调用DotNet.invokeMethodAsync来调用C#代码。

### 传递根组件参数

如果被调用的代码位于其他类中，需要给这个Blazor组件传递实例，还记得刚才提及的根组件（RootComponent）吗？我们用它来传递这个实例，称之为根组件参数，详情请查看官方文档 [在 ASP.NET Core Blazor Hybrid 中传递根组件参数](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/hybrid/root-component-parameters)


创建SecondPage.xaml，根据刚才的步骤创建一个BlazorWebView并注入vuejs代码
html部分创建一个el-dialog组件，当消息被接收时，显示对话框


```

@using Microsoft.Maui.Controls
@inject IJSRuntime JSRuntime

<div id="vue-app">
    {{ message }}
    <el-dialog :visible.sync="showDialog" title="Native device msg recived!">
        <p>{{msg}}</p>
    </el-dialog>
</div>

```
在@code代码段中创建SecondPage对象。
```

@code {

    [Parameter]
    public SecondPage SecondPage { get; set; }

    ...
}

```

回到SecondPage.xaml.cs，在构造函数中将自己传递给根组件参数

```csharp
public SecondPage()
{
    InitializeComponent();
    rootComponent.Parameters =
        new Dictionary<string, object>
        {
            { "SecondPage", this }
        };
}


```

### 从设备调用Javascript代码

在SecondPage.xaml中，创建一个Post按钮，点击按钮后将文本框PostContentEntry的内容传递给Vue代码

```
<StackLayout Grid.Row="1">
    <Entry x:Name="PostContentEntry" Text="Hello,this is greetings from native device"></Entry>
    <Button Text="Post To Vue"
            HorizontalOptions="Center"
            VerticalOptions="End"
            HeightRequest="40"
            Clicked="Post_Clicked"></Button>

</StackLayout>
```

![在这里插入图片描述](644861-20231018171330711-107436928.png)

在SecondPage.razor.js中, 创建greet方法，用于接收从原生代码传递过来的参数，并显示在对话框中。



```
window.app = new Vue({
    el: '#vue-app',
    data: {
        message: 'Vue Native interop',
        showDialog: false,
        msg: ''
    },
    methods: {
        greet: function (content) {
            this.msg = content;
            this.showDialog = true;
        }

    },
```

在SecondPage.xaml.cs中，创建一个OnPost事件，当Post按钮被点击时触发该事件


```csharp

public event EventHandler<OnPostEventArgs> OnPost;

private void Post_Clicked(object sender, EventArgs args)
{
    OnPost?.Invoke(this, new OnPostEventArgs(this.PostContentEntry.Text));
}


```


在SecondPage.razor中，订阅OnPost事件，当事件被触发时，调用greet方法，将参数传递给JavaScript代码

```

public async void Recived(object o, OnPostEventArgs args)
{
    await JSRuntime.InvokeAsync<string>("window.app.greet", args.Content);
}

protected override async Task OnAfterRenderAsync(bool firstRender)
{
    try
    {
        if (firstRender)
        {
            SecondPage.OnPost += this.Recived;

            await JSRuntime.InvokeAsync<IJSObjectReference>(
"import", "./Views/SecondPageWeb.razor.js");

        }


    }
    catch (Exception ex)
    {
        Console.WriteLine(ex);
    }

}

```

在页面销毁时，要取消订阅事件，避免内存泄漏。

```csharp

@implements IDisposable

...

public void Dispose()
{
    SecondPage.OnPost -= this.Recived;
}


```

运行效果如下


![在这里插入图片描述](644861-20231018171330822-579125601.gif)


### 从Vue页面调用原生代码

原生代码指的是.NET MAUI平台的C#代码，比如要在设备上显示一个弹窗，需要调用Page.DisplayAlert方法，它隶属于Microsoft.Maui.Controls命名空间，属于MAUI组件库的一部分。

因此需要将MAUI类型的对象通过引用传递给JavaScript调用，调用方式是通过将对象实例包装在 DotNetObjectReference 中传递给JavaScript。使用该对象的invokeMethodAsync从 JS 调用 .NET 实例方法。详情请查看官方文档[ JavaScript 函数调用 .NET 方法](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/javascript-interoperability/call-dotnet-from-javascript?view=aspnetcore-7.0#synchronous-js-interop-in-client-side-components)

在@code代码段中，界面加载时创建DotNetObjectReference对象

```
@code {
    private DotNetObjectReference<SecondPageWeb>? objRef;


    protected override void OnInitialized()
    {
        objRef = DotNetObjectReference.Create(this);
    }

```

页面加载完成时，将DotNetObjectReference对象传递给JavaScript代码

```

protected override async Task OnAfterRenderAsync(bool firstRender)
{
    try
    {
        if (firstRender)
        {
            SecondPage.OnPost += this.Recived;

            await JSRuntime.InvokeAsync<IJSObjectReference>(
"import", "./Views/SecondPageWeb.razor.js");
            await JSRuntime.InvokeAsync<string>("window.initObjRef", this.objRef);

        }


    }
    catch (Exception ex)
    {
        Console.WriteLine(ex);
    }

}
```

```

window.app = new Vue({
    
    ...

    data: {
        ...
        objRef: null
    },
    
})
window.initObjRef = function (objRef) {
    window.app.objRef = objRef;
}

```




在SecondPage.razor中，创建el-input组件和el-button组件，当按钮被点击时，调用Post方法，将文本框的内容传递给原生代码


```
<div id="vue-app">
    {{ message }}
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-button @click="post">Post To Native</el-button>
    <el-dialog :visible.sync="showDialog" title="Native device msg recived!">
        <p>{{msg}}</p>
    </el-dialog>
</div>
```

按钮和对话框的显示逻辑与之前相同，不再赘述。


![在这里插入图片描述](644861-20231018171330741-57461654.png)



在SecondPage.razor中，创建Post方法，方法被调用时，将触发MAUI组件库的原生代码

```
[JSInvokable]
public async Task Post(string content)
{
    await SecondPage.DisplayAlert("Vue msg recived!", content, "Got it!");

}
```

vue绑定的函数中，调用DotNet.invokeMethodAsync将文本框的内容传递给原生代码


```

window.app = new Vue({
    el: '#vue-app',
    data: {
        message: 'Vue Native interop',
        showDialog: false,
        msg: '',
        input: 'Hi, I am a text message from Vue',
        deviceDisplay: null,
        objRef: null
    },
    methods: {
        greet: function (content) {
            this.msg = content;
            this.showDialog = true;
        },
        post: function () {
            this.objRef.invokeMethodAsync('Post', this.input);
        }


    }
})
```

运行效果如下

![在这里插入图片描述](644861-20231018171330776-618855515.gif)


## 读取设备信息

可以使用Vue的watch属性监听数据变化，当MAUI对象加载完成时，调用原生代码，读取设备信息

```
<div id="vue-app">

    ...

    <p>Device Display</p>
    <p>{{deviceDisplay}}</p>
</div>
```

CodeBehind代码如下：
```
watch: {
    objRef: async function (newObjRef, oldObjRef) {
        if (newObjRef) {
            var deviceDisplay = await this.objRef.invokeMethodAsync('ReadDeviceDisplay');
            console.warn(deviceDisplay);
            this.deviceDisplay = deviceDisplay;
        }

    }
},
```

原生代码如下：


```

[JSInvokable]
public async Task<string> ReadDeviceDisplay()
{
    return await Task.FromResult(SecondPage.ReadDeviceDisplay());

}
```

在ReadDeviceDisplay方法中，我们读取设备分辨率、屏幕密度、屏幕方向、屏幕旋转、刷新率等信息

```
public string ReadDeviceDisplay()
{
    System.Text.StringBuilder sb = new System.Text.StringBuilder();

    sb.AppendLine($"Pixel width: {DeviceDisplay.Current.MainDisplayInfo.Width} / Pixel Height: {DeviceDisplay.Current.MainDisplayInfo.Height}");
    sb.AppendLine($"Density: {DeviceDisplay.Current.MainDisplayInfo.Density}");
    sb.AppendLine($"Orientation: {DeviceDisplay.Current.MainDisplayInfo.Orientation}");
    sb.AppendLine($"Rotation: {DeviceDisplay.Current.MainDisplayInfo.Rotation}");
    sb.AppendLine($"Refresh Rate: {DeviceDisplay.Current.MainDisplayInfo.RefreshRate}");

    var text = sb.ToString();
    return text;
}
```

当页面加载时，会在HTML页面上显示设备信息

![在这里插入图片描述](644861-20231018171330789-1140236316.png)
​
## 项目地址
[Github:maui-vue-hybirddev](https://github.com/jevonsflash/maui-vue-hybirddev)

关注我，学习更多.NET MAUI开发知识！


​