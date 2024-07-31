import Button from '@/components/common/Button'
import { MdRefresh } from 'react-icons/md'
import { PiLightningFill, PiStopBold } from 'react-icons/pi'
import { FiSend } from 'react-icons/fi'
import TextAreaAutoSize from 'react-textarea-autosize'
import { useRef, useState } from 'react'
import { Message, MessageRequestBody } from '@/types/chat'
import { useAppContext } from '@/components/AppContext'
import { ActionType } from '@/reducers/AppReducers'
import { useEventBusContext } from '@/components/EventBusContext'

export default function ChatInput() {
  const [messageText, setMessageText] = useState('')
  const {
    state: { messageList, selectedModel, streamingId },
    dispatch,
  } = useAppContext()
  const stopRef = useRef(false)
  const chatIdRef = useRef('')
  const { publish } = useEventBusContext()

  async function createOrUpdateMessage(message: Message) {
    const response = await fetch('/api/message/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      console.error(response.statusText)
      return
    }

    const { data } = await response.json()
    if (!chatIdRef.current) {
      chatIdRef.current = data.message.chatId
      publish('fetchChatList', 'hello')
    }
    return data.message
  }

  async function deleteMessage(id: string) {
    const response = await fetch(`/api/message/delete?id=${id}`, {
      method: 'POST',
    })

    if (!response.ok) {
      console.error(response.statusText)
      return
    }

    const { code } = await response.json()
    return code === 0
  }

  async function doSend(messages: Message[]) {
    const body: MessageRequestBody = {
      messages: messages,
      model: selectedModel,
    }

    const controller = new AbortController()
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error(response.statusText)
      return
    }

    if (!response.body) {
      console.error('body error')
      return
    }
    const responseMessage: Message = await createOrUpdateMessage({
      id: '',
      role: 'assistant',
      content: '',
      chatId: chatIdRef.current,
    })
    dispatch({
      type: ActionType.ADD_MESSAGE,
      message: { ...responseMessage },
    })

    dispatch({
      type: ActionType.UPDATE,
      field: 'streamingId',
      value: responseMessage.id,
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let done = false
    let content = ''
    while (!done) {
      if (stopRef.current) {
        stopRef.current = false
        controller.abort()
        break
      }
      const result = await reader.read()
      done = result.done
      const chunk = decoder.decode(result?.value)
      content += chunk
      dispatch({
        type: ActionType.UPDATE_MESSAGE,
        message: { ...responseMessage, content },
      })
    }
    await createOrUpdateMessage({
      ...responseMessage,
      content,
    })
    dispatch({
      type: ActionType.UPDATE,
      field: 'streamingId',
      value: '',
    })
  }

  async function send() {
    const message: Message = await createOrUpdateMessage({
      id: '',
      role: 'user',
      content: messageText,
      chatId: chatIdRef.current,
    })
    const messages = messageList.concat([message])
    dispatch({
      type: ActionType.ADD_MESSAGE,
      message: message,
    })
    setMessageText('')

    doSend(messages)
  }

  async function reSend() {
    const messages = [...messageList]
    const len = messages.length
    if (len > 0 && messages[len - 1].role === 'assistant') {
      console.log(messages[len - 1])
      if (!(await deleteMessage(messages[len - 1].id))) {
        console.error('delete error')
        return
      }
      dispatch({
        type: ActionType.REMOVE_MESSAGE,
        message: messages[len - 1],
      })
      messages.splice(len - 1, 1)

      doSend(messages)
    }
  }

  return (
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] to-[54.73%] pt-10 dark:from-[rgba(53,55,64,0)] dark:to-[#353740] dark:to-[58.85%]">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-4">
        {messageList.length !== 0 &&
          (streamingId !== '' ? (
            <Button
              icon={PiStopBold}
              variant="primary"
              className="font-medium"
              onClick={() => {
                stopRef.current = true
              }}
            >
              停止生成
            </Button>
          ) : (
            <Button
              icon={MdRefresh}
              variant="primary"
              className="font-medium"
              onClick={() => {
                reSend()
              }}
            >
              重新生成
            </Button>
          ))}
        <div className="flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-4">
          <div className="mx-3 mb-2.5">
            <PiLightningFill />
          </div>
          <TextAreaAutoSize
            placeholder="请输入一条消息..."
            rows={1}
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value)
            }}
            className="flex-1 max-h-64 mb-1.5 bg-transparent text-black dark:text-white resize-none border-0 outline-none"
          />
          <Button
            icon={FiSend}
            variant="primary"
            onClick={send}
            disabled={messageText.trim() === '' || streamingId !== ''}
            className="mx-3 !rounded-lg"
          />
        </div>
        <footer className="text-center text-sm text-gray-700 dark:text-gray-300 px-4 pb-6">
          &copy; {new Date().getFullYear()}&nbsp;
          <a
            href="https://github.com/Dnsayhey/chat-app"
            target="_blank"
            className="font-medium py-[1px] border-b border-dotted border-black/60 hover:border-black/0 dark:border-gray-200 dark:hover:border:-gray-200/0 animated-underline"
          >
            ChatApp
          </a>
        </footer>
      </div>
    </div>
  )
}
