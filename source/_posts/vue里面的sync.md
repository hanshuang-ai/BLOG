---
title: vue里面的sync
date: 2023-06-15 21:45:44
tags: ['vue']
---

vue中父组件是使用v-bind(缩写为:)给子组件传入参数，然后子组件通过prop属性接收该参数。此时我们可以给子组件传入一个函数，子组件通过调用传入的函数来改变父组件中参数的值。

## 1、不使用sync

`//父组件中通过@方法名来接收子组件传送来的数据`

```html

<child :num="numParent" @setNum="(res)=> numParent = res"></child>
```

`//子组件通过调用函数来实现修改父组件的状态`

```javascript
methods: {
  changNum()
  {
    this.$emit('setNum', 666)
  }
}
```

## 2、使用sync

`父组件`

```html

<child :num.sync="numParent">
```

`子组件`

```javascript
//使用update：参数  的形式进行更新
methods: {
  changNum()
  {
    this.$emit('update:num', 666)
  }
}
```

``需要注意区分$emit和$on，$emit和$on也经常用于组件传值，但是他俩需要共同作用于一个公共的实例上，通常用一个空的 Vue 实例作为中央事件总线，如果没有公共实例，$emit和$on是不能通信的``
```javascript
Vue.prototype.$bus = new Vue();

this.$bus.$emit('play', '参数');
this.$bus.$on('play', ()=>{xxx});
```