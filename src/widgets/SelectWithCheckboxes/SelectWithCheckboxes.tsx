import React, { useState, useRef, useEffect } from 'react';
import styles from './SelectWithCheckboxes.module.css';
import { Icon } from '@/shared/ui/Icon';

interface SelectWithCheckboxesProps {
  label: string;
  options: { value: number; label: string }[];
  selectedValues: number[];
  onSelectionChange: (values: number[]) => void;
  placeholder: string;
  error?: string;
  type: 'category' | 'subcategory';
}

export const SelectWithCheckboxes: React.FC<SelectWithCheckboxesProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Закрываем список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionToggle = (value: number) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newValues);
  };

  const displayText =
    selectedValues.length > 0
      ? `${selectedValues.length} выбрано`
      : placeholder;

  return (
    <div className={styles['select-container']} ref={containerRef}>
      <label className={styles['label']}>{label}</label>
      <div
        className={`${styles['select-trigger']} ${isOpen ? styles['open'] : ''} ${error ? styles['error'] : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles['display-text']}>{displayText}</span>
        <Icon name='chevron-down' size={20} />
      </div>

      {isOpen && (
        <div className={styles['dropdown']}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles['option']} ${selectedValues.includes(option.value) ? styles['selected'] : ''}`}
              onClick={() => handleOptionToggle(option.value)}
            >
              <div className={styles['checkbox']}>
                {selectedValues.includes(option.value) && (
                  <Icon name='check' size={16} />
                )}
              </div>
              <span className={styles['option-text']}>{option.label}</span>
            </div>
          ))}
        </div>
      )}

      {error && <span className={styles['error-message']}>{error}</span>}
    </div>
  );
};
