---
title: jquery专题
date: 2022-05-07 15:10:10
tags: ['jquery']
---

## 判断一个元素是否在页面上显示或隐藏
```javascript
if($(a).is(':visible')){}   //判断是否显示
if($(a).is(':hidden')){}   //判断是否隐藏
```

## 为单选框添加选中或取消选中状态
```javascript
$('input').prop('checked', true);   //prop会为元素添加属性，并赋值
$('input').attr('checked', true);   //attr会查找元素，改变属性
```