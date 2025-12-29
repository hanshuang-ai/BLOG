---
title: js检测屏幕横竖屏
date: 2022-03-19 00:00:00
tags: [javascript, 横竖屏, 屏幕方向, 移动端]
categories: 前端开发
updated: 2019-12-19 10:01:19
---
```javascript
 // 页面加载进来的时候检测屏幕方向
window.addEventListener('load', function () {
    // 在这里检测屏幕方向
    console.log('屏幕方向:', window.orientation);
    showOrHide()
});
let dom = document.createElement('div');
// 监听屏幕方向变化
window.addEventListener("orientationchange", function () {
    showOrHide()
}, false);

function showOrHide() {
    if (Math.abs(window.orientation) != 90) {
        dom.style.width = '100%'
        dom.style.height = '100%'
        dom.style.background = '#fff'
        dom.style.position = 'fixed'
        dom.style.zIndex = 10000000000
        dom.innerText = '请使用横屏进行游戏'
        dom.style.textAlign = 'center'
        dom.style.paddingTop = '45vh'
        dom.style.color = '#000'
        document.body.appendChild(dom);
        setTimeout(() => {
            document.body.style.visibility = 'visible'
        }, 500)
    } else {
        console.log('横屏')
        if (document.body.contains(dom)) {
            document.body.removeChild(dom);
        }
        // document.body.style.display = 'block'
        document.body.style.visibility = 'visible'
    }
}
```
