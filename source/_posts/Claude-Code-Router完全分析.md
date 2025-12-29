---
title: Claude Code Router完全分析
date: 2025-11-23 00:00:00
tags: [claude-code, router, deepseek, llm, 中间件, 分析, 架构]
categories: 大模型与AI
---

# Claude Code Router 项目完整分析报告

生成时间：2025-12-26
分析工具：Claude Code v2.0.27
模型：GLM-4.6

---

## 目录

1. [项目概述](#一项目概述)
2. [技术架构](#二技术架构)
3. [项目结构](#三项目结构)
4. [核心功能](#四核心功能)
5. [配置系统](#五配置系统)
6. [工作流程](#六工作流程)
7. [关键特性](#七关键特性)
8. [安全特性](#八安全特性)
9. [性能优化](#九性能优化)
10. [扩展性](#十扩展性)
11. [项目亮点](#十一项目亮点)
12. [潜在改进点](#十二潜在改进点)
13. [DeepSeek 集成指南](#十三deepseek-集成指南)
14. [总结](#十四总结)

---

## 一、项目概述

### 1.1 项目简介

**Claude Code Router** 是一个功能强大的中间件路由器，允许用户在不使用 Anthropic 账户的情况下使用 Claude Code，并将请求路由到其他大语言模型提供商。

### 1.2 核心价值主张

- **降低使用成本**：可以使用更便宜的模型提供商（如 DeepSeek 价格远低于 Claude）
- **提供灵活性**：支持多种 LLM 提供商和自定义路由规则
- **保持兼容性**：完全兼容 Claude Code 的使用方式
- **透明转换**：自动处理请求/响应格式转换

### 1.3 基本信息

- **项目名称**：@musistudio/claude-code-router
- **当前版本**：1.0.73
- **开源协议**：MIT
- **作者**：musistudio
- **语言**：TypeScript (ES2022)

---

## 二、技术架构

### 2.1 技术栈

```
核心框架：@musistudio/llms (基于 Fastify)
构建工具：esbuild
包管理器：npm
Token计算：tiktoken (cl100k_base 编码)
交互CLI：@inquirer/prompts
缓存系统：lru-cache
配置解析：json5
```

### 2.2 核心依赖关系

```
claude-code-router
├── @musistudio/llms (核心 LLM 服务器框架)
│   └── Fastify (Web 服务器)
├── tiktoken (Token 计数)
├── @inquirer/prompts (交互式 CLI)
├── lru-cache (会话缓存)
├── uuid (唯一标识符生成)
└── json5 (配置解析)
```

---

## 三、项目结构

```
claude-code-router/
├── src/
│   ├── cli.ts              # CLI 入口，处理所有命令
│   ├── index.ts            # 服务器初始化
│   ├── server.ts           # 服务器工厂函数
│   ├── constants.ts        # 常量定义
│   ├── agents/             # Agent 系统
│   │   ├── image.agent.ts  # 图像处理 Agent
│   │   ├── index.ts        # Agent 管理
│   │   └── type.ts         # 类型定义
│   ├── middleware/
│   │   └── auth.ts         # API 认证中间件
│   └── utils/              # 核心工具集
│       ├── router.ts       # 路由逻辑 (关键)
│       ├── cache.ts        # LRU 缓存
│       ├── codeCommand.ts  # 代码命令处理
│       ├── processCheck.ts # 进程管理
│       └── ... (14个工具文件)
├── ui/                     # React Web UI (Vite)
├── scripts/                # 构建脚本
├── dist/                   # 构建输出
└── package.json
```

---

## 四、核心功能

### 4.1 智能路由系统 (src/utils/router.ts)

这是项目的核心，实现了多层次的模型选择逻辑：

#### 路由决策优先级

1. **直接指定模型** (provider,model 格式)
   - 示例：`deepseek,deepseek-chat`

2. **长上下文模型** (tokenCount > 60000)
   - 默认阈值：60000 tokens
   - 可配置：`longContextThreshold`

3. **Subagent 模型** (通过特殊标签指定)
   - 标签格式：`<CCR-SUBAGENT-MODEL>provider,model</CCR-SUBAGENT-MODEL>`

4. **后台任务模型** (Claude Haiku)
   - 检测 Haiku 模型自动切换

5. **WebSearch 模型** (检测到 web_search 工具)
   - 优先级高于 thinking 模型

6. **思考模型** (thinking 模式)
   - 用于推理密集型任务

7. **默认模型**
   - 兜底选项

#### Token 计算逻辑

- 使用 `tiktoken` 的 cl100k_base 编码
- 计算消息、系统提示和工具定义的总 token 数
- 支持长上下文阈值检测（默认 60000 tokens）

#### 项目特定配置

- 通过 sessionId 查找对应项目
- 支持项目级和会话级配置覆盖
- 使用 LRU 缓存优化项目查找性能

### 4.2 Transformer 系统

实现了请求/响应转换器，适配不同提供商的 API 差异：

#### 内置转换器列表

| 转换器 | 功能描述 |
|--------|----------|
| `Anthropic` | 保留原始 Anthropic 格式 |
| `deepseek` | DeepSeek API 适配 |
| `gemini` | Gemini API 适配 |
| `openrouter` | OpenRouter API 适配 |
| `groq` | Groq API 适配 |
| `tooluse` | 工具使用优化 |
| `maxtoken` | 设置最大 token 限制 |
| `reasoning` | 处理推理内容字段 |
| `enhancetool` | 增强工具调用容错性 |
| `cleancache` | 清除 cache_control 字段 |
| `sampling` | 处理采样参数（temperature、top_p 等） |

#### 转换器配置层次

```
全局转换器 → 模型特定转换器 → 选项化转换器
```

**示例配置**：

```json
{
  "transformer": {
    "use": ["deepseek"],           // 全局
    "deepseek-chat": {             // 模型特定
      "use": ["tooluse"]
    },
    "deepseek-reasoner": {
      "use": [
        ["maxtoken", {             // 选项化
          "max_tokens": 8192
        }]
      ]
    }
  }
}
```

### 4.3 Agent 系统 (src/agents/)

- **可扩展架构**：支持自定义 agent
- **图像 Agent**：处理图像相关任务
- **类型安全**：TypeScript 类型定义

### 4.4 缓存系统

- **LRU 缓存**：限制 1000 个条目
- **会话跟踪**：记录每个 sessionId 的使用情况
- **性能优化**：避免重复的项目文件系统查找

---

## 五、配置系统

### 5.1 配置文件位置

```
~/.claude-code-router/config.json
```

### 5.2 关键配置项

```json
{
  // 服务器配置
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "APIKEY": "your-secret-key",
  "API_TIMEOUT_MS": 600000,
  "PROXY_URL": "http://127.0.0.1:7890",

  // 日志配置
  "LOG": true,
  "LOG_LEVEL": "debug",

  // 路由配置
  "Router": {
    "default": "provider,model",
    "background": "provider,model",
    "think": "provider,model",
    "longContext": "provider,model",
    "longContextThreshold": 60000,
    "webSearch": "provider,model",
    "image": "provider,model"
  },

  // 提供商配置
  "Providers": [...],

  // 自定义路由
  "CUSTOM_ROUTER_PATH": "/path/to/router.js",

  // 环境变量插值
  "OPENAI_API_KEY": "$OPENAI_API_KEY"
}
```

### 5.3 环境变量插值

支持在配置中使用环境变量：

```json
{
  "Providers": [
    {
      "name": "deepseek",
      "api_key": "$DEEPSEEK_API_KEY"
    }
  ]
}
```

---

## 六、工作流程

### 6.1 请求处理流程

```
Claude Code CLI
    ↓
ccr code 命令
    ↓
本地服务 (localhost:3456)
    ↓
认证中间件 (auth.ts)
    ↓
Token 计数 (router.ts)
    ↓
路由决策 (router.ts)
    ↓
选择提供商和模型
    ↓
应用转换器 (Transformer)
    ↓
发送到 LLM 提供商
    ↓
接收响应
    ↓
反向转换
    ↓
返回给 Claude Code CLI
```

### 6.2 CLI 命令流程

```bash
ccr start    # 启动后台服务 (src/index.ts)
ccr stop     # 停止服务
ccr restart  # 重启服务
ccr code     # 执行 Claude Code 命令
ccr model    # 交互式模型选择
ccr ui       # 打开 Web UI
ccr status   # 检查服务状态
ccr activate # 设置环境变量
```

---

## 七、关键特性

### 7.1 多提供商支持

支持以下 LLM 提供商：

- **OpenRouter** - 聚合多个模型
- **DeepSeek** - 高性价比中文模型
- **Ollama** - 本地模型部署
- **Gemini** - Google 的模型
- **Volcengine** - 火山引擎
- **SiliconFlow** - 硅基流动
- **Moonshot (Kimi)** - 月之暗面
- **Azure OpenAI** - 微软 Azure
- **ModelScope** - 魔搭社区
- **Dashscope** - 阿里云通义千问
- **AIHubmix** - AI 混合平台

### 7.2 动态模型切换

- 在 Claude Code 中使用 `/model provider,model` 命令
- 立即生效，无需重启服务
- 示例：`/model deepseek,deepseek-chat`

### 7.3 项目级配置

- 支持每个项目使用不同的模型
- 会话级配置覆盖项目配置
- 通过 sessionId 自动识别项目

### 7.4 自定义路由

支持编写 JavaScript 路由脚本：

```javascript
// custom-router.js
module.exports = async function router(req, config) {
  const messages = req.body.messages || [];
  const lastUserMessage = messages.find(m => m.role === "user");

  // 根据内容长度选择模型
  if (lastUserMessage && lastUserMessage.content.length < 500) {
    return "deepseek,deepseek-chat";
  }

  return "deepseek,deepseek-reasoner";
};
```

### 7.5 Web UI

- React + Vite 构建
- 单 HTML 文件输出
- 中英文双语支持
- 直观的配置管理界面

### 7.6 GitHub Actions 集成

- 支持在 CI/CD 中使用
- `NON_INTERACTIVE_MODE` 模式
- 支持自动化任务调度

---

## 八、安全特性

1. **API Key 认证**：可选的请求认证
2. **本地绑定**：无 API Key 时强制 127.0.0.1
3. **环境变量插值**：敏感信息不硬编码
4. **代理支持**：可配置 HTTP 代理

---

## 九、性能优化

1. **LRU 缓存**：会话和项目查找缓存
2. **esbuild**：快速构建
3. **流式响应**：支持实时流式输出
4. **并发文件检查**：Promise.all 并发查找项目
5. **会话缓存**：跟踪使用情况优化路由决策

---

## 十、扩展性

### 10.1 插件系统

- **自定义转换器**：加载外部 JavaScript 文件
- **自定义路由器**：编写复杂路由逻辑
- **Agent 扩展**：添加新的 Agent 类型

### 10.2 配置层次

```
全局配置 → 项目配置 → 会话配置 → 运行时切换
```

---

## 十一、项目亮点

1. ✅ **架构设计清晰**：职责分离明确，易于维护
2. ✅ **类型安全**：全面使用 TypeScript
3. ✅ **用户友好**：CLI、UI、配置文件多种管理方式
4. ✅ **高度可配置**：支持多层次的配置覆盖
5. ✅ **性能优化**：LRU 缓存、并发处理等
6. ✅ **生态丰富**：支持众多 LLM 提供商
7. ✅ **文档完善**：README、配置示例、博客文章

---

## 十二、潜在改进点

1. **测试覆盖**：项目说明提到测试被删除，应该增加自动化测试
2. **错误处理**：可以增强错误处理和用户友好的错误提示
3. **监控指标**：可以添加使用统计和性能监控
4. **配置验证**：启动时验证配置文件的有效性
5. **热重载**：配置文件修改后自动重载（目前需要重启）
6. **WebUI 增强**：添加实时日志查看、使用统计图表等

---

## 十三、DeepSeek 集成指南

### 13.1 需求说明

将 Claude Code 的上下文转换为 DeepSeek 格式，同时将 DeepSeek 返回的数据转换回 Claude Code 格式，方便使用 Claude Code CLI。

### 13.2 支持情况

✅ **完全支持**！这正是 claude-code-router 的核心功能。

### 13.3 实现步骤

#### 步骤 1：安装必要工具

```bash
# 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 安装 claude-code-router
npm install -g @musistudio/claude-code-router
```

#### 步骤 2：配置文件设置

创建配置文件 `~/.claude-code-router/config.json`：

```json
{
  "LOG": true,
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "APIKEY": "your-secret-key",
  "API_TIMEOUT_MS": 600000,

  "Providers": [
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "sk-your-deepseek-api-key-here",
      "models": [
        "deepseek-chat",
        "deepseek-reasoner"
      ],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-chat": {
          "use": ["tooluse"]
        }
      }
    }
  ],

  "Router": {
    "default": "deepseek,deepseek-chat",
    "background": "deepseek,deepseek-chat",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "deepseek,deepseek-chat",
    "webSearch": "deepseek,deepseek-chat"
  }
}
```

#### 步骤 3：启动服务

```bash
# 启动路由器服务
ccr start

# 验证服务状态
ccr status
```

#### 步骤 4：使用 Claude Code

**方式一：使用 ccr code 命令**

```bash
ccr code "帮我分析这个项目"
```

**方式二：激活环境变量后直接使用 claude 命令**

```bash
# 激活环境变量
eval "$(ccr activate)"

# 然后直接使用
claude "帮我重构这个函数"
```

### 13.4 DeepSeek Transformer 工作原理

#### 请求转换（Claude → DeepSeek）

```javascript
// Claude 格式
{
  "model": "claude-3.5-sonnet",
  "messages": [...],
  "tools": [...],
  "max_tokens": 4096,
  "stream": true
}

// 转换为 DeepSeek 格式
{
  "model": "deepseek-chat",
  "messages": [...],
  "tools": [...],
  "max_tokens": 4096,
  "stream": true
}
```

#### 响应转换（DeepSeek → Claude）

```javascript
// DeepSeek 格式
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "...",
      "tool_calls": [...]
    }
  }],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200
  }
}

// 转换为 Claude 格式
{
  "type": "content_block_delta",
  "delta": {
    "type": "text",
    "text": "..."
  },
  "usage": {
    "input_tokens": 100,
    "output_tokens": 200
  }
}
```

### 13.5 功能对比表

| 功能 | Claude API | DeepSeek API | Router 支持 |
|------|-----------|--------------|------------|
| 文本生成 | ✅ | ✅ | ✅ 自动转换 |
| 工具调用 | ✅ | ✅ | ✅ tooluse transformer |
| 流式输出 | ✅ | ✅ | ✅ 自动转换 |
| 系统提示 | ✅ | ✅ | ✅ 自动转换 |
| 长上下文 | ✅ (200K) | ✅ (128K) | ✅ 支持 128K |
| 思考模式 | ✅ | ✅ | ✅ deepseek-reasoner |

### 13.6 成本对比

| 模型 | 输入价格 | 输出价格 |
|------|----------|----------|
| Claude Sonnet 3.5 | $3/1M tokens | $15/1M tokens |
| DeepSeek Chat | ¥1/1M tokens | ¥2/1M tokens |
| **节省比例** | **约 95%** | **约 98%** |

### 13.7 高级配置（可选）

如果需要更精细的控制，可以创建自定义路由器：

**文件：`~/.claude-code-router/custom-router.js`**

```javascript
module.exports = async function router(req, config) {
  const messages = req.body.messages || [];
  const lastUserMessage = messages.find(m => m.role === "user");

  // 简单任务用 deepseek-chat（快速）
  if (lastUserMessage && lastUserMessage.content.length < 500) {
    return "deepseek,deepseek-chat";
  }

  // 复杂任务用 deepseek-reasoner（深度思考）
  return "deepseek,deepseek-reasoner";
};
```

在 `config.json` 中添加：

```json
{
  "CUSTOM_ROUTER_PATH": "/Users/你的用户名/.claude-code-router/custom-router.js"
}
```

### 13.8 使用示例

```bash
# 1. 启动服务
ccr start

# 2. 在项目中使用
cd /path/to/your/project
ccr code "帮我重构这个组件"

# 3. 或激活后直接使用
eval "$(ccr activate)"
claude "分析这个项目的架构"

# 4. 动态切换模型
/model deepseek,deepseek-reasoner
```

### 13.9 额外优势

1. **成本节省**：DeepSeek 比 Claude 便宜约 95-98%
2. **无缝集成**：Claude Code 的所有功能都能正常使用
3. **工具调用**：支持 `tooluse` transformer，确保工具调用正常
4. **流式输出**：实时响应体验
5. **灵活切换**：可以在不同模型间切换

---

## 十四、总结

### 14.1 项目评价

Claude Code Router 是一个**设计精良、功能强大、高度可扩展**的 LLM 路由中间件。它成功地解决了 Claude Code 对 Anthropic API 的依赖问题，为用户提供了更多的选择和灵活性。

### 14.2 核心价值

- ✅ **降低成本**：支持更便宜的模型提供商
- ✅ **提升灵活性**：多提供商、多模型选择
- ✅ **保持兼容**：完全兼容 Claude Code
- ✅ **透明转换**：自动处理格式转换
- ✅ **易于扩展**：插件化架构

### 14.3 适用场景

1. **希望降低 AI 编程成本的团队**
   - 使用 DeepSeek 等低成本模型
   - 节省约 95-98% 的 API 成本

2. **需要多模型切换的开发者**
   - 根据任务复杂度选择不同模型
   - 简单任务用快速模型，复杂任务用强大模型

3. **有特定合规要求的企业**
   - 使用本地模型（Ollama）
   - 数据不出本地网络

4. **希望优化工作流程的高级用户**
   - 自定义路由规则
   - 项目级配置管理

5. **CI/CD 自动化**
   - GitHub Actions 集成
   - 离峰时段任务调度

### 14.4 最终结论

这是一个**优秀的开源项目范例**：
- 代码结构清晰
- 文档完善
- 功能实用
- 社区活跃
- 持续迭代

**强烈推荐**给所有使用 Claude Code 的开发者尝试！

---

## 附录

### A. 快速参考命令

```bash
# 服务管理
ccr start      # 启动服务
ccr stop       # 停止服务
ccr restart    # 重启服务
ccr status     # 查看状态

# 使用 Claude Code
ccr code "prompt"           # 执行命令
ccr model                   # 选择模型
ccr ui                      # 打开 UI
eval "$(ccr activate)"      # 激活环境变量

# 运行时切换模型
/model provider,model       # 在 Claude Code 中切换
```

### B. 配置文件路径

| 平台 | 配置文件路径 |
|------|-------------|
| Windows | `C:\Users\用户名\.claude-code-router\config.json` |
| macOS/Linux | `~/.claude-code-router/config.json` |
| 项目级 | `~/.claude-code-router/项目名/config.json` |
| 会话级 | `~/.claude-code-router/项目名/sessionId.json` |

### C. 日志文件路径

| 日志类型 | 路径 |
|----------|------|
| 服务器日志 | `~/.claude-code-router/logs/ccr-*.log` |
| 应用日志 | `~/.claude-code-router/claude-code-router.log` |

### D. 有用的资源

- **GitHub 仓库**：https://github.com/musistudio/claude-code-router
- **NPM 包**：https://www.npmjs.com/package/@musistudio/claude-code-router
- **Discord 社区**：https://discord.gg/rdftVMaUcS
- **赞助支持**：Ko-fi、PayPal、支付宝、微信支付

---

**报告生成完毕** 📝

本报告涵盖了 Claude Code Router 项目的全面分析，包括技术架构、核心功能、配置指南以及 DeepSeek 集成的详细说明。希望这份报告对您有所帮助！
