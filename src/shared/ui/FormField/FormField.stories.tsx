import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { Input } from '../Input/Input';

const meta: Meta<typeof FormField> = {
  title: 'UI/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Email',
    required: false,
    children: <input type="email" placeholder="Введите email" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ccc' }} />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Пароль',
    error: 'Пароль должен быть не менее 6 символов',
    required: true,
    children: <input type="password" placeholder="Введите пароль" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ccc' }} />,
  },
};

export const Required: Story = {
  args: {
    label: 'Имя',
    required: true,
    children: <input type="text" placeholder="Введите имя" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ccc' }} />,
  },
};