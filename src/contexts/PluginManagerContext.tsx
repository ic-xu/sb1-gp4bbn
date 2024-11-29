import React, { createContext, useEffect, useState, useRef } from 'react';
import { PluginManager } from '../core/PluginManager';
import { basePlugin } from '../plugins/base';
import { darkThemePlugin } from '../plugins/dark-theme';
import { mathPlugin } from '../plugins/math';

export const PluginManagerContext = createContext<PluginManager | null>(null);

export function PluginManagerProvider({ children }: { children: React.ReactNode }) {
  const [pluginManager] = useState(() => new PluginManager());
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializePlugins = async () => {
      try {
        await pluginManager.installPlugin(basePlugin);
        await pluginManager.installPlugin(darkThemePlugin);
        await pluginManager.installPlugin(mathPlugin);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize plugins'));
        console.error('Plugin initialization failed:', err);
      }
    };

    if (!isInitialized) {
      initializePlugins();
    }
  }, [pluginManager, isInitialized]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Plugin System Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Initializing plugins...
          </p>
        </div>
      </div>
    );
  }

  return (
    <PluginManagerContext.Provider value={pluginManager}>
      {children}
    </PluginManagerContext.Provider>
  );
}