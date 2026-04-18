import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { SITE_URL } from '@/lib/seo/metadata';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    title: {
      template: `%s | ${isZh ? 'Hermes Agent 学习社区' : 'Hermes Agent Community'}`,
      default: isZh ? 'Hermes Agent 学习社区' : 'Hermes Agent Community',
    },
    description: isZh
      ? 'Hermes Agent 一站式学习社区 — 从安装到多 Agent 协作的完整知识库。'
      : 'The definitive learning hub for Hermes Agent — from first install to multi-agent orchestration.',
    metadataBase: new URL(SITE_URL),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  // In output:'export' mode, locale is always valid (determined by generateStaticParams)
  const { locale } = await params;
  const validLocale = routing.locales.includes(locale as 'en' | 'zh') ? locale : 'en';

  let messages;
  try {
    messages = (await import(`../../../messages/${validLocale}.json`)).default;
  } catch {
    messages = (await import(`../../../messages/en.json`)).default;
  }

  return (
    <html lang={validLocale}>
      <body>
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          <Navbar />
          <main style={{ paddingTop: 'var(--navbar-height)' }}>
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

