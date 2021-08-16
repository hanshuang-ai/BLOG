---
title: nodeCanvas渲染
---

近期项目涉及地理系统，使用的框架是mars3d

mars3d本身提供了加载[geojson](http:baidu.com)、图片以及模型的API，
但是在加载这些资源的时候，尤其是涉及到计算量比较大的时候，浏览器承担过重。
经过测试，该框架加载本地图片资源的时候速度有明显提升，所以就需要性能优化，
在服务器直接生成png图片，在需要使用的时候直接加载图片。
由于项目对geojson数据，尤其是边界线精度要求较高，暂时未生成图片。

`凡是引用包的地方，都需要先加载包，但是node canvas直接使用哪个npm引用有很大的几率会出现问题

`

# node加载数据
node加载数据使用的是自带的fs模块
```
let fs = require('fs')
let data = fs.readFileSync('XXX.json')
let obj = JSON.parse(data)
```

# 使用node canvas将数据绘制到canvas上
```
const {createCanvas} = canvas
const width = 2000
const height = 2000
const canvas = createCanvas(width,height)
const context = canvas.getContext('2d)
```

# 处理node canvas生成的base64数据，生成png
# 将png保存到本地

