// CardSkill.tsx
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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { SkillLike, User } from '@/api';

const cardContainer = styles['card-container'];
const userInfoContainer = styles['user-info-container'];
const userContainer = styles['user-container'];
const textContainer = styles['text-container'];
const textNameUser = styles['text-name--user'];
const textCityAg = styles['text-city--age'];
const tagsContainer = styles['tags-container'];
const childrenTagsContainer = styles['children-tags-container'];
const titleTags = styles['title-tags'];
const childrenTags = styles['children-tags'];

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
    isAuthenticated?: boolean;
    skills?: SkillCard[];
    wantedSkills?: SkillCard[];
    userAuthenticated?: User;
  };

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
  isAuthenticated = false,
  skills = [],
  wantedSkills = [],
  variant = 'default',
  descriptionUser,
  userAuthenticated,
  ...restProps
}) => {
    // 📊 ЛОГ ДЛЯ ОТЛАДКИ
    console.log('🔍 CardSkill received:', { 
      idSkill,
      skillName,
      authorName,
      authorCity,
      authorAge,
      typeSkill,
      skillsCount: skills.length,
      wantedSkillsCount: wantedSkills.length,
      skills: skills.map(s => ({ id: s.id, name: s.name, direction: s.direction })),
      wantedSkills: wantedSkills.map(s => ({ id: s.id, name: s.name, direction: s.direction }))
    });

    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(initialLiked);

    useEffect(() => {
        setIsLiked(initialLiked);
    }, [initialLiked]);

    const handleLikeChange = async (liked: boolean) => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      if (!userAuthenticated || !userAuthenticated.id) {
        console.error('Данные авторизованного пользователя отсутствуют или ID не указан');
        return;
      }

      try {
        const likeData: SkillLike = {
          id: Date.now(),
          skillId: idSkill,
          userId: userAuthenticated.id
        };

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

        let updatedLikes: SkillLike[];
        if (liked) {
          updatedLikes = [...existingLikes, likeData];
        } else {
          updatedLikes = existingLikes.filter(
            like => !(like.skillId === idSkill && like.userId === userAuthenticated.id)
          );
        }

        localStorage.setItem('skillLikes', JSON.stringify(updatedLikes));
        setIsLiked(liked);
        window.dispatchEvent(new Event('favoritesUpdated'));
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Ошибка сохранения лайка в localStorage:', error);
      }
    };

  const renderLimitedTags = (skillList: SkillCard[], direction: 'teach' | 'learn') => {
    console.log(`📋 renderLimitedTags для ${direction}:`, skillList.map(s => ({ name: s.name, direction: s.direction })));
    
    const filteredSkills = skillList.filter(skill => skill.direction === direction);
    console.log(`📋 Отфильтровано для ${direction}:`, filteredSkills.length);
    
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

  const handleDetailsClick = () => {
    const emptyCategory: Category = {
      id: 0,
      name: 'Без категории',
      icon: '',
      color: '#cccccc'
    };

    const emptySubcategory: SubcategoryWithCategory = {
      id: 0,
      name: 'Без подкатегории',
      categoryId: 0,
      category: emptyCategory
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
            />
          )}
        </div>
        {variant === 'description' && descriptionUser && (
        <div className={styles['description-container']}>
          <p className={styles['description-text']}>{descriptionUser}</p>
        </div>
        )}
      </div>
      <div className={tagsContainer}>
        <div className={childrenTagsContainer}>
          <h4 className={titleTags}>Может научить:</h4>
          <div className={childrenTags}>
            {renderLimitedTags(skills, 'teach') || (
              <span className={styles['no-skills']}>Нет скиллов для обучения</span>
            )}
          </div>
        </div>
        <div className={childrenTagsContainer}>
          <h4 className={titleTags}> Хочет научиться:</h4>
          <div className={childrenTags}>
            {renderLimitedTags(wantedSkills, 'learn') || (
              <span className={styles['no-skills']}>Пока не хочет ничему учиться</span>
            )}
          </div>
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