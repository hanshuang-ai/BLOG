---
title: js实战
date: 2022-02-15 16:43:36
tags: ["实战"]
categories: ["实战"]
---

## 1、如何判断对象为空

`总体来说就是判断对象里面有多少key，如果key的个数为0，则为空`
[代码链接](https://github.com/hanshuang-ai/code/blob/master/%E5%88%A4%E6%96%AD%E5%AF%B9%E8%B1%A1%E4%B8%BA%E7%A9%BA.js)
[Object.keys讲解链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
```javascript
let object = {};
let isEmpty = false;

//es6
if (Object.keys(object).length === 0) {
  isEmpty = true;
} else {
  isEmpty = false;
}
console.log(isEmpty);

//es5
let arr = [];
for (let i in object) {
  arr.push(i);
}
arr.length === 0 ? (isEmpty = true) : (isEmpty = false);
console.log(isEmpty);

//JSON.stringify
if (JSON.stringify(object) === "{}") {
  isEmpty = true;
} else {
  isEmpty = false;
}
console.log(isEmpty);
```
