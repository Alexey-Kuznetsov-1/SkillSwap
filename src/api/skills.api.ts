import { getMockDbState } from '@/api/mock-db-store';
import type {
  Category,
  Skill,
  SkillCard,
  SkillDetails,
  SkillDirection,
  SkillsCatalogParams,
  SkillsCatalogResult,
  Subcategory,
  User
} from '@/api/types';

// Нормализует поисковый запрос: trim + lowercase.
function normalizeQuery(query: string | undefined): string {
  // Приводим поисковую строку к единому виду для сравнения.
  return query?.trim().toLocaleLowerCase() ?? '';
}

// Считает полный возраст в годах по дате рождения.
function getFullYearsFromBirthDay(birthDay: string): number {
  const birthDate = new Date(birthDay);
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  const hasBirthdayPassed =
    monthDiff > 0 || (monthDiff === 0 && now.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    years -= 1;
  }

  return years;
}

// Применяет фильтры каталога к списку навыков (логика AND).
function applyFilters(
  skills: Skill[],
  subcategoriesById: Map<number, Subcategory>,
  params: SkillsCatalogParams
): Skill[] {
  const query = normalizeQuery(params.query);
  const direction: SkillDirection = params.direction ?? 'all';

  // Все фильтры применяются по логике AND.
  return skills.filter((skill) => {
    const subcategory = subcategoriesById.get(skill.subCategoryId);

    const matchesQuery =
      !query ||
      skill.name.toLocaleLowerCase().includes(query) ||
      skill.description.toLocaleLowerCase().includes(query);
    const matchesCategory = !params.categoryId || subcategory?.categoryId === params.categoryId;
    const matchesSubcategory = !params.subcategoryId || skill.subCategoryId === params.subcategoryId;
    const matchesDirection = direction === 'all' || skill.type === direction;

    return matchesQuery && matchesCategory && matchesSubcategory && matchesDirection;
  });
}

// Строит UI-карточку навыка из связанных mock-таблиц.
function buildCard(
  skill: Skill,
  categoriesById: Map<number, Category>,
  subcategoriesById: Map<number, Subcategory>,
  usersById: Map<number, User>,
  likesCountBySkillId: Map<number, number>
): SkillCard {
  // Собираем UI-модель карточки из связанных таблиц.
  const subcategory = subcategoriesById.get(skill.subCategoryId);
  if (!subcategory) {
    throw new Error(`Не найдена подкатегория с id=${skill.subCategoryId} для навыка id=${skill.id}`);
  }

  const category = categoriesById.get(subcategory.categoryId);
  if (!category) {
    throw new Error(`Не найдена категория с id=${subcategory.categoryId} для навыка id=${skill.id}`);
  }

  const author = usersById.get(skill.userId);

  if (!author) {
    throw new Error(`Не найден автор с id=${skill.userId} для навыка id=${skill.id}`);
  }

  return {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    direction: skill.type,
    category,
    subcategory,
    author: {
      id: author.id,
      name: author.name,
      avatarUrl: author.avatarUrl
    },
    likesCount: likesCountBySkillId.get(skill.id) ?? 0
  };
}

// Возвращает страницу каталога навыков с фильтрацией и пагинацией.
export async function getSkillsCatalog(params: SkillsCatalogParams = {}): Promise<SkillsCatalogResult> {
  // Дефолт для бесконечного скролла: 20 карточек за запрос.
  const page = Math.max(params.page ?? 1, 1);
  const limit = Math.max(params.limit ?? 20, 1);

  const { skills, categories, subcategories, users, skillLikes } = await getMockDbState();

  const categoriesById = new Map(categories.map((item) => [item.id, item]));
  const subcategoriesById = new Map(subcategories.map((item) => [item.id, item]));
  const usersById = new Map(users.map((item) => [item.id, item]));

  const likesCountBySkillId = skillLikes.reduce<Map<number, number>>((acc, item) => {
    const current = acc.get(item.skillId) ?? 0;
    acc.set(item.skillId, current + 1);
    return acc;
  }, new Map());

  const filteredSkills = applyFilters(skills, subcategoriesById, params);
  const total = filteredSkills.length;
  const start = (page - 1) * limit;
  const paginatedSkills = filteredSkills.slice(start, start + limit);

  return {
    items: paginatedSkills.map((skill) =>
      buildCard(skill, categoriesById, subcategoriesById, usersById, likesCountBySkillId)
    ),
    total,
    page,
    limit,
    hasMore: start + limit < total
  };
}

