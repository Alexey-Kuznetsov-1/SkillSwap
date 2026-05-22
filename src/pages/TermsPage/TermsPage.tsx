// src/pages/TermsPage/TermsPage.tsx
import React from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import styles from './TermsPage.module.css';

const TermsPage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  // Генерируем 50 повторений текста с уменьшающимся размером
  const generateTerms = () => {
    const baseText = "Я, как пользователь, соглашаюсь со всем.";
    const terms = [];
    
    for (let i = 0; i < 50; i++) {
      // Уменьшаем размер шрифта: 16px -> 14px -> 12px -> ... -> минимальный
      const fontSize = Math.max(6, 16 - Math.floor(i / 2) * 1.5);
      terms.push(
        <p key={i} className={styles.termLine} style={{ fontSize: `${fontSize}px` }}>
          {i + 1}. {baseText} {i === 0 && "Безоговорочно."}
          {i === 1 && "И полностью."}
          {i === 2 && "От всего сердца."}
          {i === 3 && "И души."}
          {i === 49 && " (если вы это читаете — вы герой!)"}
        </p>
      );
    }
    
    return terms;
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Пользовательское соглашение</h1>
            
            <div className={styles.termsContainer}>
              <p className={styles.warning}>
                ⚠️ Внимание! Чтение данного документа может занять некоторое время. ⚠️
              </p>
              {generateTerms()}
              <div className={styles.signature}>
                <p>С уважением,</p>
                <p>Команда SkillSwap</p>
                <p className={styles.small}>p.s. Надеемся, вы дочитали до конца! 🎉</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsPage;