---
uuid: 264597ec-2fc7-82c1-cdab-14e926fe3721
title: es6
---

# 解构赋值

`从数组和对象中提取值，对变量进行赋值，这被称为解构`

## 数组的解构赋值

```
let [a,b,c] = [1,2,3];
console.log(a,b,c);// 1 2 3
```

`解构不成功，变量的值为undefined`
```
let [a,b] = [1];
console.log(a,b);// 1 undefined

let [a,b] = '1';
console.log(a,b);// 1 undefined
```

**如果等号右边不是可遍历的结构，会报错**

会报错的常见形式：

1、 数字

2、 布尔

3、 NaN

4、 undefined

5、null

6、{}  对象

## 解构赋值的应用
```
假设下面是某个请求的返回值，形参是res
{
    "status": 200,
    "msg": "成功",
    "data": {
        "pageNum": 1,
        "pageSize": 99,
        "size": 49,
    }
}

1、不用解构赋值
let data = res;
if(data.data.pageNum!==1){...}
写起来比较繁琐

2、使用解构赋值
let {data} = res;
if(data.pageNum!==1){...}
```
`这里需要注意的一点就是：声明的变量必须是返回值里面的某个属性，
也就是说：返回值内必须包含被声明的这个变量字段。`
