---
title: git基本命令
date: 2022-09-26 15:59:56
tags: ["git", "基本命令"]
categories: ["实战", "git"]
---

## 1、查看项目远程仓库地址

```javascript
// 第一种方式
git remote -v

// 第二种方式
git remote get-url origin

// 第三种方式
直接在该项目.git目录下config文件内查看
```

![查看项目远程仓库地址](1.png)


## 2、查看本地拉取/提交修改了哪些代码
```javascript
git diff
```