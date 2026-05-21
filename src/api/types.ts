// src/api/types.ts

// Направление навыка в фильтрах каталога.
export type SkillDirection = 'teach' | 'learn' | 'all';

// Категория навыков (верхний уровень каталога).
export type Category = {
  // Уникальный идентификатор категории.
  id: number;
  // Название категории для отображения в UI.
  name: string;
  // Путь до иконки категории.
  icon: string;
  // Цвет категории (например, для фона/бейджа).
  color: string;
};

// Подкатегория, привязанная к конкретной категории.
export type Subcategory = {
  // Уникальный идентификатор подкатегории.
  id: number;
  // Название подкатегории.
  name: string;
  // Идентификатор родительской категории.
  categoryId: number;
};

// UI-модель подкатегории с уже подставленной категорией.
export type SubcategoryWithCategory = Subcategory & {
  category: Category;
};

// Полная модель пользователя из mock-таблицы users.
export type User = {
  id: number;
  email: string;
  avatarUrl: string;
  name: string;
  about: string;
  birthDay: string;
  gender: string;
  registrationDate: string;
  cityId: number;
};

// Модель навыка из mock-таблицы skills.json.
export type Skill = {
  id: number;
  title: string;
  description: string;
  type: Exclude<SkillDirection, 'all'>;
  category: string;
  subCategory: string;
  author: string;
  authorCity: string;
  authorGender: string;
  authorAge: number;
  authorAvatar: string;
  likes: number;
};

// Связь "навык -> изображение".
export type SkillImage = {
  id: number;
  skillId: number;
  images: string;
};

// Связь "навык -> пользователь, поставивший лайк".
export type SkillLike = {
  id: number;
  skillId: number;
  userId: number;
};

// Город пользователя.
export type City = {
  id: number;
  name: string;
};

// Связь "пользователь -> подкатегория, которую хочет изучить".
export type UserSubcategoryWantToLearn = {
  id: number;
  userId: number;
  subcategoryId: number;
};

// UI-модель карточки навыка для каталога.
export type SkillCard = {
  id: number;
  name: string;
  description: string;
  direction: Exclude<SkillDirection, 'all'>;
  category: string;
  subcategory: string;
  author: {
    id?: number;
    name: string;
    avatarUrl: string;
    city: string;
    age: number;
  };
  likesCount: number;
};

// Расширенная модель для страницы навыка.
export type SkillDetails = SkillCard & {
  images: string[];
  about: string;
  age: number;
  city: string;
  authorGender: string;
};

// Параметры каталога.
export type SkillsCatalogParams = {
  query?: string;
  categoryId?: number;
  subcategoryId?: number;
  direction?: SkillDirection;
  page?: number;
  limit?: number;
};

// Результат каталога.
export type SkillsCatalogResult = {
  items: SkillCard[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

// Данные для регистрации.
export interface RegistrationFormData {
  email: string;
  password: string;
  avatar: string | null;
  name: string;
  birthDate: string;
  gender: string;
  city: string;
  categoryToLearn: number;
  subcategoryToLearn: number;
  categoryToTeach: number;
  subcategoryToTeach: number;
  skillName: string;
  skillDescription: string;
  photos: File[];
  skillId?: string;
}
