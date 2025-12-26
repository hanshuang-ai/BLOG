---
title: Vue组件通信完全指南
date: 2025-12-26 10:00:00
tags: ['vue', '组件', '通信']
categories: ['vue']
---

# Vue组件通信完全指南

Vue组件通信是Vue开发中的核心内容。本文将系统性地介绍Vue中各种组件通信方式，帮助你全面掌握组件间的数据传递技巧。

## 1. 父子组件通信

### 1.1 父传子（Props）

父组件通过`props`向子组件传递数据。

**子组件接收：**

```vue
<template>
  <div class="operate">
    <!-- i和data 是父组件传输过来的 -->
    <i class="el-icon-bottom" @click="toNext(i, data)"></i>
    <i class="el-icon-top" @click="toPrev(i, data)"></i>
  </div>
</template>

<script>
export default {
  name: 'sort',
  props: {
    i: Number,
    data: Array
  },
  methods: {
    toNext(index, data) {
      if (index >= data.length - 1) {
        index = data.length - 1
        this.$message({
          message: '已经到底',
          type: 'warning'
        })
      } else {
        let arr = data
        let obj = data[index]
        arr[index] = arr[index + 1]
        arr[index + 1] = obj
        data = arr
        // 设置updateData方法，并将data返回给父组件
        this.$emit('updateData', data)
      }
    },
    toPrev(index, data) {
      if (index <= 0) {
        index = data.length - 1
        this.$message({
          message: '已经到顶',
          type: 'warning'
        })
      } else {
        let arr = data
        let obj = data[index]
        arr[index] = arr[index - 1]
        arr[index - 1] = obj
        data = arr
        // 设置updateData方法，并将data返回给父组件
        this.$emit('updateData', data)
      }
    }
  }
}
</script>
```

**父组件传递：**

```vue
<template>
  <div>
    <!-- 将i和data传输给子组件，子组件做完操作后并返回 -->
    <sort :i="i" :data="manages" @updateData="updateData"/>
  </div>
</template>

<script>
import Sort from '@/components/components/sort'

export default {
  name: 'create',
  components: { Sort },
  data() {
    return {
      manages: [
        { text: 111 },
        { text: 222 }
      ]
    }
  },
  methods: {
    updateData(data) {
      // 将子组件返回的数据赋值给父组件，并更新视图
      this.manages = data
      this.$forceUpdate()
    }
  }
}
</script>
```

### 1.2 子传父（$emit）

子组件通过`$emit`触发事件，向父组件传递数据。

```javascript
// 子组件触发事件
this.$emit('updateData', data)

// 父组件监听事件
<sort :i="i" :data="manages" @updateData="updateData"/>
```

### 1.3 使用.sync修饰符

`.sync`修饰符是子组件修改父组件数据的语法糖。

**不使用sync：**

```html
<!-- 父组件 -->
<child :num="numParent" @setNum="(res)=> numParent = res"></child>

<!-- 子组件 -->
<script>
methods: {
  changNum() {
    this.$emit('setNum', 666)
  }
}
</script>
```

**使用sync：**

```html
<!-- 父组件 -->
<child :num.sync="numParent"></child>

<!-- 子组件 -->
<script>
methods: {
  changNum() {
    //使用update：参数的形式进行更新
    this.$emit('update:num', 666)
  }
}
</script>
```

> **注意**：区分`$emit`和`$on`
> - `$emit`和`$on`需要共同作用于一个公共的实例上
> - 通常用一个空的Vue实例作为中央事件总线

```javascript
// 创建事件总线
Vue.prototype.$bus = new Vue();

// 发送事件
this.$bus.$emit('play', '参数');

// 接收事件
this.$bus.$on('play', (data) => {
  console.log(data)
});
```

## 2. 兄弟组件通信

### 2.1 通过父组件中转

兄弟组件可以通过父组件作为中介来传递数据：

```javascript
// 兄弟组件A -> 父组件 -> 兄弟组件B
// A组件：this.$emit('data', data)
// 父组件：@data="handleData"
// B组件：:data="data"
```

