'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditorComponent = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface MDEditorProps {
  value?: string
  onChange?: (value?: string) => void
  placeholder?: string
}

export function MDEditor({ value, onChange, placeholder }: MDEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditorComponent
        value={value}
        onChange={onChange}
        preview="edit"
        height={200}
        placeholder={placeholder}
        toolbarHeight={40}
        enableScroll={true}
      />
    </div>
  )
} 