import styles from './CardSkill.module.css';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import Tag from '@/shared/ui/Tag/Tag';
import { Button } from '@/shared/ui/Button/Button';
import type {
  SkillDetails,
  SkillCard,
  SubcategoryWithCategory,
  Category
} from '@/api';
import { LikeButton } from '@/shared/ui/LikeButton/LikeButton';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { SkillLike, User } from '@/api';

        //Константы стилей
const cardContainer = styles['card-container']; //стили корневого контейнера
const userInfoContainer = styles['user-info-container'];
const userContainer = styles['user-container'];
const textContainer = styles['text-container'];
const textNameUser = styles['text-name--user'];
const textCityAg = styles['text-city--age'];
const tagsContainer = styles['tags-container'];
const childrenTagsContainer = styles['children-tags-container'];
const titleTags = styles['title-tags'];

//интерфейс пропсов карточки скила пользователя
export interface PropsSkillCard {
    variant?: 'default' | 'description';
    idSkill: number;
    skillName: string;
    descriptionSkill: string;
    descriptionUser?: string;
    typeSkill: 'teach' | 'learn';
    category?: Category;
    subCategory?: SubcategoryWithCategory;
    authorName: string;
    authorCity: string;
    authorGender?: string;
    authorAge: number;
    authorAvatar: string;
    initialLiked: boolean;
    likes?: number;
    className?:string
    isAuthenticated?: boolean; // Новое поле: состояние авторизации
    skills?: SkillCard[]; // Массив скиллов пользователя 'teach' | 'learn'
    userAuthenticated?: User;
  };

//Компонент CardSkill
export const CardSkill: React.FC<PropsSkillCard> = ({
  idSkill,
  skillName,
  descriptionSkill,
  typeSkill,
  category,
  subCategory,
  likes,
  authorName,
  authorCity,
  authorAge,
  authorAvatar,
  initialLiked = false,
  isAuthenticated = false, // По умолчанию — не авторизован
  skills = [], // По умолчанию — пустой массив
  variant = 'default', // По умолчанию — стандартный вариант
  descriptionUser,
  userAuthenticated,
  ...restProps
}) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(initialLiked);

    /*Функционал работы кнопки лайк */
    const handleLikeChange = async (liked: boolean) => {
      if (!isAuthenticated) {
        navigate('/register');
        return;
      }

      // Проверяем, что userAuthenticated передан и содержит ID
      if (!userAuthenticated || !userAuthenticated.id) {
        console.error('Данные авторизованного пользователя отсутствуют или ID не указан');
        return;
      }

      try {
        // Формируем объект SkillLike
        const likeData: SkillLike = {
          id: Date.now(), // Временный ID (можно заменить на UUID)
          skillId: idSkill, // ID навыка из пропсов
          userId: userAuthenticated.id // ID пользователя из userAuthenticated
        };

        // Получаем текущие лайки из localStorage
        const existingLikesJSON = localStorage.getItem('skillLikes');
        let existingLikes: SkillLike[] = [];

        if (existingLikesJSON) {
          try {
            existingLikes = JSON.parse(existingLikesJSON);
          } catch (parseError) {
            console.error('Ошибка парсинга данных из localStorage:', parseError);
            existingLikes = [];
          }
        }

        // Если лайк ставится (liked === true), добавляем запись
        // Если снимается (liked === false), удаляем запись с таким skillId и userId
        let updatedLikes: SkillLike[];
        if (liked) {
          updatedLikes = [...existingLikes, likeData];
        } else {
          updatedLikes = existingLikes.filter(
            like => !(like.skillId === idSkill && like.userId === userAuthenticated.id)
          );
        }

        // Сохраняем обновлённый массив в localStorage
        localStorage.setItem('skillLikes', JSON.stringify(updatedLikes));

        // Обновляем состояние компонента
        setIsLiked(liked);
        console.log('Лайк успешно сохранён в localStorage:', likeData);
      } catch (error) {
        console.error('Ошибка сохранения лайка в localStorage:', error);
      }
    };

   // Фильтруем скиллы по направлениям и колличеству для отображения тегов
  const renderLimitedTags = (skillList: SkillCard[], direction: 'teach' | 'learn') => {
    const filteredSkills = skillList.filter(skill => skill.direction === direction);
    if (filteredSkills.length === 0) return null;

    const visibleSkills = filteredSkills.slice(0, 2);
    const remainingCount = filteredSkills.length - 2;


    return (
      <>
        {visibleSkills.map(skill => (
          <Tag
            key={skill.id}
            children={skill.name}
            subCategory={skill.subcategory}
          />
        ))}
        {remainingCount > 0 && (
          <Tag
            key="more"
            children={`+${remainingCount}`}
            subCategory={null as unknown as SubcategoryWithCategory}
            className={styles['tag-more']}
          />
        )}
      </>
    );
  };

  /*Функционал кнопки "Подробнее" */
  const handleDetailsClick = () => {
    // Заглушка для Category
    const emptyCategory: Category = {
      id: 0,
      name: 'Без категории',
      icon: '', // обязательное поле
      color: '#cccccc' // один цвет
    };

    // Заглушка для SubcategoryWithCategory
    const emptySubcategory: SubcategoryWithCategory = {
      id: 0,
      name: 'Без подкатегории',
      categoryId: 0,
      category: emptyCategory // обязательное поле — ссылка на категорию
    };

    const skillDetails: SkillDetails = {
      id: idSkill,
      name: skillName,
      description: descriptionSkill || '',
      direction: typeSkill,
      category: category || emptyCategory,
      subcategory: subCategory || emptySubcategory,
      author: {
        id: userAuthenticated?.id || 0,
        name: authorName,
        avatarUrl: authorAvatar
      },
      likesCount: likes || 0,
      images: [authorAvatar],
      city: {
        id: userAuthenticated?.cityId || 0,
        name: authorCity
      },
      about: userAuthenticated?.about || '',
      age: authorAge
    };

    navigate(`/skill/${idSkill}`, { state: { skillDetails } });
  };


  return (
    <div
      className={`${cardContainer} ${styles[`card-container--${variant}`]}`}
      {...restProps}
    >
      <div className={userInfoContainer}>
        <div className={userContainer}>
          <Avatar src = {authorAvatar}
                  name = {authorName} 
                  size={100}
          />
          <div className={textContainer}>
            <span className={textNameUser}>{authorName}</span>
            <span className={textCityAg}>{authorCity}, {authorAge} года</span>
          </div>
          {variant === 'default' && (
            <LikeButton
              className={styles.likes}
              initialLiked={isLiked}
              onLikeChange={handleLikeChange}
              size={20}
              //disabled={!isAuthenticated} // Кнопка неактивна для неавторизованных
            />
          )}
        </div>
        {/* Текст из description для description варианта */}
        {variant === 'description' && descriptionUser && (
        <div className={styles['description-container']}>
          <p className={styles['description-text']}>{descriptionUser}</p>
        </div>
        )}
      </div>
      <div className={tagsContainer}>
        {/* Блок «Может научить» — отображаются скиллы с type: 'teach' */}
        <div className={childrenTagsContainer}>
          <h4 className={titleTags}>Может научить:</h4>
          {renderLimitedTags(skills, 'teach') || (
            <span className={styles['no-skills']}>Нет скиллов для обучения</span>
          )}
        </div>
        {/* Блок «Хочет научиться» — отображаются скиллы с type: 'learn' */}
        <div className={childrenTagsContainer}>
          <h4 className={titleTags}> Хочет научиться:</h4>
          {renderLimitedTags(skills, 'learn') || (
            <span className={styles['no-skills']}>Пока не хочет ничему учиться</span>
          )}
        </div>
      </div>
      {variant === 'default' && (
      <Button
        children="Подробнее"
        onClick={handleDetailsClick}
      />
    )}
    </div>
  );
};

