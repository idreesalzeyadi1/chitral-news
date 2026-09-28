import { useBreakingNews } from '../context/BreakingNewsContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Ticker() {
  const { headlines } = useBreakingNews()
  const { t } = useLanguage()

  return (
    <div className="bg-brand-red text-white py-2 overflow-hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="flex items-center space-x-2 bg-black/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shrink-0 mr-4">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
          <span>{t('breakingNews')}</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap relative w-full">
          <div className="inline-block animate-marquee text-sm font-medium">
            {headlines.map((headline, index) => (
              <span key={`${headline}-${index}`}>
                {index > 0 && ' • '}
                {headline}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
