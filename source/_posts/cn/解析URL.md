---
title: 解析URL
tag: 代码片段
---

`先根据 ？ 或者 & 符进行将url分割成数组，再遍历数据，根据数组内每项的 = 号，分别取值赋给 key 和 value。最后将 key 和 value 组合成一个对象`
```
// 解析URL
let url = window.location.href;
let reg = /[?&][^?&]+=[^?&]+/g;
let arr = url.match(reg);
let params = {};
if (arr) {
    arr.forEach((item) => {
        let tempArr = item.substring(1).split('=');
        let key = tempArr[0];
        let val = tempArr[1];
        params[key] = val;
    })
}
```