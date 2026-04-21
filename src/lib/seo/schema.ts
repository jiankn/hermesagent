type ContentType = 'tutorials' | 'guides' | 'blog';

interface BreadcrumbInput {
  baseUrl: string;
  locale: string;
  type: ContentType;
  title: string;
  urlPath: string;
}

interface ArticleInput {
  baseUrl: string;
  locale: string;
  type: ContentType;
  title: string;
  description: string;
  urlPath: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  category: string;
  tags: string[];
}

function getSectionLabel(type: ContentType, locale: string) {
  if (type === 'guides') {
    return locale === 'zh' ? '指南' : 'Guides';
  }

  if (type === 'blog') {
    return locale === 'zh' ? '博客' : 'Blog';
  }

  return locale === 'zh' ? '教程' : 'Tutorials';
}

export function buildBreadcrumbJsonLd({
  baseUrl,
  locale,
  type,
  title,
  urlPath,
}: BreadcrumbInput) {
  const homeLabel = locale === 'zh' ? '首页' : 'Home';
  const sectionLabel = getSectionLabel(type, locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: sectionLabel,
        item: `${baseUrl}/${locale}/${type}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${baseUrl}/${locale}/${type}/${urlPath}`,
      },
    ],
  };
}

export function buildArticleJsonLd({
  baseUrl,
  locale,
  type,
  title,
  description,
  urlPath,
  publishedAt,
  updatedAt,
  author,
  category,
  tags,
}: ArticleInput) {
  const communityName = locale === 'zh' ? 'Hermes Agent 学习社区' : 'Hermes Agent Community';

  return {
    '@context': 'https://schema.org',
    '@type': type === 'blog' ? 'BlogPosting' : 'TechArticle',
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    articleSection: category,
    keywords: tags.join(', '),
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: communityName,
      url: `${baseUrl}/${locale}`,
    },
    mainEntityOfPage: `${baseUrl}/${locale}/${type}/${urlPath}`,
  };
}

export function buildWebSiteJsonLd(baseUrl: string, locale: string) {
  const name = locale === 'zh' ? 'Hermes Agent 学习社区' : 'Hermes Agent Community';
  const description = locale === 'zh'
    ? 'Hermes Agent 一站式学习社区'
    : 'The definitive learning hub for Hermes Agent';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url: `${baseUrl}/${locale}/`,
  };
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function serializeJsonLd(payload: unknown) {
  return JSON.stringify(payload).replace(/</g, '\\u003c');
}
