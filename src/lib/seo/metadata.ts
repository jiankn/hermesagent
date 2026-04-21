import type { Metadata } from 'next';

export const SITE_URL = 'https://hermesagent.sbs';

type SupportedLocale = 'en' | 'zh';
type OpenGraphType = 'website' | 'article';

type BuildPageMetadataInput = {
  locale: string;
  pathname?: string;
  title: string;
  description: string;
  openGraphType?: OpenGraphType;
  publishedTime?: string;
  modifiedTime?: string;
};

const DEFAULT_LOCALE: SupportedLocale = 'en';
const SITE_NAME: Record<SupportedLocale, string> = {
  en: 'Hermes Agent Community',
  zh: 'Hermes Agent 学习社区',
};
const OPEN_GRAPH_LOCALE: Record<SupportedLocale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

function normalizeLocale(locale: string): SupportedLocale {
  return locale === 'zh' ? 'zh' : DEFAULT_LOCALE;
}

function normalizePathname(pathname = ''): string {
  if (!pathname || pathname === '/') {
    return '';
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function buildLocaleUrl(locale: string, pathname = ''): string {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedPath = normalizePathname(pathname);
  // Ensure trailing slash for SEO compliance (except if it already has it)
  const pathWithSlash = normalizedPath === '' ? '/' : normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`;
  return `${SITE_URL}/${normalizedLocale}${pathWithSlash}`;
}

export function buildPageMetadata({
  locale,
  pathname = '',
  title,
  description,
  openGraphType = 'website',
  publishedTime,
  modifiedTime,
}: BuildPageMetadataInput): Metadata {
  const normalizedLocale = normalizeLocale(locale);
  const canonicalUrl = buildLocaleUrl(normalizedLocale, pathname);
  const normalizedPathname = normalizePathname(pathname);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: buildLocaleUrl('en', normalizedPathname),
        zh: buildLocaleUrl('zh', normalizedPathname),
        'x-default': buildLocaleUrl(DEFAULT_LOCALE, normalizedPathname),
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: openGraphType,
      siteName: SITE_NAME[normalizedLocale],
      locale: OPEN_GRAPH_LOCALE[normalizedLocale],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
  };
}
