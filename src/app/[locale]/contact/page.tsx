import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from '../static.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return buildPageMetadata({
    locale,
    pathname: '/contact',
    title: isZh ? '联系 Hermes Agent 学习社区' : 'Contact Hermes Agent Community',
    description: isZh
      ? '获取反馈、合作与内容贡献联系方式。'
      : 'Get in touch for feedback, partnerships, and content contributions.',
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{isZh ? '联系我们' : 'Contact'}</h1>
      <div className={styles.content}>
        <p>
          {isZh
            ? '我们很乐意听取你的反馈、建议或合作意向。'
            : 'We\'d love to hear your feedback, suggestions, or partnership ideas.'}
        </p>

        <h2>{isZh ? '联系方式' : 'Get in Touch'}</h2>
        <ul>
          <li>📧 Email: <a href="mailto:hello@hermesagent.sbs">hello@hermesagent.sbs</a></li>
          <li>🐙 GitHub: <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noopener noreferrer">NousResearch/hermes-agent</a></li>
          <li>💬 Discord: <a href="https://discord.gg/nousresearch" target="_blank" rel="noopener noreferrer">discord.gg/nousresearch</a></li>
        </ul>

        <h2>{isZh ? '内容贡献' : 'Content Contributions'}</h2>
        <p>
          {isZh
            ? '欢迎提交教程、指南或翻译改进。请通过 GitHub Pull Request 提交。'
            : 'We welcome tutorial submissions, guide contributions, and translation improvements. Please submit via GitHub Pull Request.'}
        </p>
      </div>
    </div>
  );
}
