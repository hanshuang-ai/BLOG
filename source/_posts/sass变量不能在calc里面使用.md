---
title: sass变量不能在calc里面使用
date: 2022-12-17 00:00:00
tags: [sass, scss, css, calc, 变量]
categories: 前端开发
updated: 2020-06-28 14:38:18
---
```css
$fontSize: 1.4rem;

.scroll{
  /* 必须要用 #{}把变量包起来 */
  calc(100% - #{$fontSize});
}
```
