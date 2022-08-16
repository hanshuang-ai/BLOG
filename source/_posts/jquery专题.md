---
title: jquery专题
date: 2022-05-07 15:10:10
tags: ['jquery']
---

## 判断一个元素是否在页面上显示或隐藏
```javascript
if($(a).is(':visible')){}   //判断是否显示
if($(a).is(':hidden')){}   //判断是否隐藏
```

## 为单选框添加选中或取消选中状态
```javascript
$('input').prop('checked', true);   //prop会为元素添加属性，并赋值
$('input').attr('checked', true);   //attr会查找元素，改变属性
```

## 判断当前元素的索引
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <ul>
            <li>0</li>
            <li>1</li>
            <li>2</li>
        </ul>
        <ul>
            <li>0</li>
            <li>1</li>
            <li>2</li>
        </ul>
    </div>
    <script src='https://code.jquery.com/jquery-3.2.1.min.js'></script>
    <script>
        $('li').click(function(){
            console.log(`这是在父元素下的索引  ${$(this).index()}`)
        })
        $('li').click(function(){
            console.log(`这是该元素在页面内的索引  ${$('li').index($(this))}`);
        })
    </script>
</body>
</html>
```