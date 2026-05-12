import type { Meta, StoryObj } from '@storybook/react';
import { WelcomeBack } from './WelcomeBack';

const meta: Meta<typeof WelcomeBack> = {
  title: 'widgets/WelcomeBack',
  component: WelcomeBack,
};

export default meta;
type Story = StoryObj<typeof WelcomeBack>;

export const Default: Story = {
  args: {
    image: '/icons/sun.svg',
    title: 'С возвращением в SkillSwap!',
    text: 'Рады видеть вас снова.',
  },
};

export const AboutYou: Story = {
  args: {
    image: '/icons/user.svg',
    title: 'Расскажите немного о себе',
    text: 'Это поможет найти вам подходящую пару.',
  },
};