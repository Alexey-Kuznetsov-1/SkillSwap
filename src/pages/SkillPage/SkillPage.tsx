// src/pages/SkillPage/SkillPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import { CardSkill } from '@/widgets/SkillCard/CardSkill';
import styles from './SkillPage.module.css';

// Интерфейс для навыка из skills.json
interface Skill {
  id: number;
  title: string;
  description: string;
  type: 'teach' | 'learn';
  category: string;
  subCategory: string;
  author: string;
  authorCity: string;
  authorGender: string;
  authorAge: number;
  authorAvatar: string;
  likes: number;
}

// Интерфейс для пользователей из users.json
interface User {
  id: number;
  name: string;
  avatarUrl: string;
  about: string;
  cityId: number;
  birthDay: string;
  gender: string;
}

// Интерфейс для похожего навыка
interface SimilarSkill {
  id: number;
  name: string;
  authorName: string;
  authorCity: string;
  authorAge: number;
  authorAvatar: string;
  direction: 'teach' | 'learn';
  skills: {
    id: number;
    name: string;
    direction: 'teach' | 'learn';
    subcategory: null;
  }[];
}

// Маппинг категорий для отображения
const categoryLabels: Record<string, string> = {
  business: 'Бизнес и карьера',
  art: 'Творчество и искусство',
  languages: 'Иностранные языки',
  education: 'Образование и развитие',
  home: 'Дом и уют',
  health: 'Здоровье и лайфстайл',
};

const subCategoryLabels: Record<string, string> = {
  team_management: 'Управление командой',
  marketing: 'Маркетинг и реклама',
  sales: 'Продажи и переговоры',
  personal_brand: 'Личный бренд',
  resume: 'Резюме и собеседование',
  time_management: 'Тайм-менеджмент',
  project_management: 'Проектное управление',
  entrepreneurship: 'Предпринимательство',
  drawing: 'Рисование и иллюстрация',
  photography: 'Фотография',
  video_editing: 'Видеомонтаж',
  music: 'Музыка и звук',
  acting: 'Актёрское мастерство',
  creative_writing: 'Креативное письмо',
  art_therapy: 'Арт-терапия',
  diy: 'Декор и DIY',
  english: 'Английский',
  french: 'Французский',
  spanish: 'Испанский',
  german: 'Немецкий',
  chinese: 'Китайский',
  japanese: 'Японский',
  exam_prep: 'Подготовка к экзаменам (IELTS, TOEFL)',
  personal_development: 'Личностное развитие',
  learning_skills: 'Навыки обучения',
  cognitive_techniques: 'Когнитивные техники',
  speed_reading: 'Скорочтение',
  teaching_skills: 'Навыки преподавания',
  coaching: 'Коучинг',
  cleaning: 'Уборка и организация',
  home_finance: 'Домашние финансы',
  cooking: 'Приготовление еды',
  plants: 'Домашние растения',
  repair: 'Ремонт',
  storage: 'Хранение вещей',
  yoga: 'Йога и медитация',
  nutrition: 'Питание и ЗОЖ',
  mental_health: 'Ментальное здоровье',
  mindfulness: 'Осознанность',
  fitness: 'Физические тренировки',
  sleep: 'Сон и восстановление',
  work_life_balance: 'Баланс жизни и работы',
};

const SkillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [similarSkills, setSimilarSkills] = useState<SimilarSkill[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const handleLike = () => {
    console.log('Like');
  };

  const handleShare = () => {
    console.log('Share');
  };

  const handleMore = () => {
    console.log('More');
  };

  const handleNext = () => {
    const totalPages = Math.ceil(similarSkills.length / itemsPerPage);
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Переопределяем стили #root для страницы навыка
  useEffect(() => {
    const root = document.getElementById('root');
    const originalStyles: { [key: string]: string } = {};

    if (root) {
      originalStyles.width = root.style.width;
      originalStyles.maxWidth = root.style.maxWidth;
      originalStyles.border = root.style.border;
      originalStyles.margin = root.style.margin;
      originalStyles.padding = root.style.padding;

      root.style.width = '100%';
      root.style.maxWidth = '100%';
      root.style.border = 'none';
      root.style.margin = '0';
      root.style.padding = '0';
    }

    return () => {
      if (root) {
        root.style.width = originalStyles.width;
        root.style.maxWidth = originalStyles.maxWidth;
        root.style.border = originalStyles.border;
        root.style.margin = originalStyles.margin;
        root.style.padding = originalStyles.padding;
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, usersRes] = await Promise.all([
          fetch('/db/skills.json'),
          fetch('/db/users.json'),
        ]);

        const skillsData = await skillsRes.json();
        const usersData = await usersRes.json();

        const skills = skillsData.skills as Skill[];
        const users = usersData.data as User[];

        setAllSkills(skills);
        setUsers(users);

        const skill = skills.find((s) => s.id === Number(id));
        setCurrentSkill(skill || null);

        if (skill) {
          const similar = skills
            .filter((s) => s.id !== skill.id && s.category === skill.category)
            .slice(0, 8)
            .map((s) => {
              const user = users.find((u) => u.name.startsWith(s.author));
              return {
                id: s.id,
                name: s.title,
                authorName: s.author,
                authorCity: s.authorCity,
                authorAge: s.authorAge,
                authorAvatar: user?.avatarUrl || s.authorAvatar,
                direction: s.type,
                skills: [
                  {
                    id: s.id,
                    name: s.title,
                    direction: s.type,
                    subcategory: null,
                  },
                ],
              };
            });
          setSimilarSkills(similar);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleOfferExchange = () => {
    console.log('Предложить обмен для навыка:', id);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Header onSearch={handleSearch} />
        </div>
        <div className={styles.content}>
          <div className={styles.mainBlock}>
            <div className={styles.loading}>Загрузка...</div>
          </div>
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    );
  }

  if (!currentSkill) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Header onSearch={handleSearch} />
        </div>
        <div className={styles.content}>
          <div className={styles.mainBlock}>
            <div className={styles.errorBlock}>
              <h2>Навык не найден</h2>
              <p>Запрошенный навык не существует или был удален.</p>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    );
  }

  const currentUser = users.find((u) => u.name.startsWith(currentSkill.author));
  const userAvatar = currentUser?.avatarUrl || currentSkill.authorAvatar;

  const userSkills = allSkills.filter(
    (s) => s.author === currentSkill.author && s.type === 'teach',
  );
  const canTeach = userSkills.map((s) => s.title);

  const totalPages = Math.ceil(similarSkills.length / itemsPerPage);
  const currentSkills = similarSkills.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Header onSearch={handleSearch} />
      </div>
      <div className={styles.content}>
        <div className={styles.mainBlock}>
          {/* Верхний блок */}
          <div className={styles.topBlock}>
            {/* Левая колонка — карточка пользователя */}
            <div className={styles.leftBlock}>
              <CardSkill
                variant='description'
                idSkill={currentSkill.id}
                skillName={currentSkill.title}
                descriptionSkill={currentSkill.description}
                descriptionUser={`Привет! Я ${currentSkill.author}, ${currentSkill.authorCity}, ${currentSkill.authorAge} года.`}
                typeSkill={currentSkill.type}
                authorName={currentSkill.author}
                authorCity={currentSkill.authorCity}
                authorAge={currentSkill.authorAge}
                authorAvatar={userAvatar}
                initialLiked={false}
                isAuthenticated={false}
                skills={canTeach.map((skill, index) => ({
                  id: index,
                  name: skill,
                  direction: 'teach' as const,
                  subcategory: null,
                }))}
              />
            </div>

            {/* Правая колонка — карточка навыка */}
            <div className={styles.rightBlock}>
              <div className={styles.skillCard}>
                {/* Блок с иконками */}
                <div className={styles.actionBlock}>
                  <img
                    src='/icons/like.svg'
                    alt='Like'
                    className={styles.actionIcon}
                    onClick={handleLike}
                  />
                  <img
                    src='/icons/share.svg'
                    alt='Share'
                    className={styles.actionIcon}
                    onClick={handleShare}
                  />
                  <img
                    src='/icons/more-square.svg'
                    alt='More'
                    className={styles.actionIcon}
                    onClick={handleMore}
                  />
                </div>

                {/* Описание и галерея */}
                <div className={styles.galleryWrapper}>
                  {/* Описание и кнопка — слева */}
                  <div className={styles.descriptionWrapper}>
                    <div>
                      <h1 className={styles.skillTitle}>
                        {currentSkill.title}
                      </h1>
                      <span className={styles.skillCategory}>
                        {categoryLabels[currentSkill.category] ||
                          currentSkill.category}{' '}
                        /{' '}
                        {subCategoryLabels[currentSkill.subCategory] ||
                          currentSkill.subCategory}
                      </span>
                      <p className={styles.skillDescription}>
                        {currentSkill.description}
                      </p>
                    </div>
                    <button
                      className={styles.exchangeButton}
                      onClick={handleOfferExchange}
                    >
                      Предложить обмен
                    </button>
                  </div>

                  {/* Галерея — справа (заглушка) */}
                  <div className={styles.galleryPlaceholder}>
                    <div className={styles.galleryPlaceholderContent}>
                      <p>Галерея изображений</p>
                      <p className={styles.galleryPlaceholderNote}>
                        В разработке
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Нижний блок — похожие предложения (карусель) */}
          {similarSkills.length > 0 && (
            <div className={styles.bottomBlock}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Похожие предложения</h2>
              </div>
              <div className={styles.carouselContainer}>
                <div className={styles.carousel}>
                  {currentSkills.map((skill, idx) => {
                    const isLastCard =
                      idx === currentSkills.length - 1 &&
                      currentPage < totalPages - 1;
                    return (
                      <div key={skill.id} className={styles.cardWrapper}>
                        <CardSkill
                          variant='default'
                          idSkill={skill.id}
                          skillName={skill.name}
                          descriptionSkill=''
                          typeSkill={skill.direction}
                          authorName={skill.authorName}
                          authorCity={skill.authorCity}
                          authorAge={skill.authorAge}
                          authorAvatar={skill.authorAvatar}
                          initialLiked={false}
                          isAuthenticated={false}
                          skills={skill.skills}
                        />
                        {isLastCard && (
                          <button
                            className={styles.nextButton}
                            onClick={handleNext}
                          >
                            <svg
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                            >
                              <path
                                d='M9 18L15 12L9 6'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                {currentPage > 0 && (
                  <button className={styles.prevButton} onClick={handlePrev}>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M15 18L9 12L15 6'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default SkillPage;
