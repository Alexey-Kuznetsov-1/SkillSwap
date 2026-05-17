import React, { useEffect, useState } from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import FiltersSidebar from '@/widgets/FiltersSidebar';
import Catalog from '@/widgets/Catalog';
import { useFavorites } from '@/shared/hooks/useFavorites';
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
  { value: 'team_management', label: 'Управление командой', parentCategory: 'business' },
  { value: 'marketing', label: 'Маркетинг и реклама', parentCategory: 'business' },
  { value: 'sales', label: 'Продажи и переговоры', parentCategory: 'business' },
  { value: 'personal_brand', label: 'Личный бренд', parentCategory: 'business' },
  { value: 'resume', label: 'Резюме и собеседование', parentCategory: 'business' },
  { value: 'time_management', label: 'Тайм-менеджмент', parentCategory: 'business' },
  { value: 'project_management', label: 'Проектное управление', parentCategory: 'business' },
  { value: 'entrepreneurship', label: 'Предпринимательство', parentCategory: 'business' },
  { value: 'drawing', label: 'Рисование и иллюстрация', parentCategory: 'art' },
  { value: 'photography', label: 'Фотография', parentCategory: 'art' },
  { value: 'video_editing', label: 'Видеомонтаж', parentCategory: 'art' },
  { value: 'music', label: 'Музыка и звук', parentCategory: 'art' },
  { value: 'acting', label: 'Актёрское мастерство', parentCategory: 'art' },
  { value: 'creative_writing', label: 'Креативное письмо', parentCategory: 'art' },
  { value: 'art_therapy', label: 'Арт-терапия', parentCategory: 'art' },
  { value: 'diy', label: 'Декор и DIY', parentCategory: 'art' },
  { value: 'english', label: 'Английский', parentCategory: 'languages' },
  { value: 'french', label: 'Французский', parentCategory: 'languages' },
  { value: 'spanish', label: 'Испанский', parentCategory: 'languages' },
  { value: 'german', label: 'Немецкий', parentCategory: 'languages' },
  { value: 'chinese', label: 'Китайский', parentCategory: 'languages' },
  { value: 'japanese', label: 'Японский', parentCategory: 'languages' },
  { value: 'exam_prep', label: 'Подготовка к экзаменам (IELTS, TOEFL)', parentCategory: 'languages' },
  { value: 'personal_development', label: 'Личностное развитие', parentCategory: 'education' },
  { value: 'learning_skills', label: 'Навыки обучения', parentCategory: 'education' },
  { value: 'cognitive_techniques', label: 'Когнитивные техники', parentCategory: 'education' },
  { value: 'speed_reading', label: 'Скорочтение', parentCategory: 'education' },
  { value: 'teaching_skills', label: 'Навыки преподавания', parentCategory: 'education' },
  { value: 'coaching', label: 'Коучинг', parentCategory: 'education' },
  { value: 'cleaning', label: 'Уборка и организация', parentCategory: 'home' },
  { value: 'home_finance', label: 'Домашние финансы', parentCategory: 'home' },
  { value: 'cooking', label: 'Приготовление еды', parentCategory: 'home' },
  { value: 'plants', label: 'Домашние растения', parentCategory: 'home' },
  { value: 'repair', label: 'Ремонт', parentCategory: 'home' },
  { value: 'storage', label: 'Хранение вещей', parentCategory: 'home' },
  { value: 'yoga', label: 'Йога и медитация', parentCategory: 'health' },
  { value: 'nutrition', label: 'Питание и ЗОЖ', parentCategory: 'health' },
  { value: 'mental_health', label: 'Ментальное здоровье', parentCategory: 'health' },
  { value: 'mindfulness', label: 'Осознанность', parentCategory: 'health' },
  { value: 'fitness', label: 'Физические тренировки', parentCategory: 'health' },
  { value: 'sleep', label: 'Сон и восстановление', parentCategory: 'health' },
  { value: 'work_life_balance', label: 'Баланс жизни и работы', parentCategory: 'health' },
];

