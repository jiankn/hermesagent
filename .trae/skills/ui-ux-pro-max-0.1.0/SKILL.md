---
name: ui-ux-pro-max
description: UI/UX design intelligence and implementation guidance for building polished interfaces. Use when the user asks for UI design, UX flows, information architecture, visual style direction, design systems/tokens, component specs, copy/microcopy, accessibility, or to generate/critique/refine frontend UI (HTML/CSS/JS, React, Next.js, Vue, Svelte, Tailwind). Includes workflows for (1) generating new UI layouts and styling, (2) improving existing UI/UX, (3) producing design-system tokens and component guidelines, and (4) turning UX recommendations into concrete code changes.
---

Follow these steps to deliver high-quality UI/UX output with minimal back-and-forth.

## 1) Triage（分类）
Ask only what you must to avoid wrong work:
- Target platform: web / iOS / Android / desktop
- Stack (if code changes): React/Next/Vue/Svelte, CSS/Tailwind, component library
- Goal and constraints: conversion, speed, brand vibe, accessibility level (WCAG AA?)
- What you have: screenshot, Figma, repo, URL, user journey

If the user says "全部都要" (design + UX + code + design system), treat it as four deliverables and ship in that order.

## 2) Produce Deliverables (pick what fits)（生成交付物，选择适合的）
Always be concrete: name components, states, spacing, typography, and interactions.

- **UI concept + layout（UI概念 + 布局）**: Provide a clear visual direction, grid, typography, color system, key screens/sections.
- **UX flow（UX流程）**: Map the user journey, critical paths, error/empty/loading states, edge cases.
- **Design system（设计系统）**: Tokens (color/typography/spacing/radius/shadow), component rules, accessibility notes.
- **Implementation plan（实施计划）**: Exact file-level edits, component breakdown, and acceptance criteria.

## 3) Use Bundled Assets（使用捆绑资产）
This skill bundles data you can cite for inspiration/standards.

- **Design intelligence data（设计智能数据）**: Read from `skills/ui-ux-pro-max/assets/data/` when you need palettes, patterns, or UI/UX heuristics.
- **Upstream reference（上游参考）**: If you need more phrasing/examples, consult `skills/ui-ux-pro-max/references/upstream-skill-content.md`.

## 4) Optional Script (Design System Generator)（可选脚本：设计系统生成器）
If you need to quickly generate tokens and page-specific overrides, use the bundled script:

```bash
python3 skills/ui-ux-pro-max/scripts/design_system.py --help
```

Prefer running it when the user wants a structured token output (ASCII-friendly).

## Output Standards（输出标准）
- Default to ASCII-only tokens/variables unless the project already uses Unicode.
- Include: spacing scale, type scale, 2-3 font pair options, color tokens, component states.
- Always cover: empty/loading/error, keyboard navigation, focus states, contrast.
