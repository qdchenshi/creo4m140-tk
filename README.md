# Creo Parametric TOOLKIT (4-M140) Documentation

Creo Parametric TOOLKIT 4-M140 版本的官方 API 文档与用户手册在线镜像。本仓库为纯静态站点，部署在 Cloudflare Pages。

**在线访问：** <https://creo4m140-tk.qdchenshi.com>

## 文档入口

| 入口 | 说明 |
|---|---|
| [API Wizard](https://creo4m140-tk.qdchenshi.com/manual0/loadApiWizard.html) | 按对象浏览 Creo TOOLKIT 的所有 API，支持函数名搜索与通配符 `*`，已废弃函数以黄色高亮 |
| [User's Guide](https://creo4m140-tk.qdchenshi.com/manual0/tkusetoc.htm) | 完整的开发者手册，介绍 TOOLKIT 的特性、使用方式与所需背景知识 |

## 目录结构

```
.
├── index.html              站点入口
├── api/                    7128 个 API 参考页（按内部 ID 命名）
├── manual0/                User's Guide 全部章节（423 个页面）
├── samples/                示例代码与示例 API 说明（407 个页面）
├── images/                 文档中引用的图片
├── gnu.regexp-1.0.8/       API Wizard 搜索功能依赖的正则库
├── *.jar                   API Wizard 与 Manual 浏览器的 Java 组件
├── api.IDX / api.TREE      API Wizard 使用的索引与目录结构
└── manual0.TREE            手册目录树
```

> ⚠️ **请勿重组目录结构**：`api/`、`manual0/`、`samples/` 中的 HTML 之间通过相对路径硬编码互链，`.jar` / `.IDX` / `.TREE` 也按固定路径加载，任何重命名或挪动都会引发大面积死链。

## 部署

- **自定义域：** `creo4m140-tk.qdchenshi.com`


## 联系方式

技术支持或开发咨询：<qdchenshi@gmail.com>

更多信息：<https://qdchenshi.com>

## 版权

本仓库内容来自 PTC Creo Parametric TOOLKIT 4-M140 官方文档，所有 API 文档、用户手册、示例代码版权归 PTC Inc. 所有。本镜像仅供学习和开发查阅，不作商业用途。
