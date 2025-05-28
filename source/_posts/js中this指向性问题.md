---
title: js中this指向性问题
date: 2022-02-16 13:47:04
tags: ['js','专题']
categories: ["js"]
---

**`this的指向是由上下文环境动态决定的`**

> 全局环境
> 普通函数调用
> 由call/apply/bind函数调用
> 对象属性方法调用
> 构造函数调用
> 箭头函数

![this指向性问题](js中this指向性问题 /1.png)

[示例代码链接](js中this指向性问题 /https://github.com/hanshuang-ai/code/blob/master/this%E6%8C%87%E5%90%91%E6%80%A7%E9%97%AE%E9%A2%98.html)
### 1、全局环境 指向window

>  this指向全局对象（浏览器环境的window）

```javascript
a = 1; //需要注意的是  此处变量可以使用var声明，可以不声明，但是不能使用let或者const进行声明（点击此处查看不同声明方式之间的区别）
console.log(this.a)           //1
console.log(window.a)         //1
```

### 2、普通函数

>  1、严格模式 指向undefined
>  2、非严格模式 指向window

```javascript
function foo() {
    console.log(this)         //window对象
}

function foo2() {
    'use strict'
    console.log(this)        //undefined
}

foo()
foo2()
```

### 3、call/bind/apply函数调用

> 1、call/apply 这两个函数对象到方法能立即执行某个函数，并且将函数中的this绑定到你提供到对象上去
> 2、bind 方法永久的绑定函数中的this到指定对象上，并返回一个新函数，将来这个函数无论怎么调用都不会再改变

```javascript
function foo() {
    console.log(this)
}

function foo2() {
    console.log(this)
}

foo.call({name: 'aa'})  //{name:'aa'}
let aa = foo2.bind({num: '123'})
aa()  //{num: '123'}
aa.call({name: 'aa'})  //{num: '123'}  即使使用了call，也不会改变
```

### 4、对象属性方法调用

> 指向前面调用函数都那个对象

```javascript
const obj = {
    name: 'abc',
    fn: function () {
        return this
    }
}
console.log(obj.fn()
console.log(obj.fn() === obj)  //true
```

### 5、构造函数调用或者类上下文

> this指向的是new出来的那个对象实例本身

```javascript
function Person(name) {
    console.log(this)
    this.name = name
}

const p = new Person('1')
console.log(p)  //1
const pp = new Person('2')
console.log(pp)  //2
```

### 6、箭头函数中的this

> 箭头函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

```javascript
const obj2 = {
    name: "tom",
    foo() {
        setTimeout(() => {
            console.log(this);
        }, 1000);
    },
};
obj2.foo() // obj2
```
