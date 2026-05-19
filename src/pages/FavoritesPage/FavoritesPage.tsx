import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import { CardSkill } from '@/widgets/SkillCard/CardSkill';
import { useFavorites } from '@/shared/hooks/useFavorites';
import type { User } from '@/api';
import styles from './FavoritesPage.module.css';

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

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setIsLoggedIn(true);
  }, [navigate]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchSkills = async () => {
      try {
        const response = await fetch('/db/skills.json');
        const data = await response.json();
        const skillsData = data.data || data.skills || [];
        setSkills(skillsData);
      } catch (error) {
        console.error('Ошибка загрузки навыков:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const favoriteSkills = skills.filter((skill) => favorites.includes(skill.id));

  if (loading) {
    return (
      <>
        <Header isLoggedIn={true} />
        <main className={styles.main}>
          <div className={styles.container}>
            <p>Загрузка...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (favoriteSkills.length === 0) {
    return (
      <>
        <Header isLoggedIn={true} />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.emptyState}>
              <h2>Избранное пусто</h2>
              <p>Добавляйте навыки в избранное, чтобы не потерять их</p>
              <Link to="/" className={styles.backLink}>
                Вернуться в каталог
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header isLoggedIn={true} />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Избранное</h1>
          <div className={styles.grid}>
            {favoriteSkills.map((skill) => (
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
                initialLiked={true}
                isAuthenticated={isAuthenticated}
                userAuthenticated={userAuthenticated}
                variant="default"
                skills={[]}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FavoritesPage;