import { Icon } from '@/shared/ui/Icon';
import styles from './ImageView.module.css';
import { useState } from 'react';

export interface ImageViewProps {
  imagesSkill: string[];
  className?: string;
}

export function ImageView({ imagesSkill, className }: ImageViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imagesSkill || imagesSkill.length === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.noImages}>
          <span>Нет изображений</span>
        </div>
      </div>
    );
  }

  const currentImage = imagesSkill[currentIndex];
  const hasMultipleImages = imagesSkill.length > 1;

  const thumbnails = imagesSkill.length === 3
    ? imagesSkill.slice(0, 3) // Если ровно 3 изображения — берём все 3 для миниатюр
    : imagesSkill.slice(0, 2); // Иначе — только первые 2
  //const thumbnails = imagesSkill.slice(0, 2); // Берём до 2 миниатюр для отображения
  
  //const remainingCount = Math.max(0, imagesSkill.length - 2); // Оставшиеся после 2-х
  const remainingCount = imagesSkill.length > 3 ? imagesSkill.length - 2 : 0;

  const goToNext = () => {
    if (currentIndex < imagesSkill.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Определяем источник изображения для блока «+N»
  /* 
  const moreImageSrc = imagesSkill.length > 2
    ? imagesSkill[2]
    : thumbnails.length > 1
      ? thumbnails[1]
      : '';
*/
/* 
  const moreImageSrc = currentIndex < 2
    ? (imagesSkill.length > 2 ? imagesSkill[2] : thumbnails[1]) // Пока смотрим первые 2 — показываем 3-е изображение
    : currentImage; // Как только перешли на 3-е и далее — показываем текущее активное изображение

*/
  const moreImageSrc = imagesSkill.length > 3
    ? (currentIndex < 2 ? imagesSkill[2] : currentImage)
    : '';


  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.gallery}>
        {/* Большая картинка с кнопками навигации */}
        <div className={styles.mainImageContainer}>
          {hasMultipleImages && (
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={goToPrev}
              disabled={currentIndex === 0}
              aria-label="Предыдущее изображение"
            >
              <Icon
                name="chevron-right"
                size={16}
                style={{ transform: 'rotate(180deg)' }}
              />
            </button>
          )}

          <img
            src={currentImage}
            alt={`Изображение навыка ${currentIndex + 1}`}
            className={styles.mainImage}
          />

          {hasMultipleImages && (
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={goToNext}
              disabled={currentIndex === imagesSkill.length - 1}
              aria-label="Следующее изображение"
            >
              <Icon name="chevron-right" size={16} />
            </button>
          )}
        </div>

        {/* Колонка с миниатюрами */}
        <div className={styles.thumbnailsContainer}>
          {/* Отображаем до 2-х миниатюр */}
          {thumbnails.map((image, index) => (
            <div
              key={index}
              className={`
                ${styles.thumbnail}
                ${currentIndex === index ? styles.active : ''}
              `}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={image}
                alt={`Миниатюра ${index + 1}`}
                className={styles.thumbnailImage}
              />
            </div>
          ))}

          {/* Блок "+N" если есть оставшиеся изображения */}
          {remainingCount > 0 && (
            <div className={styles.moreImages}>
              <img
                src={moreImageSrc}
                alt="Дополнительные изображения"
                className={styles.thumbnailImage}
              />
              <div className={styles.overlay}>
                +{remainingCount}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}