import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { createTranslator } from '@/lib/translations';
import TutorialCard from '@/components/cards/TutorialCard/TutorialCard';
import { getArticles, type ArticleMeta } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from '../tutorials/page.module.css';

type Props = { params: Promise<{ locale: string }> };

const categoryIcons: Record<string, string> = {
  resources: '📦',
  comparisons: '⚖️',
};

function sortGuides(a: ArticleMeta, b: ArticleMeta) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    pathname: '/guides',
    title: isZh ? '资源聚合 | HermesAgent 101' : 'Resource Hub | HermesAgent 101',
    description: isZh
      ? '全网最全的 Hermes Agent 资源聚合站：精选 Skills、高阶 Prompts、自动化脚本。'
      : 'The definitive Hermes Agent resource hub: curated skills, advanced prompts, and automation recipes.',
  });
}

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = createTranslator(locale);
  const isZh = locale === 'zh';
  const guides = getArticles('guides', locale).sort(sortGuides);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{t('nav.resources')}</h1>
      <p className={styles.pageDesc}>
        {isZh
          ? '全网最全的 Hermes Agent 资源聚合站：精选 Skills、高阶 Prompts、自动化脚本。'
          : 'The definitive Hermes Agent resource hub: curated skills, advanced prompts, and automation recipes.'}
      </p>

      <div className={styles.grid}>
        {guides.map((guide) => (
          <TutorialCard
            key={guide.urlPath}
            href={`/${locale}/guides/${guide.urlPath ?? guide.slug}`}
            icon={categoryIcons[guide.category] ?? '📘'}
            title={isZh ? (guide.titleZh || guide.title) : guide.title}
            description={isZh ? (guide.descriptionZh || guide.description) : guide.description}
            difficulty={guide.difficulty}
            difficultyLabel={t(`common.${guide.difficulty}`)}
            readingTime={guide.readingTime ?? 5}
            readingTimeUnit={t('common.minutes')}
            tags={guide.tags}
          />
        ))}
      </div>
    </div>
  );
}
