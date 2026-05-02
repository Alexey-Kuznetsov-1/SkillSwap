import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

const allIcons: IconName[] = [
  'add', 'arrow-left', 'arrow-square-left', 'arrow-square-right',
  'book', 'briefcase', 'calendar', 'checkbox-done', 'checkbox-empty',
  'checkbox-remove', 'chevron-down', 'chevron-right', 'chevron-up',
  'clock', 'count', 'cross', 'done', 'edit', 'error-404', 'error-500',
  'eye-slash', 'eye', 'filter-square', 'gallery-add', 'gallery-edit',
  'global', 'home', 'idea', 'lifestyle', 'light-bulb', 'like', 'like-active',
  'logo', 'logout', 'message-text', 'moon', 'more-square', 'navigation',
  'notification', 'palette', 'plus-circle', 'radiobutton-active',
  'radiobutton-empty', 'request', 'school-board', 'scroll-1', 'scroll',
  'search', 'share', 'sort', 'sun', 'toggle', 'toggle-active', 'user-info',
  'user-circle', 'user'
];

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: allIcons,
    },
    size: {
      control: 'number',
      defaultValue: 24,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Gallery: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(8, 1fr)', 
      gap: '1rem', 
      padding: '2rem' 
    }}>
      {allIcons.map((iconName) => (
        <div key={iconName} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '0.5rem' 
        }}>
          <Icon name={iconName} size={32} />
          <span style={{ fontSize: '10px', textAlign: 'center' }}>{iconName}</span>
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    name: 'add',
    size: 48,
  },
};