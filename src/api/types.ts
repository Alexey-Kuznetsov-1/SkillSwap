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

// Полная модель пользователя из mock-таблицы users.
export type User = {
  // Уникальный идентификатор пользователя.
  id: number;
  // Email пользователя.
  email: string;
  // Ссылка на аватар пользователя.
  avatarUrl: string;
  // Имя пользователя.
  name: string;
  // Краткое описание профиля пользователя.
  about: string;
  // Дата рождения пользователя (ISO-строка).
  birthDay: string;
  // Пол пользователя.
  gender: string;
  // Дата регистрации пользователя.
  registrationDate: string;
  // Идентификатор города пользователя.
  cityId: number;
};

// Модель навыка из mock-таблицы skills.
export type Skill = {
  // Уникальный идентификатор навыка.
  id: number;
  // Название навыка.
  name: string;
  // Идентификатор подкатегории навыка.
  subCategoryId: number;
  // Описание навыка.
  description: string;
  // Идентификатор автора навыка (пользователя).
  userId: number;
  // Тип навыка в моках: «учу» или «учусь» (у каждой записи в skills.json задано явно).
  type: Exclude<SkillDirection, 'all'>;
};

// Связь "навык -> изображение" (одна запись = одно изображение).
export type SkillImage = {
  // Уникальный идентификатор записи изображения.
  id: number;
  // Идентификатор навыка, к которому относится изображение.
  skillId: number;
  // Путь/URL изображения навыка.
  images: string;
};

// Связь "навык -> пользователь, поставивший лайк".
export type SkillLike = {
  // Уникальный идентификатор лайка.
  id: number;
  // Идентификатор навыка, которому поставили лайк.
  skillId: number;
  // Идентификатор пользователя, поставившего лайк.
  userId: number;
};

// Город пользователя.
export type City = {
  // Уникальный идентификатор города.
  id: number;
  // Название города.
  name: string;
};

// Связь "пользователь -> подкатегория, которую хочет изучить".
export type UserSubcategoryWantToLearn = {
  // Уникальный идентификатор записи связи.
  id: number;
  // Идентификатор пользователя.
  userId: number;
  // Идентификатор подкатегории, которую пользователь хочет изучать.
  subcategoryId: number;
};

// UI-модель карточки навыка для каталога/related-блока.
export type SkillCard = {
  // Уникальный идентификатор навыка.
  id: number;
  // Название навыка.
  name: string;
  // Краткое описание навыка.
  description: string;
  // Направление навыка (совпадает с полем type в моке).
  direction: Exclude<SkillDirection, 'all'>;
  // Категория навыка.
  category: Category;
  // Подкатегория навыка.
  subcategory: Subcategory;
  // Минимальный набор данных автора для UI карточки.
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  // Количество лайков, агрегированное из таблицы skill-likes.
  likesCount: number;
};

// Расширенная модель для страницы навыка.
export type SkillDetails = SkillCard & {
  // Полный список изображений навыка.
  images: string[];
  // Город автора (из cities по cityId пользователя), обязателен.
  city: City;
  // Текст «о себе» автора.
  about: string;
  // Полных лет автору на момент расчёта (от birthDay).
  age: number;
};

// Параметры каталога (поиск, фильтры, пагинация).
export type SkillsCatalogParams = {
  // Поисковый запрос по названию/описанию.
  query?: string;
  // Фильтр по категории.
  categoryId?: number;
  // Фильтр по подкатегории.
  subcategoryId?: number;
  // Фильтр по направлению навыка.
  direction?: SkillDirection;
  // Номер страницы (начиная с 1).
  page?: number;
  // Количество элементов на страницу.
  limit?: number;
};

// Результат каталога с метаданными пагинации.
export type SkillsCatalogResult = {
  // Список карточек навыков текущей выборки.
  items: SkillCard[];
  // Общее количество элементов после фильтрации.
  total: number;
  // Текущая страница.
  page: number;
  // Лимит элементов на страницу.
  limit: number;
  // Есть ли следующая порция данных.
  hasMore: boolean;
};
