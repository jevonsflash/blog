---
thumbnail: images/732df9e294474bd2ac23ff3ecbb51ece.png
title: '[学习笔记]Rocket.Chat业务数据备份'
excerpt: >-
  Rocket.Chat
  的业务数据主要存储于mongodb数据库的rocketchat库中，聊天中通过发送文件功能产生的文件储存于中（文件方式设置为），因此在对Rocket.Chat做数据移动或备份主要分为两步，数据库备份和文件备份。
tags:
  - 数据库
  - rocket.chat
  - 即时通讯
  - mongodb
categories:
  - DevOps
  - Linux
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-02-21 17:23:00/[学习笔记]Rocket.Chat业务数据备份.html'
abbrlink: '52443691'
date: 2023-02-21 17:23:00
cover:
description:
---
Rocket.Chat 的业务数据主要存储于mongodb数据库的`rocketchat`库中，聊天中通过发送文件功能产生的文件储存于`/app/uploads`中（文件方式设置为`"FileSystem"`），因此在对Rocket.Chat做数据移动或备份主要分为两步，数据库备份和文件备份。

## 前提
已在本地或docker中部署完成Rocket.Chat服务，部署方法请查看[[学习笔记] Rocket.Chat 安装与设置启动项](https://www.cnblogs.com/jevonsflash/p/15895118.html)。

使用docker-compose方式部署时
* 确保mongodb暴露了端口以供宿主机访问。
* 确保宿主机的目录映射至rocketchat服务的`/app/uploads`目录，此目录应在后台管理已正确设置
 ![在这里插入图片描述](32c61411aa704f28bc7c6e28f2a75872.png)



`docker-compose.yml`文档中rocketchat和mongo部分的内容应如下
```
rocketchat:
 	...
    volumes:
      - ./uploads:/app/uploads
    
```
```
 mongo:
 	...
    volumes:
     - ./data/db:/data/db
     - ./data/dump:/dump
    ports:
     - 27017:27017
```

## 准备工作

我们可以在服务宿主机中执行备份（本地备份），或者在远程计算机中执行备份（异地备份）


安装 `mongodb-org-tools` 工具，我们要用的是数据库备份`mongodump`和以及恢复`mongorestore`工具
详情请查看[官网](https://docs.mongodb.com/v3.0/reference/program/mongodump/)或[教程](https://www.runoob.com/mongodb/mongodb-mongodump-mongorestore.html)
```
cd /etc/yum.repos.d
```

```
nano  mongodb-org-4.0.repo
```
```
[mongodb]
name=MongoDB Repository
baseurl=http://mirrors.aliyun.com/mongodb/yum/redhat/7Server/mongodb-org/4.0/x86_64/
gpgcheck=0
enabled=1
```
运行安装命令
```
yum install mongodb-org-tools
```
## 备份
数据库备份
运行下列命令进行备份
```
mongodump -d="rocketchat" --gzip -o "/home/xamarin/dump"     
```
等待备份完成，打印如下

```
2023-02-21T03:07:23.140+0000    writing rocketchat.users to 
2023-02-21T03:07:23.140+0000    writing rocketchat.rocketchat_statistics to 
2023-02-21T03:07:23.141+0000    writing rocketchat.rocketchat_cron_history to 
2023-02-21T03:07:23.141+0000    writing rocketchat.rocketchat_message to 
2023-02-21T03:07:24.980+0000    [........................]                    rocketchat.users  101/10594  (1.0%)
2023-02-21T03:07:24.980+0000    [#.......................]    rocketchat.rocketchat_statistics   101/1791  (5.6%)
2023-02-21T03:07:24.980+0000    [#.......................]       rocketchat.rocketchat_message   101/1363  (7.4%)
2023-02-21T03:07:24.980+0000    [#.......................]  rocketchat.rocketchat_cron_history   101/1549  (6.5%)
2023-02-21T03:07:24.980+0000
2023-02-21T03:07:25.059+0000    [########################]  rocketchat.rocketchat_message  1363/1363  (100.0%)
2023-02-21T03:07:25.059+0000    done dumping rocketchat.rocketchat_message (1363 documents)
```

此时备份文件将在`/home/xamarin/dump`目录下


在异地备份时可以使用`-h` 和 `-port`指定服务器地址
```
mongodump -h="<数据库服务器地址>" --port="27017" -d="rocketchat" --gzip -o "/home/xamarin/dump"     
```

文件备份
前往已映射到宿主机的`uploads`所在目录，此处以`/home/xamarin`为例
```
cd /home/xamarin
```
添加压缩文件和快照文件，并保存在`/home/xamarin/backups`下
```
tar -g /home/xamarin/uploads-snapshot -zcvf /home/xamarin/uploads-full.tar.gz  /home/xamarin/backups/uploads/
```

![在这里插入图片描述](b23c3180d8854d07a752d74b34717cc3.png)


## 还原
数据库还原
运行如下命令进行mongodb数据库还原
```
mongorestore --gzip --drop --dir="/home/xamarin/backups/mongodb/dump/gzip/"
```

在异地还原时可以使用 `-h` 和 `-port`指定服务器地址
```
mongorestore  -h="<数据库服务器地址>" --port="27017"  --gzip --drop --dir="/home/xamarin/backups/mongodb/dump/gzip/" 
```
文件还原
前往`uploads-full.tar.gz`备份文件所在目录
```
cd /home/xamarin/backups/uploads/
```
运行解压缩文件
```
tar -g uploads-snapshot -zxvf uploads-full.tar.gz -C /home/xamarin
```


打开Web端，观察到业务数据已悉数恢复
![在这里插入图片描述](05667788aec6465fbe8379ee7227c161.png)
## Troubleshooting

在还原过程中若出现`Unrecognized field 'snapshot'`字样如下
```
2023-02-21T14:06:07.022+0800    Failed: error writing data for collection `rocketchat.users` to disk: error reading collection: Failed to parse: { find: "users", skip: 0, snapshot: true, $readPreference: { mode: "secondaryPreferred" }, $db: "rocketchat" }. Unrecognized field 'snapshot'.
```
请确保备份和还原的工具版本一致，使用`--version`参数查看 `mongodump`  或 `mongorestore`版本
```
mongodump --version
```
