import DOMPurify from 'dompurify'

// Open every link in a new tab, safely
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export function isHtml(str = '') {
  return /<\/?[a-z][\s\S]*>/i.test(str)
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Old / plain-text articles -> paragraphs the editor understands
export function toEditorHtml(content = '') {
  if (!content) return ''
  if (isHtml(content)) return content
  return content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('')
}

// For cards / excerpts / search: plain text without tags
export function stripHtml(str = '') {
  if (!isHtml(str)) return str
  const spaced = str.replace(/<\/(p|h[1-6]|li|blockquote|div)>/gi, ' ')
  const div = document.createElement('div')
  div.innerHTML = DOMPurify.sanitize(spaced)
  return (div.textContent || '').replace(/\s+/g, ' ').trim()
}

export function sanitizeHtml(str = '') {
  return DOMPurify.sanitize(str)
}
