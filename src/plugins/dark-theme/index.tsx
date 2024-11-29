import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { Plugin } from '../../types/plugin';
import { useEditorStore } from '../../store/editorStore';

export const darkThemePlugin: Plugin = {
  id: 'dark-theme',
  name: 'Dark Theme',
  version: '1.0.0',
  description: 'Provides dark theme support',
  
  async onActivate(context) {
    // Register dark theme
    context.registerTheme({
      id: 'dark',
      name: 'Dark Theme',
      styles: {
        'root': 'bg-gray-900 text-gray-100',
        'editor': 'bg-gray-800 text-gray-100',
        'preview': 'bg-gray-900',
        'preview-content': 'bg-gray-800 text-gray-100',
        'heading-1': 'text-3xl font-bold mb-4 text-gray-100',
        'heading-2': 'text-2xl font-bold mb-3 text-gray-100',
        'paragraph': 'mb-4 text-gray-300 leading-relaxed',
      },
    });

    // Register theme toggle toolbar item
    context.registerToolbarItem({
      id: 'theme-toggle',
      position: 'right',
      render: () => {
        const { theme, setTheme } = useEditorStore();
        return (
          <button
            onClick={() => setTheme(theme === 'default' ? 'dark' : 'default')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title={theme === 'default' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          >
            {theme === 'default' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        );
      },
    });
  },
};