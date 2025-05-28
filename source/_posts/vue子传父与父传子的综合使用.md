---
title: vue子传父与父传子的综合使用
date: 2022-07-12 18:27:25
tags: ['vue','实战']
categories: [vue]
---
> vue父传子props
> 子传父  子组件触发$emit(fn,data)，父组件接收@fn=FN(父组件内的方法)

子组件
```vue
<template>
  <div class="operate">
    <!-- i和data 是父组件传输过来的 -->
    <i class="el-icon-bottom" @click="toNext(i,data)"></i>
    <i class="el-icon-top" @click="toPrev(i,data)"></i>
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
    toNext (index, data) {
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
    toPrev (index, data) {
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

<style scoped lang="scss">
.operate {
  i {
    margin-right: 20px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
```

```vue
<template>
  <!--新建与管理分组-->
  <div>
    <div class="create">
      <div @click="showDialog=true">新建</div>
      <div @click="showManage=true">管理</div>
    </div>
    <!--新建分组-->
    <div>
      <el-dialog :visible.sync="showDialog" title="创建分组" class="dialog">
        <el-input type="text"
                  placeholder="请输入内容"
                  v-model="text"
                  maxlength="6"
                  show-word-limit></el-input>
        <div class="btnGroup">
          <el-button type="success" @click="Determine">确定</el-button>
          <el-button type="danger" @click="Cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <!--管理分组-->
    <div>
      <el-dialog :visible.sync="showManage" title="管理分组" class="dialog">
        <div v-for="(manage,i) in manages" :key="i" class="manageItem">
          <div>{{ manage.text }}</div>
          <!-- 将i和data传输给子组件，子组件做完操作后并返回  updateData接收子组件返回的数据，并对返回的数据在自身内做处理 -->
          <sort :i="i" :data="manages" @updateData="updateData"/>
        </div>
        <div class="btnGroup">
          <el-button type="success" @click="DetermineManage">确定</el-button>
          <el-button type="danger" @click="CancelManage">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Sort from '@/components/components/sort'

export default {
  name: 'create',
  components: { Sort },
  data () {
    return {
      showDialog: false,
      text: '',
      showManage: false,
      manages: [
        { text: 111 },
        { text: 222 }
      ]
    }
  },
  methods: {
    Determine () {
      this.showDialog = false
    },
    Cancel () {
      this.showDialog = false
    },
    DetermineManage () {
      this.showManage = false
    },
    CancelManage () {
      this.showManage = false
    },
    updateData (data) {
      // 将子组件返回的数据赋值给父组件，并更新视图
      this.manages = data
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped lang="scss">
.create {
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    margin-left: 20px;
  }
}

.dialog {
  text-align: center;

  .btnGroup {
    margin-top: 30px;
  }
}

.manageItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

```
