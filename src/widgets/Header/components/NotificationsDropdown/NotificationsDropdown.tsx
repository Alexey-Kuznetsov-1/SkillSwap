import React from 'react';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './NotificationsDropdown.module.css';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  isNew: boolean;
  actionLabel?: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onReadAll?: () => void;
  onClearViewed?: () => void;
  onActionClick?: (notificationId: string) => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  notifications,
  onReadAll,
  onClearViewed,
  onActionClick,
}) => {
  if (!isOpen) return null;

  const newNotifications = notifications.filter((item) => item.isNew);
  const viewedNotifications = notifications.filter((item) => !item.isNew);

  const renderItem = (item: NotificationItem) => (
    <li key={item.id} className={styles.item}>
      <div className={styles.itemIcon}>
        <Icon name="light-bulb" size={24} />
      </div>
      <div className={styles.itemBody}>
        <div className={styles.itemHeader}>
          <p className={styles.itemTitle}>{item.title}</p>
          <span className={styles.itemDate}>{item.date}</span>
        </div>
        <p className={styles.itemDescription}>{item.description}</p>
        {item.isNew && item.actionLabel && (
          <button
            type="button"
            className={styles.itemAction}
            onClick={() => onActionClick?.(item.id)}
          >
            {item.actionLabel}
          </button>
        )}
      </div>
    </li>
  );

  return (
    <div className={styles.dropdown} role="dialog" aria-label="Уведомления">
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Новые уведомления</h3>
          <button
            type="button"
            className={styles.sectionAction}
            onClick={onReadAll}
            disabled={newNotifications.length === 0}
          >
            Прочитать все
          </button>
        </header>
        {newNotifications.length > 0 ? (
          <ul className={styles.list}>{newNotifications.map(renderItem)}</ul>
        ) : (
          <p className={styles.empty}>Нет новых уведомлений</p>
        )}
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Просмотренные</h3>
          <button
            type="button"
            className={styles.sectionAction}
            onClick={onClearViewed}
            disabled={viewedNotifications.length === 0}
          >
            Очистить
          </button>
        </header>
        {viewedNotifications.length > 0 ? (
          <ul className={styles.list}>{viewedNotifications.map(renderItem)}</ul>
        ) : (
          <p className={styles.empty}>Список пуст</p>
        )}
      </section>
    </div>
  );
};

export default NotificationsDropdown;
