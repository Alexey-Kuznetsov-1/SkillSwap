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
  authorGender,
  onAuthorGenderChange,
  cities,
  selectedCities,
  onCityToggle,
}) => {
  const [showAllCities, setShowAllCities] = useState(false);

  const visibleCities = showAllCities ? cities : cities.slice(0, VISIBLE_CITIES_COUNT);
  const hasMoreCities = cities.length > VISIBLE_CITIES_COUNT;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Фильтры</h3>

        {/* Тип навыка */}
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

        {/* Навыки (категории) */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Навыки</label>
          <div className={styles.checkboxGroup}>
            {categories.map((category) => (
              <Checkbox
                key={category.value}
                checked={selectedCategories.includes(category.value)}
                onChange={() => onCategoryToggle(category.value)}
                name={`category-${category.value}`}
              >
                {category.label}
              </Checkbox>
            ))}
          </div>
        </div>

        {/* Пол автора */}
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

        {/* Город */}
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
          {hasMoreCities && (
            <button
              className={styles.showMoreButton}
              onClick={() => setShowAllCities(!showAllCities)}
            >
              {showAllCities ? 'Скрыть города' : 'Показать все'}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;