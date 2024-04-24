---
thumbnail: images/93e06287a819459e9c473b2d59a3c367.png
title: '[学习笔记] CentOS + .Net后端常用的中间件工具安装'
excerpt: 常用后端中间件，备忘记录
tags:
  - 数据库
  - centos
  - 中间件
categories:
  - Linux
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2023-02-12 00:08:00/[学习笔记] CentOS + .Net后端常用的中间件工具安装.html'
abbrlink: f902a15e
date: 2023-02-12 00:08:00
cover:
description:
---
## Redis 5.0+
官方文档：https://redis.io/download/#redis-downloads

```bash
sudo yum install redis
```


## RabbitMQ 3.7.11+

官方文档：https://www.rabbitmq.com/install-rpm.html

配置安装源
```bash
sudo nano /etc/yum.repos.d/rabbitmq.repo
```

键入内容
```
# In /etc/yum.repos.d/rabbitmq.repo

##
## Zero dependency Erlang
##

[rabbitmq_erlang]
name=rabbitmq_erlang
baseurl=https://packagecloud.io/rabbitmq/erlang/el/8/$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
# PackageCloud's repository key and RabbitMQ package signing key
gpgkey=https://packagecloud.io/rabbitmq/erlang/gpgkey
       https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

[rabbitmq_erlang-source]
name=rabbitmq_erlang-source
baseurl=https://packagecloud.io/rabbitmq/erlang/el/8/SRPMS
repo_gpgcheck=1
gpgcheck=0
enabled=1
# PackageCloud's repository key and RabbitMQ package signing key
gpgkey=https://packagecloud.io/rabbitmq/erlang/gpgkey
       https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

##
## RabbitMQ server
##

[rabbitmq_server]
name=rabbitmq_server
baseurl=https://packagecloud.io/rabbitmq/rabbitmq-server/el/8/$basearch
repo_gpgcheck=1
gpgcheck=0
enabled=1
# PackageCloud's repository key and RabbitMQ package signing key
gpgkey=https://packagecloud.io/rabbitmq/rabbitmq-server/gpgkey
       https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

[rabbitmq_server-source]
name=rabbitmq_server-source
baseurl=https://packagecloud.io/rabbitmq/rabbitmq-server/el/8/SRPMS
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packagecloud.io/rabbitmq/rabbitmq-server/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

```

安装
```bash
sudo yum update
sudo yum install --repo rabbitmq_erlang --repo rabbitmq_server erlang rabbitmq-server
```



## MongoDB 4.0+
官方文档：https://www.mongodb.com/docs/manual/administration/install-on-linux/

配置安装源
```bash
sudo nano /etc/yum.repos.d/mongodb-org-6.0.repo
```
键入内容
```
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
```

安装
```bash
sudo yum update
sudo yum install -y mongodb-org
```



## ElasticSearch 6.6+

官方文档：https://www.elastic.co/downloads/elasticsearch

配置安装源
```bash
sudo nano /etc/yum.repos.d/elasticsearch.repo
```

键入内容
```
[elasticsearch]
name=Elasticsearch repository for 7.x packages
baseurl=https://artifacts.elastic.co/packages/7.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=0
autorefresh=1
type=rpm-md

```
安装
```bash
sudo yum update
sudo yum install --enablerepo=elasticsearch elasticsearch

```

## 打开防火墙
```bash
 sudo firewall-cmd --permanent --add-port=6379/tcp
 sudo firewall-cmd --permanent --add-port=27017/tcp
```