---
title: base64转文件
date: 2022-09-28 14:21:52
tags: ["base64"]
categories: ["封装函数"]
---

### base64 转文件

```javascript
export function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime,
  });
}
```
