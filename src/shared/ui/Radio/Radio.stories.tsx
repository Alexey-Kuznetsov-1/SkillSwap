import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

type MetaType = Meta<typeof Radio>;
type StoryType = StoryObj<typeof Radio>;

const Meta: MetaType = {
  title: 'UI/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    onChange: {
      action: 'onChange',
      control: false,
    },
  },
};

export default Meta;

export const Default: StoryType = {
  args: {
    name: 'radioGroup',
    value: 'option1',
    checked: false,
    children: 'Вариант 1',
  },
};

export const Checked: StoryType = {
  args: {
    name: 'radioGroup',
    value: 'option2',
    checked: true,
    children: 'Вариант 2',
  },
};

export const Controlled: StoryType = {
  render: (args) => {
    const ControlledRadio = () => {
      const [isChecked, setIsChecked] = useState(args.checked);

      return (
        <Radio
          {...args}
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
      );
    };

    return <ControlledRadio />;
  },
  args: {
    name: 'controlledRadio',
    value: 'controlled',
    checked: false,
    children: 'Управляемая кнопка',
  },
};
