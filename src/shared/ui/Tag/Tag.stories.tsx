import type { Meta } from '@storybook/react';
import type { StoryFn } from '@storybook/react';
import Tag from './Tag';
import type { TagProps } from './Tag';

// Mock-данные, имитирующие результат getSkillById(1)
const mockSkill = {
  id: 1,
  name: 'Игра на барабанах',
  description:
    'Изучение ритма и техники игры на барабанах, основы перкуссии для начинающих и более опытных музыкантов.',
  direction: 'teach',
  category: {
    id: 2,
    name: 'Творчество и искусство',
    icon: '/icons/categories/palette.svg',
    color: '#f7e7f2',
  },
  subcategory: {
    id: 24,
    name: 'Музыка и звук',
    categoryId: 2,
    category: {
      id: 2,
      name: 'Творчество и искусство',
      icon: '/icons/categories/palette.svg',
      color: '#f7e7f2',
    },
  },
  author: {
    id: 1,
    name: 'Алексей Иванов',
    avatarUrl: '/images/users/user01.jpg',
  },
  likesCount: 32,
  images: [
    '/images/skills/drums1.jpg',
    '/images/skills/drums2.jpg',
    '/images/skills/drums3.jpg',
    '/images/skills/drums4.jpg',
    '/images/skills/drums5.jpg',
  ],
  city: {
    id: 1,
    name: 'Москва',
  },
  about:
    'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
  age: 34,
};

export default {
  title: 'UI/Tag',
  component: Tag,
} as Meta;

const Template: StoryFn<TagProps> = (args) => <Tag {...args} />;

// Дефолтный тег
export const DefaultTag = Template.bind({});
DefaultTag.args = {
  children: '+1',
};

// Тег с субкатегорией из mock-данных
export const WithSubCategory = Template.bind({});
WithSubCategory.args = {
  children: mockSkill.name,
  subCategory: mockSkill.subcategory, // Передаём subCategory
};