---
title: Vue核心技巧与实战完全指南
date: 2022-06-05 00:00:00
tags: [vue, 实战, 组件通信, 路由, 状态管理, 过滤器]
categories: 前端开发
updated: 2019-09-16 16:00:00
---

# Vue核心技巧与实战完全指南

Vue.js 作为一款流行的前端框架，在实际开发中有很多实用的技巧和最佳实践。本文将系统性地介绍Vue开发中的核心知识点，包括组件通信、路由管理、状态管理等，并通过实际案例展示如何在实际项目中应用这些技巧。

## 1. Vue组件通信完整指南

### 1.1 父子组件通信

#### 父组件向子组件传值（Props）

父组件通过 props 属性向子组件传递数据：

```vue
<!-- 父组件 Parent.vue -->
<template>
  <div>
    <ChildComponent
      :message="parentMessage"
      :user-info="userInfo"
      @update-message="handleUpdate"
    />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue'

export default {
  components: { ChildComponent },
  data() {
    return {
      parentMessage: 'Hello from Parent',
      userInfo: {
        name: 'John',
        age: 30
      }
    }
  },
  methods: {
    handleUpdate(newMessage) {
      this.parentMessage = newMessage
    }
  }
}
</script>
```

```vue
<!-- 子组件 ChildComponent.vue -->
<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ userInfo.name }} - {{ userInfo.age }}</p>
    <button @click="sendMessageToParent">发送消息给父组件</button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
      default: 'Default message'
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  methods: {
    sendMessageToParent() {
      this.$emit('update-message', 'Hello from Child')
    }
  }
}
</script>
```

#### 子组件向父组件传值（$emit）

子组件通过 `$emit` 触发事件向父组件传递数据：

```vue
<!-- 实际案例：排序组件 -->
<template>
  <div class="sort-component">
    <i class="el-icon-top" @click="moveUp(index)"></i>
    <i class="el-icon-bottom" @click="moveDown(index)"></i>
  </div>
</template>

<script>
export default {
  name: 'SortComponent',
  props: {
    index: {
      type: Number,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    moveUp(currentIndex) {
      if (currentIndex <= 0) {
        this.$message.warning('已经到顶了')
        return
      }

      const newData = [...this.data]
      const temp = newData[currentIndex]
      newData[currentIndex] = newData[currentIndex - 1]
      newData[currentIndex - 1] = temp

      this.$emit('update-data', newData)
    },

    moveDown(currentIndex) {
      if (currentIndex >= this.data.length - 1) {
        this.$message.warning('已经到底了')
        return
      }

      const newData = [...this.data]
      const temp = newData[currentIndex]
      newData[currentIndex] = newData[currentIndex + 1]
      newData[currentIndex + 1] = temp

      this.$emit('update-data', newData)
    }
  }
}
</script>

<style scoped>
.sort-component {
  display: inline-flex;
  gap: 10px;
}

.sort-component i {
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.sort-component i:hover {
  background-color: #f0f0f0;
}
</style>
```

### 1.2 兄弟组件通信

#### 方法一：通过父组件中转

```vue
<!-- 父组件作为中转站 -->
<template>
  <div>
    <ChildA @message-to-b="handleMessageToB" />
    <ChildB :received-message="messageToB" />
  </div>
</template>

<script>
import ChildA from './ChildA.vue'
import ChildB from './ChildB.vue'

export default {
  components: { ChildA, ChildB },
  data() {
    return {
      messageToB: ''
    }
  },
  methods: {
    handleMessageToB(message) {
      this.messageToB = message
    }
  }
}
</script>
```

#### 方法二：Event Bus（事件总线）

```javascript
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()
```

```vue
<!-- 发送消息的组件 -->
<template>
  <button @click="sendMessage">发送消息</button>
</template>

<script>
import { EventBus } from './event-bus'

export default {
  methods: {
    sendMessage() {
      EventBus.$emit('custom-event', {
        data: 'Hello from Component A',
        timestamp: Date.now()
      })
    }
  }
}
</script>
```

