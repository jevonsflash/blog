---
thumbnail:
cover:
title: '[学习笔记]在CentOS7中用Docker方式安装Jenkins'
excerpt:
description:
date: 2023-12-12 17:12:00
tags:
categories: 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-12-12 17:12:00/[学习笔记]在CentOS7中用Docker方式安装Jenkins.html
---
<!-- toc -->
## 原理：

Docker in Docker （以下简称 DinD）可以在 Container 中直接运行一个 Docker Daemon ，然后使用 Container 中的 Docker CLI 工具操作容器。其原理如下图

![在这里插入图片描述](644861-20231212171132873-1929683075.png)


容器内的Docker Daemon对外提供服务，每个运行中的容器，都是一个进程，这个进程都托管在Docker Daemon中，镜像和容器都在一个隔离的环境。

Jenkins在构建时，需要一个独立的Docker环境用于打包镜像。需要用到DinD技术。



## 创建Docker网桥网络

网桥允许连接到同一网桥网络的容器进行通信，创建一个名为jenkins的网桥网络

```
docker network create jenkins
```

## 安装DinD
这里使用官方文档的方式安装DinD

```
docker run --name jenkins-docker --rm --detach \
  --privileged --network jenkins --network-alias docker \
  --env DOCKER_TLS_CERTDIR=/certs \
  --volume jenkins-docker-certs:/certs/client \
  --volume jenkins-data:/var/jenkins_home \
  --publish 2376:2376 \
  docker:dind --storage-driver overlay2
```


* --env DOCKER_TLS_CERTDIR=/certs： 允许在 Docker 服务器中使用 TLS, 统一管理 Docker TLS 证书的根目录
* --volume jenkins-docker-certs:/certs/client： 映射 Docker TLS 证书的根目录
* --volume jenkins-data:/var/jenkins_home： 映射jenkins_home目录
* --publish 2376:2376：在主机上公开 Docker 守护程序端口


## 创建镜像

在合适位置创建一个Dockerfile文件，内容如下：

```
FROM jenkins/jenkins:2.426.1-jdk17
USER root
RUN apt-get update && apt-get install -y lsb-release
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
USER jenkins
```

## 构建镜像

```
docker build -t myjenkins .
```
构建成功后可在镜像列表中看到myjenkins镜像

![在这里插入图片描述](644861-20231212171132847-311767996.png)


## 运行容器

```

docker run \
  --name jenkins \
  --restart=on-failure \
  --detach \
  --network jenkins \
  --env DOCKER_HOST=tcp://docker:2376 \
  --env DOCKER_CERT_PATH=/certs/client \
  --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  myjenkins
  
```

注意环境变量路径，以及映射目录的路径要与DinD中的环境变量保持一致。

通过`docker ps`查看容器运行状态

![在这里插入图片描述](644861-20231212171132855-673502886.png)




配置端口转发到8080
```
server {
    listen 2901;
    server_name your.server.cn;

    location / {
        proxy_pass http://127.0.0.1:8080/;
        
    }
}
```

重启nginx
```
systemctl restart nginx
```

安装完成，打开服务器地址后，按照提示配置Jenkins吧

![在这里插入图片描述](644861-20231212171132933-872179506.png)
