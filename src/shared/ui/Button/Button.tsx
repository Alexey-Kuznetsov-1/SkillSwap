import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  /** Содержимое кнопки (текст или текст + иконки) */
  children: React.ReactNode;
  /** Визуальный стиль кнопки */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** HTML-тип кнопки */
  type?: 'button' | 'submit' | 'reset';
  /** Заблокирована ли кнопка */
  disabled?: boolean;
  /** Обработчик клика */
  onClick?: () => void;
  /** Дополнительные CSS-классы */
  className?: string;
  /** Растянуть на всю ширину родителя */
  fullWidth?: boolean;
  /** Иконка слева от текста */
  iconLeft?: React.ReactNode;
  /** Иконка справа от текста */
  iconRight?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  iconLeft,
  iconRight,
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    disabled ? styles.disabled : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  );
};