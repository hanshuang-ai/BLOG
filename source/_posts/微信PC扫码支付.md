---
title: 微信PC扫码支付
date: 2021-12-31 18:12:25
tags: ["支付", "微信", "扫码"]
categories: ["三方"]
---

### 首先需要准备一个 dom 作为容器，放置 URL 转换的二维码

```html
<!--微信支付二维码-->
<el-dialog :visible.sync="dialogVisible" title="乐哇">
  <!-- 将URL转换为二维码有很多，这里需要在二维码中间展示logo，所以用的vue-qr -->
  <vue-qr :logoSrc="logo" :text="codeURL" :size="200"></vue-qr>
</el-dialog>
```

> 封装接口，调用后台接口
> 后台接口会返回一个 URL
> 将 URL 转变为二维码

```javascript
//请求后台接口
export function weixin(goodsId, quantity) {
  return axios.post(
    url,
    qs.stringify({
      goodsId: goodsId,
      quantity: quantity,
    }),
    // 自定义请求头，不需要的话可以不传
    {
      headers: {},
    }
  );
}

// 具体调用
let that = this;
weixin(payTtype, number)
  .then((res) => {
    console.log(res);
    if (res.data.code == 0) {
      this.showPayPage = false;
      this.payMethod = "weixin";
      this.dialogVisible = true;
      this.codeURL = res.data.data.codeUrl;
      // -1.失败 0.充值中 1.成功
      this.timer = setInterval(function () {
        // 微信支付结果查询
        searchWxResult(res.data.data.outTradeNo)
          .then((res) => {
            console.log(res);
            if (res.data.data.tradeStatus == 1) {
              clearInterval(this.timer);
              that.dialogVisible = false;
              that.load();
            }
          })
          .catch((err) => {
            clearInterval(this.timer);
            console.log(err);
          });
      }, 1000);
    }
  })
  .catch((err) => {
    console.log(err);
  });
```
