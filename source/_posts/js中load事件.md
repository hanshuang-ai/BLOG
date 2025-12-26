---
title: js中load事件
date: 2023-08-02 15:35:56
tags: [javascript, load事件, dom加载, jquery]
categories: 前端开发
---

### 1、 DOMContentLoaded

在 JavaScript 中，`DOMContentLoaded` 是一个事件，用于表示当网页的 DOM（文档对象模型） 已经完全加载并且解析完成时触发的事件。简单来说，它标志着网页的 HTML 结构已经可以通过 JavaScript 来访问和操作。

当浏览器加载一个网页时，它会逐步解析 HTML 代码并构建 DOM 树，这是表示网页结构和内容的内部数据结构。有时，您可能希望在 DOM 完全加载后执行一些 JavaScript 代码，以确保您操作的元素和内容已经存在于 DOM 中。这就是使用`DOMContentLoaded`事件的情况。

例如，如果您在`DOMContentLoaded`事件的处理程序中放置了一些修改 DOM 的代码，那么您可以确保这些修改不会在 DOM 还没有加载完成时执行，从而避免出现错误。

总之，`DOMContentLoaded`事件在网页加载过程中的一个关键时间点，它表示网页的结构已经准备好进行 JavaScript 操作。

**注意：DOMContentLoaded 只监听 html 结构**

对于监控 CSS 结构加载完成并且浏览器已经绘制完毕的情况，`DOMContentLoaded`事件并不足够，因为它只表示 HTML 结构加载完成，而不包括 CSS 的加载和浏览器的绘制。

### 2、 window.onload

要实现监控 CSS 加载和浏览器绘制完毕的需求，您可能需要使用`window.onload`事件以及`requestAnimationFrame`方法的结合。这样可以确保在整个页面的所有资源加载完成并且浏览器完成绘制后执行您的代码。

```javascript
window.onload = function () {
	// 此处的代码将在所有资源加载完成后执行
	// 包括HTML、CSS、图片等

	requestAnimationFrame(function () {
		// 此处的代码将在浏览器完成绘制后执行
	});
};
```

`window.onload`事件会在整个页面（包括 CSS 和图片等资源）加载完成后触发，而`requestAnimationFrame`会在浏览器下一次绘制时调用传入的回调函数，这样可以确保在浏览器已经完成页面绘制后再执行相关代码。

`window.onload` 是一个标准的 JavaScript 事件，因此可以在 Vue.js 代码内使用，但需要注意一些细节。

在 Vue.js 中，通常会使用 Vue 的生命周期钩子来处理组件的初始化和渲染过程，比如 `created`、`mounted` 等。这些钩子可以更好地与 Vue 的响应式数据和组件生命周期进行交互。而 `window.onload` 则是在整个页面（包括图片、CSS 等资源）都加载完成后触发，与 Vue 的生命周期可能有一些不同步。

如果您需要在 Vue 组件内部等待页面加载完成后执行某些操作，您可以结合使用 `mounted` 钩子和 `window.onload` 事件，例如：

```javascript
<template>
  <div>
    <!-- 组件的内容 -->
  </div>
</template>

<script>
export default {
  mounted() {
    window.onload = () => {
      // 在整个页面加载完成后执行的操作
    };
  }
};
</script>
```

但是请注意，如果您使用了多个组件，每个组件都在 `window.onload` 内添加了操作，可能会导致这些操作被重复执行。

在一个公共的 Vue 组件内使用 `window.onload` 并且希望避免在其他页面引入时重复执行，您可以考虑使用一个标志来判断是否已经执行过相应的操作。这样可以确保在整个应用中只执行一次该操作。以下是一个示例：

```javascript
<template>
  <div>
    <!-- 组件的内容 -->
  </div>
</template>

<script>
export default {
  mounted() {
    // 使用一个标志来判断是否已经执行过操作
    if (!window.onloadExecuted) {
      window.onload = () => {
        // 在整个页面加载完成后执行的操作
        window.onloadExecuted = true;
      };
    }
  }
};
</script>
```

在这个示例中，我们在组件的 `mounted` 钩子中判断 `window.onloadExecuted` 标志是否已经为 `true`，如果不是，则添加 `window.onload` 事件处理程序，并在其中执行操作，并将 `window.onloadExecuted` 设置为 `true`，表示已经执行过操作。这样，在其他页面引入这个组件时，由于 `window.onloadExecuted` 已经为 `true`，操作就不会再次执行。

