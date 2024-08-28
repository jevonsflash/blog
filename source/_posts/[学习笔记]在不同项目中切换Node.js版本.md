---
thumbnail: images/2840d419f03349f29f017f1be29f9c08.png
title: '[学习笔记]在不同项目中切换Node.js版本'
excerpt: '在开发中，可能会遇到不同的Vue项目需要不同的Node.js，在开发机上如何快速切换Node的版本呢？总结：最好是通过第一种方式，因为手动配置环境变量的方式会产生依赖，需要在同事的电脑上手动配置。cross-env 是一个用于在不同操作系统上设置和使用环境变量的工具，可以用它来切换。环境变量，以确保在不同的操作系统上都能正确设置和使用 Node.js 的路径。下载 Node.js，并在不同目录下安装多个版本。环境变量的路径，实现切换Node.js 的版本。可以在系统的环境变量配置中手动设置。' 
tags:
  - JavaScript
  - Node.JS
categories:
  - JavaScript
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2024-08-22 19:53:00/[学习笔记]在不同项目中切换Node.js版本.html'
abbrlink: 4ba5d0e5
date: 2024-08-22 19:53:00
---
<!-- toc -->
在开发中，可能会遇到不同的Vue项目需要不同的Node.js，在开发机上如何快速切换Node的版本呢？

##  使用 Node Version Manager (NVM)

### 安装 NVM

在 Linux 或 macOS 上可以通过以下命令安装 NVM：

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash` 

在 Windows 上，可以下载并安装 [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)。

### 使用 NVM 安装和切换 Node.js 版本

安装一个特定版本的 Node.js：

```
nvm install 16

nvm install 22
```

切换到指定的 Node.js 版本：

`nvm use 22` 

可以通过以下命令检查当前使用的 Node.js 版本：

`node -v` 

### 为项目指定 Node.js 版本

可以在项目根目录中创建一个 `.nvmrc` 文件，里面指定该项目需要使用的 Node.js 版本：

`16` 

然后，在进入项目目录时，运行以下命令自动使用 `.nvmrc` 中指定的版本：

`nvm use` 



## 使用环境变量指定 Node.js

### 安装多个版本的 Node.js

下载 Node.js，并在不同目录下安装多个版本。如`C:\Program Files\nodejs16`和`C:\Program Files\nodejs22`

![在这里插入图片描述](644861-20240822195107888-873726239.png)

![在这里插入图片描述](644861-20240822195107993-1055935573.png)



### 设置环境变量

可以在系统的环境变量配置中手动设置 `NODE_HOME`。

**在 Windows 上：**

1.  打开 "系统属性" > "高级系统设置" > "环境变量"。
2.  在 "系统变量" 或 "用户变量" 中点击 "新建"。
3.  创建一个新的变量 `NODE_HOME`，并设置它的值为 Node.js 安装路径。
   
   ![在这里插入图片描述](644861-20240822195107979-2021687649.png)


4.  找到 `Path` 变量，点击 "编辑"。
5.  添加一个新条目：`%NODE_HOME%`。

**在 macOS/Linux 上：**

1.  打开终端，编辑 `.bashrc`、`.bash_profile` 或 `.zshrc` 文件：
    
    
    `export NODE_HOME=/usr/bin/nodejs22
    export PATH=$NODE_HOME:$PATH` 
    
2.  保存文件并运行 `source ~/.bashrc` 或 `source ~/.zshrc` 以使更改生效。
    
通过更改 `NODE_HOME` 环境变量的路径，实现切换Node.js 的版本。

### 验证配置

可以通过以下命令验证 Node.js 是否已成功通过 `NODE_HOME` 变量加载：

`node -v` 

输出应显示所配置的 Node.js 版本：


![在这里插入图片描述](644861-20240822195107885-1416628331.png)


cross-env 是一个用于在不同操作系统上设置和使用环境变量的工具，可以用它来切换 `NODE_HOME` 环境变量，以确保在不同的操作系统上都能正确设置和使用 Node.js 的路径。

在 `package.json` 中，可以定义如下的 npm 脚本：



```
{
  "scripts": {
    "set-node16": "cross-env NODE_HOME=C:\\Program Files\\nodejs16",
    "set-node22": "cross-env NODE_HOME=C:\\Program Files\\nodejs22",
    "set-node16-unix": "cross-env NODE_HOME=/usr/bin/nodejs16",
    "set-node22-unix": "cross-env NODE_HOME=/usr/bin/nodejs22"
  }
}
```

### 使用 npm 脚本切换

可以根据操作系统和需要的 Node.js 版本运行相应的脚本：

**在 Windows 上：**


`npm run set-node16` 



**在 Unix 系统上（Linux/Mac）：**


`npm run set-node16-unix` 


总结：最好是通过第一种方式，因为手动配置环境变量的方式会产生依赖，需要在同事的电脑上手动配置。