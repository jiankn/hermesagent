# Bootcamp Material Audit

This note records how the local `wechat` Markdown material was used for the HermesAgent 101 bootcamp rewrite. It is a source-analysis note, not republished article content.

## Reuse Rules

- Do not copy public-account prose into the site.
- Do not retain author names, public-account IDs, QR codes, avatar images, "follow us" copy, or article-album links.
- Use the files as research material: extract user problems, workflows, pitfalls, examples, and vocabulary.
- Convert the material into original HermesAgent 101 tutorials with a product-manager lens.

## Source Buckets

### Setup And Deployment

Files about local install, WSL2, one-command install, cloud templates, model configuration, `hermes doctor`, and first-run checks informed Day 1.

Useful product insight: the user is not buying an install command; the user is trying to reduce the time from "I heard about Hermes" to "I can get one useful answer and reproduce the setup tomorrow."

### Memory And Long-Term Context

Files explaining memory files, session search, context limits, memory cleanup, and user preferences informed Day 2.

Useful product insight: "remembers everything" is a poor product requirement. The real value is reducing repeated explanation while keeping stale or sensitive information out of durable memory.

### Messaging Channels

Files about Feishu, WeChat-style channels, gateway setup, QR login, pairing, gateway status, and channel troubleshooting informed Day 3.

Useful product insight: messaging integration is not a novelty feature. It is the way Hermes enters the place where requests already happen. Convenience requires stronger permission boundaries.

### Data And File Work

Examples around daily briefings, website monitoring, data extraction, content conversion, and document handling informed Day 4.

Useful product insight: users feel value when messy inputs become reviewable artifacts. The tutorial should teach raw folders, schemas, output files, and validation, not only "ask AI to process this."

### Skills, MCP, And Tool Boundaries

Files covering Skills, self-improvement, MCP, tool gateways, community skills, and prompt-to-workflow patterns informed Day 5.

Useful product insight: a Skill is a productized repeat workflow, not a fancy prompt. MCP is a boundary for tool access, not a reason to grant broad permissions.

### Automation

Files discussing cron, background services, monitoring, backups, daily reports, and gateway restarts informed Day 6.

Useful product insight: automation should start only after a manual workflow has passed multiple times. Saved input artifacts and idempotent delivery matter more than an impressive demo.

### Multi-Agent

Files about profiles, subagents, parallel work, supervisor/deep modes, and multi-agent use cases informed Day 7.

Useful product insight: multi-agent orchestration is worthwhile only when responsibilities are independent and the host agent synthesizes conflicts. It is not group chat.

## Rewrite Direction

The new bootcamp articles use:

- fewer generic "AI assistant" claims;
- more command-level checkpoints;
- explicit acceptance artifacts for every day;
- warnings from real setup friction;
- product-first framing before technical steps;
- no copied public-account call-to-action or identity material.
