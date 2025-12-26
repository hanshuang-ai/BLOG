---
title: 解析URL
date: 2022-09-08 10:23:15
tags: [url, 解析, 参数, querystring]
categories: 前端开发
---

在日常研发过程中，我们通常会根据URL地址以及参数进行业务判断，所以做了一下封装，方便使用

```javascript
// 解析URL
export function analysisURL() {
  let url = window.location.href;
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  let params = {};
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split("=");
      let key = tempArr[0];
      let val = tempArr[1];
      params[key] = val;
    });
  }
  return params;
}
```
