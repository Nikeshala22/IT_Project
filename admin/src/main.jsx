import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { InventoryContext } from './context/adminSparePartsContext/InventoryContext.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <InventoryContext>
      <App />
    </InventoryContext>
  </BrowserRouter>,
)
