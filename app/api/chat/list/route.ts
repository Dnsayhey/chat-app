import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get('page')
  const page = pageParam ? parseInt(pageParam) : 1

  const list = await prisma.chat.findMany({
    skip: (page - 1) * 20,
    take: 20,
    orderBy: {
      updateTime: 'desc',
    },
  })
  console.log(list)

  return NextResponse.json({ code: 0, data: { list } })
}
