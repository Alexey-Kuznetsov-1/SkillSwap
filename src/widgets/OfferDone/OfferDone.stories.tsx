import type { Meta, StoryObj } from '@storybook/react';
import { OfferDone } from './OfferDone';

const meta: Meta<typeof OfferDone> = {
  title: 'widgets/OfferDone',
  component: OfferDone,
};

export default meta;
type Story = StoryObj<typeof OfferDone>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    title: 'Предложение отправлено',
    text: 'Мы уведомим вас, когда кто-то откликнется',
  },
};