import React from 'react';
import styles from './Input.module.css';

export type InputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'search';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Тип поля */
  type?: InputType;
  /** Текущее значение */
  value: string;
  /** Обработчик изменения */
  onChange: (value: string) => void;
  /** Плейсхолдер */
  placeholder?: string;
  /** Состояние ошибки */
  error?: boolean;
  /** Блокировка поля */
  disabled?: boolean;
  /** Иконка слева */
  leftIcon?: React.ReactNode;
  /** Иконка справа */
  rightIcon?: React.ReactNode;
  /** Размер поля */
  size?: 'sm' | 'md' | 'lg';
  /** Дополнительные классы */
  className?: string;
  /** Имя поля (для форм) */
  name?: string;
  /** ID поля (для связки с label) */
  id?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  error = false,
  disabled = false,
  leftIcon,
  rightIcon,
  size = 'md',
  className = '',
  name,
  id,
  ...restProps
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const inputClasses = [
    styles.input,
    styles[size],
    error ? styles.error : '',
    disabled ? styles.disabled : '',
    leftIcon ? styles.withLeftIcon : '',
    rightIcon ? styles.withRightIcon : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
      <input
        type={type}
        className={inputClasses}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        id={id}
        {...restProps}
      />
      {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
    </div>
  );
};