import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/css/index.css'
import App from './App.tsx'

import '/fonts/Px437_IGS_VGA_8x16.ttf'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
