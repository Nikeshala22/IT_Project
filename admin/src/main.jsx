import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import InventoryContextProvider from './context/adminSparePartsContext/InventoryContext.jsx'
import { AppContextProvider } from './context/adminPackagesContext/appContex.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <InventoryContextProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </InventoryContextProvider>
  </BrowserRouter>,
)