### 2.2 事件总线（Event Bus）

创建一个空的Vue实例作为中央事件总线：

```javascript
// main.js
const bus = new Vue();
Vue.prototype.$bus = bus;

// 需要发送数据的组件
if (res.data.data.presidePosition.member.userIcon.length > 1) {
  this.$bus.$emit("hudong", res.data.data.presidePosition.member.userIcon);
  console.log(res.data.data.presidePosition.member.userIcon);
}

// 需要接收数据的组件
beforeMount() {
  this.$bus.$on('hudong', (url) => {
    console.log(url, 'url')
    this.avatar = url
  })
}
```

### 2.3 Vuex状态管理

对于复杂的应用，推荐使用Vuex进行状态管理：

```javascript
// store.js
export default new Vuex.Store({
  state: {
    sharedData: null
  },
  mutations: {
    setSharedData(state, data) {
      state.sharedData = data
    }
  },
  actions: {
    updateSharedData({ commit }, data) {
      commit('setSharedData', data)
    }
  }
})

// 组件A：发送数据
this.$store.dispatch('updateSharedData', data)

// 组件B：接收数据
computed: {
  sharedData() {
    return this.$store.state.sharedData
  }
}
```

## 3. 插槽通信

插槽是Vue中一种强大的内容分发机制，包括具名插槽和作用域插槽。

### 3.1 具名插槽

```vue
<!-- 子组件 -->
<template>
  <div class="scroll-list-card">
    <slot name="cardContent" :cardData="item" :cardWidth="cardWidth"></slot>
  </div>
</template>
```

### 3.2 作用域插槽

作用域插槽可以让插槽内容访问子组件的数据：

```vue
<!-- 子组件：滚动组件 -->
<view :style="{ height: '100%', width: '100%' }">
  <scroll-view
    :class="['wtListScrollColumn', isScroll ? '' : 'clsScroll']"
    :style="{ height: '100%', width: '100%', gap: about + 'Px', gridRowGap: cardDown + 'Px' }"
    :scroll-y="isScroll">
    <block v-for="(item, index) in listData" :key="index">
      <view class="scroll-list-card" :style="{ width: cardWidth + 'Px' }">
        <!-- 关键点：cardContent是具名插槽的名称，cardData是插槽声明时的变量 -->
        <slot name="cardContent" :cardData="item" :cardWidth="cardWidth" ref="scroll-list-card"></slot>
      </view>
    </block>
  </scroll-view>
</view>
```

```vue
<!-- 父组件使用 -->
<view class="store-scroll" v-if="isShowH5ScrollView && storeList.length > 0">
  <wt-list-scroll-column :list-data="storeList" :cardWidth="731" :cardDown="32" :about="32">
    <!-- cardContent是插槽名称，cardData是子组件传递的数据，sitem是父组件接收的props -->
    <template #cardContent="{ cardData }">
      <card :sitem="cardData" />
    </template>
  </wt-list-scroll-column>
</view>
```

```vue
<!-- Card组件 -->
<template>
  <view class="store-item-wrap">
    <view class="store-item" @tap="handleStoreItem(sitem)">
      <view class="index-store-name">
        {{ sitem.name }}
      </view>
      <view class="index-store-detail-info">
        <!-- 店铺大图 -->
        <view class="index-store-photo-wrap">
          <view v-if="sitem.openinfo"
            :class="sitem.openinfo === '休息中' ? 'index-store-status-close' : 'index-store-status-open'"
            class="index-store-status">
            {{ sitem.openinfo }}
          </view>
          <image class="index-store-front-img" :src="sitem.frontimg" />
        </view>
      </view>
    </view>
  </view>
</template>
```

## 4. 路由传参

Vue Router提供了多种路由传参的方式。

### 4.1 router-link传参

```javascript
// 父组件
<router-link to="/room">跳转</router-link>

// 子组件接收
this.$route.params
```

### 4.2 $router.push + path

