# {{TITLE}}

{{DESCRIPTION}}
{{QUICK_REFERENCE}}
## 先决条件

检查是否安装了 Python：

```bash
python3 --version || python --version
```

如果未安装 Python，请根据用户的操作系统安装：

**macOS:**
```bash
brew install python3
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install python3
```

**Windows:**
```powershell
winget install Python.Python.3.12
```

---

## 如何使用这个 {{SKILL_OR_WORKFLOW}}

当用户请求 UI/UX 工作（设计、构建、创建、实施、审查、修复、改进）时，请遵循此工作流程：

### 步骤 1：分析用户需求

从用户请求中提取关键信息：
- **产品类型**：SaaS、电子商务、作品集、仪表板、着陆页等
- **风格关键词**：极简、有趣、专业、优雅、深色模式等
- **行业**：医疗健康、金融科技、游戏、教育等
- **技术栈**：React、Vue、Next.js 或默认为 `html-tailwind`

### 步骤 2：生成设计系统（必需）

**始终以 `--design-system` 开始**，以获得带有推理的综合推荐：

```bash
python3 {{SCRIPT_PATH}} "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

此命令：
1. 并行搜索 5 个领域（产品、风格、颜色、着陆页、排版）
2. 应用来自 `ui-reasoning.csv` 的推理规则以选择最佳匹配
3. 返回完整的设计系统：模式、风格、颜色、排版、效果
4. 包括要避免的反模式

**示例：**
```bash
python3 {{SCRIPT_PATH}} "beauty spa wellness service" --design-system -p "Serenity Spa"
```

### 步骤 2b：持久化设计系统（主文件 + 覆盖模式）

要保存设计系统以便在会话之间进行层次化检索，请添加 `--persist`：

```bash
python3 {{SCRIPT_PATH}} "<query>" --design-system --persist -p "Project Name"
```

这会创建：
- `design-system/MASTER.md` — 包含所有设计规则的全局真实来源
- `design-system/pages/` — 用于页面特定覆盖的文件夹

**使用页面特定覆盖：**
```bash
python3 {{SCRIPT_PATH}} "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

这还会创建：
- `design-system/pages/dashboard.md` — 与主文件的页面特定偏差

**层次化检索工作原理：**
1. 当构建特定页面（例如"结账"）时，首先检查 `design-system/pages/checkout.md`
2. 如果页面文件存在，其规则**覆盖**主文件
3. 如果不存在，仅使用 `design-system/MASTER.md`

### 步骤 3：补充详细搜索（根据需要）

获得设计系统后，使用领域搜索获取其他详细信息：

```bash
python3 {{SCRIPT_PATH}} "<keyword>" --domain <domain> [-n <max_results>]
```

**何时使用详细搜索：**

| 需求 | 领域 | 示例 |
|------|------|------|
| 更多风格选项 | `style` | `--domain style "glassmorphism dark"` |
| 图表推荐 | `chart` | `--domain chart "real-time dashboard"` |
| UX 最佳实践 | `ux` | `--domain ux "animation accessibility"` |
| 替代字体 | `typography` | `--domain typography "elegant luxury"` |
| 着陆页结构 | `landing` | `--domain landing "hero social-proof"` |

### 步骤 4：技术栈指南（默认：html-tailwind）

获取实施特定的最佳实践。如果用户未指定技术栈，**默认为 `html-tailwind`**。

```bash
python3 {{SCRIPT_PATH}} "<keyword>" --stack html-tailwind
```

可用技术栈：`html-tailwind`、`react`、`nextjs`、`vue`、`svelte`、`swiftui`、`react-native`、`flutter`、`shadcn`、`jetpack-compose`

---

## 搜索参考

### 可用领域

| 领域 | 用途 | 示例关键词 |
|------|------|-----------|
| `product` | 产品类型推荐 | SaaS、e-commerce、portfolio、healthcare、beauty、service |
| `style` | UI 风格、颜色、效果 | glassmorphism、minimalism、dark mode、brutalism |
| `typography` | 字体配对、Google Fonts | elegant、playful、professional、modern |
| `color` | 按产品类型的调色板 | saas、ecommerce、healthcare、beauty、fintech、service |
| `landing` | 页面结构、CTA 策略 | hero、hero-centric、testimonial、pricing、social-proof |
| `chart` | 图表类型、库推荐 | trend、comparison、timeline、funnel、pie |
| `ux` | 最佳实践、反模式 | animation、accessibility、z-index、loading |
| `react` | React/Next.js 性能 | waterfall、bundle、suspense、memo、rerender、cache |
| `web` | Web 界面指南 | aria、focus、keyboard、semantic、virtualize |
| `prompt` | AI 提示、CSS 关键词 | (style name) |

### 可用技术栈

| 技术栈 | 重点 |
|-------|------|
| `html-tailwind` | Tailwind 实用工具、响应式、a11y（默认） |
| `react` | 状态、钩子、性能、模式 |
| `nextjs` | SSR、路由、图像、API 路由 |
| `vue` | 组合 API、Pinia、Vue Router |
| `svelte` | Runes、stores、SvelteKit |
| `swiftui` | Views、State、Navigation、Animation |
| `react-native` | 组件、导航、列表 |
| `flutter` | Widgets、State、布局、主题 |
| `shadcn` | shadcn/ui 组件、主题、表单、模式 |
| `jetpack-compose` | Composables、修饰符、状态提升、重组 |

---

## 示例工作流程

**用户请求：** "为专业皮肤护理服务制作着陆页"

