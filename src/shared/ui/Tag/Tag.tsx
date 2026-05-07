import React from 'react';
import styles from './Tag.module.css';
import type { SubcategoryWithCategory } from '../../../api/types';


export interface TagProps {
  children: React.ReactNode;
  subCategory?: SubcategoryWithCategory;
  className?: string;
}

const textClass = styles['tag-text'];
const tagDefaultClass = styles['tag-default'];

//  при отсутсствии категории скила,
//  то етсь в тег попадает текст с +1 например,
//  то бэкграунд применяеться из стиля tag.default.

export const Tag: React.FC<TagProps> = ({ children, subCategory, className = '', ...rest }) => {
  const color = subCategory?.category?.color || ''; // Извлекаем цвет из subCategory
  const shouldUseDefaultStyle = !color;

  return (
    <div
      className={`${styles.tag} ${shouldUseDefaultStyle ? tagDefaultClass : ''} ${className}`}
      style={{ backgroundColor: color }}
      {...rest}
    >
      <p className={textClass}>
        {children}
      </p>
    </div>
  );
};

export default Tag;