// Возвращает детальную карточку навыка по id или null, если не найден.
export async function getSkillById(skillId: number): Promise<SkillDetails | null> {
  const { skills, categories, subcategories, users, skillImages, skillLikes, cities } =
    await getMockDbState();

  const skill = skills.find((item) => item.id === skillId);
  if (!skill) {
    // Явно возвращаем null, если карточка не найдена.
    return null;
  }

  const categoriesById = new Map(categories.map((item) => [item.id, item]));
  const subcategoriesById = new Map(subcategories.map((item) => [item.id, item]));
  const usersById = new Map(users.map((item) => [item.id, item]));
  const citiesById = new Map(cities.map((item) => [item.id, item]));
  const imagesBySkillId = skillImages.reduce<Map<number, string[]>>((acc, item) => {
    const current = acc.get(item.skillId) ?? [];
    current.push(item.images);
    acc.set(item.skillId, current);
    return acc;
  }, new Map());

  const likesCountBySkillId = skillLikes.reduce<Map<number, number>>((acc, item) => {
    const current = acc.get(item.skillId) ?? 0;
    acc.set(item.skillId, current + 1);
    return acc;
  }, new Map());

  const card = buildCard(
    skill,
    categoriesById,
    subcategoriesById,
    usersById,
    likesCountBySkillId
  );
  const author = usersById.get(skill.userId);

  if (!author) {
    throw new Error(`Не найден автор с id=${skill.userId} для навыка id=${skill.id}`);
  }

  const city = citiesById.get(author.cityId);
  if (!city) {
    throw new Error(`Не найден город с id=${author.cityId} для автора id=${author.id}`);
  }

  return {
    ...card,
    // Для детальной страницы возвращаем все изображения навыка.
    images: imagesBySkillId.get(skill.id) ?? [],
    city,
    about: author.about,
    age: getFullYearsFromBirthDay(author.birthDay)
  };
}

// Подбирает похожие навыки с приоритетом по подкатегории и категории.
export async function getRelatedSkills(skillId: number, limit = 4): Promise<SkillCard[]> {
  const { skills, categories, subcategories, users, skillLikes } = await getMockDbState();
  const currentSkill = skills.find((item) => item.id === skillId);

  if (!currentSkill) {
    return [];
  }

  const categoriesById = new Map(categories.map((item) => [item.id, item]));
  const subcategoriesById = new Map(subcategories.map((item) => [item.id, item]));
  const usersById = new Map(users.map((item) => [item.id, item]));

  const likesCountBySkillId = skillLikes.reduce<Map<number, number>>((acc, item) => {
    const current = acc.get(item.skillId) ?? 0;
    acc.set(item.skillId, current + 1);
    return acc;
  }, new Map());

  const currentSubcategory = subcategoriesById.get(currentSkill.subCategoryId);
  const currentCategoryId = currentSubcategory?.categoryId;

  const related = skills
    .filter((item) => item.id !== skillId)
    .sort((a, b) => {
      // Приоритет 1: та же подкатегория.
      const aSubcategoryPriority = a.subCategoryId === currentSkill.subCategoryId ? 0 : 1;
      const bSubcategoryPriority = b.subCategoryId === currentSkill.subCategoryId ? 0 : 1;

      if (aSubcategoryPriority !== bSubcategoryPriority) {
        return aSubcategoryPriority - bSubcategoryPriority;
      }

      // Приоритет 2: та же категория.
      const aCategoryId = subcategoriesById.get(a.subCategoryId)?.categoryId;
      const bCategoryId = subcategoriesById.get(b.subCategoryId)?.categoryId;
      const aCategoryPriority = aCategoryId === currentCategoryId ? 0 : 1;
      const bCategoryPriority = bCategoryId === currentCategoryId ? 0 : 1;

      if (aCategoryPriority !== bCategoryPriority) {
        return aCategoryPriority - bCategoryPriority;
      }

      // Приоритет 3: стабильная сортировка по id.
      return a.id - b.id;
    })
    .slice(0, Math.max(limit, 1));

  return related.map((skill) =>
    buildCard(skill, categoriesById, subcategoriesById, usersById, likesCountBySkillId)
  );
}
