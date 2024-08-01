import { MessageRequestBody } from '@/types/chat'
import { NextRequest } from 'next/server'
import client from '@/lib/openai'

export async function POST(request: NextRequest) {
  const { messages, model } = (await request.json()) as MessageRequestBody
  const messages_role_content = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }))

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const _stream = await client.chat.completions.create({
        model: model,
        messages: messages_role_content,
        stream: true,
      })
      for await (const chunk of _stream) {
        controller.enqueue(
          encoder.encode(chunk.choices[0]?.delta?.content || ''),
        )
      }
      controller.close()
    },
  })

  return new Response(stream)
}
