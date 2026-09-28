import { useMemo, useState } from 'react'
import HeroStory from '../components/HeroStory.jsx'
import NewsGrid from '../components/NewsGrid.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { useArticles } from '../context/ArticlesContext.jsx'
import { useUI } from '../context/UIContext.jsx'
import { stripHtml } from '../lib/html.js'
import { SOFT_CATEGORIES } from '../lib/categories.js'
import { useLanguage } from '../context/LanguageContext.jsx'

const isSoft = (a) => SOFT_CATEGORIES.includes(a.category)

export default function Home() {
  const { articles } = useArticles()
  const { openArticle } = useUI()
  const { t } = useLanguage()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return articles
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          stripHtml(item.content).toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q),
      )
      .sort((a, b) => b.timestamp - a.timestamp)
  }, [articles, search])

  // Front page: Opinion & Articles never take the big slot (they have their own tab + sidebar block).
  // While searching, they can still show up in the results list.
  const searching = search.trim().length > 0
  const pool = searching ? filtered : filtered.filter((a) => !isSoft(a))
  const hero = pool.find((a) => !isSoft(a))
  const rest = pool.filter((a) => a !== hero)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold font-serif text-gray-900 border-l-4 border-brand-red pl-3 w-full sm:w-auto">
          {t('topStories')}
        </h2>
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            dir="auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {pool.length === 0 ? (
            <HeroStory hero={undefined} onOpen={openArticle} />
          ) : (
            hero && <HeroStory hero={hero} onOpen={openArticle} />
          )}

          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
              <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wide flex items-center space-x-2">
                <i className="fa-solid fa-newspaper text-brand-red"></i>
                <span>{t('latestStories')}</span>
              </h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                {t('showing')} {pool.length} {t('posts')}
              </span>
            </div>
            <NewsGrid items={rest} onOpen={openArticle} />
          </div>
        </div>

        <Sidebar allArticles={articles} />
      </div>
    </main>
  )
}
