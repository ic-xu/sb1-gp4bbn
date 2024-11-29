import React from 'react';
import { usePluginManager } from '../hooks/usePluginManager';
import Settings from './Settings';

export default function Toolbar() {
  const pluginManager = usePluginManager();
  const toolbarItems = pluginManager.getToolbarItems();
  
  const leftItems = toolbarItems.filter(item => item.position === 'left');
  const rightItems = toolbarItems.filter(item => item.position === 'right');

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {leftItems.map(item => (
          <div key={item.id}>{item.render()}</div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {rightItems.map(item => (
          <div key={item.id}>{item.render()}</div>
        ))}
        <Settings />
      </div>
    </div>
  );
}