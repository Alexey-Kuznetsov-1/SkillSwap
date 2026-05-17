import React from 'react';
import { useFavorites } from '@/shared/hooks/useFavorites';
import styles from './Catalog.module.css';

interface Skill {
  id: number;
  title: string;
  description: string;
  type: 'teach' | 'learn';
  userId: number;
  author: string;
  authorCity: string;
  authorAge: number;
}

interface CatalogProps {
  skills: Skill[];
}

const Catalog: React.FC<CatalogProps> = ({ skills }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (skills.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Ничего не найдено</p>
      </div>
    );
  }

  return (
    <div className={styles.catalog}>
      <div className={styles.grid}>
        {skills.map((skill) => (
          <div key={skill.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.authorName}>{skill.author}</h3>
                <p className={styles.authorInfo}>
                  {skill.authorCity}, {skill.authorAge} лет
                </p>
                <p className={styles.skillTitle}>{skill.title}</p>
              </div>
              <button
                className={styles.favoriteButton}
                onClick={() => toggleFavorite(skill.id)}
              >
                {isFavorite(skill.id) ? '❤️' : '🤍'}
              </button>
            </div>
            <p className={styles.description}>{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;