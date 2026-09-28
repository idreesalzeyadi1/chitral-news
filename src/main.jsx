import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ArticlesProvider } from './context/ArticlesContext.jsx'
import { BreakingNewsProvider } from './context/BreakingNewsContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <ArticlesProvider>
            <BreakingNewsProvider>
              <LanguageProvider>
                <UIProvider>
                  <App />
                </UIProvider>
              </LanguageProvider>
            </BreakingNewsProvider>
          </ArticlesProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
