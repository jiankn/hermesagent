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
    pathname: '/privacy',
    title: isZh ? '隐私政策' : 'Privacy Policy',
    description: isZh
      ? '了解 Hermes Agent Community 如何处理网站使用数据与订阅信息。'
      : 'Learn how Hermes Agent Community handles website analytics, newsletter subscriptions, and personal data.',
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Privacy Policy</h1>
      <div className={styles.content}>
        <p><strong>Last updated:</strong> April 18, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>We collect minimal information necessary to operate the website:</p>
        <ul>
          <li>Anonymous usage analytics (page views, device type)</li>
          <li>Email address if you subscribe to our newsletter</li>
        </ul>

        <h2>2. How We Use Information</h2>
        <p>We use collected information solely to:</p>
        <ul>
          <li>Improve website content and user experience</li>
          <li>Send newsletter updates (with your consent)</li>
        </ul>

        <h2>3. Cookies and Google AdSense</h2>
        <p>We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. We also share information about your use of our site with our social media, advertising and analytics partners.</p>
        <ul>
          <li>Third party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to your website or other websites.</li>
          <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
          <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
        </ul>

        <h2>4. Third-Party Services</h2>
        <p>We may use third-party services including Cloudflare (hosting), Google Analytics (analytics), and email delivery services. Each service has its own privacy policy.</p>

        <h2>5. Data Retention</h2>
        <p>We retain your data only as long as necessary for the purposes described above. You can request deletion at any time.</p>

        <h2>6. Contact</h2>
        <p>For privacy inquiries: <a href="mailto:privacy@hermesagent.sbs">privacy@hermesagent.sbs</a></p>
      </div>
    </div>
  );
}
