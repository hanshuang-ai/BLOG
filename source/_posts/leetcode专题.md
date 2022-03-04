---
title: leetcode专题
date: 2022-03-04 14:39:48
tags: ["leetcode"]
categories: ["leetcode"]
top: true
summary: 记录一些自己在leetcode上的解题方法，基于本人性格大概率只会出现一种解题方式，目前阶段追求的是能做出来就好，优化就放在以后吧
---

`记录一些自己在leetcode上的解题方法，基于本人性格大概率只会出现一种解题方式，目前阶段追求的是能做出来就好，优化就放在以后吧`

### 1、两数之和
[链接地址](https://leetcode-cn.com/problems/two-sum/)
```javascript
var twoSum = function (nums, target) {
  let arr = [];
  for (let i = 0; i < nums.length; i++) {
    for (let ii = i + 1; ii < nums.length; ii++) {
      if (nums[i] + nums[ii] == target) {
        arr.push(i, ii);
        return arr;
      }
    }
  }
};
```
