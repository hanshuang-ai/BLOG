---
uuid: e0cca1a7-adf4-f95a-7ddd-11454242d93d
title: 使用nuxt创建站点
tag: [nuxt]
categories: ['框架']
---


`nuxt使用了Vue，但是令人兴奋的地方是支持seo，另外还具有自己的静态站点生成器，非常适合web站的开发。`
nuxt中文官网链接：https://www.nuxtjs.cn/

# 安装与创建项目

## 安装nuxt
```

```

## 创建项目
`nuxt可以使用yarn、npx、npm三种方式创建项目`
```
1、yarn
yarn create nuxt-app <project-name>

2、npx
npx create-nuxt-app <project-name>

3、npm
npm init nuxt-app <project-name>
```

## 创建项目时的可选项分析
https://www.nuxtjs.cn/guide/installation


# 目录结构
![](http://qiniu.aoxuekj.com/nuxt_catalog.png)

## assets
资源目录，用来存在未编译的静态资源。LESS、SASS、JavaScript

## components
组件目录，用来存放组织应用的Vue组件

## layouts
布局目录，用来组织应用布局

## middleware
中间件目录，用来存放应用的中间件

## node_modules
npm包目录，这是任何一个使用npm包的应用都存在的目录

## pages

## plugins
插件目录，用来存放需要在根vue应用实例化之前就要运行js插件

## static
静态文件目录，但是不会被编译，服务器启动时，该目录的文件会映射到根路径下

## store
组织vuex状态树文件，在该目录下创建一个index.js文件就可激活这些配置

## 其他根目录文件

### .editorconfiig

### .gitignore

### nuxt.config.js
nuxt应用的个性化配置，高优先级，可以覆盖默认配置

### package.json
用来描述应用依赖关系和对外暴露的脚本接口，`该文件不能被重命名`

### package-lock.json

### README.md

## nuxt创建的项目供局域网访问
### 在当前项目安装依赖
```
npm install --save-dev cross-env
```
在package.json中配置
```
"scripts": {
  "dev": "cross-env NUXT_HOST=0.0.0.0 NUXT_PORT=3333 nuxt"
}
```

