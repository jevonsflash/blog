---
thumbnail: images/a9b44db8d4c546fd91ae6d9437beca51.png
title: '[学习笔记]PostgreSQL数据库的安装和配置'
excerpt: 本文简单介绍了Postgres数据库在Linux系统下的安装和配置
tags:
  - [Linux]
  - 数据库
categories:
  - Database
  - [Linux]
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-02-12 00:15:00/[学习笔记]PostgreSQL数据库的安装和配置.html'
abbrlink: 248cc486
date: 2023-02-12 00:15:00
cover:
description:
---
## 安装

安装源

```
yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm
```

安装本体

```
yum -y install postgresql12 postgresql12-server postgresql12-contrib
```

初始化数据库

```
/usr/pgsql-12/bin/postgresql-12-setup initdb
```

配置PostgreSQL服务自启动，并开启服务
```
 systemctl enable postgresql.service
 systemctl start postgresql.service
```

## 配置

配置默认用户的密码
```
su - postgres
psql
alter user postgres with password '[新密码]';
```

**注意最后有个分号;不要漏了！**

配置远程访问
```
cd /var/lib/pgsql/12/data
```
先备份原始配置
```
mv pg_hba.conf pg_hba.conf_bak
```
在该目录下创建新的配置文件`pg_hba.conf`
```
local   all             all                                     md5
host    all             all             0.0.0.0/0               md5
host    replication     replica         0.0.0.0/0               md5
```
配置`postgresql.conf`
```
sed -i "s#\#listen_addresses.*#listen_addresses='*'#g" /var/lib/pgsql/12/data/postgresql.conf
sed -i  's#max_connections = 100#max_connections = 500#g' /var/lib/pgsql/12/data/postgresql.conf
```

重启服务
```
systemctl restart postgresql-12.service
```

再用默认用户试试，此时会要求输入密码，输入正确后进入psql命令模式

![在这里插入图片描述](f0ca21df3c96432e994935591a898880.png)
配置防火墙

```
firewall-cmd --zone=public --add-port=5432/tcp --permanent
```

使用数据库管理工具远程连接测试
![在这里插入图片描述](44fcbb907cd641e889c8c5964c9156d5.png)
至此完成所有的安装和配置工作

PostgreSQL的安装详细信息请参考[官网](https://www.postgresql.org/download/linux/redhat/)
