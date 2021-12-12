---
title: vue打包创建时间戳
---

```javascript
const Version = new Date()
  .getTime()
  .toString()
  .match(/.*(.{8})/)[1];
module.exports = {
  publicPath: "./",
  //  这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。
  configureWebpack: {
    externals: {
      qc: "QC",
    },
    output: {
      filename: `js/[name].${Version}.js`,
      chunkFilename: `js/[name].${Version}.js`,
    },
  },
};
```
