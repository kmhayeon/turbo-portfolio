'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowLeft } from 'lucide-react'
import Toast from '../../../../web/components/ui/Toast'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import "../../../styles/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

const ToastEditor = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Editor), {
  ssr: false,
})

export default function WritePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showToast, setShowToast] = useState(false)

  const router = useRouter()
  const editorRef = useRef<any>(null)

  const handleEditorChange = () => {
    const markdown = editorRef.current?.getInstance().getMarkdown() || ''
    setContent(markdown)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return

    await fetch('/api/blog', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    })

    setShowToast(true)

    setTimeout(() => {
      router.push('/blog')
    }, 1500)
  }

  return (
    <section className="mx-auto w-full max-w-6xl border-t px-4 py-12 sm:px-6 md:px-8 lg:px-12">
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 rounded border border-gray-300 px-2 py-2 text-sm hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-2xl font-bold">글쓰기</h2>
      </div>

      <div className="w-full">
        <input
          className="mb-4 w-full border p-2"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <ToastEditor
          ref={editorRef}
          initialValue={"내용을 입력해주세요."}
          previewStyle="vertical"
          height="400px"
          initialEditType="wysiwyg"
          useCommandShortcut={true}
          hideModeSwitch={true}
          onChange={handleEditorChange}
          plugins={[colorSyntax]}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className={`rounded px-4 py-2 text-sm text-white ${
              !title.trim() || !content.trim()
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-gray-900 hover:bg-gray-700'
            } `}
          >
            등록
          </button>
          <button
            onClick={() => router.back()}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            취소
          </button>
        </div>
      </div>

      {showToast && <Toast message="저장되었습니다." onClose={() => setShowToast(false)} />}
    </section>
  )
}
