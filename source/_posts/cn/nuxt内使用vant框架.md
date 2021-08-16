---
uuid: 50dd85ae-d2ed-9c31-6d60-b65c4853617e
title: nuxt内使用vant框架
---

# nuxt目录介绍
1、`assets: 资源目录，用来组织未编译的静态资源`
2、`layouts`: 
```
布局文件目录，里面可以放些全局可用的布局，例如default、error。
default表示默认布局，error可以用来展示404。
如果没有默认布局的要求，直接放置一个error即可。

注：并不需要特殊路由设置，在nuxt框架下，如果访问的路径不存在，(并且有error布局的情况下)则会直接使用该布局。
```


# nuxt内使用vant（或者说是nuxt内使用第三方框架）
1、在plugins目录下新建vant.js文件，并引入vue和vant以及vant的样式。
```
import Vue from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css'

Vue.use(Vant)
```
2、在nuxt.config.js下引入vant
```
plugins: [
    {src: '~/plugins/vant.js', ssr: true}
  ],
```