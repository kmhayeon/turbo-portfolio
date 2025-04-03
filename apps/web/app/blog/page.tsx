'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'

type BlogPost = {
  id: number
  title: string
  content: string
}

export default function Page() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data: BlogPost[]) => setPosts(data))
  }, [])

  const handleSubmit = async () => {
    if (editId !== null) {
      const res = await fetch(`/api/blog/${editId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      })
      const updated: BlogPost = await res.json()
      setPosts((prev) => prev.map((p) => (p.id === editId ? updated : p)))
      setEditId(null)
      setIsModalOpen(false)
    } else {
      const res = await fetch('/api/blog', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      })
      const newPost: BlogPost = await res.json()

      setPosts((prev) => [...prev, newPost])
      setIsModalOpen(false)
    }

    setTitle('')
    setContent('')
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?')
    if (!confirmed) return

    await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    setPosts((prev) => prev.filter((post) => post.id !== id))
  }

  return (
    <section
      id="blog"
      className="mx-auto w-full max-w-6xl border-t px-4 py-12 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 rounded-[4px] border border-gray-300 px-2 py-2 text-sm hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-3xl font-bold">Blog</h2>
        </div>

        <button
          onClick={() => router.push('/blog/write')}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          글쓰기
        </button>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {posts.map((post) => (
          <li
            key={post.id}
            onClick={() => router.push(`/blog/${post.id}`)}
            className="flex min-h-[160px] cursor-pointer flex-col rounded-md border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="break-words text-lg font-semibold text-gray-800">{post.title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(post.id)
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="line-clamp-5 break-words text-sm text-gray-600">{post.content}</p>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">
              {editId !== null ? '글 수정하기' : '새 글 작성'}
            </h3>
            <input
              className="mb-2 w-full border p-2"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="mb-4 w-full border p-2"
              placeholder="내용"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditId(null)
                  setTitle('')
                  setContent('')
                }}
                className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                {editId !== null ? '수정 완료' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
