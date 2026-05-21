// src/pages/BlogPage/BlogPage.tsx
import React from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import styles from './BlogPage.module.css';

const BlogPage: React.FC = () => {
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
              <h1 className={styles.title}>Блог</h1>
              <p className={styles.message}>
                Ищите нас во всех социальных сетях, запрещенных и не запрещенных, пока их не запретили
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage;