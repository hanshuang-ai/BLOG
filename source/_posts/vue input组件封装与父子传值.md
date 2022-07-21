---
layout: vue
title: vue input组件封装与父子传值
date: 2022-07-21 17:15:52
tags: ['实操','vue']
---

vue中，父子组件之间相互传值在开发中是经常会用到的，但是input等输入框组件与其他组件会有些许差异，下面是在日常工作中总结的非常方便的使用方法。

> 我们的应用场景是：
> 子组件传递值给父组件
> 父组件拿到值后去进行数据请求
> 父组件可以清除子组件数据

`子组件`
```javascript
<template>
  <div>
    <el-input placeholder="请输入标题" v-model="title"></el-input>
  </div>
</template>

<script>
export default {
  name: 'selectByTitle',
  data () {
    return {
      title: ''
    }
  },
  watch: {
    title () {
      console.log(this.title)
      // 子组件传递值给父组件
      this.$emit('pushValue', this.title)
    }
  }
}
</script>

<style scoped>

</style>

```

`父组件`
```javascript
<template>
  <div>
    <!--排序与搜索-->
    <div class="selectContainer">
      <selectBySort :items="value"/>
      <select-by-date @pick="getDate"/>
      // 父组件拿到值后去进行数据请求，因为子组件在watch里面会检测数据，并传递到父组件
      <select-by-title @pushValue="getValue" ref="child"/>
    </div>
    <div class="btnGroup">
      <div>
        <el-button>搜索</el-button>
        <el-button @click="clear">清除</el-button>
      </div>
      <div>
        <el-button>创建新文章</el-button>
        <el-button>选择已有文章</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import selectBySort from '@/components/components/selectBySort'
import SelectByDate from '@/components/components/selectByDate'
import SelectByTitle from '@/components/components/selectByTitle'

export default {
  components: { SelectByTitle, SelectByDate, selectBySort },
  data () {
    return {
      value: [{ value: '1', label: '2' }],
      title: ''
    }
  },
  methods: {
    getDate (value) {
      console.log(value)
    },
    clear () {
      console.log('清除数据')
      // 清除子组件数据，下面这句话是关键，可以改变子组件的值
      this.$refs.child.title = 0
      console.log(this.title)
    },
    getValue (e) {
      console.log(e)
      this.title = e
    }
  }
}
</script>

<style lang="scss" scoped>
.selectContainer {
  display: flex;
}

.btnGroup {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  //>div{
  //  margin-left: 20px;
  //}
}
</style>

```