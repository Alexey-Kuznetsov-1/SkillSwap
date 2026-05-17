import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useFavorites } from '@/shared/hooks/useFavorites';
import { CardSkill } from '@/widgets/SkillCard/CardSkill';
import type { User } from '@/api';
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

  const userAuthenticated: User = {
    id: 1,
    name: 'Текущий пользователь',
    avatarUrl: '',
    email: '',
    about: '',
    birthDay: '',
    gender: '',
    cityId: 1,
    registrationDate: '',
  };

  const isAuthenticated = !!localStorage.getItem('token');

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
          <CardSkill
            key={skill.id}
            idSkill={skill.id}
            skillName={skill.name}
            descriptionSkill={skill.description}
            typeSkill={skill.type}
            authorName={skill.author}
            authorCity={skill.authorCity}
            authorAge={skill.authorAge}
            authorAvatar={skill.authorAvatar}
            initialLiked={isFavorite(skill.id)}
            isAuthenticated={isAuthenticated}
            userAuthenticated={userAuthenticated}
            variant="default"
            skills={[]}
          />
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