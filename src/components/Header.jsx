import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useUI } from '../context/UIContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useWeather } from '../hooks/useWeather.js'

const CATEGORIES = [
  { key: 'Home', translation: 'home', to: '/' },
  { key: 'Latest', translation: 'latest', to: '/category/Latest' },
  { key: 'Chitral', translation: 'chitral', to: '/category/Chitral' },
  { key: 'Pakistan', translation: 'pakistan', to: '/category/Pakistan' },
  { key: 'Business', translation: 'business', to: '/category/Business' },
  { key: 'Tech', translation: 'tech', to: '/category/Tech' },
  { key: 'Sports', translation: 'sports', to: '/category/Sports' },
  { key: 'Opinion', translation: 'opinion', to: '/category/Opinion' },
  { key: 'Articles', translation: 'articles', to: '/category/Articles' },
]

export default function Header() {
  const { openEpaper } = useUI()
  const { isUrdu, t, toggleLanguage } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: weather, status: weatherStatus } = useWeather()
  const dateStr =
    new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <>
      {/* Top Utility Bar */}
      <header className="bg-gray-900 text-gray-300 text-[11px] sm:text-xs border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 sm:h-10 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="font-medium truncate">{dateStr}</span>
            <span className="hidden md:inline-block text-gray-500">|</span>
            <span className="hidden md:inline-flex items-center space-x-1 text-gray-400">
              <i className="fa-solid fa-location-dot text-brand-red"></i>
              <span>{isUrdu ? 'چترال، پاکستان' : 'Chitral, Pakistan'}</span>
            </span>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {weatherStatus === 'ready' && weather?.temp != null && (
              <span className="lg:hidden flex items-center space-x-1 text-gray-300">
                <i className={`fa-solid ${weather.icon} text-amber-400`}></i>
                <span className="font-semibold">{weather.temp}°C</span>
              </span>
            )}
            <button onClick={toggleLanguage} className="border border-gray-600 hover:border-white hover:text-white transition px-2 py-0.5 rounded font-semibold shrink-0" aria-label="Change language">
              {t('language')}
            </button>
            <button onClick={openEpaper} className="hover:text-white transition flex items-center space-x-1 shrink-0">
              <i className="fa-solid fa-newspaper text-brand-red"></i>
              <span className="font-semibold">EPAPER</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Branding Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
            <div className="bg-brand-red text-white p-1.5 sm:p-2.5 rounded-lg font-black text-base sm:text-2xl tracking-tighter shadow-md group-hover:bg-brand-darkred transition shrink-0">
              CTN
            </div>
            <div className="text-left min-w-0">
              <h1 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 uppercase font-serif leading-tight truncate">
                Chitral Taiz News
              </h1>
              <p className="text-[7px] sm:text-[10px] tracking-widest text-brand-red font-bold uppercase truncate">
                The Voice of Hindukush & Beyond
              </p>
            </div>
          </NavLink>

          {/* Weather / Updates widget - desktop only */}
          <div className="hidden lg:flex items-center space-x-6 text-sm bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-700">
              <i className={`fa-solid ${weather?.icon || 'fa-cloud-sun'} text-amber-500 text-xl`}></i>
              <div>
                <div className="font-bold">{t('weather')}</div>
                <div className="text-xs text-gray-500">
                  {weatherStatus === 'loading' && t('loadingWeather')}
                  {weatherStatus === 'error' && t('weatherUnavailable')}
                  {weatherStatus === 'ready' && weather && (
                    <>
                      {weather.label}
                      {weather.temp != null && `, ${weather.temp}°C`}
                      {weather.aqi != null && ` | AQI: ${weather.aqi} ${weather.aqiLabel}`}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2 text-gray-700">
              <i className="fa-solid fa-shield-halved text-brand-red text-xl"></i>
              <div>
                <div className="font-bold">{t('urgentUpdates')}</div>
                <div className="text-xs text-gray-500">{t('liveCoverage')}</div>
              </div>
            </div>
          </div>

          {/* Hamburger - mobile/tablet only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden bg-gray-900 text-white w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            aria-label="Toggle menu"
          >
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-sm`}></i>
          </button>
        </div>

        {/* Navigation Menu - desktop/tablet: horizontal bar */}
        <nav className="hidden md:block bg-gray-900 text-white shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2.5 space-x-1 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-sm font-semibold uppercase tracking-wider">
                {CATEGORIES.map((cat) => (
                  <NavLink
                    key={cat.key}
                    to={cat.to}
                    end={cat.key === 'Home'}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded transition ${
                        isActive ? 'bg-brand-red text-white' : 'hover:bg-gray-800 text-gray-200'
                      }`
                    }
                  >
                    {t(cat.translation)}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Navigation Menu - mobile: dropdown list */}
        {menuOpen && (
          <nav className="md:hidden bg-gray-900 text-white border-t border-gray-800">
            <div className="px-3 py-2 flex flex-col">
              {CATEGORIES.map((cat) => (
                <NavLink
                  key={cat.key}
                  to={cat.to}
                  end={cat.key === 'Home'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded text-sm font-semibold uppercase tracking-wider transition ${
                      isActive ? 'bg-brand-red text-white' : 'hover:bg-gray-800 text-gray-200'
                    }`
                  }
                >
                  {t(cat.translation)}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </>
  )
}
