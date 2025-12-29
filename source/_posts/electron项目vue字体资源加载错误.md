---
title: electron项目vue字体资源加载错误
date: 2023-04-18 00:00:00
tags: [electron, vue, 字体, 资源加载, 问题解决]
categories: 桌面应用开发
updated: 2019-04-05 17:24:19
---

`electron + Vue 项目运行的时候，一切正常。使用 electronBuilder打包后，Vue的字体资源会加载错误，解决方法如下：`

```javascript
//vue.config.js
pluginOptions: {
        //electronBuilder
        electronBuilder: {
            customFileProtocol: "./"
        }
    },
```

![electron项目vue字体资源加载错误](electron项目vue字体资源加载错误/1.png)
