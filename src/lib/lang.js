// Urdu (right-to-left) support helpers
const ARABIC_SCRIPT = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/

// Article language: explicit "lang" if set, otherwise guessed from the title's script
export function articleLang(a) {
  return a?.lang || (ARABIC_SCRIPT.test(a?.title || '') ? 'ur' : 'en')
}
export const isUrdu = (a) => articleLang(a) === 'ur'
export const dirOf = (a) => (isUrdu(a) ? 'rtl' : undefined)
export const urduClass = (a) => (isUrdu(a) ? 'urdu' : '')
