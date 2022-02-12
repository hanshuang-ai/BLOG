---
title: 微信小程序使用svga
date: 2022-01-26 21:33:12
tags: ["小程序", "特效"]
categories: ['小程序']
---


`const { Parser, Player } = require("../../static/js/svgaplayer.weapp.js");`
```javascript
// 礼物特效
let arr1 = that.data.giftListCanvas;
if (t.ggif.indexOf("svga") > -1) {
  arr1.push({
    id: `id${new Date().getTime()}`,
    ggif: t.ggif,
  });
  console.log(arr1);
  that.setData({
    giftListCanvas: arr1,
  });

  let svgaPlay = async function (element, ggif) {
    console.log(arr1.length);
    that.setData({
      showGiftCanvas: true,
    });
    let parser = new Parser();
    console.log(parser);
    let player = new Player();
    player.loops = 1; //循环1次
    player.fillMode = "Forward"; //播放结束后保留最后一帧
    player.clearsAfterStop = true; //播放结束后清空画布
    await player.setCanvas(`#${element}`);
    let videoItem = await parser.load(`${ggif}`);
    console.log(videoItem);
    await player.setVideoItem(videoItem);
    player.startAnimation();
    // 礼物播放完的监听

    player.onFinished(() => {
      console.log("播放完了");
      arr1.shift();
      that.setData({
        showGiftCanvas: false,
        giftListCanvas: arr1,
      });
      if (arr1.length > 0) {
        svgaPlay(arr1[0].id, arr1[0].ggif);
      }
    });
    console.log(arr1);
  };
  if (arr1.length == 1) {
    svgaPlay(arr1[0].id, arr1[0].ggif);
  }
} else {
  wx.showToast({
    title: "暂不支持",
    icon: "none",
  });
}
```
