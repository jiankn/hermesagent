import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const today = '2026-04-18';
const author = 'HermesAgent Community';

const lensData = {
  'day-1-setup': {
    zh: {
      user: '第 1 天的真实用户，不是想证明自己会装工具，而是想知道这个 Agent 是否值得继续投入一周。最好的起点是一次可复现的小胜利：能启动、能回答、能解释边界，出了问题也知道从哪里回退。',
      failure: '如果用户一边装依赖、一边换模型、一边开消息通道，任何一步失败都会混在一起，最后只剩一句“这个东西不稳定”。',
      move: '把安装拆成四个可验证节点：环境、模型、启动、边界。每个节点都要有一条证据，比如版本输出、模型名称、启动命令、权限说明。',
      review: '这一天的评审重点不是结果多酷，而是另一个人能不能复现同样的启动路径。',
      artifact: '带走一份启动卡片：运行环境、模型端点、启动命令、允许读取的目录、绝不自动执行的动作。'
    },
    en: {
      user: 'The real Day 1 user is not trying to prove that they can install another tool. They are deciding whether this agent deserves a week of attention. The best start is one repeatable small win: Hermes launches, answers from the right environment, and explains what it is allowed to touch.',
      failure: 'If the user installs dependencies, switches models, enables messaging, and edits permissions in the same sitting, every failure looks like one blurry failure called “Hermes is unstable.”',
      move: 'Split setup into four checkpoints: environment, model, startup, and boundary. Each checkpoint needs evidence, such as a version output, model name, launch command, or permission note.',
      review: 'The review question is not whether the demo was exciting. It is whether another person can repeat the same start path tomorrow.',
      artifact: 'Leave with a startup card: runtime environment, model endpoint, launch command, readable folders, and actions Hermes must never perform without approval.'
    }
  },
  'day-2-memory': {
    zh: {
      user: '第 2 天的用户开始期待 Hermes 像同事一样理解自己，但这里最容易翻车。记忆不是越多越好，而是越可用越好。一个助理如果记住了所有情绪和碎片，却忘了审批边界，体验会从贴心变成危险。',
      failure: '糟糕的记忆通常有三个信号：无法解释来源、无法删除、无法区分临时任务和长期偏好。',
      move: '把记忆写成产品规则：什么可以记，谁确认后才记，多久复查一次，哪些内容永远不进长期记忆。',
      review: '这一天要测试的是恢复能力。重开会话后，Hermes 应该能记住工作方式，而不是背诵一堆旧聊天。',
      artifact: '带走一份记忆契约：稳定偏好、项目事实、隐私禁区、过期规则和删除方式。'
    },
    en: {
      user: 'On Day 2, users start wanting Hermes to understand them like a coworker. This is also where memory can go wrong. More memory is not automatically better. Useful memory is reviewed, durable, and connected to future decisions.',
      failure: 'Bad memory has three early signals: Hermes cannot explain where a fact came from, the user cannot remove it, and temporary task context gets treated like a permanent preference.',
      move: 'Turn memory into product rules: what may be saved, what requires confirmation, how often it is reviewed, and what never belongs in long-term memory.',
      review: 'The test is recovery. After a restart, Hermes should remember how to work with the user, not recite a pile of stale chat fragments.',
      artifact: 'Leave with a memory contract: stable preferences, project facts, privacy exclusions, expiry rules, and the deletion path.'
    }
  },
  'day-3-integration': {
    zh: {
      user: '第 3 天开始，用户会问一个很实际的问题：我能不能在手机上喊它？这不是懒，而是工作场景变了。很多任务不是坐在电脑前发生的，而是在路上、群聊里、会议结束后的两分钟里发生的。',
      failure: '消息入口最常见的失败，不是连不上，而是连上后谁都能喊、什么都能做、结果还不知道发给了谁。',
      move: '先把通道当成入口产品，而不是技术炫技。入口要有白名单、会话归属、默认目录、危险动作审批和清晰的失败反馈。',
      review: '这一天要验证的是从真实消息到可复查产物的闭环，而不是扫码成功。',
      artifact: '带走一份通道运行单：平台、授权用户、默认目录、允许附件、禁止动作、日志位置和人工接管方式。'
    },
    en: {
      user: 'On Day 3, the practical question appears: can I reach Hermes from my phone? That is not laziness. Work often happens away from the terminal: on the road, inside a team chat, or two minutes after a meeting ends.',
      failure: 'The most common messaging failure is not connection failure. It is connecting too broadly: anyone can trigger it, every action is available, and nobody knows where the result was sent.',
      move: 'Treat the channel as an entry product, not as a technical badge. It needs an allowlist, session ownership, a default workspace, approval for risky actions, and failure messages a normal user can understand.',
      review: 'The test is the full loop from real message to reviewable artifact, not whether a QR code or token handshake succeeded once.',
      artifact: 'Leave with a channel run sheet: platform, allowed users, default directory, attachment rules, blocked actions, log location, and manual takeover path.'
    }
  },
  'day-4-data': {
    zh: {
      user: '第 4 天的用户通常已经不满足于聊天了。他们会丢给 Hermes 文件、网页、表格和半成品笔记，希望它产出能用的东西。这里的关键不是让答案好看，而是让输入、判断和输出都能被复查。',
      failure: '最危险的信号是 Hermes 给出一段顺滑总结，但你找不到它依据哪一行、忽略了哪些异常、哪些判断其实没有把握。',
      move: '把数据任务设计成流水线：原始材料只读，处理中间产物可丢弃，最终输出必须带字段、来源和置信度。',
      review: '这一天要训练的是可审计性。一个慢一点但能追溯的输出，比一个漂亮但不可验证的总结更接近产品。',
      artifact: '带走一份数据工作台规范：文件夹结构、命名规则、输出 schema、低置信度标记和人工复核清单。'
    },
    en: {
      user: 'By Day 4, users usually want more than conversation. They hand Hermes files, web pages, tables, and rough notes, then expect something usable in return. The key is not a prettier answer. The key is whether the input, judgment, and output can be reviewed.',
      failure: 'The dangerous signal is a smooth summary with no trail: no line reference, no anomaly list, and no marker showing which conclusions are uncertain.',
      move: 'Design the data task as a pipeline: raw material stays read-only, intermediate files may be discarded, and final output must carry fields, sources, and confidence.',
      review: 'The skill being trained is auditability. A slower output with traceable evidence is more product-ready than a polished summary nobody can verify.',
      artifact: 'Leave with a data bench spec: folder structure, naming rules, output schema, low-confidence markers, and a human review checklist.'
    }
  },
  'day-5-skills': {
    zh: {
      user: '第 5 天会出现一个转折：用户不想再每次从头解释同一件事。真正的进阶不是写更长 prompt，而是把重复流程变成可调用、可改进、可下线的技能。',
      failure: '糟糕的 Skill 通常像一篇励志文章：听起来有道理，但没有输入要求、没有失败处理、没有输出样例，也不知道什么时候不该用。',
      move: '把 Skill 当成小型操作手册。它应该写清楚触发条件、需要的材料、不能碰的边界、输出格式和验收标准。',
      review: '这一天要检查的不是 Skill 数量，而是一个新会话能否根据 Skill 复现同样质量。',
      artifact: '带走一份 Skill 候选卡：触发场景、输入清单、步骤、输出样例、权限等级和退役条件。'
    },
    en: {
      user: 'Day 5 is the turning point where users stop wanting to explain the same process from scratch. The upgrade is not a longer prompt. The upgrade is turning repeat work into a callable, improvable, and removable skill.',
      failure: 'A weak skill reads like motivational prose: it sounds right, but it has no input requirements, no failure handling, no output example, and no rule for when it should not run.',
      move: 'Treat a skill as a small operating manual. It should define trigger conditions, required materials, boundaries, output format, and acceptance criteria.',
      review: 'The review is not how many skills exist. It is whether a fresh session can use the skill and reproduce the same quality of work.',
      artifact: 'Leave with a skill candidate card: trigger scenario, input checklist, steps, output sample, permission level, and retirement condition.'
    }
  },
  'day-6-automation': {
    zh: {
      user: '第 6 天的用户会想让 Hermes 自己跑起来。这个愿望很正常，但自动化的本质不是省掉点击，而是把一个已经稳定的流程交给时间。没有稳定流程，定时只会把错误准时放大。',
      failure: '失败信号很清楚：输入每天都不一样、输出没人看、失败不报警、重复执行会造成副作用、对外发送没有审批。',
      move: '先设计人工可运行版本，再设计定时版本。触发器只负责启动，不能替你定义输入质量、权限边界和失败处理。',
      review: '这一天要验证的是三次连续运行的稳定性：同样输入得到可解释输出，失败能停住，重复运行不会污染数据。',
      artifact: '带走一份自动化运行卡：触发时间、输入来源、保存快照、输出位置、通知对象、失败策略和暂停开关。'
    },
    en: {
      user: 'On Day 6, users want Hermes to run by itself. That desire is reasonable, but automation is not mainly about saving clicks. It is about handing a proven workflow to time. Without a stable manual workflow, scheduling only makes mistakes arrive on time.',
      failure: 'The warning signs are clear: inputs change shape every day, nobody reads the output, failures are silent, repeated runs create side effects, or external delivery happens without approval.',
      move: 'Design the manual version first, then the scheduled version. A trigger starts the job, but it does not define input quality, permission boundaries, or failure handling for you.',
      review: 'The test is three consecutive runs: the same input produces explainable output, failures stop cleanly, and retries do not pollute data.',
      artifact: 'Leave with an automation run card: trigger time, input source, saved snapshot, output location, notification target, failure policy, and pause switch.'
    }
  },
  'day-7-multi-agent': {
    zh: {
      user: '第 7 天很容易被“多 Agent”这个词带偏。用户真正需要的不是一群助手同时说话，而是把复杂工作拆给不同职责的人，再由一个负责人合并判断。',
      failure: '失败信号是大家都在做分析、没人拥有结论；每个 Agent 都能改东西、没人知道冲突怎么解决；输出看起来很多，但没有一个可交付结果。',
      move: '先按职责拆分，而不是按模型数量拆分。一个 Agent 负责搜集，一个负责执行，一个负责质检，一个负责人做取舍和最终表达。',
      review: '这一天的核心是交接质量。每个子任务都要有输入、边界、产物和退出条件，否则并行只会制造更多上下文。',
      artifact: '带走一份编排蓝图：角色、输入、禁止动作、交付物、汇总顺序和人工决策点。'
    },
    en: {
      user: 'Day 7 is easy to distort because “multi-agent” sounds exciting. The user does not need a room full of assistants talking at once. They need complex work split across responsibilities, then merged by one owner who can make tradeoffs.',
      failure: 'The failure signals are familiar: everyone analyzes and nobody owns the conclusion, every agent can modify things and no one resolves conflicts, or the system produces many messages but no deliverable.',
      move: 'Split by responsibility before splitting by model count. One agent gathers, one executes, one reviews, and one lead chooses what to ship.',
      review: 'The core test is handoff quality. Every delegated task needs inputs, boundaries, artifacts, and an exit condition. Otherwise parallelism only creates more context to manage.',
      artifact: 'Leave with an orchestration blueprint: roles, inputs, blocked actions, deliverables, merge order, and human decision points.'
    }
  }
};

