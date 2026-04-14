import type { MetadataRoute } from 'next';
import { getArticles, type ContentType } from '@/lib/content';

const baseUrl = 'https://hermesagent.sbs';
const locales = ['en', 'zh'] as const;
const contentTypes: ContentType[] = ['tutorials', 'guides', 'blog'];
const staticPages = ['', '/tutorials', '/guides', '/blog', '/learning-path', '/faq', '/about', '/contact', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page}`,
            zh: `${baseUrl}/zh${page}`,
          },
        },
      });
    }
  }

  for (const type of contentTypes) {
    const localizedArticles = Object.fromEntries(
      locales.map((locale) => [locale, getArticles(type, locale)])
    ) as Record<(typeof locales)[number], ReturnType<typeof getArticles>>;

    for (const locale of locales) {
      for (const article of localizedArticles[locale]) {
        if (!article.urlPath) {
          continue;
        }

        const languages = Object.fromEntries(
          locales
            .filter((candidate) => localizedArticles[candidate].some((entry) => entry.urlPath === article.urlPath))
            .map((candidate) => [candidate, `${baseUrl}/${candidate}/${type}/${article.urlPath}`])
        );

        entries.push({
          url: `${baseUrl}/${locale}/${type}/${article.urlPath}`,
          lastModified: article.updatedAt || article.publishedAt || now,
          changeFrequency: type === 'blog' ? 'monthly' : 'weekly',
          priority: type === 'tutorials' ? 0.7 : 0.6,
          alternates: {
            languages,
          },
        });
      }
    }
  }

  return entries;
}
