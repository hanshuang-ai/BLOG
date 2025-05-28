---
title: flex自适应布局
date: 2023-10-08 13:43:13
tags: ["实战"]
categories: [css]
---

_`先看下效果`_
<video width="100%" height="auto" controls>
<source src="/2023/10/08/flex-zi-gua-ying-bu-ju/动态flex.mp4" type="video/mp4">
</video>

```javascript
SetDynamicLayout();
{
	// 获取屏幕宽度
	// 屏幕宽度卡片取余
	// 取余后看一行能放下几个卡片
	// 将余数平均分配到每个卡片
	// 如果余数平分后不会造成拥挤到下一行
	// 余数平分后拥挤到下一行
	// 给卡片设置最后宽度
	let containerWidth;
	this.$nextTick(() => {
		setTimeout(() => {
			/*
             如果wtListScrollColumn元素在页面上没有显示，就使用自己传入的listWidth值，
             使用场景：业务代码内，使用v-show根据接口返回的数据 控制wtListScrollColumn元素的显示隐藏
            */
			if (this.$el.querySelector(".wtListScrollColumn").offsetWidth - this.about <= 0) {
				console.log("未获取到父元素宽度:", this.$el.querySelector(".wtListScrollColumn").offsetWidth);
				containerWidth = this.listWidth + this.about;
			}
			// 其他场景
			else {
				console.log("获取到父元素宽度:", this.$el.querySelector(".wtListScrollColumn").offsetWidth);
				containerWidth = this.$el.querySelector(".wtListScrollColumn").offsetWidth + this.about;
			}
			if (!this.fixedWidth) {
				console.log(containerWidth, "containerWidth");
				let remainder = containerWidth % (this.cardMinWidth + this.about); //计算后得出的余数
				console.log(remainder, "remainder");
				let numberCard = (containerWidth - remainder) / (this.cardMinWidth + this.about);
				console.log(numberCard, "numberCard");
				this.numberCard = numberCard;
				let average = (remainder / numberCard).toFixed(3);
				this.cardWidth = this.cardMinWidth + parseFloat(average);
				console.log(this.cardWidth, "this.cardWidth");
				// 将当前卡片宽度传递给父组件，用于根据UI要求完成其他元素布局
				this.$emit("cardWidthBoundary", this.cardWidth);
			} else {
				this.cardWidth = this.fixedWidth;
				let n = parseInt(containerWidth / (this.fixedWidth + this.about));
				this.n = n;
				let p = containerWidth - this.about - (this.fixedWidth * n + this.about * (n - 1));
				let d = document.querySelector(".wtListScrollColumn_");
				if (this.isCenter) {
					d.style.paddingLeft = parseInt(p / 2) + "Px";
				}
				console.log(n, p, "np");
			}
		}, 0);
	});
}
```
