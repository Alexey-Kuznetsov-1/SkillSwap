import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import ProfileSidebar from '@/widgets/ProfileSidebar';
import ProfileForm from '@/widgets/ProfileForm';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Ждём загрузки данных аутентификации

    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
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

  if (!user) {
    // На всякий случай — если редирект в useEffect не выполнился
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <>
      <Header isLoggedIn={true} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.twoColumns}>
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className={styles.content}>
              {activeTab === 'personal' && <ProfileForm />}
              {activeTab === 'requests' && <div>Заявки (в разработке)</div>}
              {activeTab === 'exchanges' && (
                <div>Мои обмены (в разработке)</div>
              )}
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
