# 设置 — 自我改进代理

## 首次设置

### 1. 创建记忆结构

```bash
mkdir -p ~/self-improving/{projects,domains,archive}
```

### 2. 初始化核心文件

创建 `~/self-improving/memory.md`：
```markdown
# 记忆（热层）

## 偏好

## 模式

## 规则
```

创建 `~/self-improving/corrections.md`：
```markdown
# 纠正日志

| 日期 | 我哪里错了 | 正确答案 | 状态 |
|------|-----------|----------|------|
```

创建 `~/self-improving/index.md`：
```markdown
# 记忆索引

| 文件 | 行数 | 上次更新 |
|------|------|---------|
| memory.md | 0 | — |
| corrections.md | 0 | — |
```

### 3. 选择操作模式

添加到你的 AGENTS.md 或工作区配置：

```markdown
## 自我改进模式

当前模式：被动

可用模式：
- 被动：仅从明确纠正中学习
- 主动：重复 3 次后建议模式
- 严格：每个条目都需要确认
```

## 验证

运行"memory stats"以确认设置：

```
📊 自我改进记忆

🔥 热（总是加载）：
   memory.md: 0 个条目

🌡️ 温（按需加载）：
   projects/: 0 个文件
   domains/: 0 个文件

❄️ 冷（已归档）：
   archive/: 0 个文件

⚙️ 模式：被动
```

## 可选：心跳集成

添加到 `HEARTBEAT.md` 以进行自动维护：

```markdown
## 自我改进检查

- [ ] 查看 corrections.md 以获取准备好升级的模式
- [ ] 检查 memory.md 行数（应该 ≤100）
- [ ] 归档 90+ 天未使用的模式
```
