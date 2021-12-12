---
uuid: f1e8ffa6-345f-a302-ba6e-252000a01a2b
title: vue-router
---

官方网址：https://router.vuejs.org/zh/

# 安装
`安装有3中方式`
```
1、js网址链接
先引入vue，再引入vue-router
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>

2、NPM
npm install vue-router
如果在一个模块化工程中使用它，必须要通过 Vue.use() 明确地安装路由功能：
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

3、在vue cli项目内用插件的方式
vue add router

```

`vue-router是基于路由和组件的路由用于设定访问路径，将路径和组件映射起来。在vue-router的单页面应用中, 页面的路径的改变就是组件的切换。`