---
thumbnail: images/732df9e294474bd2ac23ff3ecbb51ece.png
title: '[学习笔记]SQL server完全备份指南'
excerpt: 本文将介绍如何在日常项目中，对SQL server数据库做备份和还原工作
tags:
  - 数据库
  - sqlserver
categories:
  - Database
  - Linux
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-02-21 17:21:00/[学习笔记]SQL server完全备份指南.html'
abbrlink: 6df3552f
date: 2023-02-21 17:21:00
cover:
description:
---
<!-- toc -->
本文将介绍如何在日常项目中，对SQL server数据库做备份和还原工作，SQL server的备份/还原机制，详情参见官方文档：[备份和还原 Linux 上的 SQL Server 数据库](https://learn.microsoft.com/zh-cn/SQL/linux/sql-server-linux-backup-and-restore-database?view=sql-server-2017)

# 方式一，使用SQL Server Management Studio
## 准备工作

连接目标数据库服务器

在目标数据库上右键->属性，将数据库的恢复模式设置为`简单`，兼容级别设置为`SQL Server 2016(130)`
![在这里插入图片描述](644861-20231022165413544-1255083441.png)

[可选]将表中将无用的业务数据删除，以减少备份或移动的文件大小，这一步根据业务需求而决定，以ABP系统为例，运行下列SQL命令将`AbpAuditLogs`表中的数据清除：
```
TRUNCATE TABLE [dbo].[AbpAuditLogs]
```

## 收缩数据库
![在这里插入图片描述](644861-20231022165413548-459326002.png)
这一步将减少数据库中数据文件和日志文件的大小，并允许数据库中有 10% 的可用空间。详情参见官方文档：[收缩数据库](https://learn.microsoft.com/zh-cn/sql/relational-databases/databases/shrink-a-database?view=sql-server-ver16)
![在这里插入图片描述](644861-20231022165413486-846664154.png)

## 移动数据库
通过将源数据库服务器中的数据库文件的分离，拷贝文件，再将文件附加至目标数据库服务器中，实现数据库移动，详情参见官方文档：[数据库分离和附加 (SQL Server)](https://learn.microsoft.com/zh-cn/sql/relational-databases/databases/database-detach-and-attach-sql-server?view=sql-server-ver16)
数据库->任务->分离，打开数据库分离对话框

![在这里插入图片描述](644861-20231022165413356-837448627.png)
勾选删除连接
![在这里插入图片描述](644861-20231022165413537-1692159712.png)
点击确定，等待数据库分离完成

拷贝数据库文件到目标服务器的/var/opt/mssql/data目录下
使用SQL Server Management Studio连接目标服务器数据库，数据库->附加

点击“添加..”，选择/var/opt/mssql/data目录下的`.mdf`文件，点击确定，等待数据库附加完成

## 数据库备份
数据库->任务->备份，打开备份对话框
![在这里插入图片描述](644861-20231022165413260-736328308.png)
制定备份策略
策略是每周一次的全量备份，每天一次的增量备份， 全量备份的文件需要单独拷贝到其他地方做异地备份。
每次全量备份，将单独生成独立的`.bak`文件，命名以`<数据库名称>-full-<日期编号>.bak`为标准
如 `BlogDb-full-0216.bak`
增量备份时，备份类型选择“差异”，详情参见官方文档：[差异备份 (SQL Server)](https://learn.microsoft.com/zh-cn/sql/relational-databases/backup-restore/differential-backups-sql-server?view=sql-server-ver16)
指定备份目标到“磁盘”，并添加一个路径，这里以`/var/opt/mssql/backup`目录为例

![在这里插入图片描述](644861-20231022165413506-2089113689.png)
点击确定开始备份
等待备份完成，宿主机的备份目录下，可以看到`.bak`文件，将这些文件拷贝至其他服务器上以实现异地备份
![在这里插入图片描述](644861-20231022165413514-1258215989.png)

## 还原数据库
数据库中右键，选择还原数据库
“源”中选择设备，并指定备份介质为目标`.bak`文件
![在这里插入图片描述](644861-20231022165413629-615560820.png)

选择后可以查看最新的备份集，如果备份集包含多个差异备份，可以通过时间线功能，查看并选择所需要的备份集位置
![在这里插入图片描述](644861-20231022165413567-347753623.png)
点选需要还原的备份集
![在这里插入图片描述](644861-20231022165413443-1000759404.png)
点击确定开始还原


# 方式二，使用命令行工具

在客户机上往往不提供Windows环境，因此需要使用终端工具通过命令行完成操作

## 准备工作

sqlcmd 实用工具是一个命令行实用工具，用于执行 Transact-SQL 语句，详情请参考官方文档
[sqlcmd - 使用实用工具](https://learn.microsoft.com/zh-CN/sql/tools/sqlcmd/sqlcmd-use-utility?view=sql-server-ver16&viewFallbackFrom=sql-server-linux-2017)，[Transact-SQL 语句](https://learn.microsoft.com/zh-cn/sql/t-sql/statements/create-database-transact-sql?view=sql-server-ver16&tabs=sqlpool)
安装mssql-tools工具集，其中包含了我们要用的sqlcmd 实用工具:
```
curl https://packages.microsoft.com/config/rhel/8/prod.repo > /etc/yum.repos.d/msprod.repo
sudo yum install -y mssql-tools unixODBC-devel
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
```

​确认数据库容器映射的宿主机物理地址，若使用docker方式部署SQL server，且没有做目录映射，则按照下面的方式操作

首先将docker容器中的 /var/opt/mssql目录内容拷贝到宿主机中的相同目录下

```
docker cp sqlserver2017:/var/opt/mssql/ /var/opt/mssql
```

停止原始容器
```
docker stop sqlserver2017
```

新建容器，将/var/opt/mssql目录映射至宿主机中的目录中
```
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<你的密码>" -p 1433:1433 -v /var/opt/mssql:/var/opt/mssql --name sqlserver2017 --restart always -d mcr.microsoft.com/mssql/server:2017-latest
```
或者如果按照官方文档中的卷操作，输入
```
docker volume ls
docker volume inspect <卷名称>
```
查看对应sqlserver容器的卷所映射的物理路径
![在这里插入图片描述](644861-20231022165413563-669267697.png)
物理路径下的内容：
![在这里插入图片描述](644861-20231022165413551-1425151696.png)
将数据库的恢复模式设置为“简单”，运行命令：
```
sqlcmd -S <SqlServer服务器地址> -U SA -P "<你的密码>" -Q "ALTER DATABASE [dbo].[<数据库名称>] SET RECOVERY SIMPLE"
```

将数据库的兼容级别设置为130，运行命令：
```
sqlcmd -S <SqlServer服务器地址> -U SA -P "<你的密码>" -Q "ALTER DATABASE  [<数据库名称>] SET COMPATIBILITY_LEVEL = 130;"
```

[可选]将表中将无用的业务数据删除，以减少备份或移动的文件大小，这一步根据业务需求而决定，以ABP系统为例，运行下列SQL命令将`AbpAuditLogs`表中的数据清除：
```
sqlcmd -S <SqlServer服务器地址> -U SA -P "<你的密码>" -Q "TRUNCATE TABLE [dbo].[AbpAuditLogs]"
```

## 收缩数据库
运行命令
```
sqlcmd -S <SqlServer服务器地址> -U SA -P "<你的密码>" -Q "DBCC SHRINKDATABASE (<数据库名称>, 10)"
```
这一步将减少数据库中数据文件和日志文件的大小，并允许数据库中有 10% 的可用空间。
![在这里插入图片描述](644861-20231022165413503-527367465.png)



## 移动数据库

首先将数据库设置下线

```
sqlcmd -S <SqlServer服务器地址> -U SA -P "<你的密码>" -Q "ALTER DATABASE [<数据库名称>] SET OFFLINE WITH ROLLBACK IMMEDIATE"
```

分离数据库
```
sqlcmd -S <SqlServer服务器地址> -U SA -P "<你的密码>" -Q "EXEC sp_detach_db '<数据库名称>', 'true'"
```

拷贝数据库文件到目标服务器的/var/opt/mssql/data目录下
```
scp -r -P 22 root@<SqlServer服务器地址>:/var/opt/mssql/data/<数据库名称>.mdf /var/opt/mssql/data
scp -r -P 22 root@<SqlServer服务器地址>:/var/opt/mssql/data/<数据库名称>_log.ldf /var/opt/mssql/data
```

在目标服务器中附加这个数据库
```
sqlcmd -S <SqlServer服务器地址> -U SA -P "<你的密码>" -Q "CREATE DATABASE [<数据库名称>] ON (FILENAME = '/var/opt/mssql/data/<数据库名称>.mdf'),(FILENAME = '/var/opt/mssql/data/<数据库名称>_log.ldf') FOR ATTACH"
```



## 备份数据库
运行命令

```
sqlcmd -S <SqlServer服务器地址> -U SA -P "<你的密码>" -Q "BACKUP DATABASE [<数据库名称>] TO DISK = N'/var/opt/mssql/backup/<数据库名称>-full.bak' WITH NOFORMAT, NOINIT, NAME = '<数据库名称>-full', SKIP, NOREWIND, NOUNLOAD, STATS = 10"
```
备份应该只包含上次完整备份后更改的数据库或文件部分。 差异备份一般会比完整备份占用更少的空间
如果是差异化备份，请添加如下参数
```
 WITH DIFFERENTIAL
```
等待数据库备份完成
![在这里插入图片描述](644861-20231022165413541-1910558038.png)

[可选]将备份文件`.bak`文件拷贝至目标服务器中，实现异地备份
```
mkdir /var/opt/mssql/backup
scp -r -P 22 root@<SqlServer服务器地址>:/var/opt/mssql/backup/<数据库名称>-full.bak /var/opt/mssql/backup
```

## 还原数据库

运行命令
```
sqlcmd -S <SqlServer服务器地址> -U SA -P "<你的密码>" -Q "RESTORE DATABASE [<数据库名称>] FROM DISK = N'/var/opt/mssql/backup/<数据库名称>-full.bak' WITH NOUNLOAD, REPLACE, NORECOVERY, STATS = 5"
```
如果数据库备份文件还包含备差异备份，则还需要选择还原的差异备份集位置，

```
WITH FILE = 1
```

比如要还原的完整数据库备份是设备上的第六个备份集 (FILE = 6)，差异数据库备份是设备上的第九个备份集 (FILE = 9)。 在恢复了差异备份之后，便恢复了数据库。
 

![在这里插入图片描述](644861-20231022165413573-357379307.png)
