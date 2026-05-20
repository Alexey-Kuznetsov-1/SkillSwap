// src/api/skills.api.ts
import { getMockDbState } from '@/api/mock-db-store';
import type {
  Skill,
  SkillCard,
  SkillDetails,
  SkillDirection,
  SkillsCatalogParams,
  SkillsCatalogResult,
  RegistrationFormData,
  SkillImage,
  User,
} from '@/api/types';

function normalizeQuery(query: string | undefined): string {
  return query?.trim().toLocaleLowerCase() ?? '';
}

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

function applyFilters(skills: Skill[], params: SkillsCatalogParams): Skill[] {
  const query = normalizeQuery(params.query);
  const direction: SkillDirection = params.direction ?? 'all';

  return skills.filter((skill) => {
    const matchesQuery =
      !query ||
      skill.title.toLocaleLowerCase().includes(query) ||
      skill.description.toLocaleLowerCase().includes(query);
    const matchesCategory = !params.categoryId || true;
    const matchesSubcategory = !params.subcategoryId || true;
    const matchesDirection = direction === 'all' || skill.type === direction;

    return matchesQuery && matchesCategory && matchesSubcategory && matchesDirection;
  });
}

function buildCard(skill: Skill, likesCountBySkillId: Map<number, number>): SkillCard {
  return {
    id: skill.id,
    name: skill.title,
    description: skill.description,
    direction: skill.type,
    category: skill.category,
    subcategory: skill.subCategory,
    author: {
      name: skill.author,
      avatarUrl: skill.authorAvatar,
      city: skill.authorCity,
      age: skill.authorAge,
    },
    likesCount: likesCountBySkillId.get(skill.id) ?? 0,
  };
}

export async function getSkillsCatalog(
  params: SkillsCatalogParams = {},
): Promise<SkillsCatalogResult> {
  const page = Math.max(params.page ?? 1, 1);
  const limit = Math.max(params.limit ?? 20, 1);

  const { skills, skillLikes } = await getMockDbState();

  console.log('📊 getSkillsCatalog: загружено навыков', skills.length);

  const likesCountBySkillId = skillLikes.reduce<Map<number, number>>(
    (acc, item) => {
      const current = acc.get(item.skillId) ?? 0;
      acc.set(item.skillId, current + 1);
      return acc;
    },
    new Map(),
  );

  const filteredSkills = applyFilters(skills, params);
  const total = filteredSkills.length;
  const start = (page - 1) * limit;
  const paginatedSkills = filteredSkills.slice(start, start + limit);

  console.log('📊 getSkillsCatalog: отфильтровано', filteredSkills.length);

  return {
    items: paginatedSkills.map((skill) => buildCard(skill, likesCountBySkillId)),
    total,
    page,
    limit,
    hasMore: start + limit < total,
  };
}

export async function getSkillById(skillId: number): Promise<SkillDetails | null> {
  const { skills, skillLikes, users, cities } = await getMockDbState();

  const skill = skills.find((item) => item.id === skillId);
  if (!skill) {
    console.log('❌ Навык не найден:', skillId);
    return null;
  }

  console.log('✅ Навык найден:', skill.title);

  const likesCountBySkillId = skillLikes.reduce<Map<number, number>>(
    (acc, item) => {
      const current = acc.get(item.skillId) ?? 0;
      acc.set(item.skillId, current + 1);
      return acc;
    },
    new Map(),
  );

  const card = buildCard(skill, likesCountBySkillId);
  const author = users.find((u) => u.name === skill.author);

  return {
    ...card,
    images: [],
    about: author?.about || '',
    age: author ? getFullYearsFromBirthDay(author.birthDay) : skill.authorAge,
    city: skill.authorCity,
    authorGender: skill.authorGender,
  };
}

export async function getRelatedSkills(skillId: number, limit = 4): Promise<SkillCard[]> {
  const { skills, skillLikes } = await getMockDbState();
  const currentSkill = skills.find((item) => item.id === skillId);

  if (!currentSkill) {
    return [];
  }

  const likesCountBySkillId = skillLikes.reduce<Map<number, number>>(
    (acc, item) => {
      const current = acc.get(item.skillId) ?? 0;
      acc.set(item.skillId, current + 1);
      return acc;
    },
    new Map(),
  );

  const related = skills
    .filter((item) => item.id !== skillId && item.category === currentSkill.category)
    .slice(0, limit);

  return related.map((skill) => buildCard(skill, likesCountBySkillId));
}

export async function registerUser(
  userData: RegistrationFormData,
): Promise<{ userId: number; skillId: number }> {
  const dbState = await getMockDbState();

  const existingUser = dbState.users.find((user) => user.email === userData.email);
  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует');
  }

  const city = dbState.cities.find((c) => c.name.toLowerCase() === userData.city.toLowerCase());
  if (!city) {
    throw new Error('Город не найден');
  }

  const newUser: User = {
    id: Math.max(...dbState.users.map((u) => u.id), 0) + 1,
    email: userData.email,
    avatarUrl: '',
    name: userData.name,
    about: userData.skillDescription,
    birthDay: userData.birthDate,
    gender: userData.gender,
    registrationDate: new Date().toISOString().split('T')[0],
    cityId: city.id,
  };

  dbState.users.push(newUser);

  const newSkill: Skill = {
    id: Math.max(...dbState.skills.map((s) => s.id), 0) + 1,
    title: userData.skillName,
    description: userData.skillDescription,
    type: 'teach',
    category: String(userData.categoryToTeach),
    subCategory: String(userData.subcategoryToTeach),
    author: userData.name,
    authorCity: userData.city,
    authorGender: userData.gender,
    authorAge: getFullYearsFromBirthDay(userData.birthDate),
    authorAvatar: '',
    likes: 0,
  };

  dbState.skills.push(newSkill);

  if (userData.photos && userData.photos.length > 0) {
    for (let i = 0; i < userData.photos.length; i++) {
      const newImage: SkillImage = {
        id: Math.max(...dbState.skillImages.map((img) => img.id), 0) + 1,
        skillId: newSkill.id,
        images: `/images/skills/skill-${newSkill.id}-photo-${i + 1}.jpg`,
      };
      dbState.skillImages.push(newImage);
    }
  }

  return {
    userId: newUser.id,
    skillId: newSkill.id,
  };
}