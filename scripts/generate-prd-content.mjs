import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const author = 'HermesAgent Community';
const today = '2026-04-18';

function quote(value) {
  return JSON.stringify(value);
}

function frontmatter(meta) {
  return [
    '---',
    `title: ${quote(meta.title)}`,
    `titleZh: ${quote(meta.titleZh)}`,
    `slug: ${quote(meta.slug)}`,
    `description: ${quote(meta.description)}`,
    `descriptionZh: ${quote(meta.descriptionZh)}`,
    `author: ${quote(author)}`,
    `publishedAt: ${quote(today)}`,
    `updatedAt: ${quote(today)}`,
    `category: ${quote(meta.category)}`,
    `tags: [${meta.tags.map(quote).join(', ')}]`,
    `difficulty: ${quote(meta.difficulty)}`,
    `readingTime: ${meta.readingTime}`,
    ...(meta.series ? [`series: ${quote(meta.series)}`] : []),
    ...(meta.seriesOrder ? [`seriesOrder: ${meta.seriesOrder}`] : []),
    `featured: ${meta.featured ? 'true' : 'false'}`,
    '---',
    '',
  ].join('\n');
}

function lines(items) {
  return items.flatMap((item) => [item, '']);
}

function bullets(items) {
  return items.map((item) => `- ${item}`);
}

function numbered(items) {
  return items.map((item, index) => `${index + 1}. ${item}`);
}

function codeBlock(lang, content) {
  return [`\`\`\`${lang}`, ...content.trim().split('\n'), '```', ''];
}

const bootcampVisuals = {
  'bootcamp/day-1-setup': {
    title: 'Day 1 Setup Map',
    subtitle: 'Model choice, permissions, and first safe task',
    steps: ['Environment', 'Model endpoint', 'Permission boundary', 'First prompt'],
  },
  'bootcamp/day-2-memory': {
    title: 'Day 2 Memory Contract',
    subtitle: 'Stable facts enter memory only after review',
    steps: ['Profile', 'Durable facts', 'Approval rules', 'Restart test'],
  },
  'bootcamp/day-3-integration': {
    title: 'Day 3 Message Gateway',
    subtitle: 'Chat requests become bounded Hermes intents',
    steps: ['Webhook', 'Intent map', 'Approval phrase', 'Audit log'],
  },
  'bootcamp/day-4-data': {
    title: 'Day 4 Data Workspace',
    subtitle: 'Raw inputs turn into reviewable artifacts',
    steps: ['Raw input', 'Schema', 'Transform', 'Review artifact'],
  },
  'bootcamp/day-5-skills': {
    title: 'Day 5 Tool Contract',
    subtitle: 'Skills expose inputs, permissions, and outputs',
    steps: ['Read-only first', 'MCP server', 'Tool call log', 'Rollback rule'],
  },
  'bootcamp/day-6-automation': {
    title: 'Day 6 Scheduled Workflow',
    subtitle: 'Collect, summarize, deliver, and log',
    steps: ['Trigger', 'Input artifact', 'Retry policy', 'Delivery'],
  },
  'bootcamp/day-7-multi-agent': {
    title: 'Day 7 Agent Handoff',
    subtitle: 'Specialists work in parallel with one final owner',
    steps: ['Plan', 'Delegate', 'Compare', 'Synthesize'],
  },
};