```vue
<!-- 接收消息的组件 -->
<template>
  <div>
    <p>接收到的消息：{{ receivedMessage }}</p>
  </div>
</template>

<script>
import { EventBus } from './event-bus'

export default {
  data() {
    return {
      receivedMessage: ''
    }
  },
  mounted() {
    EventBus.$on('custom-event', this.handleMessage)
  },
  beforeDestroy() {
    EventBus.$off('custom-event', this.handleMessage)
  },
  methods: {
    handleMessage(payload) {
      this.receivedMessage = payload.data
      console.log('接收时间：', new Date(payload.timestamp))
    }
  }
}
</script>
```

#### 方法三：Vuex状态管理

对于复杂的应用，推荐使用 Vuex 进行状态管理：

```javascript
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sharedData: '',
    userInfo: null
  },
  mutations: {
    SET_SHARED_DATA(state, data) {
      state.sharedData = data
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    updateSharedData({ commit }, data) {
      commit('SET_SHARED_DATA', data)
    },
    updateUserInfo({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
    }
  },
  getters: {
    getSharedData: state => state.sharedData,
    getUserInfo: state => state.userInfo
  }
})
```

### 1.3 跨层级组件通信

#### provide/inject

```vue
<!-- 祖先组件 -->
<template>
  <div>
    <ChildComponent />
  </div>
</template>

<script>
export default {
  provide() {
    return {
      theme: 'dark',
      userInfo: this.userInfo,
      updateTheme: this.updateTheme
    }
  },
  data() {
    return {
      userInfo: {
        name: 'John',
        role: 'admin'
      }
    }
  },
  methods: {
    updateTheme(newTheme) {
      // 更新主题逻辑
      console.log('主题更新为：', newTheme)
    }
  }
}
</script>
```

```vue
<!-- 后代组件 -->
<template>
  <div>
    <p>当前主题：{{ theme }}</p>
    <p>用户信息：{{ userInfo.name }} - {{ userInfo.role }}</p>
    <button @click="changeTheme">切换主题</button>
  </div>
</template>

<script>
export default {
  inject: ['theme', 'userInfo', 'updateTheme'],
  methods: {
    changeTheme() {
      const newTheme = this.theme === 'dark' ? 'light' : 'dark'
      this.updateTheme(newTheme)
    }
  }
}
</script>
```

## 2. Vue路由管理详解

### 2.1 路由守卫完整指南

Vue Router 提供了导航守卫，主要通过跳转或取消的方式来守卫导航。

#### 全局前置守卫

```javascript
// router/index.js
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 设置页面标题
  document.title = to.meta.title || '默认标题'

  // 检查是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查用户是否已登录
    if (!store.getters.isAuthenticated) {
      // 未登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // 检查用户权限
      const hasPermission = await checkUserPermission(to.meta.roles)
      if (hasPermission) {
        next()
      } else {
        next('/403')
      }
    }
  } else {
    next()
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 结束进度条
  NProgress.done()

  // 页面访问统计
  analytics.track('page_view', {
    path: to.path,
    name: to.name,
    from: from.path
  })
})

// 权限检查函数
async function checkUserPermission(requiredRoles) {
  const userRoles = store.getters.getUserRoles
  if (!requiredRoles || requiredRoles.length === 0) {
    return true
  }
  return requiredRoles.some(role => userRoles.includes(role))
}

export default router
```

#### 路由独享守卫

```javascript
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: (to, from, next) => {
      // 在进入该路由前执行
      if (checkAdminPermission()) {
        next()
      } else {
        next('/unauthorized')
      }
    },
    children: [
      {
        path: 'users',
        component: UserManagement
      }
    ]
  }
]
```

#### 组件内守卫

