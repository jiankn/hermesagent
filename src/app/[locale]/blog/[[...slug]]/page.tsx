import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DifficultyBadge from '@/components/ui/DifficultyBadge/DifficultyBadge';
import {
  getArticleBySlug,
  getArticles,
  getOptionalStaticArticleParams,
} from '@/lib/content';
import { routing } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/schema';
import { extractHeadings, renderMarkdown } from '@/lib/article-render';
import { getRelatedArticles } from '@/lib/related-articles';
import listStyles from '../../tutorials/page.module.css';
import articleStyles from '../../tutorials/[...slug]/page.module.css';

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getOptionalStaticArticleParams('blog', routing.locales);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  const isZh = locale === 'zh';

  if (slug.length === 0) {
    return buildPageMetadata({
      locale,
      pathname: '/blog',
      title: isZh ? 'Hermes Agent 博客' : 'Hermes Agent Blog',
      description: isZh
        ? '版本发布、架构解读与社区内容运营观察。'
        : 'Release notes, architecture analysis, and editorial updates for Hermes Agent.',
    });
  }

  const article = getArticleBySlug('blog', slug, locale);
  if (!article) return {};

  const title = isZh ? (article.meta.titleZh || article.meta.title) : article.meta.title;
  const description = isZh ? (article.meta.descriptionZh || article.meta.description) : article.meta.description;
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

function BlogIndex({ locale }: { locale: string }) {
  const isZh = locale === 'zh';
  const posts = getArticles('blog', locale);

  return (
    <div className={listStyles.page}>
      <h1 className={listStyles.pageTitle}>{isZh ? '博客' : 'Blog'}</h1>
      <p className={listStyles.pageDesc}>
        {isZh
          ? '发布版本解读、架构观察和内容运营复盘。'
          : 'Release notes, architecture observations, and editorial analysis for Hermes Agent.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '760px' }}>
        {posts.map((post) => (
          <article
            key={post.urlPath}
            style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}
          >
            <time style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.publishedAt}</time>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
              <Link href={`/${locale}/blog/${post.urlPath}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {isZh ? (post.titleZh || post.title) : post.title}
              </Link>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 0 }}>
              {isZh ? (post.descriptionZh || post.description) : post.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function BlogArticle({ locale, slug }: { locale: string; slug: string[] }) {
  const article = getArticleBySlug('blog', slug, locale);

  if (!article) notFound();

  const isZh = locale === 'zh';
  const title = isZh ? (article.meta.titleZh || article.meta.title) : article.meta.title;
  const description = isZh ? (article.meta.descriptionZh || article.meta.description) : article.meta.description;
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
      tags: article.meta.tags || [],
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
        <Link href={`/${locale}/blog`}>{isZh ? '博客' : 'Blog'}</Link>
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
            <Link href={`/${locale}/blog`} className={articleStyles.seriesLink}>
              <span className={articleStyles.seriesLinkLabel}>← {isZh ? '返回博客' : 'Back to Blog'}</span>
              {isZh ? '博客列表' : 'Blog Index'}
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
                  <Link href={`/${locale}/blog/${entry.urlPath}`} className={articleStyles.relatedLink}>
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

export default async function BlogRoutePage({ params }: Props) {
  const { locale, slug = [] } = await params;
  setRequestLocale(locale);

  if (slug.length === 0) {
    return <BlogIndex locale={locale} />;
  }

  return <BlogArticle locale={locale} slug={slug} />;
}
