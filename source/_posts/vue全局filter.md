---
title: vue全局filter
date: 2022-02-28 15:28:15
tags: ["vue"]
---

> 1、创建 filter.js
> 2、添加到 vue 全局中，main.js 中引入

### 1、创建 filter.js

```javascript
let random30 = (number) => {
  if (parseInt(number) < 30) {
    number = Math.round(Math.random() * 20 + 30);
  }
  return number;
};

export default { random30 };
```

### 2、添加到 vue 全局中，main.js 中引入

```javascript
Object.keys(filter).forEach((key) => Vue.filter(key, filter[key]));
```

### 3、组件内使用

```html
<!-- 直播间人数，如果不满足30人，生成30-50的随机数 -->
<span style="font-size: 14px; color: #999999">
  <!-- {{ list.roomPeopleTotal ? list.roomPeopleTotal : "0" }}人 -->
  {{ list.roomPeopleTotal | random30 }}人
</span>
```
