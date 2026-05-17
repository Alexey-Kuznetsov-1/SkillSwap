import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useFavorites } from '@/shared/hooks/useFavorites';
import styles from './Catalog.module.css';

interface Skill {
  id: number;
  name: string;
  description: string;
  type: 'teach' | 'learn';
  userId: number;
  author: string;
  authorCity: string;
  authorAge: number;
  authorAvatar: string;
}

interface CatalogProps {
  skills: Skill[];
  itemsPerPage?: number;
}

const Catalog: React.FC<CatalogProps> = ({ skills, itemsPerPage = 6 }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDisplayedCount(itemsPerPage);
    setHasMore(true);
  }, [skills, itemsPerPage]);

  const displayedSkills = skills.slice(0, displayedCount);

  useEffect(() => {
    setHasMore(displayedCount < skills.length);
  }, [displayedCount, skills]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      setDisplayedCount((prev) => Math.min(prev + itemsPerPage, skills.length));
    }
  }, [hasMore, itemsPerPage, skills.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

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
        {displayedSkills.map((skill) => (
          <div key={skill.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.authorName}>{skill.author}</h3>
                <p className={styles.authorInfo}>
                  {skill.authorCity}, {skill.authorAge} лет
                </p>
                <p className={styles.skillTitle}>{skill.name}</p>
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
      {hasMore && (
        <div ref={loaderRef} className={styles.loader}>
          Загрузка...
        </div>
      )}
    </div>
  );
};

export default Catalog;