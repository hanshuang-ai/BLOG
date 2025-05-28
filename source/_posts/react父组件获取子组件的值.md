---
title: react父组件获取子组件的值
date: 2024-03-27 14:47:15
tags: [ react,父子组件 ]
categories: [ react ]
---

## 1. 
### 1.1 事件是在子组件内控制
```javascript
// 子组件
import styles from './card.module.scss'
import {useRef, useState} from "react";
// onValueChange是父组件传递过来的函数
export default function Card({onValueChange} ) {
    function setNumber() {
        setN(n = n + 1)
        onValueChange(n)
    }
    return (
        <div>
            <div className={styles.card}>
                {data.map((item) => (
                    <div key={item} className={styles.cardItem}>{item}</div>
                ))}
            </div>
            <button onClick={setNumber}>这是{n}</button>
        </div>
    );
}
```

```javascript
// 父组件
import styles from './Home.module.scss'
import Card from "../compoments/card";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
function Home() {
    let button = useRef(null)
    function handleValue(value) {
        if (value > 5) {
            button.current.style.color = 'red'
        }
    }
    return (
        <div className={styles.indexContainer}>
            <Card onValueChange={handleValue}></Card>
        </div>
    )
}
export default Home
```
### 1.2 事件在父组件内空控制
```javascript
// 子组件  只负责渲染
export default function Card({arr} ) {
    return(
        <div>
            {arr.map(item=>(
                <div key={item}>{item}</div>
            ))}
        </div>
    )
}
```
```javascript
// 父组件  负责传值和事件控制
import React, { useState } from 'react';
import Card from "../compoments/card";

function Home() {
    const [ARR, setARR] = useState([1, 2, 3]);
    const handleArr = () => {
        setARR(prevARR => [...prevARR].reverse());
    };
    return (
        <div>
            <Card arr={ARR} />
            <button onClick={handleArr}>翻转数组</button>
        </div>
    );
}
export default Home;
```
