---
title: vue路由传参的四种方式
date: 2022-02-28 14:28:32
tags: ["vue"]
---

![vue路由传参的四种方式](1.png)

### 1、router-link

```javascript
// 父组件传值
<router-link to="/room">

// 子组件接收  this.$route.params

```

### 2、$router.push

#### 2.1、path

```javascript
// 父组件传值
<button @click="deliverParams(123)">push传参</button>
  methods: {
    deliverParams (id) {
      this.$router.push({
        path: `/d/${id}`
      })
    }
  }

  // 子组件接收
mounted () {
  this.id = this.$route.params.id
}
```

#### 2.2、name,params

```javascript
// 父组件传值
<button @click="deliverByName()">params传参</button>
    deliverByName () {
      this.$router.push({
        name: 'B',
        params: {
          sometext: '一只羊出没'
        }
      })
    }

// 子组件接收
<template>
  <div id="b">
    This is page B!
    <p>传入参数：{{this.$route.params.sometext}}</p>
  </div>
</template>
```

#### 2.3、name,query

```javascript
// 父组件传值
<button @click="deliverQuery()">query传参</button>
    deliverQuery () {
      this.$router.push({
        path: '/c',
        query: {
          sometext: '这是小羊同学'
        }
      })
    }

// 子组件接收
<template>
  <div id="C">
    This is page C!
    <p>这是父组件传入的数据: {{this.$route.query.sometext}}</p>
  </div>
</template>
```
