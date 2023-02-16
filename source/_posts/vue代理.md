---
title: vue代理
date: 2023-02-16 17:08:01
tags: ["vue", "代理"]
categories: ["进阶"]
---

![vue代理](1.png)
`vue-cli-service serve其实是开了一个node服务器，请求/api/bbb的时候，会被中转到https://aaa/bbb，简单理解就是根据vue.config.js的配置将/api替换为''`

## 1. vue.config.js 设置

```javascript
// vue.config.js
devServer: {
        proxy: {
            "/api": {
                target: "https://aaa/",
                secure: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    },
```

## 2. 页面内调用

```javascript
axios
	.post("/api/bbb", file, {
		// axios.post('https://tinypng.com/web/shrink', file, {
		headers: { "content-type": "image/png" },
		onUploadProgress: (ee) => {
			let progress = Math.floor((ee.loaded / ee.total) * 100);
			that.fileList.map((item) => {
				item.uid == uid ? (item.progress = progress) : "";
			});
			that.$forceUpdate();
		},
		onDownloadProgress: () => {},
	})
	.then((res) => {
		if (res.data.output) {
			let { url } = res.data.output;
			let uid = res.config.data.uid;
			let { size: oldSize } = res.data.input;
			let { size: newSize } = res.data.output;
			// console.log(((oldSize - newSize) / oldSize * 100))
			let radio = (((oldSize - newSize) / oldSize) * 100).toFixed(2);
			that.fileList.map((item) => {
				item.uid == uid ? (item.downLink = `${url}/${name}`) : "";
				item.uid == uid ? (item.radio = `${radio}`) : "";
			});
			that.$forceUpdate();
			console.log(this.fileList);
		}
	})
	.catch((err) => {
		console.log(err);
		that.$message.error(err);
	});
```
