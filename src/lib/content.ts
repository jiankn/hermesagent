import contentManifest from '@/generated/content-manifest.json';

export type ContentType = 'tutorials' | 'guides' | 'blog';

export interface ArticleMeta {
  title: string;
  titleZh?: string;
  slug?: string;
  description: string;
  descriptionZh?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime?: number;
  series?: string;
  seriesOrder?: number;
  featured?: boolean;
  urlPath?: string;
  slugSegments?: string[];
  locale?: string;
  type?: ContentType;
}

export interface Article {
  meta: ArticleMeta;
  content: string;
}

type GeneratedContentManifest = Record<ContentType, Record<string, Article[]>>;

const manifest = contentManifest as GeneratedContentManifest;

function getLocalizedArticles(type: ContentType, locale: string): Article[] {
  return manifest[type]?.[locale] ?? [];
}

function sortArticlesByPublishedDate(a: ArticleMeta, b: ArticleMeta) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export function getArticles(
  type: ContentType,
  locale: string
): ArticleMeta[] {
  return getLocalizedArticles(type, locale)
    .map((article) => article.meta)
    .sort(sortArticlesByPublishedDate);
}

export function getArticleBySlug(
  type: ContentType,
  slugParts: string[],
  locale: string
): Article | null {
  const slugPath = slugParts.join('/');

  return getLocalizedArticles(type, locale).find((article) => article.meta.urlPath === slugPath) ?? null;
}

export function getAllSlugs(
  type: ContentType,
  locale: string
): string[][] {
  return getLocalizedArticles(type, locale).map((article) => {
    const slugSegments = article.meta.slugSegments;

    if (slugSegments && slugSegments.length > 0) {
      return slugSegments;
    }

    return (article.meta.urlPath ?? '').split('/').filter(Boolean);
  });
}

export function getStaticArticleParams(
  type: ContentType,
  locales: readonly string[]
): { locale: string; slug: string[] }[] {
  return locales.flatMap((locale) =>
    getAllSlugs(type, locale).map((slug) => ({ locale, slug }))
  );
}

export function getOptionalStaticArticleParams(
  type: ContentType,
  locales: readonly string[]
): { locale: string; slug: string[] }[] {
  return locales.flatMap((locale) => [
    { locale, slug: [] },
    ...getAllSlugs(type, locale).map((slug) => ({ locale, slug })),
  ]);
}
