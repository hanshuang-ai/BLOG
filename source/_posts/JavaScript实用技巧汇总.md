---
title: JavaScript实用技巧汇总
date: 2023-02-13 00:00:00
tags: [javascript, js, 实用技巧, 防抖, 节流]
categories: 前端开发
updated: 2019-01-13 11:00:00
---

# JavaScript实用技巧汇总

JavaScript开发中有很多实用的技巧和最佳实践。本文汇总了开发中常用的技巧，包括函数防抖节流、页面加载事件、网页打印和正则表达式等。

## 1. 函数防抖与节流

防抖和节流是优化高频触发事件的常用技巧。

### 1.1 核心概念

- **防抖（Debounce）**：在指定的时间内只响应最后一次调用
- **节流（Throttle）**：在指定的时间内只响应第一次调用

### 1.2 防抖实现

**应用场景**：用户在直播间内，超过一段时间没有任何操作时弹出提示框，有操作则重新计时。

```javascript
// 防抖函数实现
function debounce(fn, time) {
  let timeout = null; // 创建一个标记用来存放定时器的返回值

  return function () {
    clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉

    timeout = setTimeout(() => {
      // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内
      // 如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments); // arguments是传入的参数
    }, time);
  };
}

// 使用示例
let sendMessage = function () {
  console.log('执行操作');
};

// 立即开始计时
setTimeout(debounce(sendMessage, 5000), 0);

// 每次点击都会重新计时
document.addEventListener("click", debounce(sendMessage, 5000), true);
```

**常用场景**：
- 搜索框输入联想
- 窗口resize事件
- 滚动事件优化

### 1.3 节流实现

```javascript
// 节流函数实现
function throttle(fn, time) {
  let canRun = true; // 通过闭包保存一个标记

  return function () {
    if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return

    canRun = false; // 立即设置为false

    setTimeout(() => {
      fn.apply(this, arguments);
      canRun = true; // 执行完事件后，重新将这个标记设置为true
    }, time);
  };
}

// 使用示例
window.addEventListener('scroll', throttle(function() {
  console.log('滚动事件');
}, 1000));
```

**常用场景**：
- 滚动事件
- 鼠标移动事件
- 按钮点击防止重复提交

### 1.4 防抖与节流对比

| 特性 | 防抖 | 节流 |
|------|------|------|
| 触发时机 | 停止触发后延迟执行 | 按固定频率执行 |
| 执行次数 | 最后一次触发时执行 | 第一次触发时执行 |
| 典型场景 | 搜索框、表单验证 | 滚动、resize |
| 时机描述 | "等会儿再说" | "按节奏执行" |

## 2. 页面加载事件

### 2.1 window.onload vs $(document).ready()

| 对比项 | window.onload | $(document).ready() |
|--------|---------------|---------------------|
| **执行时间** | 必须等到页面内包括图片的所有元素加载完毕后才能执行 | DOM结构绘制完毕后就执行，不必等到加载完毕 |
| **编写个数** | 不能同时编写多个，如果有多个window.onload方法，只会执行一个 | 可以同时编写多个，并且都可以得到执行 |
| **简化写法** | 无简化写法 | 可以简写成 `$(function(){});` |

```javascript
// JavaScript原生写法
window.onload = function() {
  console.log('页面所有资源加载完成');
};

// jQuery写法
$(document).ready(function() {
  console.log('DOM加载完成');
});

// jQuery简化写法
$(function() {
  console.log('DOM加载完成（简化写法）');
});
```

### 2.2 DOMContentLoaded事件

现代JavaScript推荐使用DOMContentLoaded事件：

```javascript
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM加载完成');
});
```

### 2.3 执行顺序示例

```html
<!DOCTYPE html>
<html>
<head>
  <script>
    // 1. 立即执行
    console.log('1. script标签执行');

    // 2. DOM加载完成执行
    document.addEventListener('DOMContentLoaded', function() {
      console.log('2. DOMContentLoaded');
    });

    // 3. jQuery ready
    $(document).ready(function() {
      console.log('3. jQuery ready');
    });

    // 4. 所有资源加载完成执行
    window.onload = function() {
      console.log('4. window.onload');
    };
  </script>
</head>
<body>
  <img src="large-image.jpg" alt="大图片">
</body>
</html>

// 输出顺序：
// 1. script标签执行
// 2. DOMContentLoaded
// 3. jQuery ready
// 4. window.onload
```

## 3. 网页打印

### 3.1 打印整个网页

```javascript
// 打印当前页面
window.print();
```

### 3.2 打印部分页面

通过CSS媒体查询控制打印内容：

```html
<style>
  /* 默认隐藏打印区域 */
  .print-area {
    display: none;
  }

  /* 打印时的样式 */
  @media print {
    /* 隐藏不需要打印的元素 */
    .no-print {
      display: none !important;
    }

    /* 显示打印区域 */
    .print-area {
      display: block !important;
    }

    /* 自定义打印样式 */
    body {
      font-size: 12pt;
      line-height: 1.5;
    }

    h1 {
      page-break-before: always;
    }

    .page-break {
      page-break-after: always;
    }
  }
</style>

<div class="no-print">
  <button onclick="window.print()">打印</button>
  <p>这部分不会打印</p>
</div>

<div class="print-area">
  <h1>打印内容</h1>
  <p>这部分会打印</p>
  <div class="page-break"></div>
  <p>第二页内容</p>
</div>
```

### 3.3 打印设置技巧

