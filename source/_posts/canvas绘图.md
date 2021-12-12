---
title: canvas绘图
tag: ['canvas']
categories: ['可视化']
catalog: true
---

# canvas点连线生成图片
canvas点连线生成等值线就是将数组内索引为0的元素设置为起点，moveTo该点
其余点使用lineTo进行连接，
`当涉及到多维数组的时候，需要进入到数组的最内部循环进行上述操作`
**注意：如果需要绘制的图形铺满整个画布，则需要先计算出所有坐标点的极值点
，即最大最小的x、y，再结合画布width和height，算出每个方向上的缩放
倍率scaleX和scaleY，moveTo和lineTo的时候需要将缩放倍率计算进去**
```
let xmin, xmax;
let ymin, ymax;
let xArr = [];
let yArr = [];
let scalex, scaley;

function drawChina() {
  // 解析边界线
  let obj = fs.readFileSync("./data/china.json");
  let object = JSON.parse(obj);
  let features = object.features;
  
  // 计算极值
  for (let i = 0; i < features.length; i++) {
    let geo = features[i].geometry;
    let coor = geo.coordinates;
    for (let j = 0; j < coor.length; j++) {
      for (let m = 0; m < coor[j].length; m++) {
        for (let k = 0; k < coor[j][m].length; k++) {
          xArr.push(coor[j][m][k][0]);
          yArr.push(coor[j][m][k][1]);
        }
      }
    }
  }
  let b = Array.from(new Set(xArr));
  let num1, num2; //最小值与最大值
  num1 = b[0];
  num2 = b[1];
  for (let i = 0; i < b.length - 1; i++) {
    if (b[i] < num1) {
      num1 = b[i];
    }
    if (b[i] > num2) {
      num2 = b[i];
    }
  }
  // console.log(num1, num2);
  xmin = num1;
  xmax = num2;

  let a = Array.from(new Set(yArr));
  let num3, num4; //最小值与最大值
  num3 = a[0];
  num4 = a[1];
  for (let i = 0; i < a.length - 1; i++) {
    if (a[i] < num3) {
      num3 = a[i];
    }
    if (a[i] > num4) {
      num4 = a[i];
    }
  }
  ymin = num3;
  ymax = num4;

  // 打印极值
  console.log(xmin, xmax, ymin, ymax);

  // 循环绘制
  for (let i = 0; i < features.length; i++) {
    let feature = features[i];
    let geometry = feature.geometry;
    let type = geometry.type;
    let coordinates = geometry.coordinates;
    // 得到不同方向上的倍率
    scalex = (xmax - xmin) / width;
    scaley = (ymax - ymin) / height;
    if (type === "Polygon") {
      drawPolygon0(coordinates, scalex, scaley);
    } else if (type === "MultiPolygon") {
      for (let j = 0; j < coordinates.length; j++) {
        let polygon = coordinates[j];
        drawPolygon0(polygon, scalex, scaley);
      }
    }
  }

  // node环境保存图片，与绘制无关，可以不使用
  function saveChina() {
    const image = canvas.toDataURL("image/png");
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const bufferData = new Buffer(base64Data, "base64");
    fs.writeFile(
      "./result/img/" + new Date().getTime() + ".png",
      bufferData,
      function (err) {
        if (err) {
          ////console.log(err);
        } else {
          ////console.log("图片保存成功");
        }
      }
    );
  }

  // saveChina()

  function drawPolygon0(polygon, scalex, scaley) {
    ctx.beginPath();
    let points = polygon[0];
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      let x = Number(point[0]);
      let y = Number(point[1]);
      
      // 根据倍率移动点位置，进行满铺
      // 由于canvas坐标系左上角为顶点，越往下y值越大，所以需要翻转
      let l = (x - xmin) / scalex;
      let t = height - (y - ymin) / scaley;
      if (t == 0) {
        // console.log("0");
      }

      if (i === 0) {
        ctx.moveTo(l, t);
      } else {
        ctx.lineTo(l, t);
      }
    }
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.strokeStyle = "rgba(255,0,0,1)";
    ctx.lineWidth = 2;
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

```

