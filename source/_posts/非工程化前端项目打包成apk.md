---
title: 非工程化前端项目打包成apk
categories: 移动端开发
date: 2024-09-04 17:23:43
tags: [apk, 打包, 安卓, 混合应用]
---
使用 Cordova 打包 HTML 文件为 APK

```bash
npm install -g cordova
cordova create MyApp
cd MyApp
cordova platform add android
```
`将你已有的 HTML 文件复制到 www 目录中，确保 www 目录下有一个 index.html 文件，这是应用的入口文件`
```bash
cordova build android
```
`构建完成后，你会在 platforms/android/app/build/outputs/apk/debug/ 目录下找到生成的 APK 文件`
`如果因为gradle环境问题，使用命令`
```bash
cordova prepare android
gradle -b platforms/android/build.gradle build
```
