---
title: js基础操作
date: 2022-10-14 18:23:41
tags: ["开发", "代码片段"]
categories: ["日常开发", "代码片段"]
top: true
summary: js代码封装
---

## 1、将中国标准时间转为 yyyymmdd

```javascript
export function getYYYYMMDD(string) {
  const d = new Date(string);
  const datetime =
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    " " +
    d.getHours() +
    ":" +
    d.getMinutes() +
    ":" +
    d.getSeconds();

  return datetime;
}
```

## 2、去除字符串内所有空格

```javascript
export function RemoveAllSpaces(string) {
  return string.replace(new RegExp(" ", "gm"), "");
}
```

## 3、解析 URL

`先根据 ？ 或者 & 符进行将url分割成数组，再遍历数据，根据数组内每项的 = 号，分别取值赋给 key 和 value。最后将 key 和 value 组合成一个对象`

```javascript
// 解析URL
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
```

## 4、如何判断对象为空

`总体来说就是判断对象里面有多少key，如果key的个数为0，则为空`
[代码链接](https://github.com/hanshuang-ai/code/blob/master/%E5%88%A4%E6%96%AD%E5%AF%B9%E8%B1%A1%E4%B8%BA%E7%A9%BA.js)
[Object.keys 讲解链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

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
