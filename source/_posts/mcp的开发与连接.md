---
title: mcp的开发与连接
categories: 大模型与AI
date: 2023-09-01 00:00:00
tags: [mcp, 开发, 连接, ai工具, 协议]
---
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

// Helper function for making NWS API requests
async function makeNWSRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/geo+json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

interface AlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
  };
}

// Format alert data
function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `Event: ${props.event || "Unknown"}`,
    `Area: ${props.areaDesc || "Unknown"}`,
    `Severity: ${props.severity || "Unknown"}`,
    `Status: ${props.status || "Unknown"}`,
    `Headline: ${props.headline || "No headline"}`,
    "---",
  ].join("\n");
}

interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

interface AlertsResponse {
  features: AlertFeature[];
}

interface PointsResponse {
  properties: {
    forecast?: string;
  };
}

interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}

// Create server instance
const server = new McpServer({
  name: "weather",
  version: "1.0.0",
});

// Register weather tools
server.tool(
  "get-alerts",
  "Get weather alerts for a state",
  {
    state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
  },
  async ({ state }) => {
    const stateCode = state.toUpperCase();
    const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
    const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

    if (!alertsData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve alerts data",
          },
        ],
      };
    }

    const features = alertsData.features || [];
    if (features.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No active alerts for ${stateCode}`,
          },
        ],
      };
    }

    const formattedAlerts = features.map(formatAlert);
    const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join("\n")}`;

    return {
      content: [
        {
          type: "text",
          text: alertsText,
        },
      ],
    };
  },
);

