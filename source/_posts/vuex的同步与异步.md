---
title: vuex的同步与异步
date: 2022-02-15 17:40:12
tags: ["vue"]
categories: ["vue"]
---

[vueX 官方文档](https://v3.vuex.vuejs.org/zh/)

![vuex核心概念](vuex.png)

### 1、创建 store

```javascript
cosnt store = new Vuex.Store({
    //数据存储
    state:{
        showLoginComponents:false,//先定义
    },
    // 定义方法，更改state内部属性值(同步)
    mutations:{
        toggleShowLoginComponents(state, newValue) {//定义方法，传输2个参数
            state.showLoginComponents = newValue;//更改showLoginComponents值
        },
    },
    // 定义方法，更改state内部属性值(异步)
    Action:{},
    // store分割，概念类似小程序分包
    Module:{}
})
```

> **Module：**
> Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割

### 2、使用 store

#### 2.1 在 html 内使用

```html
<!-- 可以直接引用 -->
<el-avatar :size="size" :src="$store.state.userInfo.userIcon"></el-avatar>

<!-- 动态绑定class的时候也可以根据store的值进行判断 -->
<button
  style="
            width: 146px;
            height: 34px;
            background: #ffffff;
            border-radius: 19px;
            border: 1px solid #49dcd0;
            color: #49dcd0;
          "
  class="head"
  @click="showComponent = true"
  v-if="showBtn"
  :class="{disabled:$store.state.disableUpdateAvatar}"
>
  修改头像
</button>
```

#### 2.2 在 js 内使用

```javascript
import store from "../../../store";

 // 图片上传
    upload(param) {
      function generateTimeReqestNumber() {
        let date = new Date();
        return (
            date.getFullYear().toString() +
            "/" +
            pad2(date.getMonth() + 1) +
            pad2(date.getDate())
        );
      }

      function pad2(n) {
        return n < 10 ? "0" + n : n;
      }

      getOSSToken()
          .then((res) => {
            if (res.data.code == 0) {
              let {accessKeyId, accessKeySecret, securityToken} =
                  res.data.data.aliyunSTSToken;
              let client = new OSS({
                region: "oss-cn-beijing",
                accessKeyId: accessKeyId,
                accessKeySecret: accessKeySecret,
                stsToken: securityToken,
                bucket: "库名",
                endpoint: '域名',
                cname: true
              });
              this.isShow = true;
              client
                  .put(
                      `/10013/user/icon/${generateTimeReqestNumber()}/${uuidv4()}.png`,
                      param
                  )
                  .then((res) => {
                    console.log(res, '阿里图片存储');
                    let {url} = res
                    console.log(url)
                    verifyImageAliOss(url).then(res => {
                      console.log(res, '头像替换检测')
                      let {suggestion} = res.data.data
                      console.log(suggestion)
                      console.log(234)
                      if (suggestion == 'pass') {
                        console.log(123)
                        // store使用
                        store.commit("setUserIcon",url);
                        let icon =store.state.userInfo
                        console.log(icon)
                        this.showComponent = false;
                      } else {
                        Message.error('该图片不支持')
                        this.showComponent = false;
                      }
                    }).catch(err => {
                      console.log(err)
                    })

                  });
            }
          })
          .catch((err) => {
            console.log(err);
          });
    },
```
