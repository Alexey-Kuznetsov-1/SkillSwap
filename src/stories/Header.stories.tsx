import type { Meta, StoryObj } from '@storybook/react';
import Header from '../widgets/Header';

const meta: Meta<typeof Header> = {
  title: 'Widgets/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const NotLoggedIn: Story = {
  args: {
    isLoggedIn: false,
  },
};

export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
    userName: 'Мария',
    avatarSrc: '',
  },
};