import Link from 'next/link';
import DifficultyBadge from '@/components/ui/DifficultyBadge/DifficultyBadge';
import styles from './TutorialCard.module.css';

interface TutorialCardProps {
  href: string;
  icon?: string;
  image?: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  difficultyLabel: string;
  readingTime?: number | string;
  readingTimeUnit: string;
  tags?: string[];
}

export default function TutorialCard({
  href, icon, image, title, description, difficulty, difficultyLabel, readingTime, readingTimeUnit, tags,
}: TutorialCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.cardImage}>
        {image ? (
          <img src={image} alt={title} className={styles.coverImage} loading="lazy" decoding="async" />
        ) : (
          icon
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <DifficultyBadge level={difficulty} label={difficultyLabel} />
          <span className={styles.readTime}>⏱ {readingTime} {readingTimeUnit}</span>
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{description}</p>
        {tags && tags.length > 0 && (
          <div className={styles.cardTags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
