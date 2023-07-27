---
title: git基本命令
date: 2022-09-26 15:59:56
tags: ["git", "基本命令"]
categories: ["实战", "git"]
---

### 1、查看项目远程仓库地址

```javascript
// 第一种方式
git remote -v

// 第二种方式
git remote get-url origin

// 第三种方式
直接在该项目.git目录下config文件内查看
```

![查看项目远程仓库地址](git基本命令/1.png)

### 2、git diff

###### 2.1 尚未缓存的改动：git diff

![查看项目远程仓库地址](git基本命令/2.png)

### 2.2 查看已缓存的改动： git diff --cached

![查看项目远程仓库地址](git基本命令/3.png)

### 2.3 显示暂存区和工作区的差异: git diff [file]

### 2.4 显示暂存区和上一次提交(commit)的差异: git diff --cached [file] 或者 git diff --staged [file]

### 2.5 显示两次提交之间的差异: git diff [first-branch]...[second-branch]

### 3、git clone --recursive

#### 3.1 git clone

`git clone --recursive` 是一个 Git 命令，用于克隆一个包含子模块（submodule）的仓库。子模块是指在一个 Git 仓库中嵌套的另外一个独立的 Git 仓库。当你在一个 Git 仓库中使用子模块时，你可以将外部仓库作为你的主仓库的一部分，这对于管理项目的依赖或者将公共代码库嵌入到你的项目中是非常有用的。使用 git clone --recursive 命令时，Git 会在克隆主仓库的同时递归地克隆所有子模块的仓库，使得你能够获得完整的项目代码，包括所有子模块的代码。

#### 3.2 已经克隆了一个仓库但没有使用 --recursive，可以使用以下命令来初始化和更新子模块

```javascript
git submodule update --init --recursive
```
