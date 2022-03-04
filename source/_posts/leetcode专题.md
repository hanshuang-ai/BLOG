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

### 2、寻找两个正序数组的中位数

[链接地址](https://leetcode-cn.com/problems/median-of-two-sorted-arrays/)

```javascript
var findMedianSortedArrays = function (nums1, nums2) {
  let arr = [];
  let num = "";
  arr = [].concat(nums1).concat(nums2);
  function s(a, b) {
    return a - b;
  }
  arr = arr.sort(s);
  console.log(arr);
  if (arr.length % 2 != 0) {
    num = arr[(arr.length + 1) / 2 - 1];
  } else {
    num = (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2;
  }
  return num;
};
```

### 3、整数反转

[链接地址](https://leetcode-cn.com/problems/reverse-integer/)

```javascript
var reverse = function (x) {
  let string = x.toString();
  let arr =
    string[0] !== "-"
      ? parseInt([...string].reverse().join("")) > Math.pow(2, 31)
        ? 0
        : parseInt([...string].reverse().join(""))
      : Math.abs(
          ["-"]
            .concat(
              [...string]
                .reverse()
                .fill("", [...string].length - 1, [...string].length)
            )
            .join("")
        ) > Math.pow(2, 31)
      ? 0
      : ["-"]
          .concat(
            [...string]
              .reverse()
              .fill("", [...string].length - 1, [...string].length)
          )
          .join("");
  return arr;
};
```
`题目不难，但是不想用if，也没有提取公共变量，直接三元写下来。。。有点轴`