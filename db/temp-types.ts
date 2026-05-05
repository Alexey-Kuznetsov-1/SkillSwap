type Subcategory = {
  id: number;
  name: string;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
  icon: string;
  subcategories: Subcategory[];
};

type CategoriesResponse = {
  data: Category[];
};

type Skill = {
  id: number;
  name: string;
  subCategoryId: number;
  description: string;
  images: string[];
  userId: number;
};

type SkillsResponse = {
  data: Skill[];
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
  skillCanTeachId: number;
  subcategoriesWantToLearn: number[];
  userIdLikes: number[];
};

type UsersResponse = {
  data: User[];
};