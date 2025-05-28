---
title: vite打包指定目录
date: 2025-04-02 16:44:00
tags:
---
# 项目目录结构

## src/
- **stores/**
  - counter.js
- **router/**
  - index.js
- **views/**
  - SIMData.vue
  - Index.vue
  - off.svg
  - detail-page.vue
  - **detailPageInfo/**
    - **123/**
      - styleModel.js
      - css/
      - img/
    - **234/**
      - styleModel.js
      - css/
      - img/
    - **345/**
      - styleModel.js
      - css/
      - img/
    - **456/**
      - styleModel.js
      - css/
      - img/
    - **678/**
      - styleModel.js
      - css/
      - img/
    - **789/**
      - styleModel.js
      - css/
      - img/
    - **000/**
      - styleModel.js
      - css/
      - img/
- **assets/**
  - **js/**
    - **utils/**
      - funList.js
      - setColorStyle.js
      - Native.js
      - libs.js
    - **http/**
      - httpRequest.js
      - post.js
    - mock.js
  - **css/**
    - base.less
  - zhanwei.png
  - cover.png
- **components/**
  - header-layout.vue
- main.js
- App.vue

```javascript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import chalk from 'chalk'
import topLevelAwait from 'vite-plugin-top-level-await'
import { resolve } from 'path'
import fs from 'fs'

// 从counter.js中读取channelId
const getChannelId = () => {
  try {
    const counterContent = fs.readFileSync(resolve(__dirname, 'src/stores/counter.js'), 'utf-8')
    // 提取未被注释的window.channelId赋值行
    const lines = counterContent.split('\n')
    let channelId = null // 默认值

    for (const line of lines) {
      // 匹配未被注释的window.channelId赋值
      if (line.trim().startsWith('window.channelId =')) {
        const match = line.match(/window\.channelId\s*=\s*['"]([^'"]+)['"]/)
        if (match) {
          channelId = match[1]
          break
        }
      }
    }
    return channelId
  } catch (error) {
    console.error(chalk.red('读取channelId失败，使用默认值000'), error)
    return '857'
  }
}

const channelId = getChannelId()
console.log(chalk.green(`当前打包渠道ID: ${channelId}`))

export default defineConfig(({ mode }) => {
  return {
    base: './',
    plugins: [
      vue(),
      topLevelAwait()
    ],
    css: {
      preprocessorOptions: {
        less: {
          // 引入全局 Less 文件
          additionalData: `@import "./src/assets/css/base.less";`
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      rollupOptions: {
        // 排除不需要打包的文件
        external: (id) => {
          // 排除detailPageInfo下非当前channelId目录的文件
          return id.includes('src/views/detailPageInfo/') &&
                 !id.includes(`src/views/detailPageInfo/${channelId}/`);
        },
        output: {
          // 自定义入口文件名
          entryFileNames: `assets/[name].[hash].js`,
          // 自定义块文件名
          chunkFileNames: `assets/[name].[hash].js`,
          // 自定义资源文件名
          assetFileNames: `assets/[name].[hash].[ext]`,
          // 将指定目录下的文件打包在一起
          manualChunks(id) {
            // 处理当前channelId目录下的文件
            if (id.includes(`src/views/detailPageInfo/${channelId}`)) {
              return channelId;
            }
          }
        }
      },
      sourcemap: true
    },
    esbuild: {
      sourcemap: true,
      sourcesContent: true
    }
  }
})

```
