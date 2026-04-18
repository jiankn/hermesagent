import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { createTranslator } from '@/lib/translations';
import FAQAccordion from '@/components/ui/FAQAccordion/FAQAccordion';
import { buildPageMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    pathname: '/faq',
    title: isZh ? 'Hermes Agent 常见问题' : 'Hermes Agent FAQ',
    description: isZh
      ? '查看 Hermes Agent 学习、安装与使用的常见问题解答。'
      : 'Answers to common questions about learning, installing, and using Hermes Agent.',
  });
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = createTranslator(locale);
  const isZh = locale === 'zh';

  const faqItems = [
    { question: t('faqItems.q1'), answer: t('faqItems.a1') },
    { question: t('faqItems.q2'), answer: t('faqItems.a2') },
    { question: t('faqItems.q3'), answer: t('faqItems.a3') },
    { question: t('faqItems.q4'), answer: t('faqItems.a4') },
    { question: t('faqItems.q5'), answer: t('faqItems.a5') },
  ];

  return (
    <div>
      <FAQAccordion
        title={isZh ? '常见问题' : 'Frequently Asked Questions'}
        items={faqItems}
      />
    </div>
  );
}
