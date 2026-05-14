import React, { useEffect, useState, useRef, useCallback } from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import FiltersSidebar from '@/widgets/FiltersSidebar';
import styles from './HomePage.module.css';

interface TempSkill {
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

const categories = [
  { value: 'business', label: 'Бизнес и карьера' },
  { value: 'art', label: 'Творчество и искусство' },
  { value: 'languages', label: 'Иностранные языки' },
  { value: 'education', label: 'Образование и развитие' },
  { value: 'home', label: 'Дом и уют' },
  { value: 'health', label: 'Здоровье и лайфстайл' },
];

const subCategories = [
  {
    value: 'team_management',
    label: 'Управление командой',
    parentCategory: 'business',
  },
  {
    value: 'marketing',
    label: 'Маркетинг и реклама',
    parentCategory: 'business',
  },
  { value: 'sales', label: 'Продажи и переговоры', parentCategory: 'business' },
  {
    value: 'personal_brand',
    label: 'Личный бренд',
    parentCategory: 'business',
  },
  {
    value: 'resume',
    label: 'Резюме и собеседование',
    parentCategory: 'business',
  },
  {
    value: 'time_management',
    label: 'Тайм-менеджмент',
    parentCategory: 'business',
  },
  {
    value: 'project_management',
    label: 'Проектное управление',
    parentCategory: 'business',
  },
  {
    value: 'entrepreneurship',
    label: 'Предпринимательство',
    parentCategory: 'business',
  },
  { value: 'drawing', label: 'Рисование и иллюстрация', parentCategory: 'art' },
  { value: 'photography', label: 'Фотография', parentCategory: 'art' },
  { value: 'video_editing', label: 'Видеомонтаж', parentCategory: 'art' },
  { value: 'music', label: 'Музыка и звук', parentCategory: 'art' },
  { value: 'acting', label: 'Актёрское мастерство', parentCategory: 'art' },
  {
    value: 'creative_writing',
    label: 'Креативное письмо',
    parentCategory: 'art',
  },
  { value: 'art_therapy', label: 'Арт-терапия', parentCategory: 'art' },
  { value: 'diy', label: 'Декор и DIY', parentCategory: 'art' },
  { value: 'english', label: 'Английский', parentCategory: 'languages' },
  { value: 'french', label: 'Французский', parentCategory: 'languages' },
  { value: 'spanish', label: 'Испанский', parentCategory: 'languages' },
  { value: 'german', label: 'Немецкий', parentCategory: 'languages' },
  { value: 'chinese', label: 'Китайский', parentCategory: 'languages' },
  { value: 'japanese', label: 'Японский', parentCategory: 'languages' },
  {
    value: 'exam_prep',
    label: 'Подготовка к экзаменам (IELTS, TOEFL)',
    parentCategory: 'languages',
  },
  {
    value: 'personal_development',
    label: 'Личностное развитие',
    parentCategory: 'education',
  },
  {
    value: 'learning_skills',
    label: 'Навыки обучения',
    parentCategory: 'education',
  },
  {
    value: 'cognitive_techniques',
    label: 'Когнитивные техники',
    parentCategory: 'education',
  },
  { value: 'speed_reading', label: 'Скорочтение', parentCategory: 'education' },
  {
    value: 'teaching_skills',
    label: 'Навыки преподавания',
    parentCategory: 'education',
  },
  { value: 'coaching', label: 'Коучинг', parentCategory: 'education' },
  { value: 'cleaning', label: 'Уборка и организация', parentCategory: 'home' },
  { value: 'home_finance', label: 'Домашние финансы', parentCategory: 'home' },
  { value: 'cooking', label: 'Приготовление еды', parentCategory: 'home' },
  { value: 'plants', label: 'Домашние растения', parentCategory: 'home' },
  { value: 'repair', label: 'Ремонт', parentCategory: 'home' },
  { value: 'storage', label: 'Хранение вещей', parentCategory: 'home' },
  { value: 'yoga', label: 'Йога и медитация', parentCategory: 'health' },
  { value: 'nutrition', label: 'Питание и ЗОЖ', parentCategory: 'health' },
  {
    value: 'mental_health',
    label: 'Ментальное здоровье',
    parentCategory: 'health',
  },
  { value: 'mindfulness', label: 'Осознанность', parentCategory: 'health' },
  {
    value: 'fitness',
    label: 'Физические тренировки',
    parentCategory: 'health',
  },
  { value: 'sleep', label: 'Сон и восстановление', parentCategory: 'health' },
  {
    value: 'work_life_balance',
    label: 'Баланс жизни и работы',
    parentCategory: 'health',
  },
];

const allCities = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Омск',
  'Ростов-на-Дону',
  'Уфа',
  'Красноярск',
  'Пермь',
  'Воронеж',
  'Волгоград',
];

const PAGE_SIZE = 6;

