import { Link } from 'react-router-dom'
import { useUI } from '../context/UIContext.jsx'
import { dirOf, urduClass } from '../lib/lang.js'
import { useLanguage } from '../context/LanguageContext.jsx'

const CATEGORY_BLOCKS = [
  { key: 'Chitral', translation: 'localChitral', icon: 'fa-mountain-sun' },
  { key: 'Pakistan', translation: 'nationalPakistan', icon: 'fa-flag' },
  { key: 'Sports', translation: 'sports', icon: 'fa-futbol' },
  { key: 'Business', translation: 'business', icon: 'fa-chart-line' },
  { key: 'Tech', translation: 'technologyAi', icon: 'fa-microchip' },
]

// Small text-only blocks (no big pictures) for Opinion & Articles
const TEXT_BLOCKS = [
  { key: 'Opinion', translation: 'opinion', icon: 'fa-comment-dots' },
  { key: 'Articles', translation: 'articles', icon: 'fa-pen-fancy' },
]

function MiniList({ items, onOpen }) {
  return (
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div
          key={item.id}
          className="py-2.5 flex items-start space-x-2 group cursor-pointer hover:bg-gray-50 px-2 rounded transition"
          onClick={() => onOpen(item.id)}
        >
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 shrink-0">
            <img
              src={item.image || 'https://placehold.co/100x100/111827/ffffff?text=CTN'}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
          <h5
            dir={dirOf(item)}
            className={`text-xs font-bold text-gray-900 group-hover:text-brand-red transition line-clamp-2 leading-snug flex-1 ${urduClass(item)}`}
          >
            {item.title}
          </h5>
        </div>
      ))}
    </div>
  )
}

function TextList({ items, onOpen }) {
  return (
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div
          key={item.id}
          className="py-3 px-2 group cursor-pointer hover:bg-gray-50 rounded transition"
          onClick={() => onOpen(item.id)}
        >
          <h5
            dir={dirOf(item)}
            className={`text-sm font-bold text-gray-900 group-hover:text-brand-red transition leading-snug line-clamp-2 ${urduClass(item)}`}
          >
            {item.title}
          </h5>
          <div dir="auto" className="text-[11px] text-brand-red font-semibold mt-1">
            {item.author}
          </div>
        </div>
      ))}
    </div>
  )
}

function BlockShell({ block, children }) {
  const { t } = useLanguage()
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-3">
        <h4 className="font-bold text-gray-900 uppercase text-sm tracking-wider flex items-center space-x-2">
          <i className={`fa-solid ${block.icon} text-brand-red`}></i>
          <span>{t(block.translation)}</span>
        </h4>
        <Link to={`/category/${block.key}`} className="text-[11px] font-bold text-brand-red hover:underline">
          {t('seeAll')}
        </Link>
      </div>
      {children}
    </div>
  )
}

export default function Sidebar({ allArticles, excludeCategory }) {
  const { openArticle, openEpaper } = useUI()
  const { t } = useLanguage()

  const recent = [...allArticles].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)
  const mostRead = [...allArticles].sort((a, b) => b.views - a.views).slice(0, 5)
  const byCategory = (key, n) =>
    allArticles
      .filter((a) => a.category === key)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, n)

  return (
    <div className="lg:col-span-4 space-y-8">
      {/* Recent Headlines */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-3">
          <h4 className="font-bold text-gray-900 uppercase text-sm tracking-wider flex items-center space-x-2">
            <i className="fa-solid fa-clock text-brand-red"></i>
            <span>{t('recentHeadlines')}</span>
          </h4>
        </div>
        <MiniList items={recent} onOpen={openArticle} />
      </div>

      {/* Most Read */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
          <h4 className="font-bold text-gray-900 uppercase text-sm tracking-wider flex items-center space-x-2">
            <i className="fa-solid fa-fire text-brand-red"></i>
            <span>{t('mostRead')}</span>
          </h4>
          <span className="text-xs text-gray-400 font-medium">{t('past24Hours')}</span>
        </div>
        <div className="divide-y divide-gray-100">
          {mostRead.map((item, index) => (
            <div
              key={item.id}
              className="py-3 flex items-start space-x-3 group cursor-pointer hover:bg-gray-50 p-2 rounded transition"
              onClick={() => openArticle(item.id)}
            >
              <span className="font-serif font-black text-2xl text-gray-300 group-hover:text-brand-red transition w-6 text-center">
                0{index + 1}
              </span>
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase text-brand-red mb-0.5">{item.category}</div>
                <h5
                  dir={dirOf(item)}
                  className={`text-xs font-bold text-gray-900 group-hover:text-brand-red transition line-clamp-2 leading-snug ${urduClass(item)}`}
                >
                  {item.title}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local / National / Sports / Business / Tech */}
      {CATEGORY_BLOCKS.filter((b) => b.key !== excludeCategory).map((block) => {
        const items = byCategory(block.key, 3)
        if (items.length === 0) return null
        return (
          <BlockShell key={block.key} block={block}>
            <MiniList items={items} onOpen={openArticle} />
          </BlockShell>
        )
      })}

      {/* Opinion / Articles: small text lists */}
      {TEXT_BLOCKS.filter((b) => b.key !== excludeCategory).map((block) => {
        const items = byCategory(block.key, 4)
        if (items.length === 0) return null
        return (
          <BlockShell key={block.key} block={block}>
            <TextList items={items} onOpen={openArticle} />
          </BlockShell>
        )
      })}

      {/* Epaper Banner Widget */}
      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center shadow-sm">
        <div className="inline-block bg-brand-red text-white p-3 rounded-full mb-3 shadow">
          <i className="fa-solid fa-newspaper text-2xl"></i>
        </div>
        <h4 className="font-serif font-bold text-xl text-gray-900 mb-1">{t('dailyEpaper')}</h4>
        <p className="text-xs text-gray-600 mb-4">
          {t('epaperDescription')}
        </p>
        <button
          onClick={openEpaper}
          className="bg-gray-900 text-white hover:bg-brand-red px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition shadow"
        >
          {t('openEpaper')}
        </button>
      </div>
    </div>
  )
}
