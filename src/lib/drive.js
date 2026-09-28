// Upload images to the publisher's own Google Drive (browser only, no backend).
// Needs a Google OAuth Client ID in .env -> VITE_GOOGLE_CLIENT_ID (see README).

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPE = 'https://www.googleapis.com/auth/drive.file' // only files created by this app
const FOLDER_NAME = 'CTN News Images'
const FOLDER_KEY = 'ctn_drive_folder_id'

let accessToken = null
let tokenExpiry = 0

export const isDriveConfigured = () => Boolean(CLIENT_ID)
export const hasValidToken = () => Boolean(accessToken) && Date.now() < tokenExpiry - 60_000

function notConnected() {
  const err = new Error('Not connected to Google Drive.')
  err.code = 'NOT_CONNECTED'
  return err
}

function loadGis() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve()
    const existing = document.querySelector('script[data-gis]')
    const onError = () => reject(new Error('Could not load Google sign-in. Check your internet connection.'))
    if (existing) {
      existing.addEventListener('load', resolve)
      existing.addEventListener('error', onError)
      return
    }
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.dataset.gis = 'true'
    s.onload = resolve
    s.onerror = onError
    document.head.appendChild(s)
  })
}

// Must be called from a click handler (opens Google's popup)
export async function connectDrive() {
  if (!CLIENT_ID) throw new Error('Google Client ID is missing in .env')
  await loadGis()
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (resp) => {
        if (resp.error) return reject(new Error(resp.error_description || resp.error))
        accessToken = resp.access_token
        tokenExpiry = Date.now() + Number(resp.expires_in) * 1000
        resolve(accessToken)
      },
      error_callback: (err) =>
        reject(
          new Error(
            err?.type === 'popup_closed'
              ? 'Google sign-in window was closed.'
              : 'Google sign-in was blocked. Allow popups for this site and try again.',
          ),
        ),
    })
    client.requestAccessToken({ prompt: '' })
  })
}

async function apiError(res) {
  if (res.status === 401) {
    accessToken = null
    return notConnected()
  }
  let msg = `Google Drive error (${res.status})`
  try {
    const j = await res.json()
    if (j?.error?.message) msg = j.error.message
  } catch (e) {
    // ignore
  }
  return new Error(msg)
}

async function ensureFolder(token) {
  const cached = localStorage.getItem(FOLDER_KEY)
  if (cached) {
    const r = await fetch(`https://www.googleapis.com/drive/v3/files/${cached}?fields=id,trashed`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (r.ok) {
      const j = await r.json()
      if (!j.trashed) return cached
    }
  }
  const res = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }),
  })
  if (!res.ok) throw await apiError(res)
  const { id } = await res.json()
  localStorage.setItem(FOLDER_KEY, id)
  return id
}

// Shrink big photos before upload (faster site, less Drive space)
async function compressImage(file, maxWidth = 1600, quality = 0.85) {
  if (/gif|svg/.test(file.type)) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxWidth / bitmap.width)
    if (scale === 1 && file.size < 800 * 1024) return file
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', quality))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch (e) {
    return file
  }
}

export async function uploadImageToDrive(originalFile) {
  if (!hasValidToken()) throw notConnected()
  const token = accessToken

  const file = await compressImage(originalFile)
  const folderId = await ensureFolder(token)

  const form = new FormData()
  form.append(
    'metadata',
    new Blob([JSON.stringify({ name: `${Date.now()}-${file.name}`, parents: [folderId] })], {
      type: 'application/json',
    }),
  )
  form.append('file', file)

  const up = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  if (!up.ok) throw await apiError(up)
  const { id } = await up.json()

  // Make the picture viewable by website visitors
  const perm = await fetch(`https://www.googleapis.com/drive/v3/files/${id}/permissions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  })
  if (!perm.ok) throw await apiError(perm)

  return `https://lh3.googleusercontent.com/d/${id}`
}

// Turns a pasted Drive share link into a direct image link
export function normalizeImageUrl(url) {
  const u = url.trim()
  const m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || u.match(/drive\.google\.com\/(?:open|uc)\?[^#]*id=([\w-]+)/)
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}` : u
}
