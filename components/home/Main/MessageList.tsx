import { SiOpenai } from 'react-icons/si'
import Markdown from '@/components/common/Markdown'
import { useAppContext } from '@/components/AppContext'
import { ActionType } from '@/reducers/AppReducers'
import { useEffect } from 'react'

export default function MessageList() {
  const {
    state: { messageList, streamingId, selectedChat },
    dispatch,
  } = useAppContext()

  async function fetchMessageList(chatId: string) {
    const response = await fetch(`/api/message/list?chatId=${chatId}`)
    if (!response.ok) {
      console.error(response.statusText)
      return
    }
    const { data } = await response.json()
    dispatch({
      type: ActionType.UPDATE,
      field: 'messageList',
      value: [...data.list],
    })
  }

  useEffect(() => {
    if (selectedChat) {
      fetchMessageList(selectedChat.id)
    } else {
      dispatch({
        type: ActionType.UPDATE,
        field: 'messageList',
        value: [],
      })
    }
  }, [selectedChat])

  return (
    <div className="w-full pt-10 pb-48 dark:text-gray-300">
      <ul>
        {messageList.map((item) => {
          const isUser = item.role === 'user'
          return (
            <li
              key={item.id}
              className={`${isUser ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <div className="w-full max-w-4xl mx-auto flex space-x-6 px-4 py-6 text-lg">
                <div
                  className={`${isUser ? 'translate-x-[-5px]' : ''} text-3xl leading-[1] w-[30px]`}
                >
                  {isUser ? '😎' : <SiOpenai />}
                </div>
                <div className="flex-1">
                  <Markdown>{`${item.content}${streamingId == item.id ? '|' : ''}`}</Markdown>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
