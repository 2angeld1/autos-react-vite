import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { CarProvider } from './context/CarContext';
import './assets/styles/main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CarProvider>
      <App />
    </CarProvider>
  </React.StrictMode>,
);