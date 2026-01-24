import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Handle failed dynamic imports (e.g. lazy chunks) – often caused by a new deploy
 * while the user still has a cached index/main referencing old chunk names.
 * Show a banner and offer refresh so the user gets the new assets.
 */
function setupChunkLoadErrorHandler(): void {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const msg = (event.reason?.message || event.reason?.toString?.() || '').toString();
    const isChunkError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Loading chunk') ||
      msg.includes('ChunkLoadError') ||
      msg.includes('Loading CSS chunk');

    if (!isChunkError) return;
    event.preventDefault();

    if ((window as unknown as { __chunkErrorShown?: boolean }).__chunkErrorShown) return;
    (window as unknown as { __chunkErrorShown?: boolean }).__chunkErrorShown = true;

    const style =
      'position:fixed;top:0;left:0;right:0;background:#b71c1c;color:#fff;padding:12px 16px;' +
      'text-align:center;z-index:999999;font-family:system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.2);';
    const btnStyle =
      'margin-left:12px;padding:6px 16px;background:#fff;color:#b71c1c;border:none;' +
      'border-radius:4px;cursor:pointer;font-weight:600;';
    const html =
      'A new version of the app is available. <button onclick="location.reload()" style="' +
      btnStyle +
      '">Refresh</button> If it persists, try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R).';

    const banner = document.createElement('div');
    banner.id = 'chunk-error-banner';
    banner.setAttribute('role', 'alert');
    banner.style.cssText = style;
    banner.innerHTML = html;
    (document.body || document.documentElement).prepend(banner);
  });
}

setupChunkLoadErrorHandler();
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));