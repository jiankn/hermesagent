import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { createTranslator } from '@/lib/translations';
import TutorialCard from '@/components/cards/TutorialCard/TutorialCard';
import { getArticles, type ArticleMeta } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './page.module.css';

type Props = { params: Promise<{ locale: string }> };

const categoryIcons: Record<string, string> = {
  bootcamp: '🚀',
};

function sortTutorials(a: ArticleMeta, b: ArticleMeta) {
  if (a.seriesOrder !== undefined && b.seriesOrder !== undefined) {
    return a.seriesOrder - b.seriesOrder;
  }
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    pathname: '/tutorials',
    title: isZh ? '7天实战营 | HermesAgent 101' : '7-Day Bootcamp | HermesAgent 101',
    description: isZh
      ? '从零开始，每天一个主题，7天掌握你的 AI 私人助理。'
      : 'From zero to AI automation expert. One topic per day, master Hermes Agent in 7 days.',
  });
}

export default async function TutorialsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = createTranslator(locale);
  const isZh = locale === 'zh';
  const tutorials = getArticles('tutorials', locale).sort(sortTutorials);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{t('nav.tutorials')}</h1>
      <p className={styles.pageDesc}>
        {isZh
          ? '从零开始，每天一个主题，7天掌握你的 AI 私人助理。'
          : 'From zero to AI automation expert. One topic per day, master Hermes Agent in 7 days.'}
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
