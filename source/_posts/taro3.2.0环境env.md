---
title: taro3.2.0环境env
date: 2023-10-25 10:28:12
tags: ['实战']
categories: [库]
---
![](taro3.2.0环境env/1.png)
`在taro3.2.0项目中config文件夹内的dev.js、index.js、prod.js不能改变NODE环境变量的process.env.NODE_ENV的值，必须使用插件[taro-plugin-environment](https://github.com/bigmeow/taro-plugin-environment)`
![](taro3.2.0环境env/2.png)
`只有 TARO_APP_ 开头的环境变量会被注入进去`
![](taro3.2.0环境env/3.png)

示例：
![创建.env.c236文件、更改package.json](taro3.2.0环境env/4.png)
![.env.c236文件](taro3.2.0环境env/5.png)
