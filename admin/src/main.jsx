import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/appContex'; // Add this import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        {console.log('AppContextProvider is rendering')} {/* Debug log */}
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
);