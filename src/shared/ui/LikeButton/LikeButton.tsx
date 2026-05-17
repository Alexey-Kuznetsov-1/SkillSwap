import React, { useState } from 'react';
import { Icon, type IconName } from '@/shared/ui/Icon/Icon';
import styles from './LikeButton.module.css';

interface LikeButtonProps {
  /** Начальное состояние лайка */
  initialLiked?: boolean;
  /** Обработчик изменения состояния лайка */
  onLikeChange?: (liked: boolean) => void;
  /** Размер иконки */
  size?: number | string;
  /** Дополнительные CSS‑классы */
  className?: string;
  /** Заблокирована ли кнопка */
  disabled?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  initialLiked = false,
  onLikeChange,
  size = 20,
  className = '',
  disabled = false
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const handleClick = () => {
    if (disabled) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onLikeChange?.(newLikedState);
  };

  // Определяем имя иконки в зависимости от состояния
  const iconName: IconName = isLiked ? 'like-active' : 'like';

  // Формируем итоговый className с учётом стилей из CSS‑модуля
  const buttonClasses = [
    styles.likeButton,
    isLiked ? styles.liked : '',
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
    >
      <Icon
        name={iconName}
        size={size}
        className={styles.icon} // Применяем стили к иконке
        aria-label={isLiked ? 'Убрано из лайков' : 'Добавлено в лайки'}
      />
    </button>
  );
};
