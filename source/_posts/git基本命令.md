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

![查看项目远程仓库地址](git基本命令/1.png)

## 2、git diff

### 2.1 尚未缓存的改动：git diff

![查看项目远程仓库地址](git基本命令/2.png)

## 2.2 查看已缓存的改动： git diff --cached

![查看项目远程仓库地址](git基本命令/3.png)

## 2.3 显示暂存区和工作区的差异: git diff [file]

## 2.4 显示暂存区和上一次提交(commit)的差异: git diff --cached [file] 或者 git diff --staged [file]

## 2.5 显示两次提交之间的差异: git diff [first-branch]...[second-branch]
