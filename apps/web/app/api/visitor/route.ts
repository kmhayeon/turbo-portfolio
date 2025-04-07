import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const data = await prisma.visitorCount.findUnique({
    where: { id: 1 },
  })

  return NextResponse.json({ count: data?.count ?? 0 })
}

export async function POST() {
  const updated = await prisma.visitorCount.upsert({
    where: { id: 1 },
    update: { count: { increment: 1 } },
    create: { id: 1, count: 1 },
  })

  return NextResponse.json({ count: updated.count })
}
