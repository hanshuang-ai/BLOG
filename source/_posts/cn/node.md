---
uuid: b186c704-0d81-6b50-de5a-35c118be7695
title: node
---
# 跨域
## node原生引入的http创建的服务器解决跨域问题
```
const http = require('http');
http.createServer((req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");//跨域
    res.end('12')
}).listen('3000')

```