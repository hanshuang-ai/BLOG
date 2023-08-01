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

#### 3.3 git submoudle
Git 子模块（submodule）是 Git 中用于管理项目依赖的一种机制。它允许将一个 Git 仓库作为另一个仓库的子目录，使得一个仓库可以引用另一个仓库的特定版本，而不是将其完整地复制到主仓库中。

使用子模块，可以轻松地将外部项目或库集成到主项目中，同时保持各个项目的独立性和版本控制。

在添加子模块时，可以使用 `git submodule add` 命令指定子模块的远程仓库地址和在主项目中的存放路径。例如：

```
git submodule add https://github.com/example/submodule.git path/to/submodule
```

之后，主项目会记录子模块的信息，并在主项目的提交中包含子模块的快照。其他人在克隆主项目时，可以通过 `git submodule update --init` 命令初始化并下载子模块的内容。

要更新子模块到最新版本，可以使用 `git submodule update --remote` 命令。

子模块虽然提供了便利的依赖管理机制，但也需要注意一些注意事项。主要包括：

1. 注意及时更新子模块，以确保使用最新版本。
2. 如果主项目依赖的子模块有更新，需要在主项目中提交子模块的更新，并通知其他开发者及时更新子模块。
3. 子模块指向的是特定版本，不会自动跟随子模块的远程仓库更新，需要手动同步。

总之，Git 子模块是一个有用的工具，可以帮助项目管理复杂的依赖关系，并在合适的情况下使用它来使项目组织更加清晰和模块化。