import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const today = '2026-04-19';
const author = 'HermesAgent 101 Team';

function frontmatter(meta) {
  return [
    '---',
    `title: ${JSON.stringify(meta.title)}`,
    `titleZh: ${JSON.stringify(meta.titleZh)}`,
    `slug: ${JSON.stringify(meta.slug)}`,
    `description: ${JSON.stringify(meta.description)}`,
    `descriptionZh: ${JSON.stringify(meta.descriptionZh)}`,
    `author: ${JSON.stringify(author)}`,
    `publishedAt: ${JSON.stringify(today)}`,
    `updatedAt: ${JSON.stringify(today)}`,
    `category: ${JSON.stringify(meta.category)}`,
    `tags: [${meta.tags.map((tag) => JSON.stringify(tag)).join(', ')}]`,
    `difficulty: ${JSON.stringify(meta.difficulty)}`,
    `readingTime: ${meta.readingTime}`,
    `featured: ${meta.featured ? 'true' : 'false'}`,
    '---',
    '',
  ].join('\n');
}

function writeArticle(article) {
  for (const locale of ['en', 'zh']) {
    const filePath = path.join(root, 'content', article.type, locale, `${article.filePath}.mdx`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${frontmatter(article.meta)}${article[locale].trim()}\n`, 'utf8');
  }
}

const articles = [
  {
    type: 'guides',
    filePath: 'resources/field-implementation-matrix',
    meta: {
      slug: 'field-implementation-matrix',
      title: 'Hermes Agent Field Implementation Matrix',
      titleZh: 'Hermes Agent 实战素材归类矩阵',
      description: 'A practical matrix for turning Hermes Agent deployment notes, messaging channels, memory, skills, automation, and multi-agent lessons into a safe rollout plan.',
      descriptionZh: '把部署笔记、消息通道、记忆、Skills、自动化和多 Agent 素材归类成可执行上线计划。',
      category: 'resources',
      tags: ['implementation', 'resources', 'field-notes', 'playbook', 'rollout'],
      difficulty: 'intermediate',
      readingTime: 14,
      featured: true,
    },
    zh: `
## 为什么需要一张实战矩阵

真实用户不会按文档目录学习 Hermes Agent。用户通常是被一个具体场景拉进来的：想在云服务器上跑一个 24 小时助理，想把飞书或微信类入口接起来，想让 Agent 记住自己的工作偏好，或者想把日报、网页监控、资料整理交给它。

这些需求看起来分散，本质上却是同一条产品路径：先让系统稳定运行，再让它进入用户真实入口，然后处理资料，最后把重复流程沉淀成 Skill、自动化和多 Agent 分工。

这张矩阵用来把零散教程、部署笔记和使用经验归类成上线计划。它不是内容搬运，也不是功能列表，而是一个判断工具：每一类素材应该进入哪个页面、解决什么用户问题、留下什么可复查产物。

## 素材归类矩阵

| 素材类型 | 用户真实问题 | 适合放到哪里 | 输出物 |
| --- | --- | --- | --- |
| 安装部署 | 我能不能先跑起来？本地还是云端？ | Bootcamp Day 1、部署指南 | 启动卡片、环境清单、回滚方式 |
| 模型配置 | 为什么装好了还是不会回答？Key 放哪？ | Day 1、模型配置指南 | provider、model、密钥位置、测试 prompt |
| 消息入口 | 我能不能在手机或团队群里喊它？ | Day 3、消息通道 Playbook | 授权用户、默认目录、禁止动作、日志 |
| 记忆系统 | 它该记住什么，不该记住什么？ | Day 2、记忆治理指南 | 记忆契约、过期规则、删除路径 |
| 文件和数据 | 它能不能处理会议纪要、CSV、网页？ | Day 4、数据工作台指南 | raw/working/output 结构、schema、复核清单 |
| Skills/MCP | 重复流程怎么沉淀？工具权限怎么收窄？ | Day 5、Skills 目录 | Skill 卡片、输入输出、权限等级 |
| 自动化 | 哪些任务适合定时跑？失败怎么办？ | Day 6、自动化方案库 | run card、快照、日志、暂停开关 |
| 多 Agent | 什么时候该并行，什么时候不该？ | Day 7、编排指南 | 角色、交接格式、最终 owner |

## 产品经理视角：先问用户为什么会打开这篇文章

一篇内容如果只回答“怎么操作”，很容易变成命令堆砌。更好的入口是用户动机。

安装类文章的动机通常是降低不确定性。用户需要知道该用 WSL2、本地终端还是云服务器，也需要知道错误发生时先检查环境、模型还是路径。

消息类文章的动机是降低触达成本。用户不是为了扫码而扫码，而是希望在手机、群聊或办公工具里把任务交出去。这个入口越方便，越要强调授权、日志和危险动作审批。

记忆类文章的动机是降低重复沟通。用户希望 Hermes 不要每天问同样背景，但又不希望它保存临时任务、验证码、情绪化评价和过期规则。

自动化类文章的动机是降低重复执行成本。这里最容易犯的错是把没跑稳定的流程直接放进定时任务。正确顺序是手动跑通三次，再交给时间。

多 Agent 类文章的动机是降低复杂任务的总成本。不是 Agent 越多越高级，而是职责越清楚越有价值。

## 内容建设规则

把外部素材放进项目时，先做五步处理：

1. 删掉所有身份信息、订阅引导、识别性图片、打赏、外链和个人服务入口。
2. 抽取用户痛点，不抽取个人叙述。
3. 把命令步骤改成判断流程：为什么做、失败看哪里、成功留下什么。
4. 把口号改成产物：卡片、清单、日志、schema、runbook、交接格式。
5. 给每篇内容补上安全边界：密钥、写权限、外部发送、花钱和部署都要有审批规则。

这样处理后，素材不再是文章拼贴，而是可以支撑网站结构的产品知识库。

## 推荐的站内分发

- Bootcamp 负责用户学习路径：7 天从安装、记忆、入口、数据、Skills、自动化到多 Agent。
- Guides 负责可复用操作手册：部署、消息通道、记忆治理、自动化模板。
- Resources 负责清单和矩阵：最佳 Skills、自动化方案、素材归类、上线检查。
- Blog 负责阶段性观察：从真实素材里提炼用户误区和产品机会。

## 可以直接采用的编辑模板

\`\`\`md
用户问题：
- 用户为什么会打开这篇文章？

适用场景：
- 什么情况适合照做？
- 什么情况不适合？

操作流程：
1. 最小可运行版本
2. 权限和密钥边界
3. 验收测试
4. 失败处理
5. 交付物

安全边界：
- 哪些动作必须审批？
- 哪些信息不能进入长期记忆？
- 哪些输出不能自动发出？

下一步：
- 对应 Bootcamp / Guide / Resource 链接
\`\`\`

## 验收清单

- 每类素材都有明确归属，而不是都堆进 Bootcamp。
- 每篇文章都能回答一个真实用户问题。
- 文章里没有外部署名、账号标识、识别性图片、订阅引导或未经授权的复制段落。
- 所有教程都留下可复查产物，不只留下“运行成功”。
- 高风险动作都有审批或停机线。

## 下一步

- **[消息通道上线 Playbook](/zh/guides/resources/messaging-channel-playbook)** - 把聊天入口做成安全产品。
- **[7 天 Bootcamp](/zh/tutorials/bootcamp/day-1-setup)** - 从最小可运行路径开始学习。
`,
    en: `
## Why a field matrix helps

Real users do not learn Hermes Agent in documentation order. They arrive through a concrete need: running an always-on assistant on a cloud machine, connecting a messaging channel, making the agent remember work preferences, or handing recurring reports and research cleanup to it.

Those needs look scattered, but they follow one product path: make the system run, put it where requests happen, process real material, then turn repeated work into Skills, schedules, and responsible multi-agent handoffs.

This matrix turns raw implementation notes into a rollout plan. It is not a copied article collection and it is not a feature list. It is a judgment tool: where should each source bucket live, which user problem does it solve, and what reviewable artifact should it leave behind?

## The matrix

| Material bucket | Real user question | Best site location | Artifact |
| --- | --- | --- | --- |
| Setup and deployment | Can I make it run first? Local or cloud? | Bootcamp Day 1, deployment guide | startup card, environment checklist, rollback path |
| Model configuration | Why did install succeed but answers fail? Where does the key go? | Day 1, model guide | provider, model, secret location, test prompt |
| Messaging channels | Can I reach it from phone or team chat? | Day 3, messaging playbook | allowed users, default workspace, blocked actions, logs |
| Memory | What should it remember and forget? | Day 2, memory governance guide | memory contract, expiry rules, deletion path |
| Files and data | Can it handle notes, CSV files, and web pages? | Day 4, data bench guide | raw/working/output layout, schema, review checklist |
| Skills and MCP | How do repeated workflows become reusable? | Day 5, Skills directory | skill card, input/output contract, permission level |
| Automation | Which jobs deserve a schedule? What happens on failure? | Day 6, automation recipes | run card, saved snapshot, logs, pause switch |
| Multi-agent | When should work be parallelized? | Day 7, orchestration guide | roles, handoff format, final owner |

## Product lens: ask why the user opened the article

Content that only answers “what command should I run?” tends to become a command pile. A better entry point is user motivation.

Setup content reduces uncertainty. The reader needs to know whether to use WSL2, a normal terminal, or a cloud machine, and whether a failure belongs to environment, model, or path setup.

Messaging content reduces reach cost. Users are not connecting a channel for the thrill of authentication. They want to send real work from phone, team chat, or an office tool. The easier the entry point becomes, the more explicit authorization, logging, and approval must be.

Memory content reduces repeated explanation. Users want Hermes to stop asking the same background questions, but they do not want temporary tasks, verification codes, emotional labels, or stale rules saved forever.

Automation content reduces repeated execution. The common mistake is scheduling a workflow that has not worked manually. The right order is manual success three times, then schedule.

Multi-agent content reduces the total cost of complex work. More agents are not automatically better. Clearer responsibility is better.

## Editorial rules for source material

Use a five-step process before turning outside material into site content:

1. Remove identity markers, follow prompts, QR codes, donation prompts, outbound service links, and personal service offers.
2. Extract user pain, not personal storytelling.
3. Rewrite command steps as a decision flow: why this step, what failure signal to watch, and what artifact proves success.
4. Replace slogans with artifacts: cards, checklists, logs, schemas, runbooks, and handoff formats.
5. Add safety boundaries: secrets, write permissions, external delivery, spending, and deployment all need approval rules.

After that treatment, the material is no longer a patchwork of articles. It becomes a product knowledge base that supports the site architecture.

## Recommended site distribution

- Bootcamp owns the learning path: setup, memory, entry points, data, Skills, automation, and multi-agent work.
- Guides own reusable operating manuals: deployment, messaging, memory governance, automation templates.
- Resources own matrices and checklists: Skills, automation recipes, source classification, launch review.
- Blog owns field observations: user mistakes and product opportunities derived from implementation notes.

## Copy-ready editorial template

\`\`\`md
User question:
- Why would a reader open this article?

Use case:
- When should the reader follow it?
- When should they avoid it?

Workflow:
1. Minimal working version
2. Permissions and secret boundary
3. Acceptance test
4. Failure handling
5. Artifact

Safety boundary:
- Which actions require approval?
- Which facts should not enter long-term memory?
- Which outputs should not be sent automatically?

Next step:
- Link to the matching Bootcamp / Guide / Resource page
\`\`\`

## Acceptance checklist

- Every source bucket has a site destination instead of being dumped into Bootcamp.
- Every article answers one real user problem.
- No external author names, account IDs, QR codes, follow prompts, or copied passages remain.
- Every tutorial leaves a reviewable artifact.
- High-risk actions have approval rules or a stop line.

## Next step

- **[Messaging Channel Playbook](/en/guides/resources/messaging-channel-playbook)** - turn chat access into a safe product surface.
- **[7-Day Bootcamp](/en/tutorials/bootcamp/day-1-setup)** - start from the minimal working path.
`,
  },
  {
    type: 'guides',
    filePath: 'resources/messaging-channel-playbook',
    meta: {
      slug: 'messaging-channel-playbook',
      title: 'Hermes Messaging Channel Launch Playbook',
      titleZh: 'Hermes 消息通道上线 Playbook',
      description: 'A launch checklist for connecting Hermes Agent to chat channels without widening permissions too quickly.',
      descriptionZh: '把 Hermes 接入聊天入口前，用上线清单控制授权、日志、附件、写操作和失败处理。',
      category: 'resources',
      tags: ['messaging', 'gateway', 'feishu', 'wechat', 'operations'],
      difficulty: 'intermediate',
      readingTime: 13,
      featured: true,
    },
    zh: `
## 消息通道不是“扫码成功”这么简单

Hermes 接入聊天工具后，用户感知会立刻变强：手机上能喊它，群聊里能丢上下文，会议结束后能马上让它整理纪要。这也是很多人真正理解 Agent 价值的时刻。

但入口变方便，风险也会变大。终端里的用户通常会谨慎；聊天里的用户更随手。一个消息通道如果没有白名单、默认目录、危险动作审批和日志，很快会从“顺手”变成“不知道谁让它做了什么”。

这份 Playbook 的目标是上线一个低风险、可复查的聊天入口。

## 上线前先做三个决定

### 1. 选一个主入口

不要第一天同时接多个平台。先选真实工作流最常发生的地方。

- 个人移动场景：适合手机消息入口。
- 团队协作场景：适合办公 IM 或团队聊天工具。
- 海外开发团队：Telegram、Discord、Slack 通常更顺。
- 国内办公团队：飞书、企业微信、微信类入口更贴近日常。

判断标准不是“教程里哪个截图多”，而是用户会不会真的在这里发任务。

### 2. 定义默认工作空间

每个消息通道都应该有默认目录或默认项目。否则一句“帮我整理一下”会变得很危险：Hermes 不知道该读哪里，也不知道不该读哪里。

建议第一版只允许访问一个学习目录或测试仓库。等入口稳定后，再逐步扩大范围。

### 3. 把危险动作列出来

下面这些动作默认需要审批：

- 删除、覆盖、移动文件。
- 发送外部消息或群消息。
- 创建工单、提交 PR、推送代码。
- 花钱、调用付费 API、部署服务。
- 保存聊天里的密钥、验证码或账号信息。

## 安全上线流程

1. 更新 Hermes 到当前版本，并查看官方 gateway 文档。
2. 只选择一个通道进行配置。
3. 配置授权用户或配对机制。
4. 设置默认工作目录。
5. 先开启只读能力：总结、搜索、草稿、排队。
6. 发送第一条低风险测试消息。
7. 检查日志和会话归属。
8. 再测试拒绝路径：未知用户、删除文件、外部发送。

## 第一条测试消息

\`\`\`md
请只做只读检查，不要修改文件，也不要向外发送消息。
请告诉我：
1. 你通过哪个通道收到这条消息；
2. 当前默认工作目录是什么；
3. 你现在允许做哪些只读任务；
4. 哪些动作必须先向我确认。
\`\`\`

这条消息能验证四件事：通道是否通、会话是否归属正确、默认目录是否明确、审批边界是否存在。

## 附件规则

聊天入口一旦支持文件，用户会自然上传截图、PDF、CSV、会议纪要和网页片段。第一版不要让 Hermes 直接把附件写进正式项目目录。

建议结构：

\`\`\`text
inbox/
  raw/
  working/
  output/
  logs/
\`\`\`

- \`raw/\` 保存原始附件，只读。
- \`working/\` 放解析和中间结果。
- \`output/\` 放最终摘要、表格或任务清单。
- \`logs/\` 记录来源、处理时间和失败原因。

## 群聊里的边界

群聊场景要更保守。Hermes 不应该默认响应所有人，也不应该在没有明确上下文时替用户发结论。

第一版建议：

- 只响应白名单用户。
- 群聊里只做摘要和草稿，不直接执行写操作。
- 对外发送前必须让发起人确认。
- 对含有隐私或密钥的内容直接拒绝长期保存。
- 结果要标明输入来源和时间范围。

## 上线 Run Card

\`\`\`yaml
channel: "Feishu / WeChat-style / Telegram / Discord / Slack"
owner: "person responsible for this channel"
allowed_users:
  - "primary operator"
default_workspace: "path/to/safe/workspace"
allowed_intents:
  - summarize
  - search approved docs
  - draft reply
  - queue task
approval_required:
  - send external message
  - write outside output folder
  - delete or overwrite files
  - create tickets or PRs
logs:
  - gateway status
  - message source
  - output path
stop_line:
  - unknown user
  - missing default workspace
  - request contains secrets
\`\`\`

## 验收清单

- 未授权用户不能触发 Hermes。
- Hermes 能说明当前通道和默认工作目录。
- 写操作、外部发送、部署和花钱都会要求审批。
- 附件有 raw/working/output/logs 结构。
- gateway 重启后仍能恢复，失败时能看到日志。

## 下一步

- **[Day 3：把 Hermes 放到消息发生的地方](/zh/tutorials/bootcamp/day-3-integration)** - 学习最小消息入口。
- **[自动化方案库](/zh/guides/resources/automation-recipes)** - 通道稳定后再投递定时任务。
`,
    en: `
## A messaging channel is more than a successful login

Once Hermes enters chat, the product becomes easier to feel. Users can reach it from a phone, pass context inside a team thread, and ask for meeting cleanup two minutes after a call ends.

That convenience also widens risk. Terminal users behave cautiously because commands feel operational. Chat users behave casually. A channel without an allowlist, default workspace, approval rules, and logs quickly becomes a surface where nobody knows who asked Hermes to do what.

This playbook launches a low-risk, reviewable chat entry point.

## Make three decisions before launch

### 1. Choose one primary entry point

Do not connect every platform on the first day. Pick the place where real requests already happen.

- Personal mobile work: a phone-first channel is natural.
- Team collaboration: an office IM or team chat works better.
- Global developer teams: Telegram, Discord, and Slack are often smoother.
- China-focused teams: Feishu, WeCom, and WeChat-style channels fit daily habits better.

The decision is not which tutorial has the most screenshots. It is where users will actually send tasks.

### 2. Define the default workspace

Every channel needs a default directory or project. Otherwise “please organize this” becomes dangerous: Hermes does not know where to read from or what to avoid.

For version one, allow only a learning folder or a test repository. Expand after the channel proves stable.

### 3. List risky actions

These actions should require approval by default:

- delete, overwrite, or move files;
- send external or group messages;
- create tickets, submit PRs, or push code;
- spend money, call paid APIs, or deploy services;
- save secrets, verification codes, or account details from chat.

## Safe launch flow

1. Update Hermes and read the current gateway documentation.
2. Configure one channel only.
3. Set allowed users or pairing.
4. Set the default workspace.
5. Start read-only: summarize, search, draft, and queue.
6. Send the first low-risk test message.
7. Check logs and session ownership.
8. Test refusal paths: unknown user, file deletion, external send.

## First test message

\`\`\`md
Do only a read-only check. Do not modify files or send external messages.
Tell me:
1. which channel received this message;
2. what the default workspace is;
3. which read-only tasks you can do now;
4. which actions require my confirmation.
\`\`\`

This validates the channel, session ownership, default workspace, and approval boundary.

## Attachment rules

Once chat supports files, users will upload screenshots, PDFs, CSVs, meeting notes, and web snippets. Version one should not let Hermes write attachments directly into the real project directory.

Recommended structure:

\`\`\`text
inbox/
  raw/
  working/
  output/
  logs/
\`\`\`

- \`raw/\` stores original attachments and stays read-only.
- \`working/\` stores parsing and intermediate results.
- \`output/\` stores final summaries, tables, or task lists.
- \`logs/\` records source, processing time, and failure reason.

## Group chat boundaries

Group chat should be conservative. Hermes should not respond to everyone by default and should not publish conclusions without clear context.

Recommended first version:

- respond only to allowlisted users;
- summarize and draft in groups, but do not perform write actions;
- require sender approval before external delivery;
- reject long-term memory for secrets or private data;
- label outputs with input source and time range.

## Launch run card

\`\`\`yaml
channel: "Feishu / WeChat-style / Telegram / Discord / Slack"
owner: "person responsible for this channel"
allowed_users:
  - "primary operator"
default_workspace: "path/to/safe/workspace"
allowed_intents:
  - summarize
  - search approved docs
  - draft reply
  - queue task
approval_required:
  - send external message
  - write outside output folder
  - delete or overwrite files
  - create tickets or PRs
logs:
  - gateway status
  - message source
  - output path
stop_line:
  - unknown user
  - missing default workspace
  - request contains secrets
\`\`\`

## Acceptance checklist

- Unauthorized users cannot trigger Hermes.
- Hermes can state the current channel and default workspace.
- Write actions, external delivery, deployment, and spending require approval.
- Attachments use raw/working/output/logs.
- The gateway recovers after restart and failures leave logs.

## Next step

- **[Day 3: Put Hermes where requests happen](/en/tutorials/bootcamp/day-3-integration)** - learn the minimal channel pattern.
- **[Automation Recipes](/en/guides/resources/automation-recipes)** - deliver scheduled work only after the channel is stable.
`,
  },
  {
    type: 'blog',
    filePath: 'field-notes/hermes-agent-adoption-lessons',
    meta: {
      slug: 'hermes-agent-adoption-lessons',
      title: 'What Field Notes Reveal About Hermes Agent Adoption',
      titleZh: '从中文实战笔记看 Hermes Agent 的真实采用路径',
      description: 'A product reflection on what deployment notes, messaging walkthroughs, memory explanations, and automation examples reveal about real Hermes Agent adoption.',
      descriptionZh: '从部署、消息入口、记忆、自动化和多 Agent 笔记里提炼真实用户采用 Hermes Agent 的路径。',
      category: 'field-notes',
      tags: ['field-notes', 'adoption', 'product', 'messaging', 'automation'],
      difficulty: 'beginner',
      readingTime: 11,
      featured: true,
    },
    zh: `
## 用户不是从“Agent 概念”开始的

观察一批中文 Hermes Agent 实战笔记后，最明显的结论是：真实用户很少从抽象概念进入。他们不是先问“什么是自主智能体”，而是先问更朴素的问题：

- 这个东西能不能 10 分钟跑起来？
- Windows 到底是不是要用 WSL2？
- API Key 填在哪里？
- 能不能接到飞书、微信类入口或手机消息里？
- 它会不会记住我？记住以后能不能删？
- 日报、网页监控、资料整理能不能定时跑？

这说明 HermesAgent 101 的内容不能只写“功能是什么”。它必须写“用户第一次想把它放进工作流时会在哪里卡住”。

## 第一性原理：采用路径就是降低四种成本

### 1. 启动成本

安装教程最受欢迎，不是因为安装本身有趣，而是因为它决定用户能不能获得第一口价值。启动成本越高，后面的记忆、Skills、自动化都没有机会发生。

所以 Day 1 的内容要克制。不要一上来讲全生态，而是帮用户确认环境、模型、启动命令和权限边界。

### 2. 触达成本

消息通道文章之所以多，是因为终端不是大多数用户的日常入口。用户真正的任务发生在手机、群聊、办公 IM、会议结束后的碎片时间里。

触达成本降下来以后，审批和日志必须跟上。一个能被随手喊起的 Agent，如果没有授权和停机线，会很快失去信任。

### 3. 重复沟通成本

记忆系统的吸引力来自一句很简单的话：不要让我每天重复交代背景。这个需求很真，但边界更重要。记忆应该保存稳定偏好和长期规则，不该保存一次性验证码、临时情绪和未验证猜测。

好的记忆内容不是更多，而是更可解释、更可删除、更能减少下一次沟通。

### 4. 重复执行成本

日报、网站监控、备份、反馈聚类、内容草稿这些场景，都指向同一件事：用户想把重复劳动交给系统。但自动化不是把 prompt 丢进定时器，而是先证明流程稳定，再交给时间。

## 这些素材应该怎么进入网站

Bootcamp 适合承接“第一次完整走通”的路径。每一天只解决一个关键摩擦点，不追求大全。

Guides 适合承接“我已经知道要做什么，请给我操作手册”的需求，比如消息通道上线、部署排障、记忆治理、自动化运行卡。

Resources 适合承接“我想快速做选择”的需求，比如素材矩阵、Skills 清单、自动化方案库。

Blog 适合承接“我们从用户反馈里学到了什么”的观察，比如为什么用户先问微信/飞书，而不是先问多 Agent。

## 不能做什么

素材进入项目时，最危险的做法是“抹掉署名和识别性图片后直接搬运”。这既不尊重原创劳动，也会让站点内容风格混乱。

正确做法是只取结构和洞察，不取表达和身份信息：

- 把个人故事改成用户场景。
- 把推广话术改成验收清单。
- 把截图步骤改成判断流程。
- 把口号改成可交付产物。
- 把“很厉害”改成“什么场景值得用、什么场景不该用”。

## 对 HermesAgent 101 的内容结论

这个站点应该更像一本产品化运行手册，而不是新闻聚合站。用户读完后应该知道：

1. 先跑起来，别急着全量配置。
2. 先收窄权限，再接入消息入口。
3. 先定义记忆契约，再相信长期记忆。
4. 先手动跑三次，再定时自动化。
5. 先按职责拆分，再谈多 Agent。

这条路径比“功能大全”慢一点，但更容易建立信任。对 Agent 产品来说，信任不是由宣传语建立的，而是由一次次可复查的小交付建立的。

## 下一步

- **[实战素材归类矩阵](/zh/guides/resources/field-implementation-matrix)** - 查看这批素材如何进入站点结构。
- **[消息通道上线 Playbook](/zh/guides/resources/messaging-channel-playbook)** - 把最常见的聊天入口需求产品化。
`,
    en: `
## Users do not start from the abstract agent concept

After reviewing a batch of Chinese Hermes Agent implementation notes, the clearest pattern is that real users rarely enter through theory. They do not begin with “what is an autonomous agent?” They ask simpler questions:

- Can I make it run in ten minutes?
- Should Windows users use WSL2?
- Where does the API key go?
- Can it connect to Feishu, WeChat-style entry points, or phone messages?
- Will it remember me, and can I delete that memory?
- Can daily reports, website checks, and research cleanup run on a schedule?

That means HermesAgent 101 should not only explain features. It should explain where users get stuck when they first try to put Hermes into a workflow.

## First principles: adoption reduces four costs

### 1. Startup cost

Install guides are popular not because installation is interesting, but because startup determines whether users reach first value. If startup cost is too high, memory, Skills, and automation never get a chance.

That is why Day 1 should stay disciplined. Do not tour the whole ecosystem. Help the user confirm environment, model, launch command, and permission boundary.

### 2. Reach cost

Messaging-channel articles appear often because the terminal is not where most users live. Real tasks happen on phone, in group chat, inside office IM, and in the short window after a meeting ends.

Once reach cost drops, approval and logging must improve. An agent that can be summoned casually will lose trust quickly if authorization and stop lines are unclear.

### 3. Repeated explanation cost

Memory is attractive because users want to stop repeating background every morning. That need is real, but boundaries matter more. Memory should save stable preferences and long-term rules, not one-time codes, temporary emotion, or unchecked guesses.

Good memory is not larger. It is more explainable, more deletable, and better at reducing the next conversation.

### 4. Repeated execution cost

Daily reports, website monitoring, backups, feedback clustering, and content drafts all point to the same user wish: hand repeated work to the system. But automation is not a prompt taped to a timer. Prove the workflow manually, then give it a schedule.

## Where this material belongs on the site

Bootcamp should own the first complete path. Each day removes one key source of friction instead of trying to be complete.

Guides should own operating manuals for users who already know what they want: messaging launch, deployment troubleshooting, memory governance, and automation run cards.

Resources should own fast decision assets: matrices, Skills lists, and automation recipe libraries.

Blog should own field observations: what user behavior reveals, such as why people ask about Feishu or WeChat-style entry points before they ask about multi-agent architecture.

## What not to do

The worst way to use outside material is to remove names and QR codes, then republish it. That disrespects original authors and produces inconsistent site content.

The right approach is to keep structure and insight, not wording or identity:

- turn personal stories into user scenarios;
- turn promotional copy into acceptance checklists;
- turn screenshot steps into decision flows;
- turn slogans into artifacts;
- replace “this is powerful” with “when should this be used, and when should it be avoided?”

## Content conclusion for HermesAgent 101

This site should feel like a productized operating manual, not a news aggregator. After reading, users should know:

1. Make it run before configuring everything.
2. Narrow permissions before connecting messaging.
3. Define the memory contract before trusting long-term memory.
4. Run manually three times before scheduling.
5. Split by responsibility before talking about multi-agent work.

This path is slower than a feature dump, but it builds trust. For agent products, trust does not come from slogans. It comes from small, reviewable deliveries that keep working.

## Next step

- **[Field Implementation Matrix](/en/guides/resources/field-implementation-matrix)** - see how source material maps into the site.
- **[Messaging Channel Launch Playbook](/en/guides/resources/messaging-channel-playbook)** - productize the most common chat-entry request.
`,
  },
];

for (const article of articles) {
  writeArticle(article);
}

console.log(`Generated ${articles.length * 2} field-derived content files.`);
