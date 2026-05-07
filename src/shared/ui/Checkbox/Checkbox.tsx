import React from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import styles from './Checkbox.module.css';

type CheckboxType = 'category' | 'subcategory';

interface CheckboxProps {
  children: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
  type?: CheckboxType;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  checked,
  onChange,
  disabled = false,
  name,
  className = '',
  type,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const uniqueId = React.useId();

  const wrapperClasses = [styles['checkbox-wrapper'], className];

  if (type) {
    wrapperClasses.push(styles[type]);
  }

  const getIconName = (): IconName => {
    if (!checked) return 'checkbox-empty';
    return type === 'category' ? 'checkbox-remove' : 'checkbox-done';
  };

  const iconName = getIconName();

  return (
    <label htmlFor={uniqueId} className={wrapperClasses.join(' ')}>
      <div className={styles['checkbox-icon']}>
        <Icon name={iconName} size={24} aria-hidden='true' alt='Чекбокс' />
      </div>

      <span className={styles['checkbox-label']}>{children}</span>

      <input
        type='checkbox'
        id={uniqueId}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        name={name}
        className={styles['visually-hidden']}
      />
    </label>
  );
};
