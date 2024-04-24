﻿---
thumbnail:
cover:
title: '在macOS中搭建.NET MAUI开发环境'
excerpt:
description:
date: 2023-12-31 00:21:00
tags:
  - Xamarin
  - .net
  - MAUI

categories:
  - .NET MAUI
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-12-31 00:21:00/在macOS中搭建.NET MAUI开发环境.html
---
<!-- toc -->
# 准备
* 一台 macOS Monterey 以上的电脑
* 安装 XCode13.3 以上
* 安装 Visual Studio Code

# 安装扩展

打开Visual Studio Code，按下 `Command + Shift + P`，输入 `install`，选择 `Extensions: Install Extensions`，搜索 `MAUI`，安装 `.NET MAUI` 扩展。



# 安装 .NET

安装 .NET 8 https://dotnet.microsoft.com/zh-cn/download/dotnet

# 安装工作负载

打开终端，输入以下命令：

```bash
dotnet workload install maui
```

# 安装 Xcode 命令行工具

打开终端，输入以下命令：

```bash
sudo xcode-select --install
```

至此，应该可以调试iOS应用了。


# 调试安卓应用

若要在 Visual Studio Code 中调试 Android 应用，请执行以下操作：

## 安装 JDK

下载最新版本的 JDK：

https://learn.microsoft.com/zh-cn/java/openjdk/download

![在这里插入图片描述](644861-20231231001921584-10989755.png)


安装 JDK：


![在这里插入图片描述](644861-20231231001921431-641358887.png)

## 安装 Android SDK


创建新的 .NET MAUI 项目，在合适的位置打开终端，输入以下命令：

```bash
dotnet new maui
```

在项目文件夹中，打开终端，输入以下命令：

```bash
dotnet build -t:InstallAndroidDependencies -f:net8.0-android -p:AndroidSdkDirectory="<ANDROID SDK DIRECTORY>" -p:AcceptAndroidSDKLicenses=True
```
在 macOS 上，建议的 Android SDK 目录值为 $HOME/Library/Android/sdk

Android SDK 将自动被创建

# 安装 Android 模拟器

此时已可以真机调试 Android 应用，如果真机调试不方便，我们需要安装 Android 模拟器。

## 安装模拟器
前往 Android SDK Manager 所在目录，默认为 $HOME/Library/Android/sdk/cmdline-tools/11.0/bin，打开终端，输入以下命令：

```bash
./sdkmanager --install emulator
```

## 安装镜像


```bash
./sdkmanager "emulator" "system-images;android-34;google_apis;x86_64"
```

## 创建虚拟机

```bash
./avdmanager create avd -n Pixel5-API34 -k "system-images;android-34;google_apis;x86_64"
```

另外可以通过切换调试目标中的菜单，查看可用的镜像，选择一个镜像，或创建一个新的镜像。

CMD+SHIFT+P 或 查看->命令面板

![在这里插入图片描述](644861-20231231001921147-705244150.png)
选择“创建Android Emulator”
![在这里插入图片描述](644861-20231231001921578-637512103.png)
根据提示完成创建
![在这里插入图片描述](644861-20231231001921521-1334753481.png)

# 同意许可条款

打开终端，输入以下命令：

```bash
./sdkmanager --licenses --verbose
```

按照提示输入 `y` 同意许可条款。

![在这里插入图片描述](644861-20231231001921545-688494234.png)



# 创建 MAUI 项目

若要创建新的 .NET MAUI 应用，请执行以下操作：

1. 在资源管理器中，单击“创建 .NET 项目”或按 CMD+SHIFT+P> 选择“.NET: New Project...”。
2. 选择“.NET MAUI 应用”或“.NET MAUI Blazor 应用”。
3. 选择空文件夹。 如果文件资源管理器弹出窗口再次打开，则文件夹不为空。
4. 为项目命名。
5. 确保项目在解决方案资源管理器中成功加载，然后打开 C# 或 XAML 文件。
6. 也可以通过单击“文件”>“打开...”在 Visual Studio Code 中打开现有的 .NET MAUI 项目。

# 调试 MAUI 应用

在 Visual Studio Code 中，按 F5 键或单击“运行”>“启动调试”以调试 .NET MAUI 应用。

调试器选择器将显示可用的调试器。 选择“ .NET MAUI”以启动调试会话。

![在这里插入图片描述](644861-20231231001921006-1781613748.png)

## 切换调试目标

在 Visual Studio Code 的资源管理器中，打开项目sln文件，

![在这里插入图片描述](644861-20231231001921498-585351228.png)


此时在任务栏出现大括号 `{}`，点击选择调试目标。

![在这里插入图片描述](644861-20231231001921402-920560996.png)


# 参考资料

扩展主页：
https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-maui

扩展仓库：
https://github.com/microsoft/vscode-dotnettools

官方文档：
https://learn.microsoft.com/zh-cn/dotnet/maui/get-started/installation?view=net-maui-8.0&tabs=visual-studio-code