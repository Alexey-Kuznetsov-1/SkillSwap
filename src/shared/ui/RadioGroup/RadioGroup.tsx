import React from 'react';
import { Radio } from '../Radio/Radio';
import styles from './RadioGroup.module.css';

interface RadioGroupOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioGroupOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  className = '',
}) => {
  const handleRadioChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
    <div
      className={`${styles['radio-group']} ${className}`}
      role='radiogroup'
      aria-labelledby={`label-${name}`}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={handleRadioChange}
          className={styles['radio-item']}
        >
          {option.label}
        </Radio>
      ))}
    </div>
  );
};
