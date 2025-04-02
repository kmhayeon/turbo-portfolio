'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

type BlogPost = {
  id: number
  title: string
  content: string
}

export default function BlogDetailPage(props: any) {
  const { id } = use(props.params) as { id: string }
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((res) => res.json())
      .then((data: BlogPost) => {
        setPost(data)
        setEditTitle(data.title)
        setEditContent(data.content)
      })
  }, [id])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (post) {
      setEditTitle(post.title)
      setEditContent(post.content)
    }
  }

  const handleSave = async () => {
    const res = await fetch(`/api/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    })

    const updated = await res.json()
    setPost(updated)
    setIsEditing(false)

    router.refresh()
  }

  if (!post) return <p className="p-4">불러오는 중...</p>

  return (
    <div className="px-4 py-8">
      {isEditing ? (
        <div className="space-y-4">
          <input
            className="w-full border p-2 text-xl font-semibold"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className="w-full border p-2"
            rows={6}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1 rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
              >
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-2xl font-bold">{post.title}</h1>
            </div>

            <button
              onClick={handleEdit}
              className="rounded bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
            >
              수정
            </button>
          </div>

          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      )}
    </div>
  )
}
