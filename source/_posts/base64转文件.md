---
title: base64转文件
date: 2023-10-12 00:00:00
tags: [base64, 文件转换, blob, 文件下载]
categories: 前端开发
updated: 2019-01-18 14:21:52
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
