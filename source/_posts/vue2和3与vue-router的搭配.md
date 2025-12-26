---
title: vue2和3与vue-router的搭配
date: 2022-08-30 16:10:27
tags: [vue, vue-router, 路由, 版本升级]
categories: 前端开发
---


### 1、vue2

#### 1.1 安装vur-router
`由于最新版本暴露的变量名发生了改变，建议安装3.x版本`
```javascript
npm install vue-router@3
```

#### 1.2 在App.vue文件下添加router-view
```javascript
<template>
  <div id="app">
    <router-view />
  </div>
</template>
```

#### 1.3 在src目录下创建router文件夹，并在该文件夹下创建index.js
```javascript
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

const routes = [{
        path: "/",
        name: "Index",
        component: () => import('../views/Index'),
        meta: {
            title: "",
            content: {
                keywords: '',
                description: '',
            },
             requireAuth: true
        }
    }
]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router
```

#### 1.4 在main.js内引入并使用
```javascript
import router from "./router";
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
```

### 2、vue3

#### 2.1 安装安装vur-router
```javascript
npm install vue-router
```

#### 2.2 在App.vue文件下添加router-view
```javascript
// 由于vue3对根元素数量没有限制，可以直接写在template里面
<template>
  <router-view></router-view>
</template>
```

#### 2.3 在src目录下创建router文件夹，并在该文件夹下创建index.js
```javascript
import {createRouter, createWebHashHistory} from "vue-router/dist/vue-router";

const routes = [
    {path: "/", name:"Index", component:() => import('../views/Index')}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
```

#### 2.4 在main.js内引入并使用
```javascript
import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router";

createApp(App).use(router).mount('#app')
```
