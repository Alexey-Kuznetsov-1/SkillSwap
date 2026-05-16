import styles from './Avatar.module.css';

const avatarImageClass = styles['avatar--image'];
const avatarNoImageClass = styles['avatar--no-image'];

//интерфейс пропсов аватарки пользователя
export interface AvatarProps {
  src?: string;
  name?: string;
  className?: string;
  size?:number;
};

// Компонент круглого изображения аватарки пользоваьтеля
export function Avatar(props:AvatarProps) {
  const { src, name, className, size=48 } = props;

  // Шаг 1: определяем базовый класс в зависимости от src
  const baseClass = src ? avatarImageClass : avatarNoImageClass;

  // Формируем итоговый класс — добавляем специальный класс для fallback, если нужен
  const finalClassName = className
    ? `${baseClass} ${className}`
    : baseClass;
  
    // Генерируем инициалы: берём первую букву каждого слова
  const getInitial = (fullName: string): string => {
    return fullName
      .split(' ') // разбиваем имя на слова
      .map(word => word.charAt(0).toUpperCase()) // берём первую букву и делаем заглавной
      .join('');  // объединяем в строку
  };
    // Стили инлайна для динамического размера
  const avatarStyle: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: `${size * 0.5}px`, // Базовый размер шрифта = 50 % от размера аватара
  };

  // Если src есть — показываем изображение
  if (src) {
    return (
      <img
      src={src} //url изображения
      className={finalClassName} // класс стиля
      style={avatarStyle}
      alt={`Аватар пользователя ${name || 'неизвестный'}`} // описание изображения
      />
    ); 
  }

  // Иначе — показываем контейнер с инициалами
  return (
    <div
      className={finalClassName}
      style={avatarStyle}
    >
      {name ? getInitial(name) : '?' }
    </div>
  );

};
