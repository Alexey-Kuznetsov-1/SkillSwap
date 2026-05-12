import styles from './OfferDone.module.css';

interface OfferDoneProps {
  title?: string;
  text?: string;
}

export const OfferDone = ({ 
  title = 'Ваше предложение создано', 
  text = 'Теперь другие пользователи могут увидеть ваш навык и предложить обмен' 
}: OfferDoneProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>✅</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </div>
  );
};