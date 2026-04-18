import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            Hermes<span className={styles.footerLogoAccent}>Agent</span>
          </div>
          <p className={styles.footerDesc}>
            {t('site.description')}
          </p>
        </div>

        <div className={styles.footerCol}>
          <h4>{t('nav.tutorials')}</h4>
          <ul>
            <li><Link href={`/${locale}/tutorials`}>{t('nav.tutorials')}</Link></li>
            <li><Link href={`/${locale}/resources`}>{t('nav.resources')}</Link></li>
            <li><Link href={`/${locale}/blog`}>{t('nav.blog')}</Link></li>
            <li><Link href={`/${locale}/learning-path`}>{t('nav.learningPath')}</Link></li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4>{t('footer.community')}</h4>
          <ul>
            <li><a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noopener noreferrer">{t('footer.github')}</a></li>
            <li><a href="https://discord.gg/nousresearch" target="_blank" rel="noopener noreferrer">{t('footer.discord')}</a></li>
            <li><a href="https://twitter.com/NousResearch" target="_blank" rel="noopener noreferrer">{t('footer.twitter')}</a></li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4>{t('footer.legal')}</h4>
          <ul>
            <li><Link href={`/${locale}/privacy`}>{t('footer.privacy')}</Link></li>
            <li><Link href={`/${locale}/terms`}>{t('footer.terms')}</Link></li>
            <li><Link href={`/${locale}/contact`}>{t('footer.contact')}</Link></li>
            <li><Link href={`/${locale}/about`}>{t('nav.about')}</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span className={styles.copyright}>{t('footer.copyright')}</span>
        <div className={styles.socialLinks}>
          <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
            ▣
          </a>
          <a href="https://discord.gg/nousresearch" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Discord">
            ◈
          </a>
          <a href="https://twitter.com/NousResearch" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
            ✕
          </a>
        </div>
      </div>
    </footer>
  );
}
