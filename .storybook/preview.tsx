import type {Preview} from '@storybook/nextjs-vite';
import '@/app/globals.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {expanded: true},
  },
  decorators: [
    (Story) => (
      <div data-theme="graphite" style={{minWidth: 320, padding: 16}}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
