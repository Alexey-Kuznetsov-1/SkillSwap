import React from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import styles from './Header.module.css';

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  avatarSrc?: string;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  userName = 'Мария',
  avatarSrc = '',
}) => {
  return (
    <header className={styles.header}>
      {/* Логотип */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#ABD27A"/>
            <path d="M20 10C20 10 20.5518 15.1499 22.7009 17.2991C24.8501 19.4482 30 20 30 20C30 20 24.8501 20.5518 22.7009 22.7009C20.5518 24.8501 20 30 20 30C20 30 19.4482 24.8501 17.2991 22.7009C15.1499 20.5518 10 20 10 20C10 20 15.1499 19.4482 17.2991 17.2991C19.4482 15.1499 20 10 20 10Z" fill="#F9FAF7"/>
          </svg>
        </div>
        <span className={styles.logoText}>SkillSwap</span>
      </div>

      {/* Меню навигации */}
      <nav className={styles.menu}>
        <a href="/about" className={styles.menuLink}>О проекте</a>
        <div className={styles.dropdown}>
          <span className={styles.dropdownText}>Все навыки</span>
          <Icon name="chevron-down" size={24} />
        </div>
      </nav>

      {/* Поиск */}
      <div className={styles.search}>
        <Icon name="search" size={24} />
        <input
          type="text"
          placeholder="Искать навык"
          className={styles.searchInput}
        />
      </div>

      {/* Иконка луны (темная тема) */}
      <button className={styles.iconButton}>
        <Icon name="moon" size={20} />
      </button>

      {/* Кнопки / иконки + аватар - в зависимости от авторизации */}
      <div className={styles.actions}>
        {isLoggedIn ? (
          // Авторизованный пользователь
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
          // Неавторизованный пользователь (только кнопки)
          <>
            <Button variant="secondary">Войти</Button>
            <Button variant="primary">Зарегистрироваться</Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;