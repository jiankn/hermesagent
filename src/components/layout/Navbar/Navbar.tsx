'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const navItems = [
    { href: `/${locale}/tutorials`, label: t('tutorials') },
    { href: `/${locale}/resources`, label: t('resources') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/learning-path`, label: t('learningPath') },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <Link href={`/${locale}`} className={styles.brand}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="6" r="2" />
            <circle cx="16" cy="6" r="2" />
            <circle cx="8" cy="18" r="2" />
            <circle cx="16" cy="18" r="2" />
            <path d="M8 8v8" />
            <path d="M16 8v8" />
            <path d="M8 12h8" />
          </svg>
          Hermes<span className={styles.brandAccent}>Agent</span>
        </Link>

        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
          <button
            className={styles.langBtn}
            onClick={switchLocale}
            aria-label={t('language')}
          >
            🌐 {locale === 'en' ? 'EN / 中文' : '中文 / EN'}
          </button>
        </div>

        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <button className={styles.langBtn} onClick={switchLocale}>
          🌐 {locale === 'en' ? 'EN / 中文' : '中文 / EN'}
        </button>
      </div>
    </>
  );
}
