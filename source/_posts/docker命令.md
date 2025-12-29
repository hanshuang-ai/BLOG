---
title: docker命令
categories: 部署与运维
date: 2023-09-10 00:00:00
tags: [docker, 命令, 容器, linux]
updated: 2021-02-24 15:44:13
---

### 查看服务器上所有的 docker 镜像

```bash
docker images
```

这个命令会列出所有在本地存在的 Docker 镜像，包括它们的大小和标签信息。如果你想要更详细的信息，可以使用以下命令：

```bash
docker images --digests
```

这会显示每个镜像的摘要信息。如果你想要查看特定仓库的镜像，可以使用--filter 参数来过滤结果：

```bash
docker images --filter "reference=<repository-name>"
# 将<repository-name>替换成你想要查看的仓库名称。
```

### 查看正在运行的 Docker 容器

```bash
docker ps
```

`可以使用-a或--all参数来显示所有容器，包括未运行的容器：`

```bash
docker ps -a
```

### docker ps -a 和 docker images 的区别

> docker ps 和 docker images 是两个不同的 Docker 命令，它们显示的信息也有所不同：
> `docker ps`：
> 这个命令用于列出容器的信息。
> docker ps 默认只显示当前正在运行的容器。
> 使用 -a 或 --all 参数可以显示所有容器，包括停止的容器。
> 显示的信息包括容器 ID、创建时间、状态、名称、重启次数、镜像名称等。
> `这个命令关注的是容器实例，即镜像的运行实例`。
> `docker images`：
> 这个命令用于列出本地存储的 Docker 镜像。
> 显示的信息包括镜像 ID、创建时间、大小、仓库名称和标签（tag）。
> docker images 不会显示容器的信息，它只关注镜像本身。
> `这个命令可以帮助你管理本地镜像库，比如查看哪些镜像占用了空间，或者确定哪些镜像可以被删除以节省空间`。

### docker 镜像和容器的区别

> `定义`：
> 镜像（Image）：Docker 镜像是一个轻量级、可执行的软件包，包含了运行一个应用所需的所有内容——代码、运行时、系统工具、系统库等。镜像是容器运行的基础，它是一个只读模板，用于创建容器。
> 容器（Container）：Docker 容器是镜像的运行实例。它是独立运行的一个或一组应用。容器使用镜像来创建，并在隔离的环境中运行应用。容器可以被启动、停止、删除等。
> `持久性`：
> 镜像：镜像是只读的，它们定义了容器的初始状态，但不会随容器的状态改变而改变。
> 容器：容器对文件系统的变化是临时的，容器删除后这些变化也会随之消失，除非使用了数据卷（Volume）来持久化数据。
> `隔离性`：
> 镜像：镜像本身不提供隔离性，它们是共享的，多个容器可以基于同一个镜像运行。
> 容器：容器提供了隔离性，每个容器都有自己的文件系统和网络配置，它们在宿主机上运行但相互隔离。
> `启动和停止`：
> 镜像：镜像本身不能被启动或停止，它们只是创建容器的模板。
> 容器：容器可以被启动和停止，它们是镜像的动态实例。
> `存储`：
> 镜像：镜像存储在 Docker 的镜像库中，可以是本地的，也可以是远程的，如 Docker Hub。
> 容器：容器运行时会使用镜像，并且可能会产生新的层，这些层存储在本地，但不会上传到镜像库。
> `版本控制`：
> 镜像：镜像可以有标签（tag），用于版本控制，允许用户追踪和管理不同版本的应用。
> 容器：容器没有版本控制，它们是镜像的一个实例，通常不用于追踪版本。
> 可移植性：
> 镜像：镜像是高度可移植的，可以在任何支持 Docker 的环境中运行。
> 容器：容器的可移植性依赖于镜像的可移植性，但由于容器可能会使用特定的数据卷或网络配置，因此可能不如镜像那样完全可移植。

### 删除镜像

要删除特定的 Docker 镜像，你需要使用 docker rmi 命令，后面跟上你想要删除的镜像的 ID 或名称

```bash
docker rmi my-playwright-app1
```

使用-f 或--force 参数来强制删除

```bash
docker rmi -f my-playwright-app1
```

`请注意，如果镜像正在被使用（例如，如果它们正在运行的容器中），你可能需要先停止并删除这些容器，然后才能删除镜像。`
如果你想要一次性删除多个镜像，可以使用以下命令：

```bash
docker rmi $(docker images -q my-playwright-app1 my-playwright-app aithemehtml2img1 aithemehtml2img)
```

### 构建 docker 镜像

> 构建 Docker 镜像是一个常见的操作，它允许你将应用程序及其依赖打包成一个轻量级、可移植的容器。以下是构建 Docker 镜像的基本步骤：
> 1、编写 Dockerfile
> 2、构建镜像
> 3、运行容器

#### 1、编写 Dockerfile

```bash
# 使用 Playwright 的官方基础镜像
FROM mcr.microsoft.com/playwright:v1.49.0-noble

# 安装 pnpm
# RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件
COPY package.json ./

# 安装项目依赖
RUN npm install

# # 安装 Playwright 和浏览器
# RUN npx playwright install --with-deps

# 复制项目文件
COPY . .

# 默认运行命令
CMD ["node", "index.js"]

```

#### 2、构建镜像

```bash
docker build -t my-playwright-app .
```

#### 3、运行容器

```bash
docker run -d -p 3000:3000 my-playwright-app
```

`-p 参数用于映射端口，3000:3000 表示将容器的3000端口映射到宿主机的3000端口。`
`-d 参数表示在后台运行容器。`

### 查看 Docker 容器的实时日志

```bash
docker logs -f <container_id>
```

### 通过名称来引用容器

```bash
docker run --name aitheme2img(容器名) -p 10089:10086 -d(分离模式”（detached mode）运行容器，即容器会在后台运行，不会占用当前的命令行终端) aitheme2img(镜像)
或者
docker run -d --name aitheme2img(容器名) -p 10089:10086 aitheme2img(镜像)
或者
docker run -d -p 10089:10086 --name aitheme2img(容器名) aitheme2img(镜像)
```

### 设置容器随 Docker 服务启动而自动启动

在 Docker 中，要设置容器随 Docker 服务启动而自动启动，你可以在创建容器时使用--restart 标志。这个标志允许你指定重启策略，以确保容器在退出后自动重启，或者在 Docker 服务重新启动时自动启动容器。

> no：容器不会自动重启。
> always：容器总是在退出后重启。
> on-failure：容器仅在非正常退出时（退出状态非 0）重启。
> unless-stopped：容器总是在退出后重启，除非它是被手动停止的。

```bash
docker run --restart=always -d aitheme2img
```

`这些命令会创建一个新的容器，并设置其重启策略。如果你想要更新已经存在的容器的重启策略，你需要使用docker update命令：`

```bash
docker update --restart=always <container_id_or_name>
```

### 查看 docker 容器里面的所有文件

```bash
docker exec -it <container_id_or_name> /bin/bash
```

`/bin/bash换成自己服务器用的终端，然后使用文件系统命令（如ls）来查看文件`

### 停止容器

```bash
docker stop <container_id_or_name>
```

### 删除容器

```bash
docker rm <container_id_or_name>
```
