import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './page.module.css';

type Props = { params: Promise<{ locale: string }> };

const days = [
  { day: 1, titleEn: 'Meet Hermes', titleZh: '认识 Hermes', descEn: 'Install Hermes Agent, choose your AI model, and have your first conversation.', descZh: '安装 Hermes Agent，选择 AI 模型，进行你的第一次对话。', link: '/tutorials/getting-started/installation' },
  { day: 2, titleEn: 'Efficient Dialogues', titleZh: '高效对话', descEn: 'Master slash commands, session management, and context compression.', descZh: '掌握斜杠命令、会话管理和上下文压缩。', link: '/tutorials/getting-started/cli-essentials' },
  { day: 3, titleEn: 'Files & Code', titleZh: '文件与代码', descEn: 'Read/write files, run scripts, and generate code with Hermes.', descZh: '用 Hermes 读写文件、运行脚本和生成代码。', link: '/tutorials/getting-started/first-conversation' },
  { day: 4, titleEn: 'Go Mobile', titleZh: '移动端接入', descEn: 'Set up the Telegram gateway for anywhere, anytime conversations.', descZh: '配置 Telegram 网关，随时随地对话。', link: '/tutorials/messaging/telegram-bot-setup' },
  { day: 5, titleEn: 'Skills Mastery', titleZh: '技能精通', descEn: 'Browse, install, and create your own custom skills.', descZh: '浏览、安装和创建你的自定义技能。', link: '/tutorials/skills/install-community-skills' },
  { day: 6, titleEn: 'Automation', titleZh: '自动化', descEn: 'Set up cron tasks, automated daily reports, and monitoring alerts.', descZh: '设置 Cron 任务、自动日报和监控告警。', link: '/tutorials/automation/cron-scheduling' },
  { day: 7, titleEn: 'Multi-Agent', titleZh: '多 Agent 协作', descEn: 'Multiple profiles, bot-to-bot orchestration, and host scheduling.', descZh: '多 Profile、Agent 间协作和 Host 调度。', link: '/tutorials/advanced/multi-agent-orchestration' },
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
            <h3 className={styles.dayTitle}>{isZh ? d.titleZh : d.titleEn}</h3>
            <p className={styles.dayDesc}>{isZh ? d.descZh : d.descEn}</p>
            <Link href={`/${locale}${d.link}`} className={styles.dayLink}>
              {isZh ? '开始学习 →' : 'Start Learning →'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
