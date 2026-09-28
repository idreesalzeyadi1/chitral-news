import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'ctn_breaking_news_v1'
const DEFAULT_HEADLINES = [
  'Lowari Tunnel remains open for all traffic as National Highway authority completes maintenance work',
  'PM Shehbaz Sharif praises Chitral administration for timely disaster preparedness',
  'New hydro power project inaugurated in upper Chitral district bringing 85MW to grid.',
]

const BreakingNewsContext = createContext(null)

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const headlines = JSON.parse(raw)
      if (Array.isArray(headlines)) return headlines.filter((headline) => typeof headline === 'string' && headline.trim())
    }
  } catch (e) {
  }
  return DEFAULT_HEADLINES
}

export function BreakingNewsProvider({ children }) {
  const [headlines, setHeadlines] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(headlines))
  }, [headlines])

  function addHeadline(headline) {
    const value = headline.trim()
    if (!value) return false
    setHeadlines((current) => [...current, value])
    return true
  }

  function updateHeadline(index, headline) {
    const value = headline.trim()
    if (!value) return false
    setHeadlines((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))
    return true
  }

  function deleteHeadline(index) {
    setHeadlines((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <BreakingNewsContext.Provider value={{ headlines, addHeadline, updateHeadline, deleteHeadline }}>
      {children}
    </BreakingNewsContext.Provider>
  )
}

export function useBreakingNews() {
  return useContext(BreakingNewsContext)
}
