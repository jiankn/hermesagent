# 技术 SEO

## 核心网络指标
- **LCP**（最大内容绘制）：< 2.5s — 最大可见元素加载时间
- **INP**（交互到下一次绘制）：< 200ms — 对用户交互的响应
- **CLS**（累积布局偏移）：< 0.1 — 视觉稳定性，无跳跃内容
- 使用 PageSpeed Insights 测试 — 来自真实用户的现场数据比实验室更重要
- 差的 CWV = 竞争查询中的排名降级

## 可爬取性
- robots.txt：`Disallow: /admin/` 阻止爬取程序 — 使用 GSC 中的 `robots.txt Tester` 检查
- 永远不要在 robots.txt 中阻止 CSS/JS — Google 需要它们来渲染 JavaScript
- 爬取预算：大型网站（>10K 页面）必须优先考虑重要页面
- 孤立页面（无内部链接）不会被定期爬取
- XML 站点地图：每个文件最多 50K URL 或 50MB，在 robots.txt 中链接

## 索引
- `noindex` meta 标签：防止索引但浪费爬取预算
- `canonical` URL：所有页面上的自引用，联合内容的跨域
- 参数 URL（`?sort=price`）需要指向主版本的 canonical
- 分页：使用 rel="next"/"prev" 或指向第 1 页的 canonical，取决于内容
- 在 GSC 中检查索引：URL 检查工具显示渲染和索引状态

## 移动端
- 移动端优先索引：Google 索引移动端，桌面端次要
- 必需的视口 meta 标签：`<meta name="viewport" content="width=device-width, initial-scale=1">`
- 触摸目标最小 48x48px — 不满足这一点会损害移动可用性分数
- 无侵入性插页式广告 — 阻止内容的弹出窗口会被降级
- 使用移动友好测试测试 — 失败会阻止移动搜索中的排名

## HTTPS
- 排名必需 — HTTP 网站显示"不安全"警告
- 混合内容（HTTPS 页面上的 HTTP 资源）破坏挂锁
- HSTS 头：告诉浏览器总是使用 HTTPS
- 迁移后：301 将所有 HTTP 重定向到 HTTPS，更新 canonical URL

## 速度
- TTFB < 200ms — 服务器响应时间，托管很重要
- 渲染阻塞 CSS：内联关键 CSS，延迟其余部分
- JavaScript：async/defer 属性，避免阻塞主线程
- 图像：延迟加载、响应式 srcset、现代格式（WebP/AVIF）
- 字体：font-display: swap 防止加载期间的不可见文本
- 静态资产的 CDN — 减少全局延迟
