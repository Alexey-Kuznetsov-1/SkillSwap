import type { Meta, StoryObj } from '@storybook/react';
import NotFound from '../widgets/NotFound';

const meta: Meta<typeof NotFound> = {
  title: 'Widgets/NotFound',
  component: NotFound,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Default: Story = {};