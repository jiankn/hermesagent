'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import styles from './CookieConsent.module.css';

const STORAGE_KEY = 'hermesagent_cookie_consent';

type ConsentState = 'accepted' | 'rejected' | null;

export default function CookieConsent() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [consent, setConsent] = useState<ConsentState>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setConsent(stored === 'accepted' || stored === 'rejected' ? stored : null);
    setLoaded(true);
  }, []);

  const saveConsent = (value: Exclude<ConsentState, null>) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  };

  if (!loaded || consent) {
    return null;
  }

  return (
    <section className={styles.banner} aria-label={isZh ? 'Cookie 同意' : 'Cookie consent'}>
      <div className={styles.copy}>
        <strong>{isZh ? 'Cookie 与广告同意' : 'Cookie and ads consent'}</strong>
        <p>
          {isZh
            ? '我们使用必要 Cookie，并可能通过 Google 等第三方供应商使用广告和分析 Cookie 来改进内容、衡量访问和投放相关广告。你可以接受或拒绝非必要 Cookie。'
            : 'We use necessary cookies and may use advertising and analytics cookies from third-party vendors, including Google, to improve content, measure visits, and serve relevant ads. You can accept or reject non-essential cookies.'}
        </p>
        <Link href={`/${locale}/privacy`} className={styles.privacyLink}>
          {isZh ? '查看隐私政策' : 'Read privacy policy'}
        </Link>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.rejectButton} onClick={() => saveConsent('rejected')}>
          {isZh ? '拒绝' : 'Reject'}
        </button>
        <button type="button" className={styles.acceptButton} onClick={() => saveConsent('accepted')}>
          {isZh ? '接受' : 'Accept'}
        </button>
      </div>
    </section>
  );
}
