import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const FIGMA_CAPTURE_SCRIPT = 'https://mcp.figma.com/mcp/html-to-design/capture.js';

function ensureCaptureScriptForHashMode(): void {
  if (!window.location.hash.includes('figmacapture=')) {
    return;
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${FIGMA_CAPTURE_SCRIPT}"]`,
  );

  if (existing) {
    return;
  }

  const script = document.createElement('script');
  script.src = FIGMA_CAPTURE_SCRIPT;
  script.async = true;
  document.head.appendChild(script);
}

ensureCaptureScriptForHashMode();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