/*Пример использования компонента в другом компоненте */
/*
<CardSkill 
        isAuthenticated={true}
        variant="default"
        descriptionUser="Привет! Люблю ритм, кофе
        по утрам и людей, которые 
        не боятся пробовать новое"
        descriptionSkill="Описание игры на барабанах"
        initialLiked={true}
        idSkill={1}
        skillName={'Игра на барабанах'}
        typeSkill={'learn'}
        authorName={'Василий'}
        authorCity={'Казань'}
        authorAge={23}
        authorAvatar={''}
/>
*/

/*Пример использования данных компоненты по кнопке "Подробнее" */

/*
Шаг 1. Настройка маршрута
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { SkillDetailsPage } from './pages/SkillDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/skill/:id" element={<SkillDetailsPage />} />
        ...другие маршруты
      </Routes>
    </Router>
  );
}
*/

/*
Шаг 2. Получение данных на странице деталей
import { useLocation } from 'react-router';
import type { SkillDetails } from '@/api';

export const SkillDetailsPage: React.FC = () => {
  const location = useLocation();
  const { skillDetails } = location.state as { skillDetails?: SkillDetails };

  if (!skillDetails) {
    return (
      <div className="error-message">
        <h2>Ошибка загрузки данных</h2>
        <p>Данные навыка не были переданы. Попробуйте вернуться на предыдущую страницу.</p>
        <button onClick={() => window.history.back()}>
          Вернуться назад
        </button>
      </div>
    );
  }

  return <SkillDetailsView skill={skillDetails} />;
};

и далее по ситуации)))
*/

