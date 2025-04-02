import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: Number(params.id) } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, content } = await req.json()
  const updated = await prisma.blogPost.update({
    where: { id: Number(params.id) },
    data: { title, content },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.blogPost.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ message: '삭제 완료' })
}
