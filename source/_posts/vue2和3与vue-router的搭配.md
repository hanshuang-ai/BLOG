---
title: vue2和3与vue-router的搭配
date: 2022-08-30 16:10:27
tags: ['vue','vue-router']
---


## 1、vue2

### 1.1 安装vur-router
`由于最新版本暴露的变量名发生了改变，建议安装3.x版本`
> npm install vue-router@3

### 1.2 在App.vue文件下添加router-view
```javascript
<template>
  <div id="app">
    <router-view />
  </div>
</template>
```

### 1.3 在src目录下创建router文件夹，并在该文件夹下创建index.js
```javascript
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

const routes = [{
        path: "/",
        name: "Index",
        component: () => import('../views/Index'),
        meta: {
            title: "乐哇 - 官方入口-乐哇开黑大厅-游戏开黑平台-乐哇游戏开黑",
            content: {
                keywords: '官方入口-乐哇开黑大厅-游戏开黑平台-乐哇游戏开黑',
                description: '乐哇是年轻人都在使用的一款语音交友、开黑娱乐的语音社交软件。作为时下超in的社交方式，用户完成注册后，就能根据自己的喜好去K歌、语聊、找cp，更有游戏大神带队开黑娱乐，一键上车告别单身',
            }
        }
    },
    {
        path: "/User",
        name: "User",
        component: () => import('../views/User'),
        meta: {
            title: "用户中心",
            requireAuth: true
        }
    },
    {
        path: '/Login',
        name: 'Login',
        component: () => import('../views/Login'),
        meta: {
            title: '登录/注册'
        }
    },
    {
        path: '/BindPhoneNumber',
        name: 'BindPhoneNumber',
        component: () => import('../views/BindPhoneNumber'),
        meta: {
            title: '绑定手机号'
        }
    },
    {
        path: "/Room",
        name: "Room",
        component: () => import('../views/Room-v2'),
        meta: {
            title: '房间'
        }
    },
    {
        path: "/Room-v2",
        name: "Room-v2",
        component: () => import('../views/Room-v2'),
        meta: {
            title: '房间'
        }
    },
    {
        path: "/MentorPrivilege",
        name: "MentorPrivilege",
        component: () => import('../views/MentorPrivilege'),
        meta: {
            title: '导师特权',
            requireAuth: true
        }
    },
    {
        path: "/Recharge",
        name: "Recharge",
        component: () => import('../views/Recharge'),
        meta: {
            title: '充值',
            requireAuth: true
        }
    },
    {
        path: "/Hall",
        name: "Hall",
        component: () => import('../views/Hall'),
        meta: {
            title: '大厅',
        }
    },
    {
        path: "/Jump",
        name: "HJumpall",
        component: () => import('../views/Jump'),
        meta: {
            title: '乐哇',
        }
    },
    {
        path: "/Dashen",
        name: "Dashen",
        component: () => import('../components/Dashen'),
        meta: {
            title: '更多大神',

        }
    },
    {
        path: "/Search",
        name: "Search",
        component: () => import('../views/Search'),
        meta: {
            title: '搜索',
        }
    },
    {
        path: "/Personal",
        name: "Personal",
        component: () => import('../views/Personal'),
        meta: {
            title: '个人主页',
        }
    },
    {
        path: "/AboutUs",
        name: "AboutUs",
        component: () => import('../views/singlePage/AboutUs'),
        meta: {
            title: '关于我们',
        }
    },
    {
        path: "/HelpCenter",
        name: "HelpCenter",
        component: () => import('../views/singlePage/HelpCenter'),
        meta: {
            title: '帮助中心',
        }
    },
    //厅管后台
    {
        path: "/HallManagement",
        name: "HallManagement",
        component: () => import('../views/HallManagement/HallManagement'),
        meta: {
            title: '大厅管理',
            requireAuth: true
        }
    },
    {
        path: "/ActiveBanner",
        name: "ActiveBanner",
        component: () => import('../views/Active/ActiveBanner'),
        meta: {
            title: '元旦活动',
        }
    },
    {
        path: "/MonthlyStar",
        name: "MonthlyStar",
        component: () => import('../views/Active/monthlyStar/monthly-star.vue'),
        meta: {
            title: '月度之星',
        }
    },
    {
        path: "/transfer",
        name: "transfer",
        component: () => import('../views/transfer'),
        meta: {
            title: '乐哇App',
        }
    },
]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router
```

### 1.4 在main.js内引入并使用
```javascript
import router from "./router";
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
```


`如果需要路由守卫，可以按下面格式添加代码`

```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.content && to.meta.title == '乐哇 - 官方入口-乐哇开黑大厅-游戏开黑平台-乐哇游戏开黑') {
    document.querySelector('meta[name="keywords"]').setAttribute('content', to.meta.content.keywords)
    document.querySelector('meta[name="description"]').setAttribute('content', to.meta.content.description)
  } else {
    document.querySelector('meta[name="description"]').setAttribute('content', 'width=device-width,initial-scale=1.0')
  }
  const requireAuth = to.meta.requireAuth; //需要在定义路由的时候自定义进入该页面需要的授权
  if (requireAuth) {
    if (window.localStorage.getItem("userInfo")) {
      window.scrollTo(0, 0);
      next();
    } else {
      window.scrollTo(0, 0);
      next("/login");
    }
  } else {
    window.scrollTo(0, 0);
    next();
  }
});
```

# vue3