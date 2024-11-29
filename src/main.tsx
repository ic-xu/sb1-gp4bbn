import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PluginManagerProvider } from './contexts/PluginManagerContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PluginManagerProvider>
      <App />
    </PluginManagerProvider>
  </StrictMode>
);