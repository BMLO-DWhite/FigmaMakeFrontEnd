import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// CSS imports in correct order
import './styles/globals.css'        // Global styles first
import './styles/components.css'     // Component styles second
import './styles/utilities.css'      // Utility styles third
import './styles/themes.css'         // Theme styles last

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);