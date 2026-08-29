import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * main.jsx — Application Entry Point
 *
 * This is the FIRST file JavaScript executes.
 * It mounts the entire React application into the HTML page.
 *
 * HOW REACT MOUNTS INTO HTML:
 * ────────────────────────────
 * index.html has:  <div id="root"></div>
 * This file finds that div and renders <App /> inside it.
 * From this point, React owns everything inside #root.
 *
 * createRoot (React 18):
 *   The new way to mount React apps (replaces ReactDOM.render).
 *   Enables concurrent rendering features.
 *
 * <StrictMode>:
 *   A development-only wrapper that:
 *   - Runs each component twice to detect side effects
 *   - Warns about deprecated APIs
 *   - Has NO effect in production builds
 *   This is why you may see API calls fire twice in dev — it's normal.
 *
 * ./index.css:
 *   Imported here so global styles apply to the entire app.
 *   Vite bundles this CSS into the final build automatically.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
