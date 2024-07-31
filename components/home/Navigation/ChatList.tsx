import { useState, useMemo, useEffect, useRef } from 'react'
import { generateChatList, groupByDate } from '@/common/utils'
import { Chat } from '@/types/chat'
import ChatItem from './ChatItem'
import { useEventBusContext } from '@/components/EventBusContext'
import { useAppContext } from '@/components/AppContext'
import { ActionType } from '@/reducers/AppReducers'

export default function ChatList() {
  const [chatList, setChatList] = useState<Chat[]>([])
  const {
    state: { selectedChat },
    dispatch,
  } = useAppContext()
  const groupList = useMemo(() => {
    return groupByDate(chatList)
  }, [chatList])

  const { subscribe, unsubscribe } = useEventBusContext()
  const pageRef = useRef(1)

  async function fetchChatList() {
    const response = await fetch(`/api/chat/list?page=${pageRef.current}`, {
      method: 'GET',
    })

    if (!response.ok) {
      console.error(response.statusText)
      return
    }

    const { data } = await response.json()
    if (pageRef.current === 1) {
      setChatList([...data.list])
    } else {
      setChatList((list) => list.concat(data.list))
    }
  }

  useEffect(() => {
    fetchChatList()
  }, [])

  useEffect(() => {
    const callback: EventListener = () => {
      pageRef.current = 1
      fetchChatList()
    }
    subscribe('fetchChatList', callback)
    return () => unsubscribe('fetchChatList', callback)
  }, [])

  return (
    <div className="flex1 mb-[48px] mt-2 flex flex-col overflow-y-auto">
      {groupList.map(([date, list]) => {
        return (
          <div key={date}>
            <div className="sticky top-0 z-10 p-3 text-sm bg-gray-900 text-gray-500">
              {date}
            </div>
            <ul>
              {list.map((item) => {
                return (
                  <ChatItem
                    key={item.id}
                    item={item}
                    selected={selectedChat?.id === item.id}
                    onSelected={(chat) => {
                      dispatch({
                        type: ActionType.UPDATE,
                        field: 'selectedChat',
                        value: chat,
                      })
                    }}
                  />
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
