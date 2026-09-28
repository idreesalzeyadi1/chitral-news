import { Link } from 'react-router-dom'
import { useArticles } from '../context/ArticlesContext.jsx'
import AdminBreakingNews from './AdminBreakingNews.jsx'

export default function AdminDashboard() {
  const { articles } = useArticles()

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0)
  const totalPdfs = articles.filter((a) => a.pdf).length
  const totalVideos = articles.filter((a) => a.video).length
  const byCategory = articles.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1
    return acc
  }, {})

  const stats = [
    { label: 'Total Articles', value: articles.length, icon: 'fa-newspaper' },
    { label: 'Total Reads / Views', value: totalViews.toLocaleString(), icon: 'fa-eye' },
    { label: 'PDF Attachments', value: totalPdfs, icon: 'fa-file-pdf' },
    { label: 'Video Stories', value: totalVideos, icon: 'fa-play' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of Chitral Taiz News content</p>
        </div>
        <Link
          to="/editor/new"
          className="bg-brand-red hover:bg-brand-darkred text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition flex items-center space-x-2"
        >
          <i className="fa-solid fa-plus"></i>
          <span>New Article</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-brand-red/10 text-brand-red p-2.5 rounded-lg">
                <i className={`fa-solid ${s.icon} text-lg`}></i>
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Articles by Category</h3>
        <div className="space-y-3">
          {Object.entries(byCategory).map(([cat, count]) => (
            <div key={cat} className="flex items-center space-x-3">
              <span className="w-24 text-xs font-semibold text-gray-600">{cat}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-brand-red h-2.5 rounded-full"
                  style={{ width: `${(count / articles.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <AdminBreakingNews />
    </div>
  )
}
