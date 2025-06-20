---
title: "MCP工具使用指南"
description: "详细介绍Model Context Protocol工具的配置和使用方法"
date: 2025-01-19T10:30:00+08:00
lastmod: 2025-01-19T10:30:00+08:00
draft: false
slug: "mcp-tools-guide"
categories:
  - "AI"
  - "Tools"
tags:
  - "mcp"
  - "ai-tools"
  - "configuration"
  - "tutorial"
image: ""
weight: 90
toc: true
math: false
license: "CC BY-NC-SA 4.0"
---

# MCP工具使用指南

## 什么是MCP

Model Context Protocol (MCP) 是一个开放标准，用于连接AI助手与各种数据源和工具。通过MCP，AI可以安全地访问本地文件、数据库、API等资源，大大扩展了AI的能力边界。

## 核心概念

### 1. MCP服务器

MCP服务器是提供特定功能的独立进程，例如：
- 文件系统访问
- 数据库查询
- API调用
- 系统命令执行

### 2. MCP客户端

MCP客户端（通常是AI助手）通过标准协议与MCP服务器通信，获取数据或执行操作。

### 3. 工具和资源

- **工具（Tools）**：AI可以调用的函数
- **资源（Resources）**：AI可以访问的数据源
- **提示（Prompts）**：预定义的提示模板

## 安装配置

### 1. 环境要求

```bash
# Node.js 环境
node --version  # >= 18.0.0
npm --version   # >= 8.0.0

# Python 环境（可选）
python --version  # >= 3.8
pip --version
```

### 2. 安装MCP SDK

```bash
# JavaScript/TypeScript
npm install @modelcontextprotocol/sdk

# Python
pip install mcp
```

### 3. 配置文件

创建 `mcp-config.json` 配置文件：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    },
    "database": {
      "command": "python",
      "args": [
        "-m", "mcp_server_sqlite",
        "/path/to/database.db"
      ]
    }
  }
}
```

## 常用MCP服务器

### 1. 文件系统服务器

提供文件和目录操作功能：

```bash
# 安装
npm install @modelcontextprotocol/server-filesystem

# 启动
npx @modelcontextprotocol/server-filesystem /home/user/documents
```

**主要功能**：
- 读取文件内容
- 写入文件
- 列出目录
- 搜索文件

### 2. SQLite数据库服务器

提供数据库查询功能：

```bash
# 安装
pip install mcp-server-sqlite

# 启动
python -m mcp_server_sqlite database.db
```

**主要功能**：
- 执行SQL查询
- 获取表结构
- 数据统计分析

### 3. Git服务器

提供Git仓库操作功能：

```bash
# 安装
npm install @modelcontextprotocol/server-git

# 启动
npx @modelcontextprotocol/server-git /path/to/repo
```

**主要功能**：
- 查看提交历史
- 比较文件差异
- 分支管理

### 4. Web搜索服务器

提供网络搜索功能：

```bash
# 安装
npm install @modelcontextprotocol/server-brave-search

# 配置API密钥
export BRAVE_API_KEY="your-api-key"

# 启动
npx @modelcontextprotocol/server-brave-search
```

## 自定义MCP服务器

### 1. 基础结构

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: 'my-custom-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// 定义工具
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'calculate',
        description: '执行数学计算',
        inputSchema: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: '数学表达式'
            }
          },
          required: ['expression']
        }
      }
    ]
  };
});

// 实现工具逻辑
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'calculate') {
    try {
      const result = eval(args.expression);
      return {
        content: [
          {
            type: 'text',
            text: `计算结果: ${result}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `计算错误: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
  
  throw new Error(`未知工具: ${name}`);
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 2. 资源提供

```typescript
// 定义资源
server.setRequestHandler('resources/list', async () => {
  return {
    resources: [
      {
        uri: 'config://settings',
        name: '系统配置',
        description: '应用程序配置信息',
        mimeType: 'application/json'
      }
    ]
  };
});

