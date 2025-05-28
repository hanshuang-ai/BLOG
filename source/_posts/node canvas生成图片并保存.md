---
title: node canvas生成图片并保存
tag: ['可视化','node']
categories: ['可视化']
---

`canvas可以将画布转为base64，而base64就是该图片的信息，但是node保存文件的时候需要buffer格式的信息，所以只需要将canvas转成的base64处理成buffer，就可以保存`


总结如下：
***1、将画布信息转为base64***
***2、处理base64为buffer，进行保存***


### 1、引入canvas模块
```javascript
const {createCanvas} = require('canvas')
```

### 2、canvas绘图
```javascript
const canvas = createCanvas(200,200)
const ctx = canvas.getContext('2d')

ctx.font = '30px'
ctx.rotate(0.1)
ctx.fillText('Hello',50,100)
```

### 3、将画布信息转为base64
```javascript
const dataURl = canvas.toDataURL('image/png')
```

### 4、处理base64为buffer
```javascript
const base64Data = dataURl.replace(/^data:image\/\w+;base64,/, "");
const bufferData = new Buffer(base64Data,'base64')
```

### 5、保存buffer为图片格式
```javascript
fs.writeFile('2.png',bufferData,function (err){
    if (err){
        console.log(err)
    }else {
        console.log('图片保存成功')
    }
})
```

### 6、完整代码
```javascript
const {createCanvas} = require('canvas')
const fs = require('fs')

const canvas = createCanvas(200,200)
const ctx = canvas.getContext('2d')

ctx.font = '30px'
ctx.rotate(0.1)
ctx.fillText('Hello',50,100)

const dataURl = canvas.toDataURL('image/png')
console.log(dataURl)

const base64Data = dataURl.replace(/^data:image\/\w+;base64,/, "");
console.log(base64Data)
const bufferData = new Buffer(base64Data,'base64')
fs.writeFile('2.png',bufferData,function (err){
    if (err){
        console.log(err)
    }else {
        console.log('图片保存成功')
    }
})

```
