import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import ProfileSidebar from '@/widgets/ProfileSidebar';
import ProfileForm from '@/widgets/ProfileForm';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    // Проверяем авторизацию (временная заглушка)
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <p>Загрузка...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Header isLoggedIn={true} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.twoColumns}>
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className={styles.content}>
              {activeTab === 'personal' && <ProfileForm />}
              {activeTab === 'requests' && <div>Заявки (в разработке)</div>}
              {activeTab === 'exchanges' && <div>Мои обмены (в разработке)</div>}
              {activeTab === 'favorites' && <div>Избранное (в разработке)</div>}
              {activeTab === 'skills' && <div>Мои навыки (в разработке)</div>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;