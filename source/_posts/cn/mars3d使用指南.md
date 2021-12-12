---
title: mars3d使用指南
tag: ['可视化','mars3d']
categories: ['框架']
---

`本文只是mars3d的使用，并且使用的方式是直接在html内编写，不涉及Vue或其他方式`

开发指南:http://mars3d.cn/apidoc
官网demo:http://mars3d.cn/example

*`本文随时更新`*

# 基本概念
mars3d是在cesium基础上二次封装的一个前端框架，继承与扩展了cesium的功能，开源但是不能用于商业用途，会有水印与log信息。

## 图层
mars3d图层（个人理解）就是在canvas（webgl）上添加一类元素的容器。经常使用到的有geoLayer,imageLayer,divLayer、模型等

### geoLayer
geoLayer主要用来加载geoJson数据，并根据geoLayer数据的type值进行不同的渲染，可以生成点、线、面等

### imageLayer
imageLayer主要用来加载img图片，该图片会随earthMap一同缩放，这是它与divLayer最大的不同

### divLayer
divLayer主要用来加载自定义div元素，它不同earthMap缩放，在检查代码中会发现它是脱离canvas元素的（随earthMap一同缩放的都是在canvas元素中的），由于它脱离canvas，但是又相对于earthMap有位置的定位，所以当earthMap宽高超出屏幕范围时，会导致浏览器滚动条的出现，如果没有特殊需求，不建议使用。
***`由于divLayer脱离canvas元素，当使用canvas录屏的时候，是无法录取该元素的，这就导致操作时看到的内容与录屏后视频显示的内容不一致`***

### 模型加载
mars3d是支持模型加载的，并且即使加载的是动态模型，也不会导致浏览器的回流与重绘。但是当imageLayer加载的是gif动图时，即使earthMap没有任何操作，也会因为gif序列帧的问题引起浏览器的回流与重绘。
***`建议需要动图时，直接上模型`***
相关测试可查看[浏览器回流与重绘测试](http:www.baidu.com)


---
# 基础使用
---
# 应用demo解析
## 加载离线地球
## 加载图片模拟克里金插值
## 加载icon图片作为图标方式
## 加载gif动图
## 加载3D模型图