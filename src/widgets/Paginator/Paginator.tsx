import styles from './Paginator.module.css';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export const Paginator = ({ currentPage, totalPages, onChange, className = '' }: PaginatorProps) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => currentPage > 1 && onChange(currentPage - 1);
  const handleNext = () => currentPage < totalPages && onChange(currentPage + 1);
  const handlePageClick = (page: number) => onChange(page);

  // формируем список номеров страниц для отображения
  const getVisiblePages = (): (number | string)[] => {
    const range = 1; // сколько страниц показывать вокруг текущей
    const pages: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
        pages.push(i);
      }
    }

    // добавляем многоточие, если есть разрыв
    const result: (number | string)[] = [];
    for (let i = 0; i < pages.length; i++) {
      if (i > 0 && pages[i] - pages[i - 1] > 1) {
        result.push('...');
      }
      result.push(pages[i]);
    }
    return result;
  };

  return (
    <nav className={`${styles.paginator} ${className}`} aria-label="Pagination">
      <button className={styles.button} disabled={currentPage === 1} onClick={handlePrev}>
        ← Назад
      </button>

      {getVisiblePages().map((item, index) =>
        typeof item === 'number' ? (
          <button
            key={item}
            className={`${styles.page} ${currentPage === item ? styles.active : ''}`}
            onClick={() => handlePageClick(item)}
            aria-current={currentPage === item ? 'page' : undefined}
          >
            {item}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
        )
      )}

      <button className={styles.button} disabled={currentPage === totalPages} onClick={handleNext}>
        Вперед →
      </button>
    </nav>
  );
};