---
title: 判断设备是否支持touchstart
date: 2023-07-26 15:24:52
tags: ["实战"]
categories: [js]
---

在项目中，遇到一段代码，同一个元素同时绑定了 touchstart 和 click 两种事件，且同时指向了同一个函数，示例代码如下

```javascript
<template>
  <div id="app">
    <button @click="go('click')" @touchstart="go('touch')">go</button>
  </div>
</template>

<script>

export default {
  name: "App",
  methods: {
    go(string) {
      console.log("1", string);
    },
  },
};
</script>
```
由于是历史代码，不知道当初为什么将两种事件同时绑定，也不敢删除，所以添加了一个判断，判断当前设备是否支持touchstart，如果支持，就用touchstart，反之使用click
```javascript
<template>
  <div id="app">
    <button @click="go('click')" v-if="isTouchSupported">goclick</button>
    <button @touchstart="go('touch')" v-else>gotouch</button>
  </div>
</template>

<script>

export default {
  name: "App",
  data(){
    return{
      isTouchSupported:false
    }
  },
  mounted(){
    const isTouchSupported = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    console.log(isTouchSupported?'支持touchstart':'不支持touchstart');
    this.isTouchSupported = !isTouchSupported
  },
  methods: {
    go(string) {
      console.log("1", string);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

```
