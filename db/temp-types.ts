// Разбила на подтипы, чтоб лишние портянки не тащить

type CategoryBase = {
  id: string;
  name: string;
}

type Category =  CategoryBase & {
  icon: string;
  subCategories: SubCategory[];
};

type SubCategory = {
  id: string;
  name: string;
  categoryId: string;
};

type SkillBase = {
  id: number;
  name: string;
  subCategory: SubCategory;
};

type Skill = SkillBase & {
  description: string;
  images: string[];
  category: CategoryBase;
  userId: number;
};


type City = {
  id: number;
  name: string;
};


type User = {
  id: number;
  email: string;
  avatarUrl: string;
  name: string;
  about: string;
  location: City;
  birthDay: string;
  gender: 'Мужской' | 'Женский';
  registrationDate: string;
  skillCanTeach: SkillBase[];
  subcategoriesWantToLearn: SubCategory[];
  userIdLikes: number[];
};