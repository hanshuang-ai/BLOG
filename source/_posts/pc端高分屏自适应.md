---
title: pc端高分屏自适应
date: 2022-03-07 10:45:27
tags: ["自适应", "vue"]
categories: ["库"]
---

`vue项目内`

### 1、插件安装

```shell
npm install amfe-flexible postcss-px2rem -S
```

### 2、引入使用（main.js）

```javascript
import "amfe-flexible";
```

### 3、配置（vue.config.js）

```javascript
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          // 设计稿宽度的1/10，一般为192,设计稿为1920
          require("postcss-px2rem")({ remUnit: 192 }),
        ],
      },
    },
  },
};
```

**注意事项：由于是做了适配，那么没有给定大小（默认大小）的元素会发生变化，为了避免这种问题，需要给这类元素一个默认大小**
