import React from 'react';
import styles from './Textarea.module.css';

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = '',
  rows = 4,
  maxLength,
  error,
  label,
  disabled = false,
  className = '',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const combinedClassName = `${styles.textarea} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''} ${className}`;

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={combinedClassName}
        value={value}
        onChange={handleChange}
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
};
