---
thumbnail: images/96e2b23ab5954f0fa1a40269a01239e7.png
title: 开源好用的所见即所得(WYSIWYG)编辑器：Editor.js
excerpt: >-
  varaiables.css中包含了大部分的样式变量，更改这些变量可以实现自定义样式。如通过重写 .root样式选择器可以实现自定义的背景色,
  重写.ce-popover 改变弹出框样式等。:root {– 完 –
tags:
  - Html
  - JavaScript
  - 所见即所得
  - 编辑器
categories:
  - JavaScript
  - [Web]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2024-03-11 18:42:00/开源好用的所见即所得(WYSIWYG)编辑器：Editor.js.html'
abbrlink: d2c2fe0c
date: 2024-03-11 18:42:00
cover:
description:
---
<!-- toc -->
今天介绍一个开源好用的Web所见即所得(WYSIWYG)编辑器：[Editor.js](https://editorjs.io/)


Editor.js 是一个基于 Web 的所见即所得富文本编辑器，它由CodeX团队开发。源代码托管于Github：https://github.com/codex-team/editor.js

# 特点
它有两个显著的特点，一个是基于区块（block-styled）的编辑模式，另一个是可以输出干净的数据。

## 基于区块
基于区块官网是这样解释的：

Editor.js工作区由单独的区块组成：段落、标题、图像、列表、引号等。它们中的每一个都是由 Plugin 提供的独立元素（或更复杂的结构）并由 Editor's Core 连结。


## 干净的数据

Editor.js 输出干净的json数据而不是 HTML 标记，虽然对浏览器来说，HTML 是更直观的，但对服务器来说，json更精简更关注内容本身，易于重复使用，存储和传输。

对于控件本身也更易于实现，比如在文本“加粗”和“常规”来回切换，基于json的更改一个属性，总要比基于HTML反复添加和删除标记<b></b>更简单吧？


# 界面与交互

在编辑区域，Editor.js提供了区块工具栏(Block Tools)，内联工具栏(Inline Tools)和区块编辑栏(Block Tunes)

![在这里插入图片描述](644861-20240311183835243-1698435099.png)


他们分别通过 加号 + 按钮，选中区块内容和菜单（六个点和尚按钮）来访问

![在这里插入图片描述](644861-20240311183834849-1679611241.png)




## 插件

每个区块都通过插件提供支持，官方提供了常用的插件，当然也可以自己写插件。

官方提供的插件如下图，在sample中，都以cdn方式引入了这些插件，也可以通过npm安装。

![在这里插入图片描述](644861-20240311183834680-1621207662.png)


## 标题和文本

![在这里插入图片描述](644861-20240311183835067-1224582905.png)

序列化后的数据如下图所示，

```
{
    "id" : "zcKCF1S7X8",
    "type" : "header",
    "data" : {
        "text" : "Editor.js",
        "level" : 1
    }
},
{
    "id" : "b6ji-DvaKb",
    "type" : "paragraph",
    "data" : {
        "text" : "支持文本，标题，列表，代办，表格，图片，链接，代码片段，引用片段等等"
    }
},
```


![在这里插入图片描述](644861-20240311183834783-1126835894.png)

```
{
    "id" : "SSBSguGvP7",
    "type" : "list",
    "data" : {
        "style" : "ordered",
        "items" : [
            {
                "content" : "支持普通文本，<i>斜体文本</i>，<b>加粗</b>",
                "items" : []
            },
            {
                "content" : "支持<mark class=\"cdx-marker\">文本高亮</mark>、<a href=\"https://baidu.com\">文本链接</a>、<code class=\"inline-code\">代码片段</code><mark class=\"cdx-marker\"></mark>",
                "items" : []
            }
        ]
    }
},
```

## 图片

图片支持Base64编码，和url两种方式上传图片

![在这里插入图片描述](644861-20240311183835054-850366715.png)

```
{
    "id" : "VYsWoLL7yj",
    "type" : "image",
    "data" : {
        "url" : "data:image/png;base64, ...",
        "caption" : "codex2x.png",
        "withBorder" : false,
        "withBackground" : false,
        "stretched" : false
    }
}
```


## 列表

支持有序和无序列表，列表支持嵌套

![在这里插入图片描述](644861-20240311183835026-478742518.png)

无序列表：
```
{
            "id" : "i_cVQxn3Tb",
            "type" : "list",
            "data" : {
                "style" : "unordered",
                "items" : [
                    {
                        "content" : " 香蕉",
                        "items" : []
                    },
                    {
                        "content" : " 苹果",
                        "items" : []
                    },
                    {
                        "content" : " 葡萄  ",
                        "items" : []
                    }
                ]
            }
        },
```
有序列表：
```
        {
            "id" : "nOTdryosj2",
            "type" : "list",
            "data" : {
                "style" : "ordered",
                "items" : [
                    {
                        "content" : "洗手心",
                        "items" : []
                    },
                    {
                        "content" : "搓手背",
                        "items" : []
                    },
                    {
                        "content" : "洗指缝",
                        "items" : []
                    }
                ]
            }
        },
```
嵌套列表：
```
        {
            "id" : "LJjzlmGa-3",
            "type" : "list",
            "data" : {
                "style" : "unordered",
                "items" : [
                    {
                        "content" : "序章",
                        "items" : []
                    },
                    {
                        "content" : "第一章",
                        "items" : [
                            {
                                "content" : "第一节",
                                "items" : [
                                    {
                                        "content" : "a)",
                                        "items" : []
                                    },
                                    {
                                        "content" : "b)",
                                        "items" : []
                                    },
                                    {
                                        "content" : "c)",
                                        "items" : []
                                    }
                                ]
                            },
                            {
                                "content" : "第二节",
                                "items" : []
                            }
                        ]
                    }
                ]
            }
        },
```

## Todo

![在这里插入图片描述](644861-20240311183834606-87249695.png)

```
{
            "id" : "Hitrs4RqXw",
            "type" : "checklist",
            "data" : {
                "items" : [
                    {
                        "text" : "满意",
                        "checked" : true
                    },
                    {
                        "text" : "一般",
                        "checked" : false
                    },
                    {
                        "text" : "不满意☹️",
                        "checked" : false
                    }
                ]
            }
        },
```

## 表格

![在这里插入图片描述](644861-20240311183834966-1834621903.png)



不代表头：
```
{
    "id" : "xPAQ6AkUiK",
    "type" : "paragraph",
    "data" : {
        "text" : "<b>不带表头</b>"
    }
},
{
    "id" : "_MMoOqlgXs",
    "type" : "table",
    "data" : {
        "withHeadings" : false,
        "content" : [
            [
                "<b>重要紧急</b>",
                "<b>重要不紧急</b>"
            ],
            [
                "吃饭睡觉",
                "订生日蛋糕"
            ],
            [
                "<b>不重要但紧急</b>",
                "<b>不重要不紧急</b>"
            ],
            [
                "上班前定好闹钟",
                "总结这一周的工作"
            ]
        ]
    }
},

```
带表头：
```
{
    "id" : "fvfQSljMK8",
    "type" : "table",
    "data" : {
        "withHeadings" : true,
        "content" : [
            [
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五"
            ],
            [
                "a",
                "b",
                "c",
                "d",
                "e"
            ]
        ]
    }
},
```

# 使用

## 安装

页面中引用Editor.js Core库，可通过npm安装。也可以编译[项目](https://github.com/codex-team/editor.js/releases/tag/v2.29.1)，然后引入编译后的js文件。

```
yarn add @editorjs/editorjs
```

或

```
<script src="lib/editorjs/editorjs.umd.js"></script>

```

## 创建编辑器实例


在页面创建编辑器

```

import EditorJS from '@editorjs/editorjs';


const editor = new EditorJS({
  /**
   * Id of Element that should contain Editor instance
   */
  holder: 'editorjs'
});
```

这是一个最小化的示例。你会发现没有那些默认的工具。因此需要在配置中指定工具。

## 配置工具

可以通过传入配置对象创建编辑器实例。以下是示例



![在这里插入图片描述](644861-20240311183834644-815870536.png)


holder指定编辑器的容器元素。

```

window.editor = new window.EditorJS({
    /**
        * Wrapper of Editor
        */
    holder: 'editorjs',

```

配置工具

配置完成后，区块工具栏将呈现一个较为完整的工具列表。


```
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
        image: ImageTool,

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
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author',
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
    

    /**
        * Initial Editor data
        */
    data: obj,
    onReady: function () {
        saveButton.click();
    },
});
```



## 本地化

可以通过传入`i18n`配置对象来设置编辑器的本地化。以下是一个较为完整的中文化示例：

```

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
                "Heading 2": "二级标题",
                "Heading 3": "三级标题",
                "Heading 4": "四级标题",
                "Heading 5": "五级标题",
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
}
```

## 自定义样式

varaiables.css中包含了大部分的样式变量，更改这些变量可以实现自定义样式。

![在这里插入图片描述](644861-20240311183835113-453894703.png)


如通过重写 .root样式选择器可以实现自定义的背景色, 重写.ce-popover 改变弹出框样式等。

```
:root {
    --color-bg-main: #F0F0F0;
    --color-border-light: #E8E8EB;
    --color-text-main: #000;
    --selectionColor: #e1f2ff;
}


.ce-popover {
    --border-radius: 6px;
    --width: 200px;
    --max-height: 270px;
    --padding: 6px;
    --offset-from-target: 8px;
    --color-border: #e8e8eb;
    --color-shadow: rgba(13,20,33,0.13);
    --color-background: white;
    --color-text-primary: black;
    --color-text-secondary: #707684;
    --color-border-icon: rgb(201 201 204 / 48%);
    --color-border-icon-disabled: #EFF0F1;
    --color-text-icon-active: #388AE5;
    --color-background-icon-active: rgba(56, 138, 229, 0.1);
    --color-background-item-focus: rgba(34, 186, 255, 0.08);
    --color-shadow-item-focus: rgba(7, 161, 227, 0.08);
    --color-background-item-hover: #eff2f5;
    --color-background-item-confirm: #E24A4A;
    --color-background-item-confirm-hover: #CE4343;
}
.dark-mode {
  --color-border-light: rgba(255, 255, 255,.08);
  --color-bg-main: #1c1e24;
  --color-text-main: #737886;
}
```



![在这里插入图片描述](644861-20240311183834687-232428504.png)


![在这里插入图片描述](644861-20240311183835160-941826674.png)
-- 完 --