---
title: vue环境配置
date: 2022-10-11 22:32:01
tags: ["vue"]
categories: ['实战','vue']
---

> 根据项目需求创建.env.XXX 环境文件
> 文件内使用
> package.json 文件 javascript 配置运行

`本文使用开发、测试、生产3种环境`

## 1、根据项目需求创建.env.XXX 环境文件

`根据VUE_APP_CURRENTMODE进行package.json javascript运行配置`
`根据NODE_ENV进行环境判断`

```javascript
// 开发环境
// .env.development
NODE_ENV = "development";
VUE_APP_CURRENTMODE = "dev";
VUE_APP_BASE_URL = "https://xxx.com";
```

```javascript
// 测试环境
// .env.test
NODE_ENV = "test";
VUE_APP_CURRENTMODE = "test";
VUE_APP_BASE_URL = "https://xxx.com";
```

```javascript
// 生产环境
// .env.production
NODE_ENV = "production";
VUE_APP_CURRENTMODE = "prod";
VUE_APP_BASE_URL = "https://xxx.com";
```

## 2、文件内使用

举例在 vueStore 内定义 baseURL

```javascript
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    baseURL: process.env.VUE_APP_BASE_URL,
    callBackURL:
      process.env.NODE_ENV === "production"
        ? "xxx"
        : "xxx",
  },
});
export default store;
```

## 3、package.json 文件 javascript 配置运行

```javascript
{
  "scripts": {
    "serve": "vue-cli-service serve --mode development",
    "serve:dev": "vue-cli-service serve --mode dev",
    "build": "vue-cli-service build",
    "build:test": "vue-cli-service build --mode test",
    "build:pro": "vue-cli-service build --mode prod",
    "build:dev": "vue-cli-service build --mode dev",
    "lint": "vue-cli-service lint"
  }
}

```
