import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from '../static.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    pathname: '/terms',
    title: isZh ? '服务条款' : 'Terms of Service',
    description: isZh
      ? '查看 Hermes Agent Community 的服务条款、免责声明与使用规范。'
      : 'Review the terms, disclaimers, and acceptable use guidelines for Hermes Agent Community.',
  });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Terms of Service</h1>
      <div className={styles.content}>
        <p><strong>Last updated:</strong> April 18, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing hermesagent.sbs, you agree to these Terms of Service. If you disagree, please do not use this website.</p>

        <h2>2. Content and Automation Scripts</h2>
        <p>All tutorials, guides, and automation scripts (Recipes) are provided for educational purposes. While we strive for accuracy, we make no warranties about completeness or suitability for any purpose. You are solely responsible for any actions taken by your AI agents based on our tutorials.</p>

        <h2>3. User Conduct</h2>
        <p>You agree not to: misuse the website, attempt unauthorized access, or redistribute content without attribution.</p>

        <h2>4. Intellectual Property</h2>
        <p>Original content on this site is © 2026 HermesAgent 101. Code examples are provided under the MIT license unless otherwise noted.</p>

        <h2>5. Disclaimer</h2>
        <p>This is an independent resource hub and is not officially affiliated with Nous Research. Hermes Agent is an open-source project by Nous Research.</p>

        <h2>6. Contact</h2>
        <p>For questions: <a href="mailto:hello@hermesagent.sbs">hello@hermesagent.sbs</a></p>
      </div>
    </div>
  );
}
