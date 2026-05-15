import React from 'react';
import styles from './FormField.module.css';

export interface FormFieldProps {
  /** Текст подписи (label) */
  label: string;
  /** Текст ошибки под полем */
  error?: string;
  /** Если true — добавляет звёздочку (*) к подписи */
  required?: boolean;
  /** Сам контрол: Input / Select / Textarea и т.п. */
  children: React.ReactNode;
  /** Дополнительные CSS-классы на корневой контейнер */
  className?: string;
  /** ID для связки label с контролом (если не используется обёртка) */
  htmlFor?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  className = '',
  htmlFor,
}) => {
  const hasError = Boolean(error);

  return (
    <div className={`${styles.field} ${className}`}>
      <label
        htmlFor={htmlFor}
        className={`${styles.label} ${required ? styles.required : ''}`}
      >
        {label}
        {required && <span className={styles.asterisk}>*</span>}
      </label>

      <div className={`${styles.control} ${hasError ? styles.controlError : ''}`}>
        {children}
      </div>

      {hasError && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};