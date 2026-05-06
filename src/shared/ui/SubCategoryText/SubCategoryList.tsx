import { SubCategoryText } from '../SubCategoryText/SubCategoryText';
import styles from './SubCategoryList.module.css';

// тип данных (массив строк)
export type SubCategoryArray = string[];

interface SubCategoryListProps {
  SubCategoryArray: SubCategoryArray;
  className?: string;
}

export const SubCategoryList = ({ SubCategoryArray, className = '' }: SubCategoryListProps) => {
  // если больше 2, показываем 2 + счетчик остальных
  const visibleItems = SubCategoryArray.slice(0, 2);
  const remainingCount = SubCategoryArray.length - 2;

  return (
    <div className={`${styles.list} ${className}`}>
      {visibleItems.map((item, index) => (
        <SubCategoryText key={index} text={item} />
      ))}
      
      {remainingCount > 0 && (
        <span className={styles.remaining}>
          +{remainingCount}
        </span>
      )}
    </div>
  );
};