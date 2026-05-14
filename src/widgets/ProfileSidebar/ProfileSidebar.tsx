import React from 'react';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './ProfileSidebar.module.css';

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'requests', label: 'Заявки', icon: 'request' },
  { id: 'exchanges', label: 'Мои обмены', icon: 'scroll' },
  { id: 'favorites', label: 'Избранное', icon: 'like' },
  { id: 'skills', label: 'Мои навыки', icon: 'book' },
  { id: 'personal', label: 'Личные данные', icon: 'user' },
];

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon name={tab.icon} size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default ProfileSidebar;