// src/widgets/Header/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import { SearchInput } from '@/shared/ui/SearchInput/SearchInput';
import CategoriesDropdown from './components/CategoriesDropdown';
import NotificationsDropdown, {
  type NotificationItem,
} from './components/NotificationsDropdown';
import styles from './Header.module.css';

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  avatarSrc?: string;
  notifications?: NotificationItem[];
  onSearch?: (query: string) => void;
  onNotificationAction?: (notificationId: string) => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Николай принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: 'сегодня',
    isNew: true,
    actionLabel: 'Перейти',
  },
  {
    id: 'n2',
    title: 'Татьяна предлагает вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    date: 'сегодня',
    isNew: true,
    actionLabel: 'Перейти',
  },
  {
    id: 'n3',
    title: 'Олег предлагает вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    date: 'вчера',
    isNew: false,
  },
  {
    id: 'n4',
    title: 'Игорь принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: '23 мая',
    isNew: false,
  },
];

const categories = [
  // ... массив categories без изменений (такой же как был)
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
  notifications: notificationsProp,
  onSearch,
  onNotificationAction,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    notificationsProp ?? DEFAULT_NOTIFICATIONS,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notificationsProp) {
      setNotifications(notificationsProp);
    }
  }, [notificationsProp]);

  const unreadCount = notifications.filter((item) => item.isNew).length;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsNotificationsOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const closeNotifications = () => {
    setIsNotificationsOpen(false);
  };

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isNew: false })));
  };

  const handleClearViewed = () => {
    setNotifications((prev) => prev.filter((item) => item.isNew));
  };

  const handleNotificationAction = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isNew: false } : item,
      ),
    );
    closeNotifications();
    onNotificationAction?.(notificationId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        closeDropdown();
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        closeNotifications();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNotifications();
        closeDropdown();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCategoryClick = (categoryValue: string) => {
    console.log('Категория выбрана:', categoryValue);
    closeDropdown();
  };

  const handleSubCategoryClick = (subCategoryValue: string) => {
    console.log('Подкатегория выбрана:', subCategoryValue);
    closeDropdown();
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Логотип — ссылка на главную */}
        <div className={styles.logo} onClick={handleLogoClick}>
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

        <div className={styles.actions}>
          <div className={styles.iconsGroup}>
            <button className={styles.iconButton}>
              <Icon name="moon" size={20} />
            </button>
            {isLoggedIn && (
              <>
                <div
                  className={styles.notificationsWrapper}
                  ref={notificationsRef}
                >
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={toggleNotifications}
                    aria-label="Уведомления"
                    aria-haspopup="dialog"
                    aria-expanded={isNotificationsOpen}
                  >
                    <Icon name="notification" size={24} />
                    {unreadCount > 0 && (
                      <span
                        className={styles.notificationBadge}
                        aria-label={`Новых уведомлений: ${unreadCount}`}
                      />
                    )}
                  </button>
                  <NotificationsDropdown
                    isOpen={isNotificationsOpen}
                    notifications={notifications}
                    onReadAll={handleReadAll}
                    onClearViewed={handleClearViewed}
                    onActionClick={handleNotificationAction}
                  />
                </div>
                <button className={styles.iconButton}>
                  <Icon name="like" size={24} />
                </button>
              </>
            )}
          </div>
          {isLoggedIn ? (
            <div className={styles.userInfo} onClick={handleProfileClick}>
              <span className={styles.userName}>{userName}</span>
              <div className={styles.avatarPlaceholder}>
                {avatarSrc ? (
                  <img src={avatarSrc} alt={userName} className={styles.avatarImage} />
                ) : (
                  userName ? userName[0] : 'U'
                )}
              </div>
            </div>
          ) : (
            <>
              <Button variant="secondary" onClick={handleLoginClick}>
                Войти
              </Button>
              <Button variant="primary" onClick={handleRegisterClick}>
                Зарегистрироваться
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;