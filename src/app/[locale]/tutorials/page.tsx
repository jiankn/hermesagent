import type { Metadata } from 'next';
import { createTranslator } from '@/lib/translations';
import TutorialCard from '@/components/cards/TutorialCard/TutorialCard';
import { getArticles, type ArticleMeta } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './page.module.css';

type Props = { params: Promise<{ locale: string }> };

const categoryOrder: Record<string, number> = {
  'getting-started': 1,
  messaging: 2,
  skills: 3,
  automation: 4,
  advanced: 5,
};

const categoryIcons: Record<string, string> = {
  'getting-started': '🚀',
  messaging: '📱',
  skills: '🧩',
  automation: '⏰',
  advanced: '🔗',
};

function sortTutorials(a: ArticleMeta, b: ArticleMeta) {
  const categoryDelta = (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99);
  if (categoryDelta !== 0) {
    return categoryDelta;
  }

  const orderDelta = (a.seriesOrder ?? 999) - (b.seriesOrder ?? 999);
  if (orderDelta !== 0) {
    return orderDelta;
  }

  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    pathname: '/tutorials',
    title: isZh ? 'Hermes Agent 教程' : 'Hermes Agent Tutorials',
    description: isZh
      ? '从安装、对话到自动化与多 Agent 协作的系统教程。'
      : 'Step-by-step Hermes Agent tutorials covering setup, workflows, automation, and multi-agent orchestration.',
  });
}

export default async function TutorialsPage({ params }: Props) {
  const { locale } = await params;
  const t = createTranslator(locale);
  const isZh = locale === 'zh';
  const tutorials = getArticles('tutorials', locale).sort(sortTutorials);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{t('nav.tutorials')}</h1>
      <p className={styles.pageDesc}>
        {isZh
          ? '从入门到进阶，系统化学习 Hermes Agent 的每一个功能。'
          : 'From beginner to advanced, systematically learn every feature of Hermes Agent.'}
      </p>

      <div className={styles.grid}>
        {tutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial.urlPath}
            href={`/${locale}/tutorials/${tutorial.urlPath ?? tutorial.slug}`}
            icon={categoryIcons[tutorial.category] ?? '📘'}
            title={isZh ? tutorial.titleZh : tutorial.title}
            description={isZh ? tutorial.descriptionZh : tutorial.description}
            difficulty={tutorial.difficulty}
            difficultyLabel={t(`common.${tutorial.difficulty}`)}
            readingTime={tutorial.readingTime}
            readingTimeUnit={t('common.minutes')}
            tags={tutorial.tags}
          />
        ))}
      </div>
    </div>
  );
}
