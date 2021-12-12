---
uuid: 9d859bb0-e140-d29e-4a13-30f0b3f9ca75
title: js设计模式
---

# 面向对象的三大特征

## 封装

声明一个函数，保存在一个首字母大写的变量里

### 通过this添加属性或者方法

```
let Student = function(id,name,age){
    this.id = id;  //通过this添加属性或者方法
    this.name = name;
    this.age = age;
    this.print = function(){
        console.log(this.name + this.age);
    }
}
```

### 通过prototype添加属性和方法

```
Stydent.prototype.display = function(){
    console.log('1')
}

或者

Student.prototype = {
    display:function(){
        console.log('2)
    },
    let score = function(){
        alert('123')
    }
}

```

### 通过this和prototype添加属性和方法的区别

`通过this添加的属性和方法是添加在了当前对象上，在使用new构造函数创建新对象时，添加的属性和方法会被复制到新对象上。`
`通过prototype添加的属性和方法  并不是  添加到对象本身上，所以在使用new构造函数创建新对象时，添加的属性和方法  不会  复制到新对象上`

![](http://qiniu.aoxuekj.com/WX20210330-150148.png)

### 私有变量和公共变量（以及属性）

`通过this或者prototype添加的属性和方法可以在外界访问到，可以看做时候公有变量和属性`
`未 通过this后者prototype添加的属性不能被实例访问到，是类的私有变量和属性`

![](http://qiniu.aoxuekj.com/WX20210330-153053.png)

#### 类的静态变量可以通过 [闭包](http://blog.aoxuekj.com/2021/03/30/%E9%97%AD%E5%8C%85/) 实现

闭包是有权访问另外一个函数作用域中变量的函数，即`在一个函数内部创建另外一个函数`

#### 创建对象的时候如果不使用new

![](http://qiniu.aoxuekj.com/WX20210330-173031%402x.png)

`new关键字的作用是对当前对象的this不停的赋值，如果创建对象的时候省略了new关键字，则会在全局作用域中执行，这样函数内的this指向window，所以在没有new关键字的情况下创建的函数里面的属性就指向window`

![](http://qiniu.aoxuekj.com/WX20210330-173728%402x.png)

### 如何检测一个对象添加的属性和方法的指向
***`constructor`***


## 继承

每个类大体都可以包含3个部分：
1、 `构造函数之内的，供`***`实例化对象`***`的时候复制使用。`
2、 `构造函数之外，直接通过点语法添加的，供`***`类`***`使用。`
3、 `类的原型中的，实例化对象可以通过其原型间接访问到的。`


## 多态
