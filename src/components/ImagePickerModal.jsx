import { useState } from 'react'
import {
  isDriveConfigured,
  hasValidToken,
  connectDrive,
  uploadImageToDrive,
  normalizeImageUrl,
} from '../lib/drive.js'

export default function ImagePickerModal({ title = 'Insert Image', showAlt = false, onPick, onClose }) {
  const configured = isDriveConfigured()
  const [tab, setTab] = useState(configured ? 'upload' : 'url')
  const [connected, setConnected] = useState(hasValidToken())
  const [busy, setBusy] = useState('') // '' | 'connecting' | 'uploading'
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)

  async function handleConnect() {
    setError('')
    setBusy('connecting')
    try {
      await connectDrive()
      setConnected(true)
      if (pendingFile) await uploadSelectedFile(pendingFile)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy('')
    }
  }

  async function uploadSelectedFile(file) {
    if (!file) return
    setError('')
    setBusy('uploading')
    try {
      const link = await uploadImageToDrive(file)
      onPick(link, alt.trim())
      setPendingFile(null)
    } catch (e) {
      if (e.code === 'NOT_CONNECTED') {
        setConnected(false)
        setError('Google session expired. Please connect Google Drive again.')
      } else {
        setError(e.message || 'Upload failed.')
      }
      setBusy('')
    }
  }

  function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, WebP or GIF).')
      return
    }
    if (!connected) {
      setPendingFile(file)
      setError('Now connect Google Drive to upload this picture automatically.')
      return
    }
    uploadSelectedFile(file)
  }

  function handleUrlInsert() {
    const clean = normalizeImageUrl(url)
    if (!/^https?:\/\//i.test(clean)) {
      setError('Enter a valid image link starting with http:// or https://')
      return
    }
    onPick(clean, alt.trim())
  }

  const tabClass = (t) =>
    `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg border-b-2 transition ${
      tab === t ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-800'
    }`

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-brand-red hover:text-white transition"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h3 className="font-bold text-lg text-gray-900 mb-3">{title}</h3>

        <div className="flex space-x-2 border-b border-gray-200 mb-4">
          <button type="button" className={tabClass('upload')} onClick={() => { setTab('upload'); setError('') }}>
            <i className="fa-brands fa-google-drive mr-1"></i> Upload to Drive
          </button>
          <button type="button" className={tabClass('url')} onClick={() => { setTab('url'); setError('') }}>
            <i className="fa-solid fa-link mr-1"></i> Image Link
          </button>
        </div>

        {showAlt && (
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description (alt text, optional)</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="e.g. Lowari Tunnel entrance"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
          </div>
        )}

        {tab === 'upload' && (
          <div>
            {!configured ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg p-3 leading-relaxed">
                Google Drive abhi set up nahi hai. Project ke <strong>.env</strong> file mein{' '}
                <code>VITE_GOOGLE_CLIENT_ID</code> daalein (steps README mein hain), phir dev server restart karein.
                Tab tak "Image Link" tab se link paste kar sakte hain.
              </div>
            ) : !connected ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500 mb-3">
                  Computer se picture select karein. Connect karne ke baad ye picture aapki Drive ke "CTN News Images" folder mein save ho jayegi.
                </p>
                <label className="inline-flex items-center cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg text-sm font-bold transition mb-3">
                  <i className="fa-solid fa-computer mr-2"></i>
                  {pendingFile ? 'Change Picture' : 'Choose from Computer'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </label>
                {pendingFile && <p className="text-xs text-gray-700 mb-3 truncate">Selected: {pendingFile.name}</p>}
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={busy === 'connecting' || !pendingFile}
                  className="bg-gray-900 hover:bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-bold transition disabled:opacity-60"
                >
                  <i className="fa-brands fa-google-drive mr-2"></i>
                  {busy === 'connecting' ? 'Connecting & Uploading...' : 'Connect & Upload'}
                </button>
              </div>
            ) : busy === 'uploading' ? (
              <div className="text-center py-10 text-sm text-gray-600">
                <i className="fa-solid fa-spinner fa-spin text-brand-red text-2xl mb-3 block"></i>
                Compressing & uploading to Google Drive...
              </div>
            ) : (
              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]) }}
                className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  dragOver ? 'border-brand-red bg-red-50' : 'border-gray-300 hover:border-brand-red'
                }`}
              >
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-brand-red mb-2 block"></i>
                <span className="text-sm font-semibold text-gray-800">Click to choose a picture</span>
                <span className="block text-xs text-gray-500 mt-1">ya yahan drag & drop karein (JPG, PNG, WebP, GIF)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
            )}
          </div>
        )}

        {tab === 'url' && (
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://... ya Google Drive share link"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Drive link paste karein to file ko "Anyone with the link" share karna hoga.
            </p>
            <button
              type="button"
              onClick={handleUrlInsert}
              className="mt-4 bg-brand-red hover:bg-brand-darkred text-white px-5 py-2 rounded-lg text-sm font-bold transition"
            >
              Insert Image
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-xs text-brand-red font-semibold">{error}</p>}
      </div>
    </div>
  )
}
