import { createContext, useContext, useEffect, useState } from 'react'
import seedArticles from '../data/mockArticles.js'

const STORAGE_KEY = 'ctn_articles_v1'
const ArticlesContext = createContext(null)

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    // ignore corrupt storage and fall back to seed data
  }
  return seedArticles
}

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  }, [articles])

  function addArticle(data) {
    const newArticle = {
      id: Date.now(),
      time: 'Just published',
      timestamp: Date.now(),
      views: 1,
      ...data,
      image:
        data.image && data.image.trim()
          ? data.image.trim()
          : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    }
    setArticles((prev) => [newArticle, ...prev])
    return newArticle
  }

  function updateArticle(id, data) {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
    )
  }

  function deleteArticle(id) {
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  function incrementViews(id) {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, views: a.views + 1 } : a)),
    )
  }

  function getArticle(id) {
    return articles.find((a) => a.id === Number(id))
  }

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        incrementViews,
        getArticle,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  )
}

export function useArticles() {
  return useContext(ArticlesContext)
}
