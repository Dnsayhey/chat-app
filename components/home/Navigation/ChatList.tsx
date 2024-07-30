import { useState, useMemo } from 'react'
import { generateChatList, groupByDate } from '@/common/utils'
import { Chat } from '@/types/chat'
import ChatItem from './ChatItem'

export default function ChatList() {
  const [chatList, setChatList] = useState<Chat[]>(generateChatList(20))

  const [selectedChat, setSelectedChat] = useState<Chat>()
  const groupList = useMemo(() => {
    return groupByDate(chatList)
  }, [chatList])

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
                      setSelectedChat(chat)
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
