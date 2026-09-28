import { createContext, useContext, useState } from 'react'
import { useArticles } from './ArticlesContext.jsx'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const { incrementViews } = useArticles()
  const [openArticleId, setOpenArticleId] = useState(null)
  const [epaperOpen, setEpaperOpen] = useState(false)

  function openArticle(id) {
    incrementViews(id)
    setOpenArticleId(id)
  }

  function closeArticle() {
    setOpenArticleId(null)
  }

  return (
    <UIContext.Provider
      value={{
        openArticleId,
        openArticle,
        closeArticle,
        epaperOpen,
        openEpaper: () => setEpaperOpen(true),
        closeEpaper: () => setEpaperOpen(false),
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  return useContext(UIContext)
}
