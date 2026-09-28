import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import ImagePickerModal from './ImagePickerModal.jsx'
import { toEditorHtml } from '../lib/html.js'

function Btn({ active, onClick, title, children, disabled }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep text selection in the editor
      onClick={onClick}
      className={`min-w-[32px] h-8 px-2 rounded text-sm transition disabled:opacity-30 ${
        active ? 'bg-brand-red text-white' : 'text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

const Divider = () => <span className="w-px h-5 bg-gray-300 mx-1"></span>

const editorAttrs = (lang) => ({
  class: 'article-content px-4 py-3 min-h-[300px] focus:outline-none' + (lang === 'ur' ? ' urdu' : ''),
  dir: lang === 'ur' ? 'rtl' : 'ltr',
})

export default function RichTextEditor({ initialContent, onChange, hasError, lang = 'en' }) {
  const [imageOpen, setImageOpen] = useState(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ HTMLAttributes: { class: 'article-img' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your story here... / اپنی خبر یہاں لکھیں' }),
    ],
    content: toEditorHtml(initialContent),
    editorProps: { attributes: editorAttrs(lang) },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getHTML()),
  })

  useEffect(() => {
    if (editor) editor.setOptions({ editorProps: { attributes: editorAttrs(lang) } })
  }, [editor, lang])

  if (!editor) return null

  function setLink() {
    const previous = editor.getAttributes('link').href || ''
    const input = window.prompt('Link URL (khali chhor dein to link hat jayega):', previous)
    if (input === null) return
    const href = input.trim()
    if (!href) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    const full = /^(https?:\/\/|mailto:)/i.test(href) ? href : `https://${href}`
    editor.chain().focus().extendMarkRange('link').setLink({ href: full }).run()
  }

  const c = () => editor.chain().focus()

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${hasError ? 'border-brand-red' : 'border-gray-300'}`}>
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-gray-50 border-b border-gray-200">
        <Btn title="Bold" active={editor.isActive('bold')} onClick={() => c().toggleBold().run()}>
          <i className="fa-solid fa-bold"></i>
        </Btn>
        <Btn title="Italic" active={editor.isActive('italic')} onClick={() => c().toggleItalic().run()}>
          <i className="fa-solid fa-italic"></i>
        </Btn>
        <Btn title="Underline" active={editor.isActive('underline')} onClick={() => c().toggleUnderline().run()}>
          <i className="fa-solid fa-underline"></i>
        </Btn>
        <Btn title="Strikethrough" active={editor.isActive('strike')} onClick={() => c().toggleStrike().run()}>
          <i className="fa-solid fa-strikethrough"></i>
        </Btn>
        <Divider />
        <Btn title="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}>
          <span className="font-bold text-xs">H2</span>
        </Btn>
        <Btn title="Sub-heading" active={editor.isActive('heading', { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()}>
          <span className="font-bold text-xs">H3</span>
        </Btn>
        <Divider />
        <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => c().toggleBulletList().run()}>
          <i className="fa-solid fa-list-ul"></i>
        </Btn>
        <Btn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => c().toggleOrderedList().run()}>
          <i className="fa-solid fa-list-ol"></i>
        </Btn>
        <Btn title="Quote" active={editor.isActive('blockquote')} onClick={() => c().toggleBlockquote().run()}>
          <i className="fa-solid fa-quote-left"></i>
        </Btn>
        <Divider />
        <Btn title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => c().setTextAlign('left').run()}>
          <i className="fa-solid fa-align-left"></i>
        </Btn>
        <Btn title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => c().setTextAlign('center').run()}>
          <i className="fa-solid fa-align-center"></i>
        </Btn>
        <Btn title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => c().setTextAlign('right').run()}>
          <i className="fa-solid fa-align-right"></i>
        </Btn>
        <Divider />
        <Btn title="Link" active={editor.isActive('link')} onClick={setLink}>
          <i className="fa-solid fa-link"></i>
        </Btn>
        <Btn title="Insert picture" onClick={() => setImageOpen(true)}>
          <i className="fa-solid fa-image"></i>
          <span className="ml-1 text-xs font-semibold hidden sm:inline">Picture</span>
        </Btn>
        <Divider />
        <Btn title="Clear formatting" onClick={() => c().unsetAllMarks().clearNodes().run()}>
          <i className="fa-solid fa-eraser"></i>
        </Btn>
        <Btn title="Undo" disabled={!editor.can().undo()} onClick={() => c().undo().run()}>
          <i className="fa-solid fa-rotate-left"></i>
        </Btn>
        <Btn title="Redo" disabled={!editor.can().redo()} onClick={() => c().redo().run()}>
          <i className="fa-solid fa-rotate-right"></i>
        </Btn>
      </div>

      <EditorContent editor={editor} />

      {imageOpen && (
        <ImagePickerModal
          title="Insert Picture in Article"
          showAlt
          onClose={() => setImageOpen(false)}
          onPick={(src, alt) => {
            editor.chain().focus().setImage({ src, alt }).run()
            setImageOpen(false)
          }}
        />
      )}
    </div>
  )
}
