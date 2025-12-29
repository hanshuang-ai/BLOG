---
title: Vite构建工具完全指南
date: 2022-06-18 00:00:00
tags: [vite, 构建工具, 配置, 性能优化, 开发]
categories: 前端开发
updated: 2018-04-12 12:00:00
---

# Vite构建工具完全指南

Vite是下一代前端构建工具，提供了极快的开发服务器启动速度和热更新。本文将系统性地介绍Vite的配置、打包优化和自动化流程。

## 1. 基础配置

### 1.1 环境变量配置

首先创建环境变量文件：

```
项目根目录/
├── .env                 # 所有环境共享
├── .env.development     # 开发环境
├── .env.production      # 生产环境
└── vite.config.js
```

**.env.development**
```bash
# 开发环境配置
VITE_ENV=development
VITE_BASE_URL=http://localhost:3000
VITE_API_URL=http://dev-api.example.com
```

**.env.production**
```bash
# 生产环境配置
VITE_ENV=production
VITE_BASE_URL=https://example.com
VITE_API_URL=https://api.example.com
```

### 1.2 基础vite.config.js配置

```javascript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import chalk from 'chalk'

export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');

  // 打印当前环境信息
  console.log(`本次打包的环境是：${chalk.yellow(env.VITE_ENV)}`);
  console.log(`本次打包使用的baseURL是：${chalk.bold.yellow(env.VITE_BASE_URL)}`);

  return {
    // 基础路径
    base: './',

    // 插件配置
    plugins: [vue()],

    // CSS配置
    css: {
      preprocessorOptions: {
        less: {
          // 引入全局 Less 文件
          additionalData: `@import "./src/assets/css/base.less";`
        },
        scss: {
          // 引入全局 SCSS 文件
          additionalData: `@import "./src/assets/css/base.scss";`
        }
      }
    },

    // 路径别名配置
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url))
      }
    },

    // 开发服务器配置
    server: {
      port: 3000,
      host: '0.0.0.0',
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },

    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          // 自定义入口文件名
          entryFileNames: `assets/[name]_${new Date().getTime()}.js`,
          // 自定义块文件名
          chunkFileNames: `assets/[name]-[hash]_${new Date().getTime()}.js`,
          // 自定义资源文件名
          assetFileNames: `assets/[name]-[hash].[ext]`
        }
      }
    }
  }
})
```

## 2. 高级配置

### 2.1 按需打包指定目录

在实际项目中，有时需要根据特定条件只打包部分目录。以下示例演示如何根据channelId动态打包指定目录：

**项目结构：**
```
src/
├── stores/
│   └── counter.js          # 存储channelId
├── views/
│   └── detailPageInfo/
│       ├── 123/            # 渠道123的资源
│       │   ├── styleModel.js
│       │   ├── css/
│       │   └── img/
│       ├── 234/            # 渠道234的资源
│       │   └── ...
│       └── 456/            # 渠道456的资源
│           └── ...
└── main.js
```

**vite.config.js配置：**

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
    const counterContent = fs.readFileSync(
      resolve(__dirname, 'src/stores/counter.js'),
      'utf-8'
    )
    // 提取未被注释的window.channelId赋值行
    const lines = counterContent.split('\n')
    let channelId = null

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
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
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

### 2.2 代码分割策略

```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // 将node_modules中的包打包到vendor
        'vendor': ['vue', 'vue-router', 'pinia'],
        // 将UI库单独打包
        'ui-library': ['element-plus'],
        // 将工具函数单独打包
        'utils': ['lodash-es', 'axios']
      }
    }
  }
}
```

### 2.3 构建优化配置

```javascript
build: {
  // 代码压缩
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true, // 删除console
      drop_debugger: true // 删除debugger
    }
  },
  // chunk大小警告阈值
  chunkSizeWarningLimit: 1000,
  // 启用源码映射
  sourcemap: false,
  rollupOptions: {
    output: {
      // 分包策略
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor'
        }
      }
    }
  }
}
```

## 3. 打包自动化

### 3.1 清除缓存命令

在package.json中添加清除命令：

```json
{
  "scripts": {
    "clean": "rm -rf dist/* || rimraf dist/* || echo 'No files to clean.'"
  }
}
```

### 3.2 自动压缩打包文件

安装archiver依赖：

```bash
npm install archiver --save-dev
```

