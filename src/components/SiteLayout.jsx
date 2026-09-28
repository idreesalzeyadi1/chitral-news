import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Ticker from './Ticker.jsx'
import Footer from './Footer.jsx'
import ArticleModal from './ArticleModal.jsx'
import EpaperModal from './EpaperModal.jsx'
import { useUI } from '../context/UIContext.jsx'
import { useArticles } from '../context/ArticlesContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function SiteLayout() {
  const { openArticleId, closeArticle, epaperOpen, closeEpaper } = useUI()
  const { articles } = useArticles()
  const { language, isUrdu } = useLanguage()
  const openArticle = openArticleId ? articles.find((a) => a.id === openArticleId) : null

  return (
    <div lang={language} dir={isUrdu ? 'rtl' : 'ltr'} className={`bg-gray-50 text-gray-900 min-h-screen flex flex-col ${isUrdu ? 'site-urdu' : ''}`}>
      <Header />
      <Ticker />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />

      {openArticle && <ArticleModal item={openArticle} onClose={closeArticle} />}
      {epaperOpen && <EpaperModal onClose={closeEpaper} />}
    </div>
  )
}
