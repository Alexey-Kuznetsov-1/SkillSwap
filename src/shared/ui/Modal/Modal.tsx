import { memo } from 'react';
import type { FC } from 'react';

import styles from './Modal.module.css';
import { ModalOverlayUI } from '../ModalOverlay/ModalOverlay';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ModalUI: FC<ModalProps> = memo(
  ({ isOpen, onClose, icon, title, subtitle, children }) => {
    console.log('ModalUI рендерится, isOpen:', isOpen);
    if (!isOpen) {
      console.log('ModalUI: isOpen false, возвращаем null');
      return null;
    }
    console.log('ModalUI: isOpen true, рендерим содержимое');
    return (
      <>
        <div className={styles.modal}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <ModalOverlayUI onClick={onClose} />
      </>
    );
  },
);