server.tool(
  "get-forecast",
  "Get weather forecast for a location",
  {
    latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .describe("Longitude of the location"),
  },
  async ({ latitude, longitude }) => {
    // Get grid point data
    const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

    if (!pointsData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
          },
        ],
      };
    }

    const forecastUrl = pointsData.properties?.forecast;
    if (!forecastUrl) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to get forecast URL from grid point data",
          },
        ],
      };
    }

    // Get forecast data
    const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
    if (!forecastData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve forecast data",
          },
        ],
      };
    }

    const periods = forecastData.properties?.periods || [];
    if (periods.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No forecast periods available",
          },
        ],
      };
    }

    // Format forecast periods
    const formattedForecast = periods.map((period: ForecastPeriod) =>
      [
        `${period.name || "Unknown"}:`,
        `Temperature: ${period.temperature || "Unknown"}°${period.temperatureUnit || "F"}`,
        `Wind: ${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
        `${period.shortForecast || "No forecast available"}`,
        "---",
      ].join("\n"),
    );

    const forecastText = `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join("\n")}`;

    return {
      content: [
        {
          type: "text",
          text: forecastText,
        },
      ],
    };
  },
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

```

# MCP Weather Server 依赖详细说明

## 项目概述

MCP Weather Server 是一个基于 TypeScript 的 Model Context Protocol (MCP) 服务器，提供天气相关工具，通过集成国家天气服务 (NWS) API 来获取天气警报和天气预报信息。

## 依赖结构

项目依赖分为两类：
- **主要依赖 (dependencies)**: 运行时必需的包
- **开发依赖 (devDependencies)**: 仅开发时需要的包

## 主要依赖 (dependencies)

### @modelcontextprotocol/sdk ^1.4.0

**类型**: MCP 框架核心 SDK
**用途**: 提供 Model Context Protocol 的完整实现，用于构建 MCP 服务器

#### 详细功能
- **MCP 服务器实现**: 提供 `McpServer` 类用于创建 MCP 服务器实例
- **传输层支持**: 包含 `StdioServerTransport` 用于标准输入输出通信
- **工具注册**: 支持注册和调用各种工具（如 `get-alerts` 和 `get-forecast`）
- **参数验证**: 集成 Zod 进行工具参数的运行时验证
- **错误处理**: 提供统一的错误处理机制

#### 在项目中的使用
```typescript
// src/index.ts:75-79
const server = new McpServer(
  {
    name: "weather",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// src/index.ts:89
const transport = new StdioServerTransport();
```

## 开发依赖 (devDependencies)

### @types/node ^22.10.0

**类型**: Node.js TypeScript 类型定义
**用途**: 为 Node.js 内置模块和 API 提供 TypeScript 类型支持

#### 详细功能
- **类型安全**: 为 Node.js 的内置模块（如 `fs`, `http`, `https` 等）提供类型定义
- **API 智能提示**: 在 IDE 中提供完整的代码补全和类型检查
- **版本兼容**: 与 Node.js v22.10.0 特性保持同步

#### 在项目中的使用
```typescript
// src/index.ts:10
import { z } from "zod";
import { McpServer, StdioServerTransport } from "@modelcontextprotocol/sdk";
```

### typescript ^5.7.2

**类型**: TypeScript 编译器
**用途**: 将 TypeScript 代码编译为 JavaScript，提供静态类型检查

#### 详细功能
- **编译**: 将 `.ts` 文件编译为 `.js` 文件
- **类型检查**: 在编译时进行静态类型分析，发现潜在错误
- **现代 JavaScript 支持**: 支持 ES2022 语法和 Node16 模块系统
- **严格模式**: 启用所有严格类型检查选项

#### 编译配置 (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

#### 构建过程
```bash
# package.json:10
"build": "tsc && node -e \"require('fs').chmodSync('build/index.js', '755')\""
```

1. **TypeScript 编译**: `tsc` 将 `src/index.ts` 编译为 `build/index.js`
2. **设置可执行权限**: 将编译后的文件设置为可执行（755 权限）

## 依赖版本和安全考虑

### 版本锁定
- 使用 `^` 前缀进行版本管理，允许自动更新补丁版本
- `@modelcontextprotocol/sdk`: 1.x 系列的最新版本
- `@types/node`: 22.x 系列的最新版本
- `typescript`: 5.x 系列的最新版本

### 安全性
- 所有依赖都来自官方 npm 注册表
- 定期更新依赖以获取安全补丁
- 使用 TypeScript 的严格模式减少运行时错误

## 项目的最小依赖特性

这个项目采用了最小化依赖的设计理念：

### 优点
1. **维护简单**: 依赖项少，版本冲突风险低
2. **构建快速**: 编译时间短，包体积小
3. **安全可靠**: 减少了依赖链中的潜在安全漏洞
4. **学习友好**: 代码结构清晰，易于理解和修改

### 为什么只需要这些依赖

- **无 HTTP 客户端库**: 使用 Node.js 内置的 `https` 模块
- **无测试框架**: 项目结构简单，暂未配置测试
- **无代码格式化工具**: 依赖开发者的代码风格自觉
- **无额外的验证库**: 直接使用 Zod（已包含在 MCP SDK 中）

## 扩展依赖的可能性

如果项目需要扩展功能，可能需要添加以下依赖：

### 开发工具类
- **eslint**: 代码质量检查
- **prettier**: 代码格式化
- **husky**: Git hooks 管理
- **jest/vitest**: 单元测试框架

### 功能增强类
- **axios**: 更友好的 HTTP 客户端（如果需要更复杂的 HTTP 功能）
- **dotenv**: 环境变量管理
- **winston**: 日志记录
- **cache-manager**: 缓存管理（用于 API 响应缓存）

## 依赖更新策略

### 推荐的更新频率
- **主要依赖**: 每月检查更新，特别关注 MCP SDK 的版本更新
- **开发依赖**: 每季度检查更新，重点关注 TypeScript 和 Node.js 类型定义

### 更新命令
```bash
# 检查过时的依赖
npm outdated

# 更新到最新兼容版本
npm update

# 检查安全漏洞
npm audit
npm audit fix
```

## 总结

MCP Weather Server 项目通过最小化的依赖策略实现了高效、可靠的天气服务功能。项目依赖的选择体现了 TypeScript 生态系统的优势，通过类型安全和现代化的工具链确保代码质量。这种精简的依赖结构使得项目易于维护、部署和扩展。
