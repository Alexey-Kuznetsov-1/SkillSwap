// src/widgets/LoginHeader/LoginHeader.tsx
import { Logo } from '@/shared/ui/Logo/Logo';
import styles from './LoginHeader.module.css';
import { Button } from '../../shared/ui/Button/Button';
import { Icon } from '../../shared/ui/Icon/Icon';

interface LoginHeaderProps {
  onClose: () => void;
}

export const LoginHeader = ({ onClose }: LoginHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo variant='default' withText onClick={onClose} />
        <Button
          className='closeButton'
          variant='tertiary'
          type='reset'
          onClick={onClose}
          iconRight={<Icon name='cross' size='24' className='closeIcon' />}
          children={
            <>
              <span className={styles.closeText}>Закрыть</span>
            </>
          }
        ></Button>
      </div>
    </header>
  );
};
