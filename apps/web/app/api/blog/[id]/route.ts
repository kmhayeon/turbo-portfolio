import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, context: Params) {
  const { id } = await context.params

  const post = await prisma.blogPost.findUnique({
    where: { id: Number(id) },
  })

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, context: Params) {
  const { id } = await context.params
  const { title, content } = await req.json()

  const updated = await prisma.blogPost.update({
    where: { id: Number(id) },
    data: { title, content },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, context: Params) {
  const { id } = await context.params

  try {
    await prisma.blogPost.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ message: '삭제 완료' })
  } catch (error) {
    return NextResponse.json({ error: '삭제 중 오류 발생' }, { status: 500 })
  }
}
