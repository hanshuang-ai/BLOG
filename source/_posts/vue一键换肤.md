---
title: vue一键换肤
date: 2023-02-01 17:26:23
tags: ["vue"]
---

![vue一键换肤](1.png)

`本文只涉及到颜色主题和icon更换`

## 1、颜色更换

`通过class解决，包含字体、字号、字体颜色、背景颜色等，css控制`

## 2、icon 更换

### 2.1 通过 css background 控制

`配置多个css文件，通过覆盖的方式进行控制`

```javascript
//默认黑夜主题
.icon-delete {
	background: url("../../static/images/backup.png");
}

//更改为白天主题
.themeDay {
	.icon-delete {
		background: url("../../static/images/Outlined.png") !important;
	}
}

//只需要给非默认主题更高的优先级即可，其他非默认主题同理。因为一时间只能展示一个主题，不会出现多个非默认主题之间的覆盖（只需要保证覆盖掉默认主题即可）
//假如再多一个粉色主题

.themePink {
	.icon-delete {
		background: url("../../static/images/Outlined_Pink.png") !important;
	}
}
```

### 2.2 通过变量控制

```javascript
//写法1
<view class="icon-select-type-container">
	<image class="icon-select-type" :src="THEME.style == 'dark' ? `${right}` : `${right_light}`" />
</view>

right: require("@static/images/right.png"),
right_light: require("@static/images/icon_go.png"),

//写法2
<view class="icon-select-type-container">
	<image
		class="icon-select-type"
		:src="require(`@static/images/${THEME.style == 'dark' ? `${right_light_2}` : `${right_light_1}`}.png`)" />
</view>

right_light_1: 'icon_go',
right_light_2: 'right',
```
