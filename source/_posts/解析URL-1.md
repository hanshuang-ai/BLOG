---
title: 解析URL
date: 2022-09-28 14:23:42
tags: ['实战']
---

```javascript
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