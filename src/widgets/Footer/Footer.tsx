// src/widgets/Footer/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  // Обработчик для ссылки "Все навыки" - прокручиваем к хедеру и открываем дропдаун
  const handleSkillsClick = () => {
    // Находим кнопку "Все навыки" в хедере и кликаем по ней
    const dropdownButton = document.querySelector('.header .dropdownButton');
    if (dropdownButton instanceof HTMLElement) {
      dropdownButton.click();
    }
    // Прокручиваем к началу страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Линия 1: логотип */}
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="20" fill="var(--color-accent-main)"/>
                <path d="M20 10C20 10 20.5518 15.1499 22.7009 17.2991C24.8501 19.4482 30 20 30 20C30 20 24.8501 20.5518 22.7009 22.7009C20.5518 24.8501 20 30 20 30C20 30 19.4482 24.8501 17.2991 22.7009C15.1499 20.5518 10 20 10 20C10 20 15.1499 19.4482 17.2991 17.2991C19.4482 15.1499 20 10 20 10Z" fill="var(--color-logo-inner)"/>
              </svg>
            </div>
            <span className={styles.logoText}>SkillSwap</span>
          </Link>
        </div>

        {/* Линия 2: три колонки ссылок */}
        <div className={styles.linksContainer}>
          <div className={styles.column}>
            <Link to="/about" className={styles.link}>О проекте</Link>
            <button onClick={handleSkillsClick} className={styles.linkButton}>Все навыки</button>
          </div>
          <div className={styles.column}>
            <Link to="/contacts" className={styles.link}>Контакты</Link>
            <Link to="/blog" className={styles.link}>Блог</Link>
          </div>
          <div className={styles.column}>
            <Link to="/privacy" className={styles.link}>Политика конфиденциальности</Link>
            <Link to="/terms" className={styles.link}>Пользовательское соглашение</Link>
          </div>
        </div>

        {/* Линия 3: копирайт */}
        <div className={styles.copyright}>SkillSwap — 2026</div>
      </div>
    </footer>
  );
};

export default Footer;