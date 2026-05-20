import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import { CardSkill } from '@/widgets/SkillCard/CardSkill';
import { useFavorites } from '@/shared/hooks/useFavorites';
import { getSkillsCatalog } from '@/api';
import type { User, SkillCard } from '@/api';
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
  title?: string;
  category?: string;
  subCategory?: string;
  likes?: number;
}

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
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
        // Загружаем все навыки через API
        const result = await getSkillsCatalog({ limit: 100 });
        console.log('✅ FavoritesPage загружено навыков:', result.items.length);
        
        // Преобразуем для совместимости с текущим интерфейсом
        const transformedSkills: Skill[] = result.items.map(skill => ({
          id: skill.id,
          name: skill.name,
          description: skill.description,
          type: skill.direction,
          userId: skill.author.id || 0,
          author: skill.author.name,
          authorCity: skill.author.city,
          authorAge: skill.author.age,
          authorAvatar: skill.author.avatarUrl,
          category: skill.category,
          subCategory: skill.subcategory,
          likes: skill.likesCount
        }));
        
        setAllSkills(transformedSkills);
        setSkills(transformedSkills);
      } catch (error) {
        console.error('Ошибка загрузки навыков:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [isLoggedIn]);

  // Функция для получения навыков автора
  const getAuthorSkills = (authorName: string, type: 'teach' | 'learn') => {
    return allSkills
      .filter(skill => skill.author === authorName && skill.type === type)
      .map(skill => ({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        direction: skill.type,
        author: {
          name: skill.author,
          avatarUrl: skill.authorAvatar,
          city: skill.authorCity,
          age: skill.authorAge
        },
        likesCount: skill.likes || 0,
        category: skill.category || '',
        subcategory: skill.subCategory || ''
      } as SkillCard));
  };

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
            {favoriteSkills.map((skill) => {
              const authorTeachSkills = getAuthorSkills(skill.author, 'teach');
              const authorLearnSkills = getAuthorSkills(skill.author, 'learn');
              
              return (
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
                  skills={authorTeachSkills}
                  wantedSkills={authorLearnSkills}
                />
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FavoritesPage;