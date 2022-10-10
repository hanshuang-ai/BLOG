---
title: elementUI
date: 2022-09-26 17:51:46
tags: ["elementUI"]
---

## 1、表格表头居中

```javascript
// :header-cell-style="{ textAlign: 'center' }"  表头居中
// :cell-style="{ textAlign: 'center'}"  单元格居中
<el-table :data="tableData" border style="width: 100%;margin-top: 40px;" height="650" stripe :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center'}">
    <el-table-column prop="date" label="表头"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small" @click="edit()">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
```

## 2、表格分页

`后端一次性返回所有数据`

```javascript
// 数据截取
    <el-table
        :data="tableData.slice((pageControl.pageIndex-1)*(pageControl.limit),(pageControl.pageIndex)*(pageControl.limit))"
        border style="width: 100%;margin-top: 40px;" height="650" stripe
        v-loading="loading">
      <el-table-column prop="date" label="功能域">
      </el-table-column>
      <el-table-column prop="name" label="功能类">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="edit()">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    export default {
  name: "List",
  data() {
    return {
      value: '',
      options: [],
      value1: '',
      options1: [],
      checked: false,
      inputValue: '',
      tableData: [],
      tableRowData: [],
      CheckTableRowData: false,
      EditTableRowData: false,
      editValue: {},//编辑行时的数据存放
      searchData: {
        vehicleFunctionId: '',
        vehicleFunctionName: '',
        functionDomainId: '',
        functionClassId: ''
      },
      pageControl: {
        pageIndex: 1,//页码
        limit: 10,//页容量
      },
      total: 0,
      loading: true
    }
  },
  mounted() {
    this.search({})
  },
  methods: {
    search(data) {
      promise_post('list', {data}).then(res => {
        console.log(res, '数据')
        this.tableData = res //直接赋值所有数据
        this.total = res.length
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange(value) {
      console.log(value)
      this.pageControl.limit = value  //更改页容量
    },
    handleCurrentChange(value) {
      console.log(value)
      this.pageControl.pageIndex=value  //更改页码
    },
  }
}
```
