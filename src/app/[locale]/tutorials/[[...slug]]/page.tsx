import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DifficultyBadge from '@/components/ui/DifficultyBadge/DifficultyBadge';
import TutorialCard from '@/components/cards/TutorialCard/TutorialCard';
import { createTranslator } from '@/lib/translations';
import {
  getArticleBySlug,
  getArticles,
  getOptionalStaticArticleParams,
  type ArticleMeta,
} from '@/lib/content';
import { routing } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/schema';
import { extractHeadings, renderMarkdown } from '@/lib/article-render';
import { getRelatedArticles } from '@/lib/related-articles';
import listStyles from '../page.module.css';
import articleStyles from '../[...slug]/page.module.css';

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

const categoryIcons: Record<string, string> = {
  bootcamp: '🚀',
};

function sortTutorials(a: ArticleMeta, b: ArticleMeta) {
  if (a.seriesOrder !== undefined && b.seriesOrder !== undefined) {
    return a.seriesOrder - b.seriesOrder;
  }
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getOptionalStaticArticleParams('tutorials', routing.locales);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  const isZh = locale === 'zh';

  if (slug.length === 0) {
    return buildPageMetadata({
      locale,
      pathname: '/tutorials',
      title: isZh ? '7天实战营 | HermesAgent 101' : '7-Day Bootcamp | HermesAgent 101',
      description: isZh
        ? '从零开始，每天一个主题，7天掌握你的 AI 私人助理。'
        : 'From zero to AI automation expert. One topic per day, master Hermes Agent in 7 days.',
    });
  }

  const article = getArticleBySlug('tutorials', slug, locale);
  if (!article) return {};

  const title = isZh ? article.meta.titleZh : article.meta.title;
  const description = isZh ? article.meta.descriptionZh : article.meta.description;
  const canonicalUrl = `https://hermesagent.sbs/${locale}/tutorials/${slug.join('/')}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://hermesagent.sbs/en/tutorials/${slug.join('/')}`,
        zh: `https://hermesagent.sbs/zh/tutorials/${slug.join('/')}`,
        'x-default': `https://hermesagent.sbs/en/tutorials/${slug.join('/')}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.meta.publishedAt,
      modifiedTime: article.meta.updatedAt,
      locale: isZh ? 'zh_CN' : 'en_US',
    },
  };
}

function TutorialIndex({ locale }: { locale: string }) {
  const t = createTranslator(locale);
  const isZh = locale === 'zh';
  const tutorials = getArticles('tutorials', locale).sort(sortTutorials);

  return (
    <div className={listStyles.page}>
      <h1 className={listStyles.pageTitle}>{t('nav.tutorials')}</h1>
      <p className={listStyles.pageDesc}>
        {isZh
          ? '从零开始，每天一个主题，7天掌握你的 AI 私人助理。'
          : 'From zero to AI automation expert. One topic per day, master Hermes Agent in 7 days.'}
      </p>

      <div className={listStyles.grid}>
        {tutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial.urlPath}
            href={`/${locale}/tutorials/${tutorial.urlPath ?? tutorial.slug}`}
            icon={categoryIcons[tutorial.category] ?? '📌'}
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

function TutorialArticle({ locale, slug }: { locale: string; slug: string[] }) {
  const article = getArticleBySlug('tutorials', slug, locale);

  if (!article) notFound();

  const isZh = locale === 'zh';
  const title = isZh ? article.meta.titleZh : article.meta.title;
  const description = isZh ? article.meta.descriptionZh : article.meta.description;
  const headings = extractHeadings(article.content);
  const htmlContent = renderMarkdown(article.content);
  const urlPath = slug.join('/');
  const relatedArticles = getRelatedArticles('tutorials', locale, urlPath, article.meta.category);
  const structuredData = serializeJsonLd([
    buildBreadcrumbJsonLd({
      baseUrl: 'https://hermesagent.sbs',
      locale,
      type: 'tutorials',
      title,
      urlPath,
    }),
    buildArticleJsonLd({
      baseUrl: 'https://hermesagent.sbs',
      locale,
      type: 'tutorials',
      title,
      description,
      urlPath,
      publishedAt: article.meta.publishedAt,
      updatedAt: article.meta.updatedAt,
      author: article.meta.author,
      category: article.meta.category,
      tags: article.meta.tags,
    }),
  ]);

  const difficultyLabels = {
    beginner: isZh ? '入门' : 'Beginner',
    intermediate: isZh ? '中级' : 'Intermediate',
    advanced: isZh ? '高级' : 'Advanced',
  };

  return (
    <div className={articleStyles.articlePage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <nav className={articleStyles.breadcrumb} aria-label="Breadcrumb">
        <Link href={`/${locale}`}>{isZh ? '首页' : 'Home'}</Link>
        <span className={articleStyles.breadcrumbSep}>/</span>
        <Link href={`/${locale}/tutorials`}>{isZh ? '7天实战营' : '7-Day Bootcamp'}</Link>
        <span className={articleStyles.breadcrumbSep}>/</span>
        <span className={articleStyles.breadcrumbCurrent}>{title}</span>
      </nav>

      <div className={articleStyles.layout}>
        <article className={articleStyles.article}>
          <header className={articleStyles.articleHeader}>
            <h1 className={articleStyles.articleTitle}>{title}</h1>
            <div className={articleStyles.articleMeta}>
              <DifficultyBadge level={article.meta.difficulty} label={difficultyLabels[article.meta.difficulty]} />
              <span>⏱ {article.meta.readingTime} {isZh ? '分钟阅读' : 'min read'}</span>
              <span>📅 {article.meta.publishedAt}</span>
              <span>👤 {article.meta.author}</span>
            </div>
          </header>

          <div
            className={articleStyles.articleContent}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className={articleStyles.seriesNav}>
            <Link href={`/${locale}/tutorials`} className={articleStyles.seriesLink}>
              <span className={articleStyles.seriesLinkLabel}>← {isZh ? '返回教程' : 'Back to Tutorials'}</span>
              {isZh ? '教程列表' : 'Tutorial Index'}
            </Link>
          </div>
        </article>

        <aside className={articleStyles.sidebar}>
          <h4 className={articleStyles.tocTitle}>{isZh ? '页面目录' : 'On this page'}</h4>
          <ul className={articleStyles.tocList}>
            {headings.filter((heading) => heading.level === 2).map((heading) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`} className={articleStyles.tocItem}>{heading.text}</a>
              </li>
            ))}
          </ul>

          <div className={articleStyles.sidebarSection}>
            <h4 className={articleStyles.tocTitle}>{isZh ? '相关推荐' : 'Related'}</h4>
            <ul className={articleStyles.relatedList}>
              {relatedArticles.map((entry) => (
                <li key={entry.urlPath}>
                  <Link href={`/${locale}/tutorials/${entry.urlPath}`} className={articleStyles.relatedLink}>
                    {isZh ? entry.titleZh : entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default async function TutorialsRoutePage({ params }: Props) {
  const { locale, slug = [] } = await params;
  setRequestLocale(locale);

  if (slug.length === 0) {
    return <TutorialIndex locale={locale} />;
  }

  return <TutorialArticle locale={locale} slug={slug} />;
}
