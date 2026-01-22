import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { CarProvider } from './context/CarContext';
import './index.css';
import './assets/styles/main.css';

import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CarProvider>
        <App />
      </CarProvider>
    </ThemeProvider>
  </React.StrictMode>,
);