```css
@media print {
  /* 设置纸张大小 */
  @page {
    size: A4;
    margin: 2cm;
  }

  /* 设置页眉页脚 */
  @page {
    @top-center {
      content: "页眉内容";
    }
    @bottom-center {
      content: "第 " counter(page) " 页";
    }
  }

  /* 避免元素被分页截断 */
  .no-break {
    page-break-inside: avoid;
  }

  /* 打印背景颜色和图像 */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### 3.4 打印指定区域

```javascript
function printArea(areaId) {
  // 创建新窗口
  const printWindow = window.open('', '_blank');

  // 获取打印内容
  const printContent = document.getElementById(areaId).innerHTML;

  // 写入新窗口
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>打印</title>
      <style>
        body { font-family: Arial, sans-serif; }
        @media print {
          @page { margin: 1cm; }
        }
      </style>
    </head>
    <body>
      ${printContent}
    </body>
    </html>
  `);

  printWindow.document.close();

  // 等待内容加载完成后打印
  printWindow.onload = function() {
    printWindow.print();
    printWindow.close();
  };
}

// 使用
printArea('print-area');
```

## 4. 正则表达式技巧

### 4.1 捕获分组与替换

使用正则表达式的捕获分组功能，可以保存匹配的内容并在替换时引用。

```javascript
// 示例：将15vh内的数字替换成calc(var(--heightsize) * 数字，并把vh去掉
// (\d+\.\d+|\d+) 就是将匹配到的数字做暂存，在表达式内用$1进行引用

let data = "margin-top: 15vh; margin-top: 5vh; margin-top: 1111.555vh;";
console.log(data, "原始数据");

// 正则替换
let reg = data.replace(/(\d+\.\d+|\d+)vh/g, "calc(var(--heightsize) * $1)");
console.log(reg, "替换后");

// 输出：
// "margin-top: calc(var(--heightsize) * 15);
//  margin-top: calc(var(--heightsize) * 5);
//  margin-top: calc(var(--heightsize) * 1111.555);"
```

### 4.2 常用正则表达式

```javascript
// 手机号验证
const phoneReg = /^1[3-9]\d{9}$/;

// 邮箱验证
const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// 身份证号验证
const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

// URL验证
const urlReg = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

// IP地址验证
const ipReg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

// 密码强度验证（至少8位，包含大小写字母和数字）
const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// 中文验证
const chineseReg = /^[\u4e00-\u9fa5]+$/;

// 用户名验证（4-16位字母、数字、下划线）
const usernameReg = /^[a-zA-Z0-9_]{4,16}$/;
```

### 4.3 正则表达式常用方法

```javascript
// test() - 测试字符串是否匹配
const pattern = /\d+/;
console.log(pattern.test('abc123')); // true

// match() - 返回匹配的数组
const str = 'abc123def456';
console.log(str.match(/\d+/g)); // ['123', '456']

// replace() - 替换匹配的内容
const text = 'Hello World';
console.log(text.replace(/World/, 'JavaScript')); // 'Hello JavaScript'

// split() - 使用正则分割字符串
const csv = 'apple,banana;orange:grape';
console.log(csv.split(/[,:;]/)); // ['apple', 'banana', 'orange', 'grape']

// search() - 查找匹配的位置
const sentence = 'Hello World';
console.log(sentence.search(/World/)); // 6
```

### 4.4 正则表达式标志

| 标志 | 描述 | 示例 |
|------|------|------|
| `g` | 全局匹配 | `/a/g` 匹配所有a |
| `i` | 忽略大小写 | `/a/i` 匹配a和A |
| `m` | 多行匹配 | `/^a/m` 匹配每行开头的a |
| `s` | dotAll模式 | `/a./s` .匹配换行符 |
| `u` | Unicode模式 | `/^\u{20BB7}/u` 匹配Unicode字符 |
| `y` | 粘连模式 | 从lastIndex开始匹配 |

```javascript
// 全局替换
const str = 'Hello hello HELLO';
console.log(str.replace(/hello/gi, 'Hi'));
// 'Hi Hi Hi'

// 多行匹配
const text = 'line1\nline2\nline3';
console.log(text.match(/^line/gm));
// ['line1', 'line2', 'line3']
```

## 5. 其他实用技巧

### 5.1 数组去重

```javascript
// 使用Set
const arr = [1, 2, 2, 3, 4, 4, 5];
const unique = [...new Set(arr)];

// 使用filter
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);

// 使用reduce
const unique3 = arr.reduce((acc, cur) => {
  return acc.includes(cur) ? acc : [...acc, cur];
}, []);
```

### 5.2 数组排序

```javascript
// 数字排序
const nums = [3, 1, 4, 1, 5, 9];
nums.sort((a, b) => a - b); // 升序
nums.sort((a, b) => b - a); // 降序

// 对象数组排序
const users = [
  { name: 'Tom', age: 20 },
  { name: 'Jerry', age: 18 }
];
users.sort((a, b) => a.age - b.age);
```

### 5.3 深拷贝

```javascript
// 使用JSON（不能处理函数和undefined）
const deepCopy = JSON.parse(JSON.stringify(obj));

// 使用structuredClone（现代浏览器）
const deepCopy2 = structuredClone(obj);

// 手动实现
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));

  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}
```

### 5.4 类型判断

```javascript
// 精确判断类型
function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

console.log(getType([])); // 'Array'
console.log(getType({})); // 'Object'
console.log(getType(null)); // 'Null'
console.log(getType(undefined)); // 'Undefined'
console.log(getType(() => {})); // 'Function'
```

## 6. 总结

本文汇总了JavaScript开发中的实用技巧：

- **防抖与节流**：优化高频事件
- **页面加载事件**：理解不同加载阶段的区别
- **网页打印**：使用媒体查询控制打印内容
- **正则表达式**：强大的文本处理工具

掌握这些技巧可以让你的JavaScript代码更高效、更优雅。
