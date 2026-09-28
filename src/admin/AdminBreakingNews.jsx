import { useState } from 'react'
import { useBreakingNews } from '../context/BreakingNewsContext.jsx'
import { useNotify } from '../context/NotificationContext.jsx'

export default function AdminBreakingNews() {
  const { headlines, addHeadline, updateHeadline, deleteHeadline } = useBreakingNews()
  const notify = useNotify()
  const [newHeadline, setNewHeadline] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingValue, setEditingValue] = useState('')

  function handleAdd(event) {
    event.preventDefault()
    if (!addHeadline(newHeadline)) {
      notify('Please enter a breaking news headline.')
      return
    }
    setNewHeadline('')
    notify('Breaking news added to the ticker.')
  }

  function startEditing(index) {
    setEditingIndex(index)
    setEditingValue(headlines[index])
  }

  function handleUpdate(index) {
    if (!updateHeadline(index, editingValue)) {
      notify('Headline cannot be empty.')
      return
    }
    setEditingIndex(null)
    setEditingValue('')
    notify('Breaking news headline updated.')
  }

  function handleDelete(index) {
    deleteHeadline(index)
    if (editingIndex === index) setEditingIndex(null)
    notify('Breaking news removed from the ticker.')
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="font-bold text-gray-900">Breaking News Ticker</h3>
          <p className="text-sm text-gray-500 mt-1">Manage the headlines shown in the red ticker on the website.</p>
        </div>
        <span className="bg-brand-red/10 text-brand-red px-2.5 py-1 rounded text-xs font-bold shrink-0">
          {headlines.length} headlines
        </span>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-5">
        <input
          type="text"
          value={newHeadline}
          onChange={(event) => setNewHeadline(event.target.value)}
          placeholder="Write a new breaking news headline..."
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
        />
        <button
          type="submit"
          className="bg-brand-red hover:bg-brand-darkred text-white px-4 py-2.5 rounded-lg text-sm font-bold transition"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add Headline
        </button>
      </form>

      <div className="space-y-2">
        {headlines.map((headline, index) => (
          <div key={`${headline}-${index}`} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
            <span className="text-xs font-bold text-gray-400 w-5">{index + 1}</span>
            {editingIndex === index ? (
              <input
                type="text"
                value={editingValue}
                onChange={(event) => setEditingValue(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleUpdate(index)}
                autoFocus
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            ) : (
              <p className="flex-1 min-w-0 text-sm text-gray-700">{headline}</p>
            )}
            <div className="flex items-center gap-2 shrink-0">
              {editingIndex === index ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdate(index)}
                    className="text-green-700 hover:text-green-900 text-sm font-bold"
                    title="Save headline"
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIndex(null)}
                    className="text-gray-500 hover:text-gray-800 text-sm font-bold"
                    title="Cancel editing"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => startEditing(index)}
                  className="text-gray-500 hover:text-gray-900 text-sm font-bold"
                  title="Edit headline"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="text-brand-red hover:text-brand-darkred text-sm font-bold"
                title="Delete headline"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        {headlines.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No headlines. Add one above.</p>}
      </div>
    </section>
  )
}
