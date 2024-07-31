import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const chatId = request.nextUrl.searchParams.get('chatId')
  if (!chatId) {
    return NextResponse.json({ code: -1, message: 'Param error: id' })
  }

  const list = await prisma.message.findMany({
    where: {
      chatId: chatId,
    },
    orderBy: {
      createTime: 'asc',
    },
  })
  console.log(list)

  return NextResponse.json({ code: 0, data: { list } })
}
