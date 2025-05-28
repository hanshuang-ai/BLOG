---
title: vue过滤器
date: 2022-10-11 22:19:03
tags: ["vue",'过滤器']
categories: ['vue']
---

### 1、全局过滤器

> 单起一个 js 文件，编写函数
> main.js 内进行配置
> 组件内使用

```javascript
// filter.js
let random30 = (number) => {
  if (parseInt(number) < 30) {
    number = Math.round(Math.random() * 20 + 30);
  }
  return number;
};

export default { random30 };
```

```javascript
// main.js
import filter from "./api/filter";
Object.keys(filter).forEach((key) => Vue.filter(key, filter[key]);
```

```html
// 组件内使用
<!-- 直播间人数，如果不满足30人，生成30-50的随机数 -->
<span style="font-size: 14px; color: #999999">
  {{ list.roomPeopleTotal | random30 }}人
</span>
```
`个人也建议在项目内使用全局过滤器，方便统一维护`
