import Link from 'next/link';
import type { Metadata } from 'next';
import DifficultyBadge from '@/components/ui/DifficultyBadge/DifficultyBadge';
import { getArticleBySlug, getAllSlugs } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/schema';
import { extractHeadings, renderMarkdown } from '@/lib/article-render';
import { getRelatedArticles } from '@/lib/related-articles';
import styles from '../../tutorials/[...slug]/page.module.css';

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = [];
  for (const locale of routing.locales) {
    const slugs = getAllSlugs('blog', locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug('blog', slug, locale);
  if (!article) return {};

  const isZh = locale === 'zh';
  const title = isZh ? article.meta.titleZh : article.meta.title;
  const description = isZh ? article.meta.descriptionZh : article.meta.description;
  const canonicalUrl = `https://hermesagent.sbs/${locale}/blog/${slug.join('/')}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://hermesagent.sbs/en/blog/${slug.join('/')}`,
        zh: `https://hermesagent.sbs/zh/blog/${slug.join('/')}`,
        'x-default': `https://hermesagent.sbs/en/blog/${slug.join('/')}`,
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

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = getArticleBySlug('blog', slug, locale);

  if (!article) return <div>Article not found</div>;

  const isZh = locale === 'zh';
  const title = isZh ? article.meta.titleZh : article.meta.title;
  const description = isZh ? article.meta.descriptionZh : article.meta.description;
  const headings = extractHeadings(article.content);
  const htmlContent = renderMarkdown(article.content);
  const urlPath = slug.join('/');
  const relatedArticles = getRelatedArticles('blog', locale, urlPath, article.meta.category);
  const structuredData = serializeJsonLd([
    buildBreadcrumbJsonLd({
      baseUrl: 'https://hermesagent.sbs',
      locale,
      type: 'blog',
      title,
      urlPath,
    }),
    buildArticleJsonLd({
      baseUrl: 'https://hermesagent.sbs',
      locale,
      type: 'blog',
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

  const difficultyLabels = { beginner: isZh ? '入门' : 'Beginner', intermediate: isZh ? '中级' : 'Intermediate', advanced: isZh ? '高级' : 'Advanced' };

  return (
    <div className={styles.articlePage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href={`/${locale}`}>{isZh ? '首页' : 'Home'}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href={`/${locale}/blog`}>{isZh ? '博客' : 'Blog'}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{title}</span>
      </nav>

      <div className={styles.layout}>
        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{title}</h1>
            <div className={styles.articleMeta}>
              <DifficultyBadge level={article.meta.difficulty} label={difficultyLabels[article.meta.difficulty]} />
              <span>⏱ {article.meta.readingTime} {isZh ? '分钟阅读' : 'min read'}</span>
              <span>📅 {article.meta.publishedAt}</span>
              <span>👤 {article.meta.author}</span>
            </div>
          </header>

          <div
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className={styles.seriesNav}>
            <Link href={`/${locale}/blog`} className={styles.seriesLink}>
              <span className={styles.seriesLinkLabel}>← {isZh ? '返回博客' : 'Back to Blog'}</span>
              {isZh ? '博客列表' : 'Blog Index'}
            </Link>
          </div>
        </article>

        <aside className={styles.sidebar}>
          <h4 className={styles.tocTitle}>{isZh ? '页面目录' : 'On this page'}</h4>
          <ul className={styles.tocList}>
            {headings.filter((h) => h.level === 2).map((heading) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`} className={styles.tocItem}>{heading.text}</a>
              </li>
            ))}
          </ul>

          <div className={styles.sidebarSection}>
            <h4 className={styles.tocTitle}>{isZh ? '相关推荐' : 'Related'}</h4>
            <ul className={styles.relatedList}>
              {relatedArticles.map((entry) => (
                <li key={entry.urlPath}>
                  <Link href={`/${locale}/blog/${entry.urlPath}`} className={styles.relatedLink}>
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
