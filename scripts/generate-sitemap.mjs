import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const baseUrl = 'https://hermesagent.sbs';
const locales = ['en', 'zh'];
const contentTypes = ['tutorials', 'guides', 'blog'];
const staticPages = ['', '/tutorials', '/guides', '/resources', '/blog', '/learning-path', '/faq', '/about', '/contact', '/privacy', '/terms'];

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function walkMdxFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMdxFiles(fullPath));
      continue;
    }

    if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function sortByPublishedAt(a, b) {
  return new Date(b.meta.publishedAt).getTime() - new Date(a.meta.publishedAt).getTime();
}

function getLocalizedArticles(type, locale) {
  const dir = path.join(root, 'content', type, locale);

  return walkMdxFiles(dir)
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(raw);
      const urlPath = path.relative(dir, filePath).replace(/\.mdx$/, '').split(path.sep).join('/');

      return {
        meta: {
          ...data,
          urlPath,
          slugSegments: urlPath.split('/'),
          locale,
          type,
        },
        content,
      };
    })
    .sort(sortByPublishedAt);
}

function buildContentManifest() {
  return Object.fromEntries(
    contentTypes.map((type) => [
      type,
      Object.fromEntries(locales.map((locale) => [locale, getLocalizedArticles(type, locale)])),
    ])
  );
}

function buildEntries(manifest) {
  const now = new Date().toISOString();
  const entries = [];

  for (const page of staticPages) {
    entries.push(
      ...locales.map((locale) => ({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          en: `${baseUrl}/en${page}`,
          zh: `${baseUrl}/zh${page}`,
          'x-default': `${baseUrl}/en${page}`,
        },
      }))
    );
  }

  for (const type of contentTypes) {
    const localizedArticles = Object.fromEntries(
      locales.map((locale) => [locale, manifest[type]?.[locale] ?? []])
    );

    for (const locale of locales) {
      for (const article of localizedArticles[locale]) {
        const languages = Object.fromEntries(
          locales
            .filter((candidate) =>
              localizedArticles[candidate].some((entry) => entry.meta.urlPath === article.meta.urlPath)
            )
            .map((candidate) => [candidate, `${baseUrl}/${candidate}/${type}/${article.meta.urlPath}`])
        );

        entries.push({
          url: `${baseUrl}/${locale}/${type}/${article.meta.urlPath}`,
          lastModified: article.meta.updatedAt || article.meta.publishedAt || now,
          changeFrequency: type === 'blog' ? 'monthly' : 'weekly',
          priority: type === 'tutorials' ? 0.7 : 0.6,
          alternates: {
            ...languages,
            'x-default': languages.en ?? `${baseUrl}/${locale}/${type}/${article.meta.urlPath}`,
          },
        });
      }
    }
  }

  return entries;
}

function renderSitemap(entries) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const entry of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${xmlEscape(entry.url)}</loc>`);

    for (const [locale, href] of Object.entries(entry.alternates)) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${xmlEscape(locale)}" href="${xmlEscape(href)}" />`
      );
    }

    if (entry.lastModified) {
      lines.push(`    <lastmod>${xmlEscape(entry.lastModified)}</lastmod>`);
    }

    if (entry.changeFrequency) {
      lines.push(`    <changefreq>${xmlEscape(entry.changeFrequency)}</changefreq>`);
    }

    if (typeof entry.priority === 'number') {
      lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    }

    lines.push('  </url>');
  }

  lines.push('</urlset>', '');
  return lines.join('\n');
}

const manifest = buildContentManifest();
const manifestPath = path.join(root, 'src', 'generated', 'content-manifest.json');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');

fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

const sitemapXml = renderSitemap(buildEntries(manifest));
fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });
fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

console.log(`Generated ${manifestPath}`);
console.log(`Generated ${sitemapPath}`);
