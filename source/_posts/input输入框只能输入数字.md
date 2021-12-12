---
title: input输入框只能输入数字
---

```html
<input
  placeholder="请输入手机号"
  oninput="value=value.replace(/[^\d]/g,'')"
  maxlength="11"
  class="phoneNumber"
  v-model="phoneNumber"
/>
```
