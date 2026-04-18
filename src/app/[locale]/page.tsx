import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { createTranslator } from '@/lib/translations';
import Link from 'next/link';
import FAQAccordion from '@/components/ui/FAQAccordion/FAQAccordion';
import NewsletterForm from '@/components/ui/NewsletterForm/NewsletterForm';
import TutorialCard from '@/components/cards/TutorialCard/TutorialCard';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './page.module.css';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    title: isZh ? 'Hermes Agent 学习社区' : 'Hermes Agent Community',
    description: isZh
      ? 'Hermes Agent 一站式学习社区 — 从安装到多 Agent 协作的完整知识库。'
      : 'The definitive learning hub for Hermes Agent — from first install to multi-agent orchestration.',
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = createTranslator(locale);
  const isZh = locale === 'zh';

  const faqItems = [
    { question: t('faqItems.q1'), answer: t('faqItems.a1') },
    { question: t('faqItems.q2'), answer: t('faqItems.a2') },
    { question: t('faqItems.q3'), answer: t('faqItems.a3') },
    { question: t('faqItems.q4'), answer: t('faqItems.a4') },
    { question: t('faqItems.q5'), answer: t('faqItems.a5') },
  ];

  const sampleTutorials = [
    {
      href: `/${locale}/tutorials/bootcamp/day-1-setup`,
      icon: '🚀',
      title: isZh ? 'Day 1: 唤醒助理 —— 极简安装与第一声问候' : 'Day 1: Local Setup & Privacy (Ollama + Docker)',
      description: isZh ? '避开复杂配置，5分钟让你的 AI 助理跑起来并完成自我介绍。' : 'Get your AI worker running locally in 5 minutes with zero privacy leaks.',
      difficulty: 'beginner' as const,
      readingTime: 8,
      tags: ['bootcamp', 'setup'],
    },
    {
      href: `/${locale}/tutorials/bootcamp/day-2-memory`,
      icon: '🧠',
      title: isZh ? 'Day 2: 赋予记忆 —— 让它真正“懂你”' : 'Day 2: Context & Memory (System Prompts)',
      description: isZh ? '配置长期记忆，教你写一份完美的“助理使用说明书”。' : 'Configure long-term memory and craft the perfect system prompt for your worker.',
      difficulty: 'beginner' as const,
      readingTime: 6,
      tags: ['bootcamp', 'memory'],
    },
    {
      href: `/${locale}/tutorials/bootcamp/day-3-integration`,
      icon: '📱',
      title: isZh ? 'Day 3: 触手可及 —— 把它装进你的手机' : 'Day 3: Team Integration (Slack & Discord)',
      description: isZh ? '手把手教你接入 Telegram 或微信，随时随地使唤它。' : 'Connect your worker to Slack or Discord to collaborate with your team.',
      difficulty: 'intermediate' as const,
      readingTime: 10,
      tags: ['bootcamp', 'integration'],
    },
    {
      href: `/${locale}/tutorials/bootcamp/day-4-data`,
      icon: '📊',
      title: isZh ? 'Day 4: 赋予双手 —— 处理文件与数据' : 'Day 4: Data Processing (API & JSON)',
      description: isZh ? '开启本地文件权限，让它帮你秒读长文档、清洗 Excel 数据。' : 'Enable file access to let your worker process CSVs, JSONs, and long PDFs.',
      difficulty: 'intermediate' as const,
      readingTime: 12,
      tags: ['bootcamp', 'data'],
    },
  ];

  return (
    <>
      <section className={styles.hero}>
        <span className={styles.badge}>v0.8 Release is out</span>
        <h1 className={styles.title}>
          {t('hero.title').split('Hermes')[0]}
          <span className={styles.titleAccent}>Hermes</span>
          {t('hero.title').split('Hermes')[1]}
        </h1>
        <p className={styles.subtitle}>{t('hero.description')}</p>

        <div className={styles.ctaGroup}>
          <Link href={`/${locale}/tutorials`} className={styles.btnPrimary}>
            ⚡ {t('hero.ctaPrimary')}
          </Link>
          <Link href={`/${locale}/learning-path`} className={styles.btnSecondary}>
            📚 {t('hero.ctaSecondary')}
          </Link>
        </div>

        <div className={styles.terminal}>
          <div className={styles.terminalHeader}>
            <div className={`${styles.dot} ${styles.dotRed}`} />
            <div className={`${styles.dot} ${styles.dotYellow}`} />
            <div className={`${styles.dot} ${styles.dotGreen}`} />
            <span className={styles.terminalTitle}>bash — hermes-setup</span>
          </div>
          <div className={styles.terminalBody}>
            <div>
              <span className={styles.prompt}>$</span>
              <span className={styles.typewriter}>curl -fsSL hermes.sh | bash</span>
            </div>
            <div className={styles.output}>&gt; Bootstrapping AI cognitive core...</div>
            <div className={styles.output}>&gt; Hooking into Telegram &amp; CLI...</div>
            <div className={styles.outputSuccess}>&gt; 🚀 Hermes Agent is active and ready.</div>
          </div>
        </div>
      </section>

      <section className={styles.socialProof}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>74.9k+</span>
          <span className={styles.statLabel}>{t('socialProof.stars')}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>10k+</span>
          <span className={styles.statLabel}>{t('socialProof.forks')}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>200+</span>
          <span className={styles.statLabel}>{t('socialProof.models')}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>15+</span>
          <span className={styles.statLabel}>{t('socialProof.platforms')}</span>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>{t('features.title')}</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🧠</div>
            <h3>{t('features.selfLearning.title')}</h3>
            <p>{t('features.selfLearning.description')}</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🌐</div>
            <h3>{t('features.deployAnywhere.title')}</h3>
            <p>{t('features.deployAnywhere.description')}</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🔄</div>
            <h3>{t('features.multiAgent.title')}</h3>
            <p>{t('features.multiAgent.description')}</p>
          </div>
        </div>
      </section>

      <section className={styles.tutorials}>
        <div className={styles.tutorialsHeader}>
          <h2 className={styles.sectionTitle}>{isZh ? '7天实战营 (7-Day Bootcamp)' : '7-Day Bootcamp'}</h2>
          <Link href={`/${locale}/tutorials`} className={styles.viewAllLink}>
            {isZh ? '查看完整路径 →' : 'View Full Path →'}
          </Link>
        </div>
        <div className={styles.tutorialsGrid}>
          {sampleTutorials.map((tut) => (
            <TutorialCard
              key={tut.href}
              href={tut.href}
              icon={tut.icon}
              title={tut.title}
              description={tut.description}
              difficulty={tut.difficulty}
              difficultyLabel={t(`common.${tut.difficulty}`)}
              readingTime={tut.readingTime}
              readingTimeUnit={t('common.minutes')}
              tags={tut.tags}
            />
          ))}
        </div>
      </section>

      <FAQAccordion title={t('nav.faq')} items={faqItems} />

      <NewsletterForm
        title={t('newsletter.title')}
        description={t('newsletter.description')}
        placeholder={t('newsletter.placeholder')}
        buttonText={t('newsletter.button')}
      />
    </>
  );
}
