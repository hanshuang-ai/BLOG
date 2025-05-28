---
title: 移动端ios适配安全区域
date: 2024-01-11 20:00:16
tags: [移动端,ios,安全区域,适配]
categories: [css]
---

安全区域横屏适配
```html
<meta content="width=device-width,initial-scale=1,user-scalable=no,viewport-fit=cover" name="viewport">
```
如果不加`viewport-fit=cover`这个属性，H5页面在iPhone上会出现不能铺满全屏的情况，加上这个属性后，页面会自动填充到全屏幕。但是横屏展示时，状态栏部分会被遮挡，所以需要做一些适配。由于页面是会旋转的，所有left和right都要适配。
```css
width: calc(100% - constant(safe-area-inset-left) - constant(safe-area-inset-right));
width: calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right));
```
