---
title: ElementUI
categories: ["日常开发", "UI"]
tags: ["代码片段"]
---

# 表格

## 表格文字居中

```html
<div class="table">
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    class="table"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
    height="600px"
  >
    <el-table-column prop="feedId" label="申请单号" />
    <el-table-column prop="feedUserId" label="申请人UID" />
    <el-table-column prop="userNickname" label="申请人昵称" />
    <el-table-column prop="createTime" label="发布时间" />
    <el-table-column prop="feedContent" label="扩列内容" />
    <el-table-column prop="artificialAuth" label="状态">
      <template slot-scope="scope"
        >{{ scope.row.artificialAuth | feedStatus }}
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="备注" />
    <el-table-column prop="address" label="操作">
      <template slot-scope="scope">
        <!--              <div v-show="scope.row.artificialAuth == 0">-->
        <div>
          <el-button type="success" size="mini" @click="pass(scope.row)"
            >通过
          </el-button>
          <el-button type="danger" size="mini" @click="Refuse(scope.row)"
            >拒绝
          </el-button>
        </div>
        <!--              </div>-->
      </template>
    </el-table-column>
  </el-table>
</div>
```

# 日期选择器

## 基于 el-date-picker 的前一天和后一天

```html
<div
  class="block"
  style="text-align: left; margin-bottom: 10px;display: flex;align-content: center;justify-content: space-between;"
>
  <div style="display: flex;align-content: center;justify-content: flex-start;">
    <el-date-picker
      v-model="searchDate"
      type="date"
      placeholder="选择日期"
      @change="changeDate"
      style="margin-right: 30px"
    >
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
      this.searchDate = new Date(this.searchDate.setDate(this.searchDate.getDate() - 1))
    },
    //后一天
    afterDate(){
      this.searchDate = new Date(this.searchDate.setDate(this.searchDate.getDate() + 1))
    },
```
