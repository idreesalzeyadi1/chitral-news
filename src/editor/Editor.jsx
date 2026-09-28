import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useArticles } from '../context/ArticlesContext.jsx'
import { useNotify } from '../context/NotificationContext.jsx'
import RichTextEditor from '../components/RichTextEditor.jsx'
import ImagePickerModal from '../components/ImagePickerModal.jsx'
import { stripHtml } from '../lib/html.js'
import { articleLang } from '../lib/lang.js'
import { SOFT_CATEGORIES } from '../lib/categories.js'

const CATEGORY_OPTIONS = ['Chitral', 'Pakistan', 'Business', 'Tech', 'Sports', 'Opinion', 'Articles']

const emptyForm = {
  title: '',
  category: 'Chitral',
  author: 'Chitral Taiz Bureau',
  image: '',
  video: '',
  pdf: '',
  content: '',
  isNew: true,
  lang: 'en',
}

export default function EditorPage() {
  const { id } = useParams()
  return <EditorForm key={id || 'new'} id={id} />
}

function EditorForm({ id }) {
  const isEditMode = Boolean(id)
  const navigate = useNavigate()
  const notify = useNotify()
  const { getArticle, addArticle, updateArticle } = useArticles()

  const existing = isEditMode ? getArticle(id) : null
  const [form, setForm] = useState(() =>
    existing
      ? {
          title: existing.title,
          category: existing.category,
          author: existing.author,
          image: existing.image || '',
          video: existing.video || '',
          pdf: existing.pdf || '',
          content: existing.content,
          isNew: existing.isNew,
          lang: articleLang(existing),
        }
      : emptyForm,
  )
  const [contentError, setContentError] = useState(false)
  const [featuredPickerOpen, setFeaturedPickerOpen] = useState(false)

  if (isEditMode && !existing) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-700 font-semibold mb-4">Article not found (shayad delete ho chuka hai).</p>
          <Link to="/admin/articles" className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-bold">
            Back to Articles
          </Link>
        </div>
      </div>
    )
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const hasText = stripHtml(form.content).length > 0
    const hasImage = /<img\s/i.test(form.content)
    if (!hasText && !hasImage) {
      setContentError(true)
      return
    }

    if (isEditMode) {
      updateArticle(Number(id), form)
      notify('Article updated successfully.')
    } else {
      addArticle(form)
      notify('Success! Your news article has been published live.')
    }
    navigate('/admin/articles')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white px-6 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-red p-2.5 rounded text-white">
            <i className="fa-solid fa-pen-nib"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg">{isEditMode ? 'Edit Article' : 'Editor — New Article'}</h1>
            <p className="text-xs text-gray-400">Add breaking news, video embeds, or research articles</p>
          </div>
        </div>
        <Link to="/admin/articles" className="text-gray-300 hover:text-white text-sm">
          <i className="fa-solid fa-xmark text-xl"></i>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Language / زبان</label>
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
              {[
                { key: 'en', label: 'English' },
                { key: 'ur', label: 'اردو' },
              ].map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => update('lang', l.key)}
                  className={`px-5 py-1.5 text-sm font-bold transition ${
                    form.lang === l.key ? 'bg-brand-red text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            {form.lang === 'ur' && (
              <p className="text-[11px] text-gray-500 mt-1">
                Urdu likhne ke liye Windows keyboard Urdu par badlein (Win + Space). Title aur content right-to-left ho jayenge.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Article Title *</label>
            <input
              type="text"
              required
              dir={form.lang === 'ur' ? 'rtl' : 'ltr'}
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder={form.lang === 'ur' ? 'خبر کی سرخی یہاں لکھیں' : 'e.g. Kalash Spring Festival dates announced...'}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none ${form.lang === 'ur' ? 'urdu' : ''}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none bg-white"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {SOFT_CATEGORIES.includes(form.category) && (
                <p className="text-[11px] text-gray-500 mt-1">
                  {form.category} front page par bara nahi dikhta. Ye apni tab aur sidebar ke chhote block mein aata hai.
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Author / Source *</label>
              <input
                type="text"
                required
                dir="auto"
                value={form.author}
                onChange={(e) => update('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Featured Image</label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => update('image', e.target.value)}
                  placeholder="https://... ya Upload dabayen"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setFeaturedPickerOpen(true)}
                  className="shrink-0 bg-gray-900 hover:bg-brand-red text-white px-3 py-2 rounded-lg text-xs font-bold transition"
                >
                  <i className="fa-solid fa-cloud-arrow-up mr-1"></i> Upload
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Leave blank for professional default image.</p>
              {form.image && (
                <img
                  src={form.image}
                  alt="Featured preview"
                  className="mt-2 h-24 rounded-lg border border-gray-200 object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  onLoad={(e) => { e.currentTarget.style.display = 'block' }}
                />
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Video Link (YouTube / Cloudinary)
              </label>
              <input
                type="text"
                value={form.video}
                onChange={(e) => update('video', e.target.value)}
                placeholder="https://www.youtube.com/embed/... or mp4 link"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              PDF Attachment / Research Document Link
            </label>
            <input
              type="text"
              value={form.pdf}
              onChange={(e) => update('pdf', e.target.value)}
              placeholder="e.g. Budget_Report_2026.pdf or external PDF link"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Full Article Content *</label>
            <RichTextEditor
              lang={form.lang}
              initialContent={form.content}
              hasError={contentError}
              onChange={(html) => {
                update('content', html)
                setContentError(false)
              }}
            />
            {contentError && (
              <p className="text-xs text-brand-red font-semibold mt-1">Please write the article content before publishing.</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="pub-is-new"
              checked={form.isNew}
              onChange={(e) => update('isNew', e.target.checked)}
              className="w-4 h-4 text-brand-red rounded border-gray-300 focus:ring-brand-red"
            />
            <label htmlFor="pub-is-new" className="text-sm font-semibold text-gray-800">
              Highlight with Glowing Red <span className="text-brand-red font-bold">"NEW"</span> Badge
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-200">
            <Link
              to="/admin/articles"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-red hover:bg-brand-darkred text-white rounded-lg text-sm font-bold shadow transition"
            >
              {isEditMode ? 'Save Changes' : 'Publish to Website'}
            </button>
          </div>
        </form>
      </div>

      {featuredPickerOpen && (
        <ImagePickerModal
          title="Featured Image"
          onClose={() => setFeaturedPickerOpen(false)}
          onPick={(src) => {
            update('image', src)
            setFeaturedPickerOpen(false)
          }}
        />
      )}
    </div>
  )
}
