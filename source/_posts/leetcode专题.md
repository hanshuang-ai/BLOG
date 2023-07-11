---
title: leetcode专题
date: 2022-09-16 11:05:24
tags: ["leetcode"]
top: true
summary: 记录一些自己在leetcode上的解题方法
---

## 1、回文数

`回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。 例如：0~9,121等非负数`

```javascript
var isPalindrome = function (x) {
  if (x < 0) {
    console.log("false1");
    return false;
  }

  let str = x.toString();
  if (str.length == 0) {
    console.log(true);
    return true;
  } else {
    let str1 = str.split("").reverse().join("");
    console.log(str1);
    if (str1 == str) {
      console.log(true);
      return true;
    } else {
      console.log("false2");
      return false;
    }
  }
};
```

## 2、数组内两数求和

`数组内两数之和等于目标值，且同一个索引只能出现一次。例如：[2,7,11] 9`

```javascript
const twoSum = (nums, target) => {
  const len = nums.length;
  const sumCache = {};
  for (let i = 0; i < len; i++) {
    const value = nums[i];
    // 计算差值
    const diff = target - value;
    // 如果差值已经存在过，直接返回对应的索引
    if (typeof sumCache[diff] !== "undefined") {
      return [sumCache[diff], i];
    } else {
      // 否则存起来
      sumCache[value] = i;
    }
  }
};
```

## 3、删除有序数组中的重复项

```javascript
var removeDuplicates = function (nums) {
  nums = Array.from(new Set(nums);
  let len = nums.length;
  return len, nums;
};
```

## 4、寻找两个正序数组的中位数

[链接地址](leetcode专题/https://leetcode-cn.com/problems/median-of-two-sorted-arrays/)

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

## 5、整数反转

[链接地址](leetcode专题/https://leetcode-cn.com/problems/reverse-integer/)

```javascript
var reverse = function (x) {
  let string = x.toString();
  let arr =
    string[0] !== "-"
      ? parseInt([...string].reverse().join("") > Math.pow(2, 31)
        ? 0
        : parseInt([...string].reverse().join("")
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
