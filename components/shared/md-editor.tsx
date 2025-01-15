'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'

const MDEditorComponent = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface MDEditorProps {
  value: string
  onChange: (value?: string) => void
  preview?: 'live' | 'edit' | 'preview'
  height?: number
}

export function MDEditor({ value, onChange, preview = 'live', height = 200 }: MDEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditorComponent
        value={value}
        onChange={onChange}
        preview={preview}
        height={height}
      />
    </div>
  )
} 