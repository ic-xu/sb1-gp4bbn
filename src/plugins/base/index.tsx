import React from 'react';
import type { Plugin } from '../../types/plugin';
import type { ReactElement } from 'react';

const HeadingComponent = ({ level, className, children }: { 
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className: string;
  children: React.ReactNode;
}) => {
  switch (level) {
    case 1: return <h1 className={className}>{children}</h1>;
    case 2: return <h2 className={className}>{children}</h2>;
    case 3: return <h3 className={className}>{children}</h3>;
    case 4: return <h4 className={className}>{children}</h4>;
    case 5: return <h5 className={className}>{children}</h5>;
    case 6: return <h6 className={className}>{children}</h6>;
    default: return <h1 className={className}>{children}</h1>;
  }
};

export const basePlugin: Plugin = {
  id: 'base',
  name: 'Base Plugin',
  version: '1.0.0',
  description: 'Provides basic markdown rendering capabilities',
  
  async onActivate(context) {
    // Register basic markdown renderers
    context.registerRenderer({
      id: 'heading',
      name: 'Heading Renderer',
      test: (node) => node.type === 'heading',
      render: (node, children): ReactElement => {
        const level = node.depth as 1 | 2 | 3 | 4 | 5 | 6;
        const className = level === 1 ? 'text-center' : 'text-right';
        return <HeadingComponent level={level} className={className}>{children}</HeadingComponent>;
      },
    });

    // Register basic theme
    context.registerTheme({
      id: 'default',
      name: 'Default Theme',
      styles: {
        'heading-1': 'text-3xl font-bold mb-4',
        'heading-2': 'text-2xl font-bold mb-3',
        'paragraph': 'mb-4 text-gray-700 leading-relaxed',
      },
    });

    // Register basic toolbar items
    context.registerToolbarItem({
      id: 'bold',
      position: 'left',
      render: () => (
        <button 
          onClick={() => context.eventBus.emit('editor:format', 'bold')}
          className="p-2 hover:bg-gray-100 rounded"
        >
          B
        </button>
      ),
    });
  },
};