### 步骤 1：分析需求
- 产品类型：美容/水疗服务
- 风格关键词：优雅、专业、柔和
- 行业：美容/健康
- 技术栈：html-tailwind（默认）

### 步骤 2：生成设计系统（必需）

```bash
python3 {{SCRIPT_PATH}} "beauty spa wellness service elegant" --design-system -p "Serenity Spa"
```

**输出：** 完整的设计系统，包含模式、风格、颜色、排版、效果和反模式。

### 步骤 3：补充详细搜索（根据需要）

```bash
# 获取动画和可访问性的 UX 指南
python3 {{SCRIPT_PATH}} "animation accessibility" --domain ux

# 如果需要，获取替代排版选项
python3 {{SCRIPT_PATH}} "elegant luxury serif" --domain typography
```

### 步骤 4：技术栈指南

```bash
python3 {{SCRIPT_PATH}} "layout responsive form" --stack html-tailwind
```

**然后：** 综合设计系统 + 详细搜索并实施设计。

---

## 输出格式

`--design-system` 标志支持两种输出格式：

```bash
# ASCII 框（默认）- 最适合终端显示
python3 {{SCRIPT_PATH}} "fintech crypto" --design-system

# Markdown - 最适合文档
python3 {{SCRIPT_PATH}} "fintech crypto" --design-system -f markdown
```

---

## 获得更好结果的提示

1. **关键词要具体** - "healthcare SaaS dashboard" > "app"
2. **多次搜索** - 不同的关键词揭示不同的见解
3. **组合领域** - 风格 + 排版 + 颜色 = 完整设计系统
4. **始终检查 UX** - 搜索"animation"、"z-index"、"accessibility"以查找常见问题
5. **使用技术栈标志** - 获取实施特定的最佳实践
6. **迭代** - 如果第一次搜索不匹配，请尝试不同的关键词

---

## 专业 UI 的常见规则

这些是经常被忽视的问题，会使 UI 看起来不专业：

### 图标和视觉元素

| 规则 | 做 | 不要 |
|------|----|-----|
| **不使用表情符号图标** | 使用 SVG 图标（Heroicons、Lucide、Simple Icons） | 使用 🎨 🚀 ⚙️ 等表情符号作为 UI 图标 |
| **稳定的悬停状态** | 悬停时使用颜色/不透明度过渡 | 使用会改变布局的缩放变换 |
| **正确的品牌标志** | 从 Simple Icons 研究官方 SVG | 猜测或使用不正确的标志路径 |
| **一致的图标大小** | 使用固定的 viewBox (24x24) 和 w-6 h-6 | 随机混合不同的图标大小 |

### 交互和光标

| 规则 | 做 | 不要 |
|------|----|-----|
| **光标指针** | 为所有可点击/可悬停的卡片添加 `cursor-pointer` | 在交互式元素上保留默认光标 |
| **悬停反馈** | 提供视觉反馈（颜色、阴影、边框） | 没有元素是交互式的指示 |
| **平滑过渡** | 使用 `transition-colors duration-200` | 即时状态变化或太慢 (>500ms) |

### 浅色/深色模式对比度

| 规则 | 做 | 不要 |
|------|----|-----|
| **玻璃卡片浅色模式** | 使用 `bg-white/80` 或更高的不透明度 | 使用 `bg-white/10`（太透明） |
| **浅色文本对比度** | 对文本使用 `#0F172A` (slate-900) | 对正文文本使用 `#94A3B8` (slate-400) |
| **浅色静音文本** | 最低使用 `#475569` (slate-600) | 使用 gray-400 或更浅 |
| **边框可见性** | 在浅色模式下使用 `border-gray-200` | 使用 `border-white/10`（不可见） |

### 布局和间距

| 规则 | 做 | 不要 |
|------|----|-----|
| **浮动导航栏** | 添加 `top-4 left-4 right-4` 间距 | 将导航栏粘贴到 `top-0 left-0 right-0` |
| **内容内边距** | 考虑固定导航栏高度 | 让内容隐藏在固定元素后面 |
| **一致的最大宽度** | 使用相同的 `max-w-6xl` 或 `max-w-7xl` | 混合不同的容器宽度 |

---

## 交付前检查清单

在交付 UI 代码之前，请验证以下项目：

### 视觉质量
- [ ] 不使用表情符号作为图标（改用 SVG）
- [ ] 所有图标来自一致的图标集（Heroicons/Lucide）
- [ ] 品牌标志正确（从 Simple Icons 验证）
- [ ] 悬停状态不会导致布局变化
- [ ] 直接使用主题颜色（bg-primary）而不是 var() 包装器

### 交互
- [ ] 所有可点击元素都有 `cursor-pointer`
- [ ] 悬停状态提供清晰的视觉反馈
- [ ] 过渡平滑（150-300ms）
- [ ] 键盘导航的焦点状态可见

### 浅色/深色模式
- [ ] 浅色模式文本具有足够的对比度（最低 4.5:1）
- [ ] 玻璃/透明元素在浅色模式下可见
- [ ] 两种模式下边框都可见
- [ ] 交付前测试两种模式

### 布局
- [ ] 浮动元素与边缘有适当的间距
- [ ] 没有内容隐藏在固定导航栏后面
- [ ] 在 375px、768px、1024px、1440px 下响应
- [ ] 移动端没有水平滚动

### 可访问性
- [ ] 所有图像都有替代文本
- [ ] 表单输入有标签
- [ ] 颜色不是唯一的指示符
- [ ] 尊重 `prefers-reduced-motion`
