---
title: vue打包时添加时间戳
tags: ['vue']
categories: ["框架"]
---

```javascript
// 可以在这里打印环境变量信息
console.log(`本次使用的url请求地址${process.env.VUE_APP_BASE_URL} \n`);
console.log(process.env.NODE_ENV)

const Version = new Date().getTime().toString().match(/.*(.{8})/)[1]
module.exports = {
    publicPath: './',
    configureWebpack: {
        output: {
            filename: `js/[name].${Version}.js`,
            chunkFilename: `js/[name].${Version}.js`
         }
    }
}

```