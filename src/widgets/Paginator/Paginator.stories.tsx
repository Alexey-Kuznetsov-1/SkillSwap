import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Paginator } from './Paginator';

const meta: Meta<typeof Paginator> = {
  title: 'widgets/Paginator',
  component: Paginator,
};

export default meta;
type Story = StoryObj<typeof Paginator>;

const PaginatorDemo = (args: any) => {
  const [page, setPage] = useState(1);
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p style={{ marginBottom: '20px', color: 'var(--text)' }}>
        Текущая страница: <strong>{page}</strong> из {args.totalPages}
      </p>
      <Paginator {...args} currentPage={page} onChange={setPage} />
    </div>
  );
};

export const FewPages: Story = {
  render: (args) => <PaginatorDemo {...args} />,
  args: { totalPages: 5 },
};

export const ManyPages: Story = {
  render: (args) => <PaginatorDemo {...args} />,
  args: { totalPages: 25 },
};