```vue
<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      userData: null,
      isLoading: false
    }
  },

  // 在进入该组件前执行
  beforeRouteEnter(to, from, next) {
    // 此时组件实例还未创建，不能访问this
    next(vm => {
      // 通过vm访问组件实例
      vm.loadUserData(to.params.id)
    })
  },

  // 在路由改变但该组件被复用时调用
  beforeRouteUpdate(to, from, next) {
    this.loadUserData(to.params.id)
    next()
  },

  // 在离开该组件时调用
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const answer = window.confirm('确定要离开吗？未保存的更改将丢失。')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },

  methods: {
    async loadUserData(userId) {
      this.isLoading = true
      try {
        this.userData = await this.$api.getUser(userId)
      } catch (error) {
        this.$message.error('加载用户数据失败')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
```

### 2.2 路由传参的四种方式

#### 方式一：通过 router-link 传参

```vue
<template>
  <!-- 静态路由 -->
  <router-link to="/user/123">用户详情</router-link>

  <!-- 动态路由 -->
  <router-link :to="`/user/${user.id}`">{{ user.name }}</router-link>

  <!-- 对象形式 -->
  <router-link
    :to="{
      name: 'UserDetail',
      params: { id: user.id }
    }"
  >
    {{ user.name }}
  </router-link>
</template>
```

#### 方式二：$router.push - path + params

```javascript
// 发送参数
this.$router.push({
  path: `/user/${userId}`,
  query: { source: 'list' }
})

// 接收参数
mounted() {
  const userId = this.$route.params.id
  const source = this.$route.query.source
  console.log('用户ID：', userId)
  console.log('来源：', source)
}
```

#### 方式三：$router.push - name + params

```javascript
// 发送参数
this.$router.push({
  name: 'UserDetail',
  params: {
    id: userId,
    tab: 'profile'
  }
})

// 接收参数
mounted() {
  const userId = this.$route.params.id
  const tab = this.$route.params.tab
  console.log('用户ID：', userId)
  console.log('当前标签：', tab)
}
```

#### 方式四：$router.push - name + query

```javascript
// 发送参数
this.$router.push({
  name: 'UserList',
  query: {
    page: 1,
    pageSize: 10,
    keyword: 'search term',
    filters: JSON.stringify({ status: 'active' })
  }
})

// 接收参数
mounted() {
  const page = parseInt(this.$route.query.page) || 1
  const pageSize = parseInt(this.$route.query.pageSize) || 10
  const keyword = this.$route.query.keyword
  const filters = JSON.parse(this.$route.query.filters || '{}')

  this.loadUserList({ page, pageSize, keyword, filters })
}
```

### 2.3 路由配置最佳实践

```javascript
// router/index.js
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

// 路由懒加载
const Home = () => import('@/views/Home.vue')
const About = () => import('@/views/About.vue')
const NotFound = () => import('@/views/NotFound.vue')

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '首页',
        keepAlive: true
      }
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        title: '关于我们',
        requiresAuth: false
      }
    },
    {
      path: '/user/:id',
      name: 'UserDetail',
      component: () => import('@/views/UserDetail.vue'),
      props: true, // 将路由参数作为组件props传递
      meta: {
        title: '用户详情',
        requiresAuth: true
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: '页面未找到'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
```

## 3. Vue过滤器与工具函数

### 3.1 全局过滤器

虽然Vue 3中移除了过滤器，但在Vue 2中过滤器仍然很有用：

```javascript
// filters/index.js
import Vue from 'vue'

// 日期格式化
Vue.filter('formatDate', (value, format = 'YYYY-MM-DD') => {
  if (!value) return ''
  return dayjs(value).format(format)
})

// 数字千分位
Vue.filter('formatNumber', (value) => {
  if (!value) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

// 文件大小格式化
Vue.filter('formatFileSize', (value) => {
  if (!value) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
})

// 随机数生成（用于测试数据）
Vue.filter('random30', (number) => {
  const num = parseInt(number)
  if (num < 30) {
    return Math.round(Math.random() * 20 + 30)
  }
  return num
})
```

### 3.2 局部过滤器

