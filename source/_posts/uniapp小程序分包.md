---
title: uniapp小程序分包
date: 2022-01-14 15:19:25
tags: ["小程序"]
categories: ["日常开发"]
---

## 在 pages 同级目录下新建分包目录

`在pages同级目录下新建分包目录，大小不能超过2M`

![](fenbao.png)

> 小程序主包不能引用分包内的内容
> 各个分包之间也不能互相引用

## 在 pages.json 文件内写入分包路径

```json
"subPackages":[{
		"root":"pageOther",
		"pages":[
			{"path":"Recharge/Recharge"},
			{"path":"search/search"}
		]
	},{
		"root":"pageRoom",
		"pages":[
			{"path":"room"}
		]
	}]
```

## 小程序分包优化

```json
// 在manifest.json内添加  optimization
"optimization":{
			"subPackages":true
		}
```
![](youhua.png)