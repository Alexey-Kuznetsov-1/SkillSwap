import React from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './ServerError.module.css';

const ServerError: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.illustration}>
          <Icon name="error-500" width={460} height={304} />
        </div>
        <div className={styles.textContent}>
          <div>
            <h1 className={styles.title}>На сервере произошла ошибка</h1>
            <p className={styles.description}>
              Попробуйте позже или вернитесь на главную страницу
            </p>
          </div>
          <div className={styles.buttons}>
            <Button variant="secondary">Сообщить об ошибке</Button>
            <Button variant="primary">На главную</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerError;