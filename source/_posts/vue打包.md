---
title: vue打包
date: 2022-10-11 23:03:19
tags: ["vue",'打包']
categories: ['vue']
---

### 1、生产环境的项目，我们隐藏 log 信息

> 引入 babel-plugin-transform-remove-console 插件
> vue 项目内创建 babel.config.js 文件

```javascript
// babel.config.js
const prodPlugins = [];
if (process.env.NODE_ENV === "production") {
  prodPlugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [...prodPlugins],
};
```

### 2、打包时，文件添加其他标识

`我们可以灵活运用，将时间戳改为版本号、tag等`

```javascript
const Version = new Date()
  .getTime()
  .toString()
  .match(/.*(.{8})/)[1];
module.exports = {
  publicPath: "./",
  //   更改js文件
  configureWebpack: {
    output: {
      filename: `js/[name].${Version}.js`,
      chunkFilename: `js/[name].${Version}.js`,
    },
  },
  //   更改css文件
  css: {
    extract: {
      filename: `static/css/[name].${Version}.css`,
      chunkFilename: `static/css/[name].${Version}.css`,
    },
  },
};
```
