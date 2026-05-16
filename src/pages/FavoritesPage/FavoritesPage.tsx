import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import { useFavorites } from '@/shared/hooks/useFavorites';
import styles from './FavoritesPage.module.css';

interface Skill {
  id: number;
  title: string;
  description: string;
  author: string;
  authorCity: string;
}

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        setSkills(data.skills || []);
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
              <div key={skill.id} className={styles.card}>
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
                <div className={styles.cardFooter}>
                  <span>{skill.author}, {skill.authorCity}</span>
                  <span>❤️</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FavoritesPage;