请注意，这种方法仍然具有一定的局限性，因为如果应用中有多个公共组件都采用了类似的方法，可能会造成多次绑定事件处理程序，从而可能导致问题。在实际应用中，您可能需要更加细致地控制这些事件绑定，以确保不会出现重复执行的情况。

#### 2.1 window.onload 事件会在 img 标签渲染完执行吗，还是在 img.onload 之前

`window.onload` `事件是在整个页面（包括图片等资源）都加载完成后触发的，而不仅仅是在 `img` 标签渲染完成后触发。`

当浏览器解析 HTML 代码时，遇到 `img` 标签会开始加载图像资源。`img` 标签有一个 `onload` 事件，该事件会在图像加载完成后触发。因此，`img.onload` 事件可以用于检测单个图像是否加载完毕。

而 `window.onload` 事件是在整个页面的所有资源，包括 HTML、CSS、图片等，都加载完成之后触发的。因此，`window.onload` 事件的触发时间会在所有 `img.onload` 事件之后。

如果您需要在所有图像加载完成后执行某些操作，您可以在每个图像的 `onload` 事件中计数，然后当计数达到图像数量时再触发您的操作。这可以保证所有图像都已经加载完毕。

```JavaScript
<template>
  <div class="about">
    <div v-for="(item,index) in imgList" :key="index">
      <img :src="item" alt="" class="img" @load="imgLoad(item)" @error="imgError(item)">
    </div>
  </div>
</template>
<script setup>
import {onMounted} from "vue";

const imgList = [
  "http://baicu.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/30adcbef76094b36de8a2fe5a1cc7cd98d109d99.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/7c1ed21b0ef41bd5f2c2a9e953da81cb39db3d1d.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/55e736d12f2eb938d5277fd5d0628535e5dd6f4a.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/4e4a20a4462309f7e41f5cfe760e0cf3d6cad6ee.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/9d82d158ccbf6c81b94575cfb93eb13533fa40a2.jpg",
  "http://e.hiphotos.baidu.com/image/pic/item/4bed2e738bd4b31c1badd5a685d6277f9e2ff81e.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/0d338744ebf81a4c87a3add4d52a6059252da61e.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494ee5080c8142ff5e0fe99257e19.jpg",
  "http://f.hiphotos.baidu.com/image/pic/item/4034970a304e251f503521f5a586c9177e3e53f9.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/279759ee3d6d55fbb3586c0168224f4a20a4dd7e.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/e824b899a9014c087eb617650e7b02087af4f464.jpg",
  "http://c.hiphotos.baidu.com/image/pic/item/9c16fdfaaf51f3de1e296fa390eef01f3b29795a.jpg",
  "http://d.hiphotos.baidu.com/image/pic/item/b58f8c5494eef01f119945cbe2fe9925bc317d2a.jpg",
  "http://h.hiphotos.baidu.com/image/pic/item/902397dda144ad340668b847d4a20cf430ad851e.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/359b033b5bb5c9ea5c0e3c23d139b6003bf3b374.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/8d5494eef01f3a292d2472199d25bc315d607c7c.jpg",
  "http://b.hiphotos.baidu.com/image/pic/item/e824b899a9014c08878b2c4c0e7b02087af4f4a3.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/6d81800a19d8bc3e770bd00d868ba61ea9d345f2.jpg",
]
onMounted(function () {
  console.log('mounted')
  window.onload = function (){
    // 这句话会在所有img标签的回调函数执行后再输出
    console.log('所有图片加载完毕')
  }
}, undefined)
function imgLoad(item){
  console.log(`这张图片加载成功${item}`)
}
function imgError(item){
  console.log(`这张图片加载失败${item}`)
}
</script>

<style scoped>
.about {
  display: flex;
  flex-wrap: wrap;
}

.img {
  width: 100px;
  height: 100px;
}
</style>
```

#### 2.2 如果有异步请求的数据，window.onload 还能监听吗

`window.onload` 事件在整个页面及其所有资源（包括图片、脚本、样式表等）都加载完成后才会触发。如果您的页面中存在异步请求的数据，这些数据的加载不会影响 `window.onload` 事件的触发。换句话说，`window.onload` `事件不会等待异步请求完成后再触发`。

