---
title: electron项目vue字体资源加载错误
date: 2023-02-16 17:24:19
tags: ["electron", "vue"]
categories: ["进阶"]
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

![electron项目vue字体资源加载错误](1.png)