```javascript
// 父组件传值
<button @click="deliverParams(123)">push传参</button>

methods: {
  deliverParams(id) {
    this.$router.push({
      path: `/d/${id}`
    })
  }
}

// 子组件接收
mounted() {
  this.id = this.$route.params.id
}
```

### 4.3 $router.push + name, params

```javascript
// 父组件传值
<button @click="deliverByName()">params传参</button>

methods: {
  deliverByName() {
    this.$router.push({
      name: 'B',
      params: {
        sometext: '一只羊出没'
      }
    })
  }
}

// 子组件接收
<template>
  <div id="b">
    This is page B!
    <p>传入参数：{{ this.$route.params.sometext }}</p>
  </div>
</template>
```

### 4.4 $router.push + name, query

```javascript
// 父组件传值
<button @click="deliverQuery()">query传参</button>

methods: {
  deliverQuery() {
    this.$router.push({
      path: '/c',
      query: {
        sometext: '这是小羊同学'
      }
    })
  }
}

// 子组件接收
<template>
  <div id="C">
    This is page C!
    <p>这是父组件传入的数据: {{ this.$route.query.sometext }}</p>
  </div>
</template>
```

**传参方式对比：**

| 方式 | URL显示 | 刷新丢失 | 适用场景 |
|------|---------|----------|----------|
| router-link | 无参数 | ❌ 不丢失 | 简单跳转 |
| path + 动态路由 | `/d/123` | ❌ 不丢失 | RESTful风格 |
| name + params | 无参数 | ✅ 丢失 | 隐藏参数 |
| name + query | `?sometext=xxx` | ❌ 不丢失 | 需要保留参数 |

## 5. 跨级组件通信

### 5.1 provide/inject

`provide`和`inject`可以实现跨级组件通信：

```javascript
// 祖先组件
export default {
  provide() {
    return {
      theme: this.theme,
      updateTheme: this.updateTheme
    }
  },
  data() {
    return {
      theme: 'light'
    }
  },
  methods: {
    updateTheme(newTheme) {
      this.theme = newTheme
    }
  }
}

// 后代组件
export default {
  inject: ['theme', 'updateTheme'],
  mounted() {
    console.log(this.theme) // 'light'
    this.updateTheme('dark')
  }
}
```

### 5.2 $attrs/$listeners

`$attrs`和`$listeners`可以实现跨级属性和事件传递：

```vue
<!-- 祖先组件 -->
<parent :name="name" :age="age" @click="handleClick"></parent>

<!-- 父组件 -->
<template>
  <div>
    <!-- v-bind="$attrs"透传所有属性，v-on="$listeners"透传所有事件 -->
    <child v-bind="$attrs" v-on="$listeners"></child>
  </div>
</template>

<!-- 子组件 -->
<script>
export default {
  inheritAttrs: false, // 不继承根元素属性
  mounted() {
    console.log(this.$attrs) // { name: 'xxx', age: 20 }
  }
}
</script>
```

## 6. 总结

Vue组件通信方式汇总：

| 通信方式 | 适用场景 | 优点 | 缺点 |
|---------|---------|------|------|
| Props/$emit | 父子组件 | 简单直接 | 跨层级麻烦 |
| .sync修饰符 | 双向绑定 | 语法简洁 | Vue3已移除 |
| 事件总线 | 兄弟/跨级 | 灵活 | 难以维护 |
| Vuex | 复杂应用 | 集中管理 | 配置繁琐 |
| 插槽 | 内容分发 | 灵活性高 | 理解成本 |
| 路由传参 | 页面跳转 | URL同步 | 刷新问题 |
| provide/inject | 跨级组件 | 解耦 | 响应式问题 |
| $attrs/$listeners | 跨级透传 | 自动传递 | 可能冗余 |

**选择建议：**
- 简单父子：Props + $emit
- 兄弟组件：事件总线或Vuex
- 跨级通信：provide/inject或Vuex
- 复杂应用：Vuex状态管理
- 内容分发：插槽
