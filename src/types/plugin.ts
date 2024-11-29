import { EventEmitter } from 'eventemitter3';
import { ReactElement, ReactNode } from 'react';

export interface PluginContext {
  eventBus: EventEmitter;
  registerCommand: (command: Command) => void;
  registerRenderer: (renderer: MarkdownRenderer) => void;
  registerTheme: (theme: Theme) => void;
  registerToolbarItem: (item: ToolbarItem) => void;
  updateSettings: (settings: any) => void;
  getSettings: () => any;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  defaultSettings?: any;
  settingsComponent?: React.ComponentType<{ settings: any; onUpdate: (settings: any) => void }>;
  onActivate?: (context: PluginContext) => Promise<void> | void;
  onDeactivate?: (context: PluginContext) => Promise<void> | void;
  onSettingsChange?: (context: PluginContext, settings: any) => Promise<void> | void;
}

export interface Command {
  id: string;
  name: string;
  shortcut?: string;
  execute: () => void;
}

export interface MarkdownRenderer {
  id: string;
  name: string;
  test: (node: any) => boolean;
  render: (node: any, children: ReactNode) => ReactElement;
}

export interface Theme {
  id: string;
  name: string;
  styles: Record<string, string>;
}

export interface ToolbarItem {
  id: string;
  position: 'left' | 'right';
  render: () => ReactElement;
}

export interface PluginError {
  pluginId: string;
  error: Error;
}