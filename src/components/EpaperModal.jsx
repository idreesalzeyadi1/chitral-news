import { useLanguage } from '../context/LanguageContext.jsx'

export default function EpaperModal({ onClose }) {
  const { isUrdu, t } = useLanguage()
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-brand-red hover:text-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition shadow"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
        <div className="text-center mb-6">
          <span className="bg-brand-red text-white text-xs px-2.5 py-1 rounded font-bold uppercase tracking-widest">
            {t('digitalEdition')}
          </span>
          <h3 className="text-2xl font-serif font-extrabold text-gray-900 mt-2">
            {t('dailyEpaperTitle')}
          </h3>
          <p className="text-xs text-gray-500">
            {t('editionDate')}{' '}
            {new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • {t('page')} 1 / 8
          </p>
        </div>

        <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-center">
          <div className="bg-white p-8 rounded shadow-sm border border-gray-200 mb-4">
            <h4 className="text-xl font-serif font-bold text-gray-900 mb-2 border-b pb-2">
              {isUrdu ? 'چترال تائز روزانہ خصوصی ضمیمہ' : 'CHITRAL TAIZ DAILY SPECIAL SUPPLEMENT'}
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {isUrdu
                ? 'سیاحت کے بنیادی ڈھانچے میں اہم پیش رفت، چترال ایئرپورٹ کے لیے بین الاقوامی پروازوں کے رابطے کا مطالعہ شروع ہو گیا۔'
                : 'Major breakthrough in tourism infrastructure as international flight connectivity study begins for Chitral airport. Local elders and trade bodies express profound appreciation for provincial government initiatives.'}
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-gray-50 p-3 rounded border">
                <span className="text-xs font-bold text-brand-red uppercase">{t('businessBrief')}</span>
                <p className="text-xs text-gray-600 mt-1">
                  {isUrdu ? 'حکومتی تعاون سے مقامی شہد کی برآمدات بین الاقوامی منڈیوں میں ریکارڈ سطح پر پہنچ گئیں۔' : 'Local honey exports reach record high in international markets with government backing.'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded border">
                <span className="text-xs font-bold text-brand-red uppercase">{t('weatherReport')}</span>
                <p className="text-xs text-gray-600 mt-1">
                  {isUrdu ? 'آئندہ ہفتے کے اختتام کی تقریبات کے لیے ہندوکش کے بیشتر علاقوں میں مطلع صاف رہنے کی پیش گوئی ہے۔' : 'Clear skies predicted across Hindukush range for the upcoming weekend celebrations.'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button className="bg-gray-800 text-white px-4 py-2 rounded text-xs font-bold hover:bg-brand-red transition">
              <i className="fa-solid fa-chevron-left mr-1"></i> {t('prevPage')}
            </button>
            <span className="text-xs font-bold text-gray-700">{t('page')} 1 / 8</span>
            <button className="bg-gray-800 text-white px-4 py-2 rounded text-xs font-bold hover:bg-brand-red transition">
              {t('nextPage')} <i className="fa-solid fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
