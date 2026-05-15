import styles from './WelcomeBack.module.css';

interface WelcomeBackProps {
  image: string;
  title: string;
  text: string;
}

export const WelcomeBack = ({ image, title, text }: WelcomeBackProps) => {
  return (
    <div className={styles.container}>
      <img src={image} alt="" className={styles.icon} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </div>
  );
};