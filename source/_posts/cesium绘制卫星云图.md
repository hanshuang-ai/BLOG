---
title: cesium绘制卫星云图
tags: [cesium, 地图, 可视化, 3d, 卫星云图]
categories: 前端开发
---

### 加载卫星云图（同样使用polygon来加载）

#### 设置好图片要显示的范围

#### 添加polygon

### 卫星云图动图

#### 准备多张卫星云图图

#### 使用CallbackProperty动态material赋值

#### 定时器轮流改变i值

*`如果卫星云图颜色过深，遮盖住了地球表面，可以在material里面设置一个透明度`*

```javascript
color: Cesium.Color.WHITE.withAlpha(0.6) // 这里的颜色不会对图片材质造成影像
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <title>卫星图</title>
    <script src="https://cesiumjs.org/releases/1.57/Build/Cesium/Cesium.js"></script>
    <script src="https://cdn.bootcss.com/jquery/3.0.0/jquery.min.js"></script>
    <link href="https://cesiumjs.org/releases/1.57/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
    <style>
        html,
        body,
        #cesiumContainer {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #000000;
        }
    </style>

</head>

<body>
<div id="cesiumContainer">
</div>
<script>

    // 创建地球底图
    var viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
            url: 'http://www.google.cn/maps/vt?lyrs=s@716&x={x}&y={y}&z={z}'
        })
    });

    // 设置视角
    viewer.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2)
    });

    var urls = [
        "./sate/SATE_L1_F2G_VISSR_MWB_NOM_FDI-201906171300.HDF.png",
        "./sate/SATE_L1_F2G_VISSR_MWB_NOM_FDI-201906171400.HDF.png",
        "./sate/SATE_L1_F2G_VISSR_MWB_NOM_FDI-201906171500.HDF.png",
        "./sate/SATE_L1_F2G_VISSR_MWB_NOM_FDI-201906171600.HDF.png",
        // "./sate/SATE_L1_F2G_VISSR_MWB_NOM_FDI-201906171700.HDF.png"
    ];

    // 设置云图范围
    var positions = [
        Cesium.Cartesian3.fromDegrees(50, 0),
        Cesium.Cartesian3.fromDegrees(145, 0),
        Cesium.Cartesian3.fromDegrees(145, 60),
        Cesium.Cartesian3.fromDegrees(50, 60)
    ];

    // 添加云图
    var i = 0;
    viewer.entities.add({
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy(positions),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            material: new Cesium.ImageMaterialProperty({
                image: new Cesium.CallbackProperty(function () {
                    return urls[i];
                })
            })
        }
    });

    // 云图切换
    setInterval(function () {
        i++;
        if (i == urls.length) {
            i = 0;
        }
    }, 1000);
</script>
</body>

</html>

```
