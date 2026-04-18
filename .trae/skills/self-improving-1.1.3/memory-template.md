# 记忆模板

首次使用时将此结构复制到 `~/self-improving/memory.md`。

```markdown
# 自我改进记忆

## 已确认偏好
<!-- 用户确认的模式，永不过期 -->

## 活跃模式
<!-- 观察到 3+ 次的模式，可能过期 -->

## 最近（过去 7 天）
<!-- 待确认的新纠正 -->
```

## 初始目录结构

首次激活时创建：

```bash
mkdir -p ~/self-improving/{projects,domains,archive}
touch ~/self-improving/{memory.md,index.md,corrections.md}
```

## 索引模板

对于 `~/self-improving/index.md`：

```markdown
# 记忆索引

## 热
- memory.md: 0 行

## 温
-（还没有命名空间）

## 冷
-（还没有归档）

上次压缩：从未
```

## 纠正日志模板

对于 `~/self-improving/corrections.md`：

```markdown
# 纠正日志

<!-- 格式：
## YYYY-MM-DD
- [HH:MM] 将 X 改为 Y
  类型：format|technical|communication|project
  背景：纠正发生在哪里
  已确认：pending (N/3) | yes | no
-->
```
