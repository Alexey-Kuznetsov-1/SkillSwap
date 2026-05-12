import type { Meta, StoryObj } from '@storybook/react';
import ServerError from '../widgets/ServerError';

const meta: Meta<typeof ServerError> = {
  title: 'Widgets/ServerError',
  component: ServerError,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ServerError>;

export const Default: Story = {};