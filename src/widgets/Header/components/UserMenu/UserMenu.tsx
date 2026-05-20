import React from 'react';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './UserMenu.module.css';

interface UserMenuProps {
  isOpen: boolean;
  onProfileClick: () => void;
  onLogoutClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  isOpen,
  onProfileClick,
  onLogoutClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.menu} role="menu">
      <button
        type="button"
        className={styles.menuItem}
        onClick={onProfileClick}
        role="menuitem"
      >
        <span className={styles.menuItemText}>Личный кабинет</span>
      </button>
      <button
        type="button"
        className={styles.menuItem}
        onClick={onLogoutClick}
        role="menuitem"
      >
        <span className={styles.menuItemText}>Выйти из аккаунта</span>
        <Icon name="logout" size={24} className={styles.menuItemIcon} />
      </button>
    </div>
  );
};

export default UserMenu;