const bootcampExpansions = {
  'bootcamp/day-1-setup': {
    en: {
      visualAlt: 'Diagram of the Day 1 local setup path for Hermes Agent',
      fieldNotes: [
        'Treat the first install as an operations exercise, not a feature tour. The useful question is not how many plugins Hermes can run on day one; it is whether you can start it, stop it, explain the model endpoint, and reproduce the same result tomorrow.',
        'Create a small setup note beside the project. Record the shell, Node version, model provider, and the exact command that starts Hermes. When something breaks later, this note becomes the baseline instead of forcing you to reconstruct the environment from memory.',
        'For privacy, write a one-line data policy before your first real prompt. A good first policy is simple: private documents stay out of prompts unless explicitly selected, secrets live only in environment variables, and file access starts read-only until the workflow needs more.',
      ],
      decisions: [
        'Which model endpoint will handle normal learning tasks?',
        'Which folders may Hermes inspect during this bootcamp?',
        'Which actions require manual approval even if Hermes suggests them?',
        'Where will you keep setup notes, logs, and small test artifacts?',
      ],
      reviewDrill: [
        'Restart the terminal and start Hermes from the documented command.',
        'Ask Hermes to summarize the workspace without opening sensitive files.',
        'Switch to a second harmless prompt and confirm the answer still references the current environment.',
        'Close the session, reopen it, and confirm you can reproduce the same start sequence.',
      ],
      measure: [
        'Time from new terminal to first useful answer.',
        'Number of manual steps that are not yet documented.',
        'Whether the model endpoint and privacy boundary are obvious to another user.',
      ],
    },
    zh: {
      visualAlt: 'Hermes Agent 第 1 天本地安装路径示意图',
      fieldNotes: [
        '第一天要把安装当成一次运维演练，而不是功能展览。真正重要的问题不是 Hermes 第一天能装多少插件，而是你能不能启动它、停止它、说清楚模型请求去向，并在明天复现同样的结果。',
        '建议在项目旁边放一份很短的 setup note，记录 Shell、Node 版本、模型供应商和启动 Hermes 的准确命令。后面遇到问题时，这份记录就是基线，不需要靠记忆重新拼环境。',
        '隐私边界要在第一条真实 prompt 前写下来。一个足够好的起点是：私密文档不主动进入提示词，密钥只放环境变量，文件权限先只读，等工作流真正需要写入时再单独开放。',
      ],
      decisions: [
        '日常学习任务默认走哪个模型端点？',
        '这 7 天里 Hermes 可以查看哪些目录？',
        '哪些动作即使 Hermes 建议，也必须人工确认？',
        '安装记录、日志和测试产物放在哪里？',
      ],
      reviewDrill: [
        '重开终端，按记录里的命令启动 Hermes。',
        '让 Hermes 描述工作区，但不要读取敏感文件。',
        '再发一条低风险问题，确认回答仍然引用当前环境。',
        '关闭会话后重新打开，确认启动流程可以复现。',
      ],
      measure: [
        '从打开终端到得到第一个有用回答需要多久。',
        '还有多少手动步骤没有写进记录。',
        '另一个人能否看懂模型端点和隐私边界。',
      ],
    },
  },
  'bootcamp/day-2-memory': {
    en: {
      visualAlt: 'Diagram of Hermes Agent memory rules and restart checks',
      fieldNotes: [
        'Memory is most valuable when it is boring and explicit. Store stable preferences such as output format, approval rules, recurring projects, and vocabulary. Do not store every clever instruction from a single session, because short-lived context becomes stale faster than it becomes useful.',
        'A good Hermes profile has three layers. The first layer describes the user and the work. The second layer describes how answers should look. The third layer lists actions that require approval. Keeping these layers separate prevents a style preference from hiding an operational rule.',
        'The restart test matters because it exposes false confidence. If Hermes behaves well only while the current chat is warm, you do not have a memory system yet. You have a long prompt. A real memory setup survives restart and remains easy to inspect.',
      ],
      decisions: [
        'Which facts are durable enough to remember?',
        'Which facts should expire at the end of the current task?',
        'Who is allowed to promote a conversation detail into memory?',
        'How often will you review and delete stale memory entries?',
      ],
      reviewDrill: [
        'Teach Hermes one stable preference and one temporary task detail.',
        'Ask it to explain which item should be remembered and which should not.',
        'Restart the session and check whether only the stable preference remains.',
        'Edit the memory note manually so the boundary is visible.',
      ],
      measure: [
        'Repeated background questions removed per week.',
        'Number of stale or vague memory entries after review.',
        'Whether approval rules are stated as rules, not implied habits.',
      ],
    },
    zh: {
      visualAlt: 'Hermes Agent 第 2 天记忆规则和重启测试示意图',
      fieldNotes: [
        '记忆最有价值的时候，往往是它足够朴素、足够明确。应该保存的是稳定偏好，例如输出格式、审批规则、长期项目和常用术语。不要把一次会话里的每个聪明指令都存进去，因为短期上下文过期得很快。',
        '一份好的 Hermes profile 可以分三层：第一层说明用户和工作，第二层说明回答应该长什么样，第三层列出必须审批的动作。把这三层分开，可以避免一个风格偏好遮住真正的操作规则。',
        '重启测试很关键，因为它会暴露虚假的稳定性。如果 Hermes 只在当前会话还热着的时候表现好，那还不是记忆系统，只是很长的 prompt。真正可用的记忆应该能跨重启，并且能被你检查和删除。',
      ],
      decisions: [
        '哪些事实足够稳定，值得长期记住？',
        '哪些信息只属于当前任务，结束后就该丢弃？',
        '谁可以把会话细节提升为长期记忆？',
        '多久复查一次，删除过期或模糊的记忆？',
      ],
      reviewDrill: [
        '教 Hermes 一个稳定偏好和一个临时任务细节。',
        '让它解释哪个应该记住，哪个不应该记住。',
        '重启会话，检查是否只保留稳定偏好。',
        '手动整理记忆记录，让边界清晰可见。',
      ],
      measure: [
        '每周减少了多少重复背景问题。',
        '复查后还剩多少过期或模糊记忆。',
        '审批规则是否以规则形式写出，而不是靠习惯暗示。',
      ],
    },
  },
  'bootcamp/day-3-integration': {
    en: {
      visualAlt: 'Diagram of a safe Hermes Agent messaging integration',
      fieldNotes: [
        'A chat integration should begin as a narrow gateway. It is tempting to make every message executable, but the first version should recognize only a few intents: summarize, draft, search, queue, and ask for approval. Narrow intent mapping makes the system easier to explain to teammates.',
        'The security model changes when Hermes leaves the terminal. Chat tools are convenient, public channels are noisy, and mobile keyboards make accidental commands more likely. Write a visible command policy before inviting other people into the channel.',
        'Logging is part of the user experience. When a teammate asks why Hermes replied a certain way, you need the incoming message, mapped intent, model response, and approval state. Without that trail, the bot feels magical until the first failure.',
      ],
      decisions: [
        'Which channel is the source of truth for requests?',
        'Which intents are allowed without approval?',
        'Which phrases or buttons confirm external actions?',
        'Where do message logs live and who can inspect them?',
      ],
      reviewDrill: [
        'Send a read-only request from a phone.',
        'Send an unknown command and confirm Hermes refuses gracefully.',
        'Send an approval-required action and confirm it queues instead of executing.',
        'Inspect the log and verify the intent mapping is visible.',
      ],
      measure: [
        'Percentage of requests that map to known intents.',
        'Number of rejected or approval-required commands.',
        'Average time from chat request to useful response.',
      ],
    },
    zh: {
      visualAlt: 'Hermes Agent 第 3 天安全消息集成示意图',
      fieldNotes: [
        '聊天集成一开始应该是一个窄入口。很容易想把每条消息都变成可执行命令，但第一版只需要识别几个意图：总结、起草、搜索、排队和申请审批。意图越窄，越容易向团队解释。',
        'Hermes 离开终端之后，安全模型就变了。聊天工具很方便，公共频道很嘈杂，手机输入也更容易误触。把其他人拉进频道之前，先写出可见的命令策略。',
        '日志本身就是用户体验的一部分。当同事问 Hermes 为什么这样回复时，你需要看到原始消息、识别出的意图、模型回复和审批状态。没有这条链路，机器人会在第一次失败前显得很神奇。',
      ],
      decisions: [
        '哪个消息渠道是请求入口？',
        '哪些意图不需要审批就可以执行？',
        '哪些短语或按钮代表确认外部动作？',
        '消息日志存在哪里，谁能查看？',
      ],
      reviewDrill: [
        '从手机发送一条只读请求。',
        '发送未知命令，确认 Hermes 会礼貌拒绝。',
        '发送需要审批的动作，确认它进入队列而不是直接执行。',
        '查看日志，确认意图映射清楚可追踪。',
      ],
      measure: [
        '有多少请求能映射到已知意图。',
        '被拒绝或需要审批的命令数量。',
        '从聊天请求到可用回复的平均时间。',
      ],
    },
  },
  'bootcamp/day-4-data': {
    en: {
      visualAlt: 'Diagram of the Hermes Agent data processing workspace',
      fieldNotes: [
        'Data work is where agents become useful and dangerous at the same time. A fluent summary can hide missing rows, changed units, or invented fields. The antidote is a workspace that preserves raw input, declares the output schema, and keeps review artifacts next to the result.',
        'Do not start with the largest file. Pick a representative sample that includes normal rows, missing values, odd formatting, and at least one edge case. A sample run lets you fix the prompt, schema, and validation rules before the full batch creates noise.',
        'Hermes should explain uncertainty as data, not as an apology. Add fields such as confidence, reason, and needs_review when the transformation involves judgment. That turns ambiguity into something you can sort, filter, and audit.',
      ],
      decisions: [
        'What is the immutable raw input location?',
        'Which fields are allowed in the output schema?',
        'What validation should run before a result is trusted?',
        'Which rows require human review before downstream use?',
      ],
      reviewDrill: [
        'Run the transformation on five rows with known expected output.',
        'Compare row counts, required fields, and suspicious values.',
        'Ask Hermes to explain only the uncertain rows.',
        'Save raw input, output, validation notes, and prompt version together.',
      ],
      measure: [
        'Row count difference between input and output.',
        'Number of records flagged for review.',
        'Time saved after validation, not before validation.',
      ],
    },
    zh: {
      visualAlt: 'Hermes Agent 第 4 天数据处理工作区示意图',
      fieldNotes: [
        '数据处理是 Agent 同时变得有用和危险的地方。一个流畅总结可能隐藏漏行、单位变化或凭空补字段。解法是建立工作区：原始输入不可变，输出 schema 先声明，复查记录和结果放在一起。',
        '不要一开始就处理最大文件。先选一个代表性样本，里面要有正常行、缺失值、奇怪格式和至少一个边界情况。样本运行可以在全量处理前修正 prompt、schema 和验证规则。',
        'Hermes 应该把不确定性解释成数据，而不是一句道歉。只要转换里有判断，就加入 confidence、reason、needs_review 这样的字段。这样模糊点就能被排序、筛选和审计。',
      ],
      decisions: [
        '不可修改的原始输入放在哪里？',
        '输出 schema 允许哪些字段？',
        '结果可信前必须跑哪些验证？',
        '哪些记录进入下游前必须人工复查？',
      ],
      reviewDrill: [
        '用 5 行已知答案的小样本跑一次转换。',
        '对比行数、必填字段和可疑值。',
        '让 Hermes 只解释不确定的记录。',
        '把原始输入、输出、验证记录和 prompt 版本放在一起。',
      ],
      measure: [
        '输入和输出的行数差异。',
        '被标记为需要复查的记录数。',
        '验证之后真正节省的时间，而不是验证之前的速度。',
      ],
    },
  },
  'bootcamp/day-5-skills': {
    en: {
      visualAlt: 'Diagram of Hermes Agent skills, tool calling, and MCP permissions',
      fieldNotes: [
        'A skill is not just a clever prompt. In a reliable Hermes workflow, a skill is a small contract: what input it accepts, what permission it needs, what output it returns, and what it must never do. The contract is what makes tool use reviewable.',
        'Install read-only skills before write-capable skills. Search, summarize, inspect repository, fetch issue, and read calendar are good early choices because the worst failure is usually noise. Sending messages, changing files, creating tickets, or spending money should arrive later with approval gates.',
        'MCP servers are powerful because they standardize tool access, but they also widen the boundary of the assistant. Keep a short inventory of every server, token, permission scope, and owner. If nobody owns a tool, Hermes should not depend on it for production work.',
      ],
      decisions: [
        'Which skills are read-only and safe for daily use?',
        'Which tools can mutate data or contact people?',
        'Where are tool call logs stored?',
        'Who owns each MCP server or external integration?',
      ],
      reviewDrill: [
        'Run one read-only skill and inspect the input/output contract.',
        'Trigger a permission-denied case and confirm the error is clear.',
        'Add one approval-required action but keep it disabled by default.',
        'Review the tool inventory and remove anything without an owner.',
      ],
      measure: [
        'Number of useful repeated tasks covered by skills.',
        'Number of tools with explicit permission scopes.',
        'Time from failed tool call to understandable diagnosis.',
      ],
    },
    zh: {
      visualAlt: 'Hermes Agent 第 5 天 Skills、Tool Calling 和 MCP 权限示意图',
      fieldNotes: [
        'Skill 不只是一个聪明 prompt。在可靠的 Hermes 工作流里，skill 是一个小契约：接受什么输入，需要什么权限，返回什么输出，以及绝对不能做什么。这个契约让工具调用变得可复查。',
        '先安装只读 skill，再安装可写 skill。搜索、总结、检查仓库、获取 issue、读取日历都适合早期使用，因为最坏结果通常只是噪音。发送消息、改文件、建工单、花钱这类动作应该后置，并加审批闸门。',
        'MCP server 强大，是因为它把工具访问标准化；但它也扩大了助理的边界。为每个 server、token、权限范围和 owner 建一份清单。如果一个工具没人负责，Hermes 就不应该在生产流程里依赖它。',
      ],
      decisions: [
        '哪些 skill 是只读的，可以日常使用？',
        '哪些工具会修改数据或联系外部人员？',
        '工具调用日志保存在哪里？',
        '每个 MCP server 或外部集成由谁负责？',
      ],
      reviewDrill: [
        '运行一个只读 skill，检查输入和输出契约。',
        '触发一次权限拒绝，确认错误信息清楚。',
        '加入一个需要审批的动作，但默认保持关闭。',
        '复查工具清单，移除没有 owner 的工具。',
      ],
      measure: [
        '有多少重复任务已经被 skill 覆盖。',
        '有多少工具写清了权限范围。',
        '从工具调用失败到定位原因需要多久。',
      ],
    },
  },
  'bootcamp/day-6-automation': {
    en: {
      visualAlt: 'Diagram of a Hermes Agent scheduled workflow with retries and logs',
      fieldNotes: [
        'Automation should make the second run cheaper than the first. If every scheduled job requires manual cleanup, it has not become automation; it has become a calendar reminder with extra steps. Start with workflows that are frequent, low-risk, and easy to review.',
        'Separate collection, reasoning, and delivery. Collection writes a raw artifact. Reasoning reads that artifact and creates a summary. Delivery sends or stores the final output. This separation lets you retry a failed delivery without collecting different data or generating a different answer.',
        'Every scheduled workflow needs a boring failure mode. The log should say when it ran, what input window it used, where artifacts were written, how long it took, and whether delivery succeeded. The goal is not zero failures; the goal is failures that are obvious.',
      ],
      decisions: [
        'What trigger starts the workflow?',
        'Where is the raw input artifact stored?',
        'Which steps are safe to retry automatically?',
        'Who receives the output and who owns failures?',
      ],
      reviewDrill: [
        'Run the workflow manually with a narrow input window.',
        'Force a delivery failure and confirm no duplicate external message is sent.',
        'Rerun from the saved artifact instead of collecting fresh data.',
        'Read the log and confirm a teammate could debug it.',
      ],
      measure: [
        'Manual minutes saved after reviewing the output.',
        'Number of successful reruns from saved artifacts.',
        'Failure rate and average time to understand the failure.',
      ],
    },
    zh: {
      visualAlt: 'Hermes Agent 第 6 天带重试和日志的定时工作流示意图',
      fieldNotes: [
        '自动化应该让第二次运行比第一次更便宜。如果每个定时任务都需要手动收拾，它还不是自动化，只是带了更多步骤的日历提醒。先选择高频、低风险、容易复查的流程。',
        '采集、推理和投递要分开。采集步骤写入原始产物，推理步骤读取该产物并生成摘要，投递步骤发送或保存最终输出。这样投递失败时可以重试，不会重新采集不同数据，也不会生成另一版答案。',
        '每个定时工作流都需要无聊的失败模式。日志应该说明运行时间、输入窗口、产物路径、耗时和投递状态。目标不是永不失败，而是失败时一眼能看懂。',
      ],
      decisions: [
        '什么触发器启动工作流？',
        '原始输入产物保存在哪里？',
        '哪些步骤可以自动重试？',
        '谁接收结果，谁负责失败处理？',
      ],
      reviewDrill: [
        '用很窄的输入窗口手动跑一次工作流。',
        '故意制造投递失败，确认不会重复发送外部消息。',
        '从已保存产物重跑，而不是重新采集数据。',
        '阅读日志，确认同事也能据此排查。',
      ],
      measure: [
        '复查输出后真正节省的人工分钟数。',
        '从已保存产物成功重跑的次数。',
        '失败率，以及理解失败原因的平均时间。',
      ],
    },
  },
  'bootcamp/day-7-multi-agent': {
    en: {
      visualAlt: 'Diagram of Hermes Agent multi-agent handoffs and final synthesis',
      fieldNotes: [
        'Multi-agent work only helps when the split is real. If two workers read the same sources, answer the same question, and produce incompatible formats, the host agent has created more coordination work. Split by responsibility: research, draft, test, review, or operate.',
        'The host remains accountable for the final result. Sub-agents can search, summarize, write, and verify, but they should not publish or execute high-impact changes directly. The final synthesis step should compare conflicts, name assumptions, and ask for human approval when needed.',
        'A good handoff contract is short. Give each worker the input, the output shape, the constraints, and the deadline. Require assumptions and open questions. This makes the outputs comparable and prevents the final answer from becoming a pasted stack of unrelated notes.',
      ],
      decisions: [
        'Which parts of the task are genuinely independent?',
        'What output format must every sub-agent use?',
        'Which agent owns conflict resolution?',
        'What actions remain human-only at the end?',
      ],
      reviewDrill: [
        'Create a three-agent plan for one real but low-risk task.',
        'Give each agent a different responsibility and the same output shape.',
        'Compare the outputs for conflicts and missing assumptions.',
        'Write a final synthesis that chooses, rejects, or merges each recommendation.',
      ],
      measure: [
        'Wall-clock time saved without lowering review quality.',
        'Number of duplicated findings across sub-agents.',
        'Number of conflicts surfaced before final approval.',
      ],
    },
    zh: {
      visualAlt: 'Hermes Agent 第 7 天多 Agent 交接和最终综合示意图',
      fieldNotes: [
        '多 Agent 只有在任务真的能拆开时才有帮助。如果两个 worker 读同样材料、回答同样问题、输出格式还不一致，Host 反而制造了更多协调成本。应该按职责拆分：研究、起草、测试、复核或执行。',
        'Host 仍然对最终结果负责。子 Agent 可以搜索、总结、写作和验证，但不应该直接发布或执行高影响动作。最终综合步骤要比较冲突、列出假设，并在需要时请求人工确认。',
        '好的交接契约应该很短。给每个 worker 输入、输出格式、约束和截止时间，并要求写出假设和未决问题。这样输出才可比较，最终答案也不会变成一堆互不相关笔记的拼贴。',
      ],
      decisions: [
        '任务中哪些部分真的相互独立？',
        '所有子 Agent 必须使用什么输出格式？',
        '哪个 Agent 负责解决冲突？',
        '最后哪些动作仍然只能由人执行？',
      ],
      reviewDrill: [
        '为一个真实但低风险的任务设计三 Agent 计划。',
        '给每个 Agent 不同职责，但要求相同输出形状。',
        '对比输出里的冲突和缺失假设。',
        '写最终综合，明确采纳、拒绝或合并每条建议。',
      ],
      measure: [
        '在不降低复查质量的前提下节省的总耗时。',
        '子 Agent 之间重复发现的数量。',
        '最终批准前暴露出的冲突数量。',
      ],
    },
  },
};

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderBootcampSvg(config) {
  const stepWidth = 170;
  const stepGap = 18;
  const startX = 48;
  const stepY = 245;
  const stepLines = config.steps
    .map((step, index) => {
      const x = startX + index * (stepWidth + stepGap);
      const arrow =
        index < config.steps.length - 1
          ? `<path d="M${x + stepWidth + 4} ${stepY + 42}h${stepGap - 8}" stroke="#d97706" stroke-width="3" stroke-linecap="round"/><path d="M${x + stepWidth + stepGap - 10} ${stepY + 36}l8 6-8 6" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
          : '';
      return [
        '<g>',
        `  <rect x="${x}" y="${stepY}" width="${stepWidth}" height="86" rx="10" fill="#ffffff" stroke="#e5e7eb"/>`,
        `  <circle cx="${x + 30}" cy="${stepY + 43}" r="17" fill="#fef3c7" stroke="#f59e0b"/>`,
        `  <text x="${x + 30}" y="${stepY + 49}" text-anchor="middle" font-size="15" font-weight="700" fill="#92400e">${index + 1}</text>`,
        `  <text x="${x + 58}" y="${stepY + 49}" font-size="15" font-weight="700" fill="#111827">${xmlEscape(step)}</text>`,
        '</g>',
        ...(arrow ? [arrow] : []),
      ].join('\n');
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="420" viewBox="0 0 860 420" role="img" aria-labelledby="title desc">
  <title id="title">${xmlEscape(config.title)}</title>
  <desc id="desc">${xmlEscape(config.subtitle)}</desc>
  <rect width="860" height="420" rx="24" fill="#f8fafc"/>
  <rect x="24" y="24" width="812" height="372" rx="22" fill="#fff" stroke="#e5e7eb"/>
  <path d="M24 116h812" stroke="#f1f5f9"/>
  <circle cx="58" cy="70" r="7" fill="#ef4444"/>
  <circle cx="82" cy="70" r="7" fill="#f59e0b"/>
  <circle cx="106" cy="70" r="7" fill="#10b981"/>
  <text x="136" y="76" font-size="15" fill="#64748b" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">hermesagent.sbs bootcamp</text>
  <text x="48" y="168" font-size="34" font-weight="800" fill="#111827">${xmlEscape(config.title)}</text>
  <text x="48" y="204" font-size="17" fill="#475569">${xmlEscape(config.subtitle)}</text>
  <rect x="654" y="144" width="138" height="38" rx="19" fill="#ecfdf5" stroke="#bbf7d0"/>
  <text x="723" y="169" text-anchor="middle" font-size="14" font-weight="700" fill="#047857">reviewable</text>
  ${stepLines}
</svg>
`;
}

function writeBootcampVisual(article) {
  const config = bootcampVisuals[article.filePath];
  if (!config) {
    return;
  }

  const fileName = `${path.basename(article.filePath)}.svg`;
  const outputPath = path.join(root, 'public', 'images', 'bootcamp', fileName);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, renderBootcampSvg(config), 'utf8');
}

function renderExpansion(locale, article, labels) {
  const expansion = bootcampExpansions[article.filePath]?.[locale];
  const visual = bootcampVisuals[article.filePath];
  if (!expansion) {
    return [];
  }
  const stepSummary = visual.steps.join(locale === 'zh' ? '、' : ', ');
  const artifactName = path.basename(article.filePath);
  const handoff =
    locale === 'zh'
      ? [
          `离开这一课之前，最好留下一份别人能读懂的交接产物。它不需要很长，但必须把 ${stepSummary} 串起来。只要其中任何一项只存在于聊天记录或你的记忆里，这个流程就还不够稳。`,
          '交接产物的价值在于减少下一次启动成本。明天你回来时，不应该重新问“昨天到底配置了什么”。你应该打开这份记录，直接知道输入、边界、命令、日志和待复查事项。',
          '把这份产物当成后续课程的输入。第 2 天会读取第 1 天的权限边界，第 6 天会依赖前面几天的工具和数据契约，第 7 天的多 Agent 编排也需要这些小产物作为交接材料。',
        ]
      : [
          `Before leaving this lesson, keep a handoff artifact that another teammate could understand without reading the chat transcript. It does not need to be long, but it must connect ${stepSummary}. If any part exists only in your memory, the workflow is still fragile.`,
          'The value of the artifact is lower restart cost. When you return tomorrow, you should not have to ask what was configured yesterday. You should open the note and see the inputs, boundaries, commands, logs, and review items immediately.',
          'Treat the artifact as the input to later lessons. Day 2 reads the permission boundary from day 1, day 6 depends on the tool and data contracts from earlier days, and day 7 uses these small artifacts as handoff material for specialist agents.',
        ];
  const upgrade =
    locale === 'zh'
      ? [
        '不要急着把本课流程做成平台功能。先让它以一份 Markdown、一个 JSON、一个日志文件或一个简单脚本的形式稳定运行。低技术形态更容易检查，也更容易在出错时回滚。',
        '当这个流程连续运行三次都能产生可复查结果，再考虑把它抽成模板、skill 或自动化任务。这个顺序很重要：先证明工作流值得复用，再把它产品化。',
        '如果你在这一步发现说明写不清，通常不是文档问题，而是流程边界还没想清楚。回到决策清单，把输入、权限、输出和 owner 写到足够具体，再继续下一天。',
        '真正适合上线的流程，应该让新成员也能在十分钟内看懂：它为什么存在、从哪里拿输入、会碰哪些权限、失败后找谁、结果如何被复查。只要这五个问题还有一个答不清，就先把流程留在手动或半自动阶段。',
        '最后再做一次反向检查：如果 Hermes 给出错误建议，你能否在不依赖模型解释的情况下，从日志、产物和审批记录里还原问题。能还原，才说明流程开始具备运营价值。',
      ]
      : [
          'Do not rush to turn this lesson into platform code. First make it stable as a Markdown note, JSON file, log entry, or small script. A low-tech artifact is easier to inspect, easier to share, and easier to roll back when the workflow is still young.',
          'After the workflow produces reviewable results three times in a row, promote it into a template, skill, or scheduled job. The order matters: prove the workflow deserves reuse before productizing the mechanism around it.',
          'If the artifact is hard to write, the problem is usually not documentation. It usually means the boundary is still fuzzy. Return to the decision list and make the input, permission, output, and owner concrete before moving to the next day.',
        ];

  return [
    `## ${labels.fieldNotes}`,
    '',
    ...lines(expansion.fieldNotes),
    `### ${labels.handoffArtifact}`,
    '',
    ...lines(handoff),
    ...codeBlock(
      'yaml',
      locale === 'zh'
        ? `
lesson: "${artifactName}"
owner: "你的名字或团队"
inputs: ["本课用到的文件、消息或 API"]
permissions: ["只读", "需要审批的写操作"]
outputs: ["保存的笔记、日志、配置或结果文件"]
review: ["下一天开始前必须检查的事项"]
        `
        : `
lesson: "${artifactName}"
owner: "your name or team"
inputs: ["files, messages, or APIs used in this lesson"]
permissions: ["read-only", "approval-required writes"]
outputs: ["saved note, log, config, or result file"]
review: ["items to check before the next lesson"]
        `
    ),
    `### ${labels.upgradePath}`,
    '',
    ...lines(upgrade),
    `### ${labels.decisions}`,
    '',
    ...bullets(expansion.decisions),
    '',
    `### ${labels.reviewDrill}`,
    '',
    ...numbered(expansion.reviewDrill),
    '',
    `### ${labels.measure}`,
    '',
    ...bullets(expansion.measure),
    '',
  ];
}

function renderArticle(locale, article) {
  const c = article[locale];
  const labels =
    locale === 'zh'
      ? {
          promise: '今天你会做成什么',
          why: '为什么这一步重要',
          workflow: '实操流程',
          commands: '可直接复制的命令或配置',
          checks: '验收清单',
          mistakes: '常见坑',
          fieldNotes: '落地细节',
          handoffArtifact: '交接产物',
          upgradePath: '升级路径',
          decisions: '需要写下来的决策',
          reviewDrill: '复查演练',
          measure: '衡量指标',
          next: '下一步',
          updated: '*最后更新：2026 年 4 月 18 日 · Hermes Agent v0.8 内容路线*',
        }
      : {
          promise: 'What you will have working today',
          why: 'Why this step matters',
          workflow: 'Hands-on workflow',
          commands: 'Copy-ready commands or config',
          checks: 'Acceptance checklist',
          mistakes: 'Common failure modes',
          fieldNotes: 'Implementation notes',
          handoffArtifact: 'Handoff artifact',
          upgradePath: 'Upgrade path',
          decisions: 'Decisions to write down',
          reviewDrill: 'Review drill',
          measure: 'What to measure',
          next: 'Next step',
          updated: '*Last updated: April 18, 2026 · Hermes Agent v0.8 content track*',
        };
  const visual = bootcampVisuals[article.filePath];
  const expansion = bootcampExpansions[article.filePath]?.[locale];

  return [
    `## ${c.introTitle}`,
    '',
    ...lines(c.intro),
    ...(visual && expansion
      ? [`![${expansion.visualAlt}](/images/bootcamp/${path.basename(article.filePath)}.svg)`, '']
      : []),
    `## ${labels.promise}`,
    '',
    ...bullets(c.promise),
    '',
    `## ${labels.why}`,
    '',
    ...lines(c.why),
    `## ${labels.workflow}`,
    '',
    ...numbered(c.workflow),
    '',
    ...(c.code ? [`## ${labels.commands}`, '', ...codeBlock(c.code.lang, c.code.content)] : []),
    ...renderExpansion(locale, article, labels),
    `## ${labels.checks}`,
    '',
    ...bullets(c.checks),
    '',
    `## ${labels.mistakes}`,
    '',
    ...bullets(c.mistakes),
    '',
    `## ${labels.next}`,
    '',
    ...bullets(c.next),
    '',
    '---',
    '',
    labels.updated,
    '',
  ].join('\n');
}

function writeArticle(article) {
  writeBootcampVisual(article);

  for (const locale of ['en', 'zh']) {
    const filePath = path.join(root, 'content', article.type, locale, `${article.filePath}.mdx`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${frontmatter(article.meta)}${renderArticle(locale, article)}`, 'utf8');
  }
}

const articles = [
  {
    type: 'tutorials',
    filePath: 'bootcamp/day-1-setup',
    meta: {
      title: 'Day 1: Local Setup & Privacy (Ollama + Docker)',
      titleZh: 'Day 1: 唤醒助理 - 极简安装与第一声问候',
      slug: 'day-1-setup',
      description:
        'Install Hermes Agent with the least moving parts, choose a private local-first setup, and complete the first useful conversation.',
      descriptionZh:
        '用最少的配置跑起 Hermes Agent，理解本地优先的隐私边界，并完成第一次真正有用的对话。',
      category: 'bootcamp',
      tags: ['setup', 'privacy', 'ollama', 'docker', 'beginner'],
      difficulty: 'beginner',
      readingTime: 12,
      series: '7-day-bootcamp',
      seriesOrder: 1,
      featured: true,
    },
    en: {
      introTitle: 'Start with a working assistant, not a perfect lab',
      intro: [
        'The first day is about momentum. A new AI agent project becomes real only when you can talk to it, give it a tiny job, and see it answer from your own environment.',
        'This bootcamp uses a local-first mental model: keep your workspace under your control, understand which model endpoint receives prompts, and avoid granting broad file access before you need it.',
      ],
      promise: [
        'A Hermes Agent workspace that starts from the terminal.',
        'A clear decision between local model, hosted API, or hybrid mode.',
        'A first conversation where Hermes introduces itself and explains what it can safely do.',
      ],
      why: [
        'Most failed installs are not caused by one hard command. They fail because users mix model setup, shell setup, permissions, and expectations into one foggy step. Separate those pieces and the whole system becomes easier to trust.',
        'Privacy also starts here. Local execution does not automatically mean private if you send prompts to a hosted model, and hosted models are not automatically bad if you know what data leaves your machine.',
      ],
      workflow: [
        'Create a clean project folder and confirm Node, Git, and your package manager work before touching Hermes.',
        'Choose your model path: Ollama for local experimentation, a hosted OpenAI-compatible endpoint for speed, or a hybrid setup for day-to-day work.',
        'Install dependencies and start Hermes with the smallest set of environment variables.',
        'Ask Hermes to describe the current workspace, then ask it to make one harmless local observation.',
        'Write down which directories and external APIs Hermes is allowed to use during the rest of the bootcamp.',
      ],
      code: {
        lang: 'bash',
        content: `
node --version
git --version
npm --version

# Example local model check
ollama list

# Start with the repo command documented by your Hermes install
npm run dev
        `,
      },
      checks: [
        'You can start and stop Hermes without changing unrelated system settings.',
        'You know whether prompts are staying local or going to a remote model API.',
        'Your first prompt produces a useful answer instead of a generic model greeting.',
      ],
      mistakes: [
        'Installing every optional integration on day one.',
        'Granting whole-disk file access before understanding the permission model.',
        'Debugging model quality before confirming the shell and environment are stable.',
      ],
      next: [
        '**[Day 2: Context & Memory](/en/tutorials/bootcamp/day-2-memory)** - teach Hermes who it is working for.',
        '**[Privacy Policy](/en/privacy)** - review how this learning site handles analytics and cookies.',
      ],
    },
    zh: {
      introTitle: '先让助理跑起来，不要第一天就搭实验室',
      intro: [
        '第一天的目标不是把所有高级功能都配好，而是拿到一个明确的 Aha Moment：你能在自己的环境里和 Hermes Agent 对话，并让它完成一个很小但真实的任务。',
        '这一课采用“本地优先”的思路：工作区留在你手里，模型请求去向说清楚，文件权限先收窄，等真正需要时再打开。',
      ],
      promise: [
        '一个可以从终端启动的 Hermes Agent 工作区。',
        '明确知道自己使用的是本地模型、云端 API，还是混合模式。',
        '完成第一次对话，让 Hermes 说明自己能做什么、不能碰什么。',
      ],
      why: [
        '很多安装失败并不是因为某一条命令太难，而是把模型、Shell、权限和预期混在一起。把这些层拆开，系统就会变得可调试、可解释、可信任。',
        '隐私边界也从这里开始。本地运行不等于所有数据都留在本地，云端模型也不一定不可用；关键是你知道哪些内容会离开电脑。',
      ],
      workflow: [
        '新建干净目录，先确认 Node、Git、包管理器可用。',
        '选择模型路径：Ollama 适合本地实验，OpenAI 兼容 API 适合快速起步，混合模式适合日常使用。',
        '安装依赖，只配置最少必要环境变量。',
        '启动 Hermes，让它描述当前工作区，再让它做一个无风险的本地观察。',
        '写下接下来 7 天里 Hermes 可以访问的目录和 API 边界。',
      ],
      code: {
        lang: 'bash',
        content: `
node --version
git --version
npm --version

# 检查本地模型
ollama list

# 按你的 Hermes 安装方式启动
npm run dev
        `,
      },
      checks: [
        '你可以稳定启动和停止 Hermes，不需要反复改系统设置。',
        '你知道提示词会留在本地还是发送到远程模型 API。',
        '第一次对话能得到有上下文的回答，而不是泛泛的模型寒暄。',
      ],
      mistakes: [
        '第一天就安装所有可选集成。',
        '还没理解权限模型就开放整个磁盘。',
        'Shell 环境还没稳定，就开始纠结模型“聪不聪明”。',
      ],
      next: [
        '**[Day 2：赋予记忆](/zh/tutorials/bootcamp/day-2-memory)** - 让 Hermes 真正知道它在为谁工作。',
        '**[隐私政策](/zh/privacy)** - 了解本站如何处理分析数据和 Cookie。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'bootcamp/day-2-memory',
    meta: {
      title: 'Day 2: Context & Memory (System Prompts)',
      titleZh: 'Day 2: 赋予记忆 - 让它真正懂你',
      slug: 'day-2-memory',
      description:
        'Design a practical system prompt and memory contract so Hermes can remember preferences without becoming unpredictable.',
      descriptionZh:
        '设计可维护的 System Prompt 与记忆契约，让 Hermes 记住偏好，同时保持边界清晰。',
      category: 'bootcamp',
      tags: ['memory', 'system-prompt', 'context', 'beginner'],
      difficulty: 'beginner',
      readingTime: 13,
      series: '7-day-bootcamp',
      seriesOrder: 2,
      featured: true,
    },
    en: {
      introTitle: 'Memory is a contract, not a magic drawer',
      intro: [
        'A useful assistant should not ask the same background questions every morning. It should remember your role, preferred output style, recurring projects, and the boundaries that should not be crossed.',
        'The trick is to make memory explicit. Hermes should store stable facts and reviewed preferences, not every raw sentence from every conversation.',
      ],
      promise: [
        'A short assistant profile that defines role, tone, tools, and approval rules.',
        'A memory policy that separates durable facts from temporary task context.',
        'A restart test where Hermes can recover your preferred working style.',
      ],
      why: [
        'The system prompt is the operating manual for your worker. If it is vague, the model improvises. If it is too long, important instructions disappear into noise.',
        'Good memory design also improves safety. A remembered preference such as “ask before deleting files” is more valuable than a long transcript full of stale details.',
      ],
      workflow: [
        'Write a one-page profile: who you are, what you build, how you like answers, and which actions require approval.',
        'Create a memory rule: save stable preferences only after the user confirms them.',
        'Run a short conversation where you teach Hermes your role and preferred format.',
        'Restart the session and ask Hermes to summarize what it remembers.',
        'Remove anything that is too personal, too vague, or not useful for future work.',
      ],
      code: {
        lang: 'md',
        content: `
Role: You are my AI operations assistant.
Style: Be concise, specific, and action-oriented.
Default output: checklist first, explanation second.
Approval: Ask before deleting files, spending money, or contacting people.
Memory: Store stable preferences only after I say "remember this".
        `,
      },
      checks: [
        'Hermes can describe your role and preferred response style after restart.',
        'Temporary task details do not get promoted into long-term memory.',
        'Approval boundaries are written as rules, not implied by vibes.',
      ],
      mistakes: [
        'Putting every preference into one giant prompt.',
        'Letting raw chat logs become memory without review.',
        'Using memory to hide unclear instructions instead of clarifying them.',
      ],
      next: [
        '**[Day 3: Team Integration](/en/tutorials/bootcamp/day-3-integration)** - bring Hermes into your message channels.',
        '**[Best Skills Directory](/en/guides/resources/best-skills)** - choose safe extensions after the bootcamp.',
      ],
    },
    zh: {
      introTitle: '记忆不是神奇抽屉，而是一份契约',
      intro: [
        '一个真正有用的助理，不应该每天早上都问你是谁、喜欢什么格式、正在做什么项目。它应该记住稳定偏好，也应该知道哪些事情不能擅自做。',
        '关键是把记忆显式化。Hermes 应该保存经过确认的长期事实，而不是把每一句聊天原文都塞进记忆里。',
      ],
      promise: [
        '一份短小清晰的助理画像，定义角色、语气、工具和审批边界。',
        '一套记忆规则，区分长期事实和临时任务上下文。',
        '一次重启测试：关闭再打开后，Hermes 仍能恢复你的工作偏好。',
      ],
      why: [
        'System Prompt 是你的 AI 员工说明书。写得太虚，模型会自由发挥；写得太长，关键规则又会被噪音淹没。',
        '好的记忆设计也会提升安全性。比如“删除文件前必须询问”这种稳定偏好，远比一大段过期聊天记录更有价值。',
      ],
      workflow: [
        '写一页个人工作说明：你是谁、做什么、喜欢什么输出、哪些操作必须审批。',
        '建立记忆规则：只有当你明确说“记住这一点”时，才保存长期偏好。',
        '用一段短对话教 Hermes 你的角色和输出格式。',
        '重启会话，让 Hermes 复述它记住了什么。',
        '删除太隐私、太模糊或未来用不上的记忆。',
      ],
      code: {
        lang: 'md',
        content: `
角色：你是我的 AI 运营助理。
风格：简洁、具体、先给可执行步骤。
默认输出：先清单，后解释。
审批：删除文件、花钱、对外联系前必须询问。
记忆：只有我说“记住这个”时才保存长期偏好。
        `,
      },
      checks: [
        '重启后 Hermes 能说出你的角色和输出偏好。',
        '临时任务细节不会自动进入长期记忆。',
        '审批边界是写清楚的规则，而不是靠默契。',
      ],
      mistakes: [
        '把所有偏好堆进一个巨长 Prompt。',
        '未经审核就把原始聊天记录变成记忆。',
        '用“记忆”掩盖不清楚的需求，而不是把需求问清楚。',
      ],
      next: [
        '**[Day 3：触手可及](/zh/tutorials/bootcamp/day-3-integration)** - 把 Hermes 接进消息渠道。',
        '**[最佳 Skills 目录](/zh/guides/resources/best-skills)** - 实战营后继续选择安全扩展。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'bootcamp/day-3-integration',
    meta: {
      title: 'Day 3: Team Integration (Slack & Discord)',
      titleZh: 'Day 3: 触手可及 - 把它装进你的手机',
      slug: 'day-3-integration',
      description:
        'Connect Hermes to a messaging channel, define safe command boundaries, and make the assistant available away from the terminal.',
      descriptionZh:
        '把 Hermes 接入消息渠道，定义安全命令边界，让助理离开终端也能工作。',
      category: 'bootcamp',
      tags: ['telegram', 'slack', 'discord', 'messaging', 'beginner'],
      difficulty: 'beginner',
      readingTime: 12,
      series: '7-day-bootcamp',
      seriesOrder: 3,
      featured: true,
    },
    en: {
      introTitle: 'An assistant is useful when it lives where requests happen',
      intro: [
        'The terminal is great for setup, but most real requests arrive in chat: a quick question from your phone, a teammate dropping context into Slack, or a reminder you want handled later.',
        'Today you connect Hermes to a message channel while keeping the first integration intentionally narrow. Read-only and approval-based commands come first.',
      ],
      promise: [
        'A messaging channel that can send a task to Hermes.',
        'A command policy that separates safe requests from approval-required actions.',
        'A mobile test where Hermes receives a message and replies with a useful summary.',
      ],
      why: [
        'Moving from terminal to chat changes the risk model. Chat is faster and more convenient, which also means accidental commands become easier to send.',
        'The right pattern is to expose a small set of clear intents: summarize, draft, search, queue, and ask for approval before anything mutates data or talks to external people.',
      ],
      workflow: [
        'Create a bot or webhook in the channel your team already uses.',
        'Store tokens in environment variables, never inside prompts or Markdown notes.',
        'Map incoming messages to a small set of allowed intents.',
        'Test a read-only request from your phone.',
        'Add an approval phrase for actions such as send, delete, deploy, or purchase.',
      ],
      code: {
        lang: 'env',
        content: `
HERMES_CHANNEL=telegram
HERMES_BOT_TOKEN=replace-with-secret
HERMES_ALLOWED_INTENTS=summarize,draft,search,queue
HERMES_REQUIRE_APPROVAL=send,delete,deploy,purchase
        `,
      },
      checks: [
        'Secrets are stored outside the repo.',
        'Hermes rejects unknown commands instead of guessing.',
        'A phone-originated message produces a traceable response.',
      ],
      mistakes: [
        'Letting a public group chat trigger privileged actions.',
        'Treating every message as a fully trusted instruction.',
        'Skipping logs because the bot “just works” during the demo.',
      ],
      next: [
        '**[Day 4: Data Processing](/en/tutorials/bootcamp/day-4-data)** - give Hermes structured work to do.',
        '**[Automation Recipes](/en/guides/resources/automation-recipes)** - reuse the channel pattern in scheduled workflows.',
      ],
    },
    zh: {
      introTitle: '助理要住在需求发生的地方',
      intro: [
        '终端适合初始化，但真实需求往往出现在聊天里：手机上的一句提醒、群里同事丢来的上下文、临时想排队处理的任务。',
        '今天你会把 Hermes 接到消息渠道里，但第一版集成要刻意收窄。先做只读和需审批的命令，不要一上来就让它自动执行高风险动作。',
      ],
      promise: [
        '一个可以把消息转给 Hermes 的聊天渠道。',
        '一套命令策略，区分安全请求和必须审批的动作。',
        '一次手机测试：发送消息后，Hermes 能返回有用摘要。',
      ],
      why: [
        '从终端走向聊天，风险模型会变化。聊天更快，也更容易误触发命令。',
        '正确做法是暴露少量清晰意图：总结、草稿、搜索、排队；凡是修改数据、对外发送、部署或购买，都先进入审批。',
      ],
      workflow: [
        '在团队常用渠道里创建 bot 或 webhook。',
        '把 token 存进环境变量，不要写进提示词或 Markdown。',
        '把消息映射到少量允许的 intent。',
        '从手机发送一个只读请求做测试。',
        '为发送、删除、部署、购买等动作加入审批短语。',
      ],
      code: {
        lang: 'env',
        content: `
HERMES_CHANNEL=telegram
HERMES_BOT_TOKEN=replace-with-secret
HERMES_ALLOWED_INTENTS=summarize,draft,search,queue
HERMES_REQUIRE_APPROVAL=send,delete,deploy,purchase
        `,
      },
      checks: [
        '密钥没有进入仓库。',
        '未知命令会被拒绝，而不是让 Hermes 猜。',
        '手机发起的消息有可追踪的回复记录。',
      ],
      mistakes: [
        '让公开群聊直接触发高权限操作。',
        '把每条聊天消息都当成完全可信的指令。',
        '演示能跑就不记录日志。',
      ],
      next: [
        '**[Day 4：赋予双手](/zh/tutorials/bootcamp/day-4-data)** - 给 Hermes 真正的数据任务。',
        '**[自动化方案库](/zh/guides/resources/automation-recipes)** - 把消息渠道模式复用到定时工作流。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'bootcamp/day-4-data',
    meta: {
      title: 'Day 4: Data Processing (API & JSON)',
      titleZh: 'Day 4: 赋予双手 - 处理文件与数据',
      slug: 'day-4-data',
      description:
        'Let Hermes process files, JSON, and CSV data with explicit input contracts and reviewable output artifacts.',
      descriptionZh:
        '让 Hermes 处理文件、JSON 和 CSV，同时用输入契约和可复查产物控制质量。',
      category: 'bootcamp',
      tags: ['data', 'csv', 'json', 'files', 'intermediate'],
      difficulty: 'intermediate',
      readingTime: 14,
      series: '7-day-bootcamp',
      seriesOrder: 4,
      featured: true,
    },
    en: {
      introTitle: 'Useful agents turn messy inputs into reviewable artifacts',
      intro: [
        'Chat is only the beginning. The moment Hermes can inspect a file, normalize rows, call an API, and hand you back a clean artifact, it starts feeling like a worker instead of a chatbot.',
        'The rule for day four is simple: never ask an agent to “handle the data” without first defining what the input is, what output shape you expect, and how you will review it.',
      ],
      promise: [
        'A small data workspace with raw input, normalized output, and notes.',
        'A JSON contract that tells Hermes exactly what to produce.',
        'A review step where you compare the final artifact against the original input.',
      ],
      why: [
        'Data tasks fail quietly when the output format is vague. A polished paragraph can hide missing rows, changed units, or invented fields.',
        'Structured output gives you leverage. You can diff it, validate it, feed it into another tool, and ask Hermes to explain only the rows that changed.',
      ],
      workflow: [
        'Put raw files in a dedicated input folder and keep originals untouched.',
        'Define the output schema before asking Hermes to transform anything.',
        'Run the transformation on a small sample first.',
        'Validate counts, column names, and suspicious values.',
        'Save the final artifact with a timestamp and short explanation.',
      ],
      code: {
        lang: 'json',
        content: `
{
  "source": "leads.csv",
  "output": "qualified-leads.json",
  "fields": ["company", "contact", "priority", "reason"],
  "rules": ["do not invent missing emails", "mark uncertain rows"]
}
        `,
      },
      checks: [
        'Raw files remain unchanged.',
        'Output has a declared schema and can be validated.',
        'Hermes explains uncertainty instead of hiding it.',
      ],
      mistakes: [
        'Letting the agent overwrite the only copy of a file.',
        'Requesting a prose summary when you actually need structured data.',
        'Skipping sample runs and discovering format errors after a full batch.',
      ],
      next: [
        '**[Day 5: Tool Calling & MCP](/en/tutorials/bootcamp/day-5-skills)** - connect data work to external tools.',
        '**[Automation Recipes](/en/guides/resources/automation-recipes)** - reuse this pattern in repeatable workflows.',
      ],
    },
    zh: {
      introTitle: '有用的 Agent 会把脏输入变成可复查产物',
      intro: [
        '聊天只是开始。当 Hermes 能检查文件、规整表格、调用 API，并交回一份干净产物时，它才真正像一个员工，而不是聊天机器人。',
        '第四天的规则很简单：不要只说“帮我处理数据”。先定义输入是什么、期望输出长什么样、你准备如何复查。',
      ],
      promise: [
        '一个包含 raw input、normalized output 和 notes 的小型数据工作区。',
        '一份 JSON 契约，明确告诉 Hermes 要产出什么。',
        '一个复查步骤：把最终产物和原始输入逐项对照。',
      ],
      why: [
        '数据任务最怕悄悄失败。漂亮的总结可能掩盖漏行、单位变化或凭空生成的字段。',
        '结构化输出能给你杠杆：可以 diff、校验、传给下游工具，也可以只让 Hermes 解释异常行。',
      ],
      workflow: [
        '把原始文件放进独立 input 目录，保留原件不覆盖。',
        '转换前先定义输出 schema。',
        '先用小样本跑一遍。',
        '校验数量、列名和可疑值。',
        '最终产物带时间戳保存，并附一段处理说明。',
      ],
      code: {
        lang: 'json',
        content: `
{
  "source": "leads.csv",
  "output": "qualified-leads.json",
  "fields": ["company", "contact", "priority", "reason"],
  "rules": ["不要编造缺失邮箱", "不确定的行要标记"]
}
        `,
      },
      checks: [
        '原始文件没有被覆盖。',
        '输出有明确 schema，且可以被校验。',
        'Hermes 会说明不确定性，而不是把问题藏起来。',
      ],
      mistakes: [
        '让 Agent 覆盖唯一一份文件。',
        '明明需要结构化数据，却只要求一段文字总结。',
        '不跑样本，等全量处理后才发现格式错了。',
      ],
      next: [
        '**[Day 5：装备技能](/zh/tutorials/bootcamp/day-5-skills)** - 把数据任务接到外部工具。',
        '**[自动化脚本合集](/zh/guides/resources/automation-recipes)** - 把这个模式变成可复用流程。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'bootcamp/day-5-skills',
    meta: {
      title: 'Day 5: Tool Calling & MCP Integration',
      titleZh: 'Day 5: 装备技能 - 安装社区超能力',
      slug: 'day-5-skills',
      description:
        'Add practical skills and MCP-style tool contracts without turning Hermes into an uncontrolled shell.',
      descriptionZh:
        '给 Hermes 增加实用技能和 MCP 工具契约，同时避免变成失控 Shell。',
      category: 'bootcamp',
      tags: ['skills', 'mcp', 'tools', 'integrations', 'intermediate'],
      difficulty: 'intermediate',
      readingTime: 14,
      series: '7-day-bootcamp',
      seriesOrder: 5,
      featured: true,
    },
    en: {
      introTitle: 'Tools are power only when the contract is visible',
      intro: [
        'A raw model can reason, draft, and summarize. A tool-using agent can fetch a pull request, search a knowledge base, read a calendar, and prepare a deployment checklist.',
        'The difference between useful and dangerous is the contract: what the tool does, which arguments it accepts, what permission it needs, and when Hermes must stop for approval.',
      ],
      promise: [
        'A shortlist of two or three high-value skills to install first.',
        'A tool contract template for MCP or local integrations.',
        'A safe test where Hermes calls a read-only tool and explains the result.',
      ],
      why: [
        'Tool sprawl kills trust. If Hermes can call anything at any time, every answer becomes harder to audit.',
        'Start with read-only tools because they create immediate value without risking external side effects. Then add write actions behind explicit approval.',
      ],
      workflow: [
        'Pick one information tool, one formatting tool, and one workflow tool.',
        'Document each tool with inputs, outputs, permission level, and failure modes.',
        'Install or expose the tool through the narrowest interface available.',
        'Run a read-only test and inspect the arguments Hermes sent.',
        'Add approval gates before enabling write actions.',
      ],
      code: {
        lang: 'json',
        content: `
{
  "tool": "github_fetch_pr",
  "permission": "read-only",
  "inputs": ["repo_full_name", "pr_number"],
  "outputs": ["title", "status", "changed_files"],
  "approvalRequired": false
}
        `,
      },
      checks: [
        'Every installed tool has a written contract.',
        'Read-only tools work before write tools are enabled.',
        'Hermes logs tool name, arguments, and outcome.',
      ],
      mistakes: [
        'Installing a large bundle of tools without knowing which workflow needs them.',
        'Granting broad service-account permissions for one narrow task.',
        'Letting tool failures turn into confident natural-language guesses.',
      ],
      next: [
        '**[Day 6: Scheduled Workflows](/en/tutorials/bootcamp/day-6-automation)** - run useful tool workflows on a schedule.',
        '**[Top 10 Hermes Skills](/en/guides/resources/best-skills)** - pick the first skills deliberately.',
      ],
    },
    zh: {
      introTitle: '工具有用的前提，是契约看得见',
      intro: [
        '裸模型可以推理、写草稿、做总结。会调用工具的 Agent 可以拉 PR、查知识库、读日历、准备部署清单。',
        '有用和危险之间的分界线，是工具契约：它做什么、接收哪些参数、需要什么权限、什么时候必须停下来等你审批。',
      ],
      promise: [
        '一份最先安装的 2-3 个高价值技能清单。',
        '一个 MCP 或本地工具集成的契约模板。',
        '一次安全测试：Hermes 调用只读工具并解释结果。',
      ],
      why: [
        '工具泛滥会毁掉信任。如果 Hermes 任何时候都能调用任何东西，每个答案都会变得难审计。',
        '先从只读工具开始，因为它们能快速创造价值，又不会产生外部副作用。写操作放到明确审批之后。',
      ],
      workflow: [
        '选择一个信息查询工具、一个格式化工具、一个工作流工具。',
        '为每个工具记录输入、输出、权限级别和失败模式。',
        '用最窄的接口安装或暴露工具。',
        '先跑只读测试，检查 Hermes 传了哪些参数。',
        '启用写操作前增加审批门。',
      ],
      code: {
        lang: 'json',
        content: `
{
  "tool": "github_fetch_pr",
  "permission": "read-only",
  "inputs": ["repo_full_name", "pr_number"],
  "outputs": ["title", "status", "changed_files"],
  "approvalRequired": false
}
        `,
      },
      checks: [
        '每个工具都有书面契约。',
        '只读工具先跑通，再开放写工具。',
        'Hermes 会记录工具名、参数和结果。',
      ],
      mistakes: [
        '还没明确工作流，就一口气装一大包工具。',
        '为了一个窄任务给出宽泛服务账号权限。',
        '工具调用失败后，让模型用自信的自然语言糊过去。',
      ],
      next: [
        '**[Day 6：自动化引擎](/zh/tutorials/bootcamp/day-6-automation)** - 让有用工具按计划运行。',
        '**[10 个最强 Hermes 技能](/zh/guides/resources/best-skills)** - 有选择地安装第一批技能。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'bootcamp/day-6-automation',
    meta: {
      title: 'Day 6: Scheduled Workflows (Cron & CI/CD)',
      titleZh: 'Day 6: 自动化引擎 - 让它在你睡觉时工作',
      slug: 'day-6-automation',
      description:
        'Turn one repeated task into a scheduled Hermes workflow with retry, review, and delivery rules.',
      descriptionZh:
        '把一个重复任务变成可调度的 Hermes 工作流，带重试、复查和投递规则。',
      category: 'bootcamp',
      tags: ['automation', 'cron', 'ci-cd', 'scheduling', 'intermediate'],
      difficulty: 'intermediate',
      readingTime: 15,
      series: '7-day-bootcamp',
      seriesOrder: 6,
      featured: true,
    },
    en: {
      introTitle: 'Automation starts when the second run is cheaper than the first',
      intro: [
        'A scheduled agent workflow should not be a prompt taped to cron. It needs inputs, retries, logs, and a delivery rule that says where the final artifact goes.',
        'Today you turn one repeated job into a dependable workflow: collect signals, summarize the useful changes, and deliver the result without waking you up.',
      ],
      promise: [
        'One cron-ready workflow with a clear trigger and output artifact.',
        'A retry policy that does not duplicate external actions.',
        'A morning digest or maintenance report delivered to a chosen channel.',
      ],
      why: [
        'Automation saves time only when failures are boring. If every failed run requires detective work, the workflow becomes another thing to babysit.',
        'The clean pattern is collect first, summarize second, deliver last. That separation lets you retry delivery without re-querying every source or regenerating a different answer.',
      ],
      workflow: [
        'Choose one repeated task that is frequent, low-risk, and easy to review.',
        'Define the input window and write raw collected data to a stable artifact.',
        'Ask Hermes to summarize from that artifact, not from live systems directly.',
        'Deliver the final output to chat, email, or a file.',
        'Log success, failure, duration, and the artifact path.',
      ],
      code: {
        lang: 'cron',
        content: `
0 8 * * 1-5 cd /opt/hermes-workflows && npm run daily-digest >> logs/daily-digest.log 2>&1
        `,
      },
      checks: [
        'The workflow can be rerun without sending duplicate messages.',
        'Raw input and final output are both saved.',
        'Failures are visible in logs with enough context to debug.',
      ],
      mistakes: [
        'Letting the send step regenerate the summary after a delivery failure.',
        'Scheduling high-risk write actions before the manual version is trusted.',
        'Using “every minute” schedules for workflows that humans review once a day.',
      ],
      next: [
        '**[Day 7: Multi-Agent Orchestration](/en/tutorials/bootcamp/day-7-multi-agent)** - split bigger work across agents.',
        '**[5 AI Workflow Automation Recipes](/en/guides/resources/automation-recipes)** - choose your next automated workflow.',
      ],
    },
    zh: {
      introTitle: '第二次运行比第一次便宜，才叫自动化',
      intro: [
        '定时 Agent 工作流不是把一句 prompt 粘到 cron 上。它需要输入、重试、日志，以及最终产物发到哪里。',
        '今天你会把一个重复任务变成可靠流程：采集信号、总结有价值变化、把结果投递出去，而不是半夜把你叫醒。',
      ],
      promise: [
        '一个可放进 cron 的工作流，有明确触发器和输出产物。',
        '一套不会重复执行外部动作的重试策略。',
        '一份晨报或维护报告，投递到指定渠道。',
      ],
      why: [
        '自动化只有在失败也很无聊时才真正省时间。如果每次失败都要侦探式排查，它就变成了新的负担。',
        '干净模式是：先采集、再总结、最后投递。这样投递失败时可以只重发，不会重复查询所有来源，也不会生成一份不一样的答案。',
      ],
      workflow: [
        '选择一个高频、低风险、容易复查的重复任务。',
        '定义输入时间窗口，把原始采集结果写成稳定产物。',
        '让 Hermes 基于产物总结，而不是直接读实时系统。',
        '把最终结果发到聊天、邮件或文件。',
        '记录成功、失败、耗时和产物路径。',
      ],
      code: {
        lang: 'cron',
        content: `
0 8 * * 1-5 cd /opt/hermes-workflows && npm run daily-digest >> logs/daily-digest.log 2>&1
        `,
      },
      checks: [
        '工作流可重复运行，不会重复发消息。',
        '原始输入和最终输出都被保存。',
        '失败日志足够定位问题。',
      ],
      mistakes: [
        '投递失败后重新生成总结，导致两份内容不一致。',
        '手动流程还不可信，就开始调度高风险写操作。',
        '把人类一天只看一次的流程设成每分钟运行。',
      ],
      next: [
        '**[Day 7：终极形态](/zh/tutorials/bootcamp/day-7-multi-agent)** - 把大任务拆给多个 Agent。',
        '**[5 个 AI 自动化脚本](/zh/guides/resources/automation-recipes)** - 选择下一个自动化工作流。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'bootcamp/day-7-multi-agent',
    meta: {
      title: 'Day 7: Multi-Agent Orchestration (Swarm)',
      titleZh: 'Day 7: 终极形态 - 组建你的 AI 团队',
      slug: 'day-7-multi-agent',
      description:
        'Coordinate specialist Hermes agents for research, drafting, review, and delivery without losing control of the final decision.',
      descriptionZh:
        '协调研究、写作、复核和交付型 Hermes Agent，同时保留最终决策权。',
      category: 'bootcamp',
      tags: ['multi-agent', 'orchestration', 'swarm', 'advanced'],
      difficulty: 'advanced',
      readingTime: 15,
      series: '7-day-bootcamp',
      seriesOrder: 7,
      featured: true,
    },
    en: {
      introTitle: 'A team of agents needs a manager, not a megaphone',
      intro: [
        'Multi-agent work is not about making five models talk at once for spectacle. It is about splitting responsibility so each worker has a narrow job, bounded context, and a clear handoff.',
        'The human remains the owner of the outcome. Hermes can delegate research, drafting, testing, and review, but the final merge should be explicit.',
      ],
      promise: [
        'A simple multi-agent plan with researcher, writer, reviewer, and operator roles.',
        'A handoff contract that keeps outputs comparable.',
        'A final review step where the host agent synthesizes instead of blindly concatenating.',
      ],
      why: [
        'Parallelism helps only when tasks are genuinely independent. Delegating the next blocking step creates waiting, confusion, and duplicated work.',
        'Good orchestration starts with ownership: who reads sources, who drafts, who checks risk, and who turns the work into one final artifact.',
      ],
      workflow: [
        'Define the outcome and the decision criteria before spawning agents.',
        'Split work by responsibility, not by arbitrary file count.',
        'Give each worker a short contract: inputs, output shape, constraints, and deadline.',
        'Collect outputs and ask the host agent to compare conflicts.',
        'Approve the final artifact manually before publishing or executing high-impact changes.',
      ],
      code: {
        lang: 'json',
        content: `
{
  "goal": "prepare a competitive analysis brief",
  "agents": ["researcher", "writer", "risk-reviewer"],
  "handoff": "bullets with sources, assumptions, and open questions",
  "finalOwner": "human"
}
        `,
      },
      checks: [
        'Every sub-agent has a distinct responsibility.',
        'Outputs include assumptions and open questions.',
        'The final answer resolves conflicts instead of hiding them.',
      ],
      mistakes: [
        'Spawning agents before the goal is clear.',
        'Delegating overlapping work and then trying to merge duplicates.',
        'Letting a sub-agent publish directly without host review.',
      ],
      next: [
        '**[Top 10 Hermes Skills](/en/guides/resources/best-skills)** - extend the team with reusable skills.',
        '**[Hermes vs OpenClaw](/en/guides/comparisons/hermes-vs-openclaw)** - see the strategic positioning.',
      ],
    },
    zh: {
      introTitle: 'Agent 团队需要经理，不需要扩音器',
      intro: [
        '多 Agent 不是为了让五个模型同时聊天，看起来热闹。它的价值在于拆分职责：每个 worker 有窄任务、有限上下文和清晰交接。',
        '人类仍然是结果负责人。Hermes 可以委派研究、写作、测试和复核，但最终合并必须显式完成。',
      ],
      promise: [
        '一份简单的多 Agent 计划：研究员、写手、复核者、执行者。',
        '一个交接契约，让不同输出可以比较。',
        '一个最终复核步骤：host agent 做综合，而不是机械拼接。',
      ],
      why: [
        '只有任务真正独立时，并行才有帮助。把下一个阻塞步骤外包出去，只会制造等待、混乱和重复工作。',
        '好的编排从 ownership 开始：谁读资料、谁写草稿、谁查风险、谁把结果整理成最终产物。',
      ],
      workflow: [
        '生成子 Agent 前先定义结果和判断标准。',
        '按职责拆任务，不要按文件数量随意拆。',
        '给每个 worker 一份短契约：输入、输出形状、约束和截止时间。',
        '收集输出后，让 host agent 比较冲突点。',
        '发布或执行高影响动作前，由人类手动批准最终产物。',
      ],
      code: {
        lang: 'json',
        content: `
{
  "goal": "准备一份竞品分析简报",
  "agents": ["researcher", "writer", "risk-reviewer"],
  "handoff": "带来源、假设和未决问题的要点",
  "finalOwner": "human"
}
        `,
      },
      checks: [
        '每个子 Agent 都有不同职责。',
        '输出包含假设和未决问题。',
        '最终答案会解决冲突，而不是把冲突藏起来。',
      ],
      mistakes: [
        '目标还没清楚就开始 spawn agents。',
        '委派重叠工作，最后被迫合并重复内容。',
        '让子 Agent 不经 host 复核直接发布。',
      ],
      next: [
        '**[10 个最强 Hermes 技能](/zh/guides/resources/best-skills)** - 用可复用技能扩展团队能力。',
        '**[Hermes vs OpenClaw](/zh/guides/comparisons/hermes-vs-openclaw)** - 查看本站的竞品定位。',
      ],
    },
  },
  {
    type: 'guides',
    filePath: 'resources/best-skills',
    meta: {
      title: 'Top 10 Hermes Agent Skills for Productivity',
      titleZh: '10 个最强 Hermes Agent 技能推荐',
      slug: 'best-skills',
      description:
        'A practical shortlist of Hermes skills that improve daily productivity without overloading the agent with unnecessary tools.',
      descriptionZh:
        '一份实用 Hermes 技能清单，优先提升日常生产力，而不是盲目堆工具。',
      category: 'resources',
      tags: ['skills', 'productivity', 'resources', 'tools'],
      difficulty: 'beginner',
      readingTime: 12,
      featured: true,
    },
    en: {
      introTitle: 'Install skills in the order your workflow earns them',
      intro: [
        'A skill hub is useful only if it helps users choose. The best first skills are boringly practical: they save clicks, standardize output, or connect Hermes to a source you already trust.',
        'This list prioritizes low-risk, high-frequency skills before flashy automations. That keeps the assistant useful while your permission model is still maturing.',
      ],
      promise: [
        'A ranked list of the first ten skills to consider.',
        'A selection rule for deciding whether a skill deserves installation.',
        'A lightweight review process for retiring unused skills.',
      ],
      why: [
        'Every installed skill increases the surface area of the assistant. That can be good, but only if the skill maps to a real workflow and has a clear permission boundary.',
        'Productivity comes from repeated wins. A daily digest skill used five times a week beats an impressive demo that nobody runs again.',
      ],
      workflow: [
        'Start with read-only skills: search, summarize, inspect repository, read calendar, and fetch issues.',
        'Add formatting skills: release notes, meeting summary, customer reply draft, and checklist builder.',
        'Add workflow skills only after the manual version is trusted: report delivery, dependency review, and incident triage.',
        'Review usage every two weeks and remove skills that have no owner or no logs.',
      ],
      code: {
        lang: 'json',
        content: `
[
  "repository-inspector",
  "daily-digest",
  "meeting-summary",
  "release-note-draft",
  "incident-triage"
]
        `,
      },
      checks: [
        'Each skill has an owner and a permission level.',
        'Read-only skills are installed before write-capable skills.',
        'Unused skills are removed instead of kept “just in case”.',
      ],
      mistakes: [
        'Installing skills because they are interesting rather than because they are used.',
        'Skipping documentation for skill inputs and outputs.',
        'Treating a skill marketplace as a substitute for workflow design.',
      ],
      next: [
        '**[Day 5: Tool Calling & MCP](/en/tutorials/bootcamp/day-5-skills)** - learn the contract behind skills.',
        '**[5 AI Workflow Automation Recipes](/en/guides/resources/automation-recipes)** - turn skills into repeatable jobs.',
      ],
    },
    zh: {
      introTitle: '技能要按工作流需要安装，不要按好奇心安装',
      intro: [
        '资源库真正有价值的地方，是帮用户做选择。第一批最值得装的技能通常很朴素：少点几次鼠标、统一输出格式、连接一个你已经信任的数据源。',
        '这份清单优先推荐低风险、高频使用的技能，而不是炫技自动化。这样在权限模型还没完全成熟时，助理也能稳定创造价值。',
      ],
      promise: [
        '一份前十个 Hermes 技能优先级清单。',
        '一条判断技能是否值得安装的规则。',
        '一个轻量复盘流程，用来下线不用的技能。',
      ],
      why: [
        '每安装一个技能，助理的能力边界都会变大。只有当技能对应真实工作流，并且权限边界清楚时，这才是好事。',
        '生产力来自重复胜利。一个每周用五次的日报技能，比一个没人复用的华丽 demo 更有价值。',
      ],
      workflow: [
        '先装只读技能：搜索、总结、仓库检查、日历读取、issue 获取。',
        '再装格式化技能：发布说明、会议纪要、客户回复草稿、检查清单生成。',
        '手动流程稳定后再装工作流技能：报告投递、依赖审查、事故分诊。',
        '每两周看一次使用情况，没有 owner 或日志的技能直接移除。',
      ],
      code: {
        lang: 'json',
        content: `
[
  "repository-inspector",
  "daily-digest",
  "meeting-summary",
  "release-note-draft",
  "incident-triage"
]
        `,
      },
      checks: [
        '每个技能都有 owner 和权限级别。',
        '先装只读技能，再装可写技能。',
        '不用的技能会被移除，而不是“先留着”。',
      ],
      mistakes: [
        '因为技能有趣就安装，而不是因为工作流需要。',
        '不记录技能输入输出。',
        '把技能市场当成工作流设计的替代品。',
      ],
      next: [
        '**[Day 5：装备技能](/zh/tutorials/bootcamp/day-5-skills)** - 理解技能背后的工具契约。',
        '**[5 个 AI 自动化脚本](/zh/guides/resources/automation-recipes)** - 把技能变成可重复任务。',
      ],
    },
  },
  {
    type: 'guides',
    filePath: 'resources/automation-recipes',
    meta: {
      title: '5 AI Workflow Automation Recipes',
      titleZh: '5 个拿来就用的 AI 自动化脚本',
      slug: 'automation-recipes',
      description:
        'Five repeatable Hermes automation recipes for reports, triage, content operations, dependency review, and customer feedback.',
      descriptionZh:
        '五个可复用 Hermes 自动化方案，覆盖报告、分诊、内容运营、依赖审查和用户反馈。',
      category: 'resources',
      tags: ['automation', 'recipes', 'workflows', 'resources'],
      difficulty: 'intermediate',
      readingTime: 13,
      featured: true,
    },
    en: {
      introTitle: 'Recipes beat inspiration because they can be rerun',
      intro: [
        'A good automation recipe has a trigger, input contract, output artifact, owner, and rollback path. Without those pieces, the workflow is just a prompt you hope will behave tomorrow.',
        'These five recipes are designed to be copied in small teams before you build a larger automation platform.',
      ],
      promise: [
        'Five production-shaped workflows you can adapt.',
        'A common contract for triggers, inputs, approvals, and outputs.',
        'A way to decide which workflow should graduate from experiment to routine.',
      ],
      why: [
        'Most teams do not need more automation ideas. They need safer shapes for turning repeated work into reviewable, measurable routines.',
        'Hermes is strongest when it sits between collection and delivery: it reasons over prepared inputs and produces an artifact a human can inspect.',
      ],
      workflow: [
        'Daily digest: collect issues, calendar events, and metrics, then send a one-screen morning brief.',
        'Incident triage: merge logs and deploy history, classify severity, and suggest the first runbook.',
        'Content operations: turn notes into outline, draft, SEO metadata, and publishing checklist.',
        'Dependency review: summarize package updates, changelogs, risk, and test commands.',
        'Feedback clustering: group customer comments by theme and produce next-action recommendations.',
      ],
      code: {
        lang: 'yaml',
        content: `
trigger: "weekday 08:00"
input: "collected-signals.json"
output: "daily-digest.md"
approval: "required before external send"
owner: "ops"
        `,
      },
      checks: [
        'Every recipe stores pre-summary input.',
        'Anything external-facing has an approval step.',
        'Success is measured by time saved and review quality, not execution count alone.',
      ],
      mistakes: [
        'Automating a workflow nobody has run manually.',
        'Letting one recipe mutate data and notify people in the same step.',
        'Failing to retire recipes that produce noisy output.',
      ],
      next: [
        '**[Day 6: Scheduled Workflows](/en/tutorials/bootcamp/day-6-automation)** - schedule one recipe safely.',
        '**[Day 7: Multi-Agent Orchestration](/en/tutorials/bootcamp/day-7-multi-agent)** - assign incident work to specialist agents.',
      ],
    },
    zh: {
      introTitle: '方案比灵感可靠，因为它能重复运行',
      intro: [
        '一个好的自动化方案必须有触发器、输入契约、输出产物、owner 和回滚路径。缺少这些，它就只是一句你希望明天还管用的 prompt。',
        '下面五个方案适合小团队直接复制，再逐步演化成更完整的自动化平台。',
      ],
      promise: [
        '五个具备生产形态的工作流模板。',
        '一套统一契约：触发器、输入、审批和输出。',
        '一条判断实验何时可以晋升为日常流程的规则。',
      ],
      why: [
        '大多数团队缺的不是自动化灵感，而是把重复工作变成可复查、可衡量流程的安全形状。',
        'Hermes 最适合放在采集和投递之间：基于准备好的输入推理，产出人类可以检查的制品。',
      ],
      workflow: [
        '自动晨报：采集 issue、日历、指标，生成一屏读完的早报。',
        '事故分诊：合并日志和部署历史，判断严重级别，建议第一条 runbook。',
        '内容运营：把笔记变成大纲、草稿、SEO 元数据和发布清单。',
        '依赖审查：总结包升级、changelog、风险和测试命令。',
        '反馈聚类：按主题归类用户评论，并输出下一步建议。',
      ],
      code: {
        lang: 'yaml',
        content: `
trigger: "weekday 08:00"
input: "collected-signals.json"
output: "daily-digest.md"
approval: "required before external send"
owner: "ops"
        `,
      },
      checks: [
        '每个方案都保存总结前输入。',
        '所有对外动作都有审批。',
        '成功指标看节省时间和复查质量，而不只看执行次数。',
      ],
      mistakes: [
        '自动化一个没人手动跑通过的流程。',
        '在同一步里既改数据又通知外部人员。',
        '产物噪音变高后还不下线方案。',
      ],
      next: [
        '**[Day 6：自动化引擎](/zh/tutorials/bootcamp/day-6-automation)** - 安全调度一个方案。',
        '**[第 7 天：多 Agent 编排](/zh/tutorials/bootcamp/day-7-multi-agent)** - 把事故处理拆给专门的 Agent。',
      ],
    },
  },
  {
    type: 'guides',
    filePath: 'comparisons/hermes-vs-openclaw',
    meta: {
      title: 'Best OpenClaw Alternative: Why Hermes Agent is the Superior AI Worker',
      titleZh: 'OpenClaw 替代品推荐：为什么 Hermes Agent 是更好的 AI 私人助理？',
      slug: 'hermes-vs-openclaw',
      description:
        'Compare Hermes Agent and OpenClaw through setup, workflow design, extensibility, privacy, and long-term team fit.',
      descriptionZh:
        '从安装、工作流设计、扩展能力、隐私和团队长期适配度对比 Hermes Agent 与 OpenClaw。',
      category: 'comparisons',
      tags: ['openclaw', 'comparison', 'alternative', 'agents'],
      difficulty: 'beginner',
      readingTime: 12,
      featured: true,
    },
    en: {
      introTitle: 'Choose the agent that makes the workflow easier to trust',
      intro: [
        'OpenClaw is useful for exploring agent interfaces, but many teams eventually need something more operational: clearer boundaries, repeatable workflows, and a way to combine chat, tools, and scheduled work.',
        'Hermes Agent is positioned as an autonomous worker you can shape around your own operating model instead of a demo surface you admire from a distance.',
      ],
      promise: [
        'A practical comparison of setup, privacy, tooling, automation, and team fit.',
        'A migration lens for users evaluating OpenClaw alternatives.',
        'A decision checklist you can use before investing a week in either stack.',
      ],
      why: [
        'The real question is not which project looks more impressive in a screenshot. The question is which failure mode your workflow can tolerate.',
        'Hermes wins when you need explicit skills, human approval, scheduled jobs, and multi-agent delegation. OpenClaw can still be attractive when you want to explore a different UI or ecosystem first.',
      ],
      workflow: [
        'Compare installation friction: how long until the first useful task completes?',
        'Compare permission boundaries: can you explain what the agent may read or change?',
        'Compare workflow depth: does it support repeatable jobs or only interactive chat?',
        'Compare extension model: are tools documented as contracts?',
        'Compare team operations: can another operator run and audit the same workflow?',
      ],
      code: {
        lang: 'md',
        content: `
Decision rule:
- Pick Hermes when workflow control, skills, and automation matter most.
- Pick OpenClaw when you are evaluating interface ideas or ecosystem fit.
- Revisit after one real week, not after one demo prompt.
        `,
      },
      checks: [
        'You can name the first three workflows you want the agent to own.',
        'You know where secrets, logs, and memory live.',
        'You can explain rollback before enabling write actions.',
      ],
      mistakes: [
        'Choosing based on a landing page instead of a repeated workflow.',
        'Ignoring permissions until after the first automation goes wrong.',
        'Comparing model quality while the operational model is still unclear.',
      ],
      next: [
        '**[Day 1: Local Setup & Privacy](/en/tutorials/bootcamp/day-1-setup)** - try Hermes from the first working task.',
        '**[Hermes vs AutoGPT](/en/guides/comparisons/hermes-vs-autogpt)** - compare another agent category.',
      ],
    },
    zh: {
      introTitle: '选择那个更容易被信任的工作流系统',
      intro: [
        'OpenClaw 适合探索 Agent 交互界面，但很多团队最后需要的是更偏运营的东西：边界清楚、流程可重复、能把聊天、工具和定时任务放在一起。',
        'Hermes Agent 的定位更像一个可以按你的工作方式塑造的 AI 员工，而不是只能远远欣赏的 demo 界面。',
      ],
      promise: [
        '从安装、隐私、工具、自动化和团队适配度做实用对比。',
        '给正在寻找 OpenClaw 替代品的用户一套迁移视角。',
        '一份投入一周前可以先检查的决策清单。',
      ],
      why: [
        '真正的问题不是哪个项目截图更酷，而是哪种失败模式你的工作流承受得起。',
        '当你需要明确技能、人类审批、定时任务和多 Agent 委派时，Hermes 更占优。OpenClaw 在探索界面和生态时仍然值得看。',
      ],
      workflow: [
        '比较安装摩擦：多久能完成第一个有用任务？',
        '比较权限边界：你能说清楚 Agent 能读什么、改什么吗？',
        '比较工作流深度：支持可重复任务，还是只有交互聊天？',
        '比较扩展模型：工具是否以契约形式记录？',
        '比较团队运营：另一个人能否运行并审计同一流程？',
      ],
      code: {
        lang: 'md',
        content: `
决策规则：
- 如果你最看重工作流控制、技能和自动化，优先选 Hermes。
- 如果你主要在评估界面想法或生态适配，可以先看 OpenClaw。
- 用一周真实任务复盘，不要只看一次 demo prompt。
        `,
      },
      checks: [
        '你能说出想交给 Agent 的前三个工作流。',
        '你知道密钥、日志和记忆分别放在哪里。',
        '开放写操作前，你能解释如何回滚。',
      ],
      mistakes: [
        '根据落地页选择，而不是根据重复工作流选择。',
        '等第一次自动化出错后才关心权限。',
        '运营模型还不清楚，就开始比较模型聪不聪明。',
      ],
      next: [
        '**[Day 1：极简安装](/zh/tutorials/bootcamp/day-1-setup)** - 从第一个可运行任务体验 Hermes。',
        '**[Hermes vs AutoGPT](/zh/guides/comparisons/hermes-vs-autogpt)** - 对比另一类 Agent。',
      ],
    },
  },
];

for (const article of articles) {
  writeArticle(article);
}

console.log(`Generated ${articles.length * 2} localized PRD content files.`);