创建zip.js文件：

```javascript
// 引入所需模块
import fs from 'fs';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建一个文件以写入压缩包内容
const output = fs.createWriteStream(`${__dirname}/dist.zip`);

// 创建archiver实例，并设置压缩格式和压缩级别
const archive = archiver('zip', {
  zlib: { level: 9 } // 压缩级别：0-9，9为最高压缩级别
});

// 监听输出文件流的'close'事件
output.on('close', function() {
  console.log(`打包完成，总大小：${archive.pointer()} bytes`);
  console.log(`压缩包已生成：${__dirname}/dist.zip`);
});

// 监听archive的错误事件
archive.on('error', function(err) {
  throw err;
});

// 监听压缩进度
archive.on('progress', function(progress) {
  const percent = progress.entries.processed / progress.entries.total * 100;
  console.log(`压缩进度：${percent.toFixed(2)}%`);
});

// 管道输出文件流到archive对象
archive.pipe(output);

// 指定需要压缩的目录
archive.directory('dist/', false);

// 完成文件添加并结束输出流
archive.finalize();
```

在package.json中添加压缩命令：

```json
{
  "scripts": {
    "zip": "node zip.js"
  }
}
```

### 3.3 组合命令

将清除、打包、压缩组合成一个命令：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "npm run clean && vite build --mode development && npm run zip",
    "build:prod": "npm run clean && vite build --mode production && npm run zip"
  }
}
```

## 4. 常用插件配置

### 4.1 自动导入插件

```bash
npm install -D unplugin-auto-import unplugin-vue-components
```

```javascript
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入Vue API
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts'
    }),
    // 自动导入组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    })
  ]
})
```

### 4.2 SVG图标插件

```bash
npm install -D vite-plugin-svg-icons
```

```javascript
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[dir]-[name]'
    })
  ]
})
```

### 4.3 Top-level Await插件

```bash
npm install -D vite-plugin-top-level-await
```

```javascript
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [
    topLevelAwait({
      promiseExportName: '__tla',
      promiseRetry: false
    })
  ]
})
```

## 5. 性能优化

### 5.1 开发环境优化

```javascript
server: {
  host: '0.0.0.0',
  port: 3000,
  open: true,
  // 预构建频繁使用的文件
  optimizeDeps: {
    include: ['vue', 'vue-router', 'axios'],
    exclude: []
  },
  // 文件系统监听
  watch: {
    usePolling: false, // 启用轮询
    interval: 100 // 轮询间隔
  }
}
```

### 5.2 生产环境优化

```javascript
build: {
  // 减小打包体积
  reportCompressedSize: false,
  // 设置chunk大小警告限制
  chunkSizeWarningLimit: 1000,
  rollupOptions: {
    output: {
      // 手动分包
      manualChunks(id) {
        if (id.includes('node_modules')) {
          // 将大型库单独打包
          if (id.includes('echarts')) {
            return 'echarts'
          }
          if (id.includes('element-plus')) {
            return 'element-plus'
          }
          return 'vendor'
        }
      }
    }
  },
  // CSS代码分割
  cssCodeSplit: true,
  // 构建目标
  target: 'modules'
}
```

### 5.3 CDN加速配置

```javascript
build: {
  rollupOptions: {
    external: ['vue', 'vue-router', 'axios', 'element-plus'],
    output: {
      globals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        'element-plus': 'ElementPlus'
      }
    }
  }
}
```

在HTML中引入CDN：

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-router@4/dist/vue-router.global.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
```

## 6. 环境管理最佳实践

### 6.1 环境变量类型定义

创建`src/env.d.ts`文件：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: string
  readonly VITE_BASE_URL: string
  readonly VITE_API_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 6.2 在代码中使用环境变量

```javascript
// 获取环境变量
const env = import.meta.env.VITE_ENV
const apiUrl = import.meta.env.VITE_API_URL

// 根据环境执行不同逻辑
if (import.meta.env.PROD) {
  console.log('生产环境')
} else {
  console.log('开发环境')
}
```

## 7. 总结

Vite的强大之处在于：

- ✅ 快速的冷启动
- ✅ 即时的热模块更新
- ✅ 丰富的插件生态
- ✅ 灵活的配置选项
- ✅ 优秀的构建性能

掌握这些配置技巧，可以让你的项目构建更加高效和灵活。
