---
thumbnail: images/dc0c232b26fa4e34b255b885b27af2dc.png
title: '[VS Code扩展]写一个代码片段管理插件（一）：介绍与界面搭建'
excerpt: >-
  功能，但是创建自定义代码片段时，需要写JSON格式的配置，这些JSON文件在用户文件夹下，没有统一的界面管理，而且对于我来说，制表符补全这样的高级功能并不是必需的。VS
  Code扩展是一个基础功能，通过扩展可以满足软件的所有功能增强，包括内置的核心功能，如文件管理，搜索，Git，调试器，这些都是通过扩展实现的。VS
  Code这些框架的部分，官方称之为“容器”，整个VS
  Code由6个容器组成，分别是：活动栏，主边栏，编辑器，辅边栏，面板，状态栏。常用的项目有侧边栏，编辑器，状态栏，面板上的工具栏区域。
tags:
  - 插件
  - IDE
  - VS Code
categories:
  - JavaScript
  - Web
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2024-08-02 23:20:00/[VS Code扩展]写一个代码片段管理插件（一）：介绍与界面搭建.html'
abbrlink: 948f6f1b
date: 2024-08-02 23:20:00
cover:
description:
---
<!-- toc -->

* [[VS Code扩展]写一个代码片段管理插件（一）：介绍与界面搭建](https://www.cnblogs.com/jevonsflash/p/18339795)
* [[VS Code扩展]写一个代码片段管理插件（二）：功能实现](https://www.cnblogs.com/jevonsflash/p/18373141)

写代码的时候，经常要输入重复的内容，虽然VS Code提供了[代码片段](https://code.visualstudio.com/docs/editor/userdefinedsnippets)功能，但是创建自定义代码片段时，需要写JSON格式的配置，这些JSON文件在用户文件夹下，没有统一的界面管理，而且对于我来说，制表符补全这样的高级功能并不是必需的。

变量映射可以通过内置的映射规则在插入片段时自动生成这些内容。VS Code自带的功能比较单一，我需要一个自定义的变量映射功能，可以自定义Key-Value做为可灵活配置的变量映射。

VS Code提供了一组[API](https://code.visualstudio.com/api/)，用于自定义或增强软件功能，称之为VS Code插件（或扩展）。

我基于上述的考虑，写一个带有变量映射功能代码片段管理VS Code扩展：[SnippetCraft](https://github.com/jevonsflash/snippet-craft)。

![](644861-20240802231835962-2062088570.gif)
## VS Code扩展机制

首先需要大致了解VS Code的扩展机制，VS Code可以看成一个框架，可以想象是你车上的仪表台，比如时速表仪表台，中控大屏，灯光、空调控制等独立面板所在的占位。

![](644861-20240802231835228-1759072190.png)

VS Code这些框架的部分，官方称之为“容器”，整个VS Code由6个容器组成，分别是：活动栏，主边栏，编辑器，辅边栏，面板，状态栏。

![](644861-20240802231835327-161148948.png)


每个容器中，包含扩展提供的按钮，或者视图的区域。类似仪表台控制上的控制面板，比如灯光面板上有灯的开关，有些是预留的槽位。通过增加改装件使用这些预留槽位。

![](644861-20240802231835269-1385732754.png)


这些区域，官方称之为“项目”。常用的项目有侧边栏，编辑器，状态栏，面板上的工具栏区域。扩展可以将项目添加到各种容器中。

![](644861-20240802231835880-507690450.png)


此外，VS Code扩展还提供常用的功能，比如数据持久化，文件选择器，输入框，通知弹窗，网页视图等。

VS Code扩展是一个基础功能，通过扩展可以满足软件的所有功能增强，包括内置的核心功能，如文件管理，搜索，Git，调试器，这些都是通过扩展实现的。

VS Code为了体验一致性，禁用扩展中UI元素自定义样式。

## 项目搭建

请确保已安装 Node.js。使用 Yeoman 和 VS Code 扩展生成器来快速创建扩展项目。首先安装 Yeoman 和生成器：
```
npm install -g yo generator-code
yo code
```
项目会自动创建一个HelloWorld扩展。

如果手动创建项目，可以参考下面的目录结构
```
my-VS Code-extension/
├── .VS Code/
│   └── extensions.json
├── src/
│   └── extension.ts
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md

```

准备图标，扩展需要一个产品展示图标。图标为128x128像素的PNG格式文件
准备活动栏按钮图标，图标为24x24像素，居中于50x40像素的块内，填充颜色为'rgb(215, 218, 224)'或'#d7dae0'。建议使用SVG格式的图标。

VS Code扩展在`package.json`中声明“贡献点”，“贡献点”用于描述该扩展可以为VS Code增强哪些功能，请参考[官方说明](https://code.visualstudio.com/api/references/contribution-points) 

在`package.json`文件的`contributes`节点中，我们添加扩展用到的所有命令：

|Command|操作|
|---|---|
|extension.snippetCraft.searchSnipps|代码片段搜索|
|extension.snippetCraft.insertSnipps|插入代码片段|
|extension.snippetCraft.deleteAllSnippets|删除全部代码片段|
|extension.snippetCraft.createSnipp|创建代码片段|
|extension.snippetCraft.refreshEntry|刷新代码片段列表|
|extension.snippetCraft.addEntry|添加代码片段|
|extension.snippetCraft.editEntry|编辑代码片段|
|extension.snippetCraft.editTitle|编辑代码片段标题|
|extension.snippetCraft.deleteEntry|删除代码片段|
|extension.snippetCraft.insertEntry|插入代码片段|
|extension.snippetCraft.addKv|添加映射|
|extension.snippetCraft.refreshKv|刷新映射列表|
|extension.snippetCraft.deleteKv|删除映射|
|extension.snippetCraft.editKv|编辑映射|

## 创建UI元素

### 活动栏按钮

点击此按钮将打开VS Code扩展的主边栏视图。图标和名称一般为产品的Logo和名称

在`package.json`文件的`contributes`节点中，添加如下内容：

```json
"viewsContainers": {
      "activitybar": [
        {
          "id": "snippsView",
          "title": "Snippet Craft",
          "icon": "./logo.svg"
        }
      ]
    }
```
完成活动栏按钮的添加

![](644861-20240802231835961-1010755575.png)


### 主边栏视图

主边栏中用于直观地列出代码片段的列表和映射表

在`package.json`文件的`contributes`节点中，添加如下内容：

```json
"views": {
    "snippsView": [
    {
        "id": "view.snippetCraft.snippsView",
        "name": "Snippets列表"
    },
    {
        "id": "view.snippetCraft.dictionaryView",
        "name": "映射表"
    }
    ]
},

```

完成主边栏视图的添加
![](644861-20240802231835427-280470917.png)


### 主边栏工具栏按钮

在`package.json`文件的`contributes`节点中，添加如下内容：

```json
"view/title": [
    {
        "command": "extension.snippetCraft.addEntry",
        "group": "navigation",
        "when": "view == view.snippetCraft.snippsView"
    },
    {
        "command": "extension.snippetCraft.refreshEntry",
        "group": "navigation",
        "when": "view == view.snippetCraft.snippsView"
    },
    {
        "command": "extension.snippetCraft.searchSnipps",
        "group": "navigation",
        "when": "view == view.snippetCraft.snippsView"
    },
    {
        "command": "extension.snippetCraft.addKv",
        "when": "view == view.snippetCraft.dictionaryView",
        "group": "navigation"
    },
    {
        "command": "extension.snippetCraft.refreshKv",
        "when": "view == view.snippetCraft.dictionaryView",
        "group": "navigation"
    }
    
    ]
},

```
完成主边栏工具栏按钮的添加


![](644861-20240802231835857-2134297475.png)
![](644861-20240802231835393-1495199995.png)



### 侧边栏右键菜单

在`package.json`文件的`contributes`节点中，添加如下内容：

```json

"view/item/context": [
    {
        "command": "extension.snippetCraft.editTitle",
        "group": "snippet",
        "when": "view == view.snippetCraft.snippsView"
    },
    {
        "command": "extension.snippetCraft.deleteEntry",
        "group": "snippet",
        "when": "view == view.snippetCraft.snippsView"
    },
    {
        "command": "extension.snippetCraft.insertEntry",
        "group": "snippet",
        "when": "view == view.snippetCraft.snippsView"
    },
    {
        "command": "extension.snippetCraft.editEntry",
        "group": "snippet",
        "when": "view == view.snippetCraft.snippsView"
    },
    {
        "command": "extension.snippetCraft.editKv",
        "when": "view == view.snippetCraft.dictionaryView",
        "group": "kveditor"
    },
    {
        "command": "extension.snippetCraft.deleteKv",
        "when": "view == view.snippetCraft.dictionaryView",
        "group": "kveditor"
    }
    ],
```

完成侧边栏右键菜单的添加

![](644861-20240802231835868-225961136.png)



### 编辑器右键菜单

在编辑器区域右键弹出的上下文菜单中选择“插入Snippet”，可以选择一个已有的片段插入当前光标所在位置

当编辑器中有文本被选中时，上下文菜单的“创建Snippet”会显示，点击时选中的文本将作为代码片段被存储。

```json
"menus": {
    "editor/context": [
    {
        "command": "extension.snippetCraft.createSnipp",
        "when": "editorHasSelection",
        "group": "snippet"
    },
    {
        "command": "extension.snippetCraft.insertSnipps",
        "group": "snippet"
    }
    ],
```

完成编辑器右键菜单的添加

![](644861-20240802231835527-869105135.png)



## 项目地址

[Github:snippet-craft](https://github.com/jevonsflash/snippet-craft)