// 提供资源内容
server.setRequestHandler('resources/read', async (request) => {
  const { uri } = request.params;
  
  if (uri === 'config://settings') {
    const config = {
      version: '1.0.0',
      debug: false,
      maxConnections: 100
    };
    
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(config, null, 2)
        }
      ]
    };
  }
  
  throw new Error(`未知资源: ${uri}`);
});
```

## 使用技巧

### 1. 安全考虑

- **权限控制**：限制MCP服务器的访问范围
- **输入验证**：验证所有输入参数
- **错误处理**：妥善处理异常情况

```typescript
// 权限检查示例
function checkPermission(path: string): boolean {
  const allowedPaths = ['/home/user/documents', '/tmp'];
  return allowedPaths.some(allowed => path.startsWith(allowed));
}

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'read_file') {
    if (!checkPermission(args.path)) {
      throw new Error('访问被拒绝：路径不在允许范围内');
    }
    // 执行文件读取...
  }
});
```

### 2. 性能优化

- **连接池**：复用数据库连接
- **缓存机制**：缓存频繁访问的数据
- **异步处理**：使用异步操作避免阻塞

```typescript
// 缓存示例
const cache = new Map<string, any>();

server.setRequestHandler('tools/call', async (request) => {
  const cacheKey = `${request.params.name}:${JSON.stringify(request.params.arguments)}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const result = await processRequest(request);
  cache.set(cacheKey, result);
  
  return result;
});
```

### 3. 调试技巧

- **日志记录**：记录关键操作和错误
- **状态监控**：监控服务器运行状态
- **测试工具**：使用MCP客户端测试功能

```typescript
import { Logger } from './logger.js';

const logger = new Logger('mcp-server');

server.setRequestHandler('tools/call', async (request) => {
  logger.info(`调用工具: ${request.params.name}`, request.params.arguments);
  
  try {
    const result = await processRequest(request);
    logger.info(`工具执行成功: ${request.params.name}`);
    return result;
  } catch (error) {
    logger.error(`工具执行失败: ${request.params.name}`, error);
    throw error;
  }
});
```

## 实际应用案例

### 1. 代码分析助手

结合文件系统和Git服务器，创建代码分析助手：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "./src"]
    },
    "git": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-git", "."]
    }
  }
}
```

### 2. 数据分析平台

结合数据库和计算服务器：

```json
{
  "mcpServers": {
    "database": {
      "command": "python",
      "args": ["-m", "mcp_server_sqlite", "analytics.db"]
    },
    "calculator": {
      "command": "node",
      "args": ["./custom-calculator-server.js"]
    }
  }
}
```

### 3. 内容管理系统

结合文件系统和Web API：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "./content"]
    },
    "api": {
      "command": "python",
      "args": ["./api-server.py"]
    }
  }
}
```

## 故障排除

### 常见问题

1. **连接失败**
   - 检查服务器是否正常启动
   - 验证配置文件格式
   - 确认端口没有被占用

2. **权限错误**
   - 检查文件/目录权限
   - 验证用户访问权限
   - 确认安全策略设置

3. **性能问题**
   - 监控资源使用情况
   - 优化查询和操作
   - 考虑增加缓存

### 调试命令

```bash
# 检查MCP服务器状态
ps aux | grep mcp

# 查看日志
tail -f mcp-server.log

# 测试连接
curl -X POST http://localhost:3000/mcp/test
```

## 总结

MCP工具为AI助手提供了强大的扩展能力，通过合理配置和使用MCP服务器，可以让AI访问各种数据源和执行复杂操作。掌握MCP的使用方法，将大大提升AI助手的实用性和效率。

## 参考资源

- [MCP官方文档](https://modelcontextprotocol.io/)
- [MCP GitHub仓库](https://github.com/modelcontextprotocol)
- [MCP服务器列表](https://github.com/modelcontextprotocol/servers)

---

*本指南将根据MCP协议的更新持续完善。*