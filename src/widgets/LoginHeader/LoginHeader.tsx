// src/widgets/LoginHeader/LoginHeader.tsx
import { Logo } from '@/shared/ui/Logo/Logo';
import styles from './LoginHeader.module.css';

interface LoginHeaderProps {
  onClose: () => void;
}

export const LoginHeader = ({ onClose }: LoginHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo variant="default" withText onClick={onClose} />
        <button className={styles.closeButton} onClick={onClose}>
          <span className={styles.closeText}>Закрыть</span>
          <span className={styles.closeIcon}>✕</span>
        </button>
      </div>
    </header>
  );
};