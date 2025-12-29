---
title: Flex布局完全指南
date: 2022-08-02 00:00:00
tags: [css, flex, 布局, 弹性盒子, 响应式]
categories: 前端开发
updated: 2018-12-06 10:30:00
---

# Flex布局完全指南

Flexbox（弹性盒子布局）是CSS中一种强大的布局方式，能够轻松实现响应式和自适应布局。本文将系统性地介绍Flex布局的核心概念和实战应用。

## 1. 核心概念对比

### 1.1 align-items vs align-content

`align-items`和`align-content`都是用于控制flex容器内部项目对齐的属性，但它们有明显的区别。

#### align-items（单行对齐）

- **作用**：控制flex容器内所有项目在交叉轴上的对齐方式
- **适用**：单行项目
- **可选值**：
  - `flex-start`：对齐到交叉轴的起始位置
  - `flex-end`：对齐到交叉轴的结束位置
  - `center`：在交叉轴上居中对齐
  - `baseline`：项目的基线对齐
  - `stretch`：拉伸以填充整个交叉轴空间（未设置固定尺寸时）

```css
.container {
  display: flex;
  align-items: center; /* 单行项目垂直居中 */
}
```

#### align-content（多行对齐）

- **作用**：控制flex容器内多行项目在交叉轴上的对齐方式
- **适用**：多行项目（flex-wrap: wrap时）
- **可选值**：
  - `flex-start`：多行对齐到交叉轴起始位置
  - `flex-end`：多行对齐到交叉轴结束位置
  - `center`：多行在交叉轴上居中对齐
  - `space-between`：每行之间均匀分布额外空间
  - `space-around`：每行周围均匀分布额外空间
  - `stretch`：拉伸以填充整个交叉轴空间

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between; /* 多行项目均匀分布 */
}
```

> **注意**：如果只有一行项目，`align-content`不会生效，此时应使用`align-items`

### 1.2 属性速查表

| 属性 | 作用方向 | 适用场景 |
|------|---------|----------|
| justify-content | 主轴 | 单行/多行项目的水平对齐 |
| align-items | 交叉轴 | 单行项目的垂直对齐 |
| align-content | 交叉轴 | 多行项目的垂直对齐 |
| flex-direction | - | 设置主轴方向 |
| flex-wrap | - | 设置是否换行 |
| align-self | 交叉轴 | 单个项目的对齐（覆盖align-items） |

## 2. Flex布局中的margin

在Flex布局中，margin属性有一些特殊行为：

```css
.item {
  /* 水平居中（通过margin:auto实现） */
  margin-left: auto;
  margin-right: auto;

  /* 推到右边 */
  margin-left: auto;

  /* 推到左边 */
  margin-right: auto;
}
```

**实用技巧**：

```css
/* 左侧固定，右侧自适应 */
.left {
  margin-right: auto;
}

