import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  const postId = Number(params.postId)

  const comments = await prisma.comment.findMany({
    where: { postId },
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
