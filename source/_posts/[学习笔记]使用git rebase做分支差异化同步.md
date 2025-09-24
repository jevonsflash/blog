---
title: '[学习笔记]使用git rebase做分支差异化同步'
excerpt: >-
  文章介绍了如何在Git中将master分支中除特定提交外的其他提交合并到archive-abp-source分支，通过创建临时分支、使用交互式rebase删除指定提交，再合并回目标分支的操作步骤。
tags:
  - git
categories:
  - DevOps
toc: true
recommend: 1
keywords: categories-java
uniqueId: '2025-06-05 10:04:00/[学习笔记]使用git rebase做分支差异化同步.html'
abbrlink: 535a3e30
date: 2025-06-05 10:04:00
cover:
description:
---

在一个.NET 项目中，使用了Volo.Abp库，但出于某种原因，需要源码调试，因此，使用源码方式集成的项目做了一个分支`archive-abp-source`

其中引用方式变更操作的提交为：`7de53907`

后续，在`master`分支中，又新增了若干个提交，现在的目标是：把 `master` 分支中后续的所有提交，除了 `7de53907...` 这个 commit，合并到`archive-abp-source`分支。

这在 Git 中不是一个“标准的 merge”操作（Git merge 默认会把所有 commit 都合并）。不过，可以通过以下步骤达成这个目的：

### 基于 master 创建临时分支

```
git checkout master
git checkout -b temp-merge
```


### 使用交互式 rebase 删除指定提交

```
git rebase -i --rebase-merges <common-base-commit>
```

`common-base-commit` 是当前分支与 master 的共同祖先，比如用 `git merge-base master archive-abp-source` 找到。结果就是 `<common-base-commit>`，可用于 `rebase -i` 时指定起点。



如果你知道数量，也可以简单地 rebase 最近 20 次提交：


`git rebase -i HEAD~20` 

然后在打开的编辑器中把 `7de53907...` 那一行改为 `drop`，保存退出即可。

![](644861-20250605100337923-1080905623.png)




### 切回目标分支，执行合并


```
git checkout archive-abp-source
git merge temp-merge

```


### [可选]删除临时分支


```
git branch -d temp-merge
````