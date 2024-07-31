import { useState, useMemo, useEffect, useRef } from 'react'
import { groupByDate } from '@/common/utils'
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
  const loadMoreRef = useRef(null)
  const hasMore = useRef(false)
  const loadingRef = useRef(false)

  async function fetchChatList() {
    if (loadingRef.current) {
      return
    }
    loadingRef.current = true
    const response = await fetch(`/api/chat/list?page=${pageRef.current}`, {
      method: 'GET',
    })

    if (!response.ok) {
      console.error(response.statusText)
      loadingRef.current = false
      return
    }
    const { data } = await response.json()
    hasMore.current = data.hasMore
    if (pageRef.current === 1) {
      setChatList([...data.list])
    } else {
      setChatList((list) => list.concat(data.list))
    }
    loadingRef.current = false
  }

  useEffect(() => {
    fetchChatList()
  }, [])

  useEffect(() => {
    const callback: EventListener = () => {
      // todo
      pageRef.current = 1
      fetchChatList()
    }
    subscribe('fetchChatList', callback)
    return () => unsubscribe('fetchChatList', callback)
  }, [])

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let div = loadMoreRef.current
    if (div) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (hasMore.current) {
            pageRef.current++
            fetchChatList()
          }
        }
      })
      observer.observe(div)
    }
    return () => {
      if (observer && div) {
        observer.unobserve(div)
      }
    }
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
      <div ref={loadMoreRef}>&nbsp;</div>
    </div>
  )
}
