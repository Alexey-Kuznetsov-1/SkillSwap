import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import { SearchInput } from '@/shared/ui/SearchInput/SearchInput';
import CategoriesDropdown from './components/CategoriesDropdown';
import styles from './Header.module.css';

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  avatarSrc?: string;
  onSearch?: (query: string) => void;
}

const categories = [
  {
    value: 'business_career',
    label: 'Бизнес и карьера',
    subCategories: [
      { value: 'team_management', label: 'Управление командой' },
      { value: 'marketing', label: 'Маркетинг и реклама' },
      { value: 'sales', label: 'Продажи и переговоры' },
      { value: 'personal_brand', label: 'Личный бренд' },
      { value: 'resume', label: 'Резюме и собеседование' },
      { value: 'time_management', label: 'Тайм-менеджмент' },
      { value: 'project_management', label: 'Проектное управление' },
      { value: 'entrepreneurship', label: 'Предпринимательство' },
    ],
  },
  {
    value: 'art_creativity',
    label: 'Творчество и искусство',
    subCategories: [
      { value: 'drawing', label: 'Рисование и иллюстрация' },
      { value: 'photography', label: 'Фотография' },
      { value: 'video_editing', label: 'Видеомонтаж' },
      { value: 'music', label: 'Музыка и звук' },
      { value: 'acting', label: 'Актёрское мастерство' },
      { value: 'creative_writing', label: 'Креативное письмо' },
      { value: 'art_therapy', label: 'Арт-терапия' },
      { value: 'diy', label: 'Декор и DIY' },
    ],
  },
  {
    value: 'foreign_languages',
    label: 'Иностранные языки',
    subCategories: [
      { value: 'english', label: 'Английский' },
      { value: 'french', label: 'Французский' },
      { value: 'spanish', label: 'Испанский' },
      { value: 'german', label: 'Немецкий' },
      { value: 'chinese', label: 'Китайский' },
      { value: 'japanese', label: 'Японский' },
      { value: 'exam_prep', label: 'Подготовка к экзаменам (IELTS, TOEFL)' },
    ],
  },
  {
    value: 'education_development',
    label: 'Образование и развитие',
    subCategories: [
      { value: 'personal_development', label: 'Личностное развитие' },
      { value: 'learning_skills', label: 'Навыки обучения' },
      { value: 'cognitive_techniques', label: 'Когнитивные техники' },
      { value: 'speed_reading', label: 'Скорочтение' },
      { value: 'teaching_skills', label: 'Навыки преподавания' },
      { value: 'coaching', label: 'Коучинг' },
    ],
  },
  {
    value: 'home_coziness',
    label: 'Дом и уют',
    subCategories: [
      { value: 'cleaning', label: 'Уборка и организация' },
      { value: 'home_finance', label: 'Домашние финансы' },
      { value: 'cooking', label: 'Приготовление еды' },
      { value: 'plants', label: 'Домашние растения' },
      { value: 'repair', label: 'Ремонт' },
      { value: 'storage', label: 'Хранение вещей' },
    ],
  },
  {
    value: 'health_lifestyle',
    label: 'Здоровье и лайфстайл',
    subCategories: [
      { value: 'yoga', label: 'Йога и медитация' },
      { value: 'nutrition', label: 'Питание и ЗОЖ' },
      { value: 'mental_health', label: 'Ментальное здоровье' },
      { value: 'mindfulness', label: 'Осознанность' },
      { value: 'fitness', label: 'Физические тренировки' },
      { value: 'sleep', label: 'Сон и восстановление' },
      { value: 'work_life_balance', label: 'Баланс жизни и работы' },
    ],
  },
];

const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  userName = 'Мария',
  avatarSrc = '',
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (categoryValue: string) => {
    console.log('Категория выбрана:', categoryValue);
    closeDropdown();
  };

  const handleSubCategoryClick = (subCategoryValue: string) => {
    console.log('Подкатегория выбрана:', subCategoryValue);
    closeDropdown();
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="20" fill="#ABD27A"/>
              <path d="M20 10C20 10 20.5518 15.1499 22.7009 17.2991C24.8501 19.4482 30 20 30 20C30 20 24.8501 20.5518 22.7009 22.7009C20.5518 24.8501 20 30 20 30C20 30 19.4482 24.8501 17.2991 22.7009C15.1499 20.5518 10 20 10 20C10 20 15.1499 19.4482 17.2991 17.2991C19.4482 15.1499 20 10 20 10Z" fill="#F9FAF7"/>
            </svg>
          </div>
          <span className={styles.logoText}>SkillSwap</span>
        </div>

        <nav className={styles.menu}>
          <a href="/about" className={styles.menuLink}>О проекте</a>
          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
              <span>Все навыки</span>
              <Icon name="chevron-down" size={24} />
            </button>
            <CategoriesDropdown
              isOpen={isDropdownOpen}
              onClose={closeDropdown}
              categories={categories}
              onCategoryClick={handleCategoryClick}
              onSubCategoryClick={handleSubCategoryClick}
            />
          </div>
        </nav>

        <SearchInput
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Искать навык"
          className={styles.searchWrapper}
        />

        <button className={styles.iconButton}>
          <Icon name="moon" size={20} />
        </button>

        <div className={styles.actions}>
          {isLoggedIn ? (
            <>
              <button className={styles.iconButton}>
                <Icon name="notification" size={24} />
              </button>
              <button className={styles.iconButton}>
                <Icon name="like" size={24} />
              </button>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName}</span>
                <Avatar src={avatarSrc} name={userName} />
              </div>
            </>
          ) : (
            <>
              <Button variant="secondary">Войти</Button>
              <Button variant="primary">Зарегистрироваться</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;