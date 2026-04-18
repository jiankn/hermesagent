import type { Metadata } from 'next';
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
      href: `/${locale}/tutorials/getting-started/installation`,
      icon: '🚀',
      title: isZh ? 'Hermes Agent 完整安装指南' : 'How to Install Hermes Agent: Complete Guide',
      description: isZh ? '支持 Linux、macOS、WSL2 和 Android Termux 的全平台安装教程。' : 'Step-by-step installation guide for Linux, macOS, WSL2, and Android Termux.',
      difficulty: 'beginner' as const,
      readingTime: 8,
      tags: ['installation', 'setup'],
    },
    {
      href: `/${locale}/tutorials/getting-started/first-conversation`,
      icon: '💬',
      title: isZh ? '与 Hermes Agent 的第一次对话' : 'Your First Conversation with Hermes Agent',
      description: isZh ? '学会如何和你的 AI Agent 有效对话、创建会话和管理上下文。' : 'Learn how to effectively chat with your AI Agent, create sessions, and manage context.',
      difficulty: 'beginner' as const,
      readingTime: 6,
      tags: ['beginner', 'chat'],
    },
    {
      href: `/${locale}/tutorials/getting-started/choosing-a-model`,
      icon: '🤖',
      title: isZh ? '如何选择合适的 AI 模型' : 'How to Choose the Right AI Model',
      description: isZh ? '对比 GPT-4o、Claude 3.5、Llama 3 等 200+ 模型，找到最适合你的方案。' : 'Compare GPT-4o, Claude 3.5, Llama 3, and 200+ models to find your perfect fit.',
      difficulty: 'beginner' as const,
      readingTime: 10,
      tags: ['models', 'openrouter'],
    },
    {
      href: `/${locale}/tutorials/messaging/telegram-bot-setup`,
      icon: '📱',
      title: isZh ? '在 Telegram 上配置 Hermes Agent' : 'Set Up Hermes Agent on Telegram',
      description: isZh ? '把你的 AI Agent 部署到 Telegram，随时随地通过手机对话。' : 'Deploy your AI Agent to Telegram for 24/7 mobile conversations.',
      difficulty: 'intermediate' as const,
      readingTime: 12,
      tags: ['telegram', 'messaging'],
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
          <h2 className={styles.sectionTitle}>{t('latestTutorials.title')}</h2>
          <Link href={`/${locale}/tutorials`} className={styles.viewAllLink}>
            {t('latestTutorials.viewAll')}
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
