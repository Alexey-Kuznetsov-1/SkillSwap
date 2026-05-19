import React from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './ChangeDone.module.css';

interface ChangeDoneProps {
  /** Функция закрытия модального окна */
  onClose?: () => void;
}

export const ChangeDone: React.FC<ChangeDoneProps> = ({ onClose }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Icon name="notification" size={80} />
      </div>
      
      <div className={styles.textContent}>
        <h2 className={styles.title}>Вы предложили обмен</h2>
        <p className={styles.description}>
          Теперь дождитесь подтверждения. Вам придёт<br />
          уведомление
        </p>
      </div>

      <div className={styles.buttonWrapper}>
        <Button variant="primary" onClick={onClose}>
          Готово
        </Button>
      </div>
    </div>
  );
};

export default ChangeDone;