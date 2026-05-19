import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  currentStep: 1 | 2 | 3;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const getLineColor = (lineNumber: number): string => {
    if (lineNumber <= currentStep) {
      return styles.green; // зелёная, если номер линии ≤ текущему шагу
    } else {
      return styles.gray; // серая, если номер линии > текущему шагу
    }
  };

  return (
    <div className={styles['container']}>
      {/* Линия 1 */}
      <div
        className={`${styles.line} ${styles.firstLine} ${getLineColor(1)}`}
        aria-current={currentStep >= 1 ? 'step' : false}
        aria-label={`Шаг 1: ${currentStep >= 1 ? 'завершён' : 'ожидает'}`}
      />

      {/* Линия 2 */}
      <div
        className={`${styles.line} ${styles.secondLine} ${getLineColor(2)}`}
        aria-current={currentStep >= 2 ? 'step' : false}
        aria-label={`Шаг 2: ${currentStep >= 2 ? 'завершён' : 'ожидает'}`}
      />

      {/* Линия 3 */}
      <div
        className={`${styles.line} ${styles.thirdLine} ${getLineColor(3)}`}
        aria-current={currentStep >= 3 ? 'step' : false}
        aria-label={`Шаг 3: ${currentStep >= 3 ? 'завершён' : 'ожидает'}`}
      />
    </div>
  );
}
