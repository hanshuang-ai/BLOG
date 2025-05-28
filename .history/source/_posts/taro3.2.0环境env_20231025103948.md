---
title: taro3.2.0环境env
date: 2023-10-25 10:28:12
tags: ['实战']
---
在taro3.2.0项目中config文件夹内的dev.js、index.js、prod.js不能改变NODE环境变量的process.env.NODE_ENV的值，必须使用插件[taro-plugin-environment
](https://github.com/bigmeow/taro-plugin-environment)