/* 两端对齐 */
.item:first-child {
  margin-right: auto;
}
.item:last-child {
  margin-left: auto;
}
```

## 3. Flex自适应布局实战

### 3.1 动态卡片宽度计算

在实际项目中，我们经常需要实现一个自适应的卡片布局，让卡片根据容器宽度自动调整大小。

![Flex自适应布局演示](flex自适应布局/动态flex.mp4)

#### 实现思路

1. 获取容器宽度
2. 根据卡片最小宽度和间距，计算一行能放下几个卡片
3. 将剩余空间平均分配给每个卡片
4. 动态设置卡片宽度

#### 完整代码实现

```javascript
SetDynamicLayout() {
  let containerWidth;

  this.$nextTick(() => {
    setTimeout(() => {
      /*
       * 获取容器宽度
       * 如果元素未显示，使用传入的listWidth值
       * 使用场景：通过v-show控制元素显示隐藏
       */
      const element = this.$el.querySelector(".wtListScrollColumn");

      if (element.offsetWidth - this.about <= 0) {
        console.log("未获取到父元素宽度:", element.offsetWidth);
        containerWidth = this.listWidth + this.about;
      } else {
        console.log("获取到父元素宽度:", element.offsetWidth);
        containerWidth = element.offsetWidth + this.about;
      }

      // 方式1：动态计算宽度
      if (!this.fixedWidth) {
        console.log(containerWidth, "containerWidth");

        // 计算余数
        let remainder = containerWidth % (this.cardMinWidth + this.about);
        console.log(remainder, "remainder");

        // 计算能放下的卡片数量
        let numberCard = (containerWidth - remainder) / (this.cardMinWidth + this.about);
        console.log(numberCard, "numberCard");

        this.numberCard = numberCard;

        // 将余数平均分配给每个卡片
        let average = (remainder / numberCard).toFixed(3);
        this.cardWidth = this.cardMinWidth + parseFloat(average);
        console.log(this.cardWidth, "this.cardWidth");

        // 将卡片宽度传递给父组件
        this.$emit("cardWidthBoundary", this.cardWidth);
      }
      // 方式2：固定宽度，计算居中偏移
      else {
        this.cardWidth = this.fixedWidth;

        // 计算能放下的卡片数量
        let n = parseInt(containerWidth / (this.fixedWidth + this.about));
        this.n = n;

        // 计算剩余空间
        let p = containerWidth - this.about - (this.fixedWidth * n + this.about * (n - 1));

        let d = document.querySelector(".wtListScrollColumn_");

        // 如果需要居中，设置左右padding
        if (this.isCenter) {
          d.style.paddingLeft = parseInt(p / 2) + "px";
        }

        console.log(n, p, "np");
      }
    }, 0);
  });
}
```

### 3.2 Vue组件实现

```vue
<template>
  <view :style="{ height: '100%', width: '100%' }">
    <scroll-view
      :class="['wtListScrollColumn', isScroll ? '' : 'clsScroll']"
      :style="{
        height: '100%',
        width: '100%',
        gap: about + 'px',
        gridRowGap: cardDown + 'px'
      }"
      :scroll-y="isScroll">

      <block v-for="(item, index) in listData" :key="index">
        <view
          class="scroll-list-card"
          :style="{ width: cardWidth + 'px' }">
          <!-- 使用插槽传递数据 -->
          <slot
            name="cardContent"
            :cardData="item"
            :cardWidth="cardWidth">
          </slot>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'WtListScrollColumn',
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    cardMinWidth: {
      type: Number,
      default: 200
    },
    fixedWidth: {
      type: Number,
      default: 0
    },
    about: {
      type: Number,
      default: 20
    },
    cardDown: {
      type: Number,
      default: 20
    },
    listWidth: {
      type: Number,
      default: 0
    },
    isScroll: {
      type: Boolean,
      default: true
    },
    isCenter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cardWidth: 0,
      numberCard: 0
    }
  },
  mounted() {
    this.SetDynamicLayout();
  },
  methods: {
    SetDynamicLayout() {
      // 上面的计算逻辑
    }
  }
}
</script>
```

### 3.3 使用示例

```vue
<template>
  <view class="store-scroll" v-if="isShowH5ScrollView && storeList.length > 0">
    <wt-list-scroll-column
      :list-data="storeList"
      :cardMinWidth="200"
      :cardDown="32"
      :about="32">

      <!-- 具名插槽接收卡片数据 -->
      <template #cardContent="{ cardData }">
        <card :sitem="cardData" />
      </template>

    </wt-list-scroll-column>
  </view>
</template>
```

## 4. 常用布局模式

### 4.1 水平居中

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 4.2 两端对齐

```css
.container {
  display: flex;
  justify-content: space-between;
}
```

### 4.3 等分布局

```css
.container {
  display: flex;
}

.item {
  flex: 1; /* 每个项目平均分配空间 */
}
```

### 4.4 圣杯布局

```css
.container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.header {
  flex: 0 0 auto;
}

.content {
  flex: 1 1 auto;
}

.footer {
  flex: 0 0 auto;
}
```

## 5. 响应式布局最佳实践

### 5.1 使用flex-wrap实现响应式

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item {
  flex: 1 1 300px; /* 最小宽度300px，可伸缩 */
}
```

### 5.2 媒体查询结合flex

```css
.container {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}
```

### 5.3 自适应间距

```css
.container {
  display: flex;
  gap: clamp(10px, 2vw, 30px); /* 响应式间距 */
}
```

## 6. 性能优化建议

1. **避免频繁重排**：使用`transform`和`opacity`代替位置属性
2. **使用will-change**：提前告知浏览器将要变化的属性
3. **减少嵌套**：避免过深的flex嵌套
4. **使用flex属性简写**：`flex: 1`比分别写三个属性性能更好

## 7. 总结

Flex布局是现代CSS布局的核心技术，掌握好Flex可以：

- ✅ 轻松实现居中对齐
- ✅ 快速构建响应式布局
- ✅ 减少对浮动和定位的依赖
- ✅ 提高布局的灵活性和可维护性

**关键要点**：
- `align-items`控制单行对齐，`align-content`控制多行对齐
- 使用`margin: auto`实现灵活的空间分配
- 结合JavaScript可以实现更复杂的自适应布局
- 优先使用flex简写属性提高性能
