'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, X, Pencil } from 'lucide-react'

type BlogPost = {
  id: number
  title: string
  content: string
}

type Comment = {
  id: number
  postId: number
  content: string
  createdAt: string
}

export default function BlogDetailPage(props: any) {
  const { id } = use(props.params) as { id: string }
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const router = useRouter()

  // 게시글 불러오기
  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((res) => res.json())
      .then((data: BlogPost) => {
        setPost(data)
        setEditTitle(data.title)
        setEditContent(data.content)
      })
  }, [id])

  // 댓글 불러오기
  useEffect(() => {
    fetch(`/api/comments/${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
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

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: Number(id), content: newComment }),
    })

    const created = await res.json()
    setComments((prev) => [...prev, created])
    setNewComment('')
  }

  if (!post)
    return (
      <section className="mx-auto w-full max-w-6xl border-t px-4 py-12 sm:px-6 md:px-8 lg:px-12">
        <p className="p-4">불러오는 중...</p>
      </section>
    )

  return (
    <section className="mx-auto w-full max-w-6xl border-t px-4 py-12 sm:px-6 md:px-8 lg:px-12">
      {isEditing ? (
        <div className="space-y-4">
          <input
            className="w-full border p-2 text-xl font-semibold"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className="h-[350px] w-full border p-2"
            rows={6}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
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
                className="flex items-center gap-1 rounded-[4px] border border-gray-300 px-2 py-2 text-sm hover:bg-gray-100"
              >
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-2xl font-bold">{post.title}</h1>
            </div>

            <button
              title="수정"
              onClick={handleEdit}
              className="px-4 py-2 text-sm text-gray-900 hover:text-gray-700"
            >
              <Pencil size={18} />
            </button>
          </div>

          <p className="h-[350px] overflow-y-auto whitespace-pre-wrap break-words pr-2">
            {post.content}
          </p>
        </div>
      )}

      {!isEditing && (
        <>
          <hr className="my-8" />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">댓글</h2>

            <div className="flex flex-col gap-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="relative rounded border border-gray-200 p-3 text-sm shadow-sm"
                >
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  <button
                    title="댓글 삭제"
                    onClick={async () => {
                      const confirmed = window.confirm('댓글을 삭제하시겠습니까?')
                      if (!confirmed) return

                      const res = await fetch(`/api/comments/${comment.id}`, { method: 'DELETE' })

                      if (res.ok) {
                        setComments((prev) => prev.filter((c) => c.id !== comment.id))
                        setToastMsg('댓글이 삭제되었습니다.')
                        setTimeout(() => setToastMsg(''), 2000)
                      }
                    }}
                    className="absolute right-2 top-2 text-xs text-red-500 hover:underline"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <textarea
                className="w-full rounded border p-2"
                placeholder="댓글을 입력하세요"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleCommentSubmit}
                  className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  댓글 등록
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {toastMsg && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded bg-gray-800 px-4 py-2 text-sm text-white shadow">
          {toastMsg}
        </div>
      )}
    </section>
  )
}
