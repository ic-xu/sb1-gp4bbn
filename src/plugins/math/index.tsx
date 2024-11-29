import React from 'react';
import type { Plugin } from '../../types/plugin';
import { Sigma } from 'lucide-react';

interface MathPluginSettings {
  defaultDelimiter: 'dollars' | 'brackets';
  autoNumbering: boolean;
}

const MathSettings: React.FC<{
  settings: MathPluginSettings;
  onUpdate: (settings: MathPluginSettings) => void;
}> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Default Delimiter</label>
        <select
          value={settings.defaultDelimiter}
          onChange={(e) => onUpdate({ ...settings, defaultDelimiter: e.target.value as 'dollars' | 'brackets' })}
          className="w-full p-2 border dark:border-gray-700 rounded bg-white dark:bg-gray-800"
        >
          <option value="dollars">Dollars ($$...$$)</option>
          <option value="brackets">Brackets (\[...\])</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoNumbering"
          checked={settings.autoNumbering}
          onChange={(e) => onUpdate({ ...settings, autoNumbering: e.target.checked })}
          className="rounded border-gray-300 dark:border-gray-700"
        />
        <label htmlFor="autoNumbering" className="text-sm">
          Enable equation auto-numbering
        </label>
      </div>
    </div>
  );
};

export const mathPlugin: Plugin = {
  id: 'math',
  name: 'Math Formulas',
  version: '1.0.0',
  description: 'Adds support for LaTeX math formulas using KaTeX',
  defaultSettings: {
    defaultDelimiter: 'dollars',
    autoNumbering: false,
  },
  settingsComponent: MathSettings,
  
  async onActivate(context) {
    const settings = context.getSettings();
    
    // Register toolbar item for inserting math formulas
    context.registerToolbarItem({
      id: 'insert-math',
      position: 'left',
      render: () => (
        <button
          onClick={() => {
            const delimiter = settings.defaultDelimiter === 'dollars' ? '$$' : '\\[';
            const closeDelimiter = settings.defaultDelimiter === 'dollars' ? '$$' : '\\]';
            context.eventBus.emit('editor:insert', `${delimiter}\n\\frac{1}{2}\n${closeDelimiter}`);
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Insert Math Formula"
        >
          <Sigma className="w-5 h-5" />
        </button>
      ),
    });

    // Register math renderer
    context.registerRenderer({
      id: 'math',
      name: 'Math Renderer',
      test: (node) => node.type === 'math',
      render: (node, children) => (
        <div className={`my-4 text-center overflow-x-auto ${settings.autoNumbering ? 'relative pl-8' : ''}`}>
          {settings.autoNumbering && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              ({node.index || 1})
            </span>
          )}
          {children}
        </div>
      ),
    });
  },

  async onSettingsChange(context, newSettings) {
    // Re-register components with new settings
    await this.onActivate?.(context);
  },
};