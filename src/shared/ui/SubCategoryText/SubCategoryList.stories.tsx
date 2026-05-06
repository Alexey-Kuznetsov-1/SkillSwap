// src/shared/ui/SubCategoryText/SubCategoryList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SubCategoryList } from './SubCategoryList';

const meta: Meta<typeof SubCategoryList> = {
  title: 'shared/SubCategoryList',
  component: SubCategoryList,
};

export default meta;
type Story = StoryObj<typeof SubCategoryList>;

export const SingleItem: Story = {
  args: {
    SubCategoryArray: ['Figma'],
  },
};

export const TwoItems: Story = {
  args: {
    SubCategoryArray: ['Figma', 'UI'],
  },
};

export const ManyItems: Story = {
  args: {
    SubCategoryArray: ['Figma', 'UI', 'UX', 'Code', 'React'],
  },
};