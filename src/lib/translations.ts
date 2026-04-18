import enMessages from '../../messages/en.json';
import zhMessages from '../../messages/zh.json';

type Messages = typeof enMessages;

/**
 * Simple translation helper that bypasses next-intl server APIs
 * to avoid the workStore InvariantError in Next.js 16 static export mode.
 */
export function getMessages(locale: string): Messages {
  return locale === 'zh' ? zhMessages : enMessages;
}

/**
 * Get a nested translation value by dot-separated key.
 * Example: t('hero.title') returns messages.hero.title
 */
export function createTranslator(locale: string) {
  const messages = getMessages(locale);

  return function t(key: string): string {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = messages;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // fallback: return the key itself
      }
    }
    return typeof value === 'string' ? value : key;
  };
}
