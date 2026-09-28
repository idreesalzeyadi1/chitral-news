import { Link } from 'react-router-dom'
import { useNotify } from '../context/NotificationContext.jsx'
import { useUI } from '../context/UIContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Footer() {
  const notify = useNotify()
  const { openEpaper } = useUI()
  const { t } = useLanguage()

  function subscribe(e) {
    e.preventDefault()
    notify(t('subscribed'))
  }

  return (
    <footer className="bg-gray-900 text-gray-400 text-sm mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-brand-red text-white p-2 rounded font-black text-xl">CTN</div>
              <span className="text-white font-serif font-bold text-xl uppercase tracking-wider">
                Chitral Taiz News
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('footerDescription')}
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold uppercase text-xs tracking-widest mb-4 border-l-2 border-brand-red pl-2">
              {t('categories')}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/Chitral" className="hover:text-white transition">{t('chitralNews')}</Link>
              </li>
              <li>
                <Link to="/category/Pakistan" className="hover:text-white transition">{t('nationalNews')}</Link>
              </li>
              <li>
                <Link to="/category/Business" className="hover:text-white transition">{t('businessEconomy')}</Link>
              </li>
              <li>
                <Link to="/category/Tech" className="hover:text-white transition">{t('technologyAi')}</Link>
              </li>
              <li>
                <Link to="/category/Sports" className="hover:text-white transition">{t('sportsCoverage')}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold uppercase text-xs tracking-widest mb-4 border-l-2 border-brand-red pl-2">
              {t('specialFeatures')}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={openEpaper} className="hover:text-white transition">
                  {t('dailyEpaper')}
                </button>
              </li>
              <li>
                <Link to="/category/Opinion" className="hover:text-white transition">
                  {t('editorials')}
                </Link>
              </li>
              <li>
                <Link to="/category/Articles" className="hover:text-white transition">
                  {t('analysis')}
                </Link>
              </li>
              <li>
                <Link to="/category/Latest" className="hover:text-white transition">
                  {t('latestBreaking')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold uppercase text-xs tracking-widest mb-4 border-l-2 border-brand-red pl-2">
              {t('newsletter')}
            </h5>
            <p className="text-xs text-gray-400 mb-3">
              {t('newsletterDescription')}
            </p>
            <form onSubmit={subscribe} className="flex items-center space-x-2">
              <input
                type="email"
                required
                placeholder={t('emailPlaceholder')}
                className="bg-gray-800 px-3 py-2 rounded text-xs text-white w-full border border-gray-700 focus:outline-none focus:border-brand-red"
              />
              <button type="submit" className="bg-brand-red hover:bg-brand-darkred text-white px-4 py-2 rounded text-xs font-bold shrink-0 transition">
                {t('join')}
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Chitral Taiz News. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition">{t('privacy')}</a>
            <a href="#" className="hover:text-white transition">{t('terms')}</a>
            <a href="#" className="hover:text-white transition">{t('editorialBoard')}</a>
            <a href="#" className="hover:text-white transition">{t('contact')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
