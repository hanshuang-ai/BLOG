---
title: vue全局过滤器
date: 2022-01-05 13:00:34
tags: ["vue"]
categories: ["框架", "日常开发"]
---

## 1、创建过滤器 js 文件

在项目内创建盛放内容的 js 文件，目录和文件名可以根据项目自定义
![WX20220105-130732](WX20220105-130732.png)

## 2、main.js 内引入

```javascript
import filter from "./api/filter";
Object.keys(filter).forEach((key) => Vue.filter(key, filter[key]));
```

## 3、组件内使用
![WX20220105-130951](WX20220105-130951.png)
