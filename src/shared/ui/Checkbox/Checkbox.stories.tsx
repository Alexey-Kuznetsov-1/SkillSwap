import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

type Story = StoryObj<typeof Checkbox>;

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Состояние чекбокса (отмечен/не отмечен)',
    },
    disabled: {
      control: 'boolean',
      description: 'Заблокированное состояние',
    },
    type: {
      control: 'select',
      options: ['category', 'subcategory', undefined],
      description: 'Тип чекбокса',
    },
    onChange: {
      action: 'onChange',
      description: 'Обработчик изменения состояния',
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    children: 'Обычный чекбокс',
    checked: false,
    onChange: () => {},
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Базовый вариант чекбокса без дополнительных настроек',
      },
    },
  },
};
export const CategoryType: Story = {
  args: {
    children: 'Чекбокс категории',
    checked: true,
    onChange: () => {},
    type: 'category',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Чекбокс типа "category" — при отмеченном состоянии показывает иконку "checkbox-remove"',
      },
    },
  },
};

export const SubcategoryType: Story = {
  args: {
    children: 'Чекбокс подкатегории',
    checked: true,
    onChange: () => {},
    type: 'subcategory',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Чекбокс типа "subcategory" — при отмеченном состоянии показывает иконку "checkbox-done"',
      },
    },
  },
};
