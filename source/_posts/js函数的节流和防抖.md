---
title: js函数的节流和防抖
date: 2022-02-18 09:56:53
tags: ["实战"]
categories: [js]
---

防抖和节流，反反复复写了好几次，概念就是不容易记住，终于有一天看到一个总结，感觉很合理

> 防抖 在指定的时间内 只响应最后一次
> 节流 在指定的时间内 只响应第一次

直接上代码

### 防抖

`情景说明，在用户进入直播间内，超过一段时间没有任何操作，给用户弹出一个提示框，有操作的话则重新计时`

```javascript
if (res.data.code == 0) {
	// 兄弟组件传值，弹窗并不在本组件内，这并不重要
	let sendMessage = function () {
		if (res.data.data.presidePosition.member) {
			that.$bus.$emit("hudong", res.data.data.presidePosition.member);
		} else {
			that.$bus.$emit("hudong", false);
		}
	};

	// 关键代码
	let debounce = function (fn, time) {
		let timeout = null; // 创建一个标记用来存放定时器的返回值
		return function () {
			clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
			timeout = setTimeout(() => {
				// 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
				fn.apply(this, arguments); //arguments是传入的参数
			}, time);
		};
	};

	setTimeout(debounce(sendMessage, showTime), 0); //由于下面添加的是click的监听事件，那么在进入直播间后，没有任何事件之前也是应该要计时的，所以添加了一个计时为0的固定定时器
	document.addEventListener("click", debounce(sendMessage, 5000), true);
}
```
