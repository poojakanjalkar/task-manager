import React from 'react'
import ReactDOM from 'react-dom/client'
import TravelApp from './TravelApp.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TravelApp />
    </ErrorBoundary>
  </React.StrictMode>,
)
