import type { Meta, StoryObj } from '@storybook/react';
import { ImageView } from './ImageView';
import styles from './ImageView.module.css';

const meta: Meta<typeof ImageView> = {
  title: 'widgets/ImageView',
  component: ImageView,
  tags: ['autodocs'],
  argTypes: {
    imagesSkill: {
      control: 'object',
      description: 'Массив SRC изображений',
    },
    className: {
      control: 'text',
      description: 'Дополнительные CSS классы',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageView>;

// Вспомогательные данные — тестовые изображения
const testImages = [
  '/images/skills/drums1.jpg',
  '/images/skills/drums2.jpg',
  '/images/skills/drums3.jpg',
  '/images/skills/drums4.jpg',
  '/images/skills/drums5.jpg',
];

// Стори 1: Галерея с 5 изображениями (полный функционал)
export const WithFiveImages: Story = {
  args: {
    imagesSkill: testImages,
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Галерея с 5 изображениями. Показывает все функции: навигацию, миниатюры и блок "+N"',
      },
    },
  },
};

// Стори 2: Галерея с 2 изображениями (без блока "+N")
export const WithTwoImages: Story = {
  args: {
    imagesSkill: testImages.slice(0, 2),
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Галерея с 2 изображениями. Блок "+N" не отображается, так как нет оставшихся изображений',
      },
    },
  },
};

// Стори 3: Галерея с 3 изображениями
export const WithThreeImages: Story = {
  args: {
    imagesSkill: testImages.slice(0, 3),
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Галерея с 3 изображениями. Показывается блок "+N" с одним оставшимся изображением',
      },
    },
  },
};

// Стори 4: Галерея с 1 изображением
export const WithOneImage: Story = {
  args: {
    imagesSkill: [testImages[0]],
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Галерея с одним изображением. Нет навигации и блока "+N"',
      },
    },
  },
};

// Стори 5: Пустая галерея
export const EmptyGallery: Story = {
  args: {
    imagesSkill: [],
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Пустая галерея. Показывается заглушка "Нет изображений"',
      },
    },
  },
};

// Стори 6: С дополнительными CSS классами
export const WithCustomClass: Story = {
  args: {
    imagesSkill: testImages.slice(0, 4),
    className: styles.customGallery,
  },
  parameters: {
    docs: {
      description: {
        story: 'Галерея с кастомным CSS классом',
      },
    },
  },
};