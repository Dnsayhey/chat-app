import { sleep } from '@/common/utils'
import { MessageRequestBody } from '@/types/chat'
import { NextRequest, NextResponse } from 'next/server'

import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: 'test', // This is the default and can be omitted
  baseURL: 'https://api.deepseek.com',
})

export async function POST(request: NextRequest) {
  const { messages } = (await request.json()) as MessageRequestBody
  // test
  const _stream = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' },
    ],
    stream: true,
  })
  for await (const chunk of _stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '')
  }
  // test
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const messageText = messages[messages.length - 1].content
      for (let i = 0; i < messageText.length; i++) {
        await sleep(100)
        controller.enqueue(encoder.encode(messageText[i]))
      }
      controller.close()
    },
  })

  return new Response(stream)
}
