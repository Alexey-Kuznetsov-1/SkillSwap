import React, { forwardRef } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps {
  id?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
  label?: string;
  disabled?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      value,
      onChange,
      onBlur,
      placeholder = '',
      rows = 4,
      maxLength,
      error,
      label,
      disabled = false,
      className = '',
    },
    ref,
  ) => {
    const combinedClassName = `${styles.textarea} ${
      error ? styles.error : ''
    } ${disabled ? styles.disabled : ''} ${className}`;

    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea
          id={id}
          className={combinedClassName}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          aria-describedby={error ? 'error-message' : undefined}
        />
        {error && (
          <div id='error-message' className={styles['error-message']}>
            {error}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
