import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/csv-to-flashcards/service-worker.js')
             .then((registration) => {
               console.log('ServiceWorker registration successful with scope: ', registration.scope)
             })
             .catch((error) => {
               console.error('ServiceWorker registration failed:', error)
             })
  })
}
