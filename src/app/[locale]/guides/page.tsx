import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import TutorialCard from '@/components/cards/TutorialCard/TutorialCard';
import { getArticles, type ArticleMeta } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from '../tutorials/page.module.css';

type Props = { params: Promise<{ locale: string }> };

const categoryIcons: Record<string, string> = {
  deployment: '🖥️',
  security: '🔒',
  comparisons: '⚖️',
};

function sortGuides(a: ArticleMeta, b: ArticleMeta) {
  const categoryOrder = ['deployment', 'security', 'comparisons'];
  const categoryDelta = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
  if (categoryDelta !== 0) {
    return categoryDelta;
  }

  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    pathname: '/guides',
    title: isZh ? 'Hermes Agent 指南' : 'Hermes Agent Guides',
    description: isZh
      ? '聚焦部署、安全与架构决策的深度指南。'
      : 'In-depth Hermes Agent guides on deployment, security, and architecture decisions.',
  });
}

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';
  const guides = getArticles('guides', locale).sort(sortGuides);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{isZh ? '深度指南' : 'Guides'}</h1>
      <p className={styles.pageDesc}>
        {isZh
          ? '部署、安全、对比评测，集中覆盖生产环境最容易踩坑的部分。'
          : 'Deployment, security, and comparison guides focused on production-grade Hermes usage.'}
      </p>

      <div className={styles.grid}>
        {guides.map((guide) => (
          <TutorialCard
            key={guide.urlPath}
            href={`/${locale}/guides/${guide.urlPath ?? guide.slug}`}
            icon={categoryIcons[guide.category] ?? '📘'}
            title={isZh ? guide.titleZh : guide.title}
            description={isZh ? guide.descriptionZh : guide.description}
            difficulty={guide.difficulty}
            difficultyLabel={isZh
              ? (guide.difficulty === 'beginner' ? '入门' : guide.difficulty === 'intermediate' ? '中级' : '高级')
              : (guide.difficulty === 'beginner' ? 'Beginner' : guide.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced')}
            readingTime={guide.readingTime}
            readingTimeUnit={isZh ? '分钟阅读' : 'min read'}
            tags={guide.tags}
          />
        ))}
      </div>
    </div>
  );
}
