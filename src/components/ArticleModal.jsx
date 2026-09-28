import { useNotify } from '../context/NotificationContext.jsx'
import { isHtml, sanitizeHtml } from '../lib/html.js'
import { dirOf, urduClass } from '../lib/lang.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ArticleModal({ item, onClose }) {
  const notify = useNotify()
  const { t, isUrdu } = useLanguage()
  if (!item) return null

  let mediaHtml = null
  if (item.video) {
    const isYoutube = item.video.includes('youtube.com') || item.video.includes('youtu.be')
    mediaHtml = (
      <div className="my-6 aspect-video bg-black rounded-xl overflow-hidden shadow">
        {isYoutube ? (
          <iframe src={item.video} className="w-full h-full" frameBorder="0" allowFullScreen title={item.title} />
        ) : (
          <video controls className="w-full h-full object-cover">
            <source src={item.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    )
  } else if (item.image) {
    mediaHtml = (
      <div className="my-6 aspect-[16/9] rounded-xl overflow-hidden shadow">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>
    )
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {})
    notify(t('articleCopied'))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-brand-red hover:text-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition z-10 shadow"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-2 mb-3">
            <span className="bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              {item.category}
            </span>
            <span className="text-xs text-gray-500">{item.time}</span>
            <span className="text-xs text-gray-500">
              • {isUrdu ? 'از' : 'By'} <strong className="text-gray-800">{item.author}</strong>
            </span>
          </div>
          <h2 dir={dirOf(item)} className={`text-2xl sm:text-3xl font-serif font-extrabold text-gray-900 leading-tight mb-4 ${urduClass(item)}`}>
            {item.title}
          </h2>
          {mediaHtml}
          {isHtml(item.content) ? (
            <div dir={dirOf(item)} className={`article-content ${urduClass(item)}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }} />
          ) : (
            <div dir={dirOf(item)} className={`article-content ${urduClass(item)}`}>
              {item.content.split(/\n+/).filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-500 uppercase">{t('shareStory')}</span>
              <button
                onClick={copyLink}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-xs font-semibold text-gray-700 transition"
              >
                <i className="fa-solid fa-share-nodes mr-1"></i> {t('copyLink')}
              </button>
            </div>
            <span className="text-xs text-gray-500">
              <i className="fa-regular fa-eye mr-1"></i>
              {item.views} {t('totalReads')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
