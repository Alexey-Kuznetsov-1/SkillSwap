// src/api/mock-db-store.ts
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

let cachedState: MockDbState | null = null;
let loadingPromise: Promise<MockDbState> | null = null;

async function loadAllMockData(): Promise<MockDbState> {
  console.log('🔄 Начинаем загрузку mock-данных...');

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

  const skillsData = Array.isArray(skillsRes.skills) 
    ? skillsRes.skills 
    : (Array.isArray(skillsRes.data) ? skillsRes.data : []);
  
  const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
  const subcategoriesData = Array.isArray(subcategoriesRes.data) ? subcategoriesRes.data : [];
  const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
  const skillImagesData = Array.isArray(skillImagesRes.data) ? skillImagesRes.data : [];
  const skillLikesData = Array.isArray(skillLikesRes.data) ? skillLikesRes.data : [];
  const citiesData = Array.isArray(citiesRes.data) ? citiesRes.data : [];
  const userSubcategoriesWantToLearnData = Array.isArray(userSubcategoriesWantToLearnRes.data) 
    ? userSubcategoriesWantToLearnRes.data 
    : [];

  console.log('✅ Загружено:', {
    skills: skillsData.length,
    categories: categoriesData.length,
    subcategories: subcategoriesData.length,
    users: usersData.length,
    skillImages: skillImagesData.length,
    skillLikes: skillLikesData.length,
    cities: citiesData.length,
    userSubcategoriesWantToLearn: userSubcategoriesWantToLearnData.length
  });

  return {
    skills: skillsData,
    categories: categoriesData,
    subcategories: subcategoriesData,
    users: usersData,
    skillImages: skillImagesData,
    skillLikes: skillLikesData,
    cities: citiesData,
    userSubcategoriesWantToLearn: userSubcategoriesWantToLearnData
  };
}

export async function initMockDbStore(): Promise<MockDbState> {
  if (cachedState) {
    console.log('📦 Возвращаем кэшированные данные');
    return cachedState;
  }

  if (!loadingPromise) {
    loadingPromise = loadAllMockData()
      .then((state) => {
        cachedState = state;
        return state;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return loadingPromise;
}

export async function getMockDbState(): Promise<MockDbState> {
  if (cachedState) {
    return cachedState;
  }
  return initMockDbStore();
}

export function resetMockDbStore(): void {
  cachedState = null;
  loadingPromise = null;
}