# canvas颜色的填充
canvas在绘制等值线（或者说是闭合区域的时候）往往需要在区域内填色，根据
globalCompositeOperation的不同属性值，会得到不同的结果，具体需要填色的情况
选择不同的属性值
`在有要求的情况下，可以根据闭合区域不同的高度值（假如是等高线）进行不同的填色`
```
function drawOther() {
  let colors = {
    zuigaowen: [
      { Value_Min: 10, Value_Max: 15, color: "#F3BF48" },
      { Value_Min: 15, Value_Max: 20, color: "#FFAF41" },
      { Value_Min: 20, Value_Max: 25, color: "#F98E20" },
      { Value_Min: 25, Value_Max: 30, color: "#FF760A" },
      { Value_Min: 30, Value_Max: 35, color: "#EC5418" },
      { Value_Min: 35, Value_Max: 40, color: "#EE0D20" },
      { Value_Min: 40, Value_Max: 45, color: "#C70321" },
    ],
    dibiaowendushikuang: [
      { Value_Min: 10, Value_Max: 20, color: "#A7DC32" },
      { Value_Min: 20, Value_Max: 30, color: "#F0C828" },
      { Value_Min: 30, Value_Max: 40, color: "#F09D29" },
      { Value_Min: 40, Value_Max: 50, color: "#F06429" },
      { Value_Min: 50, Value_Max: 60, color: "#DF3418" },
      { Value_Min: 60, Value_Max: 70, color: "#C20D0D" },
      { Value_Min: 70, Value_Max: 80, color: "#890323" },
    ],
    bianwen: [
      { Value_Min: -6, Value_Max: -4, color: "#66A6FF" },
      { Value_Min: -4, Value_Max: -2, color: "#80CFFF" },
      { Value_Min: -2, Value_Max: 0, color: "#9AF9FF" },
      { Value_Min: 0, Value_Max: 2, color: "#FFFB87" },
      { Value_Min: 2, Value_Max: 4, color: "#FCDF76" },
      { Value_Min: 4, Value_Max: 6, color: "#F8BE5C" },
    ],
    jiangshui: [
      // { Value_Min: -10, Value_Max: 0.1, color: "rgba(0,0,0,0)" },
      { Value_Min: -10, Value_Max: 0.1, color: "rgba(0,0,0,0)" },
      { Value_Min: 0.1, Value_Max: 10, color: "#7DF0FF" },
      { Value_Min: 10, Value_Max: 50, color: "#0E3FD9" },
      { Value_Min: 50, Value_Max: 75, color: "#072586" },
    ],
    fourteen: {
      zhongshu: {
        zs3: "#EB9700",
        zs4: "#DC521E",
        zs5: "#B00808",
      },
    },
  };

  let name = "./1.json";
  fs.readFile(name, (err, result) => {
    if (err) {
    } else {
      let object = JSON.parse(result);
      let { CLOSED_CONTOURS } = object;
      let arr = [];
      let color = "";
      let leixing = "fourteen";
      let leixing_child = "zhongshu";
      for (let i = 0; i < CLOSED_CONTOURS.length; i++) {
        let CLOSED_CONTOURS_i = CLOSED_CONTOURS[i];
        let { linePoint } = CLOSED_CONTOURS_i;
        let { markName } = CLOSED_CONTOURS_i.lineMark;
        console.log(colors[leixing][leixing_child][markName]);

        arr.push(linePoint);
        for (let m = 0; m < arr.length; m++) {
          drawPolygon(
            arr[m],
            scalex,
            scaley,
            colors[leixing][leixing_child][markName]
          );
        }
      }

      const image = canvas.toDataURL("image/png");
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const bufferData = new Buffer(base64Data, "base64");
      fs.writeFile(
        "./result/img/" + new Date().getTime() + ".png",
        bufferData,
        function (err) {
          if (err) {
          } else {
            console.log("图片保存成功");
          }
        }
      );
    }
  });

  function drawPolygon(points, scalex, scaley, color) {
    // console.log(scalex, scaley);
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      //   console.log(point);
      let x = Number(point["lot"]);
      let y = Number(point["lat"]);
      //   console.log(x, y);
      let l = (x - xmin) / scalex;
      let t = height - (y - ymin) / scaley;
      //   console.log(l, t);
      if (i === 0) {
        ctx.moveTo(l, t);
      } else {
        ctx.lineTo(l, t);
      }
    }
    // ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = color;
    ctx.strokeStyle = "#fff";
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

```

