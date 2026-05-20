# PDF 工具设计规格

## 概述

为 ToolZen 新增 PDF 工具分类，首批 3 个工具全部基于 pdf-lib 库在浏览器端运行，无需服务器上传。

## 技术栈

- **pdf-lib** (~100KB gzipped) — 创建和修改 PDF：合并、拆分、压缩、元数据
- **pdfjs-dist** (Mozilla PDF.js) — PDF 页面渲染为 Canvas（缩略图预览用）
- 所有操作 100% 在浏览器完成，符合 ToolZen 隐私优先原则

## 首批工具

### 1. PDF 合并 (pdf-merge)
- 用户拖入/选择多个 PDF 文件
- 列表展示文件，支持拖拽排序
- 点击"合并"按钮 → 生成合并后的 PDF 下载
- 技术：`PDFDocument.create()` + `copyPages()` + `addPage()`

### 2. PDF 拆分 (pdf-split)
- 上传单个 PDF
- 用 pdfjs-dist 渲染每页缩略图
- 用户选择页面范围（全部 / 指定页码 / 每N页拆分）
- 打包为 ZIP 下载（使用 JSZip，纯前端生成）
- 技术：pdfjs-dist 预览 + pdf-lib 提取页面 + JSZip 打包

### 3. PDF 压缩 (pdf-compress)
- 上传 PDF → 显示原始大小
- 三种压缩等级：基础（去冗余）/ 标准（图片轻压）/ 极限（图片重压）
- 显示压缩后大小和压缩率
- 技术：pdf-lib save() 去冗余 + Canvas API 重压内嵌图片

## 分类页面

新增 `pdf` 分类（`📄 PDF 工具`），路由 `/zh/category/pdf/` 和 `/en/category/pdf/`。

## i18n

中英文翻译覆盖：分类名、工具名、描述、关键词、HowTo、FAQ、UI 文案。

## 后续待扩展

PDF 工具箱后续可增加：
- PDF 转图片 (PDF → JPG/PNG)
- 图片转 PDF (JPG/PNG → PDF)
- PDF 旋转页面
- PDF 页面重排（拖拽调整页码顺序）
- PDF 添加水印
- PDF 提取文字（pdfjs-dist getTextContent）
- PDF 解密/加密
- PDF 元数据查看与编辑
