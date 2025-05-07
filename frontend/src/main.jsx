import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import InventoryContextProvider from './context/inventryContext/inventryContext.jsx'
import { AuthProvider } from './context/authContext/authContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <InventoryContextProvider>
        <App />
      </InventoryContextProvider>
    </AuthProvider>
  </BrowserRouter>,
)
