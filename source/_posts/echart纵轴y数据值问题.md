---
title: echart纵轴y数据值问题
date: 2023-12-29 10:10:52
tags: [echart, 图表, y轴, 数据可视化]
categories: 前端开发
---

`y周数据值过小，折线走势不明显`

**解决方案**

```javascript
yAxis: {
          show: false,
          type: "value",
          splitNumber: 1,
          // 关键代码，将y轴最小值作为底值
          min:function(value){
            return value.min;
          }
```
