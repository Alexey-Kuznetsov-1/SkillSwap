import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'shared/SearchInput',
  component: SearchInput,
  args: {
    placeholder: 'Поиск навыков...',
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

// Компонент-обертка для демонстрации работы debounce
const SearchInputWithState = (args: any) => {
  const [value, setValue] = useState('');
  
  return (
    <div style={{ padding: '40px', maxWidth: '500px' }}>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Значение (обновляется с задержкой 300мс): <strong>{value || '(пусто)'}</strong>
      </p>
      <SearchInput {...args} value={value} onChange={setValue} />
    </div>
  );
};

// Пустой инпут
export const Empty: Story = {
  render: (args) => <SearchInputWithState {...args} />,
};

export const WithPlaceholder: Story = {
  render: (args) => <SearchInputWithState {...args} />,
  args: {
    placeholder: 'Введите текст для поиска...',
  },
};

export const WithLongText: Story = {
  render: (args) => <SearchInputWithState {...args} />,
  args: {
    placeholder: 'Поиск...',
  },
};