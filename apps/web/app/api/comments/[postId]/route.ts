import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const postId = url.pathname.split('/').pop()

  if (!postId) {
    return NextResponse.json({ error: 'No postId provided' }, { status: 400 })
  }

  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(comments)
}

export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  const commentId = Number(params.postId)

  try {
    await prisma.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ message: '삭제 완료' })
  } catch (err) {
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 })
  }
}
