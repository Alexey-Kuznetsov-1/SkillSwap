import React from 'react';
import styles from './CategoriesDropdown.module.css';

interface Category {
  value: string;
  label: string;
  subCategories: { value: string; label: string }[];
}

interface CategoriesDropdownProps {
  isOpen: boolean;
  onClose?: () => void;
  categories: Category[];
  onCategoryClick?: (categoryValue: string) => void;
  onSubCategoryClick?: (subCategoryValue: string) => void;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  isOpen,
  onClose,
  categories,
  onCategoryClick,
  onSubCategoryClick,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.dropdown}>
        <div className={styles.grid}>
          {categories.map((category) => (
            <div key={category.value} className={styles.column}>
              <button
                className={styles.categoryButton}
                onClick={() => onCategoryClick?.(category.value)}
              >
                {category.label}
              </button>
              <div className={styles.subCategories}>
                {category.subCategories.map((sub) => (
                  <button
                    key={sub.value}
                    className={styles.subCategoryButton}
                    onClick={() => onSubCategoryClick?.(sub.value)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesDropdown;