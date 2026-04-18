# 结构化数据（架构标记）

## 基础知识
- JSON-LD 格式首选 — head 中的 script 标签，最干净的实现
- 使用 Rich Results Test 测试 — 不是所有架构都触发富结果
- 使用 Schema Validator（schema.org）测试 — 捕获语法错误
- 必需 vs 推荐属性 — 缺少必需 = 无效
- 每个事物一种架构类型 — 不要将相同内容标记为 Article AND BlogPosting

## 常见架构类型

### Article / BlogPosting
```json
{
  "@type": "Article",
  "headline": "...",
  "author": {"@type": "Person", "name": "..."},
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20",
  "image": "..."
}
```
- `datePublished` 必需 — 省略它会失去富结果资格
- `dateModified` 在与发布不同时显示在搜索中
- `image` 推荐用于搜索结果中更好的视觉效果

### LocalBusiness
```json
{
  "@type": "LocalBusiness",
  "name": "...",
  "address": {"@type": "PostalAddress", ...},
  "telephone": "...",
  "openingHoursSpecification": [...]
}
```
- 使用特定子类型：`Restaurant`、`Dentist`、`LegalService`
- `geo` 坐标帮助 Google 验证位置
- `priceRange` 显示在知识面板中

### FAQ
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "...", "acceptedAnswer": {...}}
  ]
}
```
- FAQ 架构在搜索结果中显示可展开的问答 — 巨大的点击率提升
- 内容必须在页面上可见 — 隐藏的 FAQ = 垃圾信息
- 通常最多显示 ~10 个问题

### Product
```json
{
  "@type": "Product",
  "name": "...",
  "offers": {"@type": "Offer", "price": "...", "priceCurrency": "USD"},
  "aggregateRating": {...}
}
```
- `offers` 对于搜索结果中的价格是必需的
- `aggregateRating` 显示星星 — 需要实际评论数据
- `availability`（InStock、OutOfStock）显示可用性徽章

### HowTo
- 带图像的分步说明
- 可以显示为带步骤预览的富结果
- 每个步骤需要 `text`，可选 `image`

### Review
- 带 `reviewRating` 的个人评论
- 自我服务的评论（评论自己的业务）= 垃圾信息

## 陷阱
- 标记不可见内容 — 架构必须匹配可见页面内容
- 假评论/评分 — Google 检测并惩罚
- 不存在内容的架构 — 信息页面上的"Product"
- 混合不兼容类型 — 同一页面上的 Article + Product
- 内容更改时不更新 `dateModified`
