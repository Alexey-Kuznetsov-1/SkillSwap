// src/pages/ContactsPage/ContactsPage.tsx
import React from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import styles from './ContactsPage.module.css';

const ContactsPage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.messageBlock}>
              <h1 className={styles.title}>Контакты</h1>
              <p className={styles.message}>
                Просим понять и простить, сделали как могли, по всем вопросам звоните или пишите в Яндекс Практикум
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactsPage;