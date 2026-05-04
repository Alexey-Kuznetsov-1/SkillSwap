import React from 'react';
import styles from './Radio.module.css';

interface RadioProps {
  children: React.ReactNode;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  children,
  name,
  value,
  checked,
  onChange,
  className = '',
}) => {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <label className={`${styles['radio-wrapper']} ${className}`}>
      <input
        type='radio'
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className={styles['radio-input']}
      />
      <span className={styles['radio-visual']} />
      <span className={styles['label']}>{children}</span>
    </label>
  );
};
