import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Линия 1: логотип */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="20" fill="#ABD27A"/>
              <path d="M20 10C20 10 20.5518 15.1499 22.7009 17.2991C24.8501 19.4482 30 20 30 20C30 20 24.8501 20.5518 22.7009 22.7009C20.5518 24.8501 20 30 20 30C20 30 19.4482 24.8501 17.2991 22.7009C15.1499 20.5518 10 20 10 20C10 20 15.1499 19.4482 17.2991 17.2991C19.4482 15.1499 20 10 20 10Z" fill="#F9FAF7"/>
            </svg>
          </div>
          <span className={styles.logoText}>SkillSwap</span>
        </div>

        {/* Линия 2: три колонки ссылок */}
        <div className={styles.linksContainer}>
          <div className={styles.column}>
            <a href="/about" className={styles.link}>О проекте</a>
            <a href="/skills" className={styles.link}>Все навыки</a>
          </div>
          <div className={styles.column}>
            <a href="/contacts" className={styles.link}>Контакты</a>
            <a href="/blog" className={styles.link}>Блог</a>
          </div>
          <div className={styles.column}>
            <a href="/privacy" className={styles.link}>Политика конфиденциальности</a>
            <a href="/terms" className={styles.link}>Пользовательское соглашение</a>
          </div>
        </div>

        {/* Линия 3: копирайт */}
        <div className={styles.copyright}>SkillSwap — 2026</div>
      </div>
    </footer>
  );
};

export default Footer;