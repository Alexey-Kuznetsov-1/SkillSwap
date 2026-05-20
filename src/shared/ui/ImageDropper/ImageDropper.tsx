import React, { useState, useCallback, useEffect, useRef } from 'react';
import styles from './ImageDropper.module.css';
import { Icon } from '../Icon/Icon';

interface ImageUploadFieldProps {
  onUpload?: (file: File) => void;
  onFilesChange?: (files: File[]) => void;
  uploadedFiles?: File[];
  acceptedFormats?: string[];
  maxFiles?: number;
  label?: string;
  singleSelection?: boolean;
  onRemove?: () => void;
  hasError?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  onFilesChange,
  onUpload,
  uploadedFiles = [],
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles = 5,
  label = 'Перетащите фото сюда или кликните для выбора',
  singleSelection = false,
  onRemove,
  hasError = false,
}) => {
  const [localUploadedFiles, setLocalUploadedFiles] = useState<File[]>(
    uploadedFiles || [],
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      setIsLoading(true);
      const validFiles: File[] = [];

      Array.from(files).forEach((file) => {
        if (
          acceptedFormats.includes(file.type) &&
          file.size <= 5 * 1024 * 1024
        ) {
          validFiles.push(file);
        } else if (!acceptedFormats.includes(file.type)) {
          alert(`Формат файла ${file.name} не поддерживается.`);
        } else {
          alert(`Файл ${file.name} превышает допустимый размер 5 МБ.`);
        }
      });

      if (validFiles.length > 0) {
        let combinedFiles: File[];
        if (singleSelection) {
          // Очищаем старые превью и файлы перед установкой нового
          previewUrls.forEach((url) => URL.revokeObjectURL(url));
          setPreviewUrls([]);
          setLocalUploadedFiles([validFiles[0]]); // обновляем состояние
          combinedFiles = [validFiles[0]];
        } else {
          combinedFiles = [...localUploadedFiles, ...validFiles].slice(
            0,
            maxFiles,
          );
          setLocalUploadedFiles(combinedFiles); // обновляем состояние
        }

        // Обновляем состояния
        if (singleSelection && onUpload) {
          onUpload(combinedFiles[0]);
        } else if (onFilesChange) {
          onFilesChange(combinedFiles);
        }

        try {
          const newUrls = validFiles.map((file) => URL.createObjectURL(file));
          if (singleSelection) {
            setPreviewUrls(newUrls.slice(0, 1));
          } else {
            setPreviewUrls([...previewUrls, ...newUrls].slice(0, maxFiles));
          }
        } catch (error) {
          console.error('Ошибка создания URL для превью:', error);
          alert('Не удалось создать превью для некоторых файлов.');
        }
      } else {
        alert(
          `Формат файла не поддерживается. Разрешены: JPEG, PNG, GIF, WebP`,
        );
      }
      setIsLoading(false);
    },
    [
      acceptedFormats,
      maxFiles,
      localUploadedFiles,
      onFilesChange,
      onUpload,
      singleSelection,
      previewUrls,
    ],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      const files = event.dataTransfer.files;
      handleFiles(files);
    },
    [handleFiles],
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    // Отзываем URL для удаляемого изображения
    URL.revokeObjectURL(previewUrls[index]);

    // Обновляем массив превью
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);

    // Обновляем список файлов
    const updatedFiles = localUploadedFiles.filter((_, i) => i !== index);
    setLocalUploadedFiles(updatedFiles);

    // Вызываем соответствующий колбэк
    if (singleSelection && onUpload) {
      if (updatedFiles.length > 0) {
        onUpload(updatedFiles[0]);
      } else {
        onUpload(null as unknown as File);
      }
    } else if (onFilesChange) {
      onFilesChange(updatedFiles);
    }

    // Вызываем onRemove, если передан
    onRemove?.();
  };

  // Для одиночного выбора показываем круглый превью
  if (singleSelection) {
    return (
      <div
        className={`${styles['container']} ${hasError ? styles['error'] : ''}`}
      >
        <div
          className={`${styles['icon-upload']} ${isDragOver ? styles['drag-over'] : ''}`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          title={
            previewUrls.length > 0
              ? 'Нажмите, чтобы изменить фото'
              : 'Загрузите фото'
          }
        >
          {previewUrls.length > 0 ? (
            <div className={styles['preview-container']}>
              <img
                src={previewUrls[0]}
                alt='Preview'
                className={styles['preview-image']}
              />
              <button
                type='button'
                className={styles['remove-avatar-button']}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(0); // удаляем единственное изображение
                }}
                aria-label='Удалить аватар'
              >
                ×
              </button>
            </div>
          ) : (
            <div className={styles['upload-icon']}>
              <svg
                width='54'
                height='54'
                viewBox='0 0 72 72'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M53.946 56.1741C51.8494 53.3991 49.1373 51.1486 46.0232 49.5999C42.9091 48.0511 39.478 47.2464 36 47.2491C32.522 47.2464 29.0909 48.0511 25.9767 49.5999C22.8626 51.1486 20.1505 53.3991 18.054 56.1741M53.946 56.1741C58.0365 52.5357 60.9243 47.7398 62.2265 42.4224C63.5287 37.105 63.1838 31.5174 61.2374 26.4005C59.291 21.2837 55.8351 16.8794 51.3282 13.7718C46.8212 10.6642 41.476 9 36.0015 9C30.527 9 25.1818 10.6642 20.6748 13.7718C16.1678 16.8794 12.712 21.2837 10.7656 26.4005C8.81919 31.5174 8.47422 37.105 9.77643 42.4224C11.0786 47.7398 13.9635 52.5357 18.054 56.1741M53.946 56.1741C49.0074 60.5777 42.6166 63.0074 36 62.9991C29.3823 63.0081 22.9933 60.5784 18.054 56.1741M45 29.2491C45 31.6361 44.0518 33.9253 42.3639 35.6131C40.6761 37.3009 38.3869 38.2491 36 38.2491C33.613 38.2491 31.3238 37.3009 29.636 35.6131C27.9482 33.9253 27 31.6361 27 29.2491C27 26.8622 27.9482 24.573 29.636 22.8852C31.3238 21.1973 33.613 20.2491 36 20.2491C38.3869 20.2491 40.6761 21.1973 42.3639 22.8852C44.0518 24.573 45 26.8622 45 29.2491Z'
                  stroke='#253017'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <rect
                  x='48'
                  y='48'
                  width='16'
                  height='16'
                  rx='8'
                  fill='#ABD27A'
                />
                <path
                  d='M60 56.5H52C51.7267 56.5 51.5 56.2733 51.5 56C51.5 55.7267 51.7267 55.5 52 55.5H60C60.2733 55.5 60.5 55.7267 60.5 56C60.5 56.2733 60.2733 56.5 60 56.5Z'
                  fill='white'
                />
                <path
                  d='M56 60.5C55.7267 60.5 55.5 60.2733 55.5 60V52C55.5 51.7267 55.7267 51.5 56 51.5C56.2733 51.5 56.5 51.7267 56.5 52V60C56.5 60.2733 56.2733 60.5 56 60.5Z'
                  fill='white'
                />
              </svg>
            </div>
          )}
        </div>

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={acceptedFormats.join(',')}
          multiple={false}
          className={styles['file-input']}
        />

        {isLoading && (
          <div className={styles['loading-indicator']}>
            <span className={styles['spinner']}>⏳</span>
          </div>
        )}
      </div>
    );
  }

  // Для множественного выбора — сетка превью
  return (
    <div className={`${styles['container']} ${styles['container-multiple']}`}>
      <div
        className={`${styles['drop-zone']} ${isDragOver ? styles['drag-over'] : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {isLoading && (
          <div className={styles['loading-overlay']}>
            <div className={styles['spinner']}>⏳</div>
            <p>Загружаем файлы...</p>
          </div>
        )}
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={acceptedFormats.join(',')}
          multiple
          className={styles['file-input']}
        />
        {previewUrls.length === 0 ? (
          <div className={styles['placeholder']}>
            <p className={styles['label']}>{label}</p>
            <span className={styles['icon']}>
              <Icon name='gallery-add' size='24' />
              Выбрать изображения
            </span>
          </div>
        ) : (
          <div className={styles['preview-grid']}>
            {previewUrls.map((url, index) => (
              <div key={index} className={styles['preview-item']}>
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className={styles['preview-image-multiple']}
                />
                <button
                  type='button'
                  className={styles['remove-button']}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {previewUrls.length > 0 && (
        <div className={styles['info']}>
          Выбрано {previewUrls.length} фото из {maxFiles}
        </div>
      )}
    </div>
  );
};
