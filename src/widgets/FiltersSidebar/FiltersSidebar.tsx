import React, { useState } from 'react';
import { RadioGroup } from '@/shared/ui/RadioGroup/RadioGroup';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';
import styles from './FiltersSidebar.module.css';

interface FiltersSidebarProps {
  skillType: string;
  onSkillTypeChange: (value: string) => void;
  categories: { value: string; label: string }[];
  selectedCategories: string[];
  onCategoryToggle: (categoryValue: string) => void;
  subCategories: { value: string; label: string; parentCategory: string }[];
  selectedSubCategories: string[];
  onSubCategoryToggle: (subCategoryValue: string) => void;
  authorGender: string;
  onAuthorGenderChange: (value: string) => void;
  cities: string[];
  selectedCities: string[];
  onCityToggle: (city: string) => void;
}

const typeOptions = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
];

const genderOptions = [
  { value: 'any', label: 'Не имеет значения' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
];

const VISIBLE_CITIES_COUNT = 5;

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  skillType,
  onSkillTypeChange,
  categories,
  selectedCategories,
  onCategoryToggle,
  subCategories,
  selectedSubCategories,
  onSubCategoryToggle,
  authorGender,
  onAuthorGenderChange,
  cities,
  selectedCities,
  onCityToggle,
}) => {
  const [showAllCities, setShowAllCities] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const visibleCities = showAllCities ? cities : cities.slice(0, VISIBLE_CITIES_COUNT);
  const hasMoreCities = cities.length > VISIBLE_CITIES_COUNT;

  const handleCategoryToggle = (categoryValue: string) => {
    onCategoryToggle(categoryValue);
    // Автоматически раскрываем подкатегории при выборе категории
    if (!selectedCategories.includes(categoryValue)) {
      setExpandedCategories((prev) => [...prev, categoryValue]);
    }
  };

  const toggleExpand = (categoryValue: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Фильтры</h3>

        <div className={styles.filterGroup}>
          <div className={styles.radioGroupVertical}>
            <RadioGroup
              name="skillType"
              options={typeOptions}
              value={skillType}
              onChange={onSkillTypeChange}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Навыки</label>
          <div className={styles.checkboxGroup}>
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.value);
              const categorySubs = subCategories.filter(
                (sub) => sub.parentCategory === category.value
              );
              const isExpanded = expandedCategories.includes(category.value);

              return (
                <div key={category.value} className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(category.value)}
                      name={`category-${category.value}`}
                    >
                      {category.label}
                    </Checkbox>
                    {isSelected && categorySubs.length > 0 && (
                      <button
                        className={styles.expandButton}
                        onClick={() => toggleExpand(category.value)}
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    )}
                  </div>
                  {isExpanded && isSelected && categorySubs.length > 0 && (
                    <div className={styles.subCategoryList}>
                      {categorySubs.map((sub) => (
                        <Checkbox
                          key={sub.value}
                          checked={selectedSubCategories.includes(sub.value)}
                          onChange={() => onSubCategoryToggle(sub.value)}
                          name={`subcategory-${sub.value}`}
                        >
                          {sub.label}
                        </Checkbox>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Пол автора</label>
          <div className={styles.radioGroupVertical}>
            <RadioGroup
              name="authorGender"
              options={genderOptions}
              value={authorGender}
              onChange={onAuthorGenderChange}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Город</label>
          <div className={styles.checkboxGroup}>
            {visibleCities.map((city) => (
              <Checkbox
                key={city}
                checked={selectedCities.includes(city)}
                onChange={() => onCityToggle(city)}
                name={`city-${city}`}
              >
                {city}
              </Checkbox>
            ))}
          </div>
          {hasMoreCities && !showAllCities && (
            <button
              className={styles.showMoreButton}
              onClick={() => setShowAllCities(true)}
            >
              Показать все
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;