import type { Meta, StoryFn } from '@storybook/react';
import type { AvatarProps } from './Avatar'; // только для типов
import { Avatar } from './Avatar';  

// Декоратор для стилизации истории
const decorator: Meta<typeof Avatar>['decorators'] = (Story) => (
  <div style={{ padding: '20px', background: '#f5f5f5' }}>
    <Story />
  </div>
);

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  decorators: [decorator],
  argTypes: {
    src: { control: 'text', description: 'URL изображения аватарки' },
    name: { control: 'text', description: 'Имя пользователя' },
    className: { control: 'text', description: 'Дополнительный CSS‑класс' },
  },
};

export default meta;

// Теперь args имеет тип AvatarProps — именно пропсы компонента, а не сам компонент
const Template: StoryFn<AvatarProps> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  src: 'https://i.pinimg.com/236x/ce/f2/ad/cef2ad42d058f72fa1de0ced9c7d3ead.jpg?nii=t',
  name: 'John Doe',
};

export const NoImage = Template.bind({});
NoImage.args = {
  name: 'Jane Smith',
};