---
uuid: 8fa7596a-1f70-2a1b-1b1e-378e75093495
title: nodejs打开浏览器
categories: 服务器
tags: [node, 代码片段]
---

```
const open = require('open')

let url = 'http://www.xxx.com'
open(url)
```