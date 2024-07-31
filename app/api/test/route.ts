import { NextRequest, NextResponse } from 'next/server'

export async function GET(requeest: NextRequest) {
  const { url } = requeest
  return NextResponse.json({ url })
}
