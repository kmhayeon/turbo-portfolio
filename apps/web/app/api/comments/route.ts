import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { postId, content } = body

    if (!postId || !content) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        content,
      },
    })

    return NextResponse.json(comment)
  } catch (err) {
    console.error('댓글 등록 오류:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
