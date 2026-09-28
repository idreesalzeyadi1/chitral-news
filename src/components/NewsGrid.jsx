import { dirOf, urduClass } from '../lib/lang.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function NewsGrid({ items, onOpen }) {
  const { t } = useLanguage()
  if (items.length === 0) {
    return (
      <div className="col-span-2 text-center py-8 text-gray-400 text-sm">
        {t('noAdditionalStories')}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-md transition flex flex-col justify-between"
          onClick={() => onOpen(item.id)}
        >
          <div>
            <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
              <img
                src={item.image || 'https://placehold.co/600x400/111827/ffffff?text=Chitral+Taiz'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400/111827/ffffff?text=Chitral+Taiz'
                }}
              />
              <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                {item.isNew && (
                  <span className="bg-brand-red text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse-glow">
                    NEW
                  </span>
                )}
                <span className="bg-gray-900/80 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  {item.category}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 flex items-center space-x-1">
                {item.video && (
                  <span className="bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    <i className="fa-solid fa-play text-brand-red mr-1"></i>{t('video')}
                  </span>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 text-[11px] text-gray-500 mb-1.5">
                <span className="font-semibold text-gray-700">{item.author}</span>
                <span>•</span>
                <span>{item.time}</span>
              </div>
              <h3 dir={dirOf(item)} className={`font-serif font-bold text-gray-900 group-hover:text-brand-red transition text-base leading-snug line-clamp-2 ${urduClass(item)}`}>
                {item.title}
              </h3>
            </div>
          </div>
          <div className="px-4 pb-4 pt-0 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 mt-2">
            <span>
              <i className="fa-regular fa-eye mr-1"></i>
              {item.views} {t('reads')}
            </span>
            <span className="text-brand-red font-bold group-hover:underline">{t('readStory')} &rarr;</span>
          </div>
        </div>
      ))}
    </div>
  )
}
