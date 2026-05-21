
import React from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import styles from './AboutPage.module.css';

const AboutPage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>О проекте</h1>
            
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Что такое SkillSwap?</h2>
              <p className={styles.text}>
                SkillSwap — это платформа для обмена знаниями и навыками между людьми. 
                Мы верим, что каждый человек обладает уникальными знаниями, которые могут быть полезны другим.
              </p>
              <p className={styles.text}>
                Наша миссия — создать сообщество, где люди могут бесплатно обучать друг друга 
                тому, что умеют, и учиться новому у других.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Как это работает?</h2>
              <p className={styles.text}>
                1. <strong>Выберите навык</strong> — найдите то, чему хотите научиться, или то, чем можете поделиться.
              </p>
              <p className={styles.text}>
                2. <strong>Предложите обмен</strong> — свяжитесь с автором навыка и предложите взаимовыгодный обмен.
              </p>
              <p className={styles.text}>
                3. <strong>Обучайтесь и делитесь</strong> — договаривайтесь о формате и времени занятий.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Для кого этот сервис?</h2>
              <p className={styles.text}>
                SkillSwap подходит для всех, кто хочет развиваться и помогать другим. 
                Независимо от вашего возраста, профессии или уровня подготовки — здесь найдется место для каждого.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;