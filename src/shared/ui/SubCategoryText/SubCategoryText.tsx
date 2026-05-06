import styles from './SubCategoryText.module.css';

interface SubCategoryTextProps {
  text: string;
}

export const SubCategoryText = ({ text }: SubCategoryTextProps) => {
  return (
    <span className={styles.text}>
      {text}
    </span>
  );
};