import { fetchJson, type ApiListResponse } from '@/api/client';
import type {
  Category,
  City,
  Skill,
  SkillImage,
  SkillLike,
  Subcategory,
  User,
  UserSubcategoryWantToLearn
} from '@/api/types';

type MockDbState = {
  skills: Skill[];
  categories: Category[];
  subcategories: Subcategory[];
  users: User[];
  skillImages: SkillImage[];
  skillLikes: SkillLike[];
  cities: City[];
  userSubcategoriesWantToLearn: UserSubcategoryWantToLearn[];
};

// Пути ко всем mock-таблицам проекта.
const DB_PATHS = {
  skills: '/db/skills.json',
  categories: '/db/categories.json',
  subcategories: '/db/subcategories.json',
  users: '/db/users.json',
  skillImages: '/db/skill-images.json',
  skillLikes: '/db/skill-likes.json',
  cities: '/db/cities.json',
  userSubcategoriesWantToLearn: '/db/user-subcategories-want-to-learn.json'
} as const;

// Кэш состояния в памяти текущего запуска приложения.
let cachedState: MockDbState | null = null;
// Защита от параллельной повторной загрузки одних и тех же данных.
let loadingPromise: Promise<MockDbState> | null = null;

async function loadAllMockData(): Promise<MockDbState> {
  // Загружаем все JSON параллельно один раз на старт.
  const [
    skillsRes,
    categoriesRes,
    subcategoriesRes,
    usersRes,
    skillImagesRes,
    skillLikesRes,
    citiesRes,
    userSubcategoriesWantToLearnRes
  ] = await Promise.all([
    fetchJson<ApiListResponse<Skill>>(DB_PATHS.skills),
    fetchJson<ApiListResponse<Category>>(DB_PATHS.categories),
    fetchJson<ApiListResponse<Subcategory>>(DB_PATHS.subcategories),
    fetchJson<ApiListResponse<User>>(DB_PATHS.users),
    fetchJson<ApiListResponse<SkillImage>>(DB_PATHS.skillImages),
    fetchJson<ApiListResponse<SkillLike>>(DB_PATHS.skillLikes),
    fetchJson<ApiListResponse<City>>(DB_PATHS.cities),
    fetchJson<ApiListResponse<UserSubcategoryWantToLearn>>(DB_PATHS.userSubcategoriesWantToLearn)
  ]);

  return {
    skills: skillsRes.data,
    categories: categoriesRes.data,
    subcategories: subcategoriesRes.data,
    users: usersRes.data,
    skillImages: skillImagesRes.data,
    skillLikes: skillLikesRes.data,
    cities: citiesRes.data,
    userSubcategoriesWantToLearn: userSubcategoriesWantToLearnRes.data
  };
}

export async function initMockDbStore(): Promise<MockDbState> {
  // Если уже инициализировано — сразу возвращаем данные.
  if (cachedState) {
    return cachedState;
  }

  if (!loadingPromise) {
    // Если загрузка еще не начата — запускаем ее и сохраняем промис.
    loadingPromise = loadAllMockData()
      .then((state) => {
        cachedState = state;
        return state;
      })
      .finally(() => {
        // После завершения снимаем "флаг загрузки".
        loadingPromise = null;
      });
  }

  return loadingPromise;
}

export async function getMockDbState(): Promise<MockDbState> {
  // Ленивая инициализация на случай вызова API до bootstrap.
  if (cachedState) {
    return cachedState;
  }

  return initMockDbStore();
}

export function resetMockDbStore(): void {
  // Нужен в тестах/отладке, чтобы принудительно сбросить состояние.
  cachedState = null;
  loadingPromise = null;
}
