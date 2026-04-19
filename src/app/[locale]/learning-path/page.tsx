import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './page.module.css';

type Props = { params: Promise<{ locale: string }> };

const days = [
  { day: 1, titleEn: 'Local Setup & Privacy', titleZh: '极简安装与隐私', descEn: 'Install Hermes Agent, choose a local-first setup, and complete the first useful conversation.', descZh: '跑起 Hermes Agent，选择本地优先配置，并完成第一次真正有用的对话。', link: '/tutorials/bootcamp/day-1-setup' },
  { day: 2, titleEn: 'Context & Memory', titleZh: '上下文与记忆', descEn: 'Create an assistant profile, memory rules, and approval boundaries that survive restarts.', descZh: '建立助理档案、记忆规则和重启后仍然有效的审批边界。', link: '/tutorials/bootcamp/day-2-memory' },
  { day: 3, titleEn: 'Team Integration', titleZh: '团队消息集成', descEn: 'Connect Hermes to a messaging channel with safe command boundaries.', descZh: '把 Hermes 接入消息渠道，同时保留清晰的命令和审批边界。', link: '/tutorials/bootcamp/day-3-integration' },
  { day: 4, titleEn: 'Data Processing', titleZh: '文件与数据处理', descEn: 'Transform messy inputs into structured, reviewable artifacts.', descZh: '把杂乱输入变成可校验、可复查的结构化产物。', link: '/tutorials/bootcamp/day-4-data' },
  { day: 5, titleEn: 'Tool Calling & MCP', titleZh: 'Tool Calling 与 MCP', descEn: 'Connect external tools through explicit contracts and safe permissions.', descZh: '通过清晰契约和安全权限接入外部工具。', link: '/tutorials/bootcamp/day-5-skills' },
  { day: 6, titleEn: 'Scheduled Workflows', titleZh: '定时工作流', descEn: 'Turn repeated work into cron-ready workflows with inputs, retries, and logs.', descZh: '把重复任务变成带输入、重试和日志的定时工作流。', link: '/tutorials/bootcamp/day-6-automation' },
  { day: 7, titleEn: 'Multi-Agent Orchestration', titleZh: '多 Agent 编排', descEn: 'Split larger work across specialist agents while keeping final review explicit.', descZh: '把大型任务拆给专门 Agent，同时保留明确的最终复核。', link: '/tutorials/bootcamp/day-7-multi-agent' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    pathname: '/learning-path',
    title: isZh ? 'Hermes Agent 7 天学习路径' : 'Hermes Agent 7-Day Learning Path',
    description: isZh
      ? '按天拆解 Hermes Agent 学习路线，从入门到自动化实战。'
      : 'A day-by-day learning plan to go from Hermes Agent basics to real automation workflows.',
  });
}

export default async function LearningPathPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{isZh ? '7 天学习路径' : '7-Day Learning Path'}</h1>
      <p className={styles.pageDesc}>
        {isZh ? '从零基础到 AI 自动化专家，每天一个主题，7 天掌握 Hermes Agent。' : 'From zero to AI automation expert. One topic per day, master Hermes Agent in 7 days.'}
      </p>

      <div className={styles.timeline}>
        {days.map((d) => (
          <div key={d.day} className={styles.day}>
            <div className={styles.dayDot} />
            <div className={styles.dayLabel}>Day {d.day}</div>
            <h3 className={styles.dayTitle}>{isZh ? (d.titleZh || d.titleEn) : d.titleEn}</h3>
            <p className={styles.dayDesc}>{isZh ? (d.descZh || d.descEn) : d.descEn}</p>
            <Link href={`/${locale}${d.link}`} className={styles.dayLink}>
              {isZh ? '开始学习 →' : 'Start Learning →'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
