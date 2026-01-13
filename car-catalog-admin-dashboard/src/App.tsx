import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from '@/routes/AppRoutes';
import { ThemeProvider } from '@/context/ThemeContext';
import '@/styles/globals.css';
import '@/styles/variables.css';
import '@/styles/components.css';

// Toast configuration
const toastOptions = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#363636',
    color: '#fff',
  },
  success: {
    duration: 3000,
    style: {
      background: '#059669',
    },
  },
  error: {
    duration: 5000,
    style: {
      background: '#DC2626',
    },
  },
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <AppRoutes />
          <Toaster toastOptions={toastOptions} />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;