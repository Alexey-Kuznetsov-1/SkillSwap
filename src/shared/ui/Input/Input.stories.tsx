import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';
import { Icon } from '../Icon/Icon';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel', 'url', 'number', 'search'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Обёртка для controlled компонента
const InputWithState = (args: any) => {
  const [value, setValue] = useState(args.value || '');
  return <Input {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <InputWithState {...args} />,
  args: {
    placeholder: 'Введите текст...',
    type: 'text',
    size: 'md',
  },
};

export const WithError: Story = {
  render: (args) => <InputWithState {...args} />,
  args: {
    placeholder: 'Введите email',
    type: 'email',
    error: true,
  },
};

export const Disabled: Story = {
  render: (args) => <InputWithState {...args} />,
  args: {
    placeholder: 'Недоступно для ввода',
    disabled: true,
    value: 'Заблокированное поле',
  },
};

export const WithLeftIcon: Story = {
  render: (args) => <InputWithState {...args} />,
  args: {
    placeholder: 'Поиск...',
    leftIcon: <Icon name="search" size={20} />,
  },
};

export const WithRightIcon: Story = {
  render: (args) => <InputWithState {...args} />,
  args: {
    placeholder: 'Пароль',
    type: 'password',
    rightIcon: <Icon name="eye" size={20} />,
  },
};

export const Small: Story = {
  render: (args) => <InputWithState {...args} />,
  args: {
    placeholder: 'Маленькое поле',
    size: 'sm',
  },
};

export const Large: Story = {
  render: (args) => <InputWithState {...args} />,
  args: {
    placeholder: 'Большое поле',
    size: 'lg',
  },
};