function productLens(locale, slug) {
  const lens = lensData[slug]?.[locale];
  if (!lens) {
    return '';
  }

  if (locale === 'zh') {
    return `
## 站在用户那边再做一遍

${lens.user}

很多教程会把这一步写成“照着命令跑完”。但用户真正需要的不是命令清单，而是一个能复用的判断过程。你要能说清楚为什么现在做这一步，失败时看哪个信号，成功后留下什么证据。${lens.failure}

### 现场判断

- 用户是否能不看聊天记录独立复现这一步？
- 输出是否有文件、日志、截图或配置片段可检查？
- 失败时是否知道先停在哪里，而不是继续叠更多配置？
- 是否把敏感信息、写权限和对外发送分开处理？
- 明天换一个人接手时，是否能沿着同一份产物继续做？

### 产品经理视角

${lens.move}

从产品角度看，Bootcamp 每一天都不应该只是“学一个功能”。它应该让用户把一个真实摩擦点降级：从不知道怎么开始，变成知道下一步怎么判断；从依赖灵感，变成依赖流程；从一次性成功，变成可以让别人复查。${lens.review}

真正有价值的训练营内容，应该能让用户在失败时也赚到东西。即使当天没有跑通，用户也应该更清楚自己卡在环境、权限、输入、模型、工具还是协作边界上。这样第二次尝试就不是重复碰运气，而是在缩小问题范围。

### 明天带走什么

${lens.artifact}

不要把这份产物写得像汇报材料。它应该像交接班纸条：短、具体、能执行。明天打开它，你应该立刻知道输入在哪里、权限到哪里、结果放哪里、哪些事情还不能自动化。

再补一条停机线：当 Hermes 的建议开始依赖你没给过的事实、要求更大权限、或者准备把结果发到外部系统时，先停下来复查输入和边界。训练营不是为了让用户少思考，而是把思考放在更关键的位置。
`;
  }

  return `
## Run It Again From The User Side

${lens.user}

Many tutorials frame this step as “follow these commands.” Real users need more than commands. They need a repeatable judgment process: why this step matters, what signal to watch when it fails, and what evidence proves it worked. ${lens.failure}

### Field Checks

- Can a user repeat this step without rereading the chat transcript?
- Is there a file, log, screenshot, config fragment, or artifact to inspect?
- When the step fails, does the user know where to stop instead of adding more configuration?
- Are sensitive data, write permissions, and external delivery handled separately?
- Could another person continue tomorrow from the artifact you leave today?

### Product Manager Lens

${lens.move}

From a product perspective, each bootcamp day should reduce a real source of friction. The user should move from guessing to judging, from inspiration to process, and from one-off success to reviewable operation. ${lens.review}

Good training material should still be useful when the user fails. Even if the workflow does not fully run, the user should know whether they are stuck on environment, permissions, inputs, model behavior, tool access, or collaboration boundaries. That turns the second attempt into a narrower investigation instead of another round of luck.

### What Carries Into Tomorrow

${lens.artifact}

Do not make this artifact feel like a status report. It should feel like a shift handoff: short, specific, and executable. Tomorrow, it should show where the input lives, how far the permissions go, where the result belongs, and which actions are still too risky to automate.
`;
}

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
    `category: "bootcamp"`,
    `tags: [${meta.tags.map((tag) => JSON.stringify(tag)).join(', ')}]`,
    `difficulty: ${JSON.stringify(meta.difficulty)}`,
    `readingTime: ${meta.readingTime}`,
    `series: "7-day-bootcamp"`,
    `seriesOrder: ${meta.order}`,
    `featured: ${meta.order === 1 ? 'true' : 'false'}`,
    '---',
    '',
  ].join('\n');
}

