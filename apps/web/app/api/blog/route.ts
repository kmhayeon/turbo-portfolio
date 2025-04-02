import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const { title, content } = await req.json()
  const newPost = await prisma.blogPost.create({
    data: { title, content },
  })
  return NextResponse.json(newPost, { status: 201 })
}