const HomePage: React.FC = () => {
  const [allSkills, setAllSkills] = useState<TempSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [skillType, setSkillType] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    [],
  );
  const [authorGender, setAuthorGender] = useState('any');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [displayedSkills, setDisplayedSkills] = useState<TempSkill[]>([]);
  const [popularSkills, setPopularSkills] = useState<TempSkill[]>([]);
  const [newSkills, setNewSkills] = useState<TempSkill[]>([]);
  const [recommendedSkills, setRecommendedSkills] = useState<TempSkill[]>([]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastCardRef = useRef<HTMLDivElement | null>(null);

  const hasFilters =
    skillType !== 'all' ||
    selectedCategories.length > 0 ||
    selectedSubCategories.length > 0 ||
    authorGender !== 'any' ||
    selectedCities.length > 0 ||
    searchQuery;

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/db/skills.json');
        const data = await response.json();
        setAllSkills(data.skills || []);
      } catch (error) {
        console.error('Ошибка загрузки навыков:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    let filtered = [...allSkills];

    if (skillType !== 'all') {
      filtered = filtered.filter((skill) => skill.type === skillType);
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((skill) =>
        selectedCategories.includes(skill.category),
      );
    }
    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter((skill) =>
        selectedSubCategories.includes(skill.subCategory),
      );
    }
    if (authorGender !== 'any') {
      filtered = filtered.filter(
        (skill) => skill.authorGender === authorGender,
      );
    }
    if (selectedCities.length > 0) {
      filtered = filtered.filter((skill) =>
        selectedCities.includes(skill.authorCity),
      );
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (skill) =>
          skill.title.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query),
      );
    }

    setRecommendedSkills(filtered);
  }, [
    allSkills,
    skillType,
    selectedCategories,
    selectedSubCategories,
    authorGender,
    selectedCities,
    searchQuery,
  ]);

  useEffect(() => {
    if (!hasFilters) return;
    const start = 0;
    const end = page * PAGE_SIZE;
    setDisplayedSkills(recommendedSkills.slice(start, end));
    setHasMore(end < recommendedSkills.length);
  }, [recommendedSkills, page, hasFilters]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [
    skillType,
    selectedCategories,
    selectedSubCategories,
    authorGender,
    selectedCities,
    searchQuery,
  ]);

  useEffect(() => {
    if (allSkills.length === 0) return;
    setPopularSkills(
      [...allSkills].sort((a, b) => b.likes - a.likes).slice(0, 3),
    );
    setNewSkills([...allSkills].sort((a, b) => b.id - a.id).slice(0, 3));
  }, [allSkills]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loadingMore && hasFilters) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loadingMore, hasFilters],
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(handleObserver);
    if (lastCardRef.current) observerRef.current.observe(lastCardRef.current);
    return () => observerRef.current?.disconnect();
  }, [handleObserver, displayedSkills]);

  useEffect(() => {
    if (!hasFilters) return;
    setLoadingMore(true);
    const timer = setTimeout(() => setLoadingMore(false), 500);
    return () => clearTimeout(timer);
  }, [page]);

  const handleCategoryToggle = (categoryValue: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue],
    );
  };

  const handleSubCategoryToggle = (subCategoryValue: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategoryValue)
        ? prev.filter((c) => c !== subCategoryValue)
        : [...prev, subCategoryValue],
    );
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const TempCard = ({
    skill,
    isLast = false,
  }: {
    skill: TempSkill;
    isLast?: boolean;
  }) => (
    <div className={styles.card} ref={isLast ? lastCardRef : null}>
      <h3>{skill.title}</h3>
      <p>{skill.description}</p>
      <div className={styles.cardFooter}>
        <span>
          {skill.author}, {skill.authorCity}
        </span>
        <span>❤️ {skill.likes}</span>
      </div>
    </div>
  );

  const Section = ({
    title,
    skills,
    showAll = false,
  }: {
    title: string;
    skills: TempSkill[];
    showAll?: boolean;
  }) => (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {showAll && (
          <button className={styles.showAllButton}>Смотреть все</button>
        )}
      </div>
      <div className={styles.grid}>
        {skills.slice(0, 3).map((skill) => (
          <TempCard key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );

  if (loading) {
    return (
      <>
        <Header onSearch={handleSearch} />
        <main className={styles.main}>
          <div className={styles.container}>
            <p>Загрузка...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.twoColumns}>
            <FiltersSidebar
              skillType={skillType}
              onSkillTypeChange={setSkillType}
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              subCategories={subCategories}
              selectedSubCategories={selectedSubCategories}
              onSubCategoryToggle={handleSubCategoryToggle}
              authorGender={authorGender}
              onAuthorGenderChange={setAuthorGender}
              cities={allCities}
              selectedCities={selectedCities}
              onCityToggle={handleCityToggle}
            />

            <div className={styles.content}>
              {hasFilters ? (
                <>
                  <h2 className={styles.sectionTitle}>
                    Подходящие предложения: {recommendedSkills.length}
                  </h2>
                  <div className={styles.grid}>
                    {displayedSkills.map((skill, idx) => (
                      <TempCard
                        key={skill.id}
                        skill={skill}
                        isLast={idx === displayedSkills.length - 1}
                      />
                    ))}
                  </div>
                  {loadingMore && (
                    <p className={styles.loadingMore}>Загрузка...</p>
                  )}
                  {!hasMore && displayedSkills.length > 0 && (
                    <p className={styles.endMessage}>
                      Вы посмотрели все предложения
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Section title='Популярное' skills={popularSkills} showAll />
                  <Section title='Новое' skills={newSkills} showAll />
                  <Section
                    title='Рекомендуем'
                    skills={recommendedSkills.slice(0, 3)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
