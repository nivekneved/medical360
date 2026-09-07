import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './i18n/config'

// Resilient dynamic chunk & module preload recovery for stale deployment hashes
if (typeof window !== 'undefined') {
  const CHUNK_RETRY_KEY = 'med360_chunk_reload_retry';

  const triggerStaleChunkReload = (source: string, error?: any) => {
    try {
      const hasRetried = sessionStorage.getItem(CHUNK_RETRY_KEY);
      if (!hasRetried) {
        console.warn(`[Med360] Stale chunk / preload error detected via ${source}. Reloading app bundle...`, error);
        sessionStorage.setItem(CHUNK_RETRY_KEY, String(Date.now()));
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  };

  // Vite's built-in dynamic chunk failure event
  window.addEventListener('vite:preloadError', (event) => {
    triggerStaleChunkReload('vite:preloadError', event);
  });

  // Global unhandled module rejection fallback
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || (typeof event.reason === 'string' ? event.reason : '');
    const isChunkFailure =
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('Importing a module script failed') ||
      message.includes('error loading dynamically imported module') ||
      message.includes('Failed to load resource') ||
      event.reason?.name === 'ChunkLoadError';

    if (isChunkFailure) {
      triggerStaleChunkReload('unhandledrejection', event.reason);
    }
  });

  // Clear retry lock after 5 seconds of healthy execution so future deploys can refresh cleanly
  setTimeout(() => {
    try {
      sessionStorage.removeItem(CHUNK_RETRY_KEY);
    } catch {
      // ignore
    }
  }, 5000);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

