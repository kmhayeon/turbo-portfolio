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

export async function DELETE(req: NextRequest) {
  const commentId = req.nextUrl.pathname.split('/').pop()

  if (!commentId) {
    return NextResponse.json({ error: 'No commentId provided' }, { status: 400 })
  }

  try {
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    })

    return NextResponse.json({ message: '댓글 삭제 완료' })
  } catch (error) {
    return NextResponse.json({ error: '댓글 삭제 실패' }, { status: 500 })
  }
}
