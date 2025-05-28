---
title: flex布局
date: 2023-08-01 15:27:19
tags: ['实战']
categories: [css]
---
### 1. align-items和align-content的区别

`align-items`和`align-content`都是CSS中用于控制flex容器内部项目对齐的属性，它们之间有一些区别。

1. `align-items`：
   - `align-items`是用来控制flex容器内部所有项目在交叉轴上的对齐方式。
   - 它可以接受的值包括：
     - `flex-start`：将项目对齐到交叉轴的起始位置。
     - `flex-end`：将项目对齐到交叉轴的结束位置。
     - `center`：将项目在交叉轴上居中对齐。
     - `baseline`：将项目的基线对齐。
     - `stretch`：如果项目未设置固定的尺寸，将会拉伸以填充整个交叉轴空间。

2. `align-content`：
   - `align-content`是用来控制flex容器内部多行项目在交叉轴上的对齐方式。
   - 它只有在容器内有多行项目时才会生效，而当只有一行项目时，`align-items`会控制该行项目的对齐方式。
   - 它可以接受的值包括：
     - `flex-start`：将多行项目对齐到交叉轴的起始位置。
     - `flex-end`：将多行项目对齐到交叉轴的结束位置。
     - `center`：将多行项目在交叉轴上居中对齐。
     - `space-between`：在每行项目之间均匀分布额外的空间。
     - `space-around`：在每行项目周围均匀分布额外的空间。
     - `stretch`：如果项目未设置固定的尺寸，将会拉伸以填充整个交叉轴空间。

简而言之，`align-items`用于控制flex容器内部单行项目的对齐方式，而`align-content`用于控制flex容器内部多行项目的对齐方式。如果只有一行项目，两者之间的区别将不会显现。

### 2. flex布局里面的margin
