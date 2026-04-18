import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import TutorialCard from '@/components/cards/TutorialCard/TutorialCard';
import { createTranslator } from '@/lib/translations';
import { getArticles, type ArticleMeta } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from '../tutorials/page.module.css';

type Props = { params: Promise<{ locale: string }> };

const categoryIcons: Record<string, string> = {
  resources: '📦',
  comparisons: '⚖️',
};

function sortResources(a: ArticleMeta, b: ArticleMeta) {
  if (a.category !== b.category) {
    return a.category === 'resources' ? -1 : 1;
  }

  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    pathname: '/resources',
    title: isZh ? '资源聚合 | HermesAgent 101' : 'Resource Hub | HermesAgent 101',
    description: isZh
      ? '精选 Hermes Agent Skills、自动化方案和竞品对比，帮助你快速搭建可复用 AI 工作流。'
      : 'Curated Hermes Agent skills, automation recipes, and comparisons for building reusable AI workflows.',
  });
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = createTranslator(locale);
  const isZh = locale === 'zh';
  const resources = getArticles('guides', locale).sort(sortResources);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{t('nav.resources')}</h1>
      <p className={styles.pageDesc}>
        {isZh
          ? '围绕 Hermes Agent 的技能、自动化脚本、竞品对比和上手路线，整理成可以直接进入实战的资源库。'
          : 'A practical resource hub for Hermes Agent skills, automation recipes, comparisons, and implementation paths.'}
      </p>

      <div className={styles.grid}>
        {resources.map((resource) => (
          <TutorialCard
            key={resource.urlPath}
            href={`/${locale}/guides/${resource.urlPath ?? resource.slug}`}
            icon={categoryIcons[resource.category] ?? '📘'}
            title={isZh ? resource.titleZh : resource.title}
            description={isZh ? resource.descriptionZh : resource.description}
            difficulty={resource.difficulty}
            difficultyLabel={t(`common.${resource.difficulty}`)}
            readingTime={resource.readingTime}
            readingTimeUnit={t('common.minutes')}
            tags={resource.tags}
          />
        ))}
      </div>
    </div>
  );
}
