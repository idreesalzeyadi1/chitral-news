import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import HeroStory from '../components/HeroStory.jsx'
import NewsGrid from '../components/NewsGrid.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { useArticles } from '../context/ArticlesContext.jsx'
import { useUI } from '../context/UIContext.jsx'
import { SOFT_CATEGORIES } from '../lib/categories.js'
import { useLanguage } from '../context/LanguageContext.jsx'

const TITLES = {
  Latest: 'Latest Breaking News Stream',
  Chitral: 'Chitral Regional News & Reports',
  Pakistan: 'National News & Pakistan Updates',
  Business: 'Business, Economy & Trade',
  Tech: 'Technology & AI Innovations',
  Sports: 'Sports & Shandur Updates',
  Opinion: 'Editorials, Columns & Opinion',
  Articles: 'Articles & Analysis',
}

const TITLE_KEYS = {
  Latest: 'latestStories',
  Chitral: 'localChitral',
  Pakistan: 'nationalPakistan',
  Business: 'businessEconomy',
  Tech: 'technologyAi',
  Sports: 'sportsCoverage',
  Opinion: 'opinion',
  Articles: 'analysis',
}

export default function CategoryPage() {
  const { name } = useParams()
  const { articles } = useArticles()
  const { openArticle } = useUI()
  const { t } = useLanguage()
  const valid = Object.prototype.hasOwnProperty.call(TITLES, name)

  const filtered = useMemo(() => {
    if (!valid) return []
    const list =
      name === 'Latest'
        ? articles.filter((a) => !SOFT_CATEGORIES.includes(a.category))
        : articles.filter((a) => a.category.toLowerCase() === name.toLowerCase())
    return [...list].sort((a, b) => b.timestamp - a.timestamp)
  }, [articles, name, valid])

  if (!valid) return <Navigate to="/" replace />

  const hero = filtered[0]
  const rest = filtered.slice(1)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold font-serif text-gray-900 border-l-4 border-brand-red pl-3">
          {t(TITLE_KEYS[name]) || TITLES[name]}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <HeroStory hero={hero} onOpen={openArticle} />

          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
              <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wide flex items-center space-x-2">
                <i className="fa-solid fa-newspaper text-brand-red"></i>
                <span>{t(TITLE_KEYS[name]) || name} {t('categoryStories')}</span>
              </h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                {t('showing')} {filtered.length} {t('posts')}
              </span>
            </div>
            <NewsGrid items={rest} onOpen={openArticle} />
          </div>
        </div>

        <Sidebar allArticles={articles} excludeCategory={name} />
      </div>
    </main>
  )
}