```vue
<template>
  <div>
    <p>创建时间：{{ createTime | formatDate('YYYY-MM-DD HH:mm:ss') }}</p>
    <p>文件大小：{{ fileSize | formatFileSize }}</p>
    <p>在线人数：{{ onlineCount | random30 }}人</p>
  </div>
</template>

<script>
export default {
  filters: {
    // 局部过滤器
    currency(value, symbol = '¥') {
      if (!value) return `${symbol}0.00`
      return `${symbol}${parseFloat(value).toFixed(2)}`
    },

    statusText(value) {
      const statusMap = {
        0: '待处理',
        1: '处理中',
        2: '已完成',
        3: '已取消'
      }
      return statusMap[value] || '未知状态'
    }
  }
}
</script>
```

## 4. Vue性能优化技巧

### 4.1 组件懒加载

```javascript
// 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  }
]

// 异步组件
Vue.component('async-component', () => import('./AsyncComponent.vue'))

// 高级异步组件
const AsyncComponent = () => ({
  component: import('./AsyncComponent.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

### 4.2 使用Object.freeze优化大数据

```javascript
// 对于大型静态数据，使用Object.freeze避免响应式转换
export default {
  data() {
    return {
      // 大型列表数据不会被响应式处理，提升性能
      largeList: Object.freeze(getLargeListData()),
      // 静态配置数据
      config: Object.freeze({
        apiBaseUrl: 'https://api.example.com',
        timeout: 5000
      })
    }
  }
}
```

### 4.3 v-if vs v-show的选择

```vue
<template>
  <div>
    <!-- 条件很少改变时使用v-if -->
    <heavy-component v-if="showComponent" />

    <!-- 频繁切换时使用v-show -->
    <popup-component v-show="showPopup" />
  </div>
</template>
```

### 4.4 key的正确使用

```vue
<template>
  <!-- 错误示例：使用index作为key -->
  <div v-for="(item, index) in list" :key="index">
    {{ item.name }}
  </div>

  <!-- 正确示例：使用唯一ID作为key -->
  <div v-for="item in list" :key="item.id">
    {{ item.name }}
  </div>

  <!-- 当列表项包含子组件且需要重新渲染时 -->
  <user-card
    v-for="user in userList"
    :key="`user-${user.id}-${user.updatedAt}`"
    :user="user"
  />
</template>
```

## 5. 实战案例总结

### 5.1 项目结构建议

```
src/
├── components/          # 通用组件
│   ├── base/           # 基础组件
│   └── business/       # 业务组件
├── views/              # 页面组件
├── store/              # Vuex状态管理
├── router/             # 路由配置
├── api/                # API接口
├── utils/              # 工具函数
├── filters/            # 过滤器
└── mixins/             # 混入
```

### 5.2 开发规范

1. **组件命名**：使用PascalCase命名组件
2. **Props验证**：始终为props定义类型验证
3. **事件命名**：使用kebab-case命名事件
4. **代码组织**：按逻辑顺序组织组件选项

### 5.3 调试技巧

```javascript
// 使用Vue DevTools
// 在组件中添加调试标记
export default {
  name: 'MyComponent',
  data() {
    return {
      debug: process.env.NODE_ENV === 'development'
    }
  },
  mounted() {
    if (this.debug) {
      console.log('Component mounted:', this.$options.name)
    }
  }
}
```

## 总结

Vue.js 的强大之处在于其简洁的API和灵活的组件系统。通过掌握本文介绍的核心技巧，你可以：

1. **灵活处理组件通信**：根据不同场景选择合适的通信方式
2. **精通路由管理**：熟练使用路由守卫和参数传递
3. **优化应用性能**：通过合理的代码组织提升应用性能
4. **提高开发效率**：使用最佳实践减少开发中的常见问题

在实际项目中，建议根据项目需求选择合适的技术方案，并遵循Vue的官方最佳实践，这样可以构建出可维护、高性能的Vue应用。