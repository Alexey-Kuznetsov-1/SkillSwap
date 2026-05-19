import type { ChangeEvent } from 'react';

import styles from './Select.module.css';

type TSelectOption = {
  value: string;
  label: string;
};

type TSelectProps = {
  id?: string;
  options: TSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
};

export function Select({
  options,
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  className = '',
  autoComplete,
}: TSelectProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      {label ? <span className={styles.label}>{label}</span> : null}

      <select
        className={`${styles.select} ${error ? styles.errorState : ''}`.trim()}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
      >
        {placeholder ? (
          <option value='' disabled>
            {placeholder}
          </option>
        ) : null}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  );
}
