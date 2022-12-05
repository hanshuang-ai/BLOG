---
title: 微信小程序内使用echart
date: 2022-12-05 21:47:14
tags: ['小程序','可视化']
categories: ["日常开发"]
---

![微信小程序内使用echart](1.png)

## 1、下载代码后，拷贝ec-canvas到项目里
![下载代码后，拷贝ec-canvas到项目里](2.png)

## 2、在需要使用的页面内引入
```javascript
import * as echarts from '../../components/ec-canvas/echarts';
```

## 3、定义方法和实例化
```javascript
let chart = null;
let option = ''
function initChart(canvas, width, height, dpr) {
  console.log(canvas, width, height, dpr, 'canvas, width, height, dpr');
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  }, 'dark');
  canvas.setChart(chart);
  option = {};
  chart.setOption(option);
  return chart;
}
```
## 4、异步获取数据，进行表格设置
```javascript
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [
      { url: '' },
    ],
    stepList: [],
    stepList1: [],
    showRemarkModal: false,
    ec: {
      onInit: initChart
    },
    bodyContainer:false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    let isLogin = wx.getStorageSync('userInfo')
    if (!isLogin.nickName) {
      console.log('没有登录');
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      console.log('已登录');
      let list = await utils.utils.getWeRunData().then((r)=>{return r}).catch(rr=>{return rr})
      console.log(list,'list');
      if (!list) {
        console.log('.............r');
        this.setData({
          bodyContainer:false
        })
        wx.hideTabBar({
          animation: true,
        })
        return
      }
      // bodyContainer
      let dateArr = []
      let dataArr = []
      list.map(item => {
        item.time = getYYYYMMDD(item.timestamp * 1000)
      })
      let list1 = list.slice(list.length - 7, list.length)
      list1.map(item => {
        dateArr.push(item.time)
        dataArr.push(item.step)
      })
      console.log(dateArr, '天数');
      console.log(dataArr, '步数');
      this.setData({ stepList: list, stepList1: list1,bodyContainer:true },function () {
        setTimeout(function () {
          chart.setOption({
            title: {
              show: false,
              text: "lorem",
              textStyle: {
                color: 'blue',
                fontSize: 14,
              },
            },
            tootip: {
              show: true,
              trigger: 'axis'
            },
            xAxis: {
              data: dateArr,
              name: '日期',
              type: 'category',
              nameTextStyle: {
                color: 'red',
                verticalAlign: "top",
                fontSize: 6,
              },
              nameRotate: -45,
              axisLabel: {
                fontSize: 10
              }
            },
            yAxis: {
              type: 'value',
              name: '步数',
              nameRotate: 45,
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: 6,
                color: 'red'
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'red',
                }
              },
              axisTick: {
                show: true,
                inside: true,
                lineStyle: {
                  color: 'blue'
                }
              },
              axisLabel: {
                fontSize: 10
              }
            },
            series: [
              {
                data: dataArr,
                type: 'line',  //bar line pie
                smooth: true,
                lineStyle: {
                  color: "red"
                },
                itemStyle: {
                  color: '#000'
                },
                label: {
                  show: true,
                  color: 'green'
                },
              }
            ]
          })
        }, 1000)
      })
      
      function getYYYYMMDD(string) {
        const d = new Date(string);
        const datetime = (d.getMonth() + 1) + "/" + d.getDate()
        return datetime;
      }
    }
  },
```