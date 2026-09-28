import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useArticles } from '../context/ArticlesContext.jsx'
import { useNotify } from '../context/NotificationContext.jsx'

export default function AdminArticles() {
  const { articles, deleteArticle } = useArticles()
  const notify = useNotify()
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const filtered = articles
    .filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.timestamp - a.timestamp)

  function handleDelete(id) {
    deleteArticle(id)
    setConfirmId(null)
    notify('Article deleted successfully.')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-gray-900">Manage Articles</h1>
          <p className="text-sm text-gray-500">{articles.length} total articles published</p>
        </div>
        <Link
          to="/editor/new"
          className="bg-brand-red hover:bg-brand-darkred text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition flex items-center space-x-2"
        >
          <i className="fa-solid fa-plus"></i>
          <span>New Article</span>
        </Link>
      </div>

      <div className="mb-4 relative w-full sm:w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-bold uppercase text-gray-500">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Author</th>
              <th className="px-5 py-3">Views</th>
              <th className="px-5 py-3">Media</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 max-w-xs">
                  <div dir="auto" className="font-semibold text-gray-900 line-clamp-1">{a.title}</div>
                  <div className="text-xs text-gray-400">{a.time}</div>
                </td>
                <td className="px-5 py-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                    {a.category}
                  </span>
                  {a.isNew && (
                    <span className="ml-1 bg-brand-red/10 text-brand-red px-2 py-0.5 rounded text-xs font-bold">
                      NEW
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-600">{a.author}</td>
                <td className="px-5 py-3 text-gray-600">{a.views}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center space-x-2 text-gray-400">
                    {a.video && <i className="fa-solid fa-play text-brand-red" title="Has video"></i>}
                    {a.pdf && <i className="fa-solid fa-file-pdf text-brand-red" title="Has PDF"></i>}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/editor/${a.id}`}
                      className="bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-700 px-3 py-1.5 rounded text-xs font-bold transition"
                    >
                      <i className="fa-solid fa-pen mr-1"></i> Edit
                    </Link>
                    {confirmId === a.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="bg-brand-red text-white px-3 py-1.5 rounded text-xs font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmId(a.id)}
                        className="bg-red-50 hover:bg-brand-red hover:text-white text-brand-red px-3 py-1.5 rounded text-xs font-bold transition"
                      >
                        <i className="fa-solid fa-trash mr-1"></i> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400 text-sm">
                  No articles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