# canvas图形形状的截取
canvas形状的截取，尤其是既包含填色，又包含截取（按另一个图形的形状截取）的情况下，
强烈建议分两步
## 首先将目标canvas与源canvas生成图片，避免涂色相互影响的问题。
## 然后将两张图片进行叠加截图
**node环境为例**
```
/**
 * 测试canvas图像截取
 * 先画元素图
 * 再画中国地图
 * 再截取
 */
const fs = require("fs");
const {createCanvas, loadImage} = require("canvas");
const width = 800;
const height = 800;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

//降雨使用的方法(或者说是没有铺满中国的元素图的截取方法)
function a(){
    loadImage('./result/img/new/14/gaowen.png').then((yuansu) => {//加载元素图
        console.log('yuansu',yuansu)
        ctx.drawImage(yuansu, 0, 0, width, height)
        loadImage('./result/img/china.png').then((china)=>{//加载中国地图
            console.log('china',china)
            ctx.globalCompositeOperation = "destination-in";
            ctx.drawImage(china,0,0,width,height)
            function result() {
                const image = canvas.toDataURL("image/png");
                const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                const bufferData = new Buffer(base64Data, "base64");
                fs.writeFile(
                    "./result/img/" + new Date().getTime() + ".png",
                    bufferData,
                    function (err) {
                        if (err) {
                        } else {
                            console.log("图片保存成功");
                        }
                    }
                );
            }
            // setTimeout(function (){result()},1000)
            result()
        })
    })
}




function b(){
    loadImage('./result/img/china2.png').then((china) => {//加载中国地图
        console.log('china',china)
        ctx.drawImage(china, 0, 0, width, height)
        loadImage('./result/img/new/14/gaowen.png').then((yuansu)=>{//加载元素图
            console.log('yuansu',yuansu)
            //todo:目前除去降雨数据，其他的都用下面的属性
            // ctx.globalCompositeOperation = "source-atop"
            //降雨时属性
            // ctx.globalCompositeOperation = "destination-in";
            ctx.drawImage(yuansu,0,0,width,height)
            function result() {
                const image = canvas.toDataURL("image/png");
                const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                const bufferData = new Buffer(base64Data, "base64");
                fs.writeFile(
                    "./result/img/" + new Date().getTime() + ".png",
                    bufferData,
                    function (err) {
                        if (err) {
                        } else {
                            console.log("图片保存成功");
                        }
                    }
                );
            }
            // setTimeout(function (){result()},1000)
            result()
        })
    })
}

a()
// b()

```

*`总结：
在绘制闭合区域（只有数组没有顺序）的时候，需要注意canvas涂色覆盖的问题，
同时，需要截取复杂图形的时候，
不建议直接在一个canvas对象内使用，可以使用两张图片叠加的形式。
本文所使用的的环境是node，可以直接生成图片保存在本地，然后进行读取。
可以猜想，利用不同变量保存每个canvas生成的base64也可以直接在浏览器生成类似效果，
但本人未做尝试，只是猜想。
另外，本文没有使用clip属性进行截图操作，因为没有思路。
在颜色填充部分本文尝试使用save和restore属性，但是产生的结果与未使用时一致，
如各位了解该如何使用上述属性或有兴趣技术沟通，可直接与我联系
`*
