import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './App.css'
import { AuthProvider } from './context/AuthContext'

// Punto de entrada de React: aquí conectamos la aplicación con el <div id="root"> de index.html.
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode activa comprobaciones extra en desarrollo para detectar malas prácticas.
  <React.StrictMode>
    {/* AuthProvider envuelve toda la app para que cualquier componente pueda consultar login, usuario y logout. */}
    <AuthProvider>
      {/* BrowserRouter permite usar rutas limpias como /bikes o /login sin recargar la página completa. */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
