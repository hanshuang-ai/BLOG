---
title: vue环境文件配置
tags: ["vue"]
categories: ["框架",'日常开发']
---

[vue 文档说明链接地址](https://cli.vuejs.org/zh/guide/mode-and-env.html)

`当运行 vue-cli-service 命令时，所有的环境变量都从对应的环境文件中载入。如果文件内部不包含 NODE_ENV 变量，它的值将取决于模式，例如，在 production 模式下被设置为 "production"，在 test 模式下被设置为 "test"，默认则是 "development"。 `

> 只有 NODE*ENV，BASE_URL 和以 VUE_APP* 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。

**.env 环境文件是通过运行 vue-cli-service 命令载入的，因此环境文件发生变化，你需要重启服务。**

## vue 创建的项目可以通过命令行进行运行或者打包（package.json），如下：

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  //运行或者打包，命令都在这，根据命令后面的 --进行不同环境的运行
  "scripts": {
    "serve": "vue-cli-service serve --mode development",
    "build": "vue-cli-service build",
    "build:test": "vue-cli-service build --mode test",
    "build:pro": "vue-cli-service build --mode prod",
    "build:dev": "vue-cli-service build --mode dev",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "agora-rtc-sdk": "^3.6.5",
    "agora-rtc-sdk-ng": "^4.7.2",
    "agora-rtm-sdk": "^1.4.3",
    "ali-oss": "^6.16.0",
    "axios": "^0.23.0",
    "babel-plugin-transform-remove-console": "^6.9.4",
    "core-js": "^3.6.5",
    "easemob-websdk": "^4.0.0",
    "element-ui": "^2.15.6",
    "image-tools": "^1.4.0",
    "jquery": "^3.6.0",
    "js-audio-recorder": "^1.0.7",
    "js-base64": "^3.7.2",
    "lamejs": "^1.2.0",
    "moment": "^2.29.1",
    "node-sass": "^4.14.1",
    "qrcode.vue": "^3.3.3",
    "qrcodejs2": "0.0.2",
    "qs": "^6.10.1",
    "sass-loader": "^7.3.1",
    "svga": "^2.0.4",
    "svgaplayerweb": "^2.3.2",
    "swiper": "^5.4.5",
    "uuid": "^7.0.3",
    "vue": "^2.6.11",
    "vue-awesome-swiper": "^4.1.1",
    "vue-axios": "^3.3.7",
    "vue-infinite-scroll": "^2.0.2",
    "vue-qr": "^3.2.2",
    "vue-router": "^3.5.2",
    "vue-seamless-scroll": "^1.1.23",
    "vuex": "^3.6.2"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "~4.5.0",
    "@vue/cli-plugin-eslint": "~4.5.0",
    "@vue/cli-service": "~4.5.0",
    "babel-eslint": "^10.1.0",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^6.2.2",
    "vue-awesome-swiper": "^4.1.1",
    "vue-cropper": "^0.5.7",
    "vue-template-compiler": "^2.6.11",
    "vue-wxlogin": "^1.0.4"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": ["plugin:vue/essential", "eslint:recommended"],
    "parserOptions": {
      "parser": "babel-eslint"
    },
    "rules": {}
  },
  "browserslist": ["> 1%", "last 2 versions", "not dead"]
}
```

## 项目目录结构如下：

![项目配置目录](WX20211229-142309.png)

## 环境文件

### .env.dev

```javascript
NODE_ENV = "development";
//指定当前环境模式
VUE_APP_CURRENTMODE = "dev";
VUE_APP_BASE_URL = "该模式下对应的baseURL";
```

### .env.development

```javascript
NODE_ENV = "development";
//指定当前环境模式
VUE_APP_CURRENTMODE = "development";
VUE_APP_BASE_URL = "该模式下对应的baseURL";
```

### .env.production 正式环境

```javascript
NODE_ENV = "production";
//指定当前环境模式
VUE_APP_CURRENTMODE = "prod";
VUE_APP_BASE_URL = "该模式下对应的baseURL";
```

## 只在本地使用的变量

`有的时候你可能有一些不应该提交到代码仓库中的变量，尤其是当你的项目托管在公共仓库时。这种情况下你应该使用一个 .env.local 文件取而代之。本地环境文件默认会被忽略，且出现在 .gitignore 中。.local 也可以加在指定模式的环境文件上，比如 .env.development.local 将会在 development 模式下被载入，且被 git 忽略。`

## 打包时隐藏 console 信息

### 安装插件

```javascript
npm install babel-plugin-transform-remove-console --save-dev
```

### 在 babel.config.js 里面进行配置

```javascript
const prodPlugins = [];
if (process.env.NODE_ENV === "production") {
  prodPlugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [...prodPlugins],
};
```

## 打包时添加时间戳

`在vue.config.js内进行配置`

```javascript
// 可以在这里打印环境变量信息
console.log(`本次使用的url请求地址${process.env.VUE_APP_BASE_URL} \n`);
console.log(process.env.NODE_ENV);

const Version = new Date()
  .getTime()
  .toString()
  .match(/.*(.{8})/)[1];
module.exports = {
  publicPath: "./",
  configureWebpack: {
    output: {
      filename: `js/[name].${Version}.js`,
      chunkFilename: `js/[name].${Version}.js`,
    },
  },
};
```