const allCities = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
  'Уфа', 'Красноярск', 'Пермь', 'Воронеж', 'Волгоград',
];

const HomePage: React.FC = () => {
  const [allSkills, setAllSkills] = useState<TempSkill[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для отображения секций
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllNew, setShowAllNew] = useState(false);

  const [skillType, setSkillType] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [authorGender, setAuthorGender] = useState('any');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { isFavorite, toggleFavorite } = useFavorites();

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
        const skillsData = data.data || data.skills || [];
        setAllSkills(skillsData);
      } catch (error) {
        console.error('Ошибка загрузки навыков:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Сброс "Смотреть все" при изменении фильтров
  useEffect(() => {
    setShowAllPopular(false);
    setShowAllNew(false);
  }, [skillType, selectedCategories, selectedSubCategories, authorGender, selectedCities, searchQuery]);

  let filteredSkills = [...allSkills];

  if (skillType !== 'all') {
    filteredSkills = filteredSkills.filter((skill) => skill.type === skillType);
  }
  if (selectedCategories.length > 0) {
    filteredSkills = filteredSkills.filter((skill) => selectedCategories.includes(skill.category));
  }
  if (selectedSubCategories.length > 0) {
    filteredSkills = filteredSkills.filter((skill) => selectedSubCategories.includes(skill.subCategory));
  }
  if (authorGender !== 'any') {
    filteredSkills = filteredSkills.filter((skill) => skill.authorGender === authorGender);
  }
  if (selectedCities.length > 0) {
    filteredSkills = filteredSkills.filter((skill) => selectedCities.includes(skill.authorCity));
  }
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredSkills = filteredSkills.filter(
      (skill) =>
        skill.title.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query)
    );
  }

  const popularSkillsAll = [...allSkills].sort((a, b) => b.likes - a.likes);
  const newSkillsAll = [...allSkills].sort((a, b) => b.id - a.id);
  
  const popularSkills = showAllPopular ? popularSkillsAll : popularSkillsAll.slice(0, 3);
  const newSkills = showAllNew ? newSkillsAll : newSkillsAll.slice(0, 3);
  const recommendedSkills = hasFilters ? filteredSkills : allSkills;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

const handleCategoryToggle = (categoryValue: string) => {
  const isSelected = selectedCategories.includes(categoryValue);
  
  if (isSelected) {
    // Снимаем категорию
    setSelectedCategories((prev) => prev.filter((c) => c !== categoryValue));
    // Снимаем все подкатегории этой категории
    const subCategoriesToRemove = subCategories
      .filter((sub) => sub.parentCategory === categoryValue)
      .map((sub) => sub.value);
    setSelectedSubCategories((prev) =>
      prev.filter((sub) => !subCategoriesToRemove.includes(sub))
    );
  } else {
    // Добавляем категорию
    setSelectedCategories((prev) => [...prev, categoryValue]);
  }
};

  const handleSubCategoryToggle = (subCategoryValue: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategoryValue) ? prev.filter((c) => c !== subCategoryValue) : [...prev, subCategoryValue]
    );
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

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
                  <h2 className={styles.sectionTitle}>Подходящие предложения</h2>
                  <Catalog skills={filteredSkills} />
                </>
              ) : (
                <>
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Популярное</h2>
                      <button 
                        className={styles.showAllButton}
                        onClick={() => setShowAllPopular(!showAllPopular)}
                      >
                        {showAllPopular ? 'Скрыть' : 'Смотреть все'}
                      </button>
                    </div>
                    <Catalog skills={popularSkills} />
                  </div>
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Новое</h2>
                      <button 
                        className={styles.showAllButton}
                        onClick={() => setShowAllNew(!showAllNew)}
                      >
                        {showAllNew ? 'Скрыть' : 'Смотреть все'}
                      </button>
                    </div>
                    <Catalog skills={newSkills} />
                  </div>
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Рекомендуем</h2>
                    </div>
                    <Catalog skills={recommendedSkills} />
                  </div>
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