---
title: css自定义滚动条
date: 2023-06-29 00:00:00
tags: [css, 滚动条, 样式, 浏览器兼容]
categories: 前端开发
updated: 2020-01-26 17:35:01
---

[参考链接](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::-webkit-scrollbar)

> ::-webkit-scrollbar——整个滚动条。
> ::-webkit-scrollbar-button——滚动条上的按钮（上下箭头）。
> ::-webkit-scrollbar-thumb——滚动条上的滚动滑块。
> ::-webkit-scrollbar-track——滚动条轨道。
> ::-webkit-scrollbar-track-piece——滚动条没有滑块的轨道部分。
> ::-webkit-scrollbar-corner——当同时有垂直滚动条和水平滚动条时交汇的部分。通常是浏览器窗口的右下角。
> ::-webkit-resizer——出现在某些元素底角的可拖动调整大小的滑块。

```css
.look-more-content {
	overflow-y: scroll;
}
.look-more-content::-webkit-scrollbar {
	width: 5px;
}
.look-more-content::-webkit-scrollbar-thumb {
	background-color: #888;
	border-radius: 5px;
}
```

`由于该css特性是非标准的，所以pc端需慎用，但移动端都是基于webkit内核，所以可以使用`
