import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, X, ChevronDown, ChevronRight } from 'lucide-react';
import { usePluginManager } from '../hooks/usePluginManager';

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedPlugins, setExpandedPlugins] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pluginManager = usePluginManager();
  const plugins = Array.from(pluginManager.getPlugins());
  const eventBus = pluginManager.getEventBus();

  useEffect(() => {
    const handlePluginError = ({ pluginId, error }: { pluginId: string; error: Error }) => {
      setErrors(prev => ({
        ...prev,
        [pluginId]: error.message
      }));
    };

    const handlePluginUpdate = (pluginId: string) => {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[pluginId];
        return newErrors;
      });
    };

    eventBus.on('plugin:error', handlePluginError);
    eventBus.on('plugin:updated', handlePluginUpdate);
    eventBus.on('plugin:settingsUpdated', handlePluginUpdate);

    return () => {
      eventBus.off('plugin:error', handlePluginError);
      eventBus.off('plugin:updated', handlePluginUpdate);
      eventBus.off('plugin:settingsUpdated', handlePluginUpdate);
    };
  }, [eventBus]);

  const togglePluginExpanded = (pluginId: string) => {
    setExpandedPlugins(prev => {
      const next = new Set(prev);
      if (next.has(pluginId)) {
        next.delete(pluginId);
      } else {
        next.add(pluginId);
      }
      return next;
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        title="Settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[480px] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-medium mb-4">Plugins</h3>
              <div className="space-y-4">
                {plugins.map(([id, plugin]) => {
                  const isExpanded = expandedPlugins.has(id);
                  const hasSettings = !!plugin.settingsComponent;
                  const SettingsComponent = plugin.settingsComponent;

                  return (
                    <div key={id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {hasSettings && (
                              <button
                                onClick={() => togglePluginExpanded(id)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                            )}
                            <div>
                              <div className="font-medium">{plugin.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {plugin.description}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => pluginManager.togglePlugin(id)}
                            className={`px-3 py-1 rounded transition-colors ${
                              pluginManager.isPluginActive(id)
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            {pluginManager.isPluginActive(id) ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                        {errors[id] && (
                          <div className="mt-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            {errors[id]}
                          </div>
                        )}
                      </div>
                      {isExpanded && SettingsComponent && (
                        <div className="p-4 border-t dark:border-gray-700">
                          <SettingsComponent
                            settings={pluginManager.getEventBus()}
                            onUpdate={(settings) => pluginManager.updatePluginSettings(id, settings)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}