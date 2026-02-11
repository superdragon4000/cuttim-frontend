import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {Button} from './ui';

const meta = {
  title: 'Shared/Button',
  component: Button,
  args: {
    children: 'Build Quote',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};
