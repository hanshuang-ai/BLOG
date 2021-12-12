---
uuid: 561cf221-3cfc-fe4b-716b-8ed42fc23dbf
title: live-server使用
---

``本文适用于使用cnpm下载的live-server，使用npm或者其他方式下载的安装包未做测试``

```
与http-server比，live-server是一种自动热更新的工具包。
但是在启动http-server的时候，会自动启动127.0.0.1与本机ip地址两个链接以供访问，
这就使得内网内的设备都能访问。
但是live-server默认只会启动127.0.0.1（在没有修改包文件内index.js的时候）
导致每次想换启动地址时都需要去修改index.js文件，导致非常麻烦。

目前本机安装的live-server版本，可以通过在命令行内直接使用命令指定的方式修改端口和链接。
```

**修改端口**
```
live-server --port='8081'
```

<br>

**修改地址**
```
live-server --host='192.168.1.1'

注意host内应该是本机的内网ip地址，这样在同一个内网下，不同的设备才能访问我们开放的页面
```
