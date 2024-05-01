---
thumbnail: images/dfe745e8dd82437ebd4ea9ca1579eb0e.png
title: '[MAUI]集成富文本编辑器Editor.js至.NET MAUI Blazor项目'
excerpt: >-
  其它的工具插件可以单独获取。在OnAfterRenderAsync中调用初始化函数，并订阅OnSubmitting和OnInited事件，以便在提交事件触发时保存，以及文本状态变更时重新渲染。在wwwroot创建editorjs_index.html文件，并在body中引入editorjs.umd.js和各插件js文件。我们先要获取web应用的资源文件（js，css等），以便MAUI的视图呈现标准的Web
  UI。在script代码段中，创建LoadContent函数，用于加载EditorJs的初始内容。
tags:
  - Xamarin
  - [.NET]
  - MAUI
  - [.NET blazor]
categories:
  - [.NET MAUI]
  - [.NET]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2024-04-13 23:52:00/[MAUI]集成富文本编辑器Editor.js至.NET MAUI Blazor项目.html'
abbrlink: '33414209'
date: 2024-04-13 23:52:00
cover:
description:
---
<!-- toc -->
[Editor.js](https://github.com/codex-team/editor.js) 是一个基于 Web 的所见即所得富文本编辑器，它由CodeX团队开发。之前写过一篇博文专门介绍过这个编辑器，可以回看：[开源好用的所见即所得(WYSIWYG)编辑器：Editor.js](https://www.cnblogs.com/jevonsflash/p/18066803)。

.NET MAUI Blazor允许使用 Web UI 生成跨平台本机应用。 组件在 .NET 进程中以本机方式运行，并使用本地互操作通道将 Web UI 呈现到嵌入式 Web 视图控件（BlazorWebView）。

这次我们将Editor.js集成到.NET MAUI应用中。并实现只读切换，明/暗主题切换等功能。


![在这里插入图片描述](644861-20240413234916602-1058318088.png)


使用[.NET MAUI](https://dotnet.microsoft.com/en-us/apps/maui)实现跨平台支持，本项目可运行于Android、iOS平台。

## 获取资源

我们先要获取web应用的资源文件（js，css等），以便MAUI的视图呈现标准的Web UI。有两种方式可以获取：

1. 从源码构建
2. 从CDN获取


### 从源码构建

此方法需要首先安装nodejs

克隆Editorjs项目到本地
```
git clone https://github.com/codex-team/editor.js.git
```

运行

```
npm i
```
以及 
```
npm run build
```
等待nodejs构建完成，在项目根目录找到`dist/editorjs.umd.js`这个就是我们需要的js文件

![在这里插入图片描述](644861-20240413234916736-614390157.png)

### 从CDN获取

从官方CDN获取：
```
https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest
```

### 获取扩展插件

Editor.js中的每个块都由插件提供。有简单的外部脚本，有自己的逻辑。默认Editor.js项目中已包含唯一的 Paragraph 块。其它的工具插件可以单独获取。

同样我们可以找到这些插件的源码编译，或通过CDN获取：

1.  [Header](https://github.com/editor-js/header)
2.  [链接](https://github.com/editor-js/link)
3.  [HTML块](https://github.com/editor-js/raw)
4.  [简单图片](https://github.com/editor-js/simple-image)（无后端要求）
5.  [图片](https://github.com/editor-js/image)
6.  [清单](https://github.com/editor-js/checklist)
7.  [列表](https://github.com/editor-js/list)
8.  [嵌入](https://github.com/editor-js/embed)
9.  [引用](https://github.com/editor-js/quote)




## 创建项目
新建.NET MAUI Blazor项目，命名`Editorjs`


将editorjs.umd.js和各插件js文件拷贝至项目根目录下`wwwroot`文件夹，文件结构如下：

![在这里插入图片描述](644861-20240413234916407-1091926010.png)

在wwwroot创建editorjs_index.html文件，并在body中引入editorjs.umd.js和各插件js文件

```
<body>
    ...
    <script src="lib/editorjs/editorjs.umd.js"></script>
    <script src="lib/editorjs/tools/checklist@latest.js"></script>
    <script src="lib/editorjs/tools/code@latest.js"></script>
    <script src="lib/editorjs/tools/delimiter@latest.js"></script>
    <script src="lib/editorjs/tools/embed@latest.js"></script>
    <script src="lib/editorjs/tools/header@latest.js"></script>
    <script src="lib/editorjs/tools/image@latest.js"></script>
    <script src="lib/editorjs/tools/inline-code@latest.js"></script>
    <script src="lib/editorjs/tools/link@latest.js"></script>
    <script src="lib/editorjs/tools/nested-list@latest.js"></script>
    <script src="lib/editorjs/tools/marker@latest.js"></script>
    <script src="lib/editorjs/tools/quote@latest.js"></script>
    <script src="lib/editorjs/tools/table@latest.js"></script>
</body>
```


### 创建控件

创建 EditNotePage.xaml ，EditNotePage类作为视图控件，继承于ContentView，EditNotePage.xaml的完整代码如下：

```
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:mato="clr-namespace:Editorjs;assembly=Editorjs"
             xmlns:service="clr-namespace:Editorjs.ViewModels;assembly=Editorjs"
             xmlns:xct="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             x:Name="MainPage"
             x:Class="Editorjs.Controls.EditNotePage">
    <Grid BackgroundColor="{AppThemeBinding Light={StaticResource LightPageBackgroundColor}, Dark={StaticResource DarkPageBackgroundColor}}"
          RowDefinitions="Auto, *, Auto"
          Padding="20, 10, 20, 0">
        <Grid Grid.Row="0"
              Margin="0, 0, 0, 10">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="auto"></ColumnDefinition>
                <ColumnDefinition></ColumnDefinition>
                <ColumnDefinition></ColumnDefinition>
            </Grid.ColumnDefinitions>

            <Entry Grid.Column="1"
                   Placeholder="请输入标题"
                   Margin="10, 0, 0, 0"
                   VerticalOptions="Center"
                   Text="{Binding Title}"
>
            </Entry>


            <HorizontalStackLayout Grid.Column="2"
                                   HeightRequest="60"
                                   VerticalOptions="Center"
                                   HorizontalOptions="End"
                                   Margin="0, 0, 10, 0">
                <StackLayout RadioButtonGroup.GroupName="State"
                             RadioButtonGroup.SelectedValue="{Binding NoteSegmentState,Mode=TwoWay}"
                             Orientation="Horizontal">
                    <RadioButton Value="{x:Static service:NoteSegmentState.Edit}"
                                 Content="编辑">

                    </RadioButton>
                    <RadioButton Value="{x:Static service:NoteSegmentState.PreView}"
                                 Content="预览">

                    </RadioButton>


                </StackLayout>

            </HorizontalStackLayout>


        </Grid>

        <BlazorWebView Grid.Row="1"
                       Margin="-10, 0"
                       x:Name="mainMapBlazorWebView"
                       HostPage="wwwroot/editorjs_index.html">
            <BlazorWebView.RootComponents>
                <RootComponent Selector="#app"
                               x:Name="rootComponent"
                               ComponentType="{x:Type mato:EditorjsPage}" />
            </BlazorWebView.RootComponents>
        </BlazorWebView>


        <ActivityIndicator Grid.RowSpan="4"
                           IsRunning="{Binding Loading}"></ActivityIndicator>
    </Grid>
</ContentView>

```

创建一个`EditNotePageViewModel`的ViewModel类，用于处理页面逻辑。代码如下：

```
public class EditNotePageViewModel : ObservableObject, IEditorViewModel
{
    public Func<Task<string>> OnSubmitting { get; set; }
    public Action<string> OnInited { get; set; }
    public Action OnFocus { get; set; }

    public EditNotePageViewModel()
    {
        Submit = new Command(SubmitAction);

        NoteSegmentState=NoteSegmentState.Edit;
        var content = "";
        using (Stream stream = Assembly.GetExecutingAssembly().GetManifestResourceStream("Editorjs.Assets.sample1.json"))
        {
            if (stream != null)
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    content = reader.ReadToEnd();                     
                }
            }
        }
        Init(new Note()
        {
            Title = "sample",
            Content=content

        });
    }

    private void Init(Note note)
    {
        if (note != null)
        {
            Title = note.Title;
            Content = note.Content;
        }
        OnInited?.Invoke(this.Content);
    }


    private string _title;

    public string Title
    {
        get { return _title; }
        set
        {
            _title = value;
            OnPropertyChanged();
        }
    }

    
    private string _content;

    public string Content
    {
        get { return _content; }
        set
        {
            _content = value;
            OnPropertyChanged();
        }
    }


    
    private async void SubmitAction(object obj)
    {
        var savedContent = await OnSubmitting?.Invoke();
        if (string.IsNullOrEmpty(savedContent))
        {
            return;
        }
        this.Content=savedContent;

        var note = new Note();
        note.Title = this.Title;
        note.Content = this.Content;
    }
    public Command Submit { get; set; }

}

```


注意这里的Init方法，用于初始化内容。这里我们读取`Editorjs.Assets.sample1.json`资源文件作为初始内容。


![在这里插入图片描述](644861-20240413234916774-1859480474.png)


### 创建Blazor组件

创建Blazor页面`EditorjsPage.razor`

在`EditorjsPage.razor`页面中，我们放置一个`div`，用于放置编辑器，

razor页面的 `@Code` 代码段中，放置EditNotePageViewModel属性，以及一个`DotNetObjectReference`对象，用于在JS中调用C#方法。

```
@code {
    [Parameter]
    public IEditorViewModel EditNotePageViewModel { get; set; }
    private DotNetObjectReference<EditorjsPage> objRef;


    protected override void OnInitialized()
    {
        objRef = DotNetObjectReference.Create(this);
    }

```





### 初始化

在script代码段中，创建LoadContent函数，用于加载EditorJs的初始内容。


```
<div class="ce-main">
    <div id="editorjs"></div>
</div>

```

LoadContent中，调用函数`window.editor = new window.EditorJS(config)`创建一个EditorJS对象，其中config对象包括holder，tools，data等属性，关于EditorJs配置的更多说明请参考[官方文档](https://editorjs.io/configuration)


```
<script type="text/javascript">
    window.editor = null;
    window.viewService = {
        LoadContent: function (content) {
            var obj = JSON.parse(content);
            var createEdtor = () => {
                window.editor = new window.EditorJS({                 
                    holder: 'editorjs',

                    /**
                     * Tools list
                     */
                    tools: {
                        paragraph: {
                            config: {
                                placeholder: "Enter something"
                            }
                        },

                        header: {
                            class: Header,
                            inlineToolbar: ['link'],
                            config: {
                                placeholder: 'Header'
                            },
                            shortcut: 'CMD+SHIFT+H'
                        },

                        /**
                         * Or pass class directly without any configuration
                         */
                        image: {
                            class: ImageTool
                        },

                        list: {
                            class: NestedList,
                            inlineToolbar: true,
                            shortcut: 'CMD+SHIFT+L'
                        },

                        checklist: {
                            class: Checklist,
                            inlineToolbar: true,
                        },

                        quote: {
                            class: Quote,
                            inlineToolbar: true,
                            config: {
                                quotePlaceholder: '输入引用内容',
                                captionPlaceholder: '引用标题',
                            },
                            shortcut: 'CMD+SHIFT+O'
                        },


                        marker: {
                            class: Marker,
                            shortcut: 'CMD+SHIFT+M'
                        },

                        code: {
                            class: CodeTool,
                            shortcut: 'CMD+SHIFT+C'
                        },

                        delimiter: Delimiter,

                        inlineCode: {
                            class: InlineCode,
                            shortcut: 'CMD+SHIFT+C'
                        },

                        linkTool: LinkTool,

                        embed: Embed,

                        table: {
                            class: Table,
                            inlineToolbar: true,
                            shortcut: 'CMD+ALT+T'
                        },

                    },
                  
                    i18n: {
                        messages: {
                            "ui": {
                                "blockTunes": {
                                    "toggler": {
                                        "Click to tune": "点击转换",
                                        "or drag to move": "拖动调整"
                                    },
                                },
                                "inlineToolbar": {
                                    "converter": {
                                        "Convert to": "转换成"
                                    }
                                },
                                "toolbar": {
                                    "toolbox": {
                                        "Add": "添加",
                                        "Filter": "过滤",
                                        "Nothing found": "无内容"
                                    },
                                    "popover": {
                                        "Filter": "过滤",
                                        "Nothing found": "无内容"
                                    }
                                }
                            },
                            "toolNames": {
                                "Text": "段落",
                                "Heading": "标题",
                                "List": "列表",
                                "Warning": "警告",
                                "Checklist": "清单",
                                "Quote": "引用",
                                "Code": "代码",
                                "Delimiter": "分割线",
                                "Raw HTML": "HTML片段",
                                "Table": "表格",
                                "Link": "链接",
                                "Marker": "突出显示",
                                "Bold": "加粗",
                                "Italic": "倾斜",
                                "InlineCode": "代码片段",
                                "Image": "图片"
                            },
                            "tools": {
                                "link": {
                                    "Add a link": "添加链接"
                                },
                                "stub": {
                                    'The block can not be displayed correctly.': '该模块不能放置在这里'
                                },
                                "image": {
                                    "Caption": "图片说明",
                                    "Select an Image": "选择图片",
                                    "With border": "添加边框",
                                    "Stretch image": "拉伸图像",
                                    "With background": "添加背景",
                                },
                                "code": {
                                    "Enter a code": "输入代码",
                                },
                                "linkTool": {
                                    "Link": "请输入链接地址",
                                    "Couldn't fetch the link data": "获取链接数据失败",
                                    "Couldn't get this link data, try the other one": "该链接不能访问，请修改",
                                    "Wrong response format from the server": "错误响应",
                                },
                                "header": {
                                    "Header": "标题",
                                    "Heading 1": "一级标题",
                                    "Heading 2": "二级标题",
                                    "Heading 3": "三级标题",
                                    "Heading 4": "四级标题",
                                    "Heading 5": "五级标题",
                                    "Heading 6": "六级标题",
                                },
                                "paragraph": {
                                    "Enter something": "请输入笔记内容",
                                },
                                "list": {
                                    "Ordered": "有序列表",
                                    "Unordered": "无序列表",
                                },
                                "table": {
                                    "Heading": "标题",
                                    "Add column to left": "在左侧插入列",
                                    "Add column to right": "在右侧插入列",
                                    "Delete column": "删除列",
                                    "Add row above": "在上方插入行",
                                    "Add row below": "在下方插入行",
                                    "Delete row": "删除行",
                                    "With headings": "有标题",
                                    "Without headings": "无标题",
                                },
                                "quote": {
                                    "Align Left": "左对齐",
                                    "Align Center": "居中对齐",
                                }
                            },
                            "blockTunes": {
                                "delete": {
                                    "Delete": "删除",
                                    'Click to delete': "点击删除"
                                },
                                "moveUp": {
                                    "Move up": "向上移"
                                },
                                "moveDown": {
                                    "Move down": "向下移"
                                },
                                "filter": {
                                    "Filter": "过滤"
                                }
                            },
                        }
                    },

                    /**
                     * Initial Editor data
                     */
                    data: obj
                });

            }
            if (window.editor) {
                editor.isReady.then(() => {
                    editor.destroy();
                    createEdtor();
                });
            }
            else {
                createEdtor();
            }

        },
        DumpContent: async function () {
            outputData = null;
            if (window.editor) {
                if (window.editor.readOnly.isEnabled) {
                    await window.editor.readOnly.toggle();
                }
                var outputObj = await window.editor.save();
                outputData = JSON.stringify(outputObj);
            }
            return outputData;
        },
        SwitchTheme: function () {
            document.body.classList.toggle("dark-mode");
        },

        SwitchState: async function () {
            state = null;
            if (window.editor && window.editor.readOnly) {
                var readOnlyState = await window.editor.readOnly.toggle();
                state = readOnlyState;
            }
            return state;
        },

        Focus: async function (atEnd) {
            if (window.editor) {
                await window.editor.focus(atEnd);
            }
        },

        GetState() {
            if (window.editor && window.editor.readOnly) {
                return window.editor.readOnly.isEnabled;
            }
        },


        Destroy: function () {
            if (window.editor) {
                window.editor.destroy();
            }
        },

    }

    window.initObjRef = function (objRef) {
        window.objRef = objRef;
    }

</script>

```

![在这里插入图片描述](644861-20240413234916929-1626054557.gif)


### 保存

创建转存函数DumpContent
```
DumpContent: async function () {
    outputData = null;
    if (window.editor) {
        if (window.editor.readOnly.isEnabled) {
            await window.editor.readOnly.toggle();
        }
        var outputObj = await window.editor.save();
        outputData = JSON.stringify(outputObj);
    }
    return outputData;
},

```

### 销毁

创建销毁函数Destroy

```

Destroy: function () {
    if (window.editor) {
        window.editor.destroy();
    }
},
```


### 编写渲染逻辑


在OnAfterRenderAsync中调用初始化函数，并订阅OnSubmitting和OnInited事件，以便在提交事件触发时保存，以及文本状态变更时重新渲染。

```
 protected override async Task OnAfterRenderAsync(bool firstRender)
 {
     if (!firstRender)
         return;
     if (EditNotePageViewModel != null)
     {
         EditNotePageViewModel.PropertyChanged += EditNotePageViewModel_PropertyChanged;
         this.EditNotePageViewModel.OnSubmitting += OnSubmitting;
         this.EditNotePageViewModel.OnInited += OnInited;
         var currentContent = EditNotePageViewModel.Content;

         await JSRuntime.InvokeVoidAsync("viewService.LoadContent", currentContent);
     }

     await JSRuntime.InvokeVoidAsync("window.initObjRef", this.objRef);

 }
```


```
private async Task<string> OnSubmitting()
{
    var savedContent = await JSRuntime.InvokeAsync<string>("viewService.DumpContent");
    return savedContent;
}



private async void OnInited(string content)
{
    await JSRuntime.InvokeVoidAsync("viewService.LoadContent", content);
}
```

![在这里插入图片描述](644861-20240413234916557-1949357908.gif)


## 实现只读/编辑功能

在.NET本机中，我们使用枚举来表示编辑状态。 并在控件上设置一个按钮来切换编辑状态。


```
public enum NoteSegmentState
{
    Edit,
    PreView
}
```
EditNotePageViewModel.cs:
```
...
private NoteSegmentState _noteSegmentState;

    public NoteSegmentState NoteSegmentState
    {
        get { return _noteSegmentState; }
        set
        {
            _noteSegmentState = value;
            OnPropertyChanged();

        }
    }

```

EditNotePage.xaml:

```
...
<StackLayout RadioButtonGroup.GroupName="State"
             RadioButtonGroup.SelectedValue="{Binding NoteSegmentState,Mode=TwoWay}"
             Orientation="Horizontal">
    <RadioButton Value="{x:Static service:NoteSegmentState.Edit}"
                 Content="编辑">

    </RadioButton>
    <RadioButton Value="{x:Static service:NoteSegmentState.PreView}"
                 Content="预览">

    </RadioButton>


</StackLayout>
```

Editorjs官方提供了readOnly对象，通过toggle()方法，可以切换编辑模式和只读模式。

在创建Editorjs实例时，也可以通过设置readOnly属性为true即可实现只读模式。




### 切换模式

在razor页面中创建SwitchState函数，用来切换编辑模式和只读模式。
```
SwitchState: async function () {
    state = null;
    if (window.editor && window.editor.readOnly) {
        var readOnlyState = await window.editor.readOnly.toggle();
        state = readOnlyState;
    }
    return state;
},

```

### 获取只读模式状态

在razor页面中创建GetState函数，用来获取编辑模式和只读模式的状态。
```

GetState() {
    if (window.editor && window.editor.readOnly) {
        return window.editor.readOnly.isEnabled;
    }
},


```

### 响应切换事件

我们监听EditNotePageViewModel 的NoteSegmentState属性变更事件，当状态改变时，调用对应的js方法

```
private async void EditNotePageViewModel_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
{
    if (e.PropertyName == nameof(EditNotePageViewModel.NoteSegmentState))
    {
        if (EditNotePageViewModel.NoteSegmentState==NoteSegmentState.PreView)
        {
            var state = await JSRuntime.InvokeAsync<bool>("viewService.GetState");
            if (!state)
            {
                await JSRuntime.InvokeAsync<bool>("viewService.SwitchState");

            }

        }
        else if (EditNotePageViewModel.NoteSegmentState==NoteSegmentState.Edit)
        {
            var state = await JSRuntime.InvokeAsync<bool>("viewService.GetState");
            if (state)
            {
                await JSRuntime.InvokeAsync<bool>("viewService.SwitchState");
            }
        }
    }
}

```
![在这里插入图片描述](644861-20240413234916807-164856559.gif)


## 实现明/暗主题切换

lib/editorjs/css/main.css中，定义了`.dark-mode`类的样式表

```
.dark-mode {
--color-border-light: rgba(255, 255, 255,.08);
--color-bg-main: #212121;
--color-text-main: #F5F5F5;
}

.dark-mode .ce-popover {
    --color-background: #424242;
    --color-text-primary: #F5F5F5;
    --color-text-secondary: #707684;
    --color-border: #424242;
}

.dark-mode .ce-toolbar__settings-btn {
    background: #2A2A2A;
    border: 1px solid #424242;
}

.dark-mode .ce-toolbar__plus {
    background: #2A2A2A;
    border: 1px solid #424242;
}

.dark-mode .ce-popover-item__icon {
    background: #2A2A2A;
}

.dark-mode .ce-code__textarea {
    color: #212121;
    background: #2A2A2A;
}

.dark-mode .tc-popover {
    --color-border: #424242;
    --color-background: #424242;
}
.dark-mode .tc-wrap {
    --color-background: #424242;
}

```

在razor页面中添加SwitchTheme函数，用于用于切换`dark-mode`"的`类名，从而实现暗黑模式和正常模式之间的切换。

```
SwitchTheme: function () {
    document.body.classList.toggle("dark-mode");
},
```

在`OnInitializedAsync`中，订阅`Application.Current.RequestedThemeChanged`事件，用于监听主题切换事件，并调用`SwitchTheme`函数。

```
protected override async Task OnInitializedAsync()
{
    objRef = DotNetObjectReference.Create(this);

    Application.Current.RequestedThemeChanged += OnRequestedThemeChanged;

}
private async void OnRequestedThemeChanged(object sender, AppThemeChangedEventArgs args)
{
    await JSRuntime.InvokeVoidAsync("viewService.SwitchTheme");
}
```

在渲染页面时，也判断是否需要切换主题

```
protected override async Task OnAfterRenderAsync(bool firstRender)
{
    if (!firstRender)
        return;
    ···
    if (Application.Current.UserAppTheme==AppTheme.Dark)
    {
        await JSRuntime.InvokeVoidAsync("viewService.SwitchTheme");

    }

}

```

![在这里插入图片描述](644861-20240413234916933-1949011365.gif)

## 项目地址

[Github:maui-samples](https://github.com/jevonsflash/maui-samples)
