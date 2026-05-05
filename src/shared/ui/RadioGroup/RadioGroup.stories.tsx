import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

type MetaType = Meta<typeof RadioGroup>;
type StoryType = StoryObj<typeof RadioGroup>;

// Базовые опции для примеров
const options = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
];

const Meta: MetaType = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: {
        type: 'inline-radio',
        options: options.map((opt) => opt.value),
      },
    },
    onChange: {
      action: 'onChange',
      control: false,
    },
  },
};

export default Meta;

// Базовая история
export const Default: StoryType = {
  args: {
    name: 'catalogFilter',
    options,
    value: 'all',
  },
};

export const Controlled: StoryType = {
  render: (args) => {
    const ControlledGroup = () => {
      const [selectedValue, setSelectedValue] = useState(args.value);

      const handleChange = (newValue: string) => {
        setSelectedValue(newValue);
        args.onChange?.(newValue);
      };

      return (
        <div>
          <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
            Текущее значение:{' '}
            <span style={{ color: 'blue' }}>{selectedValue}</span>
          </div>
          <RadioGroup {...args} value={selectedValue} onChange={handleChange} />
        </div>
      );
    };
    return <ControlledGroup />;
  },
  args: {
    name: 'controlledGroup',
    options,
    value: 'learn',
  },
};