function writeArticle(article) {
  for (const locale of ['en', 'zh']) {
    const filePath = path.join(root, 'content', 'tutorials', locale, 'bootcamp', `${article.meta.slug}.mdx`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const body = [article[locale].trim(), productLens(locale, article.meta.slug).trim()]
      .filter(Boolean)
      .join('\n\n');
    fs.writeFileSync(filePath, `${frontmatter(article.meta)}${body}\n`, 'utf8');
  }
}

const articles = [
  {
    meta: {
      order: 1,
      slug: 'day-1-setup',
      title: 'Day 1: Make Hermes Run Before You Make It Clever',
      titleZh: 'Day 1：先跑起来，再谈聪明',
      description: 'A practical first-day setup guide: choose local or cloud, configure a model, run doctor, and keep secrets out of the chat.',
      descriptionZh: '从用户真实启动成本出发，完成本地或云端安装、模型配置、doctor 检查和第一条安全对话。',
      tags: ['setup', 'privacy', 'model', 'doctor', 'beginner'],
      difficulty: 'beginner',
      readingTime: 13,
    },
    zh: `
## 今天先别追求“全功能”

很多教程一上来就讲云服务器、微信通道、飞书机器人、Skills、自动化任务。看起来热闹，用户却很容易卡在第一个小时：命令敲完了没有反应、模型 Key 不知道填哪里、Windows 终端和 WSL2 混着用、配置文件在哪也找不到。

所以 Day 1 只做一件事：让 Hermes Agent 在你能理解的环境里稳定跑起来。不是“安装成功”四个字，而是你能回答三个问题：它跑在哪里？它调用哪个模型？它现在能碰哪些文件和密钥？

![Hermes Agent 第 1 天本地安装路径示意图](/images/bootcamp/day-1-setup.svg)

## 先做产品判断：本地还是云端

从产品经理角度看，安装方式不是技术偏好，而是使用场景选择。

如果你只是想试试看，或者担心隐私，先本地跑。Mac 和 Linux 直接用终端，Windows 用户优先走 WSL2。Windows 原生环境很容易被路径、权限、Python 版本这些细节拖住，不值得在第一天硬刚。

如果你希望它 24 小时在线，能从手机消息里随时喊它，那就考虑云端。“10 分钟云端部署”之所以容易吸引新用户，原因很现实：云端的长期在线价值比本地炫技更容易被感知。但云端也意味着你要认真处理密钥、端口、用户权限和日志。

今天的建议很克制：能本地跑通就先本地；有明确移动端需求，再上云。

## 照着这个顺序做

1. 确认系统环境。Windows 用 WSL2，Mac/Linux 用终端。先检查 \`git\`、Python、Node 或官方安装脚本要求的基础依赖。
2. 安装 Hermes。优先使用官方一键安装脚本；如果网络不稳定，再考虑克隆仓库或换网络环境。
3. 重新加载 shell。很多“command not found”不是安装失败，而是环境变量还没生效。
4. 运行 \`hermes doctor\`。不要跳过健康检查，它比你盲目搜索报错快得多。
5. 运行 \`hermes setup\`。先配置模型，再决定是否配置消息通道。通道可以跳过，后面单独做。
6. 用 \`hermes model\` 确认当前模型。模型是 Hermes 的“大脑”，Hermes 本身不是免费模型服务。
7. 发第一条低风险消息：让 Hermes 说明当前运行环境、模型提供商、它能做什么、暂时不该做什么。

## 第一条对话怎么写

不要问“你是谁”。那只会得到一段漂亮介绍。更好的第一条是：

\`\`\`md
请先不要修改任何文件。请检查你当前能看到的运行环境，
告诉我：1. Hermes 是否正常启动；2. 当前模型配置是否存在；
3. 你建议我接下来配置哪些最小权限；4. 哪些事情必须先问我。
\`\`\`

这条消息的价值在于，它把 Hermes 从“聊天机器人”拉回“可审计的工作入口”。第一天你要建立的不是信任感，而是边界感。

## 密钥和隐私，今天就要定规矩

本地运行不等于绝对隐私。只要你用了远程模型 API，提示词就会发给模型服务商。云端部署也不等于不安全，前提是你知道哪些数据会离开机器。

今天把这三条写进你的 setup note：

- API Key 只放在环境变量或 Hermes 配置文件里，不贴进聊天。
- 私密文件默认不让 Hermes 读，除非你明确指定路径。
- 删除文件、发消息、花钱、部署服务，都必须二次确认。

## 常见卡点

- Windows 用户直接在 PowerShell 里折腾，最后卡在 Linux 依赖。解决：先装 WSL2。
- 安装完成后找不到 \`hermes\`。解决：重新加载 shell，或打开新终端。
- 看到模型列表就乱选。解决：先用你已经有 Key 的模型，别在第一天比较模型智商。
- 把微信、飞书、自动化一起配置。解决：第一天只验证 CLI 可用。

## 今天交付什么

留下一个 \`hermes-day-1.md\`：

\`\`\`yaml
where_it_runs: "local WSL2 / Mac / cloud VM"
model_provider: "your chosen provider"
start_command: "hermes"
health_check: "hermes doctor passed / needs action"
secrets_location: "~/.hermes/.env or provider console"
first_boundary:
  - no file deletion without approval
  - no external messages without approval
  - no secret pasted into chat
\`\`\`

明天讲记忆。记忆不是“让它记住一切”，而是让它别反复问你同样的问题。

## 下一步

- **[Day 2：把记忆当成产品功能](/zh/tutorials/bootcamp/day-2-memory)** - 让 Hermes 只记真正有用的长期信息。
- **[隐私政策](/zh/privacy)** - 了解本站如何处理 Cookie 和分析数据。
`,
    en: `
## Do not start with every feature

Most Hermes tutorials rush toward the exciting parts: cloud deployment, WeChat or Feishu, Skills, automation, and multi-agent workflows. That is exactly how beginners lose the first hour. The shell says command not found. The model key goes into the wrong file. Windows users mix PowerShell and WSL2. The bot starts once but nobody knows how to start it again tomorrow.

Day 1 has one job: make Hermes run in an environment you understand. Not “installed successfully” in a vague way, but three concrete answers: where is it running, which model endpoint is it using, and what is it allowed to touch?

![Diagram of the Day 1 local setup path for Hermes Agent](/images/bootcamp/day-1-setup.svg)

## Local or cloud is a product decision

From a product manager’s point of view, installation is not a technical preference. It is a usage decision.

If you are evaluating Hermes or you care most about privacy, start locally. macOS and Linux can use the terminal directly. Windows users should use WSL2 instead of fighting native path and dependency issues. The goal is to reduce startup friction, not prove that every environment can be forced to work.

If you want a 24-hour assistant reachable from your phone, cloud deployment makes sense. That is why so many Chinese walkthroughs lead with “ten-minute cloud setup”: always-on access is the first value ordinary users can feel. But cloud also means you must care about secrets, ports, user permissions, and logs.

The conservative choice is simple: prove the CLI locally first; move to cloud when you have a clear mobile or unattended-workflow reason.

## The setup order that avoids most pain

1. Check the base environment. On Windows, prepare WSL2. On macOS or Linux, use the normal terminal.
2. Install Hermes with the official installer first. Use manual clone only if network or package setup fails.
3. Reload the shell. A surprising number of “install failures” are just stale shell paths.
4. Run \`hermes doctor\`. Do this before searching random errors.
5. Run \`hermes setup\`. Configure the model first. Skip messaging channels if you are not ready.
6. Run \`hermes model\` to confirm the active provider and model.
7. Start a first low-risk conversation and ask Hermes to explain its boundaries.

## Your first prompt should not be “who are you?”

Ask for an operational check instead:

\`\`\`md
Do not modify files yet. Inspect only the current runtime context.
Tell me: 1. whether Hermes is running correctly; 2. whether a model provider appears configured;
3. the minimum permissions you recommend next; 4. which actions must require my approval.
\`\`\`

This turns Hermes from a chatbot into a reviewable work entry point. On day one you are not trying to feel amazed. You are trying to see the boundary.

## Secrets and privacy start today

Local execution does not automatically mean private. If you use a hosted model API, prompts leave your machine. Cloud deployment is not automatically unsafe either, if you know exactly which data leaves the box.

Write these rules into your setup note:

- API keys live in environment variables or Hermes config, never inside chat.
- Private folders are off-limits unless explicitly selected.
- File deletion, external messages, spending money, and deployments require confirmation.

## Where people usually get stuck

- Windows users stay in PowerShell and hit Linux dependency problems. Use WSL2.
- \`hermes\` is not found after install. Reload the shell or open a fresh terminal.
- Users compare model intelligence before confirming the shell works. Pick one model you already have access to.
- Messaging, cloud, and automation are configured together. Resist that. First prove the CLI.

## Ship this artifact

Create \`hermes-day-1.md\`:

\`\`\`yaml
where_it_runs: "local WSL2 / Mac / cloud VM"
model_provider: "your chosen provider"
start_command: "hermes"
health_check: "hermes doctor passed / needs action"
secrets_location: "~/.hermes/.env or provider console"
first_boundary:
  - no file deletion without approval
  - no external messages without approval
  - no secret pasted into chat
\`\`\`

Tomorrow is memory. The goal is not to make Hermes remember everything; it is to stop repeating the same background every morning.

## Next step

- **[Day 2: Treat memory like a product feature](/en/tutorials/bootcamp/day-2-memory)** - save only the facts that reduce future work.
- **[Privacy Policy](/en/privacy)** - review how this site handles cookies and analytics.
`,
  },
  {
    meta: {
      order: 2,
      slug: 'day-2-memory',
      title: 'Day 2: Treat Memory Like a Product Feature',
      titleZh: 'Day 2：把记忆当成产品功能',
      description: 'Design Hermes memory as a reviewed contract: stable preferences, project rules, session search, and cleanup.',
      descriptionZh: '把 Hermes 记忆设计成可复查的契约：长期偏好、项目规则、会话搜索和定期清理。',
      tags: ['memory', 'context', 'session-search', 'profile', 'beginner'],
      difficulty: 'beginner',
      readingTime: 12,
    },
    zh: `
## 记忆不是越多越好

很多人第一次听到 Hermes，会被“越用越懂你”打动。这个卖点是真的有吸引力，但也最容易被误解。用户听到“记忆”，第一反应是让它把所有聊天都存下来；产品经理看到这里应该立刻紧张，因为无边界的记忆会变成噪音、隐私风险和错误决策来源。

今天的目标不是让 Hermes 记住一切，而是让它记住那些“下次能少问你一次”的东西。

![Hermes Agent 第 2 天记忆规则和重启测试示意图](/images/bootcamp/day-2-memory.svg)

## 什么值得进入长期记忆

长期记忆只放稳定事实。

比如：

- 你常用中文输出，除非明确要求英文。
- 你的项目默认不允许未经确认删除文件。
- 某个仓库使用 tabs 缩进，行宽 120。
- 服务器是 Debian，Docker 命令不需要 sudo。
- 周报固定要包含进展、风险、下周计划。

这些信息会反复出现，保存后能减少沟通成本。

不该进入长期记忆的东西也要明确：

- 今天临时要修的 bug。
- 一次性账号、临时链接、验证码。
- 还没验证的猜测。
- 情绪化评价，比如“这个方案很烂”。
- 已经结束的会议细节。

这些应该留在会话、日志或任务记录里，不要变成长期偏见。

## 记忆和 Session Search 分工

很多入门用户会把“记忆”和“历史搜索”混在一起。一个好理解的分法是：

长期记忆是员工手册。它告诉 Hermes 你是谁、偏好是什么、哪些事不能做。

Session Search 是档案室。它帮 Hermes 回忆过去聊过什么，但不应该把每段聊天都当成永久规则。

所以今天你要做的是两层设计：

1. 把稳定偏好写进记忆。
2. 把项目过程留在会话和文档里，必要时再搜索。

## 记忆也需要验收

很多人配置完记忆就直接相信它，这不够。你需要做一次重启测试：

1. 告诉 Hermes 一条长期偏好，例如“我的教程内容要偏实战，不要宣传腔”。
2. 再告诉它一个临时任务，例如“今天先只看 Day 1 文件”。
3. 让 Hermes 判断哪条该记住，哪条不该记住。
4. 开一个新会话，问它还记得什么。
5. 如果临时任务也被当成长期记忆，立刻清理。

这个测试比“它有没有回答我”重要得多，因为它验证的是记忆边界。

## 可复制的记忆规则

\`\`\`md
Memory policy:
- 只保存稳定偏好、长期项目规则和明确审批边界。
- 临时任务、一次性链接、未验证猜测，不进入长期记忆。
- 删除文件、对外发送、花钱、部署服务，必须先问用户。
- 每两周复查一次记忆，合并重复项，删除过期项。
\`\`\`

## PM 视角：记忆的价值怎么衡量

不要用“保存了多少条记忆”来衡量。那是错误指标。

更好的指标是：

- 每周减少了多少重复背景说明。
- Hermes 是否更少误用旧项目规则。
- 记忆内容能不能被用户看懂并手动修改。
- 删除一条记忆后，系统行为是否可预测。

如果用户不敢改记忆，说明产品还不透明。如果 Hermes 总拿旧信息说事，说明记忆没有生命周期。

## 今天交付什么

留下 \`hermes-day-2-memory.md\`：

\`\`\`yaml
stable_preferences:
  - "教程写作偏实战，不要宣传腔"
approval_rules:
  - "删除文件前必须确认"
do_not_remember:
  - "一次性验证码"
  - "今天临时任务"
review_cadence: "every two weeks"
restart_test: "passed / needs cleanup"
\`\`\`

明天把 Hermes 接进聊天渠道。重点不是“扫码成功”，而是把聊天入口做成低风险、可追踪的工作入口。

## 下一步

- **[Day 3：把 Hermes 放到消息发生的地方](/zh/tutorials/bootcamp/day-3-integration)** - 接入聊天渠道，但先收窄权限。
- **[最佳 Skills 目录](/zh/guides/resources/best-skills)** - 记忆稳定后再考虑扩展能力。
`,
    en: `
## Memory is not a dumping ground

The promise that Hermes gets more useful the longer it runs is genuinely attractive, but it is also easy to misuse. New users hear “memory” and want every conversation saved forever. A product manager should worry immediately. Unbounded memory becomes noise, privacy risk, and a source of stale decisions.

Day 2 is about a smaller and more useful promise: Hermes should remember only what saves work next time.

![Diagram of Hermes Agent memory rules and restart checks](/images/bootcamp/day-2-memory.svg)

## What deserves long-term memory

Long-term memory should store stable facts.

Good examples:

- You prefer concise Chinese output unless English is requested.
- The project does not allow file deletion without approval.
- A repository uses tabs and a 120-character line width.
- A server runs Debian and Docker commands do not need sudo.
- Weekly reports always include progress, risks, and next-week plans.

These facts appear repeatedly. Saving them reduces coordination cost.

Bad memory candidates:

- The bug you happen to be fixing today.
- Temporary accounts, one-time links, or verification codes.
- Guesses that have not been checked.
- Emotional labels such as “this solution is terrible.”
- Meeting details from a closed task.

Those belong in the session, log, or task artifact, not in long-term memory.

## Memory and session search do different jobs

Many beginner guides blur memory and history search. A useful split is:

Memory is the employee handbook. It tells Hermes who you are, how work should be done, and what is not allowed.

Session search is the archive room. It helps Hermes find old conversations, but old conversations should not automatically become permanent rules.

So today you design two layers:

1. Save stable preferences into memory.
2. Keep project details in sessions and documents, then search them when needed.

## Memory needs an acceptance test

Do not configure memory and simply trust it. Run a restart test:

1. Teach Hermes one durable preference, such as “tutorial content should be practical, not promotional.”
2. Give it one temporary task, such as “today only inspect Day 1 files.”
3. Ask Hermes which one should be remembered and which one should expire.
4. Start a fresh session and ask what it remembers.
5. If the temporary task became permanent memory, clean it immediately.

This test matters more than whether the answer sounds smart. It verifies the boundary.

## A copy-ready memory policy

\`\`\`md
Memory policy:
- Save only stable preferences, long-term project rules, and explicit approval boundaries.
- Temporary tasks, one-time links, and unchecked guesses do not enter long-term memory.
- Ask before deleting files, sending external messages, spending money, or deploying services.
- Review memory every two weeks: merge duplicates and delete stale entries.
\`\`\`

## Product metrics for memory

Do not measure the number of saved memories. That is the wrong metric.

Better metrics:

- How many repeated background explanations disappeared this week?
- Does Hermes misuse old project rules less often?
- Can the user read and manually edit memory?
- After deleting a memory entry, is behavior still predictable?

If users are afraid to edit memory, the product is not transparent enough. If Hermes keeps citing outdated facts, memory lacks lifecycle management.

## Ship this artifact

Create \`hermes-day-2-memory.md\`:

\`\`\`yaml
stable_preferences:
  - "tutorial writing should be practical, not promotional"
approval_rules:
  - "confirm before deleting files"
do_not_remember:
  - "one-time verification code"
  - "today's temporary task"
review_cadence: "every two weeks"
restart_test: "passed / needs cleanup"
\`\`\`

Tomorrow you move Hermes into a messaging channel. The point is not scanning a QR code; the point is creating a low-risk work entry point.

## Next step

- **[Day 3: Put Hermes where requests happen](/en/tutorials/bootcamp/day-3-integration)** - connect chat without widening permissions too fast.
- **[Best Skills Directory](/en/guides/resources/best-skills)** - extend capability after memory is under control.
`,
  },
  {
    meta: {
      order: 3,
      slug: 'day-3-integration',
      title: 'Day 3: Put Hermes Where Requests Happen',
      titleZh: 'Day 3：把 Hermes 放到消息发生的地方',
      description: 'Connect Hermes to chat channels safely: gateway setup, pairing, allowlists, command boundaries, and mobile tests.',
      descriptionZh: '安全接入聊天渠道：Gateway、配对、白名单、命令边界和手机端测试。',
      tags: ['gateway', 'wechat', 'feishu', 'messaging', 'security'],
      difficulty: 'intermediate',
      readingTime: 13,
    },
    zh: `
## 为什么一定要接消息渠道

只在终端里用 Hermes，很像把一个员工锁在机房里。能干活，但每次找它都要开电脑、进目录、敲命令。消息入口之所以重要，不是因为扫码本身高级，而是因为用户真正的需求发生在聊天里：路上想到一个任务、群里有人丢来一段上下文、手机上突然需要查一份资料。

今天的目标不是把所有平台都接上，而是让 Hermes 多一个可靠入口。

![Hermes Agent 第 3 天安全消息集成示意图](/images/bootcamp/day-3-integration.svg)

## 先确认你的版本和菜单

有些团队更适合微信通道，有些更适合飞书，有些则天然在 Telegram/Discord/Slack 里协作。这里不要死记“第几个选项”。Hermes 更新很快，不同版本、不同安装方式、不同平台菜单都可能变。

正确做法是：

\`\`\`bash
hermes update
hermes gateway setup
hermes gateway status
\`\`\`

看当前版本实际列出的平台，再选择你最常用、最容易验证、最不容易误触发高风险操作的渠道。

如果你在国内，飞书/企业微信/微信类入口的体感更好；如果你面向海外团队，Telegram、Discord、Slack 更自然。产品原则只有一个：入口要贴近用户，不要贴近教程截图。

## 消息渠道的风险会变大

终端里你会更谨慎，因为每条命令都像在“操作机器”。聊天里不一样。你可能在公交上随手发一句“帮我发一下”，也可能在群聊里被别人 @ 机器人。入口越方便，越需要边界。

第一版只允许这些意图：

- 总结一段文字。
- 起草回复。
- 查询已授权资料。
- 把任务加入待办。
- 请求人工确认。

第一版不要允许这些：

- 直接删除文件。
- 直接发送外部消息。
- 在群里自动响应所有人。
- 未经确认执行部署。
- 把聊天里的密钥保存下来。

## 一次安全的配置流程

1. 运行 \`hermes gateway setup\`。
2. 选择一个渠道，不要多选一堆。
3. 如果需要扫码或授权，只在你确认来源的页面完成。
4. 设置允许用户或配对方式。陌生人发消息不应该直接获得控制权。
5. 启动 gateway：\`hermes gateway start\`。
6. 用手机发一条只读消息，例如“总结这段文字”。
7. 查看 gateway 状态和日志。

## 测试不要只测成功

真正有用的测试包括失败路径：

- 发一条未知命令，看 Hermes 是否拒绝，而不是瞎猜。
- 发一条“帮我删除某文件”，看它是否要求确认。
- 在群聊里 @ 它，看它是否只响应允许范围内的消息。
- 重启 gateway，看是否能恢复连接。

这些测试比“它回我了”更重要。

## 今天交付什么

留下 \`hermes-day-3-gateway.md\`：

\`\`\`yaml
channel: "Feishu / WeChat / Telegram / Discord / Slack"
setup_command: "hermes gateway setup"
allowed_users:
  - "your own account"
safe_intents:
  - summarize
  - draft
  - search
  - queue
approval_required:
  - send
  - delete
  - deploy
  - purchase
failure_tests:
  - unknown command rejected
  - write action asks for confirmation
  - gateway restart tested
\`\`\`

明天开始让 Hermes 处理数据和文件。聊天入口只是门，真正的价值来自它能把杂乱输入变成可复查产物。

## 下一步

- **[Day 4：让 Hermes 处理文件和数据](/zh/tutorials/bootcamp/day-4-data)** - 从聊天走向真实工作。
- **[自动化方案库](/zh/guides/resources/automation-recipes)** - 后续把稳定请求变成定时流程。
`,
    en: `
## Why messaging matters

Using Hermes only in the terminal is like hiring someone and locking them in the server room. They can work, but every request requires opening a laptop, finding the right directory, and typing commands. Messaging integrations matter for a practical reason: real requests happen in chat. You remember something on the road. A teammate drops context into a group. You need a file summarized from your phone.

Day 3 is not about connecting every platform. It is about giving Hermes one reliable entry point.

![Diagram of a safe Hermes Agent messaging integration](/images/bootcamp/day-3-integration.svg)

## Check your actual version and menu

Some walkthroughs focus on WeChat. Others focus on Feishu, Telegram, Discord, or Slack. Do not memorize option numbers. Hermes changes quickly, and menus differ by version, platform, and installation path.

Start here:

\`\`\`bash
hermes update
hermes gateway setup
hermes gateway status
\`\`\`

Choose the platform that your real workflow already uses and that you can test safely. For China-focused personal workflows, Feishu, WeCom, or WeChat-style channels may feel natural if your version supports them. For global teams, Telegram, Discord, and Slack are often easier. The principle is simple: follow the user’s request flow, not the tutorial author’s favorite channel.

## Convenience increases risk

In a terminal, users behave carefully because commands feel like machine operations. Chat is different. You can send a message from a bus. A teammate can mention the bot in a group. The easier the entry point becomes, the tighter the boundary must be.

For the first version, allow only:

- summarize text;
- draft a reply;
- search approved material;
- queue a task;
- ask for human confirmation.

Do not allow yet:

- deleting files;
- sending external messages;
- responding to everyone in a group;
- deploying services without approval;
- saving secrets from chat.

## A safe setup flow

1. Run \`hermes gateway setup\`.
2. Choose one channel, not five.
3. If QR login or authorization is required, confirm the source before scanning.
4. Configure allowed users or pairing. Unknown users should not gain control.
5. Start the gateway with \`hermes gateway start\`.
6. Send a read-only message from your phone.
7. Check gateway status and logs.

## Test failure paths too

Useful tests include:

- Send an unknown command and confirm Hermes refuses instead of guessing.
- Ask it to delete a file and confirm it asks for approval.
- Mention it in a group and confirm scope rules work.
- Restart the gateway and confirm reconnection.

These tests matter more than a successful demo reply.

## Ship this artifact

Create \`hermes-day-3-gateway.md\`:

\`\`\`yaml
channel: "Feishu / WeChat / Telegram / Discord / Slack"
setup_command: "hermes gateway setup"
allowed_users:
  - "your own account"
safe_intents:
  - summarize
  - draft
  - search
  - queue
approval_required:
  - send
  - delete
  - deploy
  - purchase
failure_tests:
  - unknown command rejected
  - write action asks for confirmation
  - gateway restart tested
\`\`\`

Tomorrow you move from chat to real work: files, data, and reviewable artifacts.

## Next step

- **[Day 4: Make Hermes handle files and data](/en/tutorials/bootcamp/day-4-data)** - turn messy inputs into usable outputs.
- **[Automation Recipes](/en/guides/resources/automation-recipes)** - later turn stable requests into scheduled workflows.
`,
  },
  {
    meta: {
      order: 4,
      slug: 'day-4-data',
      title: 'Day 4: Make Hermes Handle Files and Data',
      titleZh: 'Day 4：让 Hermes 处理文件和数据',
      description: 'Turn Hermes into a reviewable data worker with raw folders, schemas, validation notes, and safe file permissions.',
      descriptionZh: '用 raw 文件夹、schema、验证记录和权限边界，把 Hermes 变成可复查的数据员工。',
      tags: ['data', 'files', 'schema', 'validation', 'artifacts'],
      difficulty: 'intermediate',
      readingTime: 13,
    },
    zh: `
## 聊天只是入口，文件才是工作

用户真正感受到 Agent 价值，往往不是它会聊天，而是它能接住一堆乱材料：一份会议纪要、几个 CSV、一个网页、一个需求文档，然后产出可以检查的东西。日报、网站监控、数据提取、内容改写，本质都是同一个动作：把杂乱输入变成结构化产物。

今天让 Hermes 做第一份“可复查的数据工作”。

![Hermes Agent 第 4 天数据处理工作区示意图](/images/bootcamp/day-4-data.svg)

## 先建工作区，不要直接把文件丢给它

很多人会直接说“帮我处理这个文件”。这句话太危险，因为你没说清楚原始文件能不能改、输出长什么样、错了怎么发现。

先建一个小目录：

\`\`\`text
hermes-data-task/
  raw/
  working/
  output/
  notes.md
  schema.json
\`\`\`

规则很简单：

- \`raw/\` 放原始文件，只读，不覆盖。
- \`working/\` 放中间过程。
- \`output/\` 放最终产物。
- \`notes.md\` 记录 prompt、判断和异常。
- \`schema.json\` 写输出格式。

这样做看起来慢，但后面会省大量返工。

## 第一份任务选什么

不要从最难的开始。选一个低风险、能肉眼检查、真实有用的小任务。

适合 Day 4 的任务：

- 把 20 条用户反馈按主题分类。
- 从会议纪要里提取待办、负责人和截止时间。
- 把一份工具清单整理成 JSON。
- 从几篇文章标题中归纳用户痛点。
- 把网站监控记录整理成异常报告。

不适合 Day 4 的任务：

- 直接改生产数据库。
- 批量给客户发消息。
- 处理唯一一份没有备份的文件。
- 让 Hermes 自己决定哪些字段重要。

## 写清楚输出 schema

如果你要它提取待办，不要只说“整理一下”。写成这样：

\`\`\`json
{
  "items": [
    {
      "task": "string",
      "owner": "string | unknown",
      "deadline": "YYYY-MM-DD | unknown",
      "source_quote": "string",
      "confidence": "high | medium | low",
      "needs_review": true
    }
  ]
}
\`\`\`

\`source_quote\` 很重要。它让你能回到原文检查 Hermes 有没有编造。\`needs_review\` 也很重要，因为不确定性应该变成字段，而不是藏在一段漂亮总结里。

## 给 Hermes 的任务说明

\`\`\`md
请只读取 raw/ 目录，不要修改原始文件。
请按照 schema.json 输出结果到 output/tasks.json。
如果信息不确定，owner/deadline 写 unknown，并把 needs_review 设为 true。
请在 notes.md 追加处理说明：你读了哪些文件、发现哪些异常、哪些字段需要我复查。
\`\`\`

这个 prompt 没有华丽词，但它像工作指令。一个好 Agent 不需要你夸它聪明，它需要你把输入、输出和验收说清楚。

## 验收方式

跑完以后不要立刻进入下一天。做四个检查：

1. 原始文件是否没被改。
2. 输出是否能被 JSON parser 读取。
3. 行数、条数、字段数是否和预期接近。
4. 所有低置信度项是否被标记为 \`needs_review\`。

如果这四项过不了，不要怪模型，先改 schema 和任务说明。

## 今天交付什么

留下 \`hermes-day-4-data.md\`：

\`\`\`yaml
task: "meeting notes to action items"
input_folder: "raw/"
output_file: "output/tasks.json"
schema_file: "schema.json"
validation:
  - raw unchanged
  - json parses
  - uncertain fields marked
  - notes written
\`\`\`

明天讲 Skill 和 MCP。今天你已经有了一个重复工作流的雏形；明天要判断它值不值得沉淀成能力。

## 下一步

- **[Day 5：把重复流程沉淀成 Skill](/zh/tutorials/bootcamp/day-5-skills)** - 从一次任务走向可复用能力。
- **[自动化脚本合集](/zh/guides/resources/automation-recipes)** - 参考更多可重复工作流。
`,
    en: `
## Chat is the doorway; files are the work

Users feel the value of an agent when it can handle messy inputs: meeting notes, CSV files, web pages, requirements documents, and rough research material. Daily reports, website monitoring, data extraction, and content rewriting all share the same product motion: turn messy input into a structured artifact that a human can review.

Day 4 is your first reviewable data task.

![Diagram of the Hermes Agent data processing workspace](/images/bootcamp/day-4-data.svg)

## Create a workspace before handing over files

“Process this file” is too vague. It does not say whether the source can be changed, what the output should look like, or how errors will be found.

Create a small workspace:

\`\`\`text
hermes-data-task/
  raw/
  working/
  output/
  notes.md
  schema.json
\`\`\`

The rules:

- \`raw/\` stores original files and is read-only.
- \`working/\` stores intermediate material.
- \`output/\` stores final artifacts.
- \`notes.md\` records prompts, decisions, and anomalies.
- \`schema.json\` defines the output shape.

This looks slower than dropping files into chat. It saves time when something goes wrong.

## Choose the right first task

Start with a low-risk task that is real and easy to inspect.

Good Day 4 tasks:

- Classify 20 user feedback items by theme.
- Extract tasks, owners, and deadlines from meeting notes.
- Turn a tool list into JSON.
- Summarize pain points from article titles.
- Convert website monitoring logs into an incident note.

Bad Day 4 tasks:

- Editing a production database.
- Sending messages to customers.
- Processing the only copy of an important file.
- Letting Hermes decide the schema from scratch.

## Define the schema

If you want action items, do not ask it to “organize this.” Ask for a shape:

\`\`\`json
{
  "items": [
    {
      "task": "string",
      "owner": "string | unknown",
      "deadline": "YYYY-MM-DD | unknown",
      "source_quote": "string",
      "confidence": "high | medium | low",
      "needs_review": true
    }
  ]
}
\`\`\`

\`source_quote\` lets you check whether Hermes invented anything. \`needs_review\` turns uncertainty into data instead of hiding it inside a polished paragraph.

## The prompt to use

\`\`\`md
Read only the raw/ folder. Do not modify source files.
Use schema.json and write the result to output/tasks.json.
If owner or deadline is unclear, write unknown and set needs_review to true.
Append notes to notes.md: files read, anomalies found, and fields I should review.
\`\`\`

This prompt is plain, but it works like a job instruction. A useful agent does not need praise; it needs inputs, outputs, and acceptance criteria.

## Acceptance check

Before moving on, check:

1. Raw files were not changed.
2. Output can be parsed as JSON.
3. Counts and required fields look reasonable.
4. Low-confidence items are marked for review.

If these fail, fix the schema and task instruction first.

## Ship this artifact

Create \`hermes-day-4-data.md\`:

\`\`\`yaml
task: "meeting notes to action items"
input_folder: "raw/"
output_file: "output/tasks.json"
schema_file: "schema.json"
validation:
  - raw unchanged
  - json parses
  - uncertain fields marked
  - notes written
\`\`\`

Tomorrow is Skills and MCP. Today you created a repeatable workflow; tomorrow you decide whether it deserves to become a reusable capability.

## Next step

- **[Day 5: Turn repeat work into a Skill](/en/tutorials/bootcamp/day-5-skills)** - move from one task to reusable capability.
- **[Automation Recipes](/en/guides/resources/automation-recipes)** - compare more repeatable workflow patterns.
`,
  },
  {
    meta: {
      order: 5,
      slug: 'day-5-skills',
      title: 'Day 5: Turn Repeat Work Into a Skill',
      titleZh: 'Day 5：把重复流程沉淀成 Skill',
      description: 'Use Skills and MCP as a productized workflow layer: when to create a Skill, how to define contracts, and how to avoid tool sprawl.',
      descriptionZh: '把 Skills 和 MCP 当成工作流产品化层：什么时候该沉淀、如何定义契约、如何避免工具泛滥。',
      tags: ['skills', 'mcp', 'tools', 'workflow', 'contracts'],
      difficulty: 'intermediate',
      readingTime: 14,
    },
    zh: `
## Skill 不是“高级 Prompt”

很多中文文章会把 Skill 写得很玄：会自我进化、会从经验里长出能力。这个方向没错，但用户真正需要先理解的是：Skill 是把一个重复流程产品化。

如果你每周都让 Hermes 做同一类事，比如整理周报、审查 PR、处理用户反馈、生成内容草稿，那就不该每次重新写 prompt。你应该把流程、输入、输出、注意事项和验收标准沉淀下来。

![Hermes Agent 第 5 天 Skills、Tool Calling 和 MCP 权限示意图](/images/bootcamp/day-5-skills.svg)

## 什么流程值得写成 Skill

用三个问题判断：

1. 这个任务是否重复出现？
2. 每次输入是否长得差不多？
3. 产物是否有固定验收标准？

三个都是“是”，就可以考虑 Skill。

比如 Day 4 的“会议纪要提取待办”就很适合。输入是会议记录，输出是 JSON 或 Markdown 清单，验收标准也明确。

不适合写成 Skill 的情况：

- 一次性探索任务。
- 连用户自己都没想清楚的目标。
- 高风险、强依赖人工判断的动作。
- 只是为了看起来厉害。

## Skill 文件应该写什么

一个好 Skill 不需要复杂，但必须清楚：

\`\`\`md
# meeting-action-extractor

When to use:
Use this when the user provides meeting notes and wants tasks, owners, deadlines, and review flags.

Inputs:
- Markdown, transcript, or plain text meeting notes.

Output:
- A task list with owner, deadline, source quote, confidence, and needs_review.

Rules:
- Do not invent missing owners.
- Keep source_quote short.
- Mark uncertain fields as unknown.
- Ask before sending tasks to external tools.
\`\`\`

这不是文学创作，是 SOP。它要让 Hermes 在下次遇到类似任务时少猜一点。

## MCP 是工具边界，不是万能插座

MCP 的价值在于让模型以统一方式调用外部工具。中文技术文章里常见的“感知层、决策层、执行层”可以这样落到 Hermes 上：

- 感知层：读取文件、消息、网页、RSS、Issue。
- 决策层：判断任务类型，选择 Skill 或工具。
- 执行层：写文件、查 API、发消息、生成报告。

但工具越多，边界越重要。第一批工具建议只读：搜索、读取仓库、抓取网页、读取日历、读取 Issue。写操作后置，并且必须审批。

## 今天做一个最小 Skill

把 Day 4 的数据任务沉淀成 Skill：

1. 新建 Skill 目录。
2. 写 \`SKILL.md\`。
3. 明确触发条件。
4. 明确输入输出。
5. 写出禁止事项。
6. 用 3 个样本测试。
7. 记录失败案例。

不要一上来追求“自动生成 Skill”。你先手写一个，才知道什么叫好 Skill。

## 常见坑

- 把 Skill 写成一段情绪化 prompt，没有输入输出。
- 安装一堆社区 Skill，却不知道哪个工作流需要它们。
- 工具权限给得太宽，一个读文件任务拿到了写权限。
- 工具失败后，让模型靠猜继续回答。

## 今天交付什么

留下 \`hermes-day-5-skill.md\`：

\`\`\`yaml
skill_name: "meeting-action-extractor"
trigger: "meeting notes -> action items"
inputs:
  - notes.md
outputs:
  - output/tasks.json
permissions:
  - read raw files
  - write output folder
approval_required:
  - send tasks to chat
  - create external tickets
test_cases: 3
\`\`\`

明天讲自动化。只有当 Skill 连续几次稳定产出，你才应该把它放进定时任务里。

## 下一步

- **[Day 6：把稳定流程交给时间](/zh/tutorials/bootcamp/day-6-automation)** - 从手动触发到定时运行。
- **[10 个最强 Hermes 技能](/zh/guides/resources/best-skills)** - 选择第一批低风险技能。
`,
    en: `
## A Skill is not a fancy prompt

Many articles describe Hermes Skills as self-improving abilities that grow from experience. That is useful, but beginners need a simpler product idea first: a Skill productizes a repeated workflow.

If you ask Hermes to do the same class of task every week, such as preparing a weekly report, reviewing a PR, processing feedback, or drafting a public article, you should not rewrite the prompt each time. Capture the process, inputs, outputs, constraints, and acceptance criteria.

![Diagram of Hermes Agent skills, tool calling, and MCP permissions](/images/bootcamp/day-5-skills.svg)

## What deserves to become a Skill

Ask three questions:

1. Does this task repeat?
2. Do inputs look similar each time?
3. Does the output have a stable acceptance standard?

If all three are yes, consider a Skill.

The Day 4 meeting-notes workflow is a good candidate. The input is meeting notes. The output is a JSON or Markdown task list. Acceptance criteria are clear.

Do not make a Skill for:

- one-off exploration;
- goals the user has not clarified;
- high-risk actions that depend heavily on judgment;
- anything created only to look advanced.

## What a Skill file should contain

A good Skill can be simple, but it must be concrete:

\`\`\`md
# meeting-action-extractor

When to use:
Use this when the user provides meeting notes and wants tasks, owners, deadlines, and review flags.

Inputs:
- Markdown, transcript, or plain text meeting notes.

Output:
- A task list with owner, deadline, source quote, confidence, and needs_review.

Rules:
- Do not invent missing owners.
- Keep source_quote short.
- Mark uncertain fields as unknown.
- Ask before sending tasks to external tools.
\`\`\`

This is not creative writing. It is an SOP Hermes can reuse instead of guessing.

## MCP is a boundary, not a magic socket

MCP matters because it gives models a consistent way to call external tools. A useful three-layer mental model is:

- Perception: read files, messages, web pages, RSS, and issues.
- Decision: classify the task and choose a Skill or tool.
- Action: write files, call APIs, send messages, or generate reports.

The more tools you add, the more important the boundary becomes. Start read-only: search, repository inspection, web fetch, calendar read, issue read. Write actions come later and require approval.

## Build one minimal Skill today

Turn Day 4’s data workflow into a Skill:

1. Create a Skill folder.
2. Write \`SKILL.md\`.
3. Define when it should trigger.
4. Define inputs and outputs.
5. List forbidden behavior.
6. Test with three samples.
7. Record failure cases.

Do not start with automatic Skill generation. Hand-write one first so you learn what a good Skill looks like.

## Common mistakes

- Writing a Skill as a vague inspirational prompt.
- Installing many community Skills without a workflow that needs them.
- Granting write permissions for a read-only task.
- Letting the model guess after a tool call fails.

## Ship this artifact

Create \`hermes-day-5-skill.md\`:

\`\`\`yaml
skill_name: "meeting-action-extractor"
trigger: "meeting notes -> action items"
inputs:
  - notes.md
outputs:
  - output/tasks.json
permissions:
  - read raw files
  - write output folder
approval_required:
  - send tasks to chat
  - create external tickets
test_cases: 3
\`\`\`

Tomorrow is automation. Only a workflow that has produced stable results manually deserves a schedule.

## Next step

- **[Day 6: Give stable workflows a schedule](/en/tutorials/bootcamp/day-6-automation)** - move from manual trigger to timed execution.
- **[Top 10 Hermes Skills](/en/guides/resources/best-skills)** - choose the first low-risk skills.
`,
  },
  {
    meta: {
      order: 6,
      slug: 'day-6-automation',
      title: 'Day 6: Give Stable Workflows a Schedule',
      titleZh: 'Day 6：把稳定流程交给时间',
      description: 'Design scheduled Hermes workflows with triggers, saved inputs, idempotent delivery, logs, and rollback.',
      descriptionZh: '设计带触发器、输入产物、幂等投递、日志和回滚的 Hermes 定时工作流。',
      tags: ['automation', 'cron', 'logs', 'daily-report', 'workflow'],
      difficulty: 'advanced',
      readingTime: 14,
    },
    zh: `
## 自动化不是把 prompt 丢进 cron

最有产品感的自动化场景，通常是“日报”“网站监控”“价格提醒”“定时备份”。这些东西之所以有价值，不是因为 AI 参与了，而是因为它们本来就重复、低风险、可复查。Hermes 的作用，是把收集、理解、整理和投递串起来。

今天不要做炫技自动化。做一个明天真的能用的流程。

![Hermes Agent 第 6 天带重试和日志的定时工作流示意图](/images/bootcamp/day-6-automation.svg)

## 什么任务适合定时

适合：

- 每天早上汇总 GitHub issue、日历和待办。
- 每晚备份 Hermes 配置和记忆目录。
- 每小时检查网站是否可访问。
- 每周整理一次记忆和 Skill 使用情况。
- 每天抓取固定信息源并生成摘要。

不适合：

- 结果错了会直接伤害用户或客户。
- 每次都需要临场判断。
- 还没手动跑通过。
- 失败后无法知道发生了什么。

产品原则是：先人工跑三次，再交给时间。

## 把流程拆成四段

不要让一个步骤从采集一路做到发送。拆开：

1. Collect：采集原始数据，保存到文件。
2. Summarize：基于原始文件生成摘要。
3. Deliver：把摘要发到指定渠道或保存到指定位置。
4. Log：记录开始时间、结束时间、输入路径、输出路径、失败原因。

这样投递失败时，可以只重发，不会重新采集一批不同数据，也不会生成另一版摘要。

## 一个日报模板

\`\`\`yaml
name: daily-ops-brief
trigger: "weekday 08:30"
collect:
  - github_issues
  - calendar_events
  - yesterday_notes
summarize_from: "artifacts/daily/raw.json"
deliver_to: "Feishu / Telegram / file"
approval_required: false
log_file: "logs/daily-ops-brief.log"
retry:
  collect: "no automatic retry if API auth fails"
  deliver: "retry twice, no duplicate message"
\`\`\`

这里最重要的是 \`summarize_from\`。让 Hermes 基于保存下来的输入总结，而不是每次都重新读实时系统。

## 失败日志要像产品功能

日志不是开发者自嗨，是自动化产品的一部分。用户早上没收到日报时，第一反应不应该是“AI 又抽风了”，而应该能看到：

- 任务有没有启动。
- 读了哪些输入。
- 哪一步失败。
- 是否已经重试。
- 结果有没有发出去。

如果这些看不到，自动化就是新的负担。

## 今天交付什么

留下 \`hermes-day-6-automation.md\`：

\`\`\`yaml
workflow: "daily-ops-brief"
manual_runs_passed: 3
trigger: "weekday 08:30"
raw_artifact: "artifacts/daily/raw.json"
final_artifact: "artifacts/daily/brief.md"
delivery: "chat or file"
idempotency_rule: "never send duplicate message on retry"
owner: "you"
rollback: "disable schedule and run manually"
\`\`\`

明天讲多 Agent。定时任务解决的是重复执行，多 Agent 解决的是并行分工。两者都不该为了酷而上。

## 下一步

- **[Day 7：多 Agent 不是群聊，是分工](/zh/tutorials/bootcamp/day-7-multi-agent)** - 拆职责，而不是拆热闹。
- **[5 个 AI 自动化脚本](/zh/guides/resources/automation-recipes)** - 找下一个可调度流程。
`,
    en: `
## Automation is not a prompt taped to cron

The strongest product examples are daily reports, website monitoring, price alerts, and backups. These are valuable not because AI is involved, but because they are repeated, low-risk, and reviewable. Hermes helps connect collection, reasoning, formatting, and delivery.

Day 6 is not about an impressive demo. It is about one workflow you might still trust tomorrow morning.

![Diagram of a Hermes Agent scheduled workflow with retries and logs](/images/bootcamp/day-6-automation.svg)

## What belongs on a schedule

Good candidates:

- A weekday morning brief from GitHub issues, calendar events, and notes.
- Nightly backup of Hermes config and memory.
- Hourly website availability check.
- Weekly memory and Skill review.
- Daily digest from fixed information sources.

Bad candidates:

- Outputs that can directly harm users or customers.
- Tasks requiring fresh human judgment every time.
- Workflows that have not passed manual runs.
- Jobs where failure cannot be diagnosed.

The product rule is simple: run manually three times before giving it a schedule.

## Split the workflow into four parts

Do not let one step collect data, summarize it, and send it externally. Split:

1. Collect: gather raw data and save it.
2. Summarize: produce a summary from the saved data.
3. Deliver: send or store the final output.
4. Log: record start time, end time, input path, output path, and failure reason.

This separation lets you retry delivery without collecting different data or generating a different answer.

## A daily brief template

\`\`\`yaml
name: daily-ops-brief
trigger: "weekday 08:30"
collect:
  - github_issues
  - calendar_events
  - yesterday_notes
summarize_from: "artifacts/daily/raw.json"
deliver_to: "Feishu / Telegram / file"
approval_required: false
log_file: "logs/daily-ops-brief.log"
retry:
  collect: "no automatic retry if API auth fails"
  deliver: "retry twice, no duplicate message"
\`\`\`

The key is \`summarize_from\`. Hermes should summarize from a saved artifact, not from a live system that changes on every retry.

## Logs are a product feature

Logs are not developer decoration. They are part of the automation experience. If the morning brief does not arrive, the user should be able to see:

- whether the job started;
- which inputs were read;
- which step failed;
- whether retries happened;
- whether delivery succeeded.

If the user cannot see this, automation becomes another thing to babysit.

## Ship this artifact

Create \`hermes-day-6-automation.md\`:

\`\`\`yaml
workflow: "daily-ops-brief"
manual_runs_passed: 3
trigger: "weekday 08:30"
raw_artifact: "artifacts/daily/raw.json"
final_artifact: "artifacts/daily/brief.md"
delivery: "chat or file"
idempotency_rule: "never send duplicate message on retry"
owner: "you"
rollback: "disable schedule and run manually"
\`\`\`

Tomorrow is multi-agent orchestration. Scheduling solves repetition; multi-agent solves parallel responsibility. Neither should exist just to look advanced.

## Next step

- **[Day 7: Multi-agent is division of labor, not group chat](/en/tutorials/bootcamp/day-7-multi-agent)** - split responsibilities, not noise.
- **[5 AI Workflow Automation Recipes](/en/guides/resources/automation-recipes)** - choose your next scheduled workflow.
`,
  },
  {
    meta: {
      order: 7,
      slug: 'day-7-multi-agent',
      title: 'Day 7: Multi-Agent Is Division of Labor, Not Group Chat',
      titleZh: 'Day 7：多 Agent 不是群聊，是分工',
      description: 'Use multi-agent orchestration only when responsibilities are independent: researcher, operator, reviewer, and final owner.',
      descriptionZh: '只在职责真的独立时使用多 Agent：研究、执行、复核和最终负责人必须清楚。',
      tags: ['multi-agent', 'subagent', 'orchestration', 'handoff', 'advanced'],
      difficulty: 'advanced',
      readingTime: 14,
    },
    zh: `
## 不要为了酷而多 Agent

多 Agent 是最容易写得像科幻的部分：研究员、写手、审稿人、执行者，一群智能体同时开工。听起来很强，但从产品角度看，第一性原理只有一个：多 Agent 是否降低了用户完成任务的总成本？

如果没有，它就是把一个混乱问题拆成多个混乱问题。

![Hermes Agent 第 7 天多 Agent 交接和最终综合示意图](/images/bootcamp/day-7-multi-agent.svg)

## 什么时候值得拆

值得拆的任务有三个特征：

1. 子任务相互独立，可以并行。
2. 每个子任务有清楚输入和输出。
3. 最终需要一个负责人综合，而不是简单拼接。

适合：

- 竞品分析：一个 Agent 查资料，一个整理功能，一个评估风险。
- 代码审查：一个读 diff，一个跑测试，一个查安全问题。
- 内容生产：一个搜素材，一个写初稿，一个检查事实和语气。
- 运维排查：一个看日志，一个查部署，一个整理时间线。

不适合：

- 目标还没说清楚。
- 下一步依赖上一步结果。
- 每个 Agent 都在做同一件事。
- 没有人负责最终判断。

## Host Agent 的职责

Host 不是把输出粘在一起。Host 要做四件事：

- 分任务：谁查资料，谁执行，谁复核。
- 给契约：每个 Agent 输出格式一致。
- 比冲突：不同结论要摆出来。
- 做综合：决定采用、拒绝或继续追问。

用户仍然是最终 owner。尤其是发消息、改文件、部署、花钱这些动作，不能让子 Agent 直接完成闭环。

## 一个可用的三 Agent 模板

\`\`\`yaml
goal: "评估 HermesAgent 101 的 Day 1 教程是否适合新手"
agents:
  researcher:
    job: "阅读教程和素材，列出用户疑惑"
    output: "bullets with evidence"
  operator:
    job: "按教程执行命令，记录卡点"
    output: "steps passed / failed"
  reviewer:
    job: "检查隐私、权限、死链和误导性表达"
    output: "risks with severity"
host:
  job: "合并冲突，给出最终修改清单"
human_approval:
  - publish
  - delete files
  - push changes
\`\`\`

这个模板有一个关键点：每个 Agent 的职责不同，输出也可比较。

## 多 Agent 的常见失败

- 把同一个问题复制给三个 Agent，得到三份重复答案。
- 不要求来源和假设，最后无法判断谁对。
- 让子 Agent 直接执行高风险动作。
- Host 不做判断，只做拼接。
- 为了并行，反而增加等待和沟通成本。

## 今天交付什么

留下 \`hermes-day-7-orchestration.md\`：

\`\`\`yaml
task: "your real multi-step task"
split_reason: "parallel research / independent checks / separate expertise"
roles:
  - researcher
  - operator
  - reviewer
handoff_format:
  - findings
  - evidence
  - assumptions
  - open_questions
final_owner: "human"
do_not_delegate:
  - publish
  - spend money
  - delete files
\`\`\`

到这里，7 天实战营的产品逻辑就闭环了：先跑起来，再记住你，再进入聊天，再处理资料，再沉淀技能，再定时运行，最后用多 Agent 承接复杂工作。

## 下一步

- **[10 个最强 Hermes 技能](/zh/guides/resources/best-skills)** - 从低风险 Skill 开始扩展。
- **[Hermes vs OpenClaw](/zh/guides/comparisons/hermes-vs-openclaw)** - 看 Hermes 的定位差异。
`,
    en: `
## Do not use multi-agent because it sounds cool

Multi-agent orchestration is the easiest topic to turn into science fiction: a researcher, writer, reviewer, and operator all working at once. It sounds powerful. From a product perspective, the first-principles question is simpler: does it reduce the total cost of finishing the task?

If not, it only splits one confusing problem into several confusing problems.

![Diagram of Hermes Agent multi-agent handoffs and final synthesis](/images/bootcamp/day-7-multi-agent.svg)

## When the split is worth it

A task is a good candidate when:

1. Subtasks are genuinely independent.
2. Each subtask has clear input and output.
3. A final owner must synthesize the result, not paste it together.

Good examples:

- Competitive analysis: one agent researches sources, one compares features, one reviews risk.
- Code review: one reads the diff, one runs tests, one checks security.
- Content production: one gathers material, one drafts, one checks facts and tone.
- Incident review: one reads logs, one checks deployments, one builds a timeline.

Bad examples:

- The goal is still vague.
- The next step depends on the previous result.
- Every agent is doing the same work.
- Nobody owns the final decision.

## The host agent has a real job

The host is not a clipboard. It must:

- assign responsibilities;
- give every worker an output contract;
- compare conflicts;
- decide what to accept, reject, or investigate.

The human remains the final owner. Sending messages, changing files, deploying services, and spending money should not be delegated to a sub-agent without approval.

## A three-agent template

\`\`\`yaml
goal: "evaluate whether the Day 1 tutorial is beginner-friendly"
agents:
  researcher:
    job: "read tutorial and source material, list user questions"
    output: "bullets with evidence"
  operator:
    job: "follow the tutorial commands and record friction"
    output: "steps passed / failed"
  reviewer:
    job: "check privacy, permissions, dead links, and misleading language"
    output: "risks with severity"
host:
  job: "merge conflicts and produce final edits"
human_approval:
  - publish
  - delete files
  - push changes
\`\`\`

The important part is that every agent has a different responsibility and comparable output.

## Common failures

- Giving the same prompt to three agents and receiving three duplicate answers.
- Not requiring evidence or assumptions.
- Letting sub-agents execute high-risk actions.
- Host agent pastes instead of judges.
- Parallelism creates more waiting and coordination than it removes.

## Ship this artifact

Create \`hermes-day-7-orchestration.md\`:

\`\`\`yaml
task: "your real multi-step task"
split_reason: "parallel research / independent checks / separate expertise"
roles:
  - researcher
  - operator
  - reviewer
handoff_format:
  - findings
  - evidence
  - assumptions
  - open_questions
final_owner: "human"
do_not_delegate:
  - publish
  - spend money
  - delete files
\`\`\`

The seven-day path now has a product loop: run Hermes, give it durable context, put it where requests happen, process real material, capture repeatable workflows, schedule stable work, and finally split complex work across specialists.

## Next step

- **[Top 10 Hermes Skills](/en/guides/resources/best-skills)** - extend Hermes with low-risk Skills first.
- **[Hermes vs OpenClaw](/en/guides/comparisons/hermes-vs-openclaw)** - understand the positioning difference.
`,
  },
];

for (const article of articles) {
  writeArticle(article);
}

console.log(`Rewrote ${articles.length * 2} humanized bootcamp files.`);
