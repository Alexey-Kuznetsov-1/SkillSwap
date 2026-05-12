import React from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.illustration}>
          <Icon name="error-404" width={460} height={304} />
        </div>
        <div className={styles.textContent}>
          <div>
            <h1 className={styles.title}>Страница не найдена</h1>
            <p className={styles.description}>
              К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже
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

export default NotFound;