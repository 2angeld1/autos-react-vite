import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { CarProvider } from './context/CarContext';
import './assets/styles/main.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <CarProvider>
      <App />
    </CarProvider>
  </React.StrictMode>
);