import React, { useEffect, useState } from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import FiltersSidebar from '@/widgets/FiltersSidebar';
import { getMockDbState } from '@/api';
import styles from './HomePage.module.css';

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

const categories = [
  { value: 'business_career', label: 'Бизнес и карьера' },
  { value: 'art_creativity', label: 'Творчество и искусство' },
  { value: 'foreign_languages', label: 'Иностранные языки' },
  { value: 'education_development', label: 'Образование и развитие' },
  { value: 'home_coziness', label: 'Дом и уют' },
  { value: 'health_lifestyle', label: 'Здоровье и лайфстайл' },
];

const subCategories = [
  // Бизнес и карьера
  { value: 'team_management', label: 'Управление командой', parentCategory: 'business_career' },
  { value: 'marketing', label: 'Маркетинг и реклама', parentCategory: 'business_career' },
  { value: 'sales', label: 'Продажи и переговоры', parentCategory: 'business_career' },
  { value: 'personal_brand', label: 'Личный бренд', parentCategory: 'business_career' },
  { value: 'resume', label: 'Резюме и собеседование', parentCategory: 'business_career' },
  { value: 'time_management', label: 'Тайм-менеджмент', parentCategory: 'business_career' },
  { value: 'project_management', label: 'Проектное управление', parentCategory: 'business_career' },
  { value: 'entrepreneurship', label: 'Предпринимательство', parentCategory: 'business_career' },
  // Творчество и искусство
  { value: 'drawing', label: 'Рисование и иллюстрация', parentCategory: 'art_creativity' },
  { value: 'photography', label: 'Фотография', parentCategory: 'art_creativity' },
  { value: 'video_editing', label: 'Видеомонтаж', parentCategory: 'art_creativity' },
  { value: 'music', label: 'Музыка и звук', parentCategory: 'art_creativity' },
  { value: 'acting', label: 'Актёрское мастерство', parentCategory: 'art_creativity' },
  { value: 'creative_writing', label: 'Креативное письмо', parentCategory: 'art_creativity' },
  { value: 'art_therapy', label: 'Арт-терапия', parentCategory: 'art_creativity' },
  { value: 'diy', label: 'Декор и DIY', parentCategory: 'art_creativity' },
  // Иностранные языки
  { value: 'english', label: 'Английский', parentCategory: 'foreign_languages' },
  { value: 'french', label: 'Французский', parentCategory: 'foreign_languages' },
  { value: 'spanish', label: 'Испанский', parentCategory: 'foreign_languages' },
  { value: 'german', label: 'Немецкий', parentCategory: 'foreign_languages' },
  { value: 'chinese', label: 'Китайский', parentCategory: 'foreign_languages' },
  { value: 'japanese', label: 'Японский', parentCategory: 'foreign_languages' },
  { value: 'exam_prep', label: 'Подготовка к экзаменам (IELTS, TOEFL)', parentCategory: 'foreign_languages' },
  // Образование и развитие
  { value: 'personal_development', label: 'Личностное развитие', parentCategory: 'education_development' },
  { value: 'learning_skills', label: 'Навыки обучения', parentCategory: 'education_development' },
  { value: 'cognitive_techniques', label: 'Когнитивные техники', parentCategory: 'education_development' },
  { value: 'speed_reading', label: 'Скорочтение', parentCategory: 'education_development' },
  { value: 'teaching_skills', label: 'Навыки преподавания', parentCategory: 'education_development' },
  { value: 'coaching', label: 'Коучинг', parentCategory: 'education_development' },
  // Дом и уют
  { value: 'cleaning', label: 'Уборка и организация', parentCategory: 'home_coziness' },
  { value: 'home_finance', label: 'Домашние финансы', parentCategory: 'home_coziness' },
  { value: 'cooking', label: 'Приготовление еды', parentCategory: 'home_coziness' },
  { value: 'plants', label: 'Домашние растения', parentCategory: 'home_coziness' },
  { value: 'repair', label: 'Ремонт', parentCategory: 'home_coziness' },
  { value: 'storage', label: 'Хранение вещей', parentCategory: 'home_coziness' },
  // Здоровье и лайфстайл
  { value: 'yoga', label: 'Йога и медитация', parentCategory: 'health_lifestyle' },
  { value: 'nutrition', label: 'Питание и ЗОЖ', parentCategory: 'health_lifestyle' },
  { value: 'mental_health', label: 'Ментальное здоровье', parentCategory: 'health_lifestyle' },
  { value: 'mindfulness', label: 'Осознанность', parentCategory: 'health_lifestyle' },
  { value: 'fitness', label: 'Физические тренировки', parentCategory: 'health_lifestyle' },
  { value: 'sleep', label: 'Сон и восстановление', parentCategory: 'health_lifestyle' },
  { value: 'work_life_balance', label: 'Баланс жизни и работы', parentCategory: 'health_lifestyle' },
];

const allCities = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
  'Уфа', 'Красноярск', 'Пермь', 'Воронеж', 'Волгоград',
];

const HomePage: React.FC = () => {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const [skillType, setSkillType] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [authorGender, setAuthorGender] = useState('any');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getMockDbState();
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
        selectedCategories.includes(skill.category)
      );
    }

    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter((skill) =>
        selectedSubCategories.includes(skill.subCategory)
      );
    }

    if (authorGender !== 'any') {
      filtered = filtered.filter((skill) => skill.authorGender === authorGender);
    }

    if (selectedCities.length > 0) {
      filtered = filtered.filter((skill) =>
        selectedCities.includes(skill.authorCity)
      );
    }

    setFilteredSkills(filtered);
  }, [allSkills, skillType, selectedCategories, selectedSubCategories, authorGender, selectedCities]);

  const handleCategoryToggle = (categoryValue: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  const handleSubCategoryToggle = (subCategoryValue: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategoryValue)
        ? prev.filter((c) => c !== subCategoryValue)
        : [...prev, subCategoryValue]
    );
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city]
    );
  };

  const handleLike = (id: number) => {
    setAllSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, likes: skill.likes + 1 } : skill
      )
    );
  };

  const handleCardClick = (id: number) => {
    console.log('Переход на страницу навыка:', id);
  };

  const TempCard = ({ skill }: { skill: Skill }) => (
    <div className={styles.card} onClick={() => handleCardClick(skill.id)}>
      <h3>{skill.title}</h3>
      <p>{skill.description}</p>
      <div className={styles.cardFooter}>
        <span>{skill.author}, {skill.authorCity}</span>
        <button onClick={() => handleLike(skill.id)}>❤️ {skill.likes}</button>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Каталог навыков</h1>

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
              {loading ? (
                <p>Загрузка...</p>
              ) : (
                <>
                  <div className={styles.count}>Найдено: {filteredSkills.length}</div>
                  <div className={styles.grid}>
                    {filteredSkills.map((skill) => (
                      <TempCard key={skill.id} skill={skill} />
                    ))}
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