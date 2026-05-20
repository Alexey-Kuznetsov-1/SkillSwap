// src/pages/SkillPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import { CardSkill } from '@/widgets/SkillCard/CardSkill';
import { getSkillById, getRelatedSkills, getSkillsCatalog, type SkillDetails, type SkillCard } from '@/api';
import styles from './SkillPage.module.css';

const SkillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [skill, setSkill] = useState<SkillDetails | null>(null);
  const [relatedSkills, setRelatedSkills] = useState<SkillCard[]>([]);
  const [allSkills, setAllSkills] = useState<SkillCard[]>([]);
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
    const totalPages = Math.ceil(relatedSkills.length / itemsPerPage);
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
      if (!id) return;
      
      const skillId = parseInt(id, 10);
      if (isNaN(skillId)) return;

      setLoading(true);

      try {
        const skillData = await getSkillById(skillId);
        setSkill(skillData);

        const related = await getRelatedSkills(skillId, 8);
        setRelatedSkills(related);

        const catalog = await getSkillsCatalog({ limit: 100 });
        setAllSkills(catalog.items);
        
        console.log('📚 Все навыки для фильтрации:', catalog.items);
        console.log('🎯 Текущий автор:', skillData?.author.name);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleOfferExchange = () => {
    console.log('Предложить обмен для навыка:', id);
  };

  const canTeach = allSkills.filter(
    (s) => s.author.name === skill?.author.name && s.direction === 'teach'
  );

  const wantsToLearn = allSkills.filter(
    (s) => s.author.name === skill?.author.name && s.direction === 'learn'
  );

  console.log('📊 canTeach:', canTeach);
  console.log('📊 wantsToLearn:', wantsToLearn);

  const totalPages = Math.ceil(relatedSkills.length / itemsPerPage);
  const currentSkills = relatedSkills.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

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

  if (!skill) {
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

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Header onSearch={handleSearch} />
      </div>
      <div className={styles.content}>
        <div className={styles.mainBlock}>
          <div className={styles.topBlock}>
            <div className={styles.leftBlock}>
              <CardSkill
                variant='description'
                idSkill={skill.id}
                skillName={skill.name}
                descriptionSkill={skill.description}
                descriptionUser={`Привет! Я ${skill.author.name}, ${skill.author.city}, ${skill.author.age} лет.`}
                typeSkill={skill.direction}
                authorName={skill.author.name}
                authorCity={skill.author.city}
                authorAge={skill.author.age}
                authorAvatar={skill.author.avatarUrl}
                initialLiked={false}
                isAuthenticated={false}
                skills={canTeach}
                wantedSkills={wantsToLearn}
              />
            </div>

            <div className={styles.rightBlock}>
              <div className={styles.skillCard}>
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

                <div className={styles.galleryWrapper}>
                  <div className={styles.descriptionWrapper}>
                    <div>
                      <h1 className={styles.skillTitle}>{skill.name}</h1>
                      <span className={styles.skillCategory}>
                        {skill.category} / {skill.subcategory}
                      </span>
                      <p className={styles.skillDescription}>{skill.description}</p>
                    </div>
                    <button
                      className={styles.exchangeButton}
                      onClick={handleOfferExchange}
                    >
                      Предложить обмен
                    </button>
                  </div>

                  <div className={styles.galleryPlaceholder}>
                    <div className={styles.galleryPlaceholderContent}>
                      <p>Галерея изображений</p>
                      <p className={styles.galleryPlaceholderNote}>В разработке</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedSkills.length > 0 && (
            <div className={styles.bottomBlock}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Похожие предложения</h2>
              </div>
              <div className={styles.carouselContainer}>
                <div className={styles.carousel}>
                  {currentSkills.map((related, idx) => {
                    const isLastCard =
                      idx === currentSkills.length - 1 &&
                      currentPage < totalPages - 1;
                    return (
                      <div key={related.id} className={styles.cardWrapper}>
                        <CardSkill
                          variant='default'
                          idSkill={related.id}
                          skillName={related.name}
                          descriptionSkill={related.description}
                          typeSkill={related.direction}
                          authorName={related.author.name}
                          authorCity={related.author.city}
                          authorAge={related.author.age}
                          authorAvatar={related.author.avatarUrl}
                          initialLiked={false}
                          isAuthenticated={false}
                          skills={[]}
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