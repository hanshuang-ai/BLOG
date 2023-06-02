---
title: elementUI
date: 2022-09-26 17:51:46
tags: ["elementUI"]
categories: ["UI"]
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
        :data="tableData.slice((pageControl.pageIndex-1)*(pageControl.limit),(pageControl.pageIndex)*(pageControl.limit)"
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

    // 分页
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageControl.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageControl.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

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

## 3、对单元格数据进行处理

```javascript
 <el-table
        :data="tableData.slice((pageControl.pageIndex-1)*(pageControl.limit),(pageControl.pageIndex)*(pageControl.limit)"
        border style="width: 100%;margin-top: 40px;" height="650" stripe
        v-loading="loading" :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center'}">
      <el-table-column prop="date" label="功能域"></el-table-column>
      <el-table-column prop="name" label="功能类"></el-table-column>
      // 对单元格数据进行处理，后端返回1/2/3，在后端返回的基础上前端自行添加LV字符串
      <el-table-column prop="vehicleFunctionLevel" label="功能等级">
        <template slot-scope="scope"><span>LV{{scope.row.vehicleFunctionLevel}}</span></template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="edit()">编辑</el-button>
        </template>
      </el-table-column>
  </el-table>
```

## 4、级联选择器自定义 children

```javascript
// 在props里进行设置
<el-cascader
  v-model="value"
  :options="options"
  :props="{ expandTrigger: 'hover',label:'name',value:'id',children:'childFunctionList' }"
  @change="handleChangeSelect">
</el-cascader>
```

## 5、级联选择器@change 失效的问题

```javascript
<el-cascader
  filterable
  v-model="value12"
  :options="options"
  :props="{ expandTrigger: 'hover'}"
  @change="handleChangeSelect"
  style="width: 600px">
</el-cascader>

// 绝大部分情况下，@change失效都是由于我们的数据格式错误，虽然可以显示，但是与官网案例不符，我们需要自己改造
// 尤其需要注意的是children没有下一级的时候需要删除该key

changeKey(arr) {
      for (let i = 0; i < arr.length; i++) {
        // arr[i].value = arr[i].id
        // arr[i].label = arr[i].name
        // arr[i].children = arr[i].childFunctionList
        if (arr[i].childFunctionList.length) {
          this.changeKey(arr[i].childFunctionList)
        } else {
          delete arr[i].childFunctionList
        }
      }
      return arr
},
```

## 5、日期选择器 基于 el-date-picker 的前一天和后一天

```html
<div
	class="block"
	style="text-align: left; margin-bottom: 10px;display: flex;align-content: center;justify-content: space-between;">
	<div style="display: flex;align-content: center;justify-content: flex-start;">
		<el-date-picker
			v-model="searchDate"
			type="date"
			placeholder="选择日期"
			@change="changeDate"
			style="margin-right: 30px">
		</el-date-picker>
		<div class="nextAndPre">
			<el-button @click="beforeDate">前一天</el-button>
			<el-button @click="afterDate">后一天</el-button>
		</div>
	</div>
	<div class="copyContainer">
		<el-button type="primary" @click="copy"> 复制排班 </el-button>
		<el-button type="primary" @click="paste"> 粘贴排班 </el-button>
		<el-button type="primary" @click="copyAndPaste"> 复制并排满当周 </el-button>
	</div>
</div>
```

```javascript
 // setDate() 方法将月份中的某一天设置为日期对象。
 //前一天
    beforeDate() {
      this.searchDate = new Date(this.searchDate.setDate(this.searchDate.getDate() - 1)
    },
    //后一天
    afterDate(){
      this.searchDate = new Date(this.searchDate.setDate(this.searchDate.getDate() + 1)
    },
```

## 6、表格 type="selection" 清除选择

```javascript
<el-table :data="projectList" height="400" @selection-change="handleSelectionChange_" ref="multipleTable" v-if="showAssociatedItems">
          <el-table-column type="selection" width="55" :selectable='checkboxT' v-if="!isRemoveAssociation"></el-table-column>
          <el-table-column type="selection" width="55" :selectable='checkboxT1' v-else="isRemoveAssociation"></el-table-column>
          <el-table-column label="项目" prop="name"></el-table-column>
</el-table>
```

`上面的代码示例，要实现的效果是点击不同的按钮，在展现的表格中可以进行不同的多选`
_但遇到的问题是：表格在重新展示时，上一次选择的数据虽然要往接口传输的已经清空，但 UI 上还在回显_

**解决办法**
在 UI 消失的时候，清空选择

```javascript
watch: {
    showAssociatedItems() {
      if (!this.showAssociatedItems) {
        this.$refs.multipleTable.clearSelection();
      }
    }
  }
```

## 7、表格列项文字溢出 tooltip 提示

```javascript
//:show-overflow-tooltip="true"
<el-table
        :data="tableData.slice((pageControl.pageIndex - 1) * (pageControl.limit), (pageControl.pageIndex) * (pageControl.limit)"
        :header-cell-style="{ textAlign: 'center' }"
        style="width: 100%;margin-bottom: 20px;margin-top: 40px;" row-key="id" border height="70vh"
        :tree-props="{ children: 'childFunctionList', hasChildren: 'hasChildren' }" v-loading="loading"
        default-expand-all>
      <el-table-column prop="id" label="功能ID" :show-overflow-tooltip="true"></el-table-column>
</el-table>
```