如果您希望在异步请求的数据加载完成后执行一些操作，可以使用异步回调、Promise、async/await 或其他方式来处理。

### 3、和 DOMContentLoaded 同级的事件

除了 `DOMContentLoaded` 事件，还有其他一些与之类似的事件，它们也是页面加载和文档解析过程中的重要时间点。以下是一些与 `DOMContentLoaded` 事件同级的事件：

1. **load 事件**：
   `load` 事件在整个页面及其所有资源（包括图片、样式表、脚本等）都加载完成后触发。与 `DOMContentLoaded` 不同，`load` 事件等待所有资源都加载完成后才触发。

   ```javascript
   window.addEventListener("load", listener);
   ```

2. **beforeunload 事件**：
   `beforeunload` 事件在用户即将离开页面（关闭页面、刷新页面、导航到其他页面等）时触发，可以用于执行一些清理操作或弹出确认提示框。

   ```javascript
   window.addEventListener("beforeunload", listener);
   ```

3. **readystatechange 事件**：
   `readystatechange` 事件在文档的 `readyState` 属性发生变化时触发。`readyState` 表示文档的加载状态，可能的值有 `"loading"`、`"interactive"` 和 `"complete"`。

   ```javascript
   document.addEventListener("readystatechange", listener);
   ```

这些事件在不同的加载和文档状态下提供了不同的钩子，让您可以在适当的时候执行特定的操作。根据您的需求，选择适合的事件来监听，以便在页面加载和文档解析过程中执行您希望的操作。

#### 3.1 readystatechange 会等到 css 执行完成后再执行吗

`readystatechange` 事件会在文档的 `readyState` 发生变化时触发，但并不保证会等待 CSS 执行完成。它主要针对文档加载的各个阶段，包括以下几种 `readyState` 值：

- `"loading"`：文档正在加载。
- `"interactive"`：文档已经解析完成，但仍在加载子资源（例如图片、样式表等）。
- `"complete"`：文档及其所有资源已加载完成。

在 `"interactive"` 阶段，通常表示 HTML 结构已经可以被访问，但是某些外部资源可能还在加载中，包括 CSS。因此，在此阶段监听 `readystatechange` 事件并不等同于等待 CSS 执行完成。

如果您想等待 CSS 执行完成后执行操作，您可能需要考虑其他方法，如在 `window.onload` 或具体 CSS 加载完成的事件（例如 `link.onload`）中执行操作。这些方法会等待所有资源，包括 CSS，都加载和执行完毕后再执行相关代码。

### 4、 js 中有多少 onload 事件，或者说 html 有哪些标签带 onload 事件

在 HTML 和 JavaScript 中，`onload` 是一个常见的事件处理程序属性，它可以附加到许多不同的 HTML 元素以及 `window` 和 `document` 对象上。这个事件在相关元素或资源加载完成后触发。以下是一些常见的使用 `onload` 事件的 HTML 元素和对象：

1. **window 对象和 document 对象**：`window.onload` 和 `document.onload` 事件可以用来指示整个窗口或文档的加载状态。`window.onload` 会在整个页面（包括资源如图像、样式表等）加载完成后触发，而 `document.onload` 则是在文档结构加载完毕后触发。

2. **img 标签**：`img.onload` 事件会在图片加载完成后触发。

3. **iframe 标签**：`iframe.onload` 事件会在内嵌框架加载完毕后触发。

4. **script 标签**：`script.onload` 事件会在外部脚本加载并执行完毕后触发。

5. **link 标签**：`link.onload` 事件会在外部样式表加载完毕后触发。

6. **audio 和 video 标签**：`audio.onload` 和 `video.onload` 事件会在音频和视频元素加载完毕后触发。

7. **XMLHttpRequest 对象**：虽然不是 HTML 元素，但是 `XMLHttpRequest` 对象也有 `onload` 事件，它在请求完成后触发，表示响应已经加载完毕。

8. **其他标签和元素**：实际上，许多 HTML 元素都可以使用 `onload` 事件，尤其是那些涉及加载外部资源的元素。

需要注意的是，一些事件可能具有不同的命名规范，如 `onload`、`onLoad`、`onLoad` 等，这取决于不同的 HTML 规范和浏览器实现。通常，建议使用全部小写的 `onload` 标记来指定事件处理程序属性。

每个元素的 `onload` 事件都在相应资源加载完成后触发，所以它们可以用于执行与资源加载相关的操作。
