import { stripHtml } from '../lib/html.js'
import { dirOf, urduClass } from '../lib/lang.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function HeroStory({ hero, onOpen }) {
  const { t } = useLanguage()
  if (!hero) {
    return (
      <div className="bg-white p-8 rounded-xl text-center border border-gray-200 text-gray-500">
        {t('noStories')}
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-md transition"
      onClick={() => onOpen(hero.id)}
    >
      <div className="relative overflow-hidden aspect-[16/9] bg-gray-200">
        <img
          src={hero.image || 'https://placehold.co/800x450/111827/ffffff?text=Chitral+Taiz+News'}
          alt={hero.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/800x450/111827/ffffff?text=Chitral+Taiz+News'
          }}
        />
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          {hero.isNew && (
            <span className="bg-brand-red text-white text-[11px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider animate-pulse-glow shadow">
              NEW
            </span>
          )}
          <span className="bg-gray-900/90 text-white px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
            {hero.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          {hero.video && (
            <span className="bg-black/80 text-white px-2.5 py-1 rounded text-xs font-bold flex items-center space-x-1">
              <i className="fa-solid fa-play text-brand-red"></i>
              <span>{t('video')}</span>
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
          <span className="font-bold text-gray-800">{hero.author}</span>
          <span>•</span>
          <span>{hero.time}</span>
          <span>•</span>
          <span>
            <i className="fa-regular fa-eye mr-1"></i>
            {hero.views} {t('views')}
          </span>
        </div>
        <h2 dir={dirOf(hero)} className={`text-2xl sm:text-3xl font-serif font-bold text-gray-900 group-hover:text-brand-red transition leading-tight mb-3 ${urduClass(hero)}`}>
          {hero.title}
        </h2>
        <p dir={dirOf(hero)} className={`text-gray-600 text-sm leading-relaxed line-clamp-2 ${urduClass(hero)}`}>{stripHtml(hero.content)}</p>
        <div className="mt-4 flex items-center text-brand-red font-bold text-xs uppercase tracking-wider">
          <span>{t('readFullStory')}</span>
          <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition"></i>
        </div>
      </div>
    </div>
  )
}
