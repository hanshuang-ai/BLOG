---
title: 判断浏览器/webview进入前后台
date: 2023-05-16 10:15:54
tags: ["奇淫技巧"]
---

当其选项卡的内容变得可见或被隐藏时，会在文档上触发 visibilitychange (能见度更改) 事件。

> 出于兼容性原因，请确保使用 document.addEventListener 而不是 window.addEventListener 来注册回调。Safari <14.0 仅支持前者。

```javascript
document.addEventListener("visibilitychange", () => {
	// 浏览器、webview进入前台的时候
	if (document.visibilityState == "visible") {
		console.log("显示");
	}
	// 浏览器、webview进入后台的时候
	if (document.visibilityState == "hidden") {
		console.log("隐藏");
	}
});
```
