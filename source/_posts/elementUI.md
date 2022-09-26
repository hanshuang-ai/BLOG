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
