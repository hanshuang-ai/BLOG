---
title: microApp初探
date: 2022-08-31 20:59:28
tags: ['微前端','microApp']
categories: ['实战','微前端']
---

`本项目采用microApp进行前端微服务的搭建，父应用采用的是vue3，子应用有2个，分别为vue2和vue3`

项目代码地址：https://github.com/hanshuang-ai/testMicroApp

> 1、创建父应用
> 2、创建子应用
> 3、创建子应用

## 1、父应用
### 1.1 创建父应用
```javascript
vue create micro //选择vue3
```
#### 1.2 在父应用app.vue内添加router-view
```javascript
<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
}
</script>
```
### 1.3 在父应用内添加载体
`我自己起的名，因为需要有一个页面去承载子应用`
```javascript
<template>
    我的页面
    <micro-app name='app1' url='http://localhost:8030/' baseroute='/my-page'></micro-app>   //子应用的地址  需要注意的是端口号必须指定
</template>

<script>
    export default({
        name:"myPage"
    })
</script>
```

### 1.4 父应用添加路由，指向刚才添加的载体页面
`父子应用的路由方式参考microApp官网，本项目父应用采用的history模式，子应用采用hash模式`
```javascript
import {createRouter, createWebHistory} from "vue-router/dist/vue-router";

const routes = [
    {path: "/", name:"Index", component:() => import('../views/Index')},
    {path:"/myPage", name:"myPage", component:() => import('../views/MyPage')}
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
```

## 2、创建子应用 vue2
> 创建子应用
> 子应用内添加路由
> 在子应用内添加配置
```javascript
// 需要注意的是：新vue创建的项目，在vue.config.js内进行配置

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8030,  //端口一定要指定
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
})
```
## 3、创建子应用 vue3
> 步骤同创建子应用 vue2

·vue2和vue3添加路